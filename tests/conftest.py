"""Pytest bootstrap: a fake GenVM the tests steer.

Knobs:
  gl.page               text the fetched page returns; a dict maps url -> text, so a
                        case with several URLs can drift on one of them only. Values may
                        be an Exception, which the renderer then raises.
  gl.llm_reply          raw model output (str/dict, or an Exception to raise)
  gl.comparative_fails  when True, eq_principle.prompt_comparative raises
  gl.prompts            every prompt sent, for assertions about quoting
"""

from __future__ import annotations

import sys
import types
from pathlib import Path


def _install_fake_genlayer() -> None:
    existing = sys.modules.get("genlayer")
    if existing is not None and getattr(existing, "_evidencedesk_fake", False):
        return

    gl = types.ModuleType("genlayer")
    gl._evidencedesk_fake = True

    class _Public:
        @staticmethod
        def write(fn):
            return fn

        @staticmethod
        def view(fn):
            return fn

    class _EqPrinciple:
        @staticmethod
        def prompt_comparative(leader_fn, principle="", /):
            """`principle` is positional-only in GenVM v0.3; the fake enforces that so a
            keyword call fails in tests exactly as it does on chain."""
            if getattr(gl, "comparative_fails", False):
                raise Exception("comparative consensus unavailable")
            return leader_fn()

        @staticmethod
        def strict_eq(leader_fn):
            return leader_fn()

    def _render(url, mode="text"):
        page = gl.page
        if isinstance(page, dict):
            page = page.get(url, "")
        if isinstance(page, Exception):
            raise page
        return page

    def _exec_prompt(prompt, response_format=None):
        gl.prompts.append(prompt)
        reply = gl.llm_reply
        if isinstance(reply, Exception):
            raise reply
        return reply

    gl.contract = types.SimpleNamespace(Contract=object)
    gl.public = _Public()
    gl.message = types.SimpleNamespace(sender_address="0x1111111111111111111111111111111111111111")
    gl.eq_principle = _EqPrinciple()
    gl.nondet = types.SimpleNamespace(
        web=types.SimpleNamespace(render=_render),
        exec_prompt=_exec_prompt,
    )

    gl.page = "Vendor SLA: 99.9% uptime, credits paid within 30 days."
    gl.llm_reply = '{"material": true}'
    gl.comparative_fails = False
    gl.prompts = []
    sys.modules["genlayer"] = gl


def load_contract(repo_root: Path, filename: str = "EvidenceSnapshotV2.py"):
    _install_fake_genlayer()
    path = repo_root / "contracts" / filename
    mod_name = f"contract_{filename.replace('.', '_')}"
    module = types.ModuleType(mod_name)
    module.__dict__["gl"] = sys.modules["genlayer"]
    exec(compile(path.read_text(encoding="utf-8"), str(path), "exec"), module.__dict__)
    sys.modules[mod_name] = module
    return module


def reset(gl) -> None:
    gl.page = "Vendor SLA: 99.9% uptime, credits paid within 30 days."
    gl.llm_reply = '{"material": true}'
    gl.comparative_fails = False
    gl.prompts = []
    gl.message.sender_address = "0x1111111111111111111111111111111111111111"
