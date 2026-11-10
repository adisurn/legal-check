import { useState } from "react";
import type { Commit } from "../../hooks/use-platform";
import { categoryLabels, classify, emptyDraft } from "../../lib/platform";
import type { PlatformState } from "../../types/platform";
import { Icon } from "../icon";
import { ViewLink } from "../view-link";
import { Badge, Notice } from "./shared";

export function LegalAdvisor({
  state,
  commit,
}: {
  state: PlatformState;
  commit: Commit;
}) {
  const business = state.preferences.role === "business";
  const key = `${business ? "business" : "consumer"}-${business ? state.preferences.businessId : state.preferences.consumerId}`;
  const text = state.legalDrafts[key] ?? "";
  const [result, setResult] = useState(false);
  const info = classify(
    { ...emptyDraft(), description: text },
    state.businesses,
  );
  const riskyPolicy =
    /ไม่คืนเงิน|ไม่รับผิด|ทุกกรณี|สงวนสิทธิ|no refund|not responsible/i.test(
      text,
    );
  return (
    <>
      <div className="page-title">
        <div>
          <h1>
            {business
              ? "ตรวจนโยบาย ก่อนกลายเป็นข้อพิพาท"
              : "เข้าใจสิทธิ ก่อนเดินหน้าต่อ"}
          </h1>
          <p>
            AI Legal Check ·{" "}
            {business ? "สำหรับธุรกิจและผู้ประกอบการ" : "สำหรับผู้บริโภค"}
          </p>
        </div>
        <Badge tone="brand">Rule-based AI simulation</Badge>
      </div>
      <Notice>
        วิเคราะห์ด้วยกฎและคำสำคัญในเบราว์เซอร์ ไม่มี AI
        หรือบริการภายนอกเชื่อมต่อ เป็นข้อมูลกฎหมายทั่วไป
        ไม่ใช่คำปรึกษาวิชาชีพหรือคำตัดสินข้อพิพาท
      </Notice>
      <section className="surface legal-workspace">
        <h2>
          {business
            ? "นโยบายหรือแนวทางรับมือข้อร้องเรียน"
            : "เล่าเหตุการณ์ที่คุณกำลังเผชิญ"}
        </h2>
        <p className="supporting">
          {business
            ? "ลองวางเงื่อนไขคืนเงิน การรับประกัน หรือวิธีตอบลูกค้า โดยไม่ใส่ข้อมูลส่วนตัว"
            : "อธิบายปัญหาสินค้า เงื่อนไขที่พบ หรือสิ่งที่ธุรกิจแจ้ง เพื่อดูแนวทางเตรียมเรื่อง"}
        </p>
        <label className="field">
          {business
            ? "ข้อความนโยบาย / ปัญหาที่ต้องการตรวจ"
            : "สถานการณ์ / เงื่อนไขที่ต้องการตรวจ"}
          <textarea
            rows={7}
            maxLength={6000}
            value={text}
            onChange={(e) => {
              setResult(false);
              commit((s) => ({
                ...s,
                legalDrafts: { ...s.legalDrafts, [key]: e.target.value },
              }));
            }}
            placeholder={
              business
                ? "เช่น นโยบายไม่รับคืนสินค้าและไม่คืนเงินทุกกรณี"
                : "เช่น Nova X1 แบตเตอรี่ร้อนผิดปกติระหว่างชาร์จ ร้านขอให้ส่งตรวจ"
            }
          />
        </label>
        <div className="form-actions">
          <button
            className="button button--secondary"
            onClick={() => {
              const sample = business
                ? "ร้านกำหนดไม่รับคืนสินค้าและไม่คืนเงินทุกกรณี แม้สินค้าชำรุด"
                : "Nova X1 แบตเตอรี่ร้อนผิดปกติขณะชาร์จ ต้องการตรวจสอบสิทธิการรับประกัน";
              if (
                commit((s) => ({
                  ...s,
                  legalDrafts: { ...s.legalDrafts, [key]: sample },
                }))
              )
                setResult(false);
            }}
          >
            ใช้สถานการณ์ตัวอย่าง
          </button>
          <button
            className="button button--primary"
            disabled={!text.trim()}
            onClick={() => setResult(true)}
          >
            <Icon name="scan" size={18} />
            วิเคราะห์ด้วยกฎจำลอง
          </button>
        </div>
      </section>
      {result && (
        <section className="surface legal-results" aria-live="polite">
          <div className="section-line">
            <h2>แนวทางจากข้อมูลที่ให้</h2>
            <Badge>{categoryLabels[info.category]}</Badge>
          </div>
          <p className="supporting">
            ผลจำลองจัดหมวดจากคำสำคัญ:{" "}
            {info.keywords.join(", ") || "ไม่พบคำสำคัญเฉพาะ ให้แนวทางทั่วไป"}
          </p>
          {riskyPolicy && (
            <Notice warning>
              พบคำที่ควรตรวจบริบท เช่น “ไม่คืนเงิน”
              หรือการยกเว้นความรับผิดแบบครอบคลุม
              ไม่ได้หมายความว่าข้อกำหนดนั้นผิดกฎหมายโดยอัตโนมัติ
            </Notice>
          )}
          <div className="legal-sections">
            <section>
              <h3>หลักกฎหมายที่อาจเกี่ยวข้อง</h3>
              <p>
                พระราชบัญญัติคุ้มครองผู้บริโภค: สิทธิได้รับข้อมูลที่ถูกต้อง
                ความปลอดภัย และความเป็นธรรมในการทำสัญญา
              </p>
              <p>
                ประมวลกฎหมายแพ่งและพาณิชย์:
                ความรับผิดในความชำรุดบกพร่องและข้อผูกพันตามสัญญา
                ขึ้นอยู่กับข้อเท็จจริง เงื่อนไข และระยะเวลาที่เกี่ยวข้อง
              </p>
              <p>
                กฎหมายว่าด้วยข้อสัญญาที่ไม่เป็นธรรมอาจต้องพิจารณาเมื่อมีการยกเว้นความรับผิดที่กว้างเกินสมควร
                ควรให้ผู้เชี่ยวชาญตรวจข้อความจริง
              </p>
            </section>
            <section>
              <h3>
                {business ? "แนวทางสำหรับธุรกิจ" : "สิทธิและทางเลือกเบื้องต้น"}
              </h3>
              <ol>
                {(business
                  ? [
                      "รับเรื่องและให้เลขอ้างอิง แจ้งระยะเวลาที่จะตรวจสอบอย่างชัดเจน",
                      "ตรวจเงื่อนไขรับประกัน ข้อเท็จจริง และหลักฐานที่ลูกค้าสะดวกให้ ไม่บังคับใบเสร็จในทุกกรณี",
                      "เสนอวิธีตรวจ ซ่อม เปลี่ยน หรือคืนเงินตามข้อเท็จจริงและข้อผูกพัน ไม่สรุปสิทธิโดยอัตโนมัติ",
                      "ตอบด้วยถ้อยคำเป็นกลาง บันทึกผล และเปิดทางให้ขอทบทวน",
                    ]
                  : [
                      "หากมีประเด็นความปลอดภัย ให้หยุดใช้สินค้าที่อาจเป็นอันตรายและขอคำแนะนำที่เหมาะสม",
                      "เก็บรายละเอียดสินค้า เงื่อนไข ภาพปัญหา และลำดับเหตุการณ์",
                      "แจ้งผู้ขายเป็นลายลักษณ์อักษร อธิบายสิ่งที่พบและสิ่งที่ต้องการให้ช่วย",
                      "หากตกลงไม่ได้ ขอคำแนะนำจากหน่วยงานที่เกี่ยวข้องหรือผู้เชี่ยวชาญ",
                    ]
                ).map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </section>
            <section>
              <h3>หลักฐานที่อาจช่วยให้ตรวจสอบได้</h3>
              <p>
                ใบสั่งซื้อหรือหลักฐานชำระเงิน (ถ้ามี) ภาพหรือบันทึกอาการ
                รายละเอียดโฆษณา เงื่อนไขรับประกัน และประวัติการติดต่อ
                ไม่จำเป็นต้องมีครบทุกอย่าง และควรปิดบังข้อมูลส่วนตัว
              </p>
            </section>
            <section>
              <h3>ช่องทางช่วยเหลือ</h3>
              <p>
                สคบ. โทร 1166 สำหรับคำแนะนำเรื่องคุ้มครองผู้บริโภค · ETDA โทร
                1212 สำหรับปัญหาธุรกรรมออนไลน์ตามขอบเขตบริการ
                ตรวจสอบข้อมูลจากช่องทางทางการก่อนดำเนินการ
              </p>
              <p>
                Lemon Law ในต้นแบบกล่าวถึงแนวคิดและร่างกฎหมายเท่านั้น
                ไม่ยืนยันว่ามีผลบังคับใช้ ควรตรวจราชกิจจานุเบกษาหรือสอบถาม สคบ.
                ก่อนอ้างสิทธิ
              </p>
            </section>
          </div>
          <ViewLink
            view={business ? "resolution" : "assistant"}
            className="button button--primary"
          >
            {business ? "กลับไปดูแลข้อร้องเรียน" : "นำแนวทางไปเตรียมเรื่อง"}
            <Icon name="arrow" size={17} />
          </ViewLink>
        </section>
      )}
    </>
  );
}
