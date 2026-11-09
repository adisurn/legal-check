import { Icon } from "../icon";

export function CaseConnect({
  joined,
  onToggleGroup,
}: {
  joined: string[];
  onToggleGroup: (group: string) => void;
}) {
  return (
    <>
      <div className="info-banner">
        <Icon name="shield" />
        <p>
          กลุ่มด้านล่างเป็นกลุ่มตัวอย่าง การเข้าร่วมบันทึกไว้เฉพาะอุปกรณ์นี้
          ไม่เชื่อมต่อผู้ใช้อื่น และไม่ใช่การฟ้องคดีร่วมกันโดยอัตโนมัติ
        </p>
      </div>
      <div className="groups-grid">
        {[
          "ปัญหาสินค้าอิเล็กทรอนิกส์",
          "การคืนเงินจากร้านค้าออนไลน์",
          "ปัญหาการรับประกันเครื่องใช้ไฟฟ้า",
        ].map((g, i) => (
          <div className="panel group-card" key={g}>
            <span className={`tool-icon ${["blue", "amber", "purple"][i]}`}>
              <Icon name="people" size={28} />
            </span>
            <span className="sample-label">กลุ่มตัวอย่าง</span>
            <h2>{g}</h2>
            <p>
              รวบรวมแนวทางเตรียมหลักฐาน
              และช่องทางช่วยเหลือสำหรับปัญหาที่คล้ายกัน
              โดยไม่เปิดเผยข้อมูลส่วนบุคคล
            </p>
            <div className="group-topics">
              <span>ใบเสร็จ / คำสั่งซื้อ</span>
              <span>ประวัติการติดต่อ</span>
            </div>
            <button
              className={
                joined.includes(g) ? "secondary-button" : "primary-button"
              }
              onClick={() => onToggleGroup(g)}
            >
              <Icon name={joined.includes(g) ? "check" : "plus"} size={17} />
              {joined.includes(g)
                ? "เข้าร่วมแล้ว · ออกจากกลุ่ม"
                : "บันทึกการเข้าร่วม"}
            </button>
          </div>
        ))}
      </div>
      <section className="panel help-links">
        <h2>ช่องทางช่วยเหลือที่เหมาะสม</h2>
        <p>
          ร้องเรียนปัญหาผู้บริโภคกับ สคบ. โทร 1166 หรือปัญหาการซื้อขายออนไลน์กับ
          1212 ETDA
        </p>
        <a
          className="text-link"
          href="https://www.ocpb.go.th/"
          target="_blank"
          rel="noreferrer"
        >
          เว็บไซต์ สคบ.
          <Icon name="external" size={15} />
        </a>
      </section>
    </>
  );
}
