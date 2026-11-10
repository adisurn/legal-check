import { useState } from "react";
import type { Commit } from "../../hooks/use-platform";
import {
  businessClaims,
  categoryLabels,
  publication,
  statusLabels,
} from "../../lib/platform";
import type { PlatformState } from "../../types/platform";
import { Icon } from "../icon";
import { ViewLink } from "../view-link";
import {
  Badge,
  ClaimList,
  emptyFilters,
  FilterBar,
  matchesFilters,
  Notice,
  TrustLegend,
} from "./shared";

export function ConsumerDashboard({
  state,
  commit,
  onSelect,
}: {
  state: PlatformState;
  commit: Commit;
  onSelect: (id: string) => void;
}) {
  const user = state.consumers.find(
    (c) => c.id === state.preferences.consumerId,
  )!;
  const claims = state.claims.filter((c) => c.consumerId === user.id);
  const open = claims.filter((c) => !["Resolved", "Closed"].includes(c.status));
  const replied = claims.filter((c) =>
    state.replies.some((r) => r.claimId === c.id),
  );
  return (
    <>
      <div className="page-title">
        <div>
          <h1>เรื่องสิทธิ เริ่มต้นได้ที่นี่</h1>
          <p>พื้นที่ของ {user.name} · ติดตามทุกขั้นตอนในที่เดียว</p>
        </div>
        <Badge tone={user.verified ? "success" : "neutral"}>
          {user.verified ? "Account Verified · จำลอง" : "บัญชีผู้ทดสอบ"}
        </Badge>
      </div>
      <section className="consumer-intro">
        <div>
          <h2>
            จากเรื่องที่กังวล
            <br />
            สู่เรื่องที่พร้อมแก้ไข
          </h2>
          <p>
            จัดข้อมูลและหลักฐานเท่าที่คุณมี
            แล้วติดตามคำตอบจากธุรกิจอย่างเป็นขั้นตอน
          </p>
          <ViewLink view="assistant" className="button button--primary">
            เตรียมข้อร้องเรียน <Icon name="arrow" size={18} />
          </ViewLink>
        </div>
        <ol className="resolution-path">
          <li>
            <span>
              <Icon name="claim" />
            </span>
            <div>
              <strong>เตรียมเรื่อง</strong>
              <small>เช็กลิสต์ง่าย ๆ ข้ามข้อมูลได้</small>
            </div>
          </li>
          <li>
            <span>
              <Icon name="business" />
            </span>
            <div>
              <strong>ส่งถึงพื้นที่ธุรกิจ</strong>
              <small>จับคู่แบรนด์และสินค้าจำลอง</small>
            </div>
          </li>
          <li>
            <span>
              <Icon name="check" />
            </span>
            <div>
              <strong>ติดตามทางออก</strong>
              <small>เห็นคำตอบและประวัติการดำเนินการ</small>
            </div>
          </li>
        </ol>
      </section>
      <div className="metric-strip">
        <div>
          <span>ข้อร้องเรียนของฉัน</span>
          <strong>
            {claims.length}
            <small> เรื่อง</small>
          </strong>
        </div>
        <div>
          <span>อยู่ระหว่างดำเนินการ</span>
          <strong>
            {open.length}
            <small> เรื่อง</small>
          </strong>
        </div>
        <div>
          <span>ได้รับคำตอบจากธุรกิจ</span>
          <strong>
            {replied.length}
            <small> เรื่อง</small>
          </strong>
        </div>
      </div>
      <section className="surface">
        <div className="section-line">
          <h2>ติดตามเรื่องล่าสุด</h2>
          <ViewLink view="claims" className="inline-link">
            ดูทั้งหมด <Icon name="arrow" size={15} />
          </ViewLink>
        </div>
        <ClaimList
          claims={claims.slice(0, 4)}
          state={state}
          onSelect={onSelect}
        />
      </section>
      <div className="dashboard-columns">
        <section className="surface">
          <div className="section-line">
            <h2>เชื่อมโยงประสบการณ์อย่างปลอดภัย</h2>
            <Icon name="people" />
          </div>
          <p className="supporting">
            Case Connect มี{" "}
            {state.clusters.filter((c) => publication(state, c).visible).length}{" "}
            ประเด็นที่ผ่านเกณฑ์เผยแพร่ในข้อมูลสาธิต
            จำนวนผู้ร้องเรียนไม่ใช่ข้อพิสูจน์ว่าธุรกิจผิด
          </p>
          <ViewLink view="connect" className="button button--secondary">
            ค้นหาประเด็นที่คล้ายกัน
          </ViewLink>
        </section>
        <section className="surface">
          <h2>สัญญาณความน่าเชื่อถือ</h2>
          <p className="supporting">
            จำลองการยืนยันช่องทางติดต่อเพื่อทดสอบเกณฑ์การเผยแพร่ ไม่มีการส่ง OTP
            หรือข้อมูลออกนอกเบราว์เซอร์
          </p>
          <label className="checkbox-line">
            <input
              type="checkbox"
              checked={user.verified}
              onChange={(e) =>
                commit((s) => ({
                  ...s,
                  consumers: s.consumers.map((c) =>
                    c.id === user.id ? { ...c, verified: e.target.checked } : c,
                  ),
                }))
              }
            />
            ยืนยันการติดต่อ (จำลอง)
          </label>
        </section>
      </div>
      <TrustLegend />
    </>
  );
}

