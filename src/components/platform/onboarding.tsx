import type { Commit } from "../../hooks/use-platform";
import type { PlatformState, Theme } from "../../types/platform";
import { Icon } from "../icon";

export function Onboarding({
  state,
  commit,
}: {
  state: PlatformState;
  commit: Commit;
}) {
  const themeChosen = state.preferences.theme !== null;
  const chooseTheme = (theme: Theme) =>
    commit((s) => ({ ...s, preferences: { ...s.preferences, theme } }));
  return (
    <div className="onboarding">
      <a className="platform-brand" href="/">
        <span className="brand-symbol">
          <Icon name="shield" size={26} />
        </span>
        Legal<span>Check</span>
      </a>
      <main className="onboarding-content">
        <ol className="onboarding-steps" aria-label="ขั้นตอนเริ่มต้น">
          <li className={!themeChosen ? "current" : "complete"}>
            1 <span>เลือกธีม</span>
          </li>
          <li className={themeChosen ? "current" : ""}>
            2 <span>เลือกพื้นที่ทำงาน</span>
          </li>
        </ol>
        <h1>
          {themeChosen
            ? "วันนี้คุณต้องการทำอะไร?"
            : "เริ่มต้นในแบบที่คุณสบายตา"}
        </h1>
        <p className="onboarding-intro">
          {themeChosen
            ? "แยกพื้นที่ชัดเจน เพื่อให้ทุกฝ่ายหาทางออกด้วยข้อมูล"
            : "เลือก Light Mode หรือ Dark Mode เปลี่ยนได้ทุกเมื่อ โดยข้อมูลของคุณยังอยู่ครบ"}
        </p>
        {!themeChosen ? (
          <div className="onboarding-options">
            {(["light", "dark"] as const).map((theme) => (
              <button
                className={`onboarding-option theme-option theme-option--${theme}`}
                key={theme}
                onClick={() => chooseTheme(theme)}
              >
                <div className="theme-preview" aria-hidden="true">
                  <span />
                  <div>
                    <i />
                    <i />
                    <i />
                    <b />
                  </div>
                </div>
                <h2>{theme === "light" ? "Light Mode" : "Dark Mode"}</h2>
                <p>
                  {theme === "light"
                    ? "สว่าง อ่านง่าย พร้อมเริ่มวัน"
                    : "ลดความสว่าง สำหรับพื้นที่แสงน้อย"}
                </p>
                <Icon name="arrow" />
              </button>
            ))}
          </div>
        ) : (
          <>
            <div className="onboarding-options">
              <button
                className="onboarding-option role-option"
                onClick={() =>
                  commit((s) => ({
                    ...s,
                    preferences: { ...s.preferences, role: "consumer" },
                  }))
                }
              >
                <span className="role-symbol">
                  <Icon name="people" size={30} />
                </span>
                <h2>ผู้บริโภค</h2>
                <strong>เข้าใจสิทธิ เตรียมเรื่องให้พร้อม</strong>
                <p>
                  จัดเช็กลิสต์หลักฐาน ติดตามข้อร้องเรียน
                  และค้นหาประสบการณ์ที่คล้ายกัน
                </p>
                <span className="option-action">
                  เข้าสู่ Consumer Platform <Icon name="arrow" size={18} />
                </span>
              </button>
              <button
                className="onboarding-option role-option"
                onClick={() =>
                  commit((s) => ({
                    ...s,
                    preferences: { ...s.preferences, role: "business" },
                  }))
                }
              >
                <span className="role-symbol role-symbol--business">
                  <Icon name="business" size={30} />
                </span>
                <h2>ธุรกิจ / ผู้ประกอบการ</h2>
                <strong>รับฟังอย่างเป็นระบบ แก้ไขอย่างตรงจุด</strong>
                <p>
                  ค้นหาข้อร้องเรียนที่เกี่ยวข้อง ตอบกลับลูกค้า
                  และติดตามปัญหาที่เกิดซ้ำ
                </p>
                <span className="option-action">
                  เข้าสู่ Business Platform <Icon name="arrow" size={18} />
                </span>
              </button>
            </div>
            <button
              className="button button--quiet"
              onClick={() =>
                commit((s) => ({
                  ...s,
                  preferences: { ...s.preferences, theme: null },
                }))
              }
            >
              กลับไปเลือกธีม
            </button>
          </>
        )}
        <p className="local-disclaimer">
          <Icon name="shield" size={16} /> ต้นแบบเพื่อทดสอบ · ไม่ต้องสมัครสมาชิก
          · ทุกข้อมูลบันทึกเฉพาะเบราว์เซอร์นี้
        </p>
      </main>
    </div>
  );
}
