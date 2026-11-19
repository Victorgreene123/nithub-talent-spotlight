import { TalentProfile } from "@/types/talent";

export const MOCK_TALENT_DATA: TalentProfile[] = [
  {
    id: "b1a7e8c0-1111-4f2b-9a10-000000000001",
    full_name: "Adeola Olaniyan",
    avatar_url: null,
    track: "fullstack",
    availability_status: "available_now",
    cohort_year: 2025,
    is_verified: true,
    bio: "Fullstack developer focused on building practical business software for retail, healthcare, and local merchants. I care about clean database design, fast page loads on mobile networks, and interfaces that staff can use without training.",
    github_url: "https://github.com/example-adeola",
    linkedin_url: "https://linkedin.com/in/example-adeola",
    x_url: "https://x.com/example_adeola",
    top_project: {
      id: "p-001",
      title: "MedShelf Pharmacy Inventory",
      tagline:
        "Helps independent pharmacies in Lagos track medicine stock levels and receive early alerts before batches expire.",
      tech_stack: ["Next.js", "TypeScript", "PostgreSQL", "Tailwind CSS"],
      live_url: "https://medshelf-demo.example.com",
      repo_url: "https://github.com/example/medshelf",
      thumbnail_url: "/projects/medshelf.svg",
    },
    projects: [
      {
        id: "p-001",
        position: 1,
        title: "MedShelf Pharmacy Inventory",
        tagline:
          "Helps independent pharmacies in Lagos track medicine stock levels and receive early alerts before batches expire. Built after interviewing three community pharmacists in Yaba who were losing stock to manual paper logs.",
        tech_stack: ["Next.js", "TypeScript", "PostgreSQL", "Tailwind CSS"],
        live_url: "https://medshelf-demo.example.com",
        repo_url: "https://github.com/example/medshelf",
        thumbnail_url: "/projects/medshelf.svg",
      },
      {
        id: "p-102",
        position: 2,
        title: "ShiftRoster Clinic Scheduler",
        tagline:
          "A lightweight shift-planning tool for outpatient clinics that lets nurses swap duty hours and automatically notifies the head matron by email.",
        tech_stack: ["React", "Node.js", "PostgreSQL", "Resend"],
        live_url: "https://shiftroster-demo.example.com",
        repo_url: "https://github.com/example/shiftroster",
        thumbnail_url: "/projects/koboinvoice.svg",
      },
      {
        id: "p-103",
        position: 3,
        title: "WaybillVerify Delivery Portal",
        tagline:
          "Allows small e-commerce sellers to generate tamper-evident delivery PINs so dispatch riders only close an order when the buyer confirms receipt.",
        tech_stack: ["Next.js", "Supabase", "TypeScript"],
        live_url: "https://waybillverify.example.com",
        repo_url: "https://github.com/example/waybill-verify",
        thumbnail_url: "/projects/splitpay.svg",
      },
    ],
  },
  {
    id: "b1a7e8c0-2222-4f2b-9a10-000000000002",
    full_name: "Chinedu Okafor",
    avatar_url: null,
    track: "backend",
    availability_status: "available_now",
    cohort_year: 2025,
    is_verified: true,
    bio: "Backend engineer experienced with payment integrations, ledger reconciliation, and reliable background queues. I enjoy turning messy financial workflows into predictable, well-tested APIs.",
    github_url: "https://github.com/example-chinedu",
    linkedin_url: "https://linkedin.com/in/example-chinedu",
    x_url: null,
    top_project: {
      id: "p-002",
      title: "SplitPay Cooperative Ledger",
      tagline:
        "An automated bookkeeping and payout service for workplace thrift and savings cooperatives with bank webhook reconciliation.",
      tech_stack: ["Node.js", "PostgreSQL", "Redis", "Docker"],
      live_url: "https://splitpay-demo.example.com",
      repo_url: "https://github.com/example/splitpay-ledger",
      thumbnail_url: "/projects/splitpay.svg",
    },
    projects: [
      {
        id: "p-002",
        position: 1,
        title: "SplitPay Cooperative Ledger",
        tagline:
          "An automated bookkeeping and payout service for workplace thrift and savings cooperatives with bank webhook reconciliation. Eliminates end-of-month spreadsheet errors for cooperative treasurers.",
        tech_stack: ["Node.js", "PostgreSQL", "Redis", "Docker"],
        live_url: "https://splitpay-demo.example.com",
        repo_url: "https://github.com/example/splitpay-ledger",
        thumbnail_url: "/projects/splitpay.svg",
      },
      {
        id: "p-202",
        position: 2,
        title: "WebhookGuard Retry Proxy",
        tagline:
          "A lightweight service that buffers incoming payment webhooks during database maintenance windows and replays them in order with idempotency checks.",
        tech_stack: ["Node.js", "Redis", "TypeScript", "Docker"],
        live_url: "https://webhookguard.example.com",
        repo_url: "https://github.com/example/webhook-guard",
        thumbnail_url: "/projects/medshelf.svg",
      },
    ],
  },
  {
    id: "b1a7e8c0-3333-4f2b-9a10-000000000003",
    full_name: "Zainab Abdullahi",
    avatar_url: null,
    track: "uiux",
    availability_status: "open_to_gigs",
    cohort_year: 2025,
    is_verified: true,
    bio: "Product designer who starts every project by talking to real users. I design clear, accessible mobile and web interfaces and hand off well-organized component systems that developers love building.",
    github_url: null,
    linkedin_url: "https://linkedin.com/in/example-zainab",
    x_url: "https://x.com/example_zainab",
    top_project: {
      id: "p-003",
      title: "LagBus Commuter Companion",
      tagline:
        "Redesigned route planner and fare calculator built for daily BRT commuters, tested with 40 local riders for clarity.",
      tech_stack: ["Figma", "Prototyping", "User Research", "Design Systems"],
      live_url: "https://figma.com/@example-lagbus",
      repo_url: "https://github.com/example/lagbus-case-study",
      thumbnail_url: "/projects/lagbus.svg",
    },
    projects: [
      {
        id: "p-003",
        position: 1,
        title: "LagBus Commuter Companion",
        tagline:
          "Redesigned route planner and fare calculator built for daily BRT commuters, tested with 40 local riders for clarity. Reduced the steps needed to check Cowry card fare balances from six taps to two.",
        tech_stack: ["Figma", "Prototyping", "User Research", "Design Systems"],
        live_url: "https://figma.com/@example-lagbus",
        repo_url: "https://github.com/example/lagbus-case-study",
        thumbnail_url: "/projects/lagbus.svg",
      },
      {
        id: "p-302",
        position: 2,
        title: "Kura Merchant POS Design System",
        tagline:
          "A high-contrast component library for Android POS terminals used outdoors in bright sunlight by market agents.",
        tech_stack: ["Figma", "Design Systems", "Accessibility"],
        live_url: "https://figma.com/@example-kura-pos",
        repo_url: "https://github.com/example/kura-pos-tokens",
        thumbnail_url: "/projects/koboinvoice.svg",
      },
    ],
  },
  {
    id: "b1a7e8c0-4444-4f2b-9a10-000000000004",
    full_name: "Tobiloba Adebayo",
    avatar_url: null,
    track: "frontend",
    availability_status: "available_now",
    cohort_year: 2025,
    is_verified: true,
    bio: "Frontend engineer passionate about responsive web apps, offline-first browser storage, and crisp typography. I turn complex workflows into fast, approachable interfaces.",
    github_url: "https://github.com/example-tobiloba",
    linkedin_url: "https://linkedin.com/in/example-tobiloba",
    x_url: "https://x.com/example_tobiloba",
    top_project: {
      id: "p-004",
      title: "KoboInvoice Studio",
      tagline:
        "A fast browser-based invoice generator for freelancers that exports clean PDFs and works offline on slow connections.",
      tech_stack: ["React", "TypeScript", "Tailwind CSS", "IndexedDB"],
      live_url: "https://koboinvoice.example.com",
      repo_url: "https://github.com/example/koboinvoice",
      thumbnail_url: "/projects/koboinvoice.svg",
    },
    projects: [
      {
        id: "p-004",
        position: 1,
        title: "KoboInvoice Studio",
        tagline:
          "A fast browser-based invoice generator for freelancers that exports clean PDFs and works offline on slow connections. Stores client templates locally so users never lose a draft when data drops.",
        tech_stack: ["React", "TypeScript", "Tailwind CSS", "IndexedDB"],
        live_url: "https://koboinvoice.example.com",
        repo_url: "https://github.com/example/koboinvoice",
        thumbnail_url: "/projects/koboinvoice.svg",
      },
      {
        id: "p-402",
        position: 2,
        title: "UnilagHostel Room Finder",
        tagline:
          "An interactive campus map and hostel availability board that helps returning students compare verified off-campus accommodation around Akoka.",
        tech_stack: ["Next.js", "TypeScript", "Tailwind CSS"],
        live_url: "https://unilaghostel.example.com",
        repo_url: "https://github.com/example/unilag-hostel",
        thumbnail_url: "/projects/lagbus.svg",
      },
    ],
  },
  {
    id: "b1a7e8c0-5555-4f2b-9a10-000000000005",
    full_name: "Kelechi Nwachukwu",
    avatar_url: null,
    track: "mobile",
    availability_status: "open_to_gigs",
    cohort_year: 2024,
    is_verified: true,
    bio: "Mobile engineer building dependable Android and iOS apps in Flutter. I focus on offline sync, low battery usage, and smooth performance on budget smartphones.",
    github_url: "https://github.com/example-kelechi",
    linkedin_url: "https://linkedin.com/in/example-kelechi",
    x_url: null,
    top_project: {
      id: "p-005",
      title: "FreshDirect Cold-Chain Tracker",
      tagline:
        "An Android app for agricultural produce drivers to log delivery checkpoints and temperature readings without steady data.",
      tech_stack: ["Flutter", "Dart", "SQLite", "Firebase"],
      live_url: "https://freshdirect-app.example.com",
      repo_url: "https://github.com/example/freshdirect-mobile",
      thumbnail_url: "/projects/freshdirect.svg",
    },
    projects: [
      {
        id: "p-005",
        position: 1,
        title: "FreshDirect Cold-Chain Tracker",
        tagline:
          "An Android app for agricultural produce drivers to log delivery checkpoints and temperature readings without steady data. Queues logs in SQLite along highways and syncs automatically upon reaching town.",
        tech_stack: ["Flutter", "Dart", "SQLite", "Firebase"],
        live_url: "https://freshdirect-app.example.com",
        repo_url: "https://github.com/example/freshdirect-mobile",
        thumbnail_url: "/projects/freshdirect.svg",
      },
      {
        id: "p-502",
        position: 2,
        title: "MeterSnap Utility Reader",
        tagline:
          "A mobile companion for estate facility managers to photograph prepaid meter readings and generate monthly power consumption summaries.",
        tech_stack: ["Flutter", "Dart", "SQLite"],
        live_url: "https://metersnap.example.com",
        repo_url: "https://github.com/example/metersnap",
        thumbnail_url: "/projects/lagbus.svg",
      },
    ],
  },
  {
    id: "b1a7e8c0-6666-4f2b-9a10-000000000006",
    full_name: "Favour Osagie",
    avatar_url: null,
    track: "aiml",
    availability_status: "in_cohort",
    cohort_year: 2025,
    is_verified: true,
    bio: "AI and data builder focused on practical computer vision and language tools tailored for Nigerian agriculture and local customer support.",
    github_url: "https://github.com/example-favour",
    linkedin_url: "https://linkedin.com/in/example-favour",
    x_url: "https://x.com/example_favour",
    top_project: {
      id: "p-006",
      title: "CassavaLeaf Disease Detector",
      tagline:
        "A lightweight image classification tool that helps extension workers identify common crop infections from phone photos.",
      tech_stack: ["Python", "PyTorch", "FastAPI", "React"],
      live_url: "https://cassavaleaf.example.com",
      repo_url: "https://github.com/example/cassava-detector",
      thumbnail_url: "/projects/cassavaleaf.svg",
    },
    projects: [
      {
        id: "p-006",
        position: 1,
        title: "CassavaLeaf Disease Detector",
        tagline:
          "A lightweight image classification tool that helps extension workers identify common crop infections from phone photos. Trained on 6,000 field images and optimized to run under 150ms per photo.",
        tech_stack: ["Python", "PyTorch", "FastAPI", "React"],
        live_url: "https://cassavaleaf.example.com",
        repo_url: "https://github.com/example/cassava-detector",
        thumbnail_url: "/projects/cassavaleaf.svg",
      },
    ],
  },
  {
    id: "b1a7e8c0-7777-4f2b-9a10-000000000007",
    full_name: "Oluwaseun Balogun",
    avatar_url: null,
    track: "hardware",
    availability_status: "available_now",
    cohort_year: 2025,
    is_verified: true,
    bio: "Embedded systems and hardware engineer designing custom KiCad PCBs, ESP32 firmware, and reliable telemetry devices for power and industrial monitoring.",
    github_url: "https://github.com/example-oluwaseun",
    linkedin_url: "https://linkedin.com/in/example-oluwaseun",
    x_url: null,
    top_project: {
      id: "p-007",
      title: "SolarSense Smart Inverter Monitor",
      tagline:
        "An ESP32 and custom PCB module that monitors solar battery health, sheds heavy loads automatically, and sends SMS fault alerts.",
      tech_stack: ["Embedded C++", "ESP32", "KiCad PCB", "MQTT"],
      live_url: "https://solarsense-demo.example.com",
      repo_url: "https://github.com/example/solarsense-hardware",
      thumbnail_url: "/projects/solarmeter.svg",
    },
    projects: [
      {
        id: "p-007",
        position: 1,
        title: "SolarSense Smart Inverter Monitor",
        tagline:
          "An ESP32 and custom PCB module that monitors solar battery health, sheds heavy loads automatically, and sends SMS fault alerts. Designed on a 2-layer KiCad board with a 3D-printed DIN rail enclosure.",
        tech_stack: ["Embedded C++", "ESP32", "KiCad PCB", "MQTT"],
        live_url: "https://solarsense-demo.example.com",
        repo_url: "https://github.com/example/solarsense-hardware",
        thumbnail_url: "/projects/solarmeter.svg",
      },
      {
        id: "p-702",
        position: 2,
        title: "AquaLevel Borehole Pump Controller",
        tagline:
          "An ultrasonic water-level sensor and relay unit that prevents dry-running damage on residential borehole pumps and logs daily tank usage.",
        tech_stack: ["Embedded C++", "ESP32", "KiCad PCB"],
        live_url: "https://aqualevel-demo.example.com",
        repo_url: "https://github.com/example/aqualevel-controller",
        thumbnail_url: "/projects/freshdirect.svg",
      },
    ],
  },
  {
    id: "b1a7e8c0-8888-4f2b-9a10-000000000008",
    full_name: "Halima Suleiman",
    avatar_url: null,
    track: "pm",
    availability_status: "available_now",
    cohort_year: 2025,
    is_verified: true,
    bio: "Product manager focused on customer discovery, clear PRDs, and measurable rollout outcomes. I work closely with engineers and designers to ship features that solve real operational bottlenecks.",
    github_url: null,
    linkedin_url: "https://linkedin.com/in/example-halima",
    x_url: "https://x.com/example_halima",
    top_project: {
      id: "p-008",
      title: "EduFlex School Fee Installments",
      tagline:
        "Led discovery with 28 parents and 6 school bursars to launch a split-tuition payment flow that cut manual reconciliation from 4 days to 2 hours.",
      tech_stack: ["Product Strategy", "PRDs", "User Research", "SQL"],
      live_url: "https://eduflex-case-study.example.com",
      repo_url: "https://github.com/example/eduflex-product-spec",
      thumbnail_url: "/projects/edupay-prd.svg",
    },
    projects: [
      {
        id: "p-008",
        position: 1,
        title: "EduFlex School Fee Installments",
        tagline:
          "Led discovery with 28 parents and 6 school bursars to launch a split-tuition payment flow that cut manual reconciliation from 4 days to 2 hours. Onboarded 12 pilot schools in the first term.",
        tech_stack: ["Product Strategy", "PRDs", "User Research", "SQL"],
        live_url: "https://eduflex-case-study.example.com",
        repo_url: "https://github.com/example/eduflex-product-spec",
        thumbnail_url: "/projects/edupay-prd.svg",
      },
      {
        id: "p-802",
        position: 2,
        title: "MedShelf Pharmacist Onboarding & Retention",
        tagline:
          "Defined the CSV stock-import workflow and WhatsApp expiry reminder cadence that improved week-4 pharmacist retention from 41% to 78%.",
        tech_stack: ["Product Strategy", "User Research", "SQL"],
        live_url: "https://medshelf-pm-case.example.com",
        repo_url: "https://github.com/example/medshelf-pm-spec",
        thumbnail_url: "/projects/medshelf.svg",
      },
    ],
  },
];

