import { Icon } from "../icon";

export function Analysis({
  contract,
  onClaim,
}: {
  contract: string;
  onClaim: () => void;
}) {
  const rules = [
    {
      regex: /ไม่รับคืน|ไม่คืนเงิน|ทุกกรณี/,
      title: "ข้อจำกัดการคืนสินค้า / คืนเงิน",
      text: "พบข้อความจำกัดสิทธิการคืนสินค้า ควรตรวจสอบข้อยกเว้นกรณีสินค้าชำรุดหรือไม่ตรงตามสัญญา",
    },
    {
      regex: /สงวนสิทธิ์|เปลี่ยนแปลง|ไม่แจ้ง/,
      title: "การเปลี่ยนเงื่อนไขฝ่ายเดียว",
      text: "ตรวจสอบว่ามีการแจ้งให้ทราบและมีทางเลือกสำหรับผู้บริโภคอย่างเหมาะสมหรือไม่",
    },
    {
      regex: /รับประกัน|ซ่อม|ชำรุด/,
      title: "ขอบเขตการรับประกัน",
      text: "ตรวจสอบระยะเวลา ค่าใช้จ่าย ข้อยกเว้น และขั้นตอนการซ่อมหรือเปลี่ยนสินค้าให้ชัดเจน",
    },
  ].filter((r) => r.regex.test(contract));
  return (
    <div className="analysis-result">
      <h3>ผลการคัดกรองเบื้องต้น</h3>
      <p>
        โหมดสาธิต: ใช้การค้นหาคำสำคัญ ไม่ได้เชื่อมต่อบริการ AI
        และไม่สามารถตัดสินความชอบด้วยกฎหมาย
      </p>
      {rules.map((r) => (
        <div className="result-item" key={r.title}>
          <Icon name="help" />
          <div>
            <h4>{r.title}</h4>
            <p>{r.text}</p>
            <blockquote>
              “{contract.split(/[。\n]/).find((s) => r.regex.test(s))}”
            </blockquote>
          </div>
        </div>
      ))}
      {rules.length === 0 && (
        <p>
          ไม่พบคำสำคัญตามเกณฑ์สาธิต ไม่ได้หมายความว่าสัญญาปลอดความเสี่ยง
          ควรอ่านเงื่อนไขทั้งหมดหรือปรึกษาผู้เชี่ยวชาญ
        </p>
      )}
      <button className="text-link" onClick={onClaim}>
        เตรียมเคสจากเอกสารนี้
        <Icon name="arrow" size={16} />
      </button>
    </div>
  );
}
