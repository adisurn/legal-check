import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";
import type { PlatformState } from "../src/types/platform";

const key = "legal-check-platform-v1";
const saved = (page: Page): Promise<PlatformState> =>
  page.evaluate(
    (storageKey) => JSON.parse(localStorage.getItem(storageKey)!),
    key,
  );
async function start(page: Page, theme = "Light Mode") {
  await page.goto("/");
  await page.getByRole("button", { name: theme }).click();
  await page.getByRole("button", { name: /เข้าสู่ Consumer Platform/ }).click();
  await expect(page.locator("h1")).toHaveText("เรื่องสิทธิ เริ่มต้นได้ที่นี่");
}
async function go(page: Page, view: string) {
  await page.goto(`/?view=${view}`);
  await expect(page.locator(".workspace-content")).toBeVisible();
}
async function role(page: Page, value: string) {
  await page.getByRole("combobox", { name: "สลับบทบาท" }).selectOption(value);
}

test("onboarding is theme then role; all preferences and theme persist", async ({
  page,
}) => {
  await start(page, "Dark Mode");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByRole("button", { name: "Mobile", exact: true }).click();
  await role(page, "business");
  await page.reload();
  await expect(page.locator(".device-workspace--mobile")).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.getByRole("combobox", { name: "สลับบทบาท" })).toHaveValue(
    "business",
  );
  await expect(page.locator(".platform-mobile-nav")).not.toContainText(
    "เตรียมเรื่อง",
  );
});

test("optional checklist submission persists, joins the matching group, and reaches only its business", async ({
  page,
}) => {
  await start(page);
  const before = await saved(page);
  await go(page, "assistant");
  await page
    .getByRole("textbox", { name: "เกิดอะไรขึ้นบ้าง?" })
    .fill("Nova X1 แบตเตอรี่ร้อนผิดปกติขณะชาร์จ");
  await page.getByRole("button", { name: "ต่อไป: เตรียมหลักฐาน" }).click();
  await page.getByRole("checkbox", { name: "ภาพหรือบันทึกอาการที่พบ" }).check();
  await page.getByRole("button", { name: "ตรวจสรุป", exact: true }).click();
  await expect(page.locator(".summary-grid")).toContainText("Nova X1");
  await page
    .getByRole("button", { name: "ยืนยันและส่งเรื่องในต้นแบบ" })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  const after = await saved(page);
  expect(after.claims.length).toBe(before.claims.length + 1);
  expect(after.clusters.length).toBe(before.clusters.length);
  expect(after.claims[0].businessId).toBe("business-nova");
  expect(after.claims[0].evidence).toHaveLength(0);
  await page.getByRole("button", { name: "ปิด", exact: true }).click();
  await role(page, "business");
  await go(page, "resolution");
  await expect(page.locator(".claim-list")).toContainText("Nova X1");
  await page
    .getByRole("combobox", { name: "เลือกธุรกิจจำลอง" })
    .selectOption("business-home");
  await expect(page.locator(".claim-list")).not.toContainText("Nova X1");
  await expect(page.locator(".claim-list")).toContainText("Home Air");
  await page.reload();
  expect((await saved(page)).claims[0].description).toContain("ร้อน");
});

test("high-risk allegations are private, neutral rewrite adds no facts, and new risks pause public groups", async ({
  page,
}) => {
  await start(page);
  await go(page, "assistant");
  await page.getByLabel("แบรนด์ / บริษัท", { exact: true }).fill("Nova");
  await page
    .getByRole("textbox", { name: "ชื่อสินค้า / รุ่น" })
    .fill("Nova X1");
  await page
    .getByRole("textbox", { name: "เกิดอะไรขึ้นบ้าง?" })
    .fill("แบตเตอรี่ร้อน ร้านโกง");
  await page.getByRole("button", { name: "ต่อไป: เตรียมหลักฐาน" }).click();
  await page.getByRole("button", { name: "ตรวจสรุป", exact: true }).click();
  await expect(page.locator(".risk-preview")).toContainText("ความเสี่ยงสูง");
  await expect(page.locator(".risk-preview blockquote")).not.toContainText(
    "โกง",
  );
  await page
    .getByRole("button", { name: "ยืนยันและส่งเรื่องในต้นแบบ" })
    .click();
  await page.getByRole("button", { name: "ปิด", exact: true }).click();
  await go(page, "connect");
  await expect(page.locator(".discussion-row")).toHaveCount(0);
  await expect(page.locator(".workspace-content")).not.toContainText("ร้านโกง");
  await page.reload();
  expect((await saved(page)).claims[0].risk.level).toBe("high");
});

