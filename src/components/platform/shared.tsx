import type { ReactNode } from "react";
import {
  categoryLabels,
  dateLabel,
  riskLabels,
  statusLabels,
} from "../../lib/platform";
import type { Claim, PlatformState, RiskLevel } from "../../types/platform";
import { Icon } from "../icon";

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: string;
}) {
  return <span className={`badge badge--${tone}`}>{children}</span>;
}
export function RiskBadge({ level }: { level: RiskLevel }) {
  return (
    <Badge
      tone={
        level === "high" ? "danger" : level === "medium" ? "warning" : "success"
      }
    >
      {riskLabels[level]}
    </Badge>
  );
}
export function Empty({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <Icon name="search" size={28} />
      <h3>{title}</h3>
      <p>{children ?? "ลองปรับตัวกรองหรือเพิ่มข้อมูลเพื่อเริ่มต้น"}</p>
    </div>
  );
}
export function Notice({
  children,
  warning = false,
}: {
  children: ReactNode;
  warning?: boolean;
}) {
  return (
    <div className={`notice ${warning ? "notice--warning" : ""}`}>
      <Icon name={warning ? "help" : "shield"} size={19} />
      <div>{children}</div>
    </div>
  );
}
export function ClaimList({
  claims,
  state,
  onSelect,
}: {
  claims: Claim[];
  state: PlatformState;
  onSelect: (id: string) => void;
}) {
  if (!claims.length) return <Empty title="ยังไม่มีข้อร้องเรียนในรายการนี้" />;
  return (
    <div className="claim-list">
      {claims.map((claim) => {
        const cluster = state.clusters.find((c) => c.id === claim.clusterId);
        return (
          <button
            className="claim-row"
            key={claim.id}
            onClick={() => onSelect(claim.id)}
          >
            <span className="claim-row-icon">
              <Icon
                name={claim.category === "Consumer Safety" ? "shield" : "claim"}
              />
            </span>
            <span className="claim-row-content">
              <strong>
                {claim.product ||
                  claim.brand ||
                  "ข้อร้องเรียนที่ยังไม่ระบุสินค้า"}
              </strong>
              <span>
                {claim.brand || "ยังไม่ระบุแบรนด์"} ·{" "}
                {categoryLabels[claim.category] ?? claim.category}
              </span>
              <small>
                {dateLabel(claim.createdAt)} ·{" "}
                {cluster?.review === "edits"
                  ? "ผู้ดูแลขอข้อมูลเพิ่มเติม"
                  : claim.businessId
                    ? "เข้ากล่องธุรกิจจำลองแล้ว"
                    : "ยังไม่พบธุรกิจที่ตรงกัน"}
              </small>
            </span>
            <Badge
              tone={
                claim.status === "Resolved"
                  ? "success"
                  : claim.status === "Disputed"
                    ? "warning"
                    : "brand"
              }
            >
              {statusLabels[claim.status]}
            </Badge>
            <Icon name="chevron" size={16} />
          </button>
        );
      })}
    </div>
  );
}
export function TrustLegend() {
  return (
    <details className="trust-legend">
      <summary>เครื่องหมายความน่าเชื่อถือหมายถึงอะไร?</summary>
      <ul>
        <li>
          <strong>Account Verified:</strong> จำลองว่าตรวจช่องทางติดต่อแล้ว
          ไม่ใช่การพิสูจน์ตัวบุคคลจริง
        </li>
        <li>
          <strong>Purchase Evidence Provided:</strong> มีเอกสารประเภทการซื้อ
          ผู้ใช้ไม่จำเป็นต้องมีใบเสร็จทุกกรณี
        </li>
        <li>
          <strong>Transaction Evidence Reviewed:</strong>{" "}
          ผู้ดูแลจำลองตรวจความเกี่ยวข้องและความสอดคล้องแล้ว
          ไม่รับรองว่าเอกสารแท้
        </li>
        <li>
          <strong>Business Verified:</strong>{" "}
          โปรไฟล์ธุรกิจผ่านขั้นตอนยืนยันจำลองเท่านั้น
        </li>
      </ul>
      <p>
        ทุกสถานะเป็นข้อมูลจำลอง ไม่ใช่ข้อพิสูจน์ว่าคำร้องเป็นจริงหรือฝ่ายใดผิด
      </p>
    </details>
  );
}

export interface Filters {
  query: string;
  brand: string;
  product: string;
  category: string;
  tag: string;
}
export const emptyFilters: Filters = {
  query: "",
  brand: "",
  product: "",
  category: "",
  tag: "",
};
type Searchable = {
  brand: string;
  product: string;
  category: string;
  tags: string[];
  keywords: string[];
  description?: string;
};
export function matchesFilters(item: Searchable, filters: Filters) {
  const text =
    `${item.brand} ${item.product} ${item.category} ${categoryLabels[item.category]} ${item.tags.join(" ")} ${item.keywords.join(" ")} ${item.description ?? ""}`.toLowerCase();
  return (
    text.includes(filters.query.toLowerCase()) &&
    (!filters.brand || item.brand === filters.brand) &&
    (!filters.product || item.product === filters.product) &&
    (!filters.category || item.category === filters.category) &&
    (!filters.tag || item.tags.includes(filters.tag))
  );
}
export function FilterBar({
  items,
  value,
  onChange,
}: {
  items: Searchable[];
  value: Filters;
  onChange: (filters: Filters) => void;
}) {
  return (
    <div className="filter-bar">
      <label className="search-input">
        <Icon name="search" size={18} />
        <input
          aria-label="ค้นหาข้อร้องเรียนหรือกลุ่ม"
          placeholder="ค้นหาแบรนด์ สินค้า หรือคำสำคัญ"
          value={value.query}
          onChange={(e) => onChange({ ...value, query: e.target.value })}
        />
      </label>
      {(["brand", "product", "category", "tag"] as const).map((key) => {
        const options = [
          ...new Set(
            items.flatMap((item) => (key === "tag" ? item.tags : [item[key]])),
          ),
        ].filter(Boolean);
        const label = {
          brand: "แบรนด์",
          product: "สินค้า",
          category: "ประเภทปัญหา",
          tag: "แท็กปัญหา",
        }[key];
        return (
          <label className="filter-select" key={key}>
            <span>{label}</span>
            <select
              aria-label={`กรอง${label}`}
              value={value[key]}
              onChange={(e) => onChange({ ...value, [key]: e.target.value })}
            >
              <option value="">ทั้งหมด</option>
              {options.map((option) => (
                <option key={option} value={option}>
                  {categoryLabels[option] ?? option}
                </option>
              ))}
            </select>
          </label>
        );
      })}
      <button
        className="button button--quiet"
        onClick={() => onChange(emptyFilters)}
      >
        ล้างตัวกรอง
      </button>
    </div>
  );
}
