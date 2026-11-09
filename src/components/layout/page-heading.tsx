import { Icon } from "../icon";

export function PageHeading({
  activeView,
  onCreateCase,
}: {
  activeView: string;
  onCreateCase: () => void;
}) {
  return (
    <div className="page-heading">
      <div>
        <div className="eyebrow">YOUR RIGHTS, SIMPLIFIED</div>
        <h1 tabIndex={-1}>
          {activeView === "overview"
            ? "เรื่องสิทธิ ให้เราช่วยดูแล"
            : activeView === "legal"
              ? "AI Legal Check"
              : activeView === "claims"
                ? "เคสและการเรียกร้องสิทธิของคุณ"
                : activeView === "connect"
                  ? "ปัญหาคล้ายกัน ไม่ต้องเดินลำพัง"
                  : activeView === "business"
                    ? "เปลี่ยนข้อร้องเรียน เป็นความเข้าใจ"
                    : "รู้สิทธิ ใช้สิทธิอย่างเข้าใจ"}
        </h1>
        <p>
          {activeView === "overview"
            ? "เข้าใจสิทธิ ตรวจสอบสัญญา และจัดการปัญหาทางกฎหมายได้ในที่เดียว"
            : activeView === "legal"
              ? "ตรวจสอบข้อความที่ควรระวังในสัญญาและเงื่อนไข ก่อนตัดสินใจ"
              : activeView === "connect"
                ? "เรียนรู้จากปัญหาที่คล้ายกัน และค้นหาช่องทางช่วยเหลือที่เหมาะสม"
                : activeView === "business"
                  ? "จัดประเภทข้อร้องเรียน มองเห็นปัญหาซ้ำ และติดตามการแก้ไข"
                  : "ความรู้และเครื่องมือที่ช่วยให้คุณจัดการปัญหาได้อย่างมั่นใจ"}
        </p>
      </div>
      <button className="primary-button new-case" onClick={onCreateCase}>
        <Icon name="plus" size={18} />
        สร้างเคสใหม่
      </button>
    </div>
  );
}
