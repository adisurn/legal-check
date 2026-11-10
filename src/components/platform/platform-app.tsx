import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { usePlatform } from "../../hooks/use-platform";
import { DeviceWorkspace } from "../layout/device-workspace";
import { Modal } from "../modal";
import { Toast } from "../toast";
import { CaseCommunity } from "./case-community";
import { ClaimAssistant } from "./claim-assistant";
import { ClaimDetail } from "./claim-detail";
import {
  BusinessDashboard,
  ClaimsWorkspace,
  ConsumerDashboard,
} from "./dashboards";
import { LegalAdvisor } from "./legal-advisor";
import { ModerationWorkspace, SafetySettings } from "./moderation";
import { Onboarding } from "./onboarding";
import { roleNavigation, WorkspaceShell } from "./workspace-shell";

export function PlatformApp({ view }: { view: string }) {
  const { state, commit, error } = usePlatform();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const dismissToast = useCallback(() => setToast(""), []);
  const role = state.preferences.role ?? "consumer";
  const activeView = roleNavigation[role].some((item) => item.view === view)
    ? view
    : roleNavigation[role][0].view;
  useLayoutEffect(() => {
    document.documentElement.dataset.theme = state.preferences.theme ?? "light";
    document.documentElement.style.colorScheme =
      state.preferences.theme ?? "light";
  }, [state.preferences.theme]);
  useEffect(() => {
    setSelectedId(null);
  }, [role, state.preferences.consumerId, state.preferences.businessId]);
  const selected = state.claims.find(
    (c) =>
      c.id === selectedId &&
      (role === "moderator" ||
        (role === "business"
          ? c.businessId === state.preferences.businessId
          : c.consumerId === state.preferences.consumerId)),
  );
  return (
    <>
      {error && (
        <div className="storage-error" role="alert">
          {error}
        </div>
      )}
      {!state.preferences.theme || !state.preferences.role ? (
        <Onboarding state={state} commit={commit} />
      ) : (
        <DeviceWorkspace
          mode={state.preferences.display}
          onModeChange={(display) =>
            commit((s) => ({
              ...s,
              preferences: { ...s.preferences, display },
            }))
          }
        >
          <WorkspaceShell state={state} commit={commit} view={activeView}>
            {activeView === "overview" &&
              (role === "business" ? (
                <BusinessDashboard state={state} onSelect={setSelectedId} />
              ) : (
                <ConsumerDashboard
                  state={state}
                  commit={commit}
                  onSelect={setSelectedId}
                />
              ))}
            {activeView === "assistant" && (
              <ClaimAssistant
                key={state.preferences.consumerId}
                state={state}
                commit={commit}
                onCreated={(id) => {
                  setSelectedId(id);
                  setToast(
                    "บันทึกข้อร้องเรียน จัดประเภท และเชื่อมโยงกลุ่มภายในแล้ว",
                  );
                }}
              />
            )}
            {(activeView === "claims" || activeView === "resolution") && (
              <ClaimsWorkspace
                key={`${role}-${state.preferences.businessId}-${state.preferences.consumerId}`}
                state={state}
                business={role === "business"}
                onSelect={setSelectedId}
              />
            )}
            {activeView === "connect" && (
              <CaseCommunity
                key={`${role}-${state.preferences.businessId}-${state.preferences.consumerId}`}
                state={state}
                commit={commit}
                notify={setToast}
              />
            )}
            {activeView === "legal" && (
              <LegalAdvisor
                key={`${role}-${state.preferences.businessId}-${state.preferences.consumerId}`}
                state={state}
                commit={commit}
              />
            )}
            {activeView === "moderation" && (
              <ModerationWorkspace
                state={state}
                commit={commit}
                onSelect={setSelectedId}
                notify={setToast}
              />
            )}
            {activeView === "settings" && (
              <SafetySettings state={state} commit={commit} notify={setToast} />
            )}
          </WorkspaceShell>
          {selected && (
            <Modal
              title={`${selected.product || "ข้อร้องเรียน"} · ${selected.id.slice(0, 11)}`}
              onClose={() => setSelectedId(null)}
            >
              <ClaimDetail
                key={`${selected.id}-${role}`}
                claim={selected}
                state={state}
                commit={commit}
                notify={setToast}
              />
            </Modal>
          )}
          <Toast message={toast} onDismiss={dismissToast} />
        </DeviceWorkspace>
      )}
    </>
  );
}
