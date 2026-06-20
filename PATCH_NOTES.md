# Patch Notes (manual edits)

This patch adds routes and API handlers. To expose Sign up/Login in your existing navbar:

1) Open `components/navigation.tsx`
2) Add links:
   - /signup
   - /login
   - /dashboard (only if logged in)

For "logged in" detection:
- simplest: call `/api/auth/me` client-side in navbar and render accordingly.
- do NOT show `/founder-console` or internal routes in public nav.

If you want me to generate an exact `components/navigation.tsx` patch, upload that file content.