export const ALL_STACK_TAGS: string[] = Array.from(
  new Set(
    MOCK_TALENT_DATA.flatMap((person) =>
      person.projects.flatMap((proj) => proj.tech_stack)
    )
  )
).sort();

export function getTalentProfileById(id: string): TalentProfile | null {
  const found = MOCK_TALENT_DATA.find((t) => t.id === id);
  if (!found || !found.is_verified || found.projects.length === 0) {
    return null;
  }
  return found;
}

import {
  AdminCandidateProfile,
  AdminHiringRequest,
  InternAccountProfile,
  InternIntroductionRequest,
} from "@/types/talent";

export const INITIAL_RETURNING_INTERN: InternAccountProfile = {
  ...MOCK_TALENT_DATA[0],
  email: "adeola.olaniyan@intern.nithub.unilag.edu.ng",
  phone: "+234 803 412 8890",
  consented_at: "2026-10-14T10:30:00Z",
  projects: MOCK_TALENT_DATA[0].projects.slice(0, 2),
};

export const INITIAL_NEW_INTERN: InternAccountProfile = {
  id: "b1a7e8c0-9999-4f2b-9a10-000000000099",
  full_name: "Moyinoluwa Adeyemi",
  email: "moyin.adeyemi@gmail.com",
  phone: "",
  avatar_url: null,
  track: "fullstack",
  availability_status: "available_now",
  cohort_year: 2026,
  is_verified: false,
  consented_at: null,
  bio: "",
  github_url: "",
  linkedin_url: "",
  x_url: "",
  top_project: {
    id: "p-empty",
    title: "",
    tagline: "",
    tech_stack: [],
    live_url: "",
    repo_url: "",
    thumbnail_url: null,
  },
  projects: [],
};

