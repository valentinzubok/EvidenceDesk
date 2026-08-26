# { "Depends": "py-genlayer:15qfivjvy80800rh998pcxmd2m8va1wq2qzqhz850n8ggcr4i9q0" }

from genlayer import *
import json

# EvidenceSnapshot — freeze web evidence at dispute open (URL rot mitigation).
# Copyright (c) 2026 Valentyn Zubok. MIT License.
#
# Studio runtime (genlayer.std): use get_webpage + eq_principle_strict_eq.

PREVIEW_CHARS = 280
MAX_URLS = 8


def _normalize(text: str) -> str:
    return " ".join(str(text).split())


def _hash_text(text: str) -> str:
    h = 2166136261
    for ch in text:
        h ^= ord(ch)
        h = (h * 16777619) & 0xFFFFFFFF
    return hex(h)[2:].zfill(8)


def _capture_urls(urls: list) -> str:
    items = []
    for url in urls:
        entry = {
            "url": url,
            "content_hash": "",
            "preview": "",
            "byte_len": 0,
            "status": "error",
        }
        try:
            raw = gl.get_webpage(url, mode="text")
            if raw is None or str(raw).strip() == "":
                raw = gl.get_webpage(url, mode="html")
            normalized = _normalize(raw if raw is not None else "")
            if normalized == "":
                entry["status"] = "empty"
            else:
                entry["content_hash"] = _hash_text(normalized)
                entry["preview"] = normalized[:PREVIEW_CHARS]
                entry["byte_len"] = len(normalized)
                entry["status"] = "ok"
        except Exception as exc:
            entry["preview"] = str(exc)[:120]
            entry["status"] = "error"
        items.append(entry)
    return json.dumps({"items": items}, sort_keys=True, separators=(",", ":"))


def _parse_urls(urls_json: str) -> list:
    try:
        parsed = json.loads(urls_json)
    except Exception:
        raise Exception("urls_json must be a JSON array of URL strings")
    if not isinstance(parsed, list) or len(parsed) == 0:
        raise Exception("provide at least one URL")
    if len(parsed) > MAX_URLS:
        raise Exception("max 8 URLs per case")
    urls = []
    for u in parsed:
        if not isinstance(u, str) or not u.startswith("https://"):
            raise Exception("each URL must be an https:// string")
        urls.append(u)
    return urls


class EvidenceSnapshot(gl.Contract):
    owner: str
    cases_json: str
    case_order_json: str

    def __init__(self, owner_address: str):
        if not owner_address or not str(owner_address).startswith("0x"):
            raise Exception("owner_address must be a 0x address")
        self.owner = str(owner_address)
        self.cases_json = "{}"
        self.case_order_json = "[]"

    def _load_cases(self):
        return json.loads(self.cases_json)

    def _save_cases(self, cases):
        self.cases_json = json.dumps(cases, sort_keys=True, separators=(",", ":"))

    def _load_order(self):
        return json.loads(self.case_order_json)

    def _save_order(self, order):
        self.case_order_json = json.dumps(order, separators=(",", ":"))

    @gl.public.write
    def open_case(self, case_id: str, urls_json: str) -> None:
        if not case_id or len(case_id) > 64:
            raise Exception("case_id required (max 64 chars)")

        cases = self._load_cases()
        if case_id in cases:
            raise Exception("case_id already exists")

        urls = _parse_urls(urls_json)

        def leader_fn() -> str:
            return _capture_urls(urls)

        # Studio std API: top-level eq_principle_strict_eq (not eq_principles.strict_eq)
        snapshot_json = gl.eq_principle_strict_eq(leader_fn)

        payload = json.loads(snapshot_json)
        items = payload.get("items", [])
        if len(items) != len(urls):
            raise Exception("snapshot item count mismatch")

        any_ok = any(i.get("status") == "ok" for i in items)
        cases[case_id] = {
            "case_id": case_id,
            "opener": str(gl.message.sender_address),
            "urls": urls,
            "items": items,
            "tampered": False,
            "last_check_matches": True,
            "last_check_json": "",
            "checks": 0,
            "has_ok_snapshot": any_ok,
        }
        self._save_cases(cases)

        order = self._load_order()
        order.append(case_id)
        self._save_order(order)

    @gl.public.write
    def cross_check(self, case_id: str) -> None:
        cases = self._load_cases()
        if case_id not in cases:
            raise Exception("unknown case_id")

        case = cases[case_id]
        urls = case["urls"]
        frozen = {i["url"]: i for i in case["items"]}

        def leader_fn() -> str:
            live_json = _capture_urls(urls)
            live = json.loads(live_json)["items"]
            report = []
            all_match = True
            for item in live:
                url = item["url"]
                prev = frozen.get(url, {})
                match = (
                    item.get("status") == prev.get("status")
                    and item.get("content_hash") == prev.get("content_hash")
                )
                if not match:
                    all_match = False
                report.append(
                    {
                        "url": url,
                        "frozen_hash": prev.get("content_hash", ""),
                        "live_hash": item.get("content_hash", ""),
                        "frozen_status": prev.get("status", ""),
                        "live_status": item.get("status", ""),
                        "matches": match,
                    }
                )
            return json.dumps(
                {"all_match": all_match, "report": report},
                sort_keys=True,
                separators=(",", ":"),
            )

        check_json = gl.eq_principle_strict_eq(leader_fn)

        check = json.loads(check_json)
        matches = bool(check.get("all_match"))
        case["last_check_matches"] = matches
        case["last_check_json"] = check_json
        case["checks"] = int(case.get("checks", 0)) + 1
        if not matches:
            case["tampered"] = True
        cases[case_id] = case
        self._save_cases(cases)

    @gl.public.view
    def get_case(self, case_id: str) -> str:
        cases = self._load_cases()
        if case_id not in cases:
            return json.dumps({"error": "unknown case_id"})
        return json.dumps(cases[case_id], sort_keys=True)

    @gl.public.view
    def get_tamper_flag(self, case_id: str) -> bool:
        cases = self._load_cases()
        if case_id not in cases:
            return False
        return bool(cases[case_id].get("tampered", False))

    @gl.public.view
    def list_cases(self) -> str:
        return self.case_order_json

    @gl.public.view
    def get_owner(self) -> str:
        return self.owner

    @gl.public.view
    def get_stats(self) -> str:
        cases = self._load_cases()
        total = len(cases)
        tampered = sum(1 for c in cases.values() if c.get("tampered"))
        return json.dumps(
            {"cases": total, "tampered": tampered, "clean": total - tampered},
            separators=(",", ":"),
        )
