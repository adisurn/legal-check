import { useState } from "react";
import type { Commit } from "../../hooks/use-platform";
import {
  assessRisk,
  categoryLabels,
  dateLabel,
  duplicateFingerprints,
  groupClaims,
  historyEntry,
  publication,
  reviewCluster,
  reviewLabels,
  validateSettings,
} from "../../lib/platform";
import type {
  Cluster,
  PlatformState,
  ReviewStatus,
} from "../../types/platform";
import { Icon } from "../icon";
import { Badge, Empty, Notice, RiskBadge } from "./shared";

export function ModerationWorkspace({
  state,
  commit,
  onSelect,
  notify,
}: {
  state: PlatformState;
  commit: Commit;
  onSelect: (id: string) => void;
  notify: (text: string) => void;
}) {
  const [filter, setFilter] = useState("all");
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const clusters = state.clusters.filter(
    (c) => filter === "all" || c.review === filter,
  );
  const pendingReports = state.reports.filter((r) => r.status === "pending");
  const repeated = state.consumers
    .map((consumer) => ({
      ...consumer,
      high: state.claims.filter(
        (c) => c.consumerId === consumer.id && c.risk.level === "high",
      ).length,
      duplicated: state.claims.filter(
        (c) =>
          c.consumerId === consumer.id &&
          duplicateFingerprints(state, c.evidence, c.id).length > 0,
      ).length,
    }))
    .filter((c) => c.high > 1 || c.duplicated > 0);
  const decide = (cluster: Cluster, review: ReviewStatus) => {
    const note = notes[cluster.id]?.trim();
    if (!note) {
      setError(
        "ระบุเหตุผลของคำตัดสินก่อนบันทึก เพื่อให้ทุกฝ่ายตรวจสอบและอุทธรณ์ได้",
      );
      return;
    }
    if (commit((s) => reviewCluster(s, cluster.id, review, note))) {
      setError("");
      notify("บันทึกคำตัดสินและประวัติแล้ว เกณฑ์เผยแพร่ยังคงมีผล");
    }
  };
  return (
    <>
      <div className="page-title">
        <div>
          <h1>ตรวจสอบอย่างเป็นกลาง</h1>
          <p>
            Moderator demo · ตรวจบริบทและสิทธิของทั้งสองฝ่าย ไม่ตัดสินความผิด
          </p>
        </div>
        <Badge tone="warning">{pendingReports.length} คำขอรอตรวจ</Badge>
      </div>
      <Notice warning>
        โหมดผู้ดูแลเปิดให้สลับได้เพื่อทดสอบเท่านั้น
        ไม่มีระบบสิทธิหรือการยืนยันตัวตนจริง
        ห้ามใช้ต้นแบบนี้จัดเก็บข้อมูลร้องเรียนจริงที่อ่อนไหว
      </Notice>
      {repeated.length > 0 && (
        <section className="surface">
          <h2>รูปแบบที่ควรตรวจเพิ่ม</h2>
          {repeated.map((consumer) => (
            <p key={consumer.id} className="supporting">
              {consumer.name} · ข้อความเสี่ยงสูง {consumer.high} เรื่อง ·
              เรื่องที่มีไฟล์ซ้ำ {consumer.duplicated} เรื่อง
            </p>
          ))}
          <p>
            เป็นเพียงสัญญาณให้ตรวจบริบท ไม่มีการระงับบัญชีหรือลงโทษอัตโนมัติ
          </p>
        </section>
      )}
      {pendingReports.length > 0 && (
        <section className="surface">
          <h2>รายงาน คำขอแก้ไข และอุทธรณ์</h2>
          {pendingReports.map((report) => (
            <div key={report.id} className="moderation-report">
              <div className="section-line">
                <Badge tone="warning">
                  {report.kind === "appeal"
                    ? "อุทธรณ์"
                    : report.kind === "correction"
                      ? "ขอแก้ไข / นำออก"
                      : "รายงาน"}
                </Badge>
                <small>{dateLabel(report.createdAt)}</small>
              </div>
              <p>{report.reason}</p>
              <p className="supporting">
                ประเด็น:{" "}
                {state.clusters.find((c) => c.id === report.clusterId)
                  ?.product || "ยังไม่ระบุสินค้า"}
                {report.postId ? " · รายงานข้อความเฉพาะ" : ""}
              </p>
              <label className="field">
                ผลการทบทวน / เหตุผล
                <textarea
                  rows={2}
                  maxLength={1500}
                  value={notes[report.id] ?? ""}
                  onChange={(e) =>
                    setNotes({ ...notes, [report.id]: e.target.value })
                  }
                />
              </label>
              <button
                className="button button--secondary"
                disabled={!notes[report.id]?.trim()}
                onClick={() => {
                  if (
                    commit((s) => ({
                      ...s,
                      reports: s.reports.map((r) =>
                        r.id === report.id
                          ? {
                              ...r,
                              status: "reviewed",
                              outcome: notes[report.id].trim(),
                            }
                          : r,
                      ),
                      history: [
                        historyEntry(
                          report.clusterId,
                          "ผู้ดูแลจำลอง",
                          `ทบทวนคำขอ: ${notes[report.id].trim()}`,
                        ),
                        ...s.history,
                      ],
                    }))
                  )
                    notify(
                      "บันทึกผลทบทวนแล้ว เปลี่ยนการเผยแพร่แยกในกลุ่มด้านล่าง",
                    );
                }}
              >
                บันทึกผลทบทวน
              </button>
            </div>
          ))}
        </section>
      )}
      <section className="surface">
        <div className="section-line">
          <h2>กลุ่มข้อร้องเรียนทั้งหมด</h2>
          <label className="status-filter">
            สถานะ
            <select
              aria-label="กรองคิวผู้ดูแล"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">ทั้งหมด</option>
              {Object.entries(reviewLabels).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
          </label>
        </div>
        {error && (
          <p role="alert" className="form-error">
            {error}
          </p>
        )}
        {!clusters.length && <Empty title="ไม่มีรายการในคิวนี้" />}
        {clusters.map((cluster) => {
          const claims = groupClaims(state, cluster.id);
          const eligibility = publication(state, cluster);
          return (
            <article key={cluster.id} className="moderation-group">
              <div className="section-line">
                <div>
                  <h3>
                    {cluster.brand || "ไม่ระบุแบรนด์"} ·{" "}
                    {cluster.product || "ไม่ระบุสินค้า"}
                  </h3>
                  <p className="supporting">
                    {categoryLabels[cluster.category]} · {claims.length} เรื่อง
                  </p>
                </div>
                <Badge tone={eligibility.visible ? "success" : "warning"}>
                  {eligibility.visible ? "เผยแพร่แล้ว" : "ยังไม่เผยแพร่"}
                </Badge>
              </div>
              <div className="threshold-checks">
                <span>
                  {eligibility.distinct}/{state.settings.minConsumers}{" "}
                  บัญชีที่แตกต่าง
                </span>
                <span>
                  {eligibility.verified}/{state.settings.minVerified}{" "}
                  ยืนยันการติดต่อ
                </span>
                <span>
                  {eligibility.evidenced}/{state.settings.minEvidence}{" "}
                  บัญชีมีหลักฐานผ่านตรวจ
                </span>
              </div>
              <p className="supporting">
                {eligibility.reasons.join(" · ") ||
                  "ผ่านเกณฑ์ปัจจุบัน · ไม่ใช่ข้อพิสูจน์ความจริง"}
              </p>
              <div className="moderation-claims">
                {claims.map((claim) => (
                  <button
                    key={claim.id}
                    className="moderation-claim"
                    onClick={() => onSelect(claim.id)}
                  >
                    <span>
                      <strong>
                        {
                          state.consumers.find((u) => u.id === claim.consumerId)
                            ?.name
                        }
                      </strong>
                      <small>
                        {claim.description || "ไม่มีรายละเอียด"} · หลักฐาน{" "}
                        {claim.evidence.length} ไฟล์
                      </small>
                    </span>
                    <RiskBadge level={claim.risk.level} />
                    <Icon name="chevron" size={16} />
                  </button>
                ))}
              </div>
              <label className="field">
                เหตุผลการพิจารณา {cluster.product}
                <textarea
                  rows={2}
                  maxLength={1500}
                  value={notes[cluster.id] ?? ""}
                  placeholder="บันทึกบริบท สิ่งที่ตรวจ และเหตุผล ไม่ยืนยันว่าข้อกล่าวหาเป็นจริง"
                  onChange={(e) =>
                    setNotes({ ...notes, [cluster.id]: e.target.value })
                  }
                />
              </label>
              <div className="moderation-actions">
                <button
                  className="button button--primary"
                  onClick={() => decide(cluster, "approved")}
                >
                  อนุมัติหลังตรวจเนื้อหา
                </button>
                <button
                  className="button button--secondary"
                  onClick={() => decide(cluster, "edits")}
                >
                  ขอข้อมูล / แก้ไข
                </button>
                <button
                  className="button button--secondary"
                  onClick={() => decide(cluster, "hidden")}
                >
                  ซ่อนสาธารณะ
                </button>
                <button
                  className="button button--danger"
                  onClick={() => decide(cluster, "rejected")}
                >
                  ไม่อนุมัติเผยแพร่
                </button>
              </div>
              <p className="small-text">
                อนุมัติแล้วยังต้องผ่านเกณฑ์จำนวนบัญชีและหลักฐาน
                การซ่อน/ไม่อนุมัติไม่ลบข้อร้องเรียนส่วนตัว
              </p>
              {cluster.reviewNote && (
                <p className="review-note">
                  คำตัดสินล่าสุด: {reviewLabels[cluster.review]} ·{" "}
                  {cluster.reviewNote}
                </p>
              )}
              <PostReviews
                clusterId={cluster.id}
                state={state}
                commit={commit}
                notify={notify}
              />
              <details className="moderation-history">
                <summary>ประวัติการเปลี่ยนสถานะและการทบทวน</summary>
                <ol className="history-list">
                  {state.history
                    .filter((h) => h.targetId === cluster.id)
                    .map((h) => (
                      <li key={h.id}>
                        <strong>{h.message}</strong>
                        <span>
                          {h.actor} · {dateLabel(h.createdAt)}
                        </span>
                      </li>
                    ))}
                </ol>
              </details>
            </article>
          );
        })}
      </section>
    </>
  );
}

function PostReviews({
  clusterId,
  state,
  commit,
  notify,
}: {
  clusterId: string;
  state: PlatformState;
  commit: Commit;
  notify: (text: string) => void;
}) {
  const [edited, setEdited] = useState<Record<string, string>>({});
  const posts = state.posts.filter((p) => p.clusterId === clusterId);
  return (
    <div className="post-reviews">
      {posts.map((post) => {
        const text = edited[post.id] ?? post.text;
        const risk = assessRisk(text);
        const decide = (review: ReviewStatus) => {
          if (review === "approved" && risk.level !== "low") return;
          if (
            commit((s) => ({
              ...s,
              posts: s.posts.map((p) =>
                p.id === post.id ? { ...p, text, risk, review } : p,
              ),
              history: [
                historyEntry(
                  clusterId,
                  "ผู้ดูแลจำลอง",
                  `ข้อความสนทนา: ${reviewLabels[review]}${text !== post.text ? " · ปรับถ้อยคำกลางโดยไม่เพิ่มข้อเท็จจริง" : ""}`,
                ),
                ...s.history,
              ],
            }))
          )
            notify("บันทึกสถานะข้อความแล้ว");
        };
        return (
          <div className="moderation-post" key={post.id}>
            <div className="section-line">
              <strong>ข้อความสนทนา · {reviewLabels[post.review]}</strong>
              <RiskBadge level={post.risk.level} />
            </div>
            <label className="field">
              ข้อความสำหรับพิจารณา
              <textarea
                rows={3}
                value={text}
                maxLength={2000}
                onChange={(e) =>
                  setEdited({ ...edited, [post.id]: e.target.value })
                }
              />
            </label>
            {risk.level !== "low" && (
              <button
                className="inline-link"
                onClick={() =>
                  setEdited({ ...edited, [post.id]: risk.suggestion })
                }
              >
                เสนอถ้อยคำกลาง (ตรวจความหมายก่อนอนุมัติ)
              </button>
            )}
            <div className="moderation-actions">
              <button
                className="button button--secondary"
                disabled={risk.level !== "low" || !text.trim()}
                onClick={() => decide("approved")}
              >
                อนุมัติข้อความกลาง
              </button>
              <button
                className="button button--secondary"
                onClick={() => decide("edits")}
              >
                ขอแก้ข้อความ
              </button>
              <button
                className="button button--danger"
                onClick={() => decide("hidden")}
              >
                ซ่อนข้อความ
              </button>
              <button
                className="button button--danger"
                onClick={() => decide("rejected")}
              >
                ไม่อนุมัติข้อความ
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function SafetySettings({
  state,
  commit,
  notify,
}: {
  state: PlatformState;
  commit: Commit;
  notify: (text: string) => void;
}) {
  return (
    <>
      <div className="page-title">
        <div>
          <h1>เกณฑ์เผยแพร่และบัญชีจำลอง</h1>
          <p>เปลี่ยนเกณฑ์เพื่อทดสอบผลทันที ข้อร้องเรียนส่วนตัวยังคงอยู่</p>
        </div>
        <Badge tone="warning">Moderator demo</Badge>
      </div>
      <section className="surface">
        <h2>เกณฑ์ก่อนปรากฏสาธารณะ</h2>
        <p className="supporting">
          ทุกกลุ่มต้องได้รับอนุมัติจากผู้ดูแลเพิ่มเติม
          และข้อความเสี่ยงใหม่ต้องได้รับการตรวจ
          ไม่มีการใช้จำนวนข้อร้องเรียนเป็นข้อพิสูจน์ความจริง
        </p>
        <div className="settings-grid">
          {(
            [
              ["minConsumers", "จำนวนผู้ร้องเรียนต่างบัญชีขั้นต่ำ", 2],
              ["minVerified", "บัญชียืนยันการติดต่อขั้นต่ำ", 0],
              ["minEvidence", "บัญชีที่มีหลักฐานผ่านตรวจขั้นต่ำ", 0],
            ] as const
          ).map(([key, label, min]) => (
            <label className="field" key={key}>
              {label}
              <input
                type="number"
                min={min}
                max={10}
                value={state.settings[key]}
                onChange={(e) =>
                  commit((s) => ({
                    ...s,
                    settings: validateSettings({
                      ...s.settings,
                      [key]: Number(e.target.value),
                    }),
                    history: [
                      historyEntry(
                        "settings",
                        "ผู้ดูแลจำลอง",
                        `ปรับเกณฑ์ ${label}`,
                      ),
                      ...s.history,
                    ],
                  }))
                }
              />
            </label>
          ))}
        </div>
        <Notice>
          ต้องมีอย่างน้อย 2 บัญชีจำลองเสมอ เกณฑ์หลักฐานและการยืนยันปรับเป็น 0
          ได้เพื่อสาธิต แต่การไม่มีหลักฐานไม่ทำให้คำร้องส่วนตัวถูกปฏิเสธ
        </Notice>
      </section>
      <section className="surface">
        <h2>สถานะยืนยันสำหรับสาธิต</h2>
        <p className="supporting">
          ไม่มีการตรวจตัวตน ติดต่อ หรือทะเบียนธุรกิจจริง
          ทุกเครื่องหมายต้องตีความว่าเป็นสถานะจำลอง
        </p>
        {state.consumers.map((user) => (
          <label className="profile-toggle" key={user.id}>
            <span>
              <strong>{user.name}</strong>
              <small>Account Verified · ช่องทางติดต่อจำลอง</small>
            </span>
            <input
              type="checkbox"
              checked={user.verified}
              onChange={(e) =>
                commit((s) => ({
                  ...s,
                  consumers: s.consumers.map((u) =>
                    u.id === user.id ? { ...u, verified: e.target.checked } : u,
                  ),
                }))
              }
            />
          </label>
        ))}
        {state.businesses.map((business) => (
          <label className="profile-toggle" key={business.id}>
            <input
              type="checkbox"
              checked={business.verified}
              onChange={(e) => {
                if (
                  commit((s) => ({
                    ...s,
                    businesses: s.businesses.map((b) =>
                      b.id === business.id
                        ? { ...b, verified: e.target.checked }
                        : b,
                    ),
                  }))
                )
                  notify("ปรับสถานะธุรกิจจำลองแล้ว");
              }}
            />
          </label>
        ))}
      </section>
      <section className="surface">
        <h2>คำขอที่ทบทวนแล้ว</h2>
        {!state.reports.some((r) => r.status === "reviewed") && (
          <p className="supporting">ยังไม่มีคำขอที่ทบทวนแล้ว</p>
        )}
        {state.reports
          .filter((r) => r.status === "reviewed")
          .map((r) => (
            <div className="review-note" key={r.id}>
              <strong>{r.reason}</strong>
              <p>{r.outcome}</p>
            </div>
          ))}
      </section>
    </>
  );
}
