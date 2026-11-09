---
name: merge
description: >-
  Merge requested legal-check changes into origin/main and verify publication.
  Invoke only when the user explicitly requests merging or landing, including
  /merge; not for review, preparation, passing checks, or skill installation.
disable-model-invocation: true
metadata:
  delta-action: land
---

# Merge legal-check changes

## Intent and scope

This workflow applies to the `legal-check` repository whose publication remote
is `origin`, currently `git@github.com:adisurn/legal-check.git`, and whose
destination is `main`. Do not publish through the `local` backlink.

An explicit merge request, including `/merge`, authorizes completing this
workflow and publishing the requested change. Proceed without asking for the
same permission again; do not respond to `/merge` by waiting for another
explicit merge request. Stop only for genuine blockers, ambiguous scope, or
conflicts. Setup or approval to install this skill is not a merge request.

## Preflight

1. Read current applicable project instructions, contribution policies,
   submission templates, and verification definitions. At installation there
   are no contribution policies, submission templates, CI workflows, tests, or
   lint scripts. Do not assume that remains true. Apply any new requirements,
   including their conditions and exemptions, only when relevant and unmet.
   Do not manufacture issue-number, changelog, review, or commit-message rules.
2. Inspect working-tree and index status, diffs, branch history, remotes, and any
   in-progress Git operation. Establish exactly which edits and commits the
   request covers. Preserve unrelated staged, unstaged, and untracked work.
   Do not indiscriminately stage everything, stash other people's work,
   reset, clean, or overwrite files. Stop for unclear scope or an existing
   merge/rebase operation rather than guessing.
3. Verify `origin` still identifies this repository and that `main` is the
   intended destination. If the remote or default branch changed, ask a focused
   question rather than publishing elsewhere. Inspect GitHub authentication,
   write permission, branch protection, effective rulesets, and applicable
   checks and review requirements with the installed `gh` CLI. Use read-only
   requests such as:

   ```sh
   gh api repos/adisurn/legal-check --jq '{default_branch,permissions,archived}'
   gh api repos/adisurn/legal-check/branches/main/protection
   gh api repos/adisurn/legal-check/rules/branches/main
   ```

   These are GitHub CLI/API operations, not repository-defined tasks. An
   explicit "Branch not protected" response can establish absent classic
   protection only when authenticated repository access succeeds; authentication,
   permission, or network failures do not establish absence. Check effective
   rulesets as well. At installation direct pushes are allowed and no branch
   rules are configured; that observation is not a permanent requirement.
   If new rules mandate a PR or queue, or otherwise prohibit this direct-push
   workflow, stop and describe the required route. Do not bypass rules using
   administrator privileges or change repository settings.
4. Check Git identity and signing configuration without exposing credentials.
   Preserve configured signing, hooks, and authorship. At installation
   `commit.gpgsign` is enabled but `gpg` is not on PATH; new commits may therefore
   be blocked until signing is configured. If signing requires unavailable
   tooling or interactive input, report the blocker; never disable signing.
5. Check Node and pnpm against current package and lockfile requirements.
   The project does not pin a package-manager version or declare a root Node
   engine. The locked Vite 8 requires Node `^20.19.0 || >=22.12.0`; other locked
   dependencies can be stricter, so check the full relevant dependency set.
   Node 26.13.0 and pnpm 12.9.1 were available during setup, not guaranteed
   forever. Sources: `package.json`, `pnpm-lock.yaml` engine entries, and
   `pnpm-workspace.yaml`. Do not install global tools or change machine
   configuration silently.

## Prepare and integrate

1. Fetch `origin` without modifying another checkout and record the destination
   SHA. Inspect all commits and edits that would be published, not merely the
   last commit. If nothing remains to publish, verify that the requested change
   is already present on remote `main` before reporting it as already landed.
2. Prepare a dedicated integration branch when necessary to keep preparation
   off a shared local branch. Start from the requested history, preserve
   existing commits, and commit only explicitly selected in-scope paths or
   hunks. Use a concise descriptive commit message; there is no established
   project-specific message format. Never rewrite published history.
3. Any branch creation, index operation, or integration must leave unrelated
   work intact. If unrelated changes prevent a safe operation, stop and explain
   what must be separated rather than discarding or automatically stashing them.
4. If the destination is already an ancestor of the candidate, retain the
   candidate history. Otherwise merge the fetched destination into the
   integration branch, preserving both histories. Use a non-interactive command,
   for example `GIT_EDITOR=true git merge --no-edit origin/main`, only with a
   safe, understood index and working tree. Do not rebase published commits.
