import { Icon } from "../icon";

export function PageFooter({
  onPrivacy,
  onHelp,
}: {
  onPrivacy: () => void;
  onHelp: () => void;
}) {
  return (
    <>
      <div className="bottom-note">
        <Icon name="shield" size={17} />
        <p>
          Legal Check เป็นผู้ช่วยให้ข้อมูลเบื้องต้น
          ไม่ใช่ผู้ให้คำปรึกษาทางกฎหมาย และไม่ทดแทนคำแนะนำจากทนายความ
        </p>
        <span>ออกแบบมาเพื่อสิทธิของคุณ</span>
      </div>
      <footer>
        <span>
          © {new Date().getFullYear()} Legal Check. All rights reserved.
        </span>
        <div>
          <button onClick={onPrivacy}>นโยบายความเป็นส่วนตัว</button>
          <span>·</span>
          <button onClick={onHelp}>ติดต่อเรา</button>
        </div>
      </footer>
    </>
  );
}
