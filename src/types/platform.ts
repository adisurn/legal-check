export type Role = "consumer" | "business" | "moderator";
export type Theme = "light" | "dark";
export type ClaimStatus =
  | "New"
  | "Under Review"
  | "Awaiting Information"
  | "Responded"
  | "In Progress"
  | "Resolved"
  | "Closed"
  | "Disputed";
export type RiskLevel = "low" | "medium" | "high";
export type ReviewStatus =
  "pending" | "approved" | "edits" | "rejected" | "hidden";
export type EvidenceKind =
  "receipt" | "photo" | "communication" | "warranty" | "other";

export interface Consumer {
  id: string;
  name: string;
  verified: boolean;
}

export interface Business {
  id: string;
  name: string;
  brands: string[];
  verified: boolean;
}

export interface Evidence {
  id: string;
  name: string;
  kind: EvidenceKind;
  mime: string;
  data: string;
  fingerprint: string;
  shareWithBusiness: boolean;
  sensitive: boolean;
  relevant: boolean | null;
  consistent: boolean | null;
  reviewed: boolean;
}

export interface Classification {
  brand: string;
  product: string;
  category: string;
  keywords: string[];
  tags: string[];
  businessId: string | null;
}

export interface Risk {
  level: RiskLevel;
  reasons: string[];
  suggestion: string;
}

export interface ClaimDraft {
  productType: string;
  brand: string;
  product: string;
  description: string;
  category: string;
  requestedOutcome: string;
  evidence: Evidence[];
  ready: string[];
}

export interface Claim extends ClaimDraft, Classification {
  id: string;
  consumerId: string;
  clusterId: string;
  status: ClaimStatus;
  risk: Risk;
  contentReviewed: boolean;
  createdAt: string;
}

export interface Cluster {
  id: string;
  brand: string;
  product: string;
  category: string;
  tags: string[];
  keywords: string[];
  review: ReviewStatus;
  reviewNote: string;
  reviewedClaimIds: string[];
}

export interface DiscussionPost {
  id: string;
  clusterId: string;
  authorId: string;
  text: string;
  risk: Risk;
  review: ReviewStatus;
  createdAt: string;
}

export interface BusinessReply {
  id: string;
  claimId: string;
  businessId: string;
  text: string;
  public: boolean;
  risk: Risk;
  createdAt: string;
}

export interface SafetyReport {
  id: string;
  clusterId: string;
  postId?: string;
  actorId: string;
  kind: "report" | "appeal" | "correction";
  reason: string;
  status: "pending" | "reviewed";
  outcome: string;
  createdAt: string;
}

export interface HistoryEntry {
  id: string;
  targetId: string;
  actor: string;
  message: string;
  createdAt: string;
}

export interface SafetySettings {
  minConsumers: number;
  minVerified: number;
  minEvidence: number;
}

export interface PlatformState {
  version: 1;
  preferences: {
    theme: Theme | null;
    role: Role | null;
    display: "desktop" | "mobile";
    consumerId: string;
    businessId: string;
  };
  consumers: Consumer[];
  businesses: Business[];
  claims: Claim[];
  clusters: Cluster[];
  posts: DiscussionPost[];
  replies: BusinessReply[];
  reports: SafetyReport[];
  history: HistoryEntry[];
  settings: SafetySettings;
  drafts: Record<string, ClaimDraft>;
  legalDrafts: Record<string, string>;
}
