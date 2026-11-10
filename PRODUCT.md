# Legal Check

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Both audiences are primary:

- SME businesses handling product claims and complaints, identifying recurring issues, and tracking resolutions.
- Customers who have difficulty claiming defective products, using warranties, or requesting refunds and need help understanding what to prepare and do next.

The initial legal context and user-facing content are Thai.

## Product Purpose

Make consumer-rights and product-claim workflows less complicated for customers and SME businesses.

The main success outcome is a prepared claim with an evidence checklist and clear next steps. Understanding concerning contract terms supports that outcome rather than replacing it as the primary goal.

## Operating Context

- Current stage: a prototype for demonstrations and user testing, not a production legal service.
- Initial scope: defective products, warranties, and refunds in Thailand.
- Customers work with purchase records, warranty terms, communications, and evidence of a product problem.
- Businesses classify complaints, review recurring problems, and track resolution outcomes.
- First-run onboarding chooses Light Mode or Dark Mode, then Consumer or Business. Theme, role, selected demo profile, and desktop/mobile presentation persist in LocalStorage.
- Consumer and Business have separate dashboards and navigation. The mobile presentation includes a phone frame; it remains a web interface, not a native mobile app.
- A freely switchable Moderator demo exists for testing trust-and-safety decisions. It is not an authenticated administrator account.

## Capabilities and Constraints

### Intended capabilities

1. **AI Legal Check:** separate consumer and business guidance using simulated rules, understandable rights/obligations, evidence preparation, and suitable help channels.
2. **Claim Assistant:** an optional guided complaint checklist, not a mandatory long form. Users review a summary before creating a private complaint. Receipts and evidence are optional.
3. **Case Connect:** platform-managed issue discussions. Local brand/product/category/tag matching groups complaints internally before applying publication rules. Users do not freely create public threads. Grouping does not automatically constitute a joint lawsuit or class action.
4. **Business Resolution:** an organization-scoped inbox with search, filters, authorized evidence, replies, status tracking, and recurring-issue summaries.
5. **Trust & Safety:** simulated verification, evidence review, content-risk classification, configurable publication thresholds, business right to reply, reports, appeals, and moderation history.

### Prototype boundaries

- Use TanStack Router. No authentication is required.
- Store persistent app data in Local Storage rather than a database. Data is browser-local, not an account-backed or shared multi-user record; clearing browser storage can remove it.
- The current contract screening is a local keyword-based demonstration, not a live AI service or a legal opinion.
- Current case groups and cases are sample/local data, not evidence of real customer participation or resolved disputes.
- Do not imply that a local group join sends information to another person, business, or authority.
- Each complaint enters its relevant business's local inbox even if its issue group is not public. Unknown businesses remain unmatched rather than being routed to an unrelated organization.
- Public groups require multiple distinct demo accounts, configured verification/evidence counts, and moderator approval. New unresolved medium/high-risk claims pause publication. Private complaint handling remains available.
- Raw complaint descriptions and evidence files are not published in Case Connect. Business file access additionally requires the consumer's consent and no unresolved sensitive-information flag.
- File evidence is stored locally, limited to three files per claim and 350 KB per file. Text/filename checks and manual review do not authenticate images or documents.
- Risk classification is not a legal judgment or a true/false determination. Suggested neutral rewrites must not invent facts.
- Businesses may respond, dispute, report, and request correction; they cannot delete or hide public discussions themselves. A business denial does not automatically punish a consumer.
- Demo profile switching is not a security boundary. This frontend-only prototype is unsuitable for sensitive real-world case handling.
- Consumer-protection law provides the subject context. Lemon Law is referenced as a draft; do not present it as enacted without checking current official sources.
- Guidance helps users prepare and find appropriate assistance; do not present it as a guaranteed legal outcome.

## Brand Commitments

- Product name: Legal Check.
- User-facing content is Thai.
- Preserve the user-specified brand colors: `#4461ad`, `#7696d1`, `#f6cf90`, and `#fff6e7`. Their application belongs to the design system, not this product record.

## Evidence on Hand

- `src/data/platform.ts` seeds fictional Nova Mobile and Home Care scenarios: a multi-consumer battery issue, a private refund claim, and a flagged allegation. These are demonstration material, not testimonials or verified outcomes.
- `src/lib/platform.ts` owns local classification, clustering, risk checks, publication eligibility, and moderation transitions. `src/components/platform/legal-advisor.tsx` implements role-specific legal-information demonstrations.
- Existing help content references consumer-assistance channels including สคบ. 1166 and ETDA 1212. These references do not establish a partnership or endorsement.
- No verified customer outcomes, legal-review certification, or production AI capability has been established. Future work must not invent these claims.

## Product Principles

1. **Make claims actionable.** Prioritize an evidence checklist and understandable next steps over analysis without a usable follow-through.
2. **Support both sides of resolution.** Help customers prepare claims and SME businesses handle complaints coherently.
3. **Explain limits honestly.** Distinguish demonstrations, general guidance, draft legislation, and actual legal processes.
4. **Respect the local-data boundary.** Do not imply synchronization, submission, or real-world matching where none exists.

## Open Decisions

- User-testing measures and acceptance criteria beyond the confirmed claim-preparation outcome are not yet defined.
- Any transition to real AI, cross-device accounts, production authorization, or external case submission remains out of scope and requires a separate decision. Local simulations are the confirmed implementation, not an undecided backend choice.
- Requirements for public deployment and legal-content review have not been established.
