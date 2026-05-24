export interface Lead {
  id: number;
  fullName: string;
  organization: string;
  email: string;
  phone: string | null;
  country: string;
  requestType: string;
  projectSector: string | null;
  message: string;
  budgetFundingNeed: string | null;
  projectTimeline: string | null;
  roleType: string | null;
  status: string;
  notes: string | null;
  followUpDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: number;
  name: string;
  sector: string;
  country: string;
  region: string | null;
  fundingStatus: string;
  estimatedValue: string;
  zaforaRole: string;
  partnerNeed: string | null;
  description: string | null;
  imageUrl: string | null;
  interestCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectInterest {
  id: number;
  projectId: number;
  fullName: string;
  organization: string;
  email: string;
  phone: string | null;
  roleType: string;
  message: string | null;
  createdAt: string;
}

export interface Document {
  id: number;
  title: string;
  documentType: string;
  visibility: string;
  fileUrl: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CatalogService {
  id: number;
  name: string;
  icon: string;
  description: string;
  bullets: string[];
  imageUrl: string | null;
  category: string | null;
  displayOrder: number;
  visible: boolean;
}

export interface Testimonial {
  id: number;
  name: string;
  company: string;
  role: string | null;
  quote: string;
  photoUrl: string | null;
  displayOrder: number;
  visible: boolean;
}

export interface ContentStat {
  id: number;
  label: string;
  value: string;
  suffix: string | null;
  description: string | null;
  iconName: string | null;
  displayOrder: number;
  visible: boolean;
}

export interface MethodologyStep {
  id: number;
  stepNumber: number;
  title: string;
  description: string;
  iconName: string | null;
  displayOrder: number;
  visible: boolean;
}

export interface SiteSetting {
  id: number;
  key: string;
  value: string;
  updatedAt: string;
}

export interface AuditLog {
  id: number;
  action: string;
  category: string;
  description: string;
  detail: Record<string, unknown> | null;
  performedAt: string;
}

export interface DashboardStats {
  totalLeads: number;
  totalProjects: number;
  totalInterests: number;
  totalDocuments: number;
  newLeadsThisMonth: number;
  activeProjects: number;
  leadsByStatus: { status: string; count: number }[];
  recentLeads: Lead[];
}

export interface ProjectStats {
  bySector: { sector: string; count: number; totalValue: string }[];
  byStatus: { status: string; count: number }[];
}
