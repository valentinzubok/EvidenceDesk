# { "Depends": "py-genlayer:15qfivjvy80800rh998pcxmd2m8va1wq2qzqhz850n8ggcr4i9q0" }

from genlayer import *
import json

# PromptRegistry — shared eq_principle criteria templates for GenLayer builders.
# Copyright (c) 2026 Valentyn Zubok. MIT License.
#
# Studio runtime (genlayer.std): pure state registry, no web fetch required.

MAX_ID_LEN = 64
MAX_TITLE_LEN = 120
MAX_BODY_LEN = 4000
MAX_TAGS = 8
MAX_TAG_LEN = 32
MAX_PAGE = 50
MAX_EVENTS = 200


def _normalize_id(criteria_id: str) -> str:
    cid = str(criteria_id).strip().lower()
    if not cid or len(cid) > MAX_ID_LEN:
        raise Exception("criteria_id обов'язковий (макс. 64 символи)")
    for ch in cid:
        ok = (
            ("a" <= ch <= "z")
            or ("0" <= ch <= "9")
            or ch in "-_/."
        )
        if not ok:
            raise Exception("criteria_id: лише a-z, 0-9, -, _, /, . (напр. v1/escrow-strict)")
    return cid


def _parse_tags(tags_json: str) -> list:
    try:
        parsed = json.loads(tags_json)
    except Exception:
        raise Exception('tags_json — JSON-масив рядків (напр. "[\\"escrow\\",\\"strict\\"]")')
    if not isinstance(parsed, list):
        raise Exception("tags_json має бути JSON-масивом рядків")
    if len(parsed) > MAX_TAGS:
        raise Exception("макс. 8 тегів на шаблон")
    tags = []
    seen = set()
    for t in parsed:
        if not isinstance(t, str):
            raise Exception("кожен тег має бути рядком")
        tag = t.strip().lower()
        if not tag or len(tag) > MAX_TAG_LEN:
            raise Exception("тег порожній або занадто довгий (макс. 32 символи)")
        if tag in seen:
            continue
        seen.add(tag)
        tags.append(tag)
    return tags


def _parse_page(offset: str, limit: str) -> tuple:
    try:
        off = int(str(offset).strip())
    except Exception:
        off = 0
    try:
        lim = int(str(limit).strip())
    except Exception:
        lim = 10
    if off < 0:
        off = 0
    if lim < 1:
        lim = 1
    if lim > MAX_PAGE:
        lim = MAX_PAGE
    return off, lim


