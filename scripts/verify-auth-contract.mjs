const base = (process.env.AUTH_BASE_URL || "").replace(/\/$/, "");
const email = process.env.AUTH_TEST_EMAIL || "";
const password = process.env.AUTH_TEST_PASSWORD || "";
const code = process.env.AUTH_TEST_VERIFICATION_CODE || "";

if (!base) {
  console.error("AUTH_BASE_URL is required");
  process.exit(2);
}

const form = (values) => new URLSearchParams(values).toString();

const request = async (path, init = {}) => {
  const response = await fetch(base + path, {
    ...init,
    redirect: "manual",
  });
  const text = await response.text();
  let body = {};
  try {
    body = text ? JSON.parse(text) : {};
  } catch {
    body = { raw: text };
  }
  return { response, body };
};

console.log("Checking Runplane Auth contract at " + base);

const health = await request("/health");
if (!health.response.ok) {
  throw new Error("/health returned " + health.response.status);
}
console.log("PASS health");

if (!email || !password || !code) {
  console.log(
    "PARTIAL: full E2E requires AUTH_TEST_EMAIL, AUTH_TEST_PASSWORD, and AUTH_TEST_VERIFICATION_CODE.",
  );
  process.exit(0);
}

const register = await request("/auth/register", {
  method: "POST",
  headers: { "content-type": "application/x-www-form-urlencoded" },
  body: form({ email, password }),
});

if (
  !register.response.ok ||
  register.body.verification_required !== true
) {
  throw new Error(
    "Registration verification gate failed: " +
      JSON.stringify(register.body),
  );
}
console.log("PASS register requires verification");

const blocked = await request("/auth/login", {
  method: "POST",
  headers: { "content-type": "application/x-www-form-urlencoded" },
  body: form({ email, password }),
});

if (
  blocked.response.status !== 403 ||
  blocked.body.detail !== "email_verification_required"
) {
  throw new Error(
    "Unverified login was not blocked: " +
      blocked.response.status +
      " " +
      JSON.stringify(blocked.body),
  );
}
console.log("PASS unverified login blocked");

const verify = await request("/auth/verify", {
  method: "POST",
  headers: { "content-type": "application/x-www-form-urlencoded" },
  body: form({ email, code }),
});

if (
  !verify.response.ok ||
  verify.body.email_verified !== true
) {
  throw new Error(
    "Email verification failed: " +
      JSON.stringify(verify.body),
  );
}
console.log("PASS email verification");

const login = await request("/auth/login", {
  method: "POST",
  headers: { "content-type": "application/x-www-form-urlencoded" },
  body: form({ email, password }),
});

if (!login.response.ok) {
  throw new Error(
    "Verified login failed: " +
      JSON.stringify(login.body),
  );
}

const setCookie = login.response.headers.get("set-cookie") || "";
const match = setCookie.match(/(?:^|,\s*)rp=([^;]+)/i);

if (!match) {
  throw new Error("Login succeeded without rp session cookie");
}
console.log("PASS session created");

const token = match[1];

const me = await request("/auth/me", {
  headers: { cookie: "rp=" + token },
});

if (
  !me.response.ok ||
  me.body.email !== email ||
  me.body.email_verified !== true
) {
  throw new Error(
    "/auth/me rejected the new session: " +
      JSON.stringify(me.body),
  );
}
console.log("PASS authenticated session");

const logout = await request("/auth/logout", {
  method: "POST",
  headers: { cookie: "rp=" + token },
});

if (!logout.response.ok) {
  throw new Error("Logout failed");
}

const after = await request("/auth/me", {
  headers: { cookie: "rp=" + token },
});

if (after.response.status !== 401) {
  throw new Error("Revoked session remained valid");
}

console.log("PASS logout revokes session");
console.log("AUTH E2E PASS");
