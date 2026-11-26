import {
  createDefaultMilestones,
  createSeedDatabase,
} from '../data/seedData';
import type {
  AuthSession,
  ContactMessage,
  DatabaseState,
  Enquiry,
  EnquiryStatus,
  MilestoneStatus,
  PortfolioItem,
  Project,
  ProjectStatus,
  ProjectUpdate,
  ServiceItem,
  User,
  UserRole,
} from '../types';

/**
 * LocalLift Prototype Storage Service
 * -----------------------------------
 * Uses browser localStorage as a persistent prototype database.
 * Modularly isolated so that future backend integration (e.g., Supabase)
 * only requires replacing these repository methods with async API calls.
 */

const DB_KEY = 'locallift_prototype_db_v1';
const SESSION_KEY = 'locallift_prototype_session_v1';
export const DB_UPDATED_EVENT = 'locallift:db-updated';

const MILESTONE_WEIGHTS: Record<MilestoneStatus, number> = {
  'Not Started': 0,
  'In Progress': 0.4,
  'Under Review': 0.75,
  Completed: 1,
};

export function calculateProjectProgress(project: Project): {
  percentage: number;
  completedCount: number;
  totalCount: number;
} {
  const milestones = project.milestones || [];
  if (milestones.length === 0) {
    return {
      percentage: project.status === 'Completed' ? 100 : 0,
      completedCount: 0,
      totalCount: 0,
    };
  }
  const completedCount = milestones.filter(
    (m) => m.status === 'Completed'
  ).length;
  const totalWeight = milestones.reduce(
    (sum, m) => sum + (MILESTONE_WEIGHTS[m.status] ?? 0),
    0
  );
  const percentage = Math.round((totalWeight / milestones.length) * 100);
  return {
    percentage,
    completedCount,
    totalCount: milestones.length,
  };
}

function notifyDbUpdated() {
  window.dispatchEvent(new CustomEvent(DB_UPDATED_EVENT));
}

export function loadDatabase(): DatabaseState {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (!raw) {
      const seeded = createSeedDatabase();
      localStorage.setItem(DB_KEY, JSON.stringify(seeded));
      return seeded;
    }
    const parsed = JSON.parse(raw) as DatabaseState;
    if (!parsed || !Array.isArray(parsed.users) || !Array.isArray(parsed.services)) {
      const seeded = createSeedDatabase();
      localStorage.setItem(DB_KEY, JSON.stringify(seeded));
      return seeded;
    }
    return parsed;
  } catch {
    const seeded = createSeedDatabase();
    localStorage.setItem(DB_KEY, JSON.stringify(seeded));
    return seeded;
  }
}

export function saveDatabase(db: DatabaseState): void {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
  notifyDbUpdated();
}

export function resetDemoDatabase(): DatabaseState {
  const seeded = createSeedDatabase();
  localStorage.setItem(DB_KEY, JSON.stringify(seeded));
  notifyDbUpdated();
  return seeded;
}

// ---------- Authentication & Session ----------

export function getSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

export function getAuthenticatedUser(): User | null {
  const session = getSession();
  if (!session) return null;
  const db = loadDatabase();
  return db.users.find((u) => u.id === session.userId) ?? null;
}

export function setSession(session: AuthSession): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  notifyDbUpdated();
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
  notifyDbUpdated();
}

export function authenticateWithEmail(
  email: string,
  password: string
): { user?: User; error?: string } {
  const db = loadDatabase();
  const normalized = email.trim().toLowerCase();
  const user = db.users.find(
    (u) => u.email.toLowerCase() === normalized && u.password === password
  );
  if (!user) {
    return { error: 'Invalid email or password. Please verify your credentials.' };
  }
  setSession({
    userId: user.id,
    authMethod: 'email',
    loggedInAt: new Date().toISOString(),
  });
  return { user };
}

export function authenticateDemoGoogle(): User {
  const db = loadDatabase();
  // Demo simulation signs in as the sample client account
  const clientUser =
    db.users.find((u) => u.email === 'client@locallift.demo') ||
    db.users.find((u) => u.role === 'client')!;
  setSession({
    userId: clientUser.id,
    authMethod: 'google-demo',
    loggedInAt: new Date().toISOString(),
  });
  return clientUser;
}