class PromptRegistry(gl.Contract):
    owner: str
    entries_json: str
    order_json: str
    votes_json: str
    events_json: str

    def __init__(self, owner_address: str):
        if not owner_address or not str(owner_address).startswith("0x"):
            raise Exception("owner_address має бути адресою 0x")
        self.owner = str(owner_address)
        self.entries_json = "{}"
        self.order_json = "[]"
        self.votes_json = "{}"
        self.events_json = "[]"

    def _load_entries(self):
        return json.loads(self.entries_json)

    def _save_entries(self, entries):
        self.entries_json = json.dumps(entries, sort_keys=True, separators=(",", ":"))

    def _load_order(self):
        return json.loads(self.order_json)

    def _save_order(self, order):
        self.order_json = json.dumps(order, separators=(",", ":"))

    def _load_votes(self):
        return json.loads(self.votes_json)

    def _save_votes(self, votes):
        self.votes_json = json.dumps(votes, sort_keys=True, separators=(",", ":"))

    def _load_events(self):
        return json.loads(self.events_json)

    def _save_events(self, events):
        self.events_json = json.dumps(events, separators=(",", ":"))

    def _append_event(self, kind: str, payload: dict) -> None:
        events = self._load_events()
        events.append({"kind": kind, **payload})
        if len(events) > MAX_EVENTS:
            events = events[-MAX_EVENTS:]
        self._save_events(events)

    @gl.public.write
    def publish(self, criteria_id: str, title: str, body: str, tags_json: str) -> None:
        cid = _normalize_id(criteria_id)
        title_s = str(title).strip()
        body_s = str(body).strip()
        if not title_s or len(title_s) > MAX_TITLE_LEN:
            raise Exception("title обов'язковий (макс. 120 символів)")
        if not body_s or len(body_s) > MAX_BODY_LEN:
            raise Exception("body обов'язковий (макс. 4000 символів, ~1 KB тексту)")

        entries = self._load_entries()
        if cid in entries:
            raise Exception("criteria_id вже існує — оберіть новий id або оновіть існуючий")

        tags = _parse_tags(tags_json)
        sender = str(gl.message.sender_address)
        entries[cid] = {
            "id": cid,
            "title": title_s,
            "body": body_s,
            "tags": tags,
            "publisher": sender,
            "deprecated": False,
            "upvotes": 0,
            "downvotes": 0,
            "score": 0,
            "uses": 0,
            "version": 1,
        }
        self._save_entries(entries)

        order = self._load_order()
        order.append(cid)
        self._save_order(order)

        self._append_event("Publish", {"id": cid, "publisher": sender})

    @gl.public.write
    def update(self, criteria_id: str, title: str, body: str, tags_json: str) -> None:
        cid = _normalize_id(criteria_id)
        entries = self._load_entries()
        if cid not in entries:
            raise Exception("невідомий criteria_id")

        entry = entries[cid]
        sender = str(gl.message.sender_address)
        if sender != entry["publisher"] and sender != self.owner:
            raise Exception("лише publisher або owner можуть оновлювати")

        title_s = str(title).strip()
        body_s = str(body).strip()
        if not title_s or len(title_s) > MAX_TITLE_LEN:
            raise Exception("title обов'язковий (макс. 120 символів)")
        if not body_s or len(body_s) > MAX_BODY_LEN:
            raise Exception("body обов'язковий (макс. 4000 символів, ~1 KB тексту)")

        entry["title"] = title_s
        entry["body"] = body_s
        entry["tags"] = _parse_tags(tags_json)
        entry["version"] = int(entry.get("version", 1)) + 1
        entry["deprecated"] = False
        entries[cid] = entry
        self._save_entries(entries)

        self._append_event("Update", {"id": cid, "publisher": sender})

    @gl.public.write
    def deprecate(self, criteria_id: str) -> None:
        """Soft-retire: hides from top/list_by_tag/get_body; entry stays for audit via get()."""
        cid = _normalize_id(criteria_id)
        entries = self._load_entries()
        if cid not in entries:
            raise Exception("невідомий criteria_id")

        entry = entries[cid]
        sender = str(gl.message.sender_address)
        if sender != entry["publisher"] and sender != self.owner:
            raise Exception("лише publisher або owner можуть deprecate")

        entry["deprecated"] = True
        entries[cid] = entry
        self._save_entries(entries)

        self._append_event("Deprecate", {"id": cid, "publisher": sender})

    @gl.public.write
    def vote(self, criteria_id: str, direction: str) -> None:
        # One vote per address: repeat call with same direction removes the vote;
        # switching direction updates it. This is intentional (no spam cooldown in v1).
        cid = _normalize_id(criteria_id)
        d = str(direction).strip().lower()
        if d not in ("up", "down"):
            raise Exception("Напрямок голосу має бути 'up' або 'down'")

        entries = self._load_entries()
        if cid not in entries:
            raise Exception("невідомий criteria_id")
        if entries[cid].get("deprecated"):
            raise Exception("не можна голосувати за deprecated criteria")

        sender = str(gl.message.sender_address)
        votes = self._load_votes()
        key = cid + "|" + sender
        prev = votes.get(key)

        entry = entries[cid]
        if prev == "up":
            entry["upvotes"] = int(entry["upvotes"]) - 1
        elif prev == "down":
            entry["downvotes"] = int(entry["downvotes"]) - 1

        if prev == d:
            votes.pop(key, None)
        else:
            votes[key] = d
            if d == "up":
                entry["upvotes"] = int(entry["upvotes"]) + 1
            else:
                entry["downvotes"] = int(entry["downvotes"]) + 1

        entry["score"] = int(entry["upvotes"]) - int(entry["downvotes"])
        entries[cid] = entry
        self._save_entries(entries)
        self._save_votes(votes)

        self._append_event("Vote", {"id": cid, "voter": sender, "direction": d})

    @gl.public.write
    def record_use(self, criteria_id: str) -> None:
        """Optional telemetry — not required for adoption."""
        cid = _normalize_id(criteria_id)
        entries = self._load_entries()
        if cid not in entries:
            raise Exception("невідомий criteria_id")
        entry = entries[cid]
        if entry.get("deprecated"):
            raise Exception("criteria deprecated")
        entry["uses"] = int(entry.get("uses", 0)) + 1
        entries[cid] = entry
        self._save_entries(entries)

    @gl.public.write
    def prune_deprecated(self) -> None:
        """Owner-only: permanently remove deprecated entries from state (audit log kept in events)."""
        sender = str(gl.message.sender_address)
        if sender != self.owner:
            raise Exception("лише owner може prune deprecated entries")

        entries = self._load_entries()
        order = self._load_order()
        votes = self._load_votes()

        removed = []
        for cid, entry in list(entries.items()):
            if entry.get("deprecated"):
                removed.append(cid)
                del entries[cid]

        if not removed:
            return

        order = [cid for cid in order if cid not in removed]
        for cid in removed:
            prefix = cid + "|"
            votes = {k: v for k, v in votes.items() if not k.startswith(prefix)}

        self._save_entries(entries)
        self._save_order(order)
        self._save_votes(votes)
        self._append_event("Prune", {"ids": removed, "count": len(removed)})

    @gl.public.view
    def get(self, criteria_id: str) -> str:
        cid = _normalize_id(criteria_id)
        entries = self._load_entries()
        if cid not in entries:
            return json.dumps({"error": "unknown criteria_id"})
        return json.dumps(entries[cid], sort_keys=True)

    @gl.public.view
    def get_body(self, criteria_id: str) -> str:
        """Return only the criteria text — ready to paste into eq_principle calls."""
        cid = _normalize_id(criteria_id)
        entries = self._load_entries()
        if cid not in entries:
            return ""
        entry = entries[cid]
        if entry.get("deprecated"):
            return ""
        return str(entry.get("body", ""))

    @gl.public.view
    def list_ids(self) -> str:
        return self.order_json

    @gl.public.view
    def list_by_tag(self, tag: str, offset: str, limit: str) -> str:
        t = str(tag).strip().lower()
        off, lim = _parse_page(offset, limit)
        entries = self._load_entries()
        order = self._load_order()
        matched = []
        for cid in order:
            entry = entries.get(cid)
            if not entry or entry.get("deprecated"):
                continue
            if t in entry.get("tags", []):
                matched.append(
                    {
                        "id": cid,
                        "title": entry["title"],
                        "score": entry["score"],
                        "uses": entry["uses"],
                    }
                )
        matched.sort(key=lambda x: (-int(x["score"]), -int(x["uses"]), x["id"]))
        page = matched[off : off + lim]
        return json.dumps(
            {"total": len(matched), "offset": off, "limit": lim, "items": page},
            separators=(",", ":"),
        )

    @gl.public.view
    def top(self, offset: str, limit: str) -> str:
        off, lim = _parse_page(offset, limit)
        entries = self._load_entries()
        rows = []
        for cid, entry in entries.items():
            if entry.get("deprecated"):
                continue
            rows.append(
                {
                    "id": cid,
                    "title": entry["title"],
                    "tags": entry["tags"],
                    "score": entry["score"],
                    "uses": entry["uses"],
                    "publisher": entry["publisher"],
                }
            )
        rows.sort(key=lambda x: (-int(x["score"]), -int(x["uses"]), x["id"]))
        page = rows[off : off + lim]
        return json.dumps(
            {"total": len(rows), "offset": off, "limit": lim, "items": page},
            separators=(",", ":"),
        )

    @gl.public.view
    def get_events(self, offset: str, limit: str) -> str:
        off, lim = _parse_page(offset, limit)
        events = self._load_events()
        page = events[off : off + lim]
        return json.dumps(
            {"total": len(events), "offset": off, "limit": lim, "items": page},
            separators=(",", ":"),
        )

    @gl.public.view
    def get_owner(self) -> str:
        return self.owner

    @gl.public.view
    def get_stats(self) -> str:
        entries = self._load_entries()
        total = len(entries)
        deprecated = sum(1 for e in entries.values() if e.get("deprecated"))
        active = total - deprecated
        uses = sum(int(e.get("uses", 0)) for e in entries.values())
        events = len(self._load_events())
        return json.dumps(
            {
                "total": total,
                "active": active,
                "deprecated": deprecated,
                "uses": uses,
                "events": events,
            },
            separators=(",", ":"),
        )