test("evidence remains private unless authorized; sensitive files are withheld; response and status persist", async ({
  page,
}) => {
  await start(page);
  await go(page, "assistant");
  await page.getByLabel("แบรนด์ / บริษัท", { exact: true }).fill("Nova");
  await page
    .getByRole("textbox", { name: "ชื่อสินค้า / รุ่น" })
    .fill("Nova X2");
  await page
    .getByRole("textbox", { name: "เกิดอะไรขึ้นบ้าง?" })
    .fill("สินค้าใช้งานไม่ได้");
  await page.getByRole("button", { name: "ต่อไป: เตรียมหลักฐาน" }).click();
  await page
    .getByLabel("แนบหลักฐาน", { exact: true })
    .setInputFiles({
      name: "receipt.txt",
      mimeType: "text/plain",
      buffer: Buffer.from("SYNTHETIC DEMO receipt"),
    });
  await expect(page.locator(".evidence-item")).toHaveCount(1);
  await page
    .getByRole("checkbox", { name: "อนุญาตให้ธุรกิจที่เกี่ยวข้องดูไฟล์นี้" })
    .check();
  await page.getByRole("button", { name: "ตรวจสรุป", exact: true }).click();
  await page
    .getByRole("button", { name: "ยืนยันและส่งเรื่องในต้นแบบ" })
    .click();
  await page.getByRole("button", { name: "ปิด", exact: true }).click();
  await role(page, "business");
  await go(page, "resolution");
  await page.locator(".claim-row").filter({ hasText: "Nova X2" }).click();
  await expect(
    page
      .getByRole("dialog")
      .getByRole("link", { name: "ดาวน์โหลดไฟล์หลักฐาน" }),
  ).toBeVisible();
  await page
    .getByRole("combobox", { name: "สถานะ", exact: true })
    .selectOption("In Progress");
  await page
    .getByRole("textbox", { name: "คำตอบถึงผู้บริโภค" })
    .fill("ขอรับสินค้าตรวจสอบ และจะแจ้งผลให้ทราบ");
  await page.getByRole("button", { name: "บันทึกคำตอบ", exact: true }).click();
  await page.getByRole("button", { name: "ปิด", exact: true }).click();
  await role(page, "consumer");
  await go(page, "claims");
  await page.locator(".claim-row").filter({ hasText: "Nova X2" }).click();
  await expect(page.locator(".business-reply")).toContainText(
    "ขอรับสินค้าตรวจสอบ",
  );
  await page
    .getByRole("checkbox", { name: "มีข้อมูลอ่อนไหวที่ยังไม่ได้ปิดบัง" })
    .check();
  await page.getByRole("button", { name: "ปิด", exact: true }).click();
  await role(page, "business");
  await go(page, "resolution");
  await page.locator(".claim-row").filter({ hasText: "Nova X2" }).click();
  await expect(
    page
      .getByRole("dialog")
      .getByRole("link", { name: "ดาวน์โหลดไฟล์หลักฐาน" }),
  ).toHaveCount(0);
  await page.reload();
  const state = await saved(page);
  expect(state.claims[0].status).toBe("In Progress");
  expect(state.replies.at(-1)?.text).toContain("ขอรับสินค้าตรวจสอบ");
  expect(state.claims[0].evidence[0].data).toContain("data:text/plain");
});

