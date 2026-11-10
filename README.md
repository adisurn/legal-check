# Legal Check

A Thai-language, frontend-only consumer-protection and business-resolution prototype.
All people, organizations, complaints, and verification states in the seeded scenarios
are fictional. AI features are deterministic local simulations, not a connected AI service.

## Run and validate

Use Node 22.18+ and pnpm. No environment variables, database, API keys, or backend are needed.

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`. First select Light/Dark Mode, then Consumer or Business.
Use the role selector to switch to either workspace or **Moderator demo**. The sidebar
selects a fictional consumer or organization; this is not authentication.

```bash
pnpm test                 # Classification, clustering, privacy/publication rules
pnpm exec tsc --noEmit     # Application and test types
pnpm build                # Production frontend
pnpm exec playwright install chromium  # Once, if the browser is not installed
pnpm test:e2e             # End-to-end scenarios and responsive checks
```

Playwright starts the Vite development server automatically. Screenshots go to
`.impeccable/review/`; failure traces go to `test-results/`. Both are ignored.
The application itself does not require external services or hosted fonts/images.

## Try the complete flow

1. **Consumer → Claim Assistant:** describe `Nova X1 แบตเตอรี่ร้อนผิดปกติ`.
   Brand/model/category can be detected from this text. Other fields and receipts
   are optional. Check useful evidence, optionally attach files, review the summary,
   and submit.
2. **My Claims:** inspect the saved private complaint, evidence-sharing permissions,
   checklist, additional information, business responses, and history.
3. **Business → Nova Mobile → Business Resolution:** find the complaint using search
   and brand/product/category/tag/status filters. Respond and change its status.
   Switch to Home Care to verify that Nova complaints are not in that organization's inbox.
4. **Case Connect:** matching battery complaints share the existing issue group.
   Raw allegations and evidence are never public. Safe discussion posts and explicitly
   public, low-risk business responses appear only in an eligible group.
5. **Risk scenario:** submit a battery complaint containing `ร้านโกง`. It remains
   privately available to the relevant business and pauses public visibility of its group
   until reviewed. The UI offers a neutral placeholder rewrite without inventing facts.
6. **Moderator demo:** review related claims and evidence, inspect local risk signals,
   record a reason, and approve/request edits/hide/reject publication. Private complaints
   are not deleted. Review reports/appeals separately and keep a decision history.
7. **Moderator → เกณฑ์และบัญชีจำลอง:** change distinct-consumer, verified-contact,
   and reviewed-evidence thresholds. At least two distinct demo accounts are always
   required; thresholds never establish that an allegation is true.
8. Switch roles and refresh to verify persistence. Theme and Desktop/Mobile preview
   also persist. Mobile uses the existing phone frame and a role-specific bottom navigation.

The initial data includes an approved two-consumer battery group, a private refund claim,
and a high-risk warranty allegation. Switch fictional consumers to test multiple accounts.
Account verification, purchase-evidence indicators, transaction review, and business
verification have separate meanings explained in the interface.

## Architecture

- `src/routes/index.tsx`: TanStack Router entry and view search parameter.
- `src/components/platform/platform-app.tsx`: shared state and role-scoped composition.
- `src/components/platform/`: onboarding, navigation, dashboards, optional claim checklist,
  complaint detail/evidence permissions, community discussions, moderation, and legal guidance.
- `src/types/platform.ts`: the persisted domain model.
- `src/lib/platform.ts`: pure classification, clustering, risk, publication, and moderation rules.
  UI components use this source of truth instead of duplicating eligibility logic.
- `src/lib/evidence.ts`: bounded file reading, SHA-256 duplicate fingerprints, and basic
  filename/text privacy flags. Images/PDFs require manual review; no authenticity detection.
- `src/hooks/use-platform.ts`: transactional LocalStorage writes. Failed writes leave
  the prior state intact and show an error; unreadable data is not silently overwritten.
- `src/data/platform.ts`: synthetic demo seed.
- `src/styles.css`: semantic light/dark tokens and responsive application styles.
- `src/components/layout/device-workspace.*`: presentation-only desktop/mobile shell.
- `src/lib/platform.test.ts`, `tests/platform.spec.ts`: domain and browser regression checks.

The earlier prototype components/data remain separate from the active platform module.
They are not part of the current route or runtime network dependencies.

## Persistence and safety limits

The versioned `legal-check-platform-v1` LocalStorage record contains preferences, profiles,
claim/legal drafts, complaints, evidence, groups, discussion posts, business replies,
reports, settings, and history. On first use, existing `legal-check-cases` entries are
imported as private complaints; the original legacy record is retained.

- Persistent data stays in this browser. Clearing site storage removes the demo.
- Evidence is limited to **3 files per complaint, 350 KB each**. PNG/JPEG/WebP/PDF/TXT
  are supported. Files are private; only an explicitly authorized, non-sensitive file
  is shown to the relevant business in the UI.
- LocalStorage is not encrypted. Role/profile switching is a demo affordance, **not an
  access-control boundary**. Anyone using this browser can inspect its data.
- No server, database, external data persistence, real account verification, AI API,
  complaint submission to authorities, or cross-device synchronization is implemented.
- Counts, risk labels, and moderation approval do not prove allegations or legal liability.
  Lemon Law is described as a draft/concept, not an enacted entitlement.
- Multiple browser tabs are not a collaborative system. Use one tab while demonstrating
  role switching to avoid independent tabs overwriting the same local snapshot.

Use synthetic information only. This prototype is not suitable for real sensitive case
handling or public moderation without a separate production design and legal review.
