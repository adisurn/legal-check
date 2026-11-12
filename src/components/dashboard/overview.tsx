import { tools } from "../../data/legal-check";
import type { Case } from "../../types/legal-check";
import { Icon } from "../icon";
import { StatCard } from "../stat-card";
import { ViewLink } from "../view-link";
import { HeroArt } from "./hero-art";

export function Overview({
  cases,
  joinedCount,
  onHelp,
  onNavigate,
}: {
  cases: Case[];
  joinedCount: number;
  onHelp: () => void;
  onNavigate: () => void;
}) {
  const openCount = cases.filter((c) => c.status !== "แก้ไขเรียบร้อย").length;
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="hero-tag">
            <span />
            ClaimWise อยู่เคียงข้างคุณ
          </span>
          <h2>
            เข้าใจสิทธิของคุณ
            <br />
            เริ่มต้นด้วยความมั่นใจ<span>.</span>
          </h2>
          <p>
            ไม่ว่าจะเป็นสัญญาที่อ่านไม่เข้าใจ สินค้าที่มีปัญหา หรือการขอคืนเงิน
            <br className="desktop-break" /> เราช่วยให้เรื่องซับซ้อน
            กลายเป็นขั้นตอนที่คุณจัดการได้
          </p>
          <div className="hero-actions">
            <ViewLink
              view="legal"
              className="primary-button"
              onNavigate={onNavigate}
            >
              <Icon name="scan" size={18} />
              ตรวจสอบสัญญาฟรี
              <Icon name="arrow" size={17} />
            </ViewLink>
            <button className="hero-secondary" onClick={onHelp}>
              รู้จัก ClaimWise <Icon name="arrow" size={16} />
            </button>
          </div>
          <span className="hero-footnote">
            <Icon name="shield" size={12} />
            ไม่ต้องสมัครสมาชิก · ข้อมูลเป็นส่วนตัว
          </span>
        </div>
        <HeroArt />
      </section>
      <section className="stats-grid">
        <StatCard
          icon="claim"
          color="blue"
          title="เคสทั้งหมดของคุณ"
          count={cases.length}
          note="เคสที่บันทึกไว้ในอุปกรณ์นี้"
        />
        <StatCard
          icon="clock"
          color="amber"
          title="กำลังดำเนินการ"
          count={openCount}
          note="อยู่ระหว่างการติดตามและแก้ไข"
        />
        <StatCard
          icon="check"
          color="green"
          title="แก้ไขเรียบร้อย"
          count={cases.length - openCount}
          note="อีกก้าวของการคุ้มครองสิทธิ"
        />
        <StatCard
          icon="people"
          color="purple"
          title="กลุ่มที่คุณเข้าร่วม"
          count={joinedCount}
          note="เชื่อมต่อ เพื่อหาทางออกร่วมกัน"
        />
      </section>
      <section className="tools-section">
        <div className="section-heading">
          <h2>ให้เราช่วยคุณเรื่องไหนดี?</h2>
          <span className="section-subtitle">เครื่องมือเพื่อสิทธิของทุกคน</span>
        </div>
        <div className="tools-grid">
          {tools.map((t) => (
            <ViewLink
              key={t.view}
              view={t.view}
              className={`tool-card ${t.color}`}
              onNavigate={onNavigate}
            >
              <div className="tool-top">
                <span className={`tool-icon ${t.color}`}>
                  <Icon name={t.icon} size={25} />
                </span>
                {t.view === "legal" && (
                  <span className="smart-label">
                    <Icon name="spark" size={11} />
                    Demo
                  </span>
                )}
              </div>
              <h3>{t.title}</h3>
              <h4>{t.thai}</h4>
              <p>{t.text}</p>
              <span className="tool-link">
                {t.action}
                <Icon name="arrow" size={17} />
              </span>
            </ViewLink>
          ))}
        </div>
      </section>
    </>
  );
}