test("community posts, business right to reply, reports, moderation, history and appeal remain functional", async ({
  page,
}) => {
  await start(page);
  await go(page, "connect");
  await page.locator(".discussion-row").first().click();
  await page
    .getByRole("textbox", { name: "ประสบการณ์ของคุณ" })
    .fill("พบแบตเตอรี่ร้อนขณะชาร์จ จึงหยุดใช้");
  await page.getByRole("button", { name: "แบ่งปันประสบการณ์" }).click();
  await expect(page.locator(".discussion-post")).toContainText("จึงหยุดใช้");
  await page
    .getByRole("textbox", { name: "ประสบการณ์ของคุณ" })
    .fill("ร้านโกงทุกคน");
  await page.getByRole("button", { name: "แบ่งปันประสบการณ์" }).click();
  await expect(page.locator(".discussion-post").last()).toContainText(
    "เห็นเฉพาะผู้เขียนและผู้ดูแล",
  );
  await role(page, "business");
  await go(page, "resolution");
  await page
    .locator(".claim-row")
    .filter({ hasText: "ความปลอดภัย" })
    .first()
    .click();
  await page
    .getByRole("textbox", { name: "คำตอบถึงผู้บริโภค" })
    .fill("ทีมงานพร้อมรับตรวจสอบสินค้า กรุณาติดต่อผ่านข้อร้องเรียนส่วนตัว");
  await page
    .getByRole("checkbox", { name: /แชร์คำตอบที่ใช้ถ้อยคำกลาง/ })
    .check();
  await page.getByRole("button", { name: "บันทึกคำตอบ", exact: true }).click();
  await page.getByRole("button", { name: "ปิด", exact: true }).click();
  await go(page, "connect");
  await page.locator(".discussion-row").first().click();
  await expect(page.locator(".discussion-post")).not.toContainText("ร้านโกง");
  await expect(page.locator(".business-reply")).toContainText("ทีมงานพร้อม");
  await page.locator(".report-panel summary").click();
  await page
    .getByRole("textbox", { name: "เหตุผล", exact: true })
    .fill("ขอให้ตรวจบริบทของข้อมูล ไม่ขอให้ซ่อนอัตโนมัติ");
  await page.getByRole("button", { name: "ส่งให้ผู้ดูแล" }).click();
  expect(
    (await saved(page)).clusters.filter((c) => c.review === "approved"),
  ).toHaveLength(1);
  await role(page, "moderator");
  await go(page, "moderation");
  await page
    .getByRole("textbox", { name: "ผลการทบทวน / เหตุผล" })
    .fill("ตรวจข้อมูลทั้งสองฝ่ายแล้ว ส่งต่อการดูแลในกลุ่ม");
  await page
    .getByRole("button", { name: "บันทึกผลทบทวน", exact: true })
    .click();
  const group = page
    .locator(".moderation-group")
    .filter({
      has: page.getByRole("heading", { name: "Nova · Nova X1", exact: true }),
    })
    .filter({ hasText: "ความปลอดภัย" });
  await group
    .getByRole("textbox", { name: "เหตุผลการพิจารณา Nova X1" })
    .fill("ขอตรวจบริบทเพิ่มเติมก่อนเผยแพร่");
  await group.getByRole("button", { name: "ซ่อนสาธารณะ", exact: true }).click();
  expect((await saved(page)).claims).toHaveLength(4);
  await role(page, "consumer");
  await go(page, "connect");
  await expect(page.locator(".discussion-row")).toHaveCount(0);
  await page.getByRole("button", { name: "เปิดเมนู" }).isVisible(); // desktop menu remains hidden
  await page
    .getByRole("combobox", { name: "เลือกผู้บริโภคจำลอง" })
    .selectOption("consumer-mali");
  await go(page, "claims");
  await page.locator(".claim-row").filter({ hasText: "ความปลอดภัย" }).click();
  await page
    .getByRole("textbox", { name: "เหตุผลที่ต้องการให้ทบทวน" })
    .fill("ขอให้พิจารณาการเผยแพร่ใหม่ตามข้อมูลที่มี");
  await page.getByRole("button", { name: "ส่งคำขอทบทวน" }).click();
  await page.reload();
  const state = await saved(page);
  expect(state.reports.some((r) => r.kind === "appeal")).toBe(true);
  expect(state.reports.some((r) => r.status === "reviewed")).toBe(true);
  expect(state.posts).toHaveLength(2);
  expect(state.history.some((h) => h.message.includes("ซ่อนโดยผู้ดูแล"))).toBe(
    true,
  );
});

