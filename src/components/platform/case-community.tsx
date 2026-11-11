import { useState } from "react";
import type { Commit } from "../../hooks/use-platform";
import {
  assessRisk,
  categoryLabels,
  dateLabel,
  groupClaims,
  historyEntry,
  id,
  publication,
  reviewLabels,
  statusLabels,
} from "../../lib/platform";
import type { Cluster, PlatformState } from "../../types/platform";
import { Icon } from "../icon";
import {
  Badge,
  Empty,
  emptyFilters,
  FilterBar,
  matchesFilters,
  Notice,
  RiskBadge,
} from "./shared";

export const safeLabel = (value: string) =>
  assessRisk(value).level === "low" ? value : "ข้อมูลอยู่ระหว่างตรวจสอบ";

export function CaseCommunity({
  state,
  commit,
  notify,
}: {
  state: PlatformState;
  commit: Commit;
  notify: (text: string) => void;
}) {
  const [filters, setFilters] = useState(emptyFilters);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const published = state.clusters.filter((c) => publication(state, c).visible);
  const related =
    state.preferences.role === "business"
      ? published.filter((c) =>
          groupClaims(state, c.id).some(
            (claim) => claim.businessId === state.preferences.businessId,
          ),
        )
      : published;
  const visible = related.filter((c) => matchesFilters(c, filters));
  const ownPrivate = state.clusters.filter(
    (c) =>
      !publication(state, c).visible &&
      groupClaims(state, c.id).some(
        (claim) => claim.consumerId === state.preferences.consumerId,
      ),
  );
  const selected = related.find((c) => c.id === selectedId);
  return (
    <>
      <div className="page-title">
        <div>
          <h1>Case Connect</h1>
          <p>ประเด็นร่วม พื้นที่กลางสำหรับประสบการณ์และทางออก</p>
        </div>
        <Badge tone="success">จัดกลุ่มอัตโนมัติ · จำลอง</Badge>
      </div>
      <Notice>
        หัวข้อสร้างจากข้อร้องเรียนที่เกี่ยวข้อง
        ไม่เปิดให้สร้างกระทู้ได้อย่างอิสระ
        จำนวนผู้ร้องเรียนไม่ใช่ข้อพิสูจน์ว่ามีการกระทำผิด
        และการเข้าร่วมไม่ใช่การฟ้องคดีร่วมกัน
      </Notice>
      {selected ? (
        <Discussion
          key={selected.id}
          cluster={selected}
          state={state}
          commit={commit}
          notify={notify}
          onBack={() => setSelectedId(null)}
        />
      ) : (
        <>
          <section className="surface">
            <FilterBar items={related} value={filters} onChange={setFilters} />
            <div className="section-line list-toolbar">
              <h2>ประเด็นที่เผยแพร่</h2>
              <span className="supporting">{visible.length} ประเด็น</span>
            </div>
            {!visible.length && (
              <Empty title="ยังไม่มีประเด็นที่ตรงกับการค้นหา">
                เรื่องส่วนตัวยังคงติดตามและส่งถึงธุรกิจได้
                โดยไม่ต้องรอการเผยแพร่
              </Empty>
            )}
            <div className="discussion-list">
              {visible.map((cluster) => {
                const claims = groupClaims(state, cluster.id);
                return (
                  <button
                    className="discussion-row"
                    key={cluster.id}
                    onClick={() => setSelectedId(cluster.id)}
                  >
                    <span className="discussion-icon">
                      <Icon name="people" size={25} />
                    </span>
                    <span>
                      <span className="tag-row">
                        <Badge tone="brand">
                          {categoryLabels[cluster.category]}
                        </Badge>
                        <Badge tone="success">ผ่านการพิจารณาเผยแพร่</Badge>
                      </span>
                      <h3>
                        {safeLabel(cluster.brand) || "ไม่ระบุแบรนด์"} ·{" "}
                        {safeLabel(cluster.product) || "ไม่ระบุสินค้า"}
                      </h3>
                      <p>
                        แลกเปลี่ยนข้อมูลเรื่อง{" "}
                        {cluster.tags.join(" / ") ||
                          categoryLabels[cluster.category]}{" "}
                        ด้วยถ้อยคำที่เป็นกลาง
                      </p>
                      <small>
                        {claims.length} ข้อร้องเรียนที่เกี่ยวข้อง ·{" "}
                        {new Set(claims.map((c) => c.consumerId)).size}{" "}
                        บัญชีจำลอง · ไม่ใช่ข้อสรุปข้อเท็จจริง
                      </small>
                    </span>
                    <Icon name="chevron" size={18} />
                  </button>
                );
              })}
            </div>
          </section>
          {state.preferences.role === "consumer" && ownPrivate.length > 0 && (
            <section className="surface">
              <h2>กลุ่มภายในที่มีข้อร้องเรียนของคุณ</h2>
              <p className="supporting">
                ยังไม่ใช่กระทู้สาธารณะ ไม่เปิดเผยข้อร้องเรียนของผู้อื่น
              </p>
              {ownPrivate.map((cluster) => (
                <div className="private-group" key={cluster.id}>
                  <strong>
                    {safeLabel(cluster.brand) || "ยังไม่ระบุแบรนด์"} ·{" "}
                    {safeLabel(cluster.product) || "ยังไม่ระบุสินค้า"}
                  </strong>
                  <Badge tone="warning">ส่วนตัว</Badge>
                  <p>{publication(state, cluster).reasons.join(" · ")}</p>
                </div>
              ))}
            </section>
          )}
          {state.preferences.role === "consumer" && (
            <PrivateContributions
              state={state}
              commit={commit}
              notify={notify}
            />
          )}
        </>
      )}
    </>
  );
}