export function BusinessDashboard({
  state,
  onSelect,
}: {
  state: PlatformState;
  onSelect: (id: string) => void;
}) {
  const business = state.businesses.find(
    (b) => b.id === state.preferences.businessId,
  )!;
  const claims = businessClaims(state, business.id);
  const counts = Object.keys(categoryLabels)
    .map((category) => ({
      category,
      count: claims.filter((c) => c.category === category).length,
    }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count);
  const clusters = state.clusters.filter((cluster) =>
    claims.some((c) => c.clusterId === cluster.id),
  );
  return (
    <>
      <div className="page-title">
        <div>
          <h1>รับฟังให้ครบ แก้ไขให้ตรงจุด</h1>
          <p>{business.name} · แสดงเฉพาะข้อร้องเรียนที่เชื่อมโยงกับองค์กรนี้</p>
        </div>
        <Badge tone={business.verified ? "success" : "warning"}>
          {business.verified
            ? "Business Verified · จำลอง"
            : "ยังไม่ยืนยันธุรกิจ"}
        </Badge>
      </div>
      <div className="business-welcome">
        <div>
          <Icon name="business" size={28} />
          <h2>ทุกข้อร้องเรียน คือโอกาสในการดูแล</h2>
          <p>
            เริ่มจากเรื่องใหม่ ตอบกลับด้วยข้อเท็จจริง
            และเก็บประวัติการแก้ไขให้ตรวจสอบได้
          </p>
        </div>
        <ViewLink view="resolution" className="button button--primary">
          เปิด Business Resolution <Icon name="arrow" size={18} />
        </ViewLink>
      </div>
      <div className="metric-strip">
        <div>
          <span>ข้อร้องเรียนที่เกี่ยวข้อง</span>
          <strong>
            {claims.length}
            <small> เรื่อง</small>
          </strong>
        </div>
        <div>
          <span>เรื่องใหม่ที่รอตรวจสอบ</span>
          <strong>
            {claims.filter((c) => c.status === "New").length}
            <small> เรื่อง</small>
          </strong>
        </div>
        <div>
          <span>แก้ไขแล้ว</span>
          <strong>
            {claims.filter((c) => c.status === "Resolved").length}
            <small> เรื่อง</small>
          </strong>
        </div>
        <div>
          <span>ประเด็นที่เกิดซ้ำ</span>
          <strong>
            {
              clusters.filter(
                (cluster) =>
                  claims.filter((c) => c.clusterId === cluster.id).length > 1,
              ).length
            }
            <small> กลุ่ม</small>
          </strong>
        </div>
      </div>
      <div className="dashboard-columns">
        <section className="surface">
          <h2>ประเภทปัญหาที่ได้รับ</h2>
          <p className="supporting">
            นับจากข้อร้องเรียนในองค์กรนี้ ไม่ใช่สถิติของตลาด
          </p>
          <div className="trend-bars">
            {counts.map((item) => (
              <div key={item.category}>
                <span>{categoryLabels[item.category]}</span>
                <meter
                  min={0}
                  max={Math.max(claims.length, 1)}
                  value={item.count}
                >
                  {item.count}
                </meter>
                <strong>{item.count}</strong>
              </div>
            ))}
          </div>
        </section>
        <section className="surface">
          <h2>ประเด็นที่ควรติดตาม</h2>
          {clusters.map((cluster) => (
            <div className="issue-summary" key={cluster.id}>
              <strong>{cluster.product || "ยังไม่ระบุสินค้า"}</strong>
              <span>{categoryLabels[cluster.category]}</span>
              <Badge>
                {claims.filter((c) => c.clusterId === cluster.id).length}{" "}
                ข้อร้องเรียน
              </Badge>
            </div>
          ))}
        </section>
      </div>
      <section className="surface">
        <div className="section-line">
          <h2>รอการดูแลจากทีมของคุณ</h2>
          <ViewLink view="resolution" className="inline-link">
            จัดการทั้งหมด <Icon name="arrow" size={16} />
          </ViewLink>
        </div>
        <ClaimList
          claims={claims
            .filter((c) => !["Resolved", "Closed"].includes(c.status))
            .slice(0, 5)}
          state={state}
          onSelect={onSelect}
        />
      </section>
      <TrustLegend />
    </>
  );
}

export function ClaimsWorkspace({
  state,
  business = false,
  onSelect,
}: {
  state: PlatformState;
  business?: boolean;
  onSelect: (id: string) => void;
}) {
  const [filters, setFilters] = useState(emptyFilters);
  const [status, setStatus] = useState("");
  const claims = business
    ? businessClaims(state, state.preferences.businessId)
    : state.claims.filter((c) => c.consumerId === state.preferences.consumerId);
  const filtered = claims.filter(
    (c) => matchesFilters(c, filters) && (!status || c.status === status),
  );
  return (
    <>
      <div className="page-title">
        <div>
          <h1>{business ? "Business Resolution" : "ข้อร้องเรียนของฉัน"}</h1>
          <p>
            {business
              ? "ค้นหา ตรวจสอบ และตอบกลับเฉพาะเรื่องที่เกี่ยวข้องกับองค์กรของคุณ"
              : "ติดตามสถานะ คำตอบ และสิ่งที่ต้องเตรียมเพิ่มเติม"}
          </p>
        </div>
        {!business && (
          <ViewLink view="assistant" className="button button--primary">
            <Icon name="plus" size={18} />
            เตรียมเรื่องใหม่
          </ViewLink>
        )}
      </div>
      <Notice>
        {business
          ? "พื้นที่นี้แสดงข้อมูลส่วนตัวที่ผู้บริโภคส่งให้ธุรกิจของคุณ ไฟล์หลักฐานแสดงเฉพาะที่ได้รับอนุญาต ไม่สามารถลบหรือซ่อนประเด็นสาธารณะเองได้"
          : "ข้อร้องเรียนยังติดตามส่วนตัวและส่งถึงธุรกิจได้ แม้กลุ่มยังไม่ผ่านเกณฑ์เผยแพร่สาธารณะ"}
      </Notice>
      <section className="surface">
        <FilterBar items={claims} value={filters} onChange={setFilters} />
        <div className="section-line list-toolbar">
          <label className="status-filter">
            สถานะ{" "}
            <select
              aria-label="กรองสถานะข้อร้องเรียน"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">ทั้งหมด</option>
              {Object.entries(statusLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <span className="supporting">
            {filtered.length} จาก {claims.length} เรื่อง
          </span>
        </div>
        <ClaimList claims={filtered} state={state} onSelect={onSelect} />
      </section>
    </>
  );
}
