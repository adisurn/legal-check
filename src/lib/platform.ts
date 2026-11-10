import type {
  Claim,
  ClaimDraft,
  Classification,
  Cluster,
  Evidence,
  HistoryEntry,
  PlatformState,
  Risk,
  SafetySettings,
} from "../types/platform";

export const categories = [
  "Product Quality",
  "Misleading Advertising",
  "Delivery Problems",
  "Refund & Return",
  "Warranty & After-Sales Service",
  "Consumer Safety",
  "Unfair Business Practices",
  "Pricing & Payment",
  "Customer Service",
];
export const categoryLabels: Record<string, string> = {
  "Product Quality": "คุณภาพสินค้า",
  "Misleading Advertising": "โฆษณาไม่ตรงจริง",
  "Delivery Problems": "การจัดส่ง",
  "Refund & Return": "คืนสินค้า / คืนเงิน",
  "Warranty & After-Sales Service": "รับประกัน / บริการหลังขาย",
  "Consumer Safety": "ความปลอดภัย",
  "Unfair Business Practices": "เงื่อนไขไม่เป็นธรรม",
  "Pricing & Payment": "ราคา / การชำระเงิน",
  "Customer Service": "การบริการลูกค้า",
};
export const statuses = [
  "New",
  "Under Review",
  "Awaiting Information",
  "Responded",
  "In Progress",
  "Resolved",
  "Closed",
  "Disputed",
] as const;
export const statusLabels: Record<string, string> = {
  New: "เรื่องใหม่",
  "Under Review": "กำลังตรวจสอบ",
  "Awaiting Information": "รอข้อมูลเพิ่มเติม",
  Responded: "ธุรกิจตอบกลับแล้ว",
  "In Progress": "กำลังแก้ไข",
  Resolved: "แก้ไขแล้ว",
  Closed: "ปิดเรื่อง",
  Disputed: "ธุรกิจโต้แย้งข้อร้องเรียน",
};
export const reviewLabels = {
  pending: "รอพิจารณา",
  approved: "อนุมัติแล้ว",
  edits: "ขอข้อมูล / แก้ไข",
  rejected: "ไม่อนุมัติเผยแพร่",
  hidden: "ซ่อนโดยผู้ดูแล",
};
export const riskLabels = {
  low: "ความเสี่ยงต่ำ",
  medium: "ความเสี่ยงปานกลาง",
  high: "ความเสี่ยงสูง",
};
export const evidenceLabels = {
  receipt: "ใบเสร็จ / การชำระเงิน",
  photo: "ภาพสินค้า / จุดบกพร่อง",
  communication: "ประวัติการติดต่อ",
  warranty: "เอกสารรับประกัน",
  other: "เอกสารอื่น",
};
export const emptyDraft = (): ClaimDraft => ({
  productType: "",
  brand: "",
  product: "",
  description: "",
  category: "",
  requestedOutcome: "",
  evidence: [],
  ready: [],
});
export const id = (prefix: string) => `${prefix}-${crypto.randomUUID()}`;
export const normalize = (value: string) =>
  value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[\s\p{P}]+/gu, "");
export const dateLabel = (date: string) =>
  new Date(date).toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
export const historyEntry = (
  targetId: string,
  actor: string,
  message: string,
): HistoryEntry => ({
  id: id("event"),
  targetId,
  actor,
  message,
  createdAt: new Date().toISOString(),
});

