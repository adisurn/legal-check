import { useRef, useState } from "react";
import { createDemoState } from "../data/platform";
import { emptyDraft, submitClaim } from "../lib/platform";
import type { PlatformState } from "../types/platform";

export const PLATFORM_KEY = "legal-check-platform-v1";

function load(): PlatformState {
  const saved = localStorage.getItem(PLATFORM_KEY);
  if (saved) {
    const parsed: PlatformState = JSON.parse(saved);
    if (
      parsed.version !== 1 ||
      ![
        "claims",
        "clusters",
        "consumers",
        "businesses",
        "posts",
        "replies",
        "reports",
        "history",
      ].every((key) => Array.isArray(parsed[key as keyof PlatformState])) ||
      !parsed.settings ||
      !parsed.drafts ||
      !parsed.legalDrafts ||
      !parsed.preferences ||
      !["light", "dark", null].includes(parsed.preferences.theme) ||
      !["consumer", "business", "moderator", null].includes(
        parsed.preferences.role,
      ) ||
      !["desktop", "mobile"].includes(parsed.preferences.display) ||
      !parsed.consumers.some((c) => c.id === parsed.preferences.consumerId) ||
      !parsed.businesses.some((b) => b.id === parsed.preferences.businessId)
    ) {
      throw new Error("ข้อมูลไม่ตรงกับรุ่นต้นแบบนี้");
    }
    return parsed;
  }
  let state = createDemoState();
  // Preserve existing locally saved cases when moving to the structured prototype.
  const legacy = localStorage.getItem("legal-check-cases");
  if (legacy) {
    const cases: unknown = JSON.parse(legacy);
    if (Array.isArray(cases)) {
      for (const item of cases) {
        if (!item || typeof item.title !== "string") continue;
        state = submitClaim(
          state,
          {
            ...emptyDraft(),
            description: item.title,
            brand: typeof item.company === "string" ? item.company : "",
            ready: Array.isArray(item.documents)
              ? item.documents.filter((d: unknown) => typeof d === "string")
              : [],
          },
          "consumer-you",
        );
      }
    }
  }
  localStorage.setItem(PLATFORM_KEY, JSON.stringify(state));
  return state;
}

export type Commit = (
  change: (state: PlatformState) => PlatformState,
) => boolean;

export function usePlatform() {
  const [initial] = useState(() => {
    try {
      return { state: load(), error: "" };
    } catch {
      return {
        state: createDemoState(),
        error:
          "อ่านหรือบันทึกข้อมูลไม่ได้ ข้อมูลเดิมจะไม่ถูกเขียนทับ โปรดตรวจพื้นที่จัดเก็บและสิทธิ LocalStorage",
      };
    }
  });
  const [state, setState] = useState(initial.state);
  const current = useRef(state);
  const [error, setError] = useState(initial.error);
  const commit: Commit = (change) => {
    // Do not replace an unreadable saved record or pretend a failed write succeeded.
    if (initial.error) return false;
    const next = change(current.current);
    try {
      localStorage.setItem(PLATFORM_KEY, JSON.stringify(next));
      current.current = next;
      setState(next);
      setError("");
      return true;
    } catch {
      setError(
        "บันทึกไม่สำเร็จ พื้นที่ LocalStorage อาจเต็ม ลองลดขนาดไฟล์แนบแล้วทำรายการอีกครั้ง",
      );
      return false;
    }
  };
  return { state, commit, error };
}