function PrivateContributions({
  state,
  commit,
  notify,
}: {
  state: PlatformState;
  commit: Commit;
  notify: (text: string) => void;
}) {
  const [reason, setReason] = useState("");
  const [postId, setPostId] = useState("");
  const posts = state.posts.filter(
    (post) =>
      post.authorId === state.preferences.consumerId &&
      (post.review !== "approved" ||
        !publication(
          state,
          state.clusters.find((c) => c.id === post.clusterId)!,
        ).visible),
  );
  if (!posts.length) return null;
  return (
    <section className="surface">
      <h2>ข้อความของฉันที่ยังไม่แสดงสาธารณะ</h2>
      <p className="supporting">
        ข้อความไม่ถูกลบเมื่อกลุ่มถูกซ่อน
        คุณสามารถขอทบทวนได้แม้ไม่มีข้อร้องเรียนในกลุ่มนั้น
      </p>
      {posts.map((post) => (
        <div className="discussion-post" key={post.id}>
          <Badge tone="warning">{reviewLabels[post.review]}</Badge>
          <p className="preserve-text">{post.text}</p>
          <button className="inline-link" onClick={() => setPostId(post.id)}>
            ขอทบทวนข้อความนี้
          </button>
        </div>
      ))}
      {postId && (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const post = posts.find((p) => p.id === postId);
            if (!post || !reason.trim()) return;
            if (
              commit((s) => ({
                ...s,
                reports: [
                  ...s.reports,
                  {
                    id: id("appeal"),
                    clusterId: post.clusterId,
                    postId,
                    actorId: s.preferences.consumerId,
                    kind: "appeal",
                    reason: reason.trim(),
                    status: "pending",
                    outcome: "",
                    createdAt: new Date().toISOString(),
                  },
                ],
                history: [
                  historyEntry(
                    post.clusterId,
                    s.preferences.consumerId,
                    "ผู้เขียนอุทธรณ์สถานะข้อความส่วนตัว",
                  ),
                  ...s.history,
                ],
              }))
            ) {
              setReason("");
              setPostId("");
              notify("ส่งอุทธรณ์ข้อความให้ผู้ดูแลจำลองแล้ว");
            }
          }}
        >
          <label className="field">
            เหตุผลอุทธรณ์ข้อความ
            <textarea
              rows={3}
              maxLength={1500}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </label>
          <button
            className="button button--secondary"
            disabled={!reason.trim()}
          >
            ยื่นอุทธรณ์ข้อความ
          </button>
        </form>
      )}
      {state.reports
        .filter(
          (report) =>
            report.actorId === state.preferences.consumerId &&
            report.postId &&
            report.status === "reviewed",
        )
        .map((report) => (
          <p className="review-note" key={report.id}>
            ผลทบทวน: {report.outcome}
          </p>
        ))}
    </section>
  );
}

