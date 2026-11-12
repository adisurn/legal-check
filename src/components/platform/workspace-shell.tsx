import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { Commit } from "../../hooks/use-platform";
import type { PlatformState, Role } from "../../types/platform";
import { Icon } from "../icon";
import type { IconName } from "../icon";
import { ViewLink } from "../view-link";

type NavItem = { view: string; label: string; short: string; icon: IconName };
export const roleNavigation: Record<Role, NavItem[]> = {
  consumer: [
    {
      view: "overview",
      label: "Overview",
      short: "หน้าหลัก",
      icon: "grid",
    },
    {
      view: "assistant",
      label: "Claim Assistant",
      short: "ร้องเรียน",
      icon: "claim",
    },
    {
      view: "claims",
      label: "History Claims",
      short: "ติดตาม",
      icon: "file",
    },
    { view: "connect", label: "Case Connect", short: "ชุมชน", icon: "people" },
    {
      view: "legal",
      label: "AI Legal Check",
      short: "เช็กสิทธิ",
      icon: "scan",
    },
  ],
  business: [
    { view: "overview", label: "Overview", short: "ภาพรวม", icon: "grid" },
    {
      view: "resolution",
      label: "Business Resolution",
      short: "ข้อร้องเรียน",
      icon: "business",
    },
    {
      view: "connect",
      label: "Case Connect",
      short: "ประเด็น",
      icon: "people",
    },
    {
      view: "legal",
      label: "AI Legal Check",
      short: "เช็กนโยบาย",
      icon: "scan",
    },
  ],
  moderator: [
    {
      view: "moderation",
      label: "คิวตรวจสอบเนื้อหา",
      short: "คิวตรวจ",
      icon: "shield",
    },
    {
      view: "settings",
      label: "เกณฑ์และบัญชีจำลอง",
      short: "เกณฑ์เผยแพร่",
      icon: "people",
    },
  ],
};
export const roleLabels: Record<Role, string> = {
  consumer: "Consumer",
  business: "Business",
  moderator: "Moderator demo",
};