test("role-specific legal checks and filters work without external requests", async ({
  page,
}) => {
  const external: string[] = [];
  page.on("request", (request) => {
    if (!new URL(request.url()).hostname.match(/^(localhost|127\.0\.0\.1)$/))
      external.push(request.url());
  });
  await start(page);
  await go(page, "legal");
  await page.getByRole("button", { name: "ใช้สถานการณ์ตัวอย่าง" }).click();
  await page.getByRole("button", { name: "วิเคราะห์ด้วยกฎจำลอง" }).click();
  await expect(page.locator(".legal-results")).toContainText(
    "หลักกฎหมายที่อาจเกี่ยวข้อง",
  );
  await page.reload();
  await expect(page.locator(".legal-workspace textarea")).toContainText(
    "Nova X1",
  );
  await role(page, "business");
  await page.getByRole("button", { name: "ใช้สถานการณ์ตัวอย่าง" }).click();
  await page.getByRole("button", { name: "วิเคราะห์ด้วยกฎจำลอง" }).click();
  await expect(page.locator(".legal-results")).toContainText(
    "แนวทางสำหรับธุรกิจ",
  );
  await go(page, "resolution");
  await page
    .getByRole("textbox", { name: "ค้นหาข้อร้องเรียนหรือกลุ่ม" })
    .fill("หยุดใช้");
  await expect(page.locator(".claim-row")).toHaveCount(2);
  await page
    .getByRole("combobox", { name: "กรองประเภทปัญหา" })
    .selectOption("Warranty & After-Sales Service");
  await expect(page.locator(".empty-state")).toBeVisible();
  expect(external).toEqual([]);
});

test("corrupt storage is not silently overwritten", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(
    (storageKey) => localStorage.setItem(storageKey, "{invalid"),
    key,
  );
  await page.reload();
  await expect(page.getByRole("alert")).toContainText(
    "ข้อมูลเดิมจะไม่ถูกเขียนทับ",
  );
  await page.getByRole("button", { name: "Light Mode" }).click();
  expect(
    await page.evaluate((storageKey) => localStorage.getItem(storageKey), key),
  ).toBe("{invalid");
});