export function authenticateDemoPhone(phoneInput: string): {
  user: User;
  isNewClient: boolean;
} {
  const db = loadDatabase();
  const cleanPhone = phoneInput.trim();
  const existing = db.users.find(
    (u) =>
      u.role === 'client' &&
      u.phone &&
      u.phone.replace(/\D/g, '').includes(cleanPhone.replace(/\D/g, ''))
  );
  if (existing) {
    setSession({
      userId: existing.id,
      authMethod: 'phone-demo',
      loggedInAt: new Date().toISOString(),
    });
    return { user: existing, isNewClient: false };
  }

  // Fallback to default demo client if user enters the demo phone or create a demo client profile
  if (cleanPhone.replace(/\D/g, '') === '9800010101') {
    const demoClient = db.users.find((u) => u.email === 'client@locallift.demo')!;
    setSession({
      userId: demoClient.id,
      authMethod: 'phone-demo',
      loggedInAt: new Date().toISOString(),
    });
    return { user: demoClient, isNewClient: false };
  }

  const newClient: User = {
    id: `usr-client-${Date.now()}`,
    name: 'Phone Demo Client',
    email: `phone.${Date.now().toString().slice(-5)}@locallift.demo`,
    password: `Demo#${Date.now()}`,
    role: 'client',
    businessName: 'Local Business (Phone Demo)',
    phone: cleanPhone,
    isDemo: true,
    createdAt: new Date().toISOString(),
  };
  db.users.push(newClient);
  saveDatabase(db);
  setSession({
    userId: newClient.id,
    authMethod: 'phone-demo',
    loggedInAt: new Date().toISOString(),
  });
  return { user: newClient, isNewClient: true };
}

export function registerClientAccount(payload: {
  name: string;
  email: string;
  password: string;
  businessName: string;
  businessCategory?: string;
  phone?: string;
  location?: string;
}): { user?: User; error?: string } {
  const db = loadDatabase();
  const normalizedEmail = payload.email.trim().toLowerCase();

  if (db.users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
    return { error: 'An account with this email already exists.' };
  }

  // Security guard in prototype: public registration ALWAYS assigns 'client' role
  const newUser: User = {
    id: `usr-client-${Date.now()}`,
    name: payload.name.trim(),
    email: normalizedEmail,
    password: payload.password,
    role: 'client',
    businessName: payload.businessName.trim(),
    businessCategory: payload.businessCategory?.trim() || 'Other Local Business',
    phone: payload.phone?.trim(),
    location: payload.location?.trim(),
    isDemo: false,
    createdAt: new Date().toISOString(),
  };

  // Associate any existing enquiries matching this email to the new client account
  db.enquiries = db.enquiries.map((enq) =>
    enq.email.toLowerCase() === normalizedEmail && !enq.clientId
      ? { ...enq, clientId: newUser.id, updatedAt: new Date().toISOString() }
      : enq
  );

  db.notifications.unshift({
    id: `notif-${Date.now()}`,
    userId: newUser.id,
    title: 'Welcome to LocalLift',
    message:
      'Your client portal is ready. Submit a service enquiry or track ongoing projects anytime.',
    type: 'success',
    read: false,
    link: '/services',
    createdAt: new Date().toISOString(),
  });

  db.users.push(newUser);
  saveDatabase(db);

  setSession({
    userId: newUser.id,
    authMethod: 'email',
    loggedInAt: new Date().toISOString(),
  });

  return { user: newUser };
}

export function updateUserProfile(
  userId: string,
  updates: Partial<
    Pick<
      User,
      | 'name'
      | 'businessName'
      | 'businessCategory'
      | 'phone'
      | 'location'
      | 'website'
      | 'socialLinks'
      | 'teamTitle'
    >
  >
): User | null {
  const db = loadDatabase();
  const idx = db.users.findIndex((u) => u.id === userId);
  if (idx === -1) return null;

  const updated: User = {
    ...db.users[idx],
    ...updates,
  };
  db.users[idx] = updated;

  // Keep clientName / businessName consistent on linked projects
  if (updated.role === 'client') {
    db.projects = db.projects.map((prj) =>
      prj.clientId === userId
        ? {
            ...prj,
            clientName: updated.name,
            businessName: updated.businessName || prj.businessName,
          }
        : prj
    );
  }

  saveDatabase(db);
  return updated;
}