function Discussion({
  cluster,
  state,
  commit,
  notify,
  onBack,
}: {
  cluster: Cluster;
  state: PlatformState;
  commit: Commit;
  notify: (text: string) => void;
  onBack: () => void;
}) {
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [report, setReport] = useState("");
  const [reportTarget, setReportTarget] = useState("");
  const [reportKind, setReportKind] = useState<
    "report" | "correction" | "appeal"
  >("report");
  const consumerId = state.preferences.consumerId;
  const actorId =
    state.preferences.role === "business"
      ? state.preferences.businessId
      : consumerId;
  const risk = assessRisk(text);
  const claims = groupClaims(state, cluster.id);
  const posts = state.posts.filter(
    (p) =>
      p.clusterId === cluster.id &&
      (p.review === "approved" || p.authorId === actorId),
  );
  const replies = state.replies.filter(
    (r) =>
      r.public &&
      r.risk.level === "low" &&
      claims.some((c) => c.id === r.claimId),
  );
  return (
    <section className="surface discussion-detail">
      <button className="inline-link" onClick={onBack}>
        กลับไปประเด็นทั้งหมด
      </button>
      <h2>
        {safeLabel(cluster.brand)} · {safeLabel(cluster.product)}
      </h2>
      <p className="supporting">
        {categoryLabels[cluster.category]} · {claims.length}{" "}
        ข้อร้องเรียนที่เกี่ยวข้อง · ข้อมูลสังเคราะห์สำหรับทดสอบ
      </p>
      <div className="tag-row">
        {cluster.tags.map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>
      <Notice>
        แสดงหัวข้อกลาง ไม่เปิดเผยข้อความร้องเรียนดิบหรือหลักฐานส่วนตัว
        ผู้ดูแลพิจารณาการเผยแพร่เนื้อหา ไม่ตัดสินว่าฝ่ายใดถูก
      </Notice>
      <div className="discussion-outcomes">
        {[...new Set(claims.map((c) => c.status))].map((status) => (
          <Badge
            key={status}
            tone={status === "Disputed" ? "warning" : "brand"}
          >
            {statusLabels[status]}
          </Badge>
        ))}
      </div>
      <h3>คำตอบจากธุรกิจ</h3>
      {!replies.length && (
        <p className="supporting">ยังไม่มีคำตอบสาธารณะจากธุรกิจ</p>
      )}
      {replies.map((reply) => (
        <div className="business-reply" key={reply.id}>
          <strong>
            {state.businesses.find((b) => b.id === reply.businessId)?.name}
          </strong>
          <Badge tone="brand">Business Responded</Badge>
          <p className="preserve-text">{reply.text}</p>
          <small>{dateLabel(reply.createdAt)}</small>
        </div>
      ))}
      <h3>แลกเปลี่ยนประสบการณ์</h3>
      {!posts.length && (
        <p className="supporting">
          เริ่มแบ่งปันสิ่งที่พบจริง โดยไม่ระบุข้อมูลส่วนตัวของผู้อื่น
        </p>
      )}
      {posts.map((post) => (
        <article key={post.id} className="discussion-post">
          <div className="section-line">
            <strong>
              {state.consumers.find((c) => c.id === post.authorId)?.name ??
                "ผู้ใช้จำลอง"}
            </strong>
            <small>{dateLabel(post.createdAt)}</small>
          </div>
          <p className="preserve-text">{post.text}</p>
          {post.review !== "approved" && (
            <Badge tone="warning">
              {reviewLabels[post.review]} · เห็นเฉพาะผู้เขียนและผู้ดูแล
            </Badge>
          )}
          <button
            className="inline-link"
            onClick={() => {
              setReportTarget(post.id);
              document.getElementById("report-reason")?.focus();
            }}
          >
            รายงานข้อความนี้
          </button>
          {post.authorId === actorId && post.review !== "approved" && (
            <button
              className="inline-link"
              onClick={() => {
                setEditingId(post.id);
                setText(post.text);
                document.getElementById("community-composer")?.focus();
              }}
            >
              แก้ไขข้อความของฉัน
            </button>
          )}
        </article>
      ))}
      {state.preferences.role === "consumer" && (
        <form
          className="discussion-composer"
          onSubmit={(e) => {
            e.preventDefault();
            if (!text.trim()) return;
            if (
              commit((s) => ({
                ...s,
                posts: editingId
                  ? s.posts.map((p) =>
                      p.id === editingId && p.authorId === consumerId
                        ? {
                            ...p,
                            text: text.trim(),
                            risk,
                            review:
                              risk.level === "low" ? "approved" : "pending",
                          }
                        : p,
                    )
                  : [
                      ...s.posts,
                      {
                        id: id("post"),
                        clusterId: cluster.id,
                        authorId: consumerId,
                        text: text.trim(),
                        risk,
                        review: risk.level === "low" ? "approved" : "pending",
                        createdAt: new Date().toISOString(),
                      },
                    ],
                history: [
                  historyEntry(
                    cluster.id,
                    consumerId,
                    risk.level === "low"
                      ? "เพิ่มข้อความประสบการณ์ที่ผ่านกฎจำลอง"
                      : "ส่งข้อความให้ผู้ดูแลตรวจ โดยยังไม่เผยแพร่",
                  ),
                  ...s.history,
                ],
              }))
            ) {
              setText("");
              setEditingId(null);
              notify(
                risk.level === "low"
                  ? "บันทึกประสบการณ์แล้ว"
                  : "เก็บข้อความส่วนตัว รอผู้ดูแลพิจารณา",
              );
            }
          }}
        >
          <label className="field">
            ประสบการณ์ของคุณ
            <textarea
              id="community-composer"
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={2000}
              rows={4}
              placeholder="เล่าเหตุการณ์ที่พบและขั้นตอนที่ได้ลอง ไม่กล่าวหาหรือคุกคาม"
            />
          </label>
          {text && (
            <>
              <RiskBadge level={risk.level} />
              {risk.suggestion !== text && (
                <div className="neutral-suggestion">
                  <p>{risk.suggestion}</p>
                  <button
                    type="button"
                    className="inline-link"
                    onClick={() => setText(risk.suggestion)}
                  >
                    ใช้ร่างข้อความกลางแล้วตรวจแก้
                  </button>
                </div>
              )}
            </>
          )}
          <button className="button button--primary" disabled={!text.trim()}>
            {editingId ? "บันทึกข้อความที่แก้ไข" : "แบ่งปันประสบการณ์"}
          </button>
          {editingId && (
            <button
              type="button"
              className="inline-link"
              onClick={() => {
                setEditingId(null);
                setText("");
              }}
            >
              ยกเลิกการแก้ไข
            </button>
          )}
        </form>
      )}
      <details className="report-panel" open={!!reportTarget}>
        <summary>รายงาน / ขอแก้ไขประเด็นนี้</summary>
        <p className="supporting">
          คำขอไม่ซ่อนเนื้อหาโดยอัตโนมัติ
          ธุรกิจและผู้บริโภคมีสิทธิขอทบทวนเท่าเทียมกัน
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!report.trim()) return;
            if (
              commit((s) => ({
                ...s,
                reports: [
                  ...s.reports,
                  {
                    id: id("report"),
                    clusterId: cluster.id,
                    postId: reportTarget || undefined,
                    actorId,
                    kind: reportKind,
                    reason: report.trim(),
                    status: "pending",
                    outcome: "",
                    createdAt: new Date().toISOString(),
                  },
                ],
                history: [
                  historyEntry(
                    cluster.id,
                    actorId,
                    "มีคำขอรายงาน / แก้ไข รอผู้ดูแลตรวจสอบ",
                  ),
                  ...s.history,
                ],
              }))
            ) {
              setReport("");
              setReportTarget("");
              notify("บันทึกคำขอแล้ว รอผู้ดูแลพิจารณา");
            }
          }}
        >
          <label className="field">
            ประเภทคำขอ
            <select
              value={reportKind}
              onChange={(e) =>
                setReportKind(e.target.value as typeof reportKind)
              }
            >
              <option value="report">รายงานเนื้อหา</option>
              <option value="correction">ขอแก้ไข / นำออก พร้อมเหตุผล</option>
              <option value="appeal">อุทธรณ์การพิจารณา</option>
            </select>
          </label>
          <label className="field">
            เหตุผล
            <textarea
              id="report-reason"
              value={report}
              onChange={(e) => setReport(e.target.value)}
              maxLength={1500}
              rows={3}
            />
          </label>
          <button
            className="button button--secondary"
            disabled={!report.trim()}
          >
            ส่งให้ผู้ดูแล
          </button>
          {reportTarget && (
            <button
              type="button"
              className="inline-link"
              onClick={() => setReportTarget("")}
            >
              เปลี่ยนเป็นรายงานทั้งประเด็น
            </button>
          )}
        </form>
      </details>
      <h3>ประวัติสถานะสาธารณะ</h3>
      <ol className="history-list">
        {state.history
          .filter((h) => h.targetId === cluster.id && h.actor === "ระบบจำลอง")
          .map((h) => (
            <li key={h.id}>
              <strong>{h.message}</strong>
              <span>{dateLabel(h.createdAt)}</span>
            </li>
          ))}
        <li>
          <strong>{reviewLabels[cluster.review]}</strong>
          <span>
            ประวัติคำตัดสินพร้อมเหตุผลแสดงในพื้นที่ข้อร้องเรียนส่วนตัวและผู้ดูแล
          </span>
        </li>
      </ol>
    </section>
  );
}