test("moderator reviews optional evidence and approves a genuinely multi-account group", async ({
  page,
}) => {
  await start(page);
  await page
    .getByRole("combobox", { name: "เลือกผู้บริโภคจำลอง" })
    .selectOption("consumer-mali");
  await go(page, "assistant");
  await page.getByLabel("แบรนด์ / บริษัท", { exact: true }).fill("Home Care");
  await page
    .getByRole("textbox", { name: "ชื่อสินค้า / รุ่น" })
    .fill("Home Air");
  await page
    .getByRole("textbox", { name: "เกิดอะไรขึ้นบ้าง?" })
    .fill("สินค้าไม่ทำงานหลังแกะกล่อง ต้องการคืนเงิน");
  await page.getByRole("button", { name: "ต่อไป: เตรียมหลักฐาน" }).click();
  await page
    .getByLabel("แนบหลักฐาน", { exact: true })
    .setInputFiles({
      name: "home-record.txt",
      mimeType: "text/plain",
      buffer: Buffer.from(
        "SYNTHETIC DEMO home appliance record, no personal information",
      ),
    });
  await expect(page.locator(".evidence-item")).toHaveCount(1);
  await page.getByRole("button", { name: "ตรวจสรุป", exact: true }).click();
  await page
    .getByRole("button", { name: "ยืนยันและส่งเรื่องในต้นแบบ" })
    .click();
  await page.getByRole("button", { name: "ปิด", exact: true }).click();
  await role(page, "moderator");
  await go(page, "moderation");
  const group = page
    .locator(".moderation-group")
    .filter({ hasText: "Home Air" });
  await group
    .locator(".moderation-claim")
    .filter({ hasText: "สินค้าไม่ทำงาน" })
    .click();
  await page
    .getByRole("checkbox", { name: "เกี่ยวข้องกับข้อร้องเรียน", exact: true })
    .check();
  await page
    .getByRole("checkbox", {
      name: "สอดคล้องกับรายละเอียดที่ให้มา",
      exact: true,
    })
    .check();
  await page.getByRole("button", { name: "ปิด", exact: true }).click();
  await group
    .getByRole("textbox", { name: "เหตุผลการพิจารณา Home Air" })
    .fill(
      "สองบัญชีรายงานประเด็นเดียวกัน ตรวจความเกี่ยวข้องของไฟล์แล้ว ไม่สรุปความผิด",
    );
  await group
    .getByRole("button", { name: "อนุมัติหลังตรวจเนื้อหา", exact: true })
    .click();
  await expect(group).toContainText("เผยแพร่แล้ว");
  await role(page, "consumer");
  await go(page, "connect");
  await expect(
    page.locator(".discussion-row").filter({ hasText: "Home Air" }),
  ).toBeVisible();
  await page.reload();
  expect(
    (await saved(page)).clusters.find((c) => c.product === "Home Air")?.review,
  ).toBe("approved");
});

test("failed storage writes report an error without claiming success or changing saved preferences", async ({
  page,
}) => {
  await start(page);
  await page.evaluate(() => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (key === "legal-check-platform-v1")
        throw new DOMException("Quota exceeded", "QuotaExceededError");
      return original.call(this, key, value);
    };
  });
  await page.getByRole("button", { name: "เปลี่ยนเป็น Dark Mode" }).click();
  await expect(page.getByRole("alert")).toContainText("บันทึกไม่สำเร็จ");
  expect((await saved(page)).preferences.theme).toBe("light");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

test("all workspaces fit phone sizes, dark/light themes and desktop; capture final surfaces", async ({
  page,
}) => {
  await start(page);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: width < 500 ? 844 : 1000 });
    await page.getByRole("button", { name: "Mobile", exact: true }).click();
    for (const currentRole of ["consumer", "business", "moderator"]) {
      await role(page, currentRole);
      const views =
        currentRole === "consumer"
          ? ["overview", "assistant", "claims", "connect", "legal"]
          : currentRole === "business"
            ? ["overview", "resolution", "connect", "legal"]
            : ["moderation", "settings"];
      for (const view of views) {
        await go(page, view);
        const overflows = await page
          .locator(".workspace-content")
          .evaluate((el) => el.scrollWidth > el.clientWidth + 1);
        expect(overflows, `${width} ${currentRole} ${view} overflows`).toBe(
          false,
        );
      }
    }
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await role(page, "consumer");
  await page.getByRole("button", { name: "Desktop", exact: true }).click();
  await go(page, "overview");
  await page.screenshot({ path: ".impeccable/review/desktop.png" });
  await page.getByRole("button", { name: "Mobile", exact: true }).click();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: ".impeccable/review/mobile.png" });
  await page.getByRole("button", { name: "เปิดเมนู" }).click();
  await expect(page.locator(".platform-sidebar")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "เปิดเมนู" })).toBeFocused();
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.getByRole("button", { name: "Desktop", exact: true }).click();
  await role(page, "business");
  await go(page, "resolution");
  await page.getByRole("button", { name: "เปลี่ยนเป็น Dark Mode" }).click();
  await page.screenshot({ path: ".impeccable/review/business-dark.png" });
  await role(page, "moderator");
  await go(page, "moderation");
  await page.screenshot({ path: ".impeccable/review/moderation.png" });
  await role(page, "consumer");
  await go(page, "assistant");
  await page.screenshot({ path: ".impeccable/review/assistant.png" });
  expect(errors).toEqual([]);
});