// ---------- Enquiries ----------

export function createEnquiry(
  input: Omit<
    Enquiry,
    'id' | 'status' | 'createdAt' | 'updatedAt' | 'convertedProjectId'
  >
): Enquiry {
  const db = loadDatabase();
  const existingCount = db.enquiries.length;
  const randomSuffix = Math.floor(100 + Math.random() * 899);
  const id = `ENQ-${1040 + existingCount + 1}-${randomSuffix}`;
  const now = new Date().toISOString();

  // Auto-associate with an existing client account if email matches or clientId provided
  const matchedClient =
    (input.clientId && db.users.find((u) => u.id === input.clientId)) ||
    db.users.find(
      (u) =>
        u.role === 'client' &&
        u.email.toLowerCase() === input.email.trim().toLowerCase()
    );

  const enquiry: Enquiry = {
    ...input,
    id,
    clientId: matchedClient?.id ?? input.clientId,
    status: 'New',
    createdAt: now,
    updatedAt: now,
  };

  db.enquiries.unshift(enquiry);

  // Notify admins
  const admins = db.users.filter((u) => u.role === 'admin');
  admins.forEach((admin) => {
    db.notifications.unshift({
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      userId: admin.id,
      title: `New Enquiry: ${enquiry.businessName}`,
      message: `${enquiry.ownerName} submitted ${enquiry.selectedServiceNames.length} selected service(s).`,
      type: 'info',
      read: false,
      link: '/admin/enquiries',
      createdAt: now,
    });
  });

  if (matchedClient) {
    db.notifications.unshift({
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      userId: matchedClient.id,
      title: `Enquiry Received (${enquiry.id})`,
      message: `Your custom service enquiry for ${enquiry.businessName} is now with the LocalLift team.`,
      type: 'success',
      read: false,
      link: '/client/dashboard',
      createdAt: now,
    });
  }

  saveDatabase(db);
  return enquiry;
}

export function updateEnquiryStatus(
  enquiryId: string,
  status: EnquiryStatus
): Enquiry | null {
  const db = loadDatabase();
  const idx = db.enquiries.findIndex((e) => e.id === enquiryId);
  if (idx === -1) return null;

  const updated: Enquiry = {
    ...db.enquiries[idx],
    status,
    updatedAt: new Date().toISOString(),
  };
  db.enquiries[idx] = updated;

  if (updated.clientId) {
    db.notifications.unshift({
      id: `notif-${Date.now()}`,
      userId: updated.clientId,
      title: `Enquiry ${updated.id} Updated`,
      message: `Your enquiry for ${updated.businessName} is now marked "${status}".`,
      type: status === 'Accepted' ? 'success' : status === 'Rejected' ? 'warning' : 'info',
      read: false,
      link: '/client/dashboard',
      createdAt: new Date().toISOString(),
    });
  }

  saveDatabase(db);
  return updated;
}

