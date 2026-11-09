import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>) => ({
    view: typeof search.view === "string" ? search.view : "overview",
  }),
  component: Home,
});

type IconName =
  | "grid"
  | "scan"
  | "claim"
  | "people"
  | "business"
  | "book"
  | "help"
  | "arrow"
  | "chevron"
  | "plus"
  | "bell"
  | "search"
  | "shield"
  | "check"
  | "clock"
  | "file"
  | "external"
  | "close"
  | "upload"
  | "spark";
function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </>
    ),
    scan: <path d="M8 3H4v4m12-4h4v4M4 17v4h4m12-4v4h-4M8 8h8M8 12h8M8 16h5" />,
    claim: (
      <>
        <path d="M9 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-3" />
        <rect x="8" y="2" width="8" height="4" rx="1" />
        <path d="m8 13 2 2 5-5M8 18h8" />
      </>
    ),
    people: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3 21v-3a6 6 0 0 1 12 0v3M16 5a3 3 0 0 1 0 6m2 3a5 5 0 0 1 3 5v2" />
      </>
    ),
    business: (
      <>
        <rect x="3" y="7" width="18" height="14" rx="2" />
        <path d="M8 7V4h8v3M3 12a22 22 0 0 0 18 0M10 13h4" />
      </>
    ),
    book: (
      <path d="M12 5c-3-2-6-2-10-1v15c4-1 7-1 10 1 3-2 6-2 10-1V4c-4-1-7-1-10 1Zm0 0v15" />
    ),
    help: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M9.5 9a2.5 2.5 0 1 1 4 2c-1.5 1-1.5 1-1.5 3m0 3h.01" />
      </>
    ),
    arrow: <path d="M4 12h16m-6-6 6 6-6 6" />,
    chevron: <path d="m9 5 7 7-7 7" />,
    plus: <path d="M12 5v14M5 12h14" />,
    bell: <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />,
    search: (
      <>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m16 16 5 5" />
      </>
    ),
    shield: (
      <>
        <path d="m12 2 9 4v6c0 5-9 10-9 10S3 17 3 12V6Z" />
        <path d="m8 12 3 3 5-6" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    file: <path d="M14 2H5v20h14V7Zm0 0v6h5M8 12h8M8 16h6" />,
    external: <path d="M14 3h7v7m0-7L10 14M10 3H3v18h18v-7" />,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    upload: <path d="M12 16V3m-5 5 5-5 5 5M4 15v6h16v-6" />,
    spark: (
      <path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5ZM20 2v4m-2-2h4" />
    ),
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

type Case = {
  id: string;
  title: string;
  company: string;
  category: string;
  status: string;
  date: string;
  documents: string[];
};
const sampleCases: Case[] = [
  {
    id: "LC-2025-003",
    title: "โทรศัพท์มีปัญหาภายในระยะรับประกัน",
    company: "บริษัท เทคโมบาย จำกัด",
    category: "การรับประกัน",
    status: "กำลังดำเนินการ",
    date: "24 มิ.ย. 2568",
    documents: [],
  },
  {
    id: "LC-2025-002",
    title: "ขอคืนเงินเครื่องใช้ไฟฟ้าชำรุด",
    company: "โฮม อิเล็กทรอนิกส์",
    category: "การคืนเงิน",
    status: "รอเอกสารเพิ่มเติม",
    date: "22 มิ.ย. 2568",
    documents: [],
  },
  {
    id: "LC-2025-001",
    title: "สินค้าไม่ตรงตามรายละเอียดที่โฆษณา",
    company: "ร้านค้าออนไลน์",
    category: "สินค้าชำรุด",
    status: "แก้ไขเรียบร้อย",
    date: "18 มิ.ย. 2568",
    documents: [],
  },
];
const nav: { view: string; label: string; icon: IconName }[] = [
  { view: "overview", label: "ภาพรวม", icon: "grid" },
  { view: "legal", label: "AI Legal Check", icon: "scan" },
  { view: "claims", label: "Claim Assistant", icon: "claim" },
  { view: "connect", label: "Case Connect", icon: "people" },
  { view: "business", label: "Business Resolution", icon: "business" },
];
const tools: {
  view: string;
  icon: IconName;
  title: string;
  thai: string;
  text: string;
  action: string;
  color: string;
}[] = [
  {
    view: "legal",
    icon: "scan",
    title: "AI Legal Check",
    thai: "เช็กก่อนเซ็น เห็นก่อนเสี่ยง",
    text: "ตรวจสอบสัญญา การรับประกัน และนโยบายคืนเงิน พร้อมชี้จุดที่ควรระวัง",
    action: "เริ่มตรวจสอบ",
    color: "blue",
  },
  {
    view: "claims",
    icon: "claim",
    title: "Claim Assistant",
    thai: "เรียกร้องสิทธิ อย่างมีขั้นตอน",
    text: "วางแผนการร้องเรียน เตรียมเอกสารและจัดลำดับหลักฐานให้ครบถ้วน",
    action: "เริ่มเรียกร้องสิทธิ",
    color: "amber",
  },
  {
    view: "connect",
    icon: "people",
    title: "Case Connect",
    thai: "ปัญหาคล้ายกัน ช่วยกันหาทางออก",
    text: "เชื่อมต่อผู้ที่พบปัญหาคล้ายกัน แลกเปลี่ยนข้อมูล และช่องทางช่วยเหลือ",
    action: "ค้นหาเคสที่คล้ายกัน",
    color: "purple",
  },
  {
    view: "business",
    icon: "business",
    title: "Business Resolution",
    thai: "จัดการปัญหา สร้างความเชื่อมั่น",
    text: "จัดหมวดหมู่ข้อร้องเรียน มองเห็นปัญหาที่เกิดซ้ำ และติดตามการแก้ไข",
    action: "จัดการข้อร้องเรียน",
    color: "green",
  },
];
const articles = [
  {
    category: "สิทธิผู้บริโภค",
    title: "สินค้าชำรุด ใครต้องรับผิดชอบ?",
    description: "รู้จักสิทธิของคุณ เมื่อสินค้าที่ซื้อมาไม่เป็นไปตามที่คาดหวัง",
    image: "photo-1556742049-0cfed4f6a45d",
    body: "เก็บใบเสร็จ เงื่อนไขการรับประกัน ภาพถ่ายความเสียหาย และบทสนทนากับผู้ขาย แล้วแจ้งปัญหาเป็นลายลักษณ์อักษรโดยเร็ว การซ่อม เปลี่ยนสินค้า หรือคืนเงินขึ้นอยู่กับข้อเท็จจริง เงื่อนไขสัญญา และกฎหมายที่ใช้บังคับ ไม่ใช่ทุกกรณีจะมีสิทธิคืนเงินอัตโนมัติ หากตกลงกันไม่ได้ สามารถขอคำแนะนำจาก สคบ. โทร 1166",
  },
  {
    category: "กฎหมายใกล้ตัว",
    title: "Lemon Law คืออะไร? รู้ไว้ก่อนซื้อ",
    description:
      "ทำความเข้าใจแนวคิดกฎหมายคุ้มครองผู้ซื้อสินค้าที่มีความบกพร่อง",
    image: "photo-1449965408869-eaa3f722e40d",
    body: "Lemon Law เป็นแนวคิดคุ้มครองผู้ซื้อสินค้าที่มีความชำรุดบกพร่อง เช่น การกำหนดความรับผิดของผู้ประกอบธุรกิจและทางเลือกในการเยียวยา ข้อมูลในแพลตฟอร์มนี้กล่าวถึงแนวคิดและร่างกฎหมาย ไม่ใช่การยืนยันว่าสิทธิตามร่างมีผลใช้บังคับแล้ว ควรตรวจสอบสถานะล่าสุดจากราชกิจจานุเบกษาหรือ สคบ. ก่อนอ้างอิงในข้อพิพาท",
  },
  {
    category: "คู่มือการเรียกร้องสิทธิ",
    title: "5 หลักฐานสำคัญ ก่อนยื่นเรื่องร้องเรียน",
    description: "เตรียมเอกสารให้พร้อม เพิ่มโอกาสในการแก้ไขปัญหา",
    image: "photo-1450101499163-c8848c66ca85",
    body: "1. ใบเสร็จรับเงินหรือหลักฐานการชำระเงิน\n2. รายละเอียดสินค้า โฆษณา และคำสั่งซื้อ\n3. สัญญาและใบรับประกัน\n4. รูปภาพหรือวิดีโอแสดงปัญหา\n5. ประวัติการติดต่อผู้ขายและใบรับซ่อม\nจัดเรียงตามวันที่และสำรองต้นฉบับไว้ หลีกเลี่ยงการเปิดเผยข้อมูลส่วนบุคคลต่อสาธารณะ",
  },
];
function useLocal<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initial;
    } catch {
      return initial;
    }
  });
  const [error, setError] = useState(false);
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      setError(false);
    } catch {
      setError(true);
    }
  }, [key, value]);
  return [value, setValue, error] as const;
}