export function WorkspaceShell({
  state,
  commit,
  view,
  children,
}: {
  state: PlatformState;
  commit: Commit;
  view: string;
  children: ReactNode;
}) {
  const role = state.preferences.role ?? "consumer";
  const items = roleNavigation[role];
  const [menuOpen, setMenuOpen] = useState(false);
  const main = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    main.current?.scrollTo({ top: 0 });
    setMenuOpen(false);
  }, [view, role]);
  useEffect(() => {
    if (!menuOpen) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        toggle.current?.focus();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [menuOpen]);
  const business = state.businesses.find(
    (b) => b.id === state.preferences.businessId,
  )!;
  return (
    <div className={`platform-shell platform-shell--${role}`}>
      <a href="#workspace-content" className="skip-link">
        ข้ามไปเนื้อหา
      </a>
      <aside
        className={`platform-sidebar ${menuOpen ? "is-open" : ""}`}
        id="role-navigation"
      >
        <ViewLink
          view={role === "moderator" ? "moderation" : "overview"}
          className="platform-brand"
          onNavigate={() => setMenuOpen(false)}
        >
          <span className="brand-symbol">
            <Icon name="shield" size={26} />
          </span>
          Claim<span>Wise</span>
        </ViewLink>
        <div className="workspace-identity">
          <span className="workspace-avatar">
            <Icon
              name={
                role === "business"
                  ? "business"
                  : role === "moderator"
                    ? "shield"
                    : "people"
              }
            />
          </span>
          <div>
            <strong>{roleLabels[role]} workspace</strong>
            <small>
              {role === "business"
                ? "รับฟัง · ตอบกลับ · แก้ไข"
                : role === "moderator"
                  ? "ตรวจสอบอย่างเป็นกลาง"
                  : "สิทธิของคุณ เริ่มจากข้อมูล"}
            </small>
          </div>
        </div>
        <nav aria-label={`เมนู ${roleLabels[role]}`}>
          {items.map((item) => (
            <ViewLink
              key={item.view}
              view={item.view}
              onNavigate={() => setMenuOpen(false)}
              className={`platform-nav-item ${view === item.view ? "is-active" : ""}`}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
                  {item.view === "legal"}
            </ViewLink>
          ))}
        </nav>
        <div className="sidebar-context">
          <label className="field">
            {role === "business"
              ? "องค์กรที่กำลังจำลอง"
              : role === "consumer"
                ? "ผู้บริโภคที่กำลังจำลอง"
                : "พื้นที่ผู้ดูแลจำลอง"}
            {role !== "moderator" && (
              <select
                aria-label={
                  role === "business"
                    ? "เลือกธุรกิจจำลอง"
                    : "เลือกผู้บริโภคจำลอง"
                }
                value={
                  role === "business"
                    ? state.preferences.businessId
                    : state.preferences.consumerId
                }
                onChange={(e) =>
                  commit((s) => ({
                    ...s,
                    preferences: {
                      ...s.preferences,
                      [role === "business" ? "businessId" : "consumerId"]:
                        e.target.value,
                    },
                  }))
                }
              >
                {(role === "business" ? state.businesses : state.consumers).map(
                  (profile) => (
                    <option key={profile.id} value={profile.id}>
                      {profile.name}
                    </option>
                  ),
                )}
              </select>
            )}
          </label>
          {/*<p>
            {role === "business"
              ? business.verified
                ? "Business Verified · จำลอง"
                : "ยังไม่ยืนยันธุรกิจ"
              : "สลับบัญชีตัวอย่างเพื่อทดสอบการจัดกลุ่ม"}
          </p>*/}
        </div>
      </aside>
      {menuOpen && (
        <button
          className="navigation-scrim"
          aria-label="ปิดเมนู"
          onClick={() => setMenuOpen(false)}
        />
      )}
      <div className="platform-main">
        <header className="platform-topbar">
          <button
            ref={toggle}
            className="menu-button button--icon"
            aria-label="เปิดเมนู"
            aria-controls="role-navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Icon name="grid" />
          </button>
          <div className="workspace-breadcrumb">
            <span>{roleLabels[role]}</span>
            <Icon name="chevron" size={13} />
            <strong>{items.find((item) => item.view === view)?.label}</strong>
          </div>
          <div className="workspace-controls">
            <button
              className="theme-toggle button--icon"
              aria-label={
                state.preferences.theme === "light"
                  ? "เปลี่ยนเป็น Dark Mode"
                  : "เปลี่ยนเป็น Light Mode"
              }
              onClick={() =>
                commit((s) => ({
                  ...s,
                  preferences: {
                    ...s.preferences,
                    theme: s.preferences.theme === "light" ? "dark" : "light",
                  },
                }))
              }
            >
              <Icon
                name={state.preferences.theme === "light" ? "spark" : "desktop"}
                size={18}
              />
            </button>
            <label className="role-switch">
              <span>พื้นที่</span>
              <select
                aria-label="สลับบทบาท"
                value={role}
                onChange={(e) =>
                  commit((s) => ({
                    ...s,
                    preferences: {
                      ...s.preferences,
                      role: e.target.value as Role,
                    },
                  }))
                }
              >
                <option value="consumer">Consumer</option>
                <option value="business">Business</option>
                <option value="moderator">Moderator demo</option>
              </select>
            </label>
          </div>
        </header>
        <main
          ref={main}
          id="workspace-content"
          className="workspace-content"
          tabIndex={-1}
        >
          {children}
          <footer className="platform-footer">
            <span>ClaimWise · ฟังทุกฝ่าย หาทางออกด้วยข้อมูล</span>
          </footer>
        </main>
        <nav className="platform-mobile-nav" aria-label="เมนูหลักบนมือถือ">
          {items.map((item) => (
            <ViewLink
              view={item.view}
              key={item.view}
              className={view === item.view ? "is-active" : ""}
              onNavigate={() => setMenuOpen(false)}
            >
              <Icon name={item.icon} size={19} />
              <span>{item.short}</span>
            </ViewLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
