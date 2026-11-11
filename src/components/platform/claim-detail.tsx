import { useState } from "react";
import type { Commit } from "../../hooks/use-platform";
import {
  assessRisk,
  categoryLabels,
  dateLabel,
  evidenceLabels,
  historyEntry,
  id,
  publicEvidence,
  publication,
  reviewLabels,
  riskForClaim,
  statuses,
  statusLabels,
  updateClaim,
} from "../../lib/platform";
import { fileAccept, readEvidenceFiles } from "../../lib/evidence";
import type {
  Claim,
  ClaimStatus,
  Evidence,
  PlatformState,
} from "../../types/platform";
import { Badge, Notice, RiskBadge } from "./shared";

export function EvidenceList({
  claim,
  state,
  commit,
  moderator = false,
  business = false,
}: {
  claim: Claim;
  state: PlatformState;
  commit: Commit;
  moderator?: boolean;
  business?: boolean;
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const items = business
    ? claim.evidence.filter(publicEvidence)
    : claim.evidence;
  const change = (evidence: Evidence, patch: Partial<Evidence>) =>
    commit((s) => {
      const current = s.claims.find((c) => c.id === claim.id)!;
      return updateClaim(
        s,
        {
          ...current,
          evidence: current.evidence.map((e) =>
            e.id === evidence.id ? { ...e, ...patch } : e,
          ),
        },
        moderator ? "ผู้ดูแลจำลอง" : claim.consumerId,
        `ปรับข้อมูลหลักฐาน: ${evidence.name}`,
      );
    });
  return (
    <div className="evidence-list">
      {!business && !moderator && (
        <label className="field">
          เพิ่มหลักฐานประกอบ
          <input
            type="file"
            accept={fileAccept}
            multiple
            disabled={uploading}
            aria-label="เพิ่มหลักฐานประกอบ"
            onChange={async (event) => {
              const files = Array.from(event.target.files ?? []);
              event.target.value = "";
              if (!files.length) return;
              setUploading(true);
              setUploadError("");
              try {
                const evidence = await readEvidenceFiles(
                  files,
                  claim.evidence.length,
                );
                commit((s) => {
                  const current = s.claims.find((c) => c.id === claim.id)!;
                  const updated = [...current.evidence, ...evidence];
                  const risk = riskForClaim(
                    s,
                    { ...current, evidence: updated },
                    current.id,
                  );
                  return updateClaim(
                    s,
                    {
                      ...current,
                      evidence: updated,
                      risk,
                      contentReviewed: false,
                    },
                    claim.consumerId,
                    "เพิ่มหลักฐานเพื่อให้ธุรกิจหรือผู้ดูแลตรวจ",
                  );
                });
              } catch (error) {
                setUploadError(
                  error instanceof Error
                    ? error.message
                    : "อ่านไฟล์ไม่ได้ ลองอีกครั้ง",
                );
              } finally {
                setUploading(false);
              }
            }}
          />
          <small>
            {uploading
              ? "กำลังอ่านไฟล์…"
              : "รวมไม่เกิน 3 ไฟล์ ไฟล์ละ 350 KB · ไม่ส่งให้ธุรกิจจนกว่าคุณจะอนุญาต"}
          </small>
        </label>
      )}
      {uploadError && (
        <p role="alert" className="form-error">
          {uploadError}
        </p>
      )}
      {!items.length && (
        <p className="supporting">
          {business
            ? "ไม่มีไฟล์ที่ได้รับอนุญาตให้ธุรกิจดู การไม่มีหลักฐานไม่ทำให้เรื่องถูกปฏิเสธโดยอัตโนมัติ"
            : "ยังไม่ได้แนบไฟล์ ไม่จำเป็นต้องมีใบเสร็จทุกกรณี"}
        </p>
      )}
      {items.map((evidence) => {
        const duplicate = state.claims.some(
          (other) =>
            other.id !== claim.id &&
            other.evidence.some((e) => e.fingerprint === evidence.fingerprint),
        );
        return (
          <div key={evidence.id} className="evidence-item">
            <div className="section-line">
              <strong>{evidence.name}</strong>
              <Badge
                tone={
                  evidence.reviewed && evidence.relevant && evidence.consistent
                    ? "success"
                    : "neutral"
                }
              >
                {evidence.reviewed ? "ตรวจบริบทแล้ว" : "ยังไม่ตรวจ"}
              </Badge>
            </div>
            <p className="supporting">
              {evidenceLabels[evidence.kind]}
              {duplicate && " · พบไฟล์ซ้ำในต้นแบบ (ไม่ยืนยันว่าปลอม)"}
            </p>
            <a
              className="inline-link"
              href={evidence.data}
              download={evidence.name}
            >
              ดาวน์โหลดไฟล์หลักฐาน
            </a>
            {evidence.mime.startsWith("image/") && (
              <img
                className="evidence-preview"
                src={evidence.data}
                alt={`หลักฐานส่วนตัว: ${evidence.name}`}
              />
            )}
            {!moderator && !business && (
              <>
                <label className="field">
                  ประเภทหลักฐาน
                  <select
                    value={evidence.kind}
                    onChange={(e) =>
                      change(evidence, {
                        kind: e.target.value as Evidence["kind"],
                      })
                    }
                  >
                    {Object.entries(evidenceLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="checkbox-line">
                  <input
                    type="checkbox"
                    checked={evidence.sensitive}
                    onChange={(e) =>
                      change(evidence, {
                        sensitive: e.target.checked,
                        shareWithBusiness: e.target.checked
                          ? false
                          : evidence.shareWithBusiness,
                      })
                    }
                  />
                  มีข้อมูลอ่อนไหวที่ยังไม่ได้ปิดบัง
                </label>
                <label className="checkbox-line">
                  <input
                    type="checkbox"
                    disabled={evidence.sensitive}
                    checked={evidence.shareWithBusiness}
                    onChange={(e) =>
                      change(evidence, { shareWithBusiness: e.target.checked })
                    }
                  />
                  อนุญาตให้ธุรกิจดูไฟล์นี้
                </label>
                <button
                  className="inline-link danger-text"
                  onClick={() =>
                    commit((s) => {
                      const current = s.claims.find((c) => c.id === claim.id)!;
                      const next = {
                        ...current,
                        evidence: current.evidence.filter(
                          (e) => e.id !== evidence.id,
                        ),
                        contentReviewed: false,
                      };
                      return updateClaim(
                        s,
                        { ...next, risk: riskForClaim(s, next, current.id) },
                        claim.consumerId,
                        "นำไฟล์หลักฐานออก",
                      );
                    })
                  }
                >
                  นำไฟล์ออก
                </button>
              </>
            )}
            {moderator && (
              <div className="review-controls">
                <label className="checkbox-line">
                  <input
                    type="checkbox"
                    checked={evidence.relevant === true}
                    onChange={(e) =>
                      change(evidence, {
                        relevant: e.target.checked,
                        reviewed: true,
                      })
                    }
                  />
                  เกี่ยวข้องกับข้อร้องเรียน
                </label>
                <label className="checkbox-line">
                  <input
                    type="checkbox"
                    checked={evidence.consistent === true}
                    onChange={(e) =>
                      change(evidence, {
                        consistent: e.target.checked,
                        reviewed: true,
                      })
                    }
                  />
                  สอดคล้องกับรายละเอียดที่ให้มา
                </label>
                <label className="checkbox-line">
                  <input
                    type="checkbox"
                    checked={evidence.sensitive}
                    onChange={(e) =>
                      change(evidence, {
                        sensitive: e.target.checked,
                        reviewed: true,
                      })
                    }
                  />
                  มีข้อมูลส่วนตัว ต้องเปลี่ยนเป็นไฟล์ที่ปิดบังแล้ว
                </label>
                <small>
                  ผู้ดูแลจำลองตรวจด้วยตนเอง
                  ไม่ใช่การรับรองความแท้หรือข้อเท็จจริง
                  การทำเครื่องหมายไม่ได้แก้ไขภาพต้นฉบับ
                </small>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function ClaimDetail({
  claim,
  state,
  commit,
  notify,
}: {
  claim: Claim;
  state: PlatformState;
  commit: Commit;
  notify: (text: string) => void;
}) {
  const role = state.preferences.role;
  const isBusiness = role === "business";
  const isModerator = role === "moderator";
  const [reply, setReply] = useState("");
  const [status, setStatus] = useState<ClaimStatus>(claim.status);
  const [publicReply, setPublicReply] = useState(false);
  const [followup, setFollowup] = useState("");
  const [appeal, setAppeal] = useState("");
  const cluster = state.clusters.find((c) => c.id === claim.clusterId)!;
  const eligibility = publication(state, cluster);
  const user = state.consumers.find((c) => c.id === claim.consumerId)!;
  const replies = state.replies.filter((r) => r.claimId === claim.id);
  const replyRisk = assessRisk(reply);
  const saveResponse = () => {
    if (!reply.trim()) return;
    if (
      commit((s) => {
        const current = s.claims.find((c) => c.id === claim.id)!;
        const changed = updateClaim(
          s,
          { ...current, status: status === "New" ? "Responded" : status },
          s.preferences.businessId,
          `ธุรกิจบันทึกคำตอบ · ${statusLabels[status === "New" ? "Responded" : status]}`,
        );
        return {
          ...changed,
          replies: [
            ...changed.replies,
            {
              id: id("reply"),
              claimId: claim.id,
              businessId: s.preferences.businessId,
              text: reply.trim(),
              public: publicReply && replyRisk.level === "low",
              risk: replyRisk,
              createdAt: new Date().toISOString(),
            },
          ],
        };
      })
    ) {
      setReply("");
      notify("บันทึกคำตอบแล้ว ผู้บริโภคติดตามได้ในข้อร้องเรียนของตน");
    }
  };
  return (
    <div className="claim-detail">
      <div className="tag-row">
        <Badge tone="brand">{statusLabels[claim.status]}</Badge>
        <RiskBadge level={claim.risk.level} />
        {user.verified && (
          <Badge tone="success">Account Verified · จำลอง</Badge>
        )}
        {claim.evidence.some((e) => e.kind === "receipt") && (
          <Badge>Purchase Evidence Provided</Badge>
        )}
        {claim.evidence.some(
          (e) =>
            e.kind === "receipt" && e.reviewed && e.relevant && e.consistent,
        ) && (
          <Badge tone="success">Transaction Evidence Reviewed · จำลอง</Badge>
        )}
      </div>
      <dl className="summary-grid">
        <dt>แบรนด์ / สินค้า</dt>
        <dd>
          {claim.brand || "ยังไม่ระบุ"} · {claim.product || "ยังไม่ระบุ"}
        </dd>
        <dt>ประเภท</dt>
        <dd>{categoryLabels[claim.category]}</dd>
        <dt>ผู้ร้องเรียน</dt>
        <dd>{user.name}</dd>
        <dt>สิ่งที่อยากให้ช่วย</dt>
        <dd>{claim.requestedOutcome || "ยังไม่ระบุ"}</dd>
      </dl>
      <h3>รายละเอียดส่วนตัวที่ส่งให้ธุรกิจ</h3>
      <p className="preserve-text detail-description">
        {claim.description || "ยังไม่ได้เพิ่มรายละเอียด"}
      </p>
      <Notice warning={!eligibility.visible}>
        {eligibility.visible
          ? "กลุ่มนี้เผยแพร่เฉพาะหัวข้อกลางและข้อความที่ผ่านเกณฑ์ ข้อร้องเรียนดิบและไฟล์แนบไม่ปรากฏสาธารณะ"
          : `เก็บเป็นข้อร้องเรียนส่วนตัว · กลุ่มยังไม่เผยแพร่: ${eligibility.reasons.join(" · ")}`}
      </Notice>
      {cluster.reviewNote && (
        <p className="supporting">บันทึกผู้ดูแล: {cluster.reviewNote}</p>
      )}
      <h3>หลักฐานและการอนุญาต</h3>
      <EvidenceList
        claim={claim}
        state={state}
        commit={commit}
        business={isBusiness}
        moderator={isModerator}
      />
      {!isBusiness && !isModerator && (
        <>
          <h3>เช็กลิสต์ของฉัน</h3>
          {[
            "บันทึกลำดับเหตุการณ์",
            "เก็บรายละเอียดสินค้า",
            "ติดต่อธุรกิจเป็นลายลักษณ์อักษร",
            "ติดตามคำตอบและกำหนดนัดหมาย",
          ].map((label) => (
            <label key={label} className="checkbox-line">
              <input
                type="checkbox"
                checked={claim.ready.includes(label)}
                onChange={() =>
                  commit((s) =>
                    updateClaim(
                      s,
                      {
                        ...claim,
                        ready: claim.ready.includes(label)
                          ? claim.ready.filter((v) => v !== label)
                          : [...claim.ready, label],
                      },
                      claim.consumerId,
                      `อัปเดตเช็กลิสต์: ${label}`,
                    ),
                  )
                }
              />
              {label}
            </label>
          ))}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!followup.trim()) return;
              if (
                commit((s) => {
                  const current = s.claims.find((c) => c.id === claim.id)!;
                  const description = `${current.description}\n\nข้อมูลเพิ่มเติม: ${followup.trim()}`;
                  const risk = riskForClaim(
                    s,
                    { ...current, description },
                    current.id,
                  );
                  return updateClaim(
                    s,
                    {
                      ...current,
                      description,
                      risk,
                      contentReviewed: false,
                      status:
                        current.status === "Awaiting Information"
                          ? "Under Review"
                          : current.status,
                    },
                    claim.consumerId,
                    "ผู้บริโภคเพิ่มข้อมูลประกอบ",
                  );
                })
              ) {
                setFollowup("");
                notify("บันทึกข้อมูลเพิ่มเติมแล้ว");
              }
            }}
          >
            <label className="field">
              เพิ่มข้อมูลให้ธุรกิจ
              <textarea
                value={followup}
                onChange={(e) => setFollowup(e.target.value)}
                maxLength={2000}
                rows={3}
                placeholder="ตอบคำขอข้อมูลหรืออธิบายเหตุการณ์เพิ่ม"
              />
            </label>
            <button
              className="button button--secondary"
              disabled={!followup.trim()}
            >
              บันทึกข้อมูลเพิ่มเติม
            </button>
          </form>
        </>
      )}
      <h3>คำตอบจากธุรกิจ</h3>
      {!replies.length && <p className="supporting">ยังไม่มีคำตอบจากธุรกิจ</p>}
      {replies.map((item) => (
        <div className="business-reply" key={item.id}>
          <strong>
            {state.businesses.find((b) => b.id === item.businessId)?.name}
          </strong>
          <small>
            {dateLabel(item.createdAt)} ·{" "}
            {item.public && eligibility.visible && item.risk.level === "low"
              ? "แชร์คำตอบกลางในกลุ่ม"
              : "คำตอบส่วนตัว"}
          </small>
          <p className="preserve-text">{item.text}</p>
        </div>
      ))}
      {isBusiness && (
        <section className="response-editor">
          <h3>ตอบกลับและติดตามการแก้ไข</h3>
          <label className="field">
            สถานะ
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ClaimStatus)}
            >
              {statuses.map((value) => (
                <option key={value} value={value}>
                  {statusLabels[value]}
                </option>
              ))}
            </select>
          </label>
          <button
            className="button button--secondary"
            disabled={status === claim.status}
            onClick={() => {
              if (
                commit((s) =>
                  updateClaim(
                    s,
                    { ...s.claims.find((c) => c.id === claim.id)!, status },
                    s.preferences.businessId,
                    `เปลี่ยนสถานะ: ${statusLabels[status]}`,
                  ),
                )
              )
                notify("อัปเดตสถานะแล้ว");
            }}
          >
            บันทึกสถานะ
          </button>
          <label className="field">
            คำตอบถึงผู้บริโภค
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              rows={4}
              maxLength={3000}
              placeholder="อธิบายข้อมูลที่ตรวจสอบได้ และขั้นตอนที่เสนอให้ดำเนินการ"
            />
          </label>
          {reply.trim() && <RiskBadge level={replyRisk.level} />}
          <label className="checkbox-line">
            <input
              type="checkbox"
              disabled={replyRisk.level !== "low"}
              checked={publicReply && replyRisk.level === "low"}
              onChange={(e) => setPublicReply(e.target.checked)}
            />
            แชร์คำตอบที่ใช้ถ้อยคำกลางในประเด็นสาธารณะเมื่อกลุ่มผ่านเกณฑ์
            (ไม่แนบข้อมูลลูกค้า)
          </label>
          <button
            className="button button--primary"
            disabled={!reply.trim()}
            onClick={saveResponse}
          >
            บันทึกคำตอบ
          </button>
          <p className="supporting">
            การโต้แย้งไม่ทำให้ข้อร้องเรียนถูกลบ และไม่ใช่การตัดสินว่าฝ่ายใดถูก
          </p>
        </section>
      )}
      {!isModerator && (
        <form
          className="appeal-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (!appeal.trim()) return;
            if (
              commit((s) => ({
                ...s,
                reports: [
                  ...s.reports,
                  {
                    id: id("appeal"),
                    clusterId: claim.clusterId,
                    actorId: isBusiness
                      ? s.preferences.businessId
                      : claim.consumerId,
                    kind: "appeal",
                    reason: appeal.trim(),
                    status: "pending",
                    outcome: "",
                    createdAt: new Date().toISOString(),
                  },
                ],
                history: [
                  historyEntry(
                    claim.clusterId,
                    isBusiness ? s.preferences.businessId : claim.consumerId,
                    "ยื่นอุทธรณ์ / ขอทบทวนเนื้อหา",
                  ),
                  ...s.history,
                ],
              }))
            ) {
              setAppeal("");
              notify("ส่งคำขอให้ผู้ดูแลจำลองแล้ว ไม่มีการซ่อนเนื้อหาอัตโนมัติ");
            }
          }}
        >
          <h3>ขอทบทวน / อุทธรณ์</h3>
          <p className="supporting">
            สถานะกลุ่ม: {reviewLabels[cluster.review]} ทั้งสองฝ่ายขอทบทวนได้
          </p>
          <label className="field">
            เหตุผลที่ต้องการให้ทบทวน
            <textarea
              value={appeal}
              onChange={(e) => setAppeal(e.target.value)}
              rows={2}
              maxLength={1500}
            />
          </label>
          <button
            className="button button--secondary"
            disabled={!appeal.trim()}
          >
            ส่งคำขอทบทวน
          </button>
        </form>
      )}
      <h3>ประวัติการดำเนินการ</h3>
      <ol className="history-list">
        {state.history
          .filter((h) => h.targetId === claim.id || h.targetId === cluster.id)
          .map((event) => (
            <li key={event.id}>
              <strong>{event.message}</strong>
              <span>
                {event.actor === claim.consumerId ? user.name : event.actor} ·{" "}
                {dateLabel(event.createdAt)}
              </span>
            </li>
          ))}
      </ol>
      <Notice>
        หากยังตกลงกันไม่ได้ เก็บบันทึกการติดต่อและขอข้อมูลจาก สคบ. 1166 หรือ
        ETDA 1212 ตามลักษณะปัญหา การซ่อม เปลี่ยน
        หรือคืนเงินขึ้นอยู่กับข้อเท็จจริงและกฎหมายที่ใช้บังคับ
      </Notice>
    </div>
  );
}
