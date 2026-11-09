import type { Case } from "../../types/legal-check";
import { Icon } from "../icon";

export function CaseTable({
  cases,
  query = "",
  onSelect,
}: {
  cases: Case[];
  query?: string;
  onSelect: (item: Case) => void;
}) {
  const filtered = cases.filter((c) =>
    `${c.title} ${c.company} ${c.id}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            <th>รายละเอียดเคส</th>
            <th>ประเภท</th>
            <th>สถานะ</th>
            <th>อัปเดตล่าสุด</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {filtered.map((c) => (
            <tr key={c.id} onClick={() => onSelect(c)}>
              <td>
                <div className="case-name">
                  <span
                    className={`case-icon ${c.category === "การคืนเงิน" ? "peach" : ""}`}
                  >
                    <Icon
                      name={
                        c.category === "การรับประกัน"
                          ? "shield"
                          : c.category === "การคืนเงิน"
                            ? "claim"
                            : "file"
                      }
                    />
                  </span>
                  <div>
                    <button
                      className="text-button case-title"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(c);
                      }}
                    >
                      {c.title}
                    </button>
                    <small>
                      {c.id} <span>•</span> {c.company}
                    </small>
                  </div>
                </div>
              </td>
              <td>{c.category}</td>
              <td>
                <span
                  className={`status ${c.status === "แก้ไขเรียบร้อย" ? "green" : c.status === "รอเอกสารเพิ่มเติม" ? "amber" : "blue"}`}
                >
                  <i />
                  {c.status}
                </span>
              </td>
              <td>{c.date}</td>
              <td>
                <Icon name="chevron" size={16} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {filtered.length === 0 && (
        <div className="empty">ไม่พบเคสที่ตรงกับ “{query}”</div>
      )}
    </div>
  );
}
