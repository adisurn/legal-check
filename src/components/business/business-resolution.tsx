import type { Case } from "../../types/legal-check";
import { CaseTable } from "../cases/case-table";
import { StatCard } from "../stat-card";

export function BusinessResolution({
  cases,
  query,
  onSelect,
}: {
  cases: Case[];
  query: string;
  onSelect: (item: Case) => void;
}) {
  const openCount = cases.filter((c) => c.status !== "แก้ไขเรียบร้อย").length;
  return (
    <>
      <section className="stats-grid business-stats">
        <StatCard
          icon="business"
          color="blue"
          title="ข้อร้องเรียนทั้งหมด"
          count={cases.length}
          note="รวมเคสในอุปกรณ์นี้"
        />
        <StatCard
          icon="clock"
          color="amber"
          title="รอการแก้ไข"
          count={openCount}
          note="ติดตามและประสานงาน"
        />
        <StatCard
          icon="check"
          color="green"
          title="ปิดเคสแล้ว"
          count={cases.length - openCount}
          note="ดำเนินการเรียบร้อย"
        />
      </section>
      <div className="panel">
        <h2>ประเภทปัญหาที่พบ</h2>
        <p className="muted">สรุปจากเคสที่บันทึกไว้ รวมข้อมูลตัวอย่าง</p>
        <div className="bar-chart">
          {["การรับประกัน", "การคืนเงิน", "สินค้าชำรุด"].map((category) => {
            const count = cases.filter((c) => c.category === category).length;
            return (
              <div className="bar-row" key={category}>
                <span>{category}</span>
                <div className="bar-track">
                  <div
                    style={{
                      width: `${cases.length ? (count / cases.length) * 100 : 0}%`,
                    }}
                  />
                </div>
                <strong>{count} เคส</strong>
              </div>
            );
          })}
        </div>
      </div>
      <section className="cases-section">
        <div className="section-heading">
          <h2>ติดตามข้อร้องเรียน</h2>
          <span className="section-subtitle">เลือกเคสเพื่ออัปเดตสถานะ</span>
        </div>
        <div className="table-card">
          <CaseTable cases={cases} query={query} onSelect={onSelect} />
        </div>
      </section>
    </>
  );
}
