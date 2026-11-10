import assert from "node:assert/strict";
import { test } from "node:test";
import { createDemoState } from "../data/platform.ts";
import {
  assessRisk,
  businessClaims,
  classify,
  duplicateFingerprints,
  emptyDraft,
  findCluster,
  groupClaims,
  publicEvidence,
  publication,
  reviewCluster,
  riskForClaim,
  submitClaim,
  validateSettings,
} from "./platform.ts";
import type { Evidence } from "../types/platform";

const battery = () => ({
  ...emptyDraft(),
  brand: "Nova",
  product: "Nova X1",
  description: "แบตเตอรี่ร้อนผิดปกติขณะชาร์จ",
  category: "Consumer Safety",
});

test("demo scenarios are synthetic; only the reviewed multi-account group is public", () => {
  const state = createDemoState();
  assert.equal(state.claims.length, 4);
  assert.equal(state.clusters.length, 3);
  assert.equal(
    state.clusters.filter((c) => publication(state, c).visible).length,
    1,
  );
  const flagged = state.claims.find((c) => c.risk.level === "high")!;
  assert.equal(
    publication(
      state,
      state.clusters.find((c) => c.id === flagged.clusterId)!,
    ).visible,
    false,
  );
});

test("classification detects brand, model and issue from description without mandatory fields", () => {
  const state = createDemoState();
  const info = classify(
    { ...emptyDraft(), description: "Nova X1 แบตเตอรี่ร้อนมาก" },
    state.businesses,
  );
  assert.equal(info.brand, "Nova");
  assert.equal(info.product, "Nova X1");
  assert.equal(info.businessId, "business-nova");
  assert.equal(info.category, "Consumer Safety");
  assert.ok(info.tags.includes("แบตเตอรี่ / ความร้อน"));
});

test("an explicit unrelated brand is not routed to Nova because Nova occurs in the description", () => {
  const state = createDemoState();
  const info = classify(
    {
      ...battery(),
      brand: "Other",
      description: "เปรียบเทียบกับ Nova แล้วพบว่าร้อน",
    },
    state.businesses,
  );
  assert.equal(info.businessId, null);
});

test("same issue reuses a cluster and counts distinct consumers, not complaints", () => {
  let state = createDemoState();
  const oldCount = state.clusters.length;
  const group = state.clusters.find((c) => c.category === "Consumer Safety")!;
  state = submitClaim(state, battery(), "consumer-you");
  state = submitClaim(state, battery(), "consumer-you");
  assert.equal(state.clusters.length, oldCount);
  assert.equal(state.claims[0].clusterId, group.id);
  assert.equal(publication(state, group).distinct, 3);
  assert.equal(groupClaims(state, group.id).length, 4);
});

test("known brand aliases normalize to the same organization and issue group", () => {
  const state = submitClaim(
    createDemoState(),
    { ...battery(), brand: "โนวา" },
    "consumer-you",
  );
  assert.equal(state.claims[0].brand, "Nova");
  assert.equal(state.clusters.length, 3);
});

test("different models, brands or categories do not merge", () => {
  const state = createDemoState();
  for (const patch of [
    { product: "Nova X2" },
    { brand: "Other" },
    { category: "Product Quality" },
  ]) {
    const info = classify({ ...battery(), ...patch }, state.businesses);
    assert.equal(findCluster(state.clusters, info), undefined);
  }
});

test("unknown products are not merged solely on generic keywords", () => {
  let state = createDemoState();
  state = submitClaim(
    state,
    { ...emptyDraft(), description: "สินค้าชำรุด" },
    "consumer-you",
  );
  const first = state.claims[0].clusterId;
  state = submitClaim(
    state,
    { ...emptyDraft(), description: "สินค้าชำรุด" },
    "consumer-mali",
  );
  assert.notEqual(first, state.claims[0].clusterId);
});

test("a complaint without receipt remains privately available to the relevant business", () => {
  const state = submitClaim(createDemoState(), battery(), "consumer-you");
  const claim = state.claims[0];
  assert.equal(claim.evidence.length, 0);
  assert.ok(
    businessClaims(state, "business-nova").some((c) => c.id === claim.id),
  );
  assert.ok(
    !businessClaims(state, "business-home").some((c) => c.id === claim.id),
  );
});

test("new high-risk content stops publication even when added to a previously approved group", () => {
  let state = createDemoState();
  const group = state.clusters.find((c) => c.category === "Consumer Safety")!;
  assert.equal(publication(state, group).visible, true);
  state = submitClaim(
    state,
    { ...battery(), description: "แบตร้อน ร้านโกง" },
    "consumer-you",
  );
  assert.equal(publication(state, group).visible, false);
  state = reviewCluster(
    state,
    group.id,
    "approved",
    "Reviewed context, no finding on truth",
  );
  assert.equal(
    publication(
      state,
      state.clusters.find((c) => c.id === group.id)!,
    ).visible,
    true,
  );
});

