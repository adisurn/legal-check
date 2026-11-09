import { useRef } from "react";
import type { LegalCheckDraft } from "../../types/legal-check";
import { Icon } from "../icon";
import { Analysis } from "./analysis";

export function LegalCheckPanel({
  draft,
  onDraftChange,
  onClaim,
}: {
  draft: LegalCheckDraft;
  onDraftChange: (draft: LegalCheckDraft) => void;
  onClaim: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const { contract, analysis, fileError } = draft;

  return (
    <section className="panel legal-panel">
      <div className="panel-title">
        <span className="tool-icon blue">
          <Icon name="scan" size={26} />
        </span>
        <div>
          <h2>ตรวจสอบเงื่อนไขของคุณ</h2>
          <p>
            โหมดสาธิต: คัดกรองด้วยคำสำคัญ ยังไม่เชื่อมต่อ AI
            และไม่ใช่คำปรึกษาทางกฎหมาย
          </p>
        </div>
      </div>
      <label className="field-label" htmlFor="contract">
        วางข้อความสัญญา เงื่อนไขการรับประกัน หรือนโยบายคืนเงิน
      </label>
      <textarea
        id="contract"
        rows={9}
        value={contract}
        onChange={(e) =>
          onDraftChange({ ...draft, contract: e.target.value, analysis: false })
        }
        placeholder="ตัวอย่าง: สินค้าซื้อแล้วไม่รับคืนทุกกรณี บริษัทขอสงวนสิทธิ์เปลี่ยนแปลงเงื่อนไขโดยไม่แจ้งให้ทราบ..."
      />
      <div className="legal-actions">
        <input
          hidden
          type="file"
          ref={fileRef}
          accept=".txt,text/plain"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file) {
              if (file.size > 1024 * 1024) {
                onDraftChange({
                  ...draft,
                  fileError: "กรุณาเลือกไฟล์ไม่เกิน 1 MB",
                });
                return;
              }
              try {
                onDraftChange({
                  contract: await file.text(),
                  analysis: false,
                  fileError: "",
                });
              } catch {
                onDraftChange({
                  ...draft,
                  fileError: "ไม่สามารถอ่านไฟล์นี้ได้ กรุณาลองอีกครั้ง",
                });
              }
            }
          }}
        />
        <button
          className="secondary-button"
          onClick={() => fileRef.current?.click()}
        >
          <Icon name="upload" size={17} />
          นำเข้าไฟล์ .txt (ไม่เกิน 1 MB)
        </button>
        <button
          className="primary-button"
          disabled={!contract.trim()}
          onClick={() => onDraftChange({ ...draft, analysis: true })}
        >
          <Icon name="spark" size={17} />
          ตรวจสอบข้อความ
        </button>
      </div>
      {fileError && <p className="error-text">{fileError}</p>}
      <p className="privacy-note">
        <Icon name="shield" size={14} />
        ประมวลผลบนอุปกรณ์ของคุณ ไม่ส่งข้อความไปยังเซิร์ฟเวอร์
      </p>
      {analysis && <Analysis contract={contract} onClaim={onClaim} />}
    </section>
  );
}