const issueRules = [
  {
    words: ["ร้อน", "ไหม้", "overheat", "battery", "แบต"],
    tag: "แบตเตอรี่ / ความร้อน",
    category: "Consumer Safety",
  },
  {
    words: ["คืนเงิน", "refund", "return", "คืนสินค้า"],
    tag: "คืนเงิน",
    category: "Refund & Return",
  },
  {
    words: ["ส่ง", "delivery", "พัสดุ"],
    tag: "การจัดส่ง",
    category: "Delivery Problems",
  },
  {
    words: ["เคลม", "ประกัน", "warranty", "ซ่อม"],
    tag: "การรับประกัน",
    category: "Warranty & After-Sales Service",
  },
  {
    words: ["โฆษณา", "advertis", "ไม่ตรงปก"],
    tag: "โฆษณา",
    category: "Misleading Advertising",
  },
  {
    words: ["ชำรุด", "แตก", "เสีย", "defect", "broken"],
    tag: "สินค้าชำรุด",
    category: "Product Quality",
  },
  {
    words: ["เงิน", "ราคา", "payment", "price"],
    tag: "การชำระเงิน",
    category: "Pricing & Payment",
  },
  {
    words: ["เงื่อนไข", "ไม่รับผิด", "policy", "ไม่เป็นธรรม"],
    tag: "เงื่อนไขบริการ",
    category: "Unfair Business Practices",
  },
  {
    words: ["บริการ", "ติดต่อ", "service"],
    tag: "การติดต่อ",
    category: "Customer Service",
  },
];

export function classify(
  draft: ClaimDraft,
  businesses: PlatformState["businesses"],
): Classification {
  const text =
    `${draft.brand} ${draft.product} ${draft.description}`.toLowerCase();
  const business = businesses.find((b) =>
    b.brands.some((brand) =>
      draft.brand.trim()
        ? normalize(draft.brand) === normalize(brand)
        : normalize(text).includes(normalize(brand)),
    ),
  );
  const detectedBrand = business?.brands.find((brand) =>
    normalize(text).includes(normalize(brand)),
  );
  const product =
    draft.product.trim() ||
    (text.includes("nova x1")
      ? "Nova X1"
      : text.includes("home air")
        ? "Home Air"
        : "");
  const matches = issueRules.filter((rule) =>
    rule.words.some((word) => text.includes(word)),
  );
  return {
    brand: business?.brands[0] || draft.brand.trim() || detectedBrand || "",
    product,
    businessId: business?.id ?? null,
    category: draft.category || matches[0]?.category || "Customer Service",
    tags: matches.map((rule) => rule.tag),
    keywords: [
      ...new Set(
        matches.flatMap((rule) =>
          rule.words.filter((word) => text.includes(word)),
        ),
      ),
    ],
  };
}

export function assessRisk(text: string, duplicateEvidence = false): Risk {
  const high = [
    "ฆ่า",
    "ทำร้าย",
    "ประจาน",
    "มิจฉาชีพ",
    "โกง",
    "โจร",
    "scam",
    "fraud",
    "kill",
    "ข่มขู่",
    "หลักฐานปลอม",
  ];
  const medium = [
    "ทุกคน",
    "แน่นอน",
    "ตั้งใจหลอก",
    "แย่ที่สุด",
    "จงใจ",
    "always",
    "worst",
    "หลอกลวง",
  ];
  const reasons: string[] = [];
  const lowered = text.toLowerCase();
  if (high.some((word) => lowered.includes(word)))
    reasons.push("พบถ้อยคำกล่าวหารุนแรง คุกคาม หรือกล่าวอ้างที่ต้องตรวจสอบ");
  const sensitive =
    /(?:\d[\s-]?){10,13}|[\w.+-]+@[\w.-]+\.\w+|(?:ที่อยู่|address)\s*[:：]/i.test(
      text,
    );
  if (sensitive)
    reasons.push("อาจมีข้อมูลส่วนบุคคล เช่น หมายเลขโทรศัพท์ อีเมล หรือที่อยู่");
  if (duplicateEvidence)
    reasons.push(
      "พบไฟล์หลักฐานซ้ำ ต้องตรวจสอบบริบท ไม่ใช่ข้อสรุปว่าเป็นหลักฐานปลอม",
    );
  const level = reasons.length
    ? "high"
    : medium.some((word) => lowered.includes(word))
      ? "medium"
      : "low";
  if (level === "medium")
    reasons.push("พบถ้อยคำเหมารวมหรือสรุปเจตนาที่อาจต้องอธิบายเพิ่มเติม");
  // Only replace the identified expression. Never manufacture dates, purchases or outcomes.
  let suggestion = text;
  [...high, ...medium].forEach((word) => {
    suggestion = suggestion.replaceAll(
      new RegExp(word, "gi"),
      "[อธิบายเหตุการณ์ที่พบจริงแทนข้อความนี้]",
    );
  });
  suggestion = suggestion
    .replace(/(?:\d[\s-]?){10,13}/g, "[ลบหมายเลขส่วนบุคคล]")
    .replace(/[\w.+-]+@[\w.-]+\.\w+/g, "[ลบอีเมล]")
    .replace(/(?:ที่อยู่|address)\s*[:：].*/gi, "[ลบที่อยู่ส่วนบุคคล]");
  return { level, reasons, suggestion };
}

