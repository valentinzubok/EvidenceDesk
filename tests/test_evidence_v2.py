"""EvidenceSnapshot v2: freeze, hash drift, and the semantic verdict v1 could not give."""

import json
import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent))
from conftest import load_contract, reset  # noqa: E402

ROOT = Path(__file__).resolve().parents[1]
mod = load_contract(ROOT)
gl = sys.modules["genlayer"]

OWNER = "0x1111111111111111111111111111111111111111"
OTHER = "0x2222222222222222222222222222222222222222"

URL = "https://vendor.example/sla"
URL2 = "https://vendor.example/status"
QUESTION = "Does the vendor still promise 99.9% uptime with credits paid within 30 days?"
FROZEN = "Vendor SLA: 99.9% uptime, credits paid within 30 days. Contact support for claims."


def _case(urls=None, question=QUESTION):
    reset(gl)
    gl.page = FROZEN
    c = mod.EvidenceSnapshot(OWNER)
    c.open_case("case/sla", json.dumps(urls or [URL]), question)
    return c


# ── freezing ──────────────────────────────────────────────────────────────────


def test_open_case_freezes_whole_documents_and_fixes_the_question():
    c = _case()
    case = json.loads(c.get_case("case/sla"))
    assert case["status"] == "open" and case["drift"] == "no_drift"
    assert case["question"] == QUESTION
    item = case["items"][0]
    assert item["content_hash"] and item["total_chars"] == len(FROZEN)
    assert item["digest"]["excerpts"]  # bounded digest, not a 280-char preview
    assert json.loads(c.get_stats())["cases"] == 1


def test_open_case_validates_its_inputs():
    reset(gl)
    c = mod.EvidenceSnapshot(OWNER)
    with pytest.raises(Exception, match="question is required"):
        c.open_case("case/a", json.dumps([URL]), "   ")
    with pytest.raises(Exception, match="https://"):
        c.open_case("case/b", json.dumps(["http://vendor.example/sla"]), QUESTION)
    with pytest.raises(Exception, match="path segments"):
        c.open_case("case/c", json.dumps(["https://vendor.example/a/../b"]), QUESTION)
    with pytest.raises(Exception, match="at least one URL"):
        c.open_case("case/d", "[]", QUESTION)
    with pytest.raises(Exception, match="max 8 URLs"):
        c.open_case(
            "case/e", json.dumps([f"https://vendor.example/{i}" for i in range(9)]), QUESTION
        )
    gl.page = Exception("404")
    with pytest.raises(Exception, match="nothing to freeze"):
        c.open_case("case/f", json.dumps([URL]), QUESTION)


# ── cheap deterministic half ───────────────────────────────────────────────────


def test_cross_check_is_pure_arithmetic_with_no_model_spend():
    c = _case()
    gl.prompts.clear()
    c.cross_check("case/sla")
    case = json.loads(c.get_case("case/sla"))
    assert case["drift"] == "no_drift" and case["drifted_urls"] == []
    assert gl.prompts == []  # the expensive half never ran
    assert c.get_tamper_flag("case/sla") is False


def test_cross_check_records_per_url_drift():
    c = _case([URL, URL2])
    gl.page = {URL: FROZEN, URL2: "Status page, rewritten overnight."}
    c.cross_check("case/sla")
    case = json.loads(c.get_case("case/sla"))
    assert case["drifted_urls"] == [URL2]
    assert case["drift"] == "drift_unjudged"  # bytes changed; meaning not judged yet
    report = json.loads(case["last_check_json"])["report"]
    by_url = {r["url"]: r for r in report}
    assert by_url[URL]["matches"] is True
    assert by_url[URL2]["matches"] is False
    assert by_url[URL2]["frozen_hash"] != by_url[URL2]["live_hash"]
    assert c.get_tamper_flag("case/sla") is True


# ── the new capability: what does the drift mean? ─────────────────────────────


def test_a_cosmetic_edit_is_not_material():
    """v1 called this "tampered". v2 asks the network and gets a useful answer."""
    c = _case()
    gl.page = "Last reviewed 3 October 2026. " + FROZEN
    c.cross_check("case/sla")
    assert json.loads(c.get_case("case/sla"))["drift"] == "drift_unjudged"

    gl.llm_reply = '{"material": false}'
    c.adjudicate("case/sla")
    drift = json.loads(c.get_drift("case/sla"))
    assert drift["drift"] == "cosmetic_drift"
    assert drift["material_urls"] == []
    assert drift["adjudications"] == 1


def test_a_deleted_commitment_is_material():
    c = _case()
    gl.page = "Vendor SLA: uptime is provided on a best-effort basis. No credits are paid."
    c.cross_check("case/sla")
    gl.llm_reply = '{"material": true}'
    c.adjudicate("case/sla")
    drift = json.loads(c.get_drift("case/sla"))
    assert drift["drift"] == "material_drift"
    assert drift["material_urls"] == [URL]
    assert json.loads(c.get_stats())["material_drift"] == 1


def test_only_drifted_urls_are_judged():
    c = _case([URL, URL2])
    gl.page = {URL: FROZEN, URL2: "Status: all commitments withdrawn."}
    c.cross_check("case/sla")
    gl.prompts.clear()
    gl.llm_reply = '{"material": true}'
    c.adjudicate("case/sla")
    assert len(gl.prompts) == 1  # the unchanged URL cost nothing
    assert json.loads(c.get_drift("case/sla"))["material_urls"] == [URL2]


def test_adjudicate_needs_drift_first():
    c = _case()
    with pytest.raises(Exception, match="nothing to adjudicate"):
        c.adjudicate("case/sla")
    c.cross_check("case/sla")
    with pytest.raises(Exception, match="nothing to adjudicate"):
        c.adjudicate("case/sla")


def test_unreadable_evidence_is_escalated_not_called_cosmetic():
    c = _case()
    gl.page = Exception("connection reset")
    c.cross_check("case/sla")
    case = json.loads(c.get_case("case/sla"))
    assert case["drift"] == "evidence_unreachable"
    assert case["drifted_urls"] == [URL]

    gl.llm_reply = '{"material": false}'  # the model is not even asked
    gl.prompts.clear()
    c.adjudicate("case/sla")
    drift = json.loads(c.get_drift("case/sla"))
    assert drift["drift"] == "material_drift" and drift["material_urls"] == [URL]
    assert gl.prompts == []


# ── access control and lifecycle ──────────────────────────────────────────────


def test_close_case_is_opener_or_owner_only_and_stops_checks():
    c = _case()
    gl.message.sender_address = OTHER
    with pytest.raises(Exception, match="only the case opener or the owner"):
        c.close_case("case/sla")
    gl.message.sender_address = OWNER
    c.close_case("case/sla")
    assert json.loads(c.get_case("case/sla"))["status"] == "closed"
    with pytest.raises(Exception, match="case is closed"):
        c.cross_check("case/sla")
    with pytest.raises(Exception, match="case is closed"):
        c.adjudicate("case/sla")


def test_duplicate_case_and_unknown_case():
    c = _case()
    with pytest.raises(Exception, match="already exists"):
        c.open_case("case/sla", json.dumps([URL]), QUESTION)
    assert json.loads(c.get_case("nope"))["error"] == "unknown case_id"
    assert json.loads(c.get_drift("nope"))["error"] == "unknown case_id"
    assert c.get_tamper_flag("nope") is False
    assert json.loads(c.list_cases()) == ["case/sla"]
    assert c.get_owner() == OWNER