export const INITIAL_INTERN_INTRODUCTIONS: InternIntroductionRequest[] = [
  {
    id: "intro-001",
    company_name: "Moniepoint",
    engagement_type: "Full-time role",
    role_notes:
      "We are expanding our merchant inventory and business banking web dashboard team in Lagos and looking for a fullstack engineer comfortable with Next.js, TypeScript, and PostgreSQL.",
    specific_note:
      "Impressed by your MedShelf Pharmacy Inventory batch-expiry alert workflow—very similar to what we are building for retail merchants.",
    sent_by_admin_at: "Today, 10:15 AM",
    consent_status: "pending",
  },
  {
    id: "intro-002",
    company_name: "Helium Health",
    engagement_type: "Paid internship",
    role_notes:
      "Looking for a product-minded fullstack intern to join our clinic operations squad for a 6-month paid placement with potential conversion to full-time.",
    specific_note:
      "We saw both MedShelf and your ShiftRoster Clinic Scheduler and would love to schedule a 20-minute intro chat this week.",
    sent_by_admin_at: "Yesterday",
    consent_status: "pending",
  },
  {
    id: "intro-003",
    company_name: "Sterling Retail Labs",
    engagement_type: "Contract / freelance project",
    role_notes:
      "Need an engineer for an 8-week supplier portal build with clean invoice and stock reconciliation.",
    specific_note: "Would like to discuss availability for a Q1 contract.",
    sent_by_admin_at: "Nov 14, 2026",
    consent_status: "accepted",
    responded_at: "Nov 14, 2026",
  },
];

