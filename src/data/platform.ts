import { emptyDraft, reviewCluster, submitClaim } from "../lib/platform.ts";
import type { PlatformState } from "../types/platform";

export function createDemoState(): PlatformState {
  let state: PlatformState = {
    version: 1,
    preferences: {
      theme: null,
      role: null,
      display:
        typeof window !== "undefined" && window.innerWidth < 760
          ? "mobile"
          : "desktop",
      consumerId: "consumer-you",
      businessId: "business-nova",
    },
    consumers: [
      { id: "consumer-you", name: "คุณ · ผู้ทดสอบ", verified: false },
      { id: "consumer-mali", name: "มะลิ · บัญชีตัวอย่าง", verified: true },
      {
        id: "consumer-niran",
        name: "นิรันดร์ · บัญชีตัวอย่าง",
        verified: true,
      },
    ],
    businesses: [
      {
        id: "business-nova",
        name: "Nova Mobile (ธุรกิจสมมติ)",
        brands: ["Nova", "โนวา"],
        verified: true,
      },
      {
        id: "business-home",
        name: "Home Care (ธุรกิจสมมติ)",
        brands: ["Home Care", "โฮมแคร์"],
        verified: false,
      },
    ],
    claims: [],
    clusters: [],
    posts: [],
    replies: [],
    reports: [],
    history: [],
    settings: { minConsumers: 2, minVerified: 1, minEvidence: 1 },
    drafts: {},
    legalDrafts: {},
  };
  for (const consumerId of ["consumer-mali", "consumer-niran"]) {
    state = submitClaim(
      state,
      {
        ...emptyDraft(),
        productType: "อิเล็กทรอนิกส์",
        brand: "Nova",
        product: "Nova X1",
        description:
          "แบตเตอรี่ Nova X1 ร้อนผิดปกติระหว่างชาร์จ จึงหยุดใช้และติดต่อร้านเพื่อขอให้ตรวจสอบ",
        category: "Consumer Safety",
        requestedOutcome: "ตรวจสอบและเปลี่ยนสินค้า",
        evidence: [
          {
            id: `demo-evidence-${consumerId}`,
            name: `บันทึกอาการ-${consumerId}.txt`,
            kind: "photo",
            mime: "text/plain",
            data: `data:text/plain;base64,${btoa("SYNTHETIC DEMO: Nova X1 battery temperature record. Not real purchase evidence. " + consumerId)}`,
            fingerprint: `demo-unique-${consumerId}`,
            shareWithBusiness: true,
            sensitive: false,
            relevant: true,
            consistent: true,
            reviewed: true,
          },
        ],
      },
      consumerId,
    );
  }
  state = reviewCluster(
    state,
    state.clusters[0].id,
    "approved",
    "ข้อมูลจำลองสำหรับทดสอบ: แยกบัญชี ตรวจความเกี่ยวข้อง และใช้หัวข้อกลาง ไม่ตัดสินข้อเท็จจริง",
  );
  state = submitClaim(
    state,
    {
      ...emptyDraft(),
      brand: "Home Care",
      product: "Home Air",
      description:
        "ขอคืนเงินเครื่องฟอกอากาศที่ไม่ทำงานหลังแกะกล่อง ยังไม่ได้รับคำตอบจากร้าน",
      category: "Refund & Return",
      requestedOutcome: "คืนเงิน",
    },
    "consumer-you",
  );
  state = submitClaim(
    state,
    {
      ...emptyDraft(),
      brand: "Nova",
      product: "Nova X1",
      description: "ร้านนี้โกงทุกคน ไม่ยอมซ่อมโทรศัพท์ให้ตามประกัน",
      category: "Warranty & After-Sales Service",
    },
    "consumer-mali",
  );
  state.drafts = {};
  return state;
}