test("risk checks cover identifiers and optional requested outcome, not just description", () => {
  for (const patch of [
    { brand: "ร้านโกง" },
    { product: "โกง" },
    { requestedOutcome: "จะประจาน" },
  ]) {
    const state = submitClaim(
      createDemoState(),
      { ...battery(), ...patch },
      "consumer-you",
    );
    assert.equal(state.claims[0].risk.level, "high");
  }
});

test("risk levels are simulated signals; neutral suggestions do not invent incident facts", () => {
  assert.equal(assessRisk("แบตเตอรี่ร้อนขณะชาร์จ").level, "low");
  assert.equal(assessRisk("บริการแย่ที่สุด").level, "medium");
  assert.equal(assessRisk("ร้านโกง").level, "high");
  assert.equal(
    assessRisk("ติดต่อ user@example.com หรือ 0812345678").level,
    "high",
  );
  const suggestion = assessRisk("ร้านโกง ไม่ซ่อมตามประกัน").suggestion;
  assert.ok(!suggestion.includes("โกง"));
  assert.ok(suggestion.includes("ไม่ซ่อมตามประกัน"));
  assert.ok(!suggestion.includes("ซื้อเมื่อ"));
});

test("publication thresholds count evidence from distinct accounts with reviewed relevant consistent files", () => {
  let state = createDemoState();
  const group = state.clusters.find((c) => c.category === "Consumer Safety")!;
  state.settings.minEvidence = 3;
  assert.equal(publication(state, group).visible, false);
  state.settings.minEvidence = 1;
  state.claims = state.claims.map((c) => ({
    ...c,
    evidence: c.evidence.map((e) => ({ ...e, sensitive: true })),
  }));
  assert.equal(publication(state, group).evidenced, 0);
  assert.equal(publication(state, group).visible, false);
});

test("evidence sharing requires consent and absence of unresolved sensitive information", () => {
  const file = createDemoState().claims.find((c) => c.evidence.length)!
    .evidence[0];
  assert.equal(publicEvidence(file), true);
  assert.equal(publicEvidence({ ...file, shareWithBusiness: false }), false);
  assert.equal(publicEvidence({ ...file, sensitive: true }), false);
});

test("duplicate evidence fingerprints trigger review without concluding it is fake", () => {
  const initial = createDemoState();
  const file: Evidence = initial.claims.find((c) => c.evidence.length)!
    .evidence[0];
  assert.equal(duplicateFingerprints(initial, [file]).length, 1);
  const state = submitClaim(
    initial,
    { ...battery(), evidence: [file] },
    "consumer-you",
  );
  assert.equal(state.claims[0].risk.level, "high");
  assert.ok(
    state.claims[0].risk.reasons.some((reason) =>
      reason.includes("ไม่ใช่ข้อสรุป"),
    ),
  );
  assert.equal(
    riskForClaim(
      state,
      { ...state.claims[0], description: "เพิ่มรายละเอียดด้วยถ้อยคำกลาง" },
      state.claims[0].id,
    ).level,
    "high",
  );
});

test("hiding or rejecting publication preserves private complaints and a decision history", () => {
  let state = createDemoState();
  const group = state.clusters.find((c) => c.category === "Consumer Safety")!;
  const originalCount = state.claims.length;
  state = reviewCluster(state, group.id, "hidden", "Request context");
  assert.equal(state.claims.length, originalCount);
  assert.equal(
    publication(
      state,
      state.clusters.find((c) => c.id === group.id)!,
    ).visible,
    false,
  );
  assert.ok(state.history.some((h) => h.message.includes("Request context")));
  assert.ok(
    state.history.some(
      (h) => h.actor === "ระบบจำลอง" && h.message.includes("สถานะเผยแพร่"),
    ),
  );
});

test("settings never permit a single-account public thread", () => {
  assert.deepEqual(
    validateSettings({ minConsumers: 1, minVerified: -1, minEvidence: 50 }),
    {
      minConsumers: 2,
      minVerified: 0,
      minEvidence: 10,
    },
  );
});

test("serialization preserves preferences, claims, discussions, responses and moderation history", () => {
  const state = createDemoState();
  state.preferences.theme = "dark";
  state.preferences.role = "business";
  assert.deepEqual(JSON.parse(JSON.stringify(state)), state);
});