export function findCluster(clusters: Cluster[], info: Classification) {
  if (!info.brand || !info.product || !info.tags.length) return undefined;
  return clusters.find(
    (cluster) =>
      normalize(cluster.brand) === normalize(info.brand) &&
      normalize(cluster.product) === normalize(info.product) &&
      cluster.category === info.category &&
      cluster.tags.some((tag) => info.tags.includes(tag)),
  );
}

export function duplicateFingerprints(
  state: PlatformState,
  evidence: Evidence[],
  excludeClaimId?: string,
) {
  const existing = state.claims
    .filter((c) => c.id !== excludeClaimId)
    .flatMap((c) => c.evidence.map((e) => e.fingerprint));
  return evidence.filter(
    (e, i) =>
      existing.includes(e.fingerprint) ||
      evidence.slice(0, i).some((other) => other.fingerprint === e.fingerprint),
  );
}

export function riskForClaim(
  state: PlatformState,
  draft: ClaimDraft,
  excludeClaimId?: string,
) {
  return assessRisk(
    `${draft.brand} ${draft.product} ${draft.description} ${draft.requestedOutcome}`,
    duplicateFingerprints(state, draft.evidence, excludeClaimId).length > 0,
  );
}

export function submitClaim(
  state: PlatformState,
  draft: ClaimDraft,
  consumerId: string,
): PlatformState {
  const classification = classify(draft, state.businesses);
  const existing = findCluster(state.clusters, classification);
  const cluster: Cluster = existing ?? {
    id: id("group"),
    brand: classification.brand,
    product: classification.product,
    category: classification.category,
    tags: classification.tags,
    keywords: classification.keywords,
    review: "pending",
    reviewNote: "",
    reviewedClaimIds: [],
  };
  const claim: Claim = {
    ...draft,
    ...classification,
    id: id("LC"),
    consumerId,
    clusterId: cluster.id,
    status: "New",
    risk: riskForClaim(state, draft),
    contentReviewed: false,
    createdAt: new Date().toISOString(),
  };
  return {
    ...state,
    claims: [claim, ...state.claims],
    clusters: existing
      ? state.clusters.map((c) =>
          c.id === cluster.id
            ? {
                ...c,
                tags: [...new Set([...c.tags, ...classification.tags])],
                keywords: [
                  ...new Set([...c.keywords, ...classification.keywords]),
                ],
              }
            : c,
        )
      : [cluster, ...state.clusters],
    drafts: { ...state.drafts, [consumerId]: emptyDraft() },
    history: [
      historyEntry(
        claim.id,
        consumerId,
        `สร้างข้อร้องเรียน · ${classification.businessId ? "ส่งเข้ากล่องธุรกิจจำลอง" : "รอระบุธุรกิจที่เกี่ยวข้อง"} · จัดกลุ่มภายในแล้ว`,
      ),
      historyEntry(
        cluster.id,
        "ระบบจำลอง",
        "จัดกลุ่มข้อร้องเรียนใหม่และตรวจเงื่อนไขเผยแพร่ โดยไม่เปิดเผยข้อความดิบ",
      ),
      ...state.history,
    ],
  };
}

