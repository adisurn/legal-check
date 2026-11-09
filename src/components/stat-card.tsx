import { Icon } from "./icon";
import type { IconName } from "./icon";

export function StatCard({
  icon,
  color,
  title,
  count,
  note,
}: {
  icon: IconName;
  color: string;
  title: string;
  count: number;
  note: string;
}) {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <span>{title}</span>
        <span className={`stat-icon ${color}`}>
          <Icon name={icon} size={19} />
        </span>
      </div>
      <div className="stat-value">
        {count}
        <span>{icon === "people" ? "กลุ่ม" : "เคส"}</span>
      </div>
      <p>{note}</p>
    </div>
  );
}
