// All site copy lives here. Content comes from Shradha's resume; do not add claims beyond it.

export const site = {
  name: "Shradha Thakur",
  shortName: "Shradha",
  role: "Software Developer",
  url: "https://setusher.github.io",
  description:
    "Shradha Thakur: software developer building AI and agentic systems. Electrical Engineering at IIT Roorkee.",
  email: "shradhath08@gmail.com",
  github: "https://github.com/setusher",
  // TODO(shradha): add LinkedIn profile URL. Links using it stay hidden while this is empty.
  linkedin: "",
  // TODO(shradha): drop the resume PDF at public/resume.pdf and set this to "/resume.pdf".
  resume: "",
};

export const nav = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
] as const;

export const about = {
  paragraphs: [
    "I'm a third-year Electrical Engineering student at IIT Roorkee (B.Tech, 2024 to 2028). I build products and agentic AI systems, from voice agents and RAG pipelines to the web apps people use every day.",
    "I'm a Project Associate at IMG, IIT Roorkee, where I work on campus enterprise apps, and I was an Executive Member of the ACM Student Chapter. I won silver medals at the 14th Inter-IIT Tech Meet (ISRO Geospatial problem statement) and at Hack-a-tone 2025, organized by IIT Delhi.",
  ],
  stats: [
    { value: 5000, suffix: "+", label: "students served" },
    { value: 3000, suffix: "+", label: "concurrent users scaled" },
    { value: 500, suffix: "+", label: "participants engaged" },
    { value: 2, suffix: "", label: "silver medals" },
  ],
};

export const skills = [
  {
    title: "AI/LLM & Agentic Systems",
    items: [
      "Gemini API",
      "LangChain",
      "FAISS (RAG)",
      "Hugging Face",
      "LiveKit",
      "Deepgram STT",
      "Cartesia TTS",
      "Tool integration",
    ],
  },
  {
    title: "Languages",
    items: ["Python", "C++", "JavaScript", "TypeScript", "SQL", "HTML/CSS", "Dart"],
  },
  {
    title: "Backend & APIs",
    items: ["Flask", "Node.js", "Express", "Nest.js", "REST API design", "Firebase (Auth/Firestore)"],
  },
  {
    title: "Frontend",
    items: ["React", "Next.js", "Flutter"],
  },
  {
    title: "Cloud & Tools",
    items: ["Git", "GitHub", "CI/CD pipelines", "Automated testing", "Leaflet"],
  },
];

export type Project = {
  name: string;
  period: string;
  tech: string[];
  bullets: string[];
  github?: string;
  live?: string;
};

export const projects: Project[] = [
  {
    name: "FeynLearn",
    period: "Sept to Oct 2026",
    tech: ["Next.js", "TypeScript", "Zod", "IndexedDB (Dexie)", "Tailwind CSS"],
    bullets: [
      "AI-driven learning platform applying the Feynman technique: 4 structured API endpoints with Zod validation and LLM fallbacks pinpoint knowledge gaps.",
      "Interactive concept dependency graphs, adversarial error-detection modules and an SM-2 spaced repetition scheduler, with client-side IndexedDB storage for total privacy.",
    ],
    github: "https://github.com/setusher/FeynLearn",
    live: "https://feyn-learn.vercel.app",
  },
  {
    name: "SnapCove",
    period: "Dec 2025 to Jan 2026",
    tech: ["React", "Django REST", "Celery", "Redis", "PyTorch", "PostgreSQL"],
    bullets: [
      "Role-based campus event photo platform with async Celery/Redis pipelines for EXIF extraction, AI content tagging and auto-watermarking.",
      "Multi-tier RBAC, multi-stage moderation (Upload, AI Processing, Approval) and real-time notifications.",
    ],
    github: "https://github.com/setusher/SnapCove",
  },
  {
    name: "ShySnap",
    period: "Jun to Jul 2025",
    tech: ["Flutter", "Dart", "OpenCV", "Python", "Flask", "Firebase ML Kit"],
    bullets: [
      "Privacy-focused campus social app with real-time on-device face detection and auto-blurring.",
      "Firebase Auth/Firestore plus a Flask backend for server-side image processing.",
    ],
    // TODO(shradha): the repo (setusher/Face-Blur-Snap-Sharing-App) is private, so no link is shown.
  },
];

export const experience = [
  {
    org: "Lexsi Labs",
    role: "Dev Rel Intern",
    place: "Remote",
    period: "Oct 2026 to Present",
    bullets: [
      "Open-source starter kits, SDK code samples and interactive AI demos for developer onboarding.",
      "Technical API docs and guides for LLM workflows.",
      "Triaged community issues and funneled DX feedback to core engineering.",
    ],
  },
  {
    org: "Google",
    role: "Associate Software Developer Intern",
    place: "Bengaluru",
    period: "May to Jul 2026",
    bullets: [
      "AI root-cause analysis tool for production incidents.",
      "Continuous release pipeline for high-traffic core services.",
      "Backend reliability via automated blocking signals and test suites, cutting integration failures.",
    ],
  },
  {
    org: "GydeXP",
    role: "Technical Support Intern",
    place: "Remote",
    period: "Aug to Dec 2025",
    bullets: [
      "Agentic voice and WhatsApp booking agents (Python, LiveKit, Gemini APIs).",
      "Low-latency multilingual telephony pipelines with Deepgram STT and Cartesia TTS.",
      "Next.js + Nest.js operational dashboards.",
    ],
  },
];