export const INITIAL_ADMIN_PROFILES: AdminCandidateProfile[] = [
  // 3 Pending Profiles (sorted oldest first: submitted_order 1, 2, 3)
  {
    id: "b1a7e8c0-p111-4f2b-9a10-000000000101",
    full_name: "Damilola Ogunleye",
    email: "damilola.ogunleye@student.unilag.edu.ng",
    phone: "+234 809 331 4402",
    avatar_url: null,
    track: "frontend",
    availability_status: "available_now",
    cohort_year: 2025,
    is_verified: false,
    consented_at: "2026-11-16T09:15:00Z",
    submitted_at_label: "Submitted 3 days ago",
    submitted_order: 1,
    bio: "Frontend engineer focused on accessible React interfaces and fast-loading web apps for campus merchants and logistics teams.",
    github_url: "https://github.com/example-damilola",
    linkedin_url: "https://linkedin.com/in/example-damilola",
    x_url: null,
    top_project: {
      id: "p-901",
      title: "YabaMarket Price Watch",
      tagline:
        "Crowdsourced daily staple food price tracker across four Lagos markets with weekly inflation trend charts.",
      tech_stack: ["Next.js", "TypeScript", "Tailwind CSS"],
      live_url: "https://yabamarket-demo.example.com",
      repo_url: "https://github.com/example/yabamarket-watch",
      thumbnail_url: "/projects/koboinvoice.svg",
    },
    projects: [
      {
        id: "p-901",
        position: 1,
        title: "YabaMarket Price Watch",
        tagline:
          "Crowdsourced daily staple food price tracker across four Lagos markets with weekly inflation trend charts.",
        tech_stack: ["Next.js", "TypeScript", "Tailwind CSS"],
        live_url: "https://yabamarket-demo.example.com",
        repo_url: "https://github.com/example/yabamarket-watch",
        thumbnail_url: "/projects/koboinvoice.svg",
      },
    ],
  },
  {
    id: "b1a7e8c0-p222-4f2b-9a10-000000000102",
    full_name: "Ibrahim Musa",
    email: "ibrahim.musa@student.unilag.edu.ng",
    phone: "+234 802 719 5510",
    avatar_url: null,
    track: "backend",
    availability_status: "open_to_gigs",
    cohort_year: 2025,
    is_verified: false,
    consented_at: "2026-11-17T14:20:00Z",
    submitted_at_label: "Submitted 2 days ago",
    submitted_order: 2,
    bio: "Backend developer building clean REST APIs, webhook verification services, and automated reconciliation workers in Node.js and PostgreSQL.",
    github_url: "https://github.com/example-ibrahim",
    linkedin_url: "https://linkedin.com/in/example-ibrahim",
    x_url: "https://x.com/example_ibrahim",
    top_project: {
      id: "p-902",
      title: "NairaAlert SMS Gateway Queue",
      tagline:
        "High-throughput notification queue that routes transactional alerts across backup SMS providers when primary telco routes lag.",
      tech_stack: ["Node.js", "PostgreSQL", "Redis", "Docker"],
      live_url: "https://nairaalert-demo.example.com",
      repo_url: "https://github.com/example/nairaalert-queue",
      thumbnail_url: "/projects/splitpay.svg",
    },
    projects: [
      {
        id: "p-902",
        position: 1,
        title: "NairaAlert SMS Gateway Queue",
        tagline:
          "High-throughput notification queue that routes transactional alerts across backup SMS providers when primary telco routes lag.",
        tech_stack: ["Node.js", "PostgreSQL", "Redis", "Docker"],
        live_url: "https://nairaalert-demo.example.com",
        repo_url: "https://github.com/example/nairaalert-queue",
        thumbnail_url: "/projects/splitpay.svg",
      },
      {
        id: "p-903",
        position: 2,
        title: "TermFee Receipt Verifier",
        tagline:
          "API service that verifies bank NIP session IDs for school bursaries and issues signed PDF receipts.",
        tech_stack: ["Node.js", "TypeScript", "PostgreSQL"],
        live_url: "https://termfee-api.example.com",
        repo_url: "https://github.com/example/termfee-verifier",
        thumbnail_url: "/projects/medshelf.svg",
      },
    ],
  },
  {
    id: "b1a7e8c0-p333-4f2b-9a10-000000000103",
    full_name: "Chidinma Eze",
    email: "chidinma.eze@student.unilag.edu.ng",
    phone: "+234 813 604 1920",
    avatar_url: null,
    track: "hardware",
    availability_status: "available_now",
    cohort_year: 2025,
    is_verified: false,
    consented_at: "2026-11-18T16:45:00Z",
    submitted_at_label: "Submitted yesterday",
    submitted_order: 3,
    bio: "Hardware and embedded systems intern building low-power environmental and cold-storage telemetry nodes with ESP32 and LoRa.",
    github_url: "https://github.com/example-chidinma",
    linkedin_url: "https://linkedin.com/in/example-chidinma",
    x_url: null,
    top_project: {
      id: "p-904",
      title: "ColdBox Vaccine Carrier Logger",
      tagline:
        "Battery-powered temperature and lid-open logger for rural immunization carriers with OLED readout and USB CSV export.",
      tech_stack: ["Embedded C++", "ESP32", "KiCad PCB"],
      live_url: "https://coldbox-logger.example.com",
      repo_url: "https://github.com/example/coldbox-hardware",
      thumbnail_url: "/projects/solarmeter.svg",
    },
    projects: [
      {
        id: "p-904",
        position: 1,
        title: "ColdBox Vaccine Carrier Logger",
        tagline:
          "Battery-powered temperature and lid-open logger for rural immunization carriers with OLED readout and USB CSV export.",
        tech_stack: ["Embedded C++", "ESP32", "KiCad PCB"],
        live_url: "https://coldbox-logger.example.com",
        repo_url: "https://github.com/example/coldbox-hardware",
        thumbnail_url: "/projects/solarmeter.svg",
      },
    ],
  },
  // Approved Profiles from MOCK_TALENT_DATA
  ...MOCK_TALENT_DATA.map((talent, index) => ({
    ...talent,
    email: `${talent.full_name
      .toLowerCase()
      .replace(/\s+/g, ".")}@intern.nithub.unilag.edu.ng`,
    phone: `+234 803 500 100${index + 1}`,
    consented_at: "2026-10-12T10:00:00Z",
    submitted_at_label: `Approved Oct ${12 + index}, 2026`,
    submitted_order: 10 + index,
  })),
];

