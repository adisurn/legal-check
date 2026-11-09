import { nav } from "../../data/legal-check";
import { Icon } from "../icon";
import { ViewLink } from "../view-link";

const labels: Record<string, string> = {
  overview: "หน้าหลัก",
  legal: "ตรวจสัญญา",
  claims: "เคสของฉัน",
  connect: "รวมกลุ่ม",
  business: "ธุรกิจ",
};

export function MobileNavigation({
  activeView,
  onNavigate,
}: {
  activeView: string;
  onNavigate: () => void;
}) {
  return (
    <nav className="mobile-navigation" aria-label="เมนูหลักบนมือถือ">
      {nav.map((item) => (
        <ViewLink
          key={item.view}
          view={item.view}
          className={`mobile-nav-item ${activeView === item.view ? "active" : ""}`}
          onNavigate={onNavigate}
        >
          <span>
            <Icon name={item.icon} size={20} />
          </span>
          {labels[item.view]}
        </ViewLink>
      ))}
    </nav>
  );
}