function HeroArt() {
  return (
    <svg
      className="hero-art"
      viewBox="0 0 400 240"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="230" cy="120" r="108" fill="#e7ecf8" />
      <circle cx="230" cy="120" r="85" stroke="#d8e1f3" strokeDasharray="4 7" />
      <path d="M80 195h265" stroke="#cad5eb" strokeWidth="2" />
      <g transform="rotate(-12 180 125)">
        <rect x="102" y="40" width="137" height="162" rx="9" fill="#c9d6ef" />
        <rect
          x="110"
          y="32"
          width="137"
          height="162"
          rx="9"
          fill="white"
          stroke="#a6b9df"
        />
        <rect x="128" y="52" width="34" height="34" rx="7" fill="#eaf0fa" />
        <path d="m137 68 6 6 11-13" stroke="#7696d1" strokeWidth="3" />
        <path
          d="M175 59h49M175 70h35M129 105h96M129 119h79M129 133h92M129 147h60"
          stroke="#c8d5ec"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <rect x="128" y="163" width="63" height="12" rx="4" fill="#fff0d4" />
      </g>
      <path
        d="M274 49v133M247 184h54M258 192h32"
        stroke="#4461ad"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <circle cx="274" cy="49" r="7" fill="#4461ad" />
      <path
        d="m223 78 51-17 57 17M232 77l-18 48h36l-18-48Zm89 0-18 48h36l-18-48Z"
        stroke="#4461ad"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M210 125a22 22 0 0 0 44 0m45 0a22 22 0 0 0 44 0"
        fill="#f6cf90"
        stroke="#d9ae6f"
        strokeWidth="2"
      />
      <path
        d="m265 139 28-11 28 11v24c0 23-28 39-28 39s-28-16-28-39Z"
        fill="#4461ad"
        stroke="#fff"
        strokeWidth="5"
      />
      <path
        d="m279 162 10 10 18-21"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <g fill="#f6cf90">
        <path d="m88 77 3-7 3 7 7 3-7 3-3 7-3-7-7-3ZM337 40l3-7 3 7 7 3-7 3-3 7-3-7-7-3Z" />
        <circle cx="355" cy="161" r="5" />
        <circle cx="93" cy="155" r="4" />
      </g>
    </svg>
  );
}