5. **Pause for the user's decision on every conflict.** Do not resolve even
   apparently obvious conflicts. Report the affected files and integration
   state, state that the change has not merged into the destination, and wait.
   Do not automatically abort if that could remove subsequent human work.

All Git commands that might launch an editor must use `GIT_EDITOR=true` and
non-interactive arguments; do not use interactive rebase. Do not force-push,
rewrite shared history, delete branches, or operate on the source checkout.

## Verify the actual candidate

Inspect the complete candidate diff against the fetched destination and current
verification definitions before choosing checks. Code, dependency, configuration,
HTML, styling, and routing changes require both checks below. Documentation- or
skill-only changes can use focused content, reference, and format validation
instead, unless current repository policy requires more.

When application verification is required:

1. Use installed locked dependencies if demonstrably current. If installation
   is needed, use `pnpm install --frozen-lockfile`, preserving the lockfile and
   the repository's dependency build allowlist. Stop if a frozen install fails;
   do not regenerate the lockfile or bypass supply-chain/build policies merely
   to land. Sources: `package.json` dependencies, `pnpm-lock.yaml`,
   `pnpm-workspace.yaml` (`packages` and `allowBuilds`), and `.npmrc`;
   `--frozen-lockfile` is supported by the inspected `pnpm help install`.
2. Run `pnpm build`. Exact task definition: `package.json` →
   `scripts.build` → `vite build`; plugin and route-generation integration:
   `vite.config.ts`.
3. Run `pnpm exec tsc --noEmit`. Sources: `package.json` →
   `devDependencies.typescript`, `pnpm-lock.yaml` → `typescript` (`hasBin: true`),
   and `tsconfig.json` → `compilerOptions.noEmit: true`, strict checking, and
   TypeScript/TSX inclusion. This invokes the local TypeScript compiler; it is
   not a nonexistent package script.
4. Inspect status and diffs after checks. The Vite router plugin can generate
   route output (`vite.config.ts` → `tanstackRouter`; `tsr.config.json`).
   Include necessary generated changes only if in scope, and rerun affected
   checks after any candidate change. Never silently discard generated edits
   or accept unrelated changes made concurrently.

The README's TanStack Start boilerplate is not authoritative about the current
application architecture; the actual configuration is a Vite React application.
There is no `test`, `lint`, or `typecheck` script in the inspected `package.json`.
Do not invent commands or report unrun checks. If current definitions add
mandatory checks, run their verified invocations too.

Before publication, establish that **all required checks have passed for the
exact candidate being published**, under the current repository rules. A local
build does not replace required remote checks or reviews. Pending, failing,
missing, or unverifiable required checks are blockers, not success. If required
remote checks cannot be obtained through this direct-push workflow, stop and
explain the required publication/review route instead of pushing first or
bypassing them. Treat inability to inspect requirements as a blocker.

Record the tested commit SHA and ensure no in-scope uncommitted changes remain.
For required checks tied to a prospective merge result, verify that exact result
as the rules require. Review approval and checks from an older revision do not
cover later changes.

## Publish and confirm

1. Recheck destination rules and verify that `origin/main` has not moved since
   integration and validation. If it moved, fetch and reintegrate safely, pause
   on conflicts, and repeat affected local checks and all required approvals
   and remote checks for the new candidate.
2. Once every applicable requirement passes, publish the tested candidate with
   a normal fast-forward update:

   ```sh
   git push origin HEAD:refs/heads/main
   ```

   Run this only when `HEAD` is the verified candidate and the fetched
   destination is its ancestor. Never add a force option. A concurrent update
   or rejected push is not success; inspect the reason and repeat safe
   integration and verification or stop for a genuine blocker.
3. Read the destination back using `git ls-remote origin refs/heads/main` and,
   if needed, fetch and verify ancestry. Confirm that the tested candidate is
   the remote tip or is contained in a newer tip. Do not mistake a local
   branch update or successful check run for publication.
4. Report the destination and landed commit, checks actually run, any
   proportional exemptions, and remaining unrelated local changes. If the
   remote state cannot be confirmed, report publication as unverified rather
   than claiming success. If blocked before publication, say plainly that the
   requested changes have not merged and explain the blocker.

Leave unrelated changes and branches intact. No branch deletion or source
checkout cleanup is part of this workflow.
