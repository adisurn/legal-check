import type { Case } from "../types/legal-check";
import { Icon } from "./icon";

export function HelpContent() {
  return (
    <>
      <p className="article-body">
        ClaimWise ช่วยตรวจข้อความสัญญาเบื้องต้น เตรียมหลักฐานเรียกร้องสิทธิ
              และติดตามข้อร้องเรียน โดยไม่ต้องสมัครสมาชิก
      </p>
      <div className="next-steps">
        <h3>ต้องการความช่วยเหลือด้านสิทธิ?</h3>
        <p>สำนักงานคณะกรรมการคุ้มครองผู้บริโภค (สคบ.)</p>
        <a href="tel:1166" className="primary-button">
          โทร 1166
          <Icon name="arrow" size={16} />
        </a>
        <p>ปัญหาซื้อขายออนไลน์: 1212 ETDA</p>
        <a
          href="https://www.ocpb.go.th/"
          target="_blank"
          rel="noreferrer"
          className="text-link"
        >
          ไปยังเว็บไซต์ สคบ.
          <Icon name="external" size={16} />
        </a>
      </div>
    </>
  );
}

export function Notifications({
  cases,
  onSelect,
}: {
  cases: Case[];
  onSelect: (item: Case) => void;
}) {
  const pending = cases.filter((c) => c.status === "รอเอกสารเพิ่มเติม");
  return (
    <>
      <p className="muted">การแจ้งเตือนจากเคสในอุปกรณ์ของคุณ</p>
      {pending.map((c) => (
        <button
          className="notification-item"
          key={c.id}
          onClick={() => onSelect(c)}
        >
          <span className="tool-icon amber">
            <Icon name="file" />
          </span>
          <div>
            <strong>เตรียมเอกสารให้ครบถ้วน</strong>
            <p>{c.title}</p>
          </div>
          <Icon name="chevron" size={16} />
        </button>
      ))}
      {pending.length === 0 && (
        <div className="empty">ไม่มีการแจ้งเตือนใหม่</div>
      )}
    </>
  );
}
