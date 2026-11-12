import { Icon } from "../icon";

export type DisplayMode = "desktop" | "mobile";

export function DeviceChooser({
  onChoose,
}: {
  onChoose: (mode: DisplayMode) => void;
}) {
  return (
    <div className="device-welcome">
      <header className="welcome-brand brand">
        <span className="brand-mark">
          <Icon name="shield" size={27} />
        </span>
        <span>
          Claim<span className="brand-light">Wise</span>
        </span>
      </header>
      <main className="device-chooser">
        <span className="welcome-tag">
          <span className="local-dot" /> YOUR RIGHTS, WITHIN REACH
        </span>
        <h1>
          เรื่องสิทธิ ให้เราช่วยดูแล
          <br />
          <span>ในแบบที่คุณเลือก</span>
        </h1>
        <p className="welcome-description">
          เลือกรูปแบบการแสดงผลที่เหมาะกับคุณ
          <br />
          พร้อมดูแลสิทธิของคุณในทุกหน้าจอ
        </p>
        <div className="device-options">
          <DeviceOption mode="desktop" onChoose={onChoose} />
          <DeviceOption mode="mobile" onChoose={onChoose} />
        </div>
        <p className="welcome-note">
          <Icon name="shield" size={15} />
          ไม่ต้องสมัครสมาชิก · ข้อมูลเคสเก็บไว้ในอุปกรณ์นี้
        </p>
        <p className="welcome-switch-note">
          เปลี่ยนรูปแบบได้ทุกเมื่อ โดยข้อมูลของคุณยังอยู่เหมือนเดิม
        </p>
      </main>
      <footer className="welcome-footer">
        ClaimWise · พื้นที่ปลอดภัยสำหรับสิทธิของคุณ
      </footer>
    </div>
  );
}

function DeviceOption({
  mode,
  onChoose,
}: {
  mode: DisplayMode;
  onChoose: (mode: DisplayMode) => void;
}) {
  const mobile = mode === "mobile";
  return (
    <button
      className={`device-option device-option--${mode}`}
      onClick={() => onChoose(mode)}
    >
      <div
        className={`device-illustration illustration--${mode}`}
        aria-hidden="true"
      >
        <div className="mini-device">
          <div className="mini-sidebar">
            <Icon name="shield" size={14} />
            <i />
            <i />
            <i />
          </div>
          <div className="mini-content">
            <div className="mini-topbar">
              <i />
              <span />
            </div>
            <div className="mini-hero">
              <span />
              <span />
              <b>
                <Icon name="shield" size={24} />
              </b>
            </div>
            <div className="mini-stats">
              <i />
              <i />
              <i />
            </div>
            <div className="mini-cards">
              <i />
              <i />
            </div>
          </div>
        </div>
        {!mobile && <div className="mini-stand" />}
        <span className="illustration-spark">
          <Icon name="spark" size={20} />
        </span>
      </div>
      <div className="device-option-heading">
        <span className="device-option-icon">
          <Icon name={mode === "desktop" ? "desktop" : "phone"} />
        </span>
        <div>
          <h2>{mobile ? "Mobile" : "Desktop"}</h2>
          <span>
            {mobile
              ? "ขนาดพอดีมือ พร้อมกรอบโทรศัพท์"
              : "พื้นที่กว้าง จัดการทุกเรื่องได้ครบ"}
          </span>
        </div>
        <Icon name="arrow" size={21} />
      </div>
      <span className={`device-recommendation recommended--${mode}`}>
        <Icon name="check" size={12} /> แนะนำสำหรับหน้าจอของคุณ
      </span>
    </button>
  );
}
