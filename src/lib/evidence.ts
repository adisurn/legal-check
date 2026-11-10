import { assessRisk, id } from "./platform";
import type { Evidence } from "../types/platform";

export const fileAccept = ".png,.jpg,.jpeg,.webp,.pdf,.txt";
export const uploadError =
  "แนบได้ไม่เกิน 3 ไฟล์ ไฟล์ละ 350 KB รองรับ PNG, JPG, WebP, PDF และ TXT เท่านั้น ลองย่อขนาดหรือเลือกไฟล์ใหม่";

export async function readEvidenceFiles(
  files: File[],
  existingCount: number,
): Promise<Evidence[]> {
  const allowed = [
    "image/png",
    "image/jpeg",
    "image/webp",
    "application/pdf",
    "text/plain",
  ];
  if (
    existingCount + files.length > 3 ||
    files.some((file) => file.size > 350_000 || !allowed.includes(file.type))
  ) {
    throw new Error(uploadError);
  }
  return Promise.all(
    files.map(async (file) => {
      const buffer = await file.arrayBuffer();
      const digest = await crypto.subtle.digest("SHA-256", buffer);
      const fingerprint = Array.from(new Uint8Array(digest), (byte) =>
        byte.toString(16).padStart(2, "0"),
      ).join("");
      const data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () =>
          reject(new Error("อ่านไฟล์ไม่ได้ ลองเลือกไฟล์ใหม่"));
        reader.readAsDataURL(file);
      });
      const text =
        file.type === "text/plain" ? new TextDecoder().decode(buffer) : "";
      const sensitive = assessRisk(`${file.name} ${text}`).reasons.some(
        (reason) => reason.includes("ข้อมูลส่วนบุคคล"),
      );
      return {
        id: id("evidence"),
        name: file.name,
        kind: "other",
        mime: file.type,
        data,
        fingerprint,
        shareWithBusiness: false,
        sensitive,
        relevant: null,
        consistent: null,
        reviewed: false,
      };
    }),
  );
}
