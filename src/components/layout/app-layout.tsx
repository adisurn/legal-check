import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { nav } from "../../data/legal-check";
import { Icon } from "../icon";
import { ViewLink } from "../view-link";
import { MobileNavigation } from "./mobile-navigation";

export function AppLayout({
  activeView,
  onNavigate,
  onHelp,
  onNotifications,
  children,
}: {
  activeView: string;
  onNavigate: () => void;
  onHelp: () => void;
  onNotifications: () => void;
  children: ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const main = useRef<HTMLElement>(null);
  const menuToggle = useRef<HTMLButtonElement>(null);
  const handleNavigate = () => {
    setMenuOpen(false);
    onNavigate();
  };

  useEffect(() => {
    main.current?.scrollTo({ top: 0 });
  }, [activeView]);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuToggle.current?.focus();
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  return (
    <div className="app-shell">
      <aside
        id="workspace-menu"
        className={`sidebar ${menuOpen ? "mobile-open" : ""}`}
      >
        <Link
          to="/"
          search={{ view: "overview" }}
          className="brand"
          onClick={handleNavigate}
        >
          <span className="brand-mark">
            <Icon name="shield" size={29} />
          </span>
          <span>
            Legal<span className="brand-light">Check</span>
            <small>สิทธิของคุณ เราดูแล</small>
          </span>
        </Link>
        <div className="workspace-label">WORKSPACE</div>
        <nav aria-label="เมนูพื้นที่ทำงาน">
          {nav.map((n) => (
            <ViewLink
              key={n.view}
              view={n.view}
              className={`nav-item ${activeView === n.view ? "active" : ""}`}
              onNavigate={handleNavigate}
            >
              <Icon name={n.icon} />
              <span>{n.label}</span>
              {n.view === "legal" && <span className="ai-label">AI</span>}
            </ViewLink>
          ))}
        </nav>
        <div className="sidebar-divider" />
        <div className="workspace-label">เรียนรู้และช่วยเหลือ</div>
        <ViewLink
          view="resources"
          className={`nav-item ${activeView === "resources" ? "active" : ""}`}
          onNavigate={handleNavigate}
        >
          <Icon name="book" />
          <span>คลังความรู้กฎหมาย</span>
        </ViewLink>
        <button
          className="nav-item"
          onClick={() => {
            onHelp();
            setMenuOpen(false);
          }}
        >
          <Icon name="help" />
          <span>ศูนย์ช่วยเหลือ</span>
        </button>
        <div className="sidebar-bottom">
          <div className="sidebar-promo">
            <span className="promo-icon">
              <Icon name="shield" size={24} />
            </span>
            <h3>สิทธิของคุณ สำคัญเสมอ</h3>
            <p>
              เริ่มต้นดูแลสิทธิของคุณ
              <br />
              ด้วยความรู้ที่เข้าใจง่าย
            </p>
            <ViewLink
              view="resources"
              className="promo-link"
              onNavigate={handleNavigate}
            >
              ทำความรู้จักสิทธิของคุณ <Icon name="arrow" size={15} />
            </ViewLink>
          </div>
          <div className="local-note">
            <span className="local-dot" /> ข้อมูลของคุณอยู่บนอุปกรณ์นี้
            <Icon name="shield" size={13} />
          </div>
        </div>
      </aside>
      {menuOpen && (
        <button
          className="sidebar-overlay"
          aria-label="ปิดเมนู"
          onClick={() => setMenuOpen(false)}
        />
      )}
      <div className="main-shell">
        <header className="topbar">
          <div className="breadcrumb">
            <button
              ref={menuToggle}
              className="mobile-toggle icon-button"
              aria-label="เปิดเมนู"
              aria-expanded={menuOpen}
              aria-controls="workspace-menu"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <Icon name="grid" />
            </button>
            <span className="mobile-wordmark">
              Legal<span>Check</span>
            </span>
            <div className="breadcrumb-trail">
              <span>พื้นที่ของฉัน</span>
              <Icon name="chevron" size={13} />
              <strong>
                {nav.find((n) => n.view === activeView)?.label ??
                  "คลังความรู้กฎหมาย"}
              </strong>
            </div>
          </div>
          <div className="header-actions">
            <span className="secure-badge">
              <Icon name="shield" size={14} />
              พื้นที่ปลอดภัยสำหรับสิทธิของคุณ
            </span>
            <button
              className="notification-button icon-button"
              aria-label="การแจ้งเตือน"
              onClick={onNotifications}
            >
              <Icon name="bell" />
              <span />
            </button>
            <span className="header-divider" />
            <span className="avatar">LC</span>
          </div>
        </header>
        <main ref={main}>{children}</main>
      </div>
      <MobileNavigation activeView={activeView} onNavigate={handleNavigate} />
    </div>
  );
}
