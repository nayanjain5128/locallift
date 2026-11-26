import type {
  DatabaseState,
  Milestone,
  MilestoneStatus,
  PackagePreset,
  ServiceItem,
} from '../types';

export const BUSINESS_CATEGORIES = [
  'Café, Bakery & Restaurant',
  'Salon, Spa & Wellness',
  'Coaching & Education',
  'Retail & Local Store',
  'Healthcare & Clinic',
  'Fitness & Studio',
  'Home & Repair Services',
  'Professional Services',
  'Other Local Business',
];

export const STANDARD_MILESTONE_DEFINITIONS: Array<{
  name: string;
  description: string;
}> = [
  {
    name: 'Requirements Collection',
    description:
      'Gathering business goals, brand assets, content inputs, and scope confirmation.',
  },
  {
    name: 'Planning',
    description:
      'Structuring project roadmap, sitemap or content calendar, and deliverable schedule.',
  },
  {
    name: 'UI/UX Design',
    description:
      'Designing visual layouts, brand styling, wireframes, and creative templates.',
  },
  {
    name: 'Development',
    description:
      'Building responsive pages, integrations, creatives, or campaign setups.',
  },
  {
    name: 'Review',
    description:
      'Internal quality inspection and stakeholder walkthrough for feedback.',
  },
  {
    name: 'Testing',
    description:
      'Cross-device responsiveness checks, link verification, and performance polish.',
  },
  {
    name: 'Delivery',
    description:
      'Final launch, account handover, documentation, and post-delivery walkthrough.',
  },
];

