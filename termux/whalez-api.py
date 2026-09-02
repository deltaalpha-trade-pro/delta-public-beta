#!/usr/bin/env python3
"""Minimal Termux client for the canonical DeltaAlpha / Whalez API v1."""

from __future__ import annotations

import argparse
import json
import os
import sys
import urllib.error
import urllib.request
import uuid

DEFAULT_API = "https://api.deltaalpha-trade-pro.com/v1"


def request(api_base: str, method: str, path: str, token: str | None = None, payload: object | None = None, node_id: str | None = None) -> int:
    url = api_base.rstrip("/") + path
    body = None if payload is None else json.dumps(payload).encode("utf-8")
    headers = {
        "accept": "application/json",
        "x-request-id": str(uuid.uuid4()),
    }
    if body is not None:
        headers["content-type"] = "application/json"
    if token:
        headers["authorization"] = f"Bearer {token}"
    if node_id:
        headers["x-whalez-node-id"] = node_id

    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=30) as response:
            data = response.read().decode("utf-8")
            print(data)
            return 0 if 200 <= response.status < 300 else 1
    except urllib.error.HTTPError as exc:
        print(exc.read().decode("utf-8", errors="replace"), file=sys.stderr)
        return 1
    except urllib.error.URLError as exc:
        print(f"network_error: {exc}", file=sys.stderr)
        return 1


def main() -> int:
    parser = argparse.ArgumentParser(description="Whalez API v1 Termux client")
    parser.add_argument("--api", default=os.getenv("WHALEZ_API_URL", DEFAULT_API))
    parser.add_argument("--token", default=os.getenv("WHALEZ_API_KEY"))
    sub = parser.add_subparsers(dest="command", required=True)

    sub.add_parser("health")
    sub.add_parser("status")
    sub.add_parser("capabilities")

    intelligence = sub.add_parser("intelligence")
    intelligence.add_argument("input", help="Text passed to the intelligence backend")

    register = sub.add_parser("register")
    register.add_argument("node_id", default=os.getenv("WHALEZ_NODE_ID", "termux-node"))

    args = parser.parse_args()

    if args.command == "health":
        return request(args.api, "GET", "/health")
    if args.command == "status":
        return request(args.api, "GET", "/status")
    if args.command == "capabilities":
        return request(args.api, "GET", "/capabilities")
    if args.command == "register":
        if not args.token:
            parser.error("register requires --token or WHALEZ_API_KEY")
        return request(args.api, "POST", "/nodes/register", args.token, node_id=args.node_id)
    if args.command == "intelligence":
        if not args.token:
            parser.error("intelligence requires --token or WHALEZ_API_KEY")
        return request(args.api, "POST", "/intelligence", args.token, {"input": args.input})

    parser.error("unknown command")
    return 2


if __name__ == "__main__":
    raise SystemExit(main())
