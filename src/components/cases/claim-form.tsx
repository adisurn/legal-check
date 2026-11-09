import type { Case } from "../../types/legal-check";
import { Icon } from "../icon";

export function ClaimForm({
  onSave,
}: {
  onSave: (data: Pick<Case, "title" | "company" | "category">) => void;
}) {
  return (
    <form
      className="claim-form"
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        onSave({
          title: String(data.get("title")).trim(),
          company: String(data.get("company")).trim(),
          category: String(data.get("category")),
        });
      }}
    >
      <p className="muted">
        บอกเราเกี่ยวกับปัญหา เพื่อสร้างเคสและเช็กลิสต์หลักฐานของคุณ
      </p>
      <label>
        ปัญหาที่พบ
        <input
          name="title"
          required
          maxLength={160}
          pattern=".*\S.*"
          placeholder="เช่น โทรศัพท์ชำรุดหลังใช้งาน 7 วัน"
        />
      </label>
      <label>
        ร้านค้า / ผู้ประกอบการ
        <input
          name="company"
          required
          maxLength={100}
          pattern=".*\S.*"
          placeholder="ระบุชื่อร้านค้าหรือบริษัท"
        />
      </label>
      <label>
        ประเภทปัญหา
        <select name="category">
          <option>สินค้าชำรุด</option>
          <option>การรับประกัน</option>
          <option>การคืนเงิน</option>
        </select>
      </label>
      <div className="info-banner">
        <Icon name="shield" size={20} />
        <p>
          อย่าใส่เลขบัตรประชาชนหรือข้อมูลอ่อนไหว
          ข้อมูลนี้เก็บไว้เฉพาะในเบราว์เซอร์
        </p>
      </div>
      <button type="submit" className="primary-button">
        <Icon name="plus" size={18} />
        สร้างเคสและเตรียมหลักฐาน
      </button>
    </form>
  );
}
