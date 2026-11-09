import type { Case } from "../../types/legal-check";
import { Icon } from "../icon";
import { ViewLink } from "../view-link";
import { CaseTable } from "./case-table";

export function CasesSection({
  cases,
  overview,
  query,
  onQueryChange,
  onSelect,
  onNavigate,
}: {
  cases: Case[];
  overview: boolean;
  query: string;
  onQueryChange: (query: string) => void;
  onSelect: (item: Case) => void;
  onNavigate: () => void;
}) {
  return (
    <section className="cases-section">
      <div className="section-heading">
        <h2>
          {overview ? "เคสล่าสุดของคุณ" : "เคสทั้งหมดของคุณ"}{" "}
          <span className="count-pill">{cases.length}</span>
          <span className="sample-label">มีข้อมูลตัวอย่าง</span>
        </h2>
        {overview ? (
          <ViewLink view="claims" className="text-link" onNavigate={onNavigate}>
            ดูเคสทั้งหมด
            <Icon name="arrow" size={16} />
          </ViewLink>
        ) : (
          <label className="search-field">
            <Icon name="search" size={17} />
            <input
              aria-label="ค้นหาเคส"
              placeholder="ค้นหาเคสหรือผู้ประกอบการ"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
            />
          </label>
        )}
      </div>
      <div className="table-card">
        <CaseTable cases={cases} query={query} onSelect={onSelect} />
      </div>
    </section>
  );
}
