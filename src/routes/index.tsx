import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { BusinessResolution } from "../components/business/business-resolution";
import { CaseDetails } from "../components/cases/case-details";
import { CasesSection } from "../components/cases/cases-section";
import { ClaimForm } from "../components/cases/claim-form";
import { CaseConnect } from "../components/connect/case-connect";
import { Overview } from "../components/dashboard/overview";
import { AppLayout } from "../components/layout/app-layout";
import { DeviceWorkspace } from "../components/layout/device-workspace";
import { PageFooter } from "../components/layout/page-footer";
import { PageHeading } from "../components/layout/page-heading";
import { LegalCheckPanel } from "../components/legal/legal-check-panel";
import { Modal } from "../components/modal";
import { ArticleContent } from "../components/resources/article-content";
import { KnowledgeSection } from "../components/resources/knowledge-section";
import { HelpContent, Notifications } from "../components/support-content";
import { Toast } from "../components/toast";
import { nav, privacyArticle, sampleCases } from "../data/legal-check";
import { useLocal } from "../hooks/use-local";
import type { Article, Case, LegalCheckDraft } from "../types/legal-check";

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>) => ({
    view: typeof search.view === "string" ? search.view : "overview",
  }),
  component: Home,
});

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
  const [article, setArticle] = useState<Article | null>(null);
  const [selected, setSelected] = useState<Case | null>(null);
  const [query, setQuery] = useState("");
  // Keep the draft here so navigating between tools doesn't discard it.
  const [legalDraft, setLegalDraft] = useState<LegalCheckDraft>({
    contract: "",
    analysis: false,
    fileError: "",
  });
  const [toast, setToast] = useState("");
  const dismissToast = useCallback(() => setToast(""), []);
  const onNavigate = () => setQuery("");
  const closeModal = () => {
    setModal(null);
    setArticle(null);
    setSelected(null);
  };
  const updateCase = (next: Case) => {
    setSelected(next);
    setCases((prev) => prev.map((c) => (c.id === next.id ? next : c)));
  };
  const createCase = (data: Pick<Case, "title" | "company" | "category">) => {
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
  };
  const toggleGroup = (group: string) => {
    setJoined((prev) =>
      prev.includes(group)
        ? prev.filter((item) => item !== group)
        : [...prev, group],
    );
  };

  return (
    <DeviceWorkspace>
      <AppLayout
        activeView={activeView}
        onNavigate={onNavigate}
        onHelp={() => setModal("help")}
        onNotifications={() => setModal("notifications")}
      >
        {(storageError || groupStorageError) && (
          <div className="storage-warning">
            ไม่สามารถบันทึกข้อมูลได้ โปรดอนุญาต Local Storage ก่อนใช้งานต่อ
          </div>
        )}
        <PageHeading
          activeView={activeView}
          onCreateCase={() => setModal("claim")}
        />
        {activeView === "overview" && (
          <Overview
            cases={cases}
            joinedCount={joined.length}
            onHelp={() => setModal("help")}
            onNavigate={onNavigate}
          />
        )}
        {(activeView === "overview" || activeView === "claims") && (
          <CasesSection
            cases={cases}
            overview={activeView === "overview"}
            query={query}
            onQueryChange={setQuery}
            onSelect={setSelected}
            onNavigate={onNavigate}
          />
        )}
        {activeView === "legal" && (
          <LegalCheckPanel
            draft={legalDraft}
            onDraftChange={setLegalDraft}
            onClaim={() => setModal("claim")}
          />
        )}
        {activeView === "connect" && (
          <CaseConnect joined={joined} onToggleGroup={toggleGroup} />
        )}
        {activeView === "business" && (
          <BusinessResolution
            cases={cases}
            query={query}
            onSelect={setSelected}
          />
        )}
        {(activeView === "overview" || activeView === "resources") && (
          <KnowledgeSection onArticle={setArticle} onNavigate={onNavigate} />
        )}
        <PageFooter
          onPrivacy={() => setArticle(privacyArticle)}
          onHelp={() => setModal("help")}
        />
      </AppLayout>
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
          {modal === "claim" && <ClaimForm onSave={createCase} />}
          {article && <ArticleContent article={article} />}
          {selected && <CaseDetails item={selected} onUpdate={updateCase} />}
          {modal === "help" && <HelpContent />}
          {modal === "notifications" && (
            <Notifications
              cases={cases}
              onSelect={(item) => {
                setModal(null);
                setSelected(item);
              }}
            />
          )}
        </Modal>
      )}
      <Toast message={toast} onDismiss={dismissToast} />
    </DeviceWorkspace>
  );
}