export function convertEnquiryToProject(
  enquiryId: string,
  options?: {
    projectTitle?: string;
    deadline?: string;
    assignedTeamIds?: string[];
  }
): { project?: Project; createdClient?: User; error?: string } {
  const db = loadDatabase();
  const enqIdx = db.enquiries.findIndex((e) => e.id === enquiryId);
  if (enqIdx === -1) return { error: 'Enquiry not found.' };

  const enq = db.enquiries[enqIdx];
  if (enq.convertedProjectId) {
    return { error: 'This enquiry has already been converted into a project.' };
  }

  const now = new Date().toISOString();

  // Find or create client user for this enquiry
  let clientUser =
    (enq.clientId && db.users.find((u) => u.id === enq.clientId)) ||
    db.users.find(
      (u) =>
        u.role === 'client' &&
        u.email.toLowerCase() === enq.email.trim().toLowerCase()
    );

  let createdClient: User | undefined;
  if (!clientUser) {
    clientUser = {
      id: `usr-client-${Date.now()}`,
      name: enq.ownerName,
      email: enq.email.trim().toLowerCase(),
      password: 'Client123!',
      role: 'client',
      businessName: enq.businessName,
      businessCategory: enq.businessCategory,
      phone: enq.phone,
      location: enq.location,
      website: enq.existingWebsite,
      socialLinks: enq.socialMediaLinks,
      isDemo: false,
      createdAt: now,
    };
    db.users.push(clientUser);
    createdClient = clientUser;
  }

  const projectId = `PRJ-${200 + db.projects.length + 1}`;
  const defaultDeadline = new Date(Date.now() + 21 * 86400000)
    .toISOString()
    .slice(0, 10);

  const assignedTeamIds = options?.assignedTeamIds ?? [];
  const project: Project = {
    id: projectId,
    title: options?.projectTitle?.trim() || `${enq.businessName} Digital Growth`,
    clientId: clientUser.id,
    clientName: clientUser.name,
    businessName: enq.businessName,
    enquiryId: enq.id,
    selectedServiceIds: [...enq.selectedServiceIds],
    selectedServiceNames: [...enq.selectedServiceNames],
    assignedTeamIds,
    status: 'Active',
    deadline: options?.deadline || defaultDeadline,
    requirementsSummary: enq.projectRequirements,
    pendingRequirements: ['Confirm kickoff call availability', 'Share brand logo / media assets'],
    milestones: createDefaultMilestones(
      ['In Progress', 'Not Started', 'Not Started', 'Not Started', 'Not Started', 'Not Started', 'Not Started'],
      assignedTeamIds[0]
    ),
    internalNotes: enq.businessGoals
      ? `Client Goal: ${enq.businessGoals}`
      : 'Converted from client enquiry.',
    createdAt: now,
    updatedAt: now,
  };

  db.projects.unshift(project);
  db.enquiries[enqIdx] = {
    ...enq,
    status: 'Converted',
    clientId: clientUser.id,
    convertedProjectId: project.id,
    updatedAt: now,
  };

  db.projectUpdates.unshift({
    id: `upd-${Date.now()}`,
    projectId: project.id,
    authorId: 'usr-admin-1',
    authorName: 'LocalLift Operations Admin',
    authorRole: 'admin',
    title: 'Project Kickoff Created',
    message: `Your enquiry (${enq.id}) has been converted into an active project. Requirements collection is now underway.`,
    visibility: 'client',
    createdAt: now,
  });

  db.notifications.unshift({
    id: `notif-${Date.now()}`,
    userId: clientUser.id,
    title: `New Project Started: ${project.title}`,
    message: `Your enquiry ${enq.id} is now an active project. Track milestones in My Projects.`,
    type: 'success',
    read: false,
    link: '/client/projects',
    createdAt: now,
  });

  assignedTeamIds.forEach((teamId) => {
    db.notifications.unshift({
      id: `notif-${Date.now()}-${teamId}`,
      userId: teamId,
      title: `Assigned to Project: ${project.title}`,
      message: `You have been assigned to ${project.businessName}. Deadline: ${project.deadline}.`,
      type: 'info',
      read: false,
      link: '/team/projects',
      createdAt: now,
    });
  });

  saveDatabase(db);
  return { project, createdClient };
}

// ---------- Projects & Milestones ----------