function Home() {
  const { view } = Route.useSearch();
  const activeView = [...nav.map((n) => n.view), "resources"].includes(view)
    ? view
    : "overview";
  const [cases, setCases, storageError] = useLocal<Case[]>(
    "legal-check-cases",
    sampleCases,
  );
  const [joined, setJoined, groupStorageError] = useLocal<string[]>(
    "legal-check-groups",
    [],
  );
  const [modal, setModal] = useState<"claim" | "help" | "notifications" | null>(
    null,
  );
  const [article, setArticle] = useState<(typeof articles)[number] | null>(
    null,
  );
  const [selected, setSelected] = useState<Case | null>(null);
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [contract, setContract] = useState("");
  const [analysis, setAnalysis] = useState(false);
  const [fileError, setFileError] = useState("");
  const [toast, setToast] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!toast) return;
    const timeout = setTimeout(() => setToast(""), 3500);
    return () => clearTimeout(timeout);
  }, [toast]);
  const filtered = cases.filter((c) =>
    `${c.title} ${c.company} ${c.id}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  const openCount = cases.filter((c) => c.status !== "แก้ไขเรียบร้อย").length;
  const closeModal = () => {
    setModal(null);
    setArticle(null);
    setSelected(null);
  };
  const navigateLink = (
    target: string,
    children: ReactNode,
    className?: string,
  ) => (
    <Link
      key={target}
      to="/"
      search={{ view: target }}
      className={className}
      onClick={() => {
        setMenuOpen(false);
        setQuery("");
      }}
    >
      {children}
    </Link>
  );
  const updateCase = (next: Case) => {
    setSelected(next);
    setCases((prev) => prev.map((c) => (c.id === next.id ? next : c)));
  };
  const caseTable = (
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
            <tr key={c.id} onClick={() => setSelected(c)}>
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
                        setSelected(c);
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
  const knowledge = (
    <section className="knowledge">
      <div className="section-heading">
        <h2>
          รู้สิทธิ ก่อนเกิดปัญหา{" "}
          <span className="heading-note">
            เรื่องกฎหมาย เข้าใจง่ายกว่าที่คิด
          </span>
        </h2>
        {navigateLink(
          "resources",
          <>
            ดูบทความทั้งหมด <Icon name="arrow" size={16} />
          </>,
          "text-link",
        )}
      </div>
      <div className="article-grid">
        {articles.map((a) => (
          <button
            className="article-card"
            key={a.title}
            onClick={() => setArticle(a)}
          >
            <div
              className="article-image"
              style={{
                backgroundImage: `url(https://images.unsplash.com/${a.image}?auto=format&fit=crop&w=700&q=85)`,
              }}
            >
              <span>{a.category}</span>
            </div>
            <div className="article-content">
              <h3>
                {a.title}
                <Icon name="arrow" size={18} />
              </h3>
              <p>{a.description}</p>
              <small>
                อ่านต่อ <Icon name="arrow" size={13} />
              </small>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? "mobile-open" : ""}`}>
        <Link to="/" search={{ view: "overview" }} className="brand">
          <span className="brand-mark">
            <Icon name="shield" size={29} />
          </span>
          <span>
            Legal<span className="brand-light">Check</span>
            <small>สิทธิของคุณ เราดูแล</small>
          </span>
        </Link>
        <div className="workspace-label">WORKSPACE</div>
        <nav>
          {nav.map((n) =>
            navigateLink(
              n.view,
              <>
                <Icon name={n.icon} />
                <span>{n.label}</span>
                {n.view === "legal" && <span className="ai-label">AI</span>}
              </>,
              `nav-item ${activeView === n.view ? "active" : ""}`,
            ),
          )}
        </nav>
        <div className="sidebar-divider" />
        <div className="workspace-label">เรียนรู้และช่วยเหลือ</div>
        {navigateLink(
          "resources",
          <>
            <Icon name="book" />
            <span>คลังความรู้กฎหมาย</span>
          </>,
          `nav-item ${activeView === "resources" ? "active" : ""}`,
        )}
        <button
          className="nav-item"
          onClick={() => {
            setModal("help");
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
            {navigateLink(
              "resources",
              <>
                ทำความรู้จักสิทธิของคุณ <Icon name="arrow" size={15} />
              </>,
              "promo-link",
            )}
          </div>
          <div className="local-note">
            <span className="local-dot" /> ข้อมูลของคุณอยู่บนอุปกรณ์นี้
            <Icon name="shield" size={13} />
          </div>
        </div>
      </aside>
      {menuOpen && (
        <div className="sidebar-overlay" onClick={() => setMenuOpen(false)} />
      )}
      <div className="main-shell">
        <header className="topbar">
          <div className="breadcrumb">
            <button
              className="mobile-toggle icon-button"
              aria-label="เปิดเมนู"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <Icon name="grid" />
            </button>
            <span>พื้นที่ของฉัน</span>
            <Icon name="chevron" size={13} />
            <strong>
              {nav.find((n) => n.view === activeView)?.label ??
                "คลังความรู้กฎหมาย"}
            </strong>
          </div>
          <div className="header-actions">
            <span className="secure-badge">
              <Icon name="shield" size={14} />
              พื้นที่ปลอดภัยสำหรับสิทธิของคุณ
            </span>
            <button
              className="notification-button icon-button"
              aria-label="การแจ้งเตือน"
              onClick={() => setModal("notifications")}
            >
              <Icon name="bell" />
              <span />
            </button>
            <span className="header-divider" />
            <span className="avatar">LC</span>
          </div>
        </header>
        <main>
          {(storageError || groupStorageError) && (
            <div className="storage-warning">
              ไม่สามารถบันทึกข้อมูลได้ โปรดอนุญาต Local Storage ก่อนใช้งานต่อ
            </div>
          )}
          <div className="page-heading">
            <div>
              <div className="eyebrow">YOUR RIGHTS, SIMPLIFIED</div>
              <h1>
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
            <button
              className="primary-button new-case"
              onClick={() => setModal("claim")}
            >
              <Icon name="plus" size={18} />
              สร้างเคสใหม่
            </button>
          </div>
          {activeView === "overview" && (
            <>
              <section className="hero">
                <div className="hero-copy">
                  <span className="hero-tag">
                    <span />
                    LEGAL CHECK อยู่เคียงข้างคุณ
                  </span>
                  <h2>
                    เข้าใจสิทธิของคุณ
                    <br />
                    เริ่มต้นด้วยความมั่นใจ<span>.</span>
                  </h2>
                  <p>
                    ไม่ว่าจะเป็นสัญญาที่อ่านไม่เข้าใจ สินค้าที่มีปัญหา
                    หรือการขอคืนเงิน
                    <br className="desktop-break" /> เราช่วยให้เรื่องซับซ้อน
                    กลายเป็นขั้นตอนที่คุณจัดการได้
                  </p>
                  <div className="hero-actions">
                    {navigateLink(
                      "legal",
                      <>
                        <Icon name="scan" size={18} />
                        ตรวจสอบสัญญาฟรี
                        <Icon name="arrow" size={17} />
                      </>,
                      "primary-button",
                    )}
                    <button
                      className="hero-secondary"
                      onClick={() => setModal("help")}
                    >
                      รู้จัก Legal Check <Icon name="arrow" size={16} />
                    </button>
                  </div>
                  <span className="hero-footnote">
                    <Icon name="shield" size={12} />
                    ไม่ต้องสมัครสมาชิก · ข้อมูลเป็นส่วนตัว
                  </span>
                </div>
                <HeroArt />
              </section>
              <section className="stats-grid">
                <Stat
                  icon="claim"
                  color="blue"
                  title="เคสทั้งหมดของคุณ"
                  count={cases.length}
                  note="เคสที่บันทึกไว้ในอุปกรณ์นี้"
                />
                <Stat
                  icon="clock"
                  color="amber"
                  title="กำลังดำเนินการ"
                  count={openCount}
                  note="อยู่ระหว่างการติดตามและแก้ไข"
                />
                <Stat
                  icon="check"
                  color="green"
                  title="แก้ไขเรียบร้อย"
                  count={cases.length - openCount}
                  note="อีกก้าวของการคุ้มครองสิทธิ"
                />
                <Stat
                  icon="people"
                  color="purple"
                  title="กลุ่มที่คุณเข้าร่วม"
                  count={joined.length}
                  note="เชื่อมต่อ เพื่อหาทางออกร่วมกัน"
                />
              </section>
              <section className="tools-section">
                <div className="section-heading">
                  <h2>ให้เราช่วยคุณเรื่องไหนดี?</h2>
                  <span className="section-subtitle">
                    เครื่องมือเพื่อสิทธิของทุกคน
                  </span>
                </div>
                <div className="tools-grid">
                  {tools.map((t) =>
                    navigateLink(
                      t.view,
                      <>
                        <div className="tool-top">
                          <span className={`tool-icon ${t.color}`}>
                            <Icon name={t.icon} size={25} />
                          </span>
                          {t.view === "legal" && (
                            <span className="smart-label">
                              <Icon name="spark" size={11} />
                              Demo
                            </span>
                          )}
                        </div>
                        <h3>{t.title}</h3>
                        <h4>{t.thai}</h4>
                        <p>{t.text}</p>
                        <span className="tool-link">
                          {t.action}
                          <Icon name="arrow" size={17} />
                        </span>
                      </>,
                      `tool-card ${t.color}`,
                    ),
                  )}
                </div>
              </section>
            </>
          )}
          {(activeView === "overview" || activeView === "claims") && (
            <section className="cases-section">
              <div className="section-heading">
                <h2>
                  {activeView === "overview"
                    ? "เคสล่าสุดของคุณ"
                    : "เคสทั้งหมดของคุณ"}{" "}
                  <span className="count-pill">{cases.length}</span>
                  <span className="sample-label">มีข้อมูลตัวอย่าง</span>
                </h2>
                {activeView === "overview" ? (
                  navigateLink(
                    "claims",
                    <>
                      ดูเคสทั้งหมด
                      <Icon name="arrow" size={16} />
                    </>,
                    "text-link",
                  )
                ) : (
                  <label className="search-field">
                    <Icon name="search" size={17} />
                    <input
                      aria-label="ค้นหาเคส"
                      placeholder="ค้นหาเคสหรือผู้ประกอบการ"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  </label>
                )}
              </div>
              <div className="table-card">{caseTable}</div>
            </section>
          )}
          {activeView === "legal" && (
            <section className="panel legal-panel">
              <div className="panel-title">
                <span className="tool-icon blue">
                  <Icon name="scan" size={26} />
                </span>
                <div>
                  <h2>ตรวจสอบเงื่อนไขของคุณ</h2>
                  <p>
                    โหมดสาธิต: คัดกรองด้วยคำสำคัญ ยังไม่เชื่อมต่อ AI
                    และไม่ใช่คำปรึกษาทางกฎหมาย
                  </p>
                </div>
              </div>
              <label className="field-label" htmlFor="contract">
                วางข้อความสัญญา เงื่อนไขการรับประกัน หรือนโยบายคืนเงิน
              </label>
              <textarea
                id="contract"
                rows={9}
                value={contract}
                onChange={(e) => {
                  setContract(e.target.value);
                  setAnalysis(false);
                }}
                placeholder="ตัวอย่าง: สินค้าซื้อแล้วไม่รับคืนทุกกรณี บริษัทขอสงวนสิทธิ์เปลี่ยนแปลงเงื่อนไขโดยไม่แจ้งให้ทราบ..."
              />
              <div className="legal-actions">
                <input
                  hidden
                  type="file"
                  ref={fileRef}
                  accept=".txt,text/plain"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      if (file.size > 1024 * 1024) {
                        setFileError("กรุณาเลือกไฟล์ไม่เกิน 1 MB");
                        return;
                      }
                      try {
                        setContract(await file.text());
                        setAnalysis(false);
                        setFileError("");
                      } catch {
                        setFileError(
                          "ไม่สามารถอ่านไฟล์นี้ได้ กรุณาลองอีกครั้ง",
                        );
                      }
                    }
                  }}
                />
                <button
                  className="secondary-button"
                  onClick={() => fileRef.current?.click()}
                >
                  <Icon name="upload" size={17} />
                  นำเข้าไฟล์ .txt (ไม่เกิน 1 MB)
                </button>
                <button
                  className="primary-button"
                  disabled={!contract.trim()}
                  onClick={() => setAnalysis(true)}
                >
                  <Icon name="spark" size={17} />
                  ตรวจสอบข้อความ
                </button>
              </div>
              {fileError && <p className="error-text">{fileError}</p>}
              <p className="privacy-note">
                <Icon name="shield" size={14} />
                ประมวลผลบนอุปกรณ์ของคุณ ไม่ส่งข้อความไปยังเซิร์ฟเวอร์
              </p>
              {analysis && (
                <Analysis
                  contract={contract}
                  onClaim={() => setModal("claim")}
                />
              )}
            </section>
          )}
          {activeView === "connect" && (
            <>
              <div className="info-banner">
                <Icon name="shield" />
                <p>
                  กลุ่มด้านล่างเป็นกลุ่มตัวอย่าง
                  การเข้าร่วมบันทึกไว้เฉพาะอุปกรณ์นี้ ไม่เชื่อมต่อผู้ใช้อื่น
                  และไม่ใช่การฟ้องคดีร่วมกันโดยอัตโนมัติ
                </p>
              </div>
              <div className="groups-grid">
                {[
                  "ปัญหาสินค้าอิเล็กทรอนิกส์",
                  "การคืนเงินจากร้านค้าออนไลน์",
                  "ปัญหาการรับประกันเครื่องใช้ไฟฟ้า",
                ].map((g, i) => (
                  <div className="panel group-card" key={g}>
                    <span
                      className={`tool-icon ${["blue", "amber", "purple"][i]}`}
                    >
                      <Icon name="people" size={28} />
                    </span>
                    <span className="sample-label">กลุ่มตัวอย่าง</span>
                    <h2>{g}</h2>
                    <p>
                      รวบรวมแนวทางเตรียมหลักฐาน
                      และช่องทางช่วยเหลือสำหรับปัญหาที่คล้ายกัน
                      โดยไม่เปิดเผยข้อมูลส่วนบุคคล
                    </p>
                    <div className="group-topics">
                      <span>ใบเสร็จ / คำสั่งซื้อ</span>
                      <span>ประวัติการติดต่อ</span>
                    </div>
                    <button
                      className={
                        joined.includes(g)
                          ? "secondary-button"
                          : "primary-button"
                      }
                      onClick={() =>
                        setJoined((prev) =>
                          prev.includes(g)
                            ? prev.filter((item) => item !== g)
                            : [...prev, g],
                        )
                      }
                    >
                      <Icon
                        name={joined.includes(g) ? "check" : "plus"}
                        size={17}
                      />
                      {joined.includes(g)
                        ? "เข้าร่วมแล้ว · ออกจากกลุ่ม"
                        : "บันทึกการเข้าร่วม"}
                    </button>
                  </div>
                ))}
              </div>
              <section className="panel help-links">
                <h2>ช่องทางช่วยเหลือที่เหมาะสม</h2>
                <p>
                  ร้องเรียนปัญหาผู้บริโภคกับ สคบ. โทร 1166
                  หรือปัญหาการซื้อขายออนไลน์กับ 1212 ETDA
                </p>
                <a
                  className="text-link"
                  href="https://www.ocpb.go.th/"
                  target="_blank"
                  rel="noreferrer"
                >
                  เว็บไซต์ สคบ.
                  <Icon name="external" size={15} />
                </a>
              </section>
            </>
          )}
          {activeView === "business" && (
            <>
              <section className="stats-grid business-stats">
                <Stat
                  icon="business"
                  color="blue"
                  title="ข้อร้องเรียนทั้งหมด"
                  count={cases.length}
                  note="รวมเคสในอุปกรณ์นี้"
                />
                <Stat
                  icon="clock"
                  color="amber"
                  title="รอการแก้ไข"
                  count={openCount}
                  note="ติดตามและประสานงาน"
                />
                <Stat
                  icon="check"
                  color="green"
                  title="ปิดเคสแล้ว"
                  count={cases.length - openCount}
                  note="ดำเนินการเรียบร้อย"
                />
              </section>
              <div className="panel">
                <h2>ประเภทปัญหาที่พบ</h2>
                <p className="muted">
                  สรุปจากเคสที่บันทึกไว้ รวมข้อมูลตัวอย่าง
                </p>
                <div className="bar-chart">
                  {["การรับประกัน", "การคืนเงิน", "สินค้าชำรุด"].map(
                    (category) => {
                      const count = cases.filter(
                        (c) => c.category === category,
                      ).length;
                      return (
                        <div className="bar-row" key={category}>
                          <span>{category}</span>
                          <div className="bar-track">
                            <div
                              style={{
                                width: `${cases.length ? (count / cases.length) * 100 : 0}%`,
                              }}
                            />
                          </div>
                          <strong>{count} เคส</strong>
                        </div>
                      );
                    },
                  )}
                </div>
              </div>
              <section className="cases-section">
                <div className="section-heading">
                  <h2>ติดตามข้อร้องเรียน</h2>
                  <span className="section-subtitle">
                    เลือกเคสเพื่ออัปเดตสถานะ
                  </span>
                </div>
                <div className="table-card">{caseTable}</div>
              </section>
            </>
          )}
          {(activeView === "overview" || activeView === "resources") &&
            knowledge}
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
              <button
                onClick={() =>
                  setArticle({
                    category: "ความเป็นส่วนตัว",
                    title: "นโยบายความเป็นส่วนตัว",
                    description: "",
                    image: "",
                    body: "เคสและการเข้าร่วมกลุ่มจะบันทึกใน Local Storage ของเบราว์เซอร์นี้ ไม่มีระบบบัญชีหรือฐานข้อมูลกลาง ข้อความสัญญาประมวลผลในเบราว์เซอร์และไม่ถูกส่งไปยังบริการ AI หลีกเลี่ยงบันทึกเลขบัตรประชาชนหรือข้อมูลอ่อนไหวบนอุปกรณ์ที่ใช้ร่วมกัน การล้างข้อมูลเว็บไซต์จะลบเคสทั้งหมด รูปภาพและฟอนต์โหลดจากผู้ให้บริการภายนอก",
                  })
                }
              >
                นโยบายความเป็นส่วนตัว
              </button>
              <span>·</span>
              <button onClick={() => setModal("help")}>ติดต่อเรา</button>
            </div>
          </footer>
        </main>
      </div>
      {(modal || article || selected) && (
        <Modal
          title={
            article?.title ??
            selected?.title ??
            (modal === "claim"
              ? "เริ่มต้นเรียกร้องสิทธิ"
              : modal === "notifications"
                ? "การแจ้งเตือนของคุณ"
                : "Legal Check ช่วยคุณอย่างไร")
          }
          onClose={closeModal}
        >
          {modal === "claim" && (
            <ClaimForm
              onSave={(data) => {
                const next: Case = {
                  ...data,
                  id: `LC-${Date.now()}`,
                  status: "รอเอกสารเพิ่มเติม",
                  date: new Date().toLocaleDateString("th-TH", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }),
                  documents: [],
                };
                setCases((prev) => [next, ...prev]);
                closeModal();
                setSelected(next);
                setToast("สร้างเคสและเช็กลิสต์เรียบร้อยแล้ว");
              }}
            />
          )}
          {article && (
            <>
              <span className="article-category">{article.category}</span>
              <p className="article-body">{article.body}</p>
              {article.title.includes("Lemon") && (
                <a
                  className="text-link"
                  href="https://www.ratchakitcha.soc.go.th/"
                  target="_blank"
                  rel="noreferrer"
                >
                  ตรวจสอบราชกิจจานุเบกษา
                  <Icon name="external" size={15} />
                </a>
              )}
            </>
          )}
          {selected && (
            <>
              <div className="case-meta">
                {selected.id} · {selected.company}
              </div>
              <label className="field-label" htmlFor="status">
                สถานะการดำเนินการ
              </label>
              <select
                id="status"
                value={selected.status}
                onChange={(e) =>
                  updateCase({
                    ...selected,
                    status: e.target.value,
                    date: new Date().toLocaleDateString("th-TH", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }),
                  })
                }
              >
                {["รอเอกสารเพิ่มเติม", "กำลังดำเนินการ", "แก้ไขเรียบร้อย"].map(
                  (s) => (
                    <option key={s}>{s}</option>
                  ),
                )}
              </select>
              <h3 className="checklist-title">เช็กลิสต์เตรียมหลักฐาน</h3>
              <p className="muted">
                ทำเครื่องหมายเอกสารที่เตรียมพร้อมแล้ว ไม่จำเป็นต้องอัปโหลด
              </p>
              {[
                "ใบเสร็จ / หลักฐานการชำระเงิน",
                "คำสั่งซื้อ / รายละเอียดสินค้า",
                "รูปภาพหรือวิดีโอแสดงปัญหา",
                "เงื่อนไขสัญญา / ใบรับประกัน",
                "ประวัติการติดต่อผู้ขาย",
              ].map((doc) => (
                <label className="checklist-item" key={doc}>
                  <input
                    type="checkbox"
                    checked={selected.documents.includes(doc)}
                    onChange={() =>
                      updateCase({
                        ...selected,
                        documents: selected.documents.includes(doc)
                          ? selected.documents.filter((d) => d !== doc)
                          : [...selected.documents, doc],
                      })
                    }
                  />
                  {doc}
                </label>
              ))}
              <div className="next-steps">
                <h4>ขั้นตอนถัดไป</h4>
                <ol>
                  <li>รวบรวมหลักฐาน และระบุสิ่งที่ต้องการให้แก้ไข</li>
                  <li>ติดต่อผู้ขายเป็นลายลักษณ์อักษร เก็บสำเนาการติดต่อ</li>
                  <li>หากไม่สามารถตกลงกันได้ ติดต่อ สคบ. 1166</li>
                </ol>
              </div>
            </>
          )}
          {modal === "help" && (
            <>
              <p className="article-body">
                Legal Check ช่วยตรวจข้อความสัญญาเบื้องต้น
                เตรียมหลักฐานเรียกร้องสิทธิ และติดตามข้อร้องเรียน
                โดยไม่ต้องสมัครสมาชิก ข้อมูลทั้งหมดบันทึกในเบราว์เซอร์ของคุณ
              </p>
              <div className="next-steps">
                <h3>ต้องการความช่วยเหลือด้านสิทธิ?</h3>
                <p>สำนักงานคณะกรรมการคุ้มครองผู้บริโภค (สคบ.)</p>
                <a href="tel:1166" className="primary-button">
                  โทร 1166
                  <Icon name="arrow" size={16} />
                </a>
                <p>ปัญหาซื้อขายออนไลน์: 1212 ETDA</p>
                <a
                  href="https://www.ocpb.go.th/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-link"
                >
                  ไปยังเว็บไซต์ สคบ.
                  <Icon name="external" size={16} />
                </a>
              </div>
            </>
          )}
          {modal === "notifications" && (
            <>
              <p className="muted">การแจ้งเตือนจากเคสในอุปกรณ์ของคุณ</p>
              {cases
                .filter((c) => c.status === "รอเอกสารเพิ่มเติม")
                .map((c) => (
                  <button
                    className="notification-item"
                    key={c.id}
                    onClick={() => {
                      setModal(null);
                      setSelected(c);
                    }}
                  >
                    <span className="tool-icon amber">
                      <Icon name="file" />
                    </span>
                    <div>
                      <strong>เตรียมเอกสารให้ครบถ้วน</strong>
                      <p>{c.title}</p>
                    </div>
                    <Icon name="chevron" size={16} />
                  </button>
                ))}
              {!cases.some((c) => c.status === "รอเอกสารเพิ่มเติม") && (
                <div className="empty">ไม่มีการแจ้งเตือนใหม่</div>
              )}
            </>
          )}
        </Modal>
      )}
      {toast && (
        <div className="toast" role="status">
          <Icon name="check" size={18} />
          {toast}
        </div>
      )}
    </div>
  );
}

function Analysis({
  contract,
  onClaim,
}: {
  contract: string;
  onClaim: () => void;
}) {
  const rules = [
    {
      regex: /ไม่รับคืน|ไม่คืนเงิน|ทุกกรณี/,
      title: "ข้อจำกัดการคืนสินค้า / คืนเงิน",
      text: "พบข้อความจำกัดสิทธิการคืนสินค้า ควรตรวจสอบข้อยกเว้นกรณีสินค้าชำรุดหรือไม่ตรงตามสัญญา",
    },
    {
      regex: /สงวนสิทธิ์|เปลี่ยนแปลง|ไม่แจ้ง/,
      title: "การเปลี่ยนเงื่อนไขฝ่ายเดียว",
      text: "ตรวจสอบว่ามีการแจ้งให้ทราบและมีทางเลือกสำหรับผู้บริโภคอย่างเหมาะสมหรือไม่",
    },
    {
      regex: /รับประกัน|ซ่อม|ชำรุด/,
      title: "ขอบเขตการรับประกัน",
      text: "ตรวจสอบระยะเวลา ค่าใช้จ่าย ข้อยกเว้น และขั้นตอนการซ่อมหรือเปลี่ยนสินค้าให้ชัดเจน",
    },
  ].filter((r) => r.regex.test(contract));
  return (
    <div className="analysis-result">
      <h3>ผลการคัดกรองเบื้องต้น</h3>
      <p>
        โหมดสาธิต: ใช้การค้นหาคำสำคัญ ไม่ได้เชื่อมต่อบริการ AI
        และไม่สามารถตัดสินความชอบด้วยกฎหมาย
      </p>
      {rules.map((r) => (
        <div className="result-item" key={r.title}>
          <Icon name="help" />
          <div>
            <h4>{r.title}</h4>
            <p>{r.text}</p>
            <blockquote>
              “{contract.split(/[。\n]/).find((s) => r.regex.test(s))}”
            </blockquote>
          </div>
        </div>
      ))}
      {rules.length === 0 && (
        <p>
          ไม่พบคำสำคัญตามเกณฑ์สาธิต ไม่ได้หมายความว่าสัญญาปลอดความเสี่ยง
          ควรอ่านเงื่อนไขทั้งหมดหรือปรึกษาผู้เชี่ยวชาญ
        </p>
      )}
      <button className="text-link" onClick={onClaim}>
        เตรียมเคสจากเอกสารนี้
        <Icon name="arrow" size={16} />
      </button>
    </div>
  );
}
function Stat({
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
function ClaimForm({
  onSave,
}: {
  onSave: (data: Pick<Case, "title" | "company" | "category">) => void;
}) {
  return (
    <form
      className="claim-form"
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        onSave({
          title: String(data.get("title")).trim(),
          company: String(data.get("company")).trim(),
          category: String(data.get("category")),
        });
      }}
    >
      <p className="muted">
        บอกเราเกี่ยวกับปัญหา เพื่อสร้างเคสและเช็กลิสต์หลักฐานของคุณ
      </p>
      <label>
        ปัญหาที่พบ
        <input
          name="title"
          required
          maxLength={160}
          pattern=".*\S.*"
          placeholder="เช่น โทรศัพท์ชำรุดหลังใช้งาน 7 วัน"
        />
      </label>
      <label>
        ร้านค้า / ผู้ประกอบการ
        <input
          name="company"
          required
          maxLength={100}
          pattern=".*\S.*"
          placeholder="ระบุชื่อร้านค้าหรือบริษัท"
        />
      </label>
      <label>
        ประเภทปัญหา
        <select name="category">
          <option>สินค้าชำรุด</option>
          <option>การรับประกัน</option>
          <option>การคืนเงิน</option>
        </select>
      </label>
      <div className="info-banner">
        <Icon name="shield" size={20} />
        <p>
          อย่าใส่เลขบัตรประชาชนหรือข้อมูลอ่อนไหว
          ข้อมูลนี้เก็บไว้เฉพาะในเบราว์เซอร์
        </p>
      </div>
      <button type="submit" className="primary-button">
        <Icon name="plus" size={18} />
        สร้างเคสและเตรียมหลักฐาน
      </button>
    </form>
  );
}
function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);
  return (
    <dialog
      ref={ref}
      className="modal"
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-label={title}
    >
      <div className="modal-heading">
        <h2>{title}</h2>
        <button className="icon-button" aria-label="ปิด" onClick={onClose}>
          <Icon name="close" />
        </button>
      </div>
      <div className="modal-body">{children}</div>
    </dialog>
  );
}
