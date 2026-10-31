import test from "node:test"
import assert from "node:assert/strict"
import { consoleRouteDecision } from "../lib/admin-console/routing"

const host = "console.deltaalpha-trade-pro.com"
test("only dedicated Admin host may see its own routes", () => {
  assert.equal(consoleRouteDecision(host, host, "/"), "rewrite-admin")
  assert.equal(consoleRouteDecision(host, null, "/api/admin/overview"), "allow")
  assert.equal(consoleRouteDecision(host, host, "/login"), "allow")
  assert.equal(consoleRouteDecision(host, null, "/api/auth/login"), "allow")
  assert.equal(consoleRouteDecision(host, null, "/mail"), "deny")
  assert.equal(consoleRouteDecision(host, null, "/founder-console"), "deny")
  assert.equal(consoleRouteDecision(host, null, "/dashboard"), "deny")
  assert.equal(consoleRouteDecision(host, null, "/trading"), "deny")
  assert.equal(consoleRouteDecision(host, "www.deltaalpha-trade-pro.com", "/"), "deny")
  assert.equal(consoleRouteDecision("founder-console-eight.vercel.app", host, "/"), "deny")
  assert.equal(consoleRouteDecision("www.deltaalpha-trade-pro.com", null, "/"), "ordinary")
  assert.equal(consoleRouteDecision("www.deltaalpha-trade-pro.com", null, "/login"), "ordinary")
})