export function createProject(input: {
  title: string;
  clientId: string;
  selectedServiceIds: string[];
  assignedTeamIds: string[];
  deadline: string;
  requirementsSummary: string;
  pendingRequirements?: string[];
  internalNotes?: string;
  status?: ProjectStatus;
}): Project | null {
  const db = loadDatabase();
  const client = db.users.find((u) => u.id === input.clientId && u.role === 'client');
  if (!client) return null;

  const now = new Date().toISOString();
  const serviceNames = db.services
    .filter((s) => input.selectedServiceIds.includes(s.id))
    .map((s) => s.name);

  const project: Project = {
    id: `PRJ-${200 + db.projects.length + 1}`,
    title: input.title.trim(),
    clientId: client.id,
    clientName: client.name,
    businessName: client.businessName || client.name,
    selectedServiceIds: input.selectedServiceIds,
    selectedServiceNames: serviceNames,
    assignedTeamIds: input.assignedTeamIds,
    status: input.status ?? 'Active',
    deadline: input.deadline,
    requirementsSummary: input.requirementsSummary.trim(),
    pendingRequirements: input.pendingRequirements ?? [],
    milestones: createDefaultMilestones(undefined, input.assignedTeamIds[0]),
    internalNotes: input.internalNotes?.trim() ?? '',
    createdAt: now,
    updatedAt: now,
  };

  db.projects.unshift(project);

  db.notifications.unshift({
    id: `notif-${Date.now()}`,
    userId: client.id,
    title: `New Project Created: ${project.title}`,
    message: 'A new project has been added to your LocalLift client portal.',
    type: 'success',
    read: false,
    link: '/client/projects',
    createdAt: now,
  });

  input.assignedTeamIds.forEach((teamId) => {
    db.notifications.unshift({
      id: `notif-${Date.now()}-${teamId}`,
      userId: teamId,
      title: `Assigned: ${project.title}`,
      message: `You were assigned to ${project.businessName} (Due ${project.deadline}).`,
      type: 'info',
      read: false,
      link: '/team/projects',
      createdAt: now,
    });
  });

  saveDatabase(db);
  return project;
}

export function updateProject(
  projectId: string,
  updates: Partial<
    Pick<
      Project,
      | 'title'
      | 'clientId'
      | 'selectedServiceIds'
      | 'assignedTeamIds'
      | 'status'
      | 'deadline'
      | 'requirementsSummary'
      | 'pendingRequirements'
      | 'internalNotes'
    >
  >
): Project | null {
  const db = loadDatabase();
  const idx = db.projects.findIndex((p) => p.id === projectId);
  if (idx === -1) return null;

  const current = db.projects[idx];
  let clientName = current.clientName;
  let businessName = current.businessName;
  if (updates.clientId && updates.clientId !== current.clientId) {
    const newClient = db.users.find((u) => u.id === updates.clientId);
    if (newClient) {
      clientName = newClient.name;
      businessName = newClient.businessName || newClient.name;
    }
  }

  let selectedServiceNames = current.selectedServiceNames;
  if (updates.selectedServiceIds) {
    selectedServiceNames = db.services
      .filter((s) => updates.selectedServiceIds!.includes(s.id))
      .map((s) => s.name);
  }

  const updated: Project = {
    ...current,
    ...updates,
    clientName,
    businessName,
    selectedServiceNames,
    updatedAt: new Date().toISOString(),
  };

  // If marked Completed by Admin, optionally mark Delivery or keep milestones consistent
  db.projects[idx] = updated;
  saveDatabase(db);
  return updated;
}

export function updateMilestoneStatus(
  projectId: string,
  milestoneId: string,
  status: MilestoneStatus,
  actor: { id: string; name: string; role: UserRole },
  descriptionOverride?: string
): Project | null {
  const db = loadDatabase();
  const pIdx = db.projects.findIndex((p) => p.id === projectId);
  if (pIdx === -1) return null;

  const project = db.projects[pIdx];
  const now = new Date().toISOString();
  let changedMilestoneName = '';

  const updatedMilestones = project.milestones.map((m) => {
    if (m.id !== milestoneId) return m;
    changedMilestoneName = m.name;
    return {
      ...m,
      status,
      description: descriptionOverride !== undefined ? descriptionOverride : m.description,
      completionDate: status === 'Completed' ? now.slice(0, 10) : undefined,
    };
  });

  // Auto-derive project status if all completed or if active work begins
  const allCompleted = updatedMilestones.every((m) => m.status === 'Completed');
  const anyStarted = updatedMilestones.some((m) => m.status !== 'Not Started');
  let nextProjectStatus: ProjectStatus = project.status;
  if (allCompleted) {
    nextProjectStatus = 'Completed';
  } else if (project.status === 'Completed' && !allCompleted) {
    nextProjectStatus = 'Active';
  } else if (project.status === 'Pending' && anyStarted) {
    nextProjectStatus = 'Active';
  }

  const updatedProject: Project = {
    ...project,
    milestones: updatedMilestones,
    status: nextProjectStatus,
    updatedAt: now,
  };

  db.projects[pIdx] = updatedProject;

  if (changedMilestoneName) {
    // Notify client when milestone changes to In Progress, Under Review, or Completed
    if (status === 'Completed' || status === 'Under Review' || status === 'In Progress') {
      db.notifications.unshift({
        id: `notif-${Date.now()}`,
        userId: project.clientId,
        title: `Milestone ${status}: ${changedMilestoneName}`,
        message: `${changedMilestoneName} in "${project.title}" was updated to ${status}.`,
        type: status === 'Completed' ? 'success' : 'info',
        read: false,
        link: '/client/projects',
        createdAt: now,
      });
    }

    // If a team member submits a milestone for review, notify admins
    if (actor.role === 'team' && status === 'Under Review') {
      db.users
        .filter((u) => u.role === 'admin')
        .forEach((admin) => {
          db.notifications.unshift({
            id: `notif-${Date.now()}-${admin.id}`,
            userId: admin.id,
            title: `Review Requested: ${project.title}`,
            message: `${actor.name} submitted "${changedMilestoneName}" for admin review.`,
            type: 'warning',
            read: false,
            link: '/admin/projects',
            createdAt: now,
          });
        });
    }
  }

  saveDatabase(db);
  return updatedProject;
}

