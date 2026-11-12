import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { Icon } from "../icon";
import type { DisplayMode } from "./device-chooser";

// Keep a single app tree: changing the presentation must not reset drafts or cases.
export function DeviceWorkspace({
  children,
  mode,
  onModeChange,
}: {
  children: ReactNode;
  mode: DisplayMode;
  onModeChange: (mode: DisplayMode) => void;
}) {
  const viewport = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mode)
      viewport.current?.querySelector("h1")?.focus({ preventScroll: true });
  }, [mode]);

  return (
    <div className={`device-workspace device-workspace--${mode}`}>
      <header className="display-toolbar">
        <div className="display-brand">
          <Icon name="shield" size={20} />
          <strong>
            Claim<span>Wise</span>
          </strong>
          <span className="display-toolbar-label">เลือกรูปแบบการแสดงผล</span>
        </div>
        <div
          className="display-switch"
          role="group"
          aria-label="รูปแบบการแสดงผล"
        >
          <button
            aria-pressed={mode === "desktop"}
            onClick={() => onModeChange("desktop")}
          >
            <Icon name="desktop" size={17} /> Desktop
          </button>
          <button
            aria-pressed={mode === "mobile"}
            onClick={() => onModeChange("mobile")}
          >
            <Icon name="phone" size={17} /> Mobile
          </button>
        </div>
        <span className="display-local-note">
          <span className="local-dot" /> บันทึกบนอุปกรณ์นี้
        </span>
      </header>
      <div className="device-stage">
        <div className="device-frame">
          <div className="device-screen">
            <div className="phone-status" aria-hidden="true">
              <span>9:41</span>
              <span className="phone-camera" />
              <svg width="57" height="14" viewBox="0 0 57 14" fill="none">
                <path
                  d="M1 11V9m4 2V7m4 4V5m4 6V3"
                  stroke="currentColor"
                  strokeWidth="2.5"
                />
                <path
                  d="M20 5a9 9 0 0 1 12 0m-10 3a6 6 0 0 1 8 0m-5 3h2"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <rect
                  x="38"
                  y="3"
                  width="16"
                  height="9"
                  rx="2"
                  stroke="currentColor"
                />
                <rect
                  x="40"
                  y="5"
                  width="12"
                  height="5"
                  rx="1"
                  fill="currentColor"
                />
                <path d="M56 6v3" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <div className="app-viewport" ref={viewport}>
              {children}
            </div>
            <div className="phone-home-indicator" aria-hidden="true">
              <span />
            </div>
          </div>
        </div>
        <p className="phone-preview-note">
          MOBILE EXPERIENCE <span>·</span> ทุกเรื่องสิทธิ อยู่ใกล้คุณ
        </p>
      </div>
    </div>
  );
}