export function groupClaims(state: PlatformState, clusterId: string) {
  return state.claims.filter((c) => c.clusterId === clusterId);
}

export function publication(state: PlatformState, cluster: Cluster) {
  const claims = groupClaims(state, cluster.id);
  const distinct = new Set(claims.map((c) => c.consumerId)).size;
  const verified = new Set(
    claims
      .filter(
        (c) => state.consumers.find((u) => u.id === c.consumerId)?.verified,
      )
      .map((c) => c.consumerId),
  ).size;
  const evidenced = new Set(
    claims
      .filter((c) =>
        c.evidence.some(
          (e) => e.reviewed && e.relevant && e.consistent && !e.sensitive,
        ),
      )
      .map((c) => c.consumerId),
  ).size;
  const reasons: string[] = [];
  if (distinct < state.settings.minConsumers)
    reasons.push(
      `ผู้ร้องเรียนต่างบัญชี ${distinct}/${state.settings.minConsumers}`,
    );
  if (verified < state.settings.minVerified)
    reasons.push(
      `ยืนยันการติดต่อจำลอง ${verified}/${state.settings.minVerified}`,
    );
  if (evidenced < state.settings.minEvidence)
    reasons.push(
      `หลักฐานเกี่ยวข้องผ่านการตรวจ ${evidenced}/${state.settings.minEvidence}`,
    );
  if (claims.some((c) => c.risk.level !== "low" && !c.contentReviewed))
    reasons.push("มีเนื้อหาความเสี่ยงที่ผู้ดูแลยังไม่ตรวจ");
  if (cluster.review !== "approved") reasons.push(reviewLabels[cluster.review]);
  return {
    visible: reasons.length === 0,
    reasons,
    distinct,
    verified,
    evidenced,
  };
}

export function updateClaim(
  state: PlatformState,
  claim: Claim,
  actor: string,
  message: string,
): PlatformState {
  return {
    ...state,
    claims: state.claims.map((c) => (c.id === claim.id ? claim : c)),
    history: [historyEntry(claim.id, actor, message), ...state.history],
  };
}

export function reviewCluster(
  state: PlatformState,
  clusterId: string,
  review: Cluster["review"],
  note: string,
): PlatformState {
  const claims = groupClaims(state, clusterId);
  return {
    ...state,
    clusters: state.clusters.map((c) =>
      c.id === clusterId
        ? {
            ...c,
            review,
            reviewNote: note,
            reviewedClaimIds: claims.map((claim) => claim.id),
          }
        : c,
    ),
    claims: state.claims.map((c) =>
      c.clusterId === clusterId
        ? { ...c, contentReviewed: review === "approved" }
        : c,
    ),
    history: [
      historyEntry(
        clusterId,
        "ระบบจำลอง",
        `สถานะเผยแพร่: ${reviewLabels[review]} · ไม่ใช่การตัดสินข้อเท็จจริง`,
      ),
      historyEntry(
        clusterId,
        "ผู้ดูแลจำลอง",
        `${reviewLabels[review]} · ${note}`,
      ),
      ...state.history,
    ],
  };
}

export function validateSettings(settings: SafetySettings): SafetySettings {
  return {
    minConsumers: Math.min(
      10,
      Math.max(2, Math.floor(settings.minConsumers) || 2),
    ),
    minVerified: Math.min(
      10,
      Math.max(0, Math.floor(settings.minVerified) || 0),
    ),
    minEvidence: Math.min(
      10,
      Math.max(0, Math.floor(settings.minEvidence) || 0),
    ),
  };
}

export function businessClaims(state: PlatformState, businessId: string) {
  return state.claims.filter((c) => c.businessId === businessId);
}

export function publicEvidence(evidence: Evidence) {
  // Evidence is never public; this predicate authorizes only the relevant business.
  return evidence.shareWithBusiness && !evidence.sensitive;
}
