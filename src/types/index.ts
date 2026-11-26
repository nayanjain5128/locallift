export type UserRole = 'admin' | 'client' | 'team';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // Demo prototype only — never store plaintext passwords in production
  role: UserRole;
  businessName?: string;
  businessCategory?: string;
  phone?: string;
  location?: string;
  website?: string;
  socialLinks?: string;
  teamTitle?: string;
  isDemo?: boolean;
  createdAt: string;
}

export type ServiceCategory =
  | 'Website Services'
  | 'Social Media'
  | 'Digital Marketing'
  | 'Additional Services';

export interface ServiceItem {
  id: string;
  name: string;
  category: ServiceCategory;
  description: string;
  deliverables: string[];
  active: boolean;
}

export interface PackagePreset {
  id: string;
  name: 'Starter' | 'Growth' | 'Premium';
  tagline: string;
  description: string;
  serviceIds: string[];
  recommendedFor: string;
}

export type EnquiryStatus =
  | 'New'
  | 'Under Review'
  | 'Accepted'
  | 'Rejected'
  | 'Converted';

export interface Enquiry {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  businessCategory: string;
  location: string;
  existingWebsite?: string;
  socialMediaLinks?: string;
  selectedServiceIds: string[];
  selectedServiceNames: string[];
  businessGoals?: string;
  projectRequirements: string;
  additionalMessage?: string;
  packageBase?: string;
  status: EnquiryStatus;
  clientId?: string;
  convertedProjectId?: string;
  isDemo?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type MilestoneStatus =
  | 'Not Started'
  | 'In Progress'
  | 'Under Review'
  | 'Completed';

export interface Milestone {
  id: string;
  name: string;
  description: string;
  status: MilestoneStatus;
  completionDate?: string;
  assignedTeamId?: string;
  order: number;
}

export type ProjectStatus = 'Pending' | 'Active' | 'Completed';

export interface ProjectUpdate {
  id: string;
  projectId: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  title: string;
  message: string;
  visibility: 'client' | 'internal';
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  clientId: string;
  clientName: string;
  businessName: string;
  enquiryId?: string;
  selectedServiceIds: string[];
  selectedServiceNames: string[];
  assignedTeamIds: string[];
  status: ProjectStatus;
  deadline: string;
  requirementsSummary: string;
  pendingRequirements: string[];
  milestones: Milestone[];
  internalNotes: string;
  isDemo?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  businessName: string;
  category: string;
  summary: string;
  servicesProvided: string[];
  liveUrl?: string;
  completedAt: string;
}

export interface ContactMessage {
  id: string;
  type: 'General Enquiry' | 'Business Support';
  name: string;
  email: string;
  phone?: string;
  businessName?: string;
  subject: string;
  message: string;
  createdAt: string;
}

export interface DatabaseState {
  version: number;
  users: User[];
  services: ServiceItem[];
  enquiries: Enquiry[];
  projects: Project[];
  projectUpdates: ProjectUpdate[];
  notifications: NotificationItem[];
  portfolio: PortfolioItem[];
  contactMessages: ContactMessage[];
}

export interface AuthSession {
  userId: string;
  authMethod: 'email' | 'google-demo' | 'phone-demo';
  loggedInAt: string;
}
