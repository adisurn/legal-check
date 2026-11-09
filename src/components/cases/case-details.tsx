import type { Case } from "../../types/legal-check";

export function CaseDetails({
  item,
  onUpdate,
}: {
  item: Case;
  onUpdate: (item: Case) => void;
}) {
  return (
    <>
      <div className="case-meta">
        {item.id} · {item.company}
      </div>
      <label className="field-label" htmlFor="status">
        สถานะการดำเนินการ
      </label>
      <select
        id="status"
        value={item.status}
        onChange={(e) =>
          onUpdate({
            ...item,
            status: e.target.value,
            date: new Date().toLocaleDateString("th-TH", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }),
          })
        }
      >
        {["รอเอกสารเพิ่มเติม", "กำลังดำเนินการ", "แก้ไขเรียบร้อย"].map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>
      <h3 className="checklist-title">เช็กลิสต์เตรียมหลักฐาน</h3>
      <p className="muted">
        ทำเครื่องหมายเอกสารที่เตรียมพร้อมแล้ว ไม่จำเป็นต้องอัปโหลด
      </p>
      {[
        "ใบเสร็จ / หลักฐานการชำระเงิน",
        "คำสั่งซื้อ / รายละเอียดสินค้า",
        "รูปภาพหรือวิดีโอแสดงปัญหา",
        "เงื่อนไขสัญญา / ใบรับประกัน",
        "ประวัติการติดต่อผู้ขาย",
      ].map((doc) => (
        <label className="checklist-item" key={doc}>
          <input
            type="checkbox"
            checked={item.documents.includes(doc)}
            onChange={() =>
              onUpdate({
                ...item,
                documents: item.documents.includes(doc)
                  ? item.documents.filter((d) => d !== doc)
                  : [...item.documents, doc],
              })
            }
          />
          {doc}
        </label>
      ))}
      <div className="next-steps">
        <h4>ขั้นตอนถัดไป</h4>
        <ol>
          <li>รวบรวมหลักฐาน และระบุสิ่งที่ต้องการให้แก้ไข</li>
          <li>ติดต่อผู้ขายเป็นลายลักษณ์อักษร เก็บสำเนาการติดต่อ</li>
          <li>หากไม่สามารถตกลงกันได้ ติดต่อ สคบ. 1166</li>
        </ol>
      </div>
    </>
  );
}
