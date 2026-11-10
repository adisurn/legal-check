import { useState } from "react";
import type { Commit } from "../../hooks/use-platform";
import {
  assessRisk,
  categories,
  categoryLabels,
  classify,
  duplicateFingerprints,
  emptyDraft,
  evidenceLabels,
  riskForClaim,
  submitClaim,
} from "../../lib/platform";
import { fileAccept, readEvidenceFiles } from "../../lib/evidence";
import type { ClaimDraft, Evidence, PlatformState } from "../../types/platform";
import { Icon } from "../icon";
import { Badge, Notice, RiskBadge } from "./shared";

const steps = [
  "เรื่องที่อยากร้องเรียน",
  "เตรียมหลักฐาน",
  "ตรวจสรุปและส่งเรื่อง",
];
const evidenceChecklist = [
  "รายละเอียดสินค้าและโฆษณา",
  "หลักฐานการซื้อหรือการชำระเงิน (ถ้ามี)",
  "ภาพหรือบันทึกอาการที่พบ",
  "ประวัติการติดต่อธุรกิจ",
  "เงื่อนไขรับประกัน (ถ้ามี)",
];

export function ClaimAssistant({
  state,
  commit,
  onCreated,
}: {
  state: PlatformState;
  commit: Commit;
  onCreated: (id: string) => void;
}) {
  const consumerId = state.preferences.consumerId;
  const draft = state.drafts[consumerId] ?? emptyDraft();
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [reading, setReading] = useState(false);
  const info = classify(draft, state.businesses);
  const duplicates = duplicateFingerprints(state, draft.evidence);
  const risk = {
    ...riskForClaim(state, draft),
    suggestion: assessRisk(draft.description).suggestion,
  };
  const update = (changes: Partial<ClaimDraft>) =>
    commit((s) => ({
      ...s,
      drafts: {
        ...s.drafts,
        [consumerId]: { ...(s.drafts[consumerId] ?? emptyDraft()), ...changes },
      },
    }));
  const updateEvidence = (evidenceId: string, changes: Partial<Evidence>) =>
    update({
      evidence: draft.evidence.map((e) =>
        e.id === evidenceId ? { ...e, ...changes } : e,
      ),
    });
  const attach = async (files: FileList | null) => {
    if (!files?.length) return;
    setError("");
    const list = Array.from(files);
    setReading(true);
    try {
      const evidence = await readEvidenceFiles(list, draft.evidence.length);
      if (!update({ evidence: [...draft.evidence, ...evidence] }))
        setError("บันทึกไฟล์ไม่ได้ โปรดตรวจพื้นที่จัดเก็บแล้วลองใหม่");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "อ่านไฟล์ไม่ได้ ลองเลือกไฟล์ใหม่",
      );
    } finally {
      setReading(false);
    }
  };
  const submit = () => {
    if (
      ![draft.description, draft.brand, draft.product, draft.category].some(
        (value) => value.trim(),
      )
    ) {
      setError(
        "เพิ่มข้อมูลอย่างน้อยหนึ่งอย่าง เช่น สินค้า ประเภทปัญหา หรือสิ่งที่เกิดขึ้น ไม่ต้องกรอกครบทุกช่อง",
      );
      return;
    }
    let created = "";
    if (
      commit((s) => {
        const next = submitClaim(s, draft, consumerId);
        created = next.claims[0].id;
        return next;
      })
    ) {
      setStep(0);
      onCreated(created);
    }
  };
  return (
    <>
      <div className="page-title">
        <div>
          <h1>เตรียมเรื่องให้พร้อม ทีละข้อ</h1>
          <p>
            Claim Assistant · ข้ามข้อมูลที่ยังไม่ทราบได้ ไม่จำเป็นต้องมีใบเสร็จ
          </p>
        </div>
        <Badge tone="brand">บันทึกร่างอัตโนมัติ</Badge>
      </div>
      <ol className="assistant-steps">
        {steps.map((label, index) => (
          <li
            key={label}
            className={
              step === index ? "current" : step > index ? "complete" : ""
            }
          >
            <button
              onClick={() => {
                setStep(index);
                setError("");
              }}
              aria-current={step === index ? "step" : undefined}
            >
              <span>{index + 1}</span>
              {label}
            </button>
          </li>
        ))}
      </ol>
      <div className="assistant-layout">
        <section className="surface assistant-surface" aria-label={steps[step]}>
          {step === 0 && (
            <>
              <h2>เริ่มจากสิ่งที่คุณทราบ</h2>
              <p className="supporting">
                ทุกช่องเป็นตัวเลือก ระบบจะช่วยจัดหมวดหมู่จากข้อมูลที่มี
              </p>
              <label className="field">
                สินค้า / บริการประเภทใด
                <select
                  value={draft.productType}
                  onChange={(e) => update({ productType: e.target.value })}
                >
                  <option value="">ยังไม่ระบุ</option>
                  {[
                    "อิเล็กทรอนิกส์",
                    "เครื่องใช้ในบ้าน",
                    "สินค้าอุปโภคบริโภค",
                    "บริการ",
                    "อื่น ๆ",
                  ].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </label>
              <div className="field-grid">
                <label className="field">
                  แบรนด์ / บริษัท
                  <input
                    list="demo-brands"
                    placeholder="เช่น Nova"
                    value={draft.brand}
                    maxLength={100}
                    onChange={(e) => update({ brand: e.target.value })}
                  />
                  <datalist id="demo-brands">
                    <option value="Nova" />
                    <option value="Home Care" />
                  </datalist>
                </label>
                <label className="field">
                  ชื่อสินค้า / รุ่น
                  <input
                    placeholder="เช่น Nova X1"
                    value={draft.product}
                    maxLength={100}
                    onChange={(e) => update({ product: e.target.value })}
                  />
                </label>
              </div>
              <label className="field">
                เกิดอะไรขึ้นบ้าง?
                <textarea
                  rows={5}
                  maxLength={4000}
                  placeholder="เล่าเหตุการณ์ที่คุณพบ เช่น แบตเตอรี่ร้อนขณะชาร์จ และได้ติดต่อร้านแล้ว"
                  value={draft.description}
                  onChange={(e) => update({ description: e.target.value })}
                />
                <small>
                  เล่าเฉพาะสิ่งที่ทราบ
                  หลีกเลี่ยงข้อมูลส่วนบุคคลและการสรุปเจตนาของผู้อื่น
                </small>
              </label>
              <fieldset className="category-checklist">
                <legend>
                  ประเภทปัญหา <span>(เลือกเองหรือให้ระบบแนะนำ)</span>
                </legend>
                <div className="category-options">
                  {categories.map((category) => (
                    <label
                      key={category}
                      className={draft.category === category ? "selected" : ""}
                    >
                      <input
                        type="radio"
                        name="category"
                        value={category}
                        checked={draft.category === category}
                        onChange={() => update({ category })}
                      />
                      {categoryLabels[category]}
                    </label>
                  ))}
                </div>
                <button
                  className="inline-link"
                  onClick={() => update({ category: "" })}
                >
                  ใช้การจัดหมวดหมู่จำลอง
                </button>
              </fieldset>
              <label className="field">
                อยากให้ธุรกิจช่วยอย่างไร?
                <input
                  maxLength={250}
                  placeholder="เช่น ตรวจสอบ เปลี่ยนสินค้า หรือขอคำอธิบาย"
                  value={draft.requestedOutcome}
                  onChange={(e) => update({ requestedOutcome: e.target.value })}
                />
              </label>
            </>
          )}
          {step === 1 && (
            <>
              <h2>มีอะไรพร้อมแล้วบ้าง?</h2>
              <p className="supporting">
                ใช้เช็กลิสต์นี้ช่วยเตรียมเรื่อง
                ไม่ใช่เงื่อนไขบังคับรับข้อร้องเรียน
              </p>
              <div className="evidence-checklist">
                {evidenceChecklist.map((label) => (
                  <label key={label}>
                    <input
                      type="checkbox"
                      checked={draft.ready.includes(label)}
                      onChange={() =>
                        update({
                          ready: draft.ready.includes(label)
                            ? draft.ready.filter((v) => v !== label)
                            : [...draft.ready, label],
                        })
                      }
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
              <label className="upload-area">
                <Icon name="upload" size={25} />
                <strong>
                  {reading
                    ? "กำลังอ่านและบันทึกไฟล์…"
                    : "แนบหลักฐาน (ไม่บังคับ)"}
                </strong>
                <span>
                  สูงสุด 3 ไฟล์ · ไฟล์ละ 350 KB · PNG, JPG, WebP, PDF, TXT
                </span>
                <input
                  type="file"
                  aria-label="แนบหลักฐาน"
                  accept={fileAccept}
                  multiple
                  disabled={reading}
                  onChange={(e) => {
                    void attach(e.target.files);
                    e.target.value = "";
                  }}
                />
              </label>
              <Notice>
                ไฟล์อยู่ใน LocalStorage เท่านั้น ไม่เผยแพร่สาธารณะ
                ตรวจและลบข้อมูลส่วนตัวจากไฟล์ก่อนแนบ
                ระบบจำลองไม่สามารถตรวจความแท้ของภาพหรือเอกสารได้
              </Notice>
              {draft.evidence.map((evidence) => (
                <div className="evidence-item" key={evidence.id}>
                  <div className="section-line">
                    <strong>{evidence.name}</strong>
                    <button
                      className="inline-link danger-text"
                      onClick={() =>
                        update({
                          evidence: draft.evidence.filter(
                            (e) => e.id !== evidence.id,
                          ),
                        })
                      }
                    >
                      นำออก
                    </button>
                  </div>
                  <label className="field">
                    ประเภทหลักฐาน
                    <select
                      value={evidence.kind}
                      onChange={(e) =>
                        updateEvidence(evidence.id, {
                          kind: e.target.value as Evidence["kind"],
                        })
                      }
                    >
                      {Object.entries(evidenceLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="checkbox-line">
                    <input
                      type="checkbox"
                      checked={evidence.sensitive}
                      onChange={(e) =>
                        updateEvidence(evidence.id, {
                          sensitive: e.target.checked,
                          shareWithBusiness: e.target.checked
                            ? false
                            : evidence.shareWithBusiness,
                        })
                      }
                    />
                    มีข้อมูลส่วนบุคคลที่ยังไม่ได้ปิดบัง
                  </label>
                  <label className="checkbox-line">
                    <input
                      type="checkbox"
                      disabled={evidence.sensitive}
                      checked={evidence.shareWithBusiness}
                      onChange={(e) =>
                        updateEvidence(evidence.id, {
                          shareWithBusiness: e.target.checked,
                        })
                      }
                    />
                    อนุญาตให้ธุรกิจที่เกี่ยวข้องดูไฟล์นี้
                  </label>
                </div>
              ))}
            </>
          )}
          {step === 2 && (
            <>
              <h2>ตรวจสรุปก่อนส่งเรื่อง</h2>
              <p className="supporting">
                ส่งเข้ากล่องธุรกิจภายในต้นแบบ ไม่ใช่การร้องเรียนต่อหน่วยงานจริง
              </p>
              <dl className="summary-grid">
                <dt>แบรนด์ / สินค้า</dt>
                <dd>
                  {info.brand || "ยังไม่ระบุ"} · {info.product || "ยังไม่ระบุ"}
                </dd>
                <dt>ประเภทปัญหา</dt>
                <dd>{categoryLabels[info.category]}</dd>
                <dt>เหตุการณ์</dt>
                <dd className="preserve-text">
                  {draft.description || "ยังไม่ระบุ"}
                </dd>
                <dt>สิ่งที่ต้องการ</dt>
                <dd>{draft.requestedOutcome || "ยังไม่ระบุ"}</dd>
                <dt>หลักฐาน</dt>
                <dd>
                  {draft.evidence.length} ไฟล์ · อนุญาตธุรกิจ{" "}
                  {
                    draft.evidence.filter(
                      (e) => e.shareWithBusiness && !e.sensitive,
                    ).length
                  }{" "}
                  ไฟล์
                </dd>
                <dt>ส่งถึง</dt>
                <dd>
                  {state.businesses.find((b) => b.id === info.businessId)
                    ?.name ?? "ยังไม่ตรงกับธุรกิจจำลอง · เก็บไว้ติดตามส่วนตัว"}
                </dd>
              </dl>
              <div className="tag-row">
                {info.tags.map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>
              <div className="risk-preview">
                <RiskBadge level={risk.level} />
                <p>
                  ประเมินด้วยคำสำคัญจำลอง
                  ไม่ใช่คำตัดสินทางกฎหมายหรือการตรวจว่าข้อร้องเรียนจริงหรือเท็จ
                </p>
                {risk.reasons.map((reason) => (
                  <p key={reason}>{reason}</p>
                ))}
                {duplicates.length > 0 && (
                  <p>
                    ไฟล์ซ้ำ: {duplicates.map((e) => e.name).join(", ")}{" "}
                    ผู้ดูแลจะตรวจบริบทเพิ่มเติม
                  </p>
                )}
                {risk.suggestion !== draft.description && (
                  <>
                    <blockquote>{risk.suggestion}</blockquote>
                    <button
                      className="button button--secondary"
                      onClick={() => {
                        update({ description: risk.suggestion });
                        setStep(0);
                      }}
                    >
                      ใช้ร่างข้อความกลาง แล้วตรวจแก้ด้วยตนเอง
                    </button>
                  </>
                )}
              </div>
              <Notice warning={risk.level !== "low"}>
                ข้อร้องเรียนจะถูกจัดกลุ่มภายในก่อน
                การส่งเรื่องไม่ทำให้ข้อความกล่าวหาปรากฏสาธารณะทันที
                และไม่มีผลให้เป็นการฟ้องคดีร่วมกัน
              </Notice>
            </>
          )}
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <div className="form-actions">
            {step > 0 && (
              <button
                className="button button--secondary"
                onClick={() => {
                  setStep(step - 1);
                  setError("");
                }}
              >
                ย้อนกลับ
              </button>
            )}
            {step < 2 ? (
              <button
                className="button button--primary"
                disabled={reading}
                onClick={() => {
                  setStep(step + 1);
                  setError("");
                }}
              >
                {step === 0 ? "ต่อไป: เตรียมหลักฐาน" : "ตรวจสรุป"}{" "}
                <Icon name="arrow" size={17} />
              </button>
            ) : (
              <button className="button button--primary" onClick={submit}>
                ยืนยันและส่งเรื่องในต้นแบบ <Icon name="check" size={17} />
              </button>
            )}
          </div>
        </section>
        <aside className="assistant-guidance">
          <Icon name="claim" size={30} />
          <h2>
            ข้อมูลพร้อม
            <br />
            ทางออกก็ชัดขึ้น
          </h2>
          <p>
            ไม่จำเป็นต้องรู้ศัพท์กฎหมาย เริ่มจากเรื่องที่เกิดขึ้นจริง
            และสิ่งที่อยากให้ธุรกิจช่วย
          </p>
          <ol>
            <li>เตรียมเรื่องตามที่ทราบ</li>
            <li>เลือกหลักฐานที่สะดวก</li>
            <li>ติดตามคำตอบจากธุรกิจ</li>
          </ol>
          <p className="small-text">
            ร่างของแต่ละบัญชีจำลองบันทึกแยกกันบนเบราว์เซอร์นี้
          </p>
        </aside>
      </div>
    </>
  );
}