export const INITIAL_ADMIN_REQUESTS: AdminHiringRequest[] = [
  {
    id: "req-101",
    company_name: "Moniepoint",
    contact_email: "talent@moniepoint.com",
    contact_phone: "+234 809 111 2233",
    engagement_type: "Full-time role",
    notes:
      "We are expanding our merchant inventory and business banking dashboard squad in Lagos. Looking for builders who have shipped data-heavy products and can join full-time next month.",
    created_at_label: "Today, 09:40 AM",
    created_order: 3,
    notified_at: "2026-11-19T09:40:05Z",
    candidates: [
      {
        intern_id: "b1a7e8c0-1111-4f2b-9a10-000000000001", // Adeola Olaniyan
        specific_note:
          "Impressed by your MedShelf Pharmacy Inventory batch-expiry alert workflow.",
        forward_status: "pending_consent",
        forwarded_at: "Today, 10:15 AM",
      },
      {
        intern_id: "b1a7e8c0-2222-4f2b-9a10-000000000002", // Chinedu Okafor
        specific_note:
          "Interested in your SplitPay webhook reconciliation architecture for our settlement team.",
        forward_status: "accepted",
        forwarded_at: "Today, 10:15 AM",
        responded_at: "Today, 11:02 AM",
      },
      {
        intern_id: "b1a7e8c0-8888-4f2b-9a10-000000000008", // Halima Suleiman
        specific_note:
          "Loved the EduFlex checkout funnel discovery case study.",
        forward_status: "not_sent",
      },
    ],
  },
  {
    id: "req-102",
    company_name: "Helium Health",
    contact_email: "hiring@heliumhealth.com",
    contact_phone: "+234 803 444 9900",
    engagement_type: "Paid internship",
    notes:
      "Looking for two product-minded interns (Fullstack and Product Design) for a 6-month paid clinical software placement in Yaba with conversion to full-time.",
    created_at_label: "Yesterday, 4:15 PM",
    created_order: 2,
    notified_at: "2026-11-18T16:15:02Z",
    candidates: [
      {
        intern_id: "b1a7e8c0-1111-4f2b-9a10-000000000001", // Adeola Olaniyan
        specific_note:
          "We saw both MedShelf and ShiftRoster Clinic Scheduler and would love to chat.",
        forward_status: "pending_consent",
        forwarded_at: "Yesterday",
      },
      {
        intern_id: "b1a7e8c0-3333-4f2b-9a10-000000000003", // Zainab Abdullahi
        specific_note:
          "Your commuter usability testing with 40 local riders stood out to our design lead.",
        forward_status: "accepted",
        forwarded_at: "Yesterday",
        responded_at: "Yesterday, 6:10 PM",
      },
    ],
  },
  {
    id: "req-103",
    company_name: "Arnergy Solar Systems",
    contact_email: "engineering@arnergy.com",
    contact_phone: "+234 805 700 8811",
    engagement_type: "Full-time role",
    notes:
      "Hiring an embedded hardware engineer and a mobile developer to work on our next-generation solar inverter telemetry module and field technician Android app.",
    created_at_label: "2 days ago",
    created_order: 1,
    notified_at: null, // Demonstrates failed email provider alert (Acceptance Criteria #10)
    candidates: [
      {
        intern_id: "b1a7e8c0-7777-4f2b-9a10-000000000007", // Oluwaseun Balogun (Hardware)
        specific_note:
          "Your SolarSense ESP32 + KiCad PCB module is right in line with our inverter monitor.",
        forward_status: "not_sent",
      },
      {
        intern_id: "b1a7e8c0-5555-4f2b-9a10-000000000005", // Kelechi Nwachukwu (Mobile)
        specific_note:
          "Need your offline SQLite sync experience for our field installation technicians.",
        forward_status: "declined",
        forwarded_at: "2 days ago",
        responded_at: "Yesterday",
        decline_reason:
          "Currently committed to an ongoing cold-chain contract through December.",
      },
    ],
  },
];
