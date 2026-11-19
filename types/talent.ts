export type Track =
  | "frontend"
  | "backend"
  | "fullstack"
  | "uiux"
  | "aiml"
  | "mobile"
  | "hardware"
  | "pm";

export type AvailabilityStatus =
  | "available_now"
  | "open_to_gigs"
  | "in_cohort";

export interface TopProject {
  id: string;
  title: string;
  tagline: string;
  tech_stack: string[];
  live_url: string;
  repo_url: string;
  thumbnail_url: string | null;
}

export interface TalentProject extends TopProject {
  position: 1 | 2 | 3;
}

export interface TalentDirectoryItem {
  id: string;
  full_name: string;
  avatar_url: string | null;
  track: Track;
  availability_status: AvailabilityStatus;
  cohort_year: number;
  is_verified: boolean;
  top_project: TopProject;
}

export interface TalentProfile extends TalentDirectoryItem {
  bio: string;
  github_url: string | null;
  linkedin_url: string | null;
  x_url: string | null;
  projects: TalentProject[];
}

export interface TalentFilterState {
  roles: Track[];
  stacks: string[];
  availabilities: AvailabilityStatus[];
}

export interface HiringRequestInput {
  company_name: string;
  contact_email: string;
  contact_phone?: string;
  engagement_type: string;
  notes: string;
  shortlisted_user_ids: string[];
  candidate_notes?: Record<string, string>;
  website_url?: string; // Honeypot field
}

export type IntroductionConsentStatus = "pending" | "accepted" | "declined";

export interface InternIntroductionRequest {
  id: string;
  company_name: string;
  engagement_type: string;
  role_notes: string;
  specific_note?: string;
  sent_by_admin_at: string;
  consent_status: IntroductionConsentStatus;
  decline_reason?: string;
  responded_at?: string;
}

export interface InternAccountProfile extends TalentProfile {
  email: string;
  phone: string;
  consented_at: string | null;
}

export interface AdminCandidateProfile extends InternAccountProfile {
  submitted_at_label: string;
  submitted_order: number; // Lower = older (so pending profiles sort oldest first)
}

export type AdminForwardStatus =
  | "not_sent"
  | "pending_consent"
  | "accepted"
  | "declined";

export interface AdminHiringRequestCandidate {
  intern_id: string;
  specific_note?: string;
  forward_status: AdminForwardStatus;
  decline_reason?: string;
  forwarded_at?: string;
  responded_at?: string;
}

export interface AdminHiringRequest {
  id: string;
  company_name: string;
  contact_email: string;
  contact_phone?: string;
  engagement_type: string;
  notes: string;
  created_at_label: string;
  created_order: number; // Higher = newer (so requests sort newest first)
  notified_at: string | null; // null = email alert failed
  candidates: AdminHiringRequestCandidate[];
}

export const TRACK_LABELS: Record<Track, string> = {
  frontend: "Frontend",
  backend: "Backend",
  fullstack: "Fullstack",
  uiux: "Product Design (UI/UX)",
  mobile: "Mobile",
  aiml: "AI & Data",
  hardware: "Hardware",
  pm: "Product Management",
};

export const AVAILABILITY_LABELS: Record<AvailabilityStatus, string> = {
  available_now: "Available full-time",
  open_to_gigs: "Open to freelance & gigs",
  in_cohort: "Currently in training",
};