export function addProjectMilestone(
  projectId: string,
  input: { name: string; description: string; assignedTeamId?: string }
): Project | null {
  const db = loadDatabase();
  const idx = db.projects.findIndex((p) => p.id === projectId);
  if (idx === -1) return null;

  const project = db.projects[idx];
  const newMilestone = {
    id: `ms-${Date.now()}`,
    name: input.name.trim(),
    description: input.description.trim(),
    status: 'Not Started' as MilestoneStatus,
    assignedTeamId: input.assignedTeamId,
    order: project.milestones.length + 1,
  };

  db.projects[idx] = {
    ...project,
    milestones: [...project.milestones, newMilestone],
    status: project.status === 'Completed' ? 'Active' : project.status,
    updatedAt: new Date().toISOString(),
  };

  saveDatabase(db);
  return db.projects[idx];
}

export function publishProjectUpdate(input: {
  projectId: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  title: string;
  message: string;
  visibility: 'client' | 'internal';
}): ProjectUpdate | null {
  const db = loadDatabase();
  const project = db.projects.find((p) => p.id === input.projectId);
  if (!project) return null;

  const now = new Date().toISOString();
  const update: ProjectUpdate = {
    id: `upd-${Date.now()}`,
    projectId: input.projectId,
    authorId: input.authorId,
    authorName: input.authorName,
    authorRole: input.authorRole,
    title: input.title.trim(),
    message: input.message.trim(),
    visibility: input.visibility,
    createdAt: now,
  };

  db.projectUpdates.unshift(update);

  if (input.visibility === 'client') {
    db.notifications.unshift({
      id: `notif-${Date.now()}`,
      userId: project.clientId,
      title: `Update: ${project.title}`,
      message: `${update.title} — ${update.message.slice(0, 100)}`,
      type: 'info',
      read: false,
      link: '/client/updates',
      createdAt: now,
    });
  }

  saveDatabase(db);
  return update;
}

export function resolvePendingRequirement(
  projectId: string,
  requirementText: string,
  clientActor: User
): Project | null {
  const db = loadDatabase();
  const idx = db.projects.findIndex((p) => p.id === projectId);
  if (idx === -1) return null;

  const project = db.projects[idx];
  const nextPending = project.pendingRequirements.filter(
    (r) => r !== requirementText
  );
  const now = new Date().toISOString();

  db.projects[idx] = {
    ...project,
    pendingRequirements: nextPending,
    updatedAt: now,
  };

  db.projectUpdates.unshift({
    id: `upd-${Date.now()}`,
    projectId: project.id,
    authorId: clientActor.id,
    authorName: clientActor.name,
    authorRole: 'client',
    title: 'Client Submitted Requirement',
    message: `Marked requirement ready: "${requirementText}"`,
    visibility: 'client',
    createdAt: now,
  });

  db.users
    .filter((u) => u.role === 'admin' || project.assignedTeamIds.includes(u.id))
    .forEach((recipient) => {
      db.notifications.unshift({
        id: `notif-${Date.now()}-${recipient.id}`,
        userId: recipient.id,
        title: `Client Requirement Submitted`,
        message: `${clientActor.businessName || clientActor.name} marked "${requirementText}" ready.`,
        type: 'success',
        read: false,
        link: recipient.role === 'admin' ? '/admin/projects' : '/team/projects',
        createdAt: now,
      });
    });

  saveDatabase(db);
  return db.projects[idx];
}

