import { expect, test } from "@playwright/test";

test("English and Thai use bundled fonts, including mixed-language text", async ({
  page,
}) => {
  const fontRequests: string[] = [];
  page.on("request", (request) => {
    if (request.resourceType() === "font") fontRequests.push(request.url());
  });
  await page.goto("/");
  await page.evaluate(async () => {
    const probe = document.createElement("div");
    probe.id = "font-probe";
    probe.textContent = "Legal Check เรื่องสิทธิ";
    document.body.append(probe);
    await document.fonts.ready;
  });

  // Inspect actual glyph rendering, not just the declared CSS font stack.
  const session = await page.context().newCDPSession(page);
  await session.send("DOM.enable");
  await session.send("CSS.enable");
  const { root } = await session.send("DOM.getDocument");
  const { nodeId } = await session.send("DOM.querySelector", {
    nodeId: root.nodeId,
    selector: "#font-probe",
  });
  for (const weight of ["400", "650"]) {
    await page.locator("#font-probe").evaluate(async (el, value) => {
      el.style.fontWeight = value;
      await document.fonts.ready;
    }, weight);
    const { fonts } = await session.send("CSS.getPlatformFontsForNode", {
      nodeId,
    });
    expect(fonts).toHaveLength(2);
    expect(fonts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          familyName: expect.stringMatching(/^Inter/),
          isCustomFont: true,
        }),
        expect.objectContaining({
          familyName: expect.stringMatching(/^IBM Plex Sans Thai/),
          isCustomFont: true,
        }),
      ]),
    );
    expect(fonts.every((font) => font.glyphCount > 0)).toBe(true);
  }
  await session.detach();
  expect(fontRequests).toHaveLength(2);
  expect(
    fontRequests.every((url) => new URL(url).origin === new URL(page.url()).origin),
  ).toBe(true);
});
