# Controlled Vercel Deployment Procedure

## Policy

Automatic Git-triggered deployments are disabled by `vercel.json`. Code pushes and pull-request updates are not deployment requests. This prevents normal development activity from consuming the project's deployment budget.

Vercel documents a Hobby limit of 100 deployments per rolling 86,400 seconds. A build cancelled by an Ignored Build Step still counts as a deployment, so that mechanism must not be used as the primary quota control.

References:
- https://vercel.com/docs/limits
- https://vercel.com/docs/project-configuration/git-configuration
- https://vercel.com/docs/project-configuration/project-settings
- https://vercel.com/docs/deployments/promote-preview-to-production

## Release sequence

1. Finish code review and merge the intended change only after required human review and required checks are satisfied.
2. Verify the exact candidate SHA in a Linux environment: clean install (`npm ci`), type-check, policy tests, and production build. Do not treat a build performed after `npm install --package-lock=false` as a substitute for a successful clean install.
3. Confirm the Vercel project settings/environment and the intended Git SHA. Do not change production aliases while running preview tests.
4. Create one preview deployment for that exact SHA from Vercel Deployments → Create Deployment. Do not repeatedly redeploy the same failing candidate.
5. Verify the preview's health, auth routes, email verification delivery, session lifecycle, and protected-route behavior. Record the deployment ID, URL, Git SHA, test outcome, and any blocked checks.
6. Promote the same verified preview to production only after explicit release approval. Prefer promotion over rebuilding the same SHA.
7. If a candidate fails, fix and validate it outside Vercel first. Spend another deployment only when there is a new, test-ready candidate or a documented need to retry infrastructure.
8. Never use this procedure to bypass branch protection, human Code Owner review, security checks, or jurisdiction/provider release gates.

## Release record

Record at least: candidate SHA, preview deployment ID/URL, build result, auth E2E result, email-delivery evidence, approving reviewer, promotion result, and production smoke-test result.

A READY deployment alone is not proof of a working authentication corridor or launch certification.
