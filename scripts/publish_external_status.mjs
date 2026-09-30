#!/usr/bin/env node

const required = ["GITHUB_TOKEN", "GITHUB_REPOSITORY", "GITHUB_SHA", "EXTERNAL_CI_STATE"]
for (const key of required) {
  if (!process.env[key]) {
    console.error(`Missing required environment variable: ${key}`)
    process.exit(2)
  }
}

const state = process.env.EXTERNAL_CI_STATE
if (!["pending", "success", "failure", "error"].includes(state)) {
  console.error(`Invalid EXTERNAL_CI_STATE: ${state}`)
  process.exit(2)
}

const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/", 2)
if (!owner || !repo) {
  console.error("GITHUB_REPOSITORY must be owner/repository")
  process.exit(2)
}

const body = {
  state,
  target_url: process.env.EXTERNAL_CI_TARGET_URL || null,
  description: process.env.EXTERNAL_CI_DESCRIPTION || "External verification",
  context: "External Verification / build",
}

const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/statuses/${process.env.GITHUB_SHA}`, {
  method: "POST",
  headers: {
    accept: "application/vnd.github+json",
    authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    "content-type": "application/json",
    "x-github-api-version": "2022-11-28",
    "user-agent": "whalez-ai-external-verification",
  },
  body: JSON.stringify(body),
})

if (!response.ok) {
  console.error(`GitHub status publication failed: HTTP ${response.status}`)
  console.error(await response.text())
  process.exit(1)
}

console.log(`Published ${body.context}=${state} for ${process.env.GITHUB_REPOSITORY}@${process.env.GITHUB_SHA}`)