export function createDefaultMilestones(
  statuses?: MilestoneStatus[],
  assignedTeamId?: string
): Milestone[] {
  return STANDARD_MILESTONE_DEFINITIONS.map((def, idx) => {
    const status: MilestoneStatus = statuses?.[idx] ?? 'Not Started';
    return {
      id: `ms-${idx + 1}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: def.name,
      description: def.description,
      status,
      completionDate:
        status === 'Completed'
          ? new Date(Date.now() - (7 - idx) * 86400000).toISOString().slice(0, 10)
          : undefined,
      assignedTeamId,
      order: idx + 1,
    };
  });
}

export const INITIAL_SERVICES: ServiceItem[] = [
  // Website Services
  {
    id: 'srv-business-website',
    name: 'Business Website Development',
    category: 'Website Services',
    description:
      'Clean, mobile-friendly multi-page websites tailored to showcase your local business, services, and contact details.',
    deliverables: ['Responsive design', 'Contact & enquiry forms', 'Basic on-page SEO'],
    active: true,
  },
  {
    id: 'srv-ecommerce-website',
    name: 'E-commerce Website',
    category: 'Website Services',
    description:
      'Structured online storefronts with organized product catalogs, cart flows, and smooth customer ordering experiences.',
    deliverables: ['Product catalog setup', 'Cart & checkout flow', 'Order management layout'],
    active: true,
  },
  {
    id: 'srv-website-redesign',
    name: 'Website Redesign',
    category: 'Website Services',
    description:
      'Modernize outdated websites with stronger visual hierarchy, faster page structure, and mobile usability.',
    deliverables: ['UX audit', 'Modern visual refresh', 'Mobile responsiveness upgrade'],
    active: true,
  },
  {
    id: 'srv-landing-page',
    name: 'Landing Page Development',
    category: 'Website Services',
    description:
      'Focused single-page experiences built for specific promotions, admissions, seasonal offers, or lead capture.',
    deliverables: ['Conversion-focused layout', 'Lead capture form', 'Fast-loading structure'],
    active: true,
  },

  // Social Media
  {
    id: 'srv-social-management',
    name: 'Social Media Management',
    category: 'Social Media',
    description:
      'Consistent scheduling, profile optimization, and monthly content planning across your primary social channels.',
    deliverables: ['Monthly content calendar', 'Profile optimization', 'Consistent publishing'],
    active: true,
  },
  {
    id: 'srv-social-post-design',
    name: 'Social Media Post Design',
    category: 'Social Media',
    description:
      'Cohesive, brand-aligned graphic templates and promotional posts crafted for Instagram, Facebook, and WhatsApp updates.',
    deliverables: ['Custom branded creatives', 'Carousel & story layouts', 'Consistent typography'],
    active: true,
  },
  {
    id: 'srv-reels-editing',
    name: 'Reels and Video Editing',
    category: 'Social Media',
    description:
      'Engaging short-form vertical videos with clean cuts, captions, and pacing designed for local customer discovery.',
    deliverables: ['Short-form vertical edits', 'On-screen captions', 'Brand intro/outro'],
    active: true,
  },
  {
    id: 'srv-content-creation',
    name: 'Content Creation',
    category: 'Social Media',
    description:
      'Structured copywriting, visual storyboards, and campaign messaging tailored to your local audience.',
    deliverables: ['Caption & hook writing', 'Visual content concepts', 'Local campaign themes'],
    active: true,
  },

  // Digital Marketing
  {
    id: 'srv-seo',
    name: 'SEO Optimization',
    category: 'Digital Marketing',
    description:
      'Structured search optimization so nearby customers find your services when searching online.',
    deliverables: ['Local keyword mapping', 'Metadata & heading setup', 'Search console alignment'],
    active: true,
  },
  {
    id: 'srv-gbp',
    name: 'Google Business Profile Optimization',
    category: 'Digital Marketing',
    description:
      'Complete setup and refinement of your Google Maps & Search listing with categories, hours, photos, and updates.',
    deliverables: ['Profile verification support', 'Category & service setup', 'Photo & post guidelines'],
    active: true,
  },
  {
    id: 'srv-digital-ads',
    name: 'Digital Advertising',
    category: 'Digital Marketing',
    description:
      'Targeted local ad campaign setup on search and social platforms to drive store visits and enquiries.',
    deliverables: ['Audience targeting setup', 'Ad creative variations', 'Campaign structure'],
    active: true,
  },
  {
    id: 'srv-marketing-strategy',
    name: 'Marketing Strategy',
    category: 'Digital Marketing',
    description:
      'Actionable digital roadmap aligning your website, local search visibility, and social channels around business goals.',
    deliverables: ['Channel prioritization', '90-day growth roadmap', 'Funnel recommendations'],
    active: true,
  },

  // Additional Services
  {
    id: 'srv-logo-branding',
    name: 'Logo and Branding',
    category: 'Additional Services',
    description:
      'Distinctive logo marks, colour palettes, and brand guidelines that help your business look memorable everywhere.',
    deliverables: ['Primary & icon logos', 'Brand colour & font guide', 'Print & web formats'],
    active: true,
  },
  {
    id: 'srv-graphic-design',
    name: 'Graphic Design',
    category: 'Additional Services',
    description:
      'Clean flyers, posters, banners, and storefront promotional visuals ready for digital sharing or print.',
    deliverables: ['Print-ready flyers & posters', 'Digital banners', 'Cohesive visual assets'],
    active: true,
  },
  {
    id: 'srv-menu-design',
    name: 'Menu Design',
    category: 'Additional Services',
    description:
      'Readable, appetite-appealing digital and print menus structured for cafés, bakeries, and restaurants.',
    deliverables: ['Print & QR menu layouts', 'Category organization', 'Highlight callouts'],
    active: true,
  },
  {
    id: 'srv-swiggy-onboarding',
    name: 'Swiggy Onboarding Assistance',
    category: 'Additional Services',
    description:
      'Step-by-step guidance to prepare documents, menu structure, and listing details for Swiggy partner onboarding.',
    deliverables: ['Listing readiness checklist', 'Menu digitization support', 'Profile setup guidance'],
    active: true,
  },
  {
    id: 'srv-zomato-onboarding',
    name: 'Zomato Onboarding Assistance',
    category: 'Additional Services',
    description:
      'Organized assistance for setting up your restaurant listing, catalog items, and visual presentation on Zomato.',
    deliverables: ['Catalog structuring', 'Document checklist support', 'Listing optimization tips'],
    active: true,
  },
];

export const PACKAGE_PRESETS: PackagePreset[] = [
  {
    id: 'preset-starter',
    name: 'Starter',
    tagline: 'Essential Digital Foundation',
    description:
      'Built for local businesses taking their first structured step online with a credible website, Google Maps presence, and visual identity.',
    recommendedFor: 'New local shops, cafés, and service providers',
    serviceIds: [
      'srv-business-website',
      'srv-gbp',
      'srv-logo-branding',
      'srv-social-post-design',
    ],
  },
  {
    id: 'preset-growth',
    name: 'Growth',
    tagline: 'Consistent Visibility & Engagement',
    description:
      'Designed for growing businesses ready to pair a strong website with ongoing social content, local SEO, and lead generation.',
    recommendedFor: 'Salons, coaching institutes, clinics, and dining spots',
    serviceIds: [
      'srv-business-website',
      'srv-social-management',
      'srv-social-post-design',
      'srv-reels-editing',
      'srv-seo',
      'srv-gbp',
    ],
  },
  {
    id: 'preset-premium',
    name: 'Premium',
    tagline: 'Complete Multi-Channel Digital Drive',
    description:
      'Full-spectrum digital presence combining custom web experiences, video storytelling, targeted advertising, and strategic planning.',
    recommendedFor: 'Established local brands expanding across channels',
    serviceIds: [
      'srv-ecommerce-website',
      'srv-social-management',
      'srv-reels-editing',
      'srv-content-creation',
      'srv-seo',
      'srv-gbp',
      'srv-digital-ads',
      'srv-marketing-strategy',
      'srv-logo-branding',
    ],
  },
];

export function createSeedDatabase(): DatabaseState {
  const now = new Date();
  const daysAgo = (d: number) =>
    new Date(now.getTime() - d * 86400000).toISOString();
  const daysAhead = (d: number) =>
    new Date(now.getTime() + d * 86400000).toISOString().slice(0, 10);

  return {
    version: 1,
    users: [
      {
        id: 'usr-admin-1',
        name: 'LocalLift Operations Admin',
        email: 'admin@locallift.demo',
        password: 'Admin123!',
        role: 'admin',
        teamTitle: 'Agency Director (Demo)',
        isDemo: true,
        createdAt: daysAgo(45),
      },
      {
        id: 'usr-team-1',
        name: 'Aarav Mehta',
        email: 'team@locallift.demo',
        password: 'Team123!',
        role: 'team',
        teamTitle: 'Lead Web & UI Specialist',
        phone: '+91 90000 11223 (Demo)',
        isDemo: true,
        createdAt: daysAgo(40),
      },
      {
        id: 'usr-team-2',
        name: 'Priya Nair',
        email: 'priya@locallift.demo',
        password: 'Team123!',
        role: 'team',
        teamTitle: 'Social Media & Growth Strategist',
        phone: '+91 90000 44556 (Demo)',
        isDemo: true,
        createdAt: daysAgo(35),
      },
      {
        id: 'usr-client-1',
        name: 'Rohan Kapoor',
        email: 'client@locallift.demo',
        password: 'Client123!',
        role: 'client',
        businessName: 'Sunrise Café',
        businessCategory: 'Café, Bakery & Restaurant',
        phone: '+91 98000 10101 (Demo)',
        location: 'Indiranagar, Bengaluru',
        website: 'https://sunrisecafe.demo.example',
        socialLinks: '@sunrisecafe.demo',
        isDemo: true,
        createdAt: daysAgo(30),
      },
      {
        id: 'usr-client-2',
        name: 'Meera Deshmukh',
        email: 'meera@urbansalon.demo',
        password: 'Client123!',
        role: 'client',
        businessName: 'Urban Style Salon',
        businessCategory: 'Salon, Spa & Wellness',
        phone: '+91 98000 20202 (Demo)',
        location: 'Koregaon Park, Pune',
        socialLinks: '@urbanstylesalon.demo',
        isDemo: true,
        createdAt: daysAgo(24),
      },
      {
        id: 'usr-client-3',
        name: 'Vikram Joshi',
        email: 'vikram@brightpath.demo',
        password: 'Client123!',
        role: 'client',
        businessName: 'BrightPath Coaching',
        businessCategory: 'Coaching & Education',
        phone: '+91 98000 30303 (Demo)',
        location: 'Navrangpura, Ahmedabad',
        website: 'https://brightpath.demo.example',
        isDemo: true,
        createdAt: daysAgo(20),
      },
    ],
    services: INITIAL_SERVICES,
    enquiries: [
      {
        id: 'ENQ-1041',
        businessName: 'Sunrise Café',
        ownerName: 'Rohan Kapoor',
        email: 'client@locallift.demo',
        phone: '+91 98000 10101 (Demo)',
        businessCategory: 'Café, Bakery & Restaurant',
        location: 'Indiranagar, Bengaluru',
        existingWebsite: 'https://sunrisecafe.demo.example',
        socialMediaLinks: '@sunrisecafe.demo',
        selectedServiceIds: [
          'srv-business-website',
          'srv-menu-design',
          'srv-gbp',
          'srv-swiggy-onboarding',
        ],
        selectedServiceNames: [
          'Business Website Development',
          'Menu Design',
          'Google Business Profile Optimization',
          'Swiggy Onboarding Assistance',
        ],
        businessGoals: 'Increase neighborhood footfall and streamline online menu discovery.',
        projectRequirements:
          'Need a warm, inviting café website with an interactive digital menu, Google Maps optimization, and Swiggy listing preparation.',
        additionalMessage: 'Demo enquiry converted into an active project.',
        packageBase: 'Starter (Customized)',
        status: 'Converted',
        clientId: 'usr-client-1',
        convertedProjectId: 'PRJ-201',
        isDemo: true,
        createdAt: daysAgo(18),
        updatedAt: daysAgo(16),
      },
      {
        id: 'ENQ-1042',
        businessName: 'Urban Style Salon',
        ownerName: 'Meera Deshmukh',
        email: 'meera@urbansalon.demo',
        phone: '+91 98000 20202 (Demo)',
        businessCategory: 'Salon, Spa & Wellness',
        location: 'Koregaon Park, Pune',
        socialMediaLinks: '@urbanstylesalon.demo',
        selectedServiceIds: [
          'srv-social-management',
          'srv-reels-editing',
          'srv-landing-page',
        ],
        selectedServiceNames: [
          'Social Media Management',
          'Reels and Video Editing',
          'Landing Page Development',
        ],
        businessGoals: 'Attract weekend appointment bookings via Instagram Reels and a clean booking landing page.',
        projectRequirements:
          'Monthly Instagram reel templates, before/after showcase posts, and an appointment enquiry landing page.',
        packageBase: 'Growth (Customized)',
        status: 'Accepted',
        clientId: 'usr-client-2',
        isDemo: true,
        createdAt: daysAgo(5),
        updatedAt: daysAgo(3),
      },
      {
        id: 'ENQ-1043',
        businessName: 'BrightPath Coaching',
        ownerName: 'Vikram Joshi',
        email: 'vikram@brightpath.demo',
        phone: '+91 98000 30303 (Demo)',
        businessCategory: 'Coaching & Education',
        location: 'Navrangpura, Ahmedabad',
        existingWebsite: 'https://brightpath.demo.example',
        selectedServiceIds: [
          'srv-website-redesign',
          'srv-seo',
          'srv-digital-ads',
        ],
        selectedServiceNames: [
          'Website Redesign',
          'SEO Optimization',
          'Digital Advertising',
        ],
        businessGoals: 'Modernize student enquiry portal ahead of the upcoming batch intake.',
        projectRequirements:
          'Redesign existing static pages into a responsive mobile-first site with clear course details and parent enquiry forms.',
        status: 'Under Review',
        clientId: 'usr-client-3',
        isDemo: true,
        createdAt: daysAgo(2),
        updatedAt: daysAgo(1),
      },
      {
        id: 'ENQ-1044',
        businessName: 'GreenLeaf Organic Mart',
        ownerName: 'Ananya Verma',
        email: 'ananya@greenleaf.demo',
        phone: '+91 98000 40404 (Demo)',
        businessCategory: 'Retail & Local Store',
        location: 'Malviya Nagar, Jaipur',
        selectedServiceIds: [
          'srv-ecommerce-website',
          'srv-logo-branding',
          'srv-gbp',
        ],
        selectedServiceNames: [
          'E-commerce Website',
          'Logo and Branding',
          'Google Business Profile Optimization',
        ],
        businessGoals: 'Launch local neighborhood grocery ordering online.',
        projectRequirements:
          'Clean catalog for 80+ organic staples, brand logo refresh, and Google Business Profile setup.',
        additionalMessage: 'Demo incoming enquiry awaiting initial review.',
        packageBase: 'Custom Selection',
        status: 'New',
        isDemo: true,
        createdAt: daysAgo(0),
        updatedAt: daysAgo(0),
      },
    ],
    projects: [
      {
        id: 'PRJ-201',
        title: 'Sunrise Café Digital Presence & Menu Launch',
        clientId: 'usr-client-1',
        clientName: 'Rohan Kapoor',
        businessName: 'Sunrise Café',
        enquiryId: 'ENQ-1041',
        selectedServiceIds: [
          'srv-business-website',
          'srv-menu-design',
          'srv-gbp',
          'srv-swiggy-onboarding',
        ],
        selectedServiceNames: [
          'Business Website Development',
          'Menu Design',
          'Google Business Profile Optimization',
          'Swiggy Onboarding Assistance',
        ],
        assignedTeamIds: ['usr-team-1', 'usr-team-2'],
        status: 'Active',
        deadline: daysAhead(14),
        requirementsSummary:
          'Warm café website with mobile QR menu, Google Business Profile verification, and Swiggy menu catalog formatting.',
        pendingRequirements: [
          'High-resolution photos of signature breakfast items',
          'Updated Sunday café opening hours confirmation',
        ],
        milestones: [
          {
            id: 'ms-201-1',
            name: 'Requirements Collection',
            description:
              'Collected brand colors, café story, and initial beverage/food list.',
            status: 'Completed',
            completionDate: daysAgo(14).slice(0, 10),
            assignedTeamId: 'usr-team-1',
            order: 1,
          },
          {
            id: 'ms-201-2',
            name: 'Planning',
            description:
              'Finalized 5-page sitemap and QR menu category structure.',
            status: 'Completed',
            completionDate: daysAgo(11).slice(0, 10),
            assignedTeamId: 'usr-team-1',
            order: 2,
          },
          {
            id: 'ms-201-3',
            name: 'UI/UX Design',
            description:
              'Designed homepage hero, table-reservation section, and print/digital menu layout.',
            status: 'Completed',
            completionDate: daysAgo(6).slice(0, 10),
            assignedTeamId: 'usr-team-1',
            order: 3,
          },
          {
            id: 'ms-201-4',
            name: 'Development',
            description:
              'Building responsive website pages, interactive menu filter, and Swiggy catalog sheet.',
            status: 'In Progress',
            assignedTeamId: 'usr-team-1',
            order: 4,
          },
          {
            id: 'ms-201-5',
            name: 'Review',
            description:
              'Staging walkthrough with Sunrise Café team and Google Business checklist review.',
            status: 'Under Review',
            assignedTeamId: 'usr-team-2',
            order: 5,
          },
          {
            id: 'ms-201-6',
            name: 'Testing',
            description:
              'Mobile browser QA, menu PDF download checks, and map embed verification.',
            status: 'Not Started',
            assignedTeamId: 'usr-team-1',
            order: 6,
          },
          {
            id: 'ms-201-7',
            name: 'Delivery',
            description:
              'Production launch and handover walkthrough.',
            status: 'Not Started',
            assignedTeamId: 'usr-team-1',
            order: 7,
          },
        ],
        internalNotes:
          'Demo internal note: Client prefers warm morning photography and quick QR menu loading on 4G mobile networks.',
        isDemo: true,
        createdAt: daysAgo(16),
        updatedAt: daysAgo(1),
      },
      {
        id: 'PRJ-202',
        title: 'Sunrise Café Festive Brand & Zomato Setup',
        clientId: 'usr-client-1',
        clientName: 'Rohan Kapoor',
        businessName: 'Sunrise Café',
        selectedServiceIds: ['srv-logo-branding', 'srv-zomato-onboarding'],
        selectedServiceNames: ['Logo and Branding', 'Zomato Onboarding Assistance'],
        assignedTeamIds: ['usr-team-2'],
        status: 'Completed',
        deadline: daysAgo(3).slice(0, 10),
        requirementsSummary:
          'Refined café badge logo for packaging stickers and structured Zomato menu onboarding items.',
        pendingRequirements: [],
        milestones: createDefaultMilestones(
          [
            'Completed',
            'Completed',
            'Completed',
            'Completed',
            'Completed',
            'Completed',
            'Completed',
          ],
          'usr-team-2'
        ),
        internalNotes: 'Demo project marked completed for client overview demonstration.',
        isDemo: true,
        createdAt: daysAgo(28),
        updatedAt: daysAgo(4),
      },
      {
        id: 'PRJ-203',
        title: 'Urban Style Salon Social & Reels Campaign',
        clientId: 'usr-client-2',
        clientName: 'Meera Deshmukh',
        businessName: 'Urban Style Salon',
        selectedServiceIds: [
          'srv-social-management',
          'srv-social-post-design',
          'srv-reels-editing',
        ],
        selectedServiceNames: [
          'Social Media Management',
          'Social Media Post Design',
          'Reels and Video Editing',
        ],
        assignedTeamIds: ['usr-team-2'],
        status: 'Active',
        deadline: daysAhead(10),
        requirementsSummary:
          'Monthly Instagram visual grid refresh, 6 short styling reels, and highlight covers.',
        pendingRequirements: ['Raw clip uploads for hair-care reel #4'],
        milestones: createDefaultMilestones(
          [
            'Completed',
            'Completed',
            'In Progress',
            'Not Started',
            'Not Started',
            'Not Started',
            'Not Started',
          ],
          'usr-team-2'
        ),
        internalNotes: 'Demo note: Focus on natural lighting in salon transformation reels.',
        isDemo: true,
        createdAt: daysAgo(9),
        updatedAt: daysAgo(2),
      },
      {
        id: 'PRJ-204',
        title: 'BrightPath Coaching Admission Landing Page',
        clientId: 'usr-client-3',
        clientName: 'Vikram Joshi',
        businessName: 'BrightPath Coaching',
        selectedServiceIds: ['srv-landing-page', 'srv-seo'],
        selectedServiceNames: ['Landing Page Development', 'SEO Optimization'],
        assignedTeamIds: ['usr-team-1'],
        status: 'Pending',
        deadline: daysAhead(21),
        requirementsSummary:
          'Dedicated scholarship & batch admission landing page with local SEO schema.',
        pendingRequirements: [
          'Final batch schedule dates',
          'Faculty profile summaries',
        ],
        milestones: createDefaultMilestones(
          [
            'In Progress',
            'Not Started',
            'Not Started',
            'Not Started',
            'Not Started',
            'Not Started',
            'Not Started',
          ],
          'usr-team-1'
        ),
        internalNotes: 'Demo note: Awaiting batch timetable from client before UI/UX wireframe starts.',
        isDemo: true,
        createdAt: daysAgo(4),
        updatedAt: daysAgo(2),
      },
    ],
    projectUpdates: [
      {
        id: 'upd-1',
        projectId: 'PRJ-201',
        authorId: 'usr-team-1',
        authorName: 'Aarav Mehta',
        authorRole: 'team',
        title: 'Menu Layout & UI Design Approved',
        message:
          'Completed the café menu visual design and responsive homepage structure. Development of the interactive digital menu is now underway.',
        visibility: 'client',
        createdAt: daysAgo(3),
      },
      {
        id: 'upd-2',
        projectId: 'PRJ-201',
        authorId: 'usr-admin-1',
        authorName: 'LocalLift Operations Admin',
        authorRole: 'admin',
        title: 'Google Business Profile Checklist Ready',
        message:
          'Prepared your category tags and service highlights for Google Maps. Please confirm your Sunday hours when convenient.',
        visibility: 'client',
        createdAt: daysAgo(1),
      },
      {
        id: 'upd-3',
        projectId: 'PRJ-201',
        authorId: 'usr-team-1',
        authorName: 'Aarav Mehta',
        authorRole: 'team',
        title: 'Internal QA Prep',
        message: 'Swiggy CSV sheet validated against category rules; waiting on final beverage photos.',
        visibility: 'internal',
        createdAt: daysAgo(1),
      },
      {
        id: 'upd-4',
        projectId: 'PRJ-202',
        authorId: 'usr-admin-1',
        authorName: 'LocalLift Operations Admin',
        authorRole: 'admin',
        title: 'Project Delivered Successfully',
        message:
          'All brand badge files and Zomato onboarding checklists have been delivered to your account.',
        visibility: 'client',
        createdAt: daysAgo(4),
      },
    ],
    notifications: [
      {
        id: 'notif-1',
        userId: 'usr-client-1',
        title: 'Project Update: Sunrise Café Digital Presence',
        message:
          'Google Business Profile Checklist Ready — Please confirm your Sunday café hours.',
        type: 'info',
        read: false,
        link: '/client/projects',
        createdAt: daysAgo(1),
      },
      {
        id: 'notif-2',
        userId: 'usr-client-1',
        title: 'Milestone Completed: UI/UX Design',
        message:
          'UI/UX Design for Sunrise Café Digital Presence & Menu Launch has been marked Completed.',
        type: 'success',
        read: false,
        link: '/client/projects',
        createdAt: daysAgo(6),
      },
      {
        id: 'notif-3',
        userId: 'usr-team-1',
        title: 'Milestone Review Assigned',
        message:
          'You are assigned to Sunrise Café Digital Presence & Menu Launch (Development in progress).',
        type: 'info',
        read: false,
        link: '/team/projects',
        createdAt: daysAgo(2),
      },
    ],
    // IMPORTANT: Empty by default so Our Work shows the required stylish empty state
    portfolio: [],
    contactMessages: [],
  };
}