// ---------- Team Management ----------

export function createTeamMember(input: {
  name: string;
  email: string;
  password: string;
  teamTitle: string;
  phone?: string;
}): { user?: User; error?: string } {
  const db = loadDatabase();
  const normalized = input.email.trim().toLowerCase();
  if (db.users.some((u) => u.email.toLowerCase() === normalized)) {
    return { error: 'A user with this email already exists.' };
  }
  const newMember: User = {
    id: `usr-team-${Date.now()}`,
    name: input.name.trim(),
    email: normalized,
    password: input.password,
    role: 'team',
    teamTitle: input.teamTitle.trim(),
    phone: input.phone?.trim(),
    isDemo: true,
    createdAt: new Date().toISOString(),
  };
  db.users.push(newMember);
  saveDatabase(db);
  return { user: newMember };
}

// ---------- Services Management ----------

export function addService(
  input: Omit<ServiceItem, 'id' | 'active'>
): ServiceItem {
  const db = loadDatabase();
  const service: ServiceItem = {
    ...input,
    id: `srv-${Date.now()}`,
    active: true,
  };
  db.services.push(service);
  saveDatabase(db);
  return service;
}

export function updateService(
  serviceId: string,
  updates: Partial<Omit<ServiceItem, 'id'>>
): ServiceItem | null {
  const db = loadDatabase();
  const idx = db.services.findIndex((s) => s.id === serviceId);
  if (idx === -1) return null;
  db.services[idx] = { ...db.services[idx], ...updates };
  saveDatabase(db);
  return db.services[idx];
}

export function deleteService(serviceId: string): void {
  const db = loadDatabase();
  db.services = db.services.filter((s) => s.id !== serviceId);
  saveDatabase(db);
}

// ---------- Notifications ----------

export function markNotificationRead(notificationId: string): void {
  const db = loadDatabase();
  db.notifications = db.notifications.map((n) =>
    n.id === notificationId ? { ...n, read: true } : n
  );
  saveDatabase(db);
}

export function markAllNotificationsRead(userId: string): void {
  const db = loadDatabase();
  db.notifications = db.notifications.map((n) =>
    n.userId === userId ? { ...n, read: true } : n
  );
  saveDatabase(db);
}

// ---------- Portfolio & Contact ----------

export function addPortfolioItem(
  input: Omit<PortfolioItem, 'id'>
): PortfolioItem {
  const db = loadDatabase();
  const item: PortfolioItem = {
    ...input,
    id: `pf-${Date.now()}`,
  };
  db.portfolio.unshift(item);
  saveDatabase(db);
  return item;
}

export function removePortfolioItem(id: string): void {
  const db = loadDatabase();
  db.portfolio = db.portfolio.filter((p) => p.id !== id);
  saveDatabase(db);
}

export function submitContactMessage(
  input: Omit<ContactMessage, 'id' | 'createdAt'>
): ContactMessage {
  const db = loadDatabase();
  const msg: ContactMessage = {
    ...input,
    id: `MSG-${Date.now().toString().slice(-5)}`,
    createdAt: new Date().toISOString(),
  };
  db.contactMessages.unshift(msg);

  db.users
    .filter((u) => u.role === 'admin')
    .forEach((admin) => {
      db.notifications.unshift({
        id: `notif-${Date.now()}-${admin.id}`,
        userId: admin.id,
        title: `${msg.type}: ${msg.subject}`,
        message: `From ${msg.name} (${msg.email})`,
        type: 'info',
        read: false,
        link: '/admin/dashboard',
        createdAt: msg.createdAt,
      });
    });

  saveDatabase(db);
  return msg;
}
