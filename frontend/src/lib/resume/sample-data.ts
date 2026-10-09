import { ResumeData } from "./types";

export const SAMPLE_RESUME_DATA: ResumeData = {
  personalInfo: {
    fullName: "Alex V. Chen",
    headline: "AI & Full-Stack Systems Engineer",
    email: "alex.chen.dev@example.com",
    phone: "+1 (555) 234-5678",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/alex-v-chen",
    github: "github.com/alexchen-tech",
    website: "alexchen.dev",
    summary:
      "High-impact systems engineer with verified expertise across distributed backends, AI fine-tuning, and modern web architectures. Demonstrated track record of optimizing real-time query pipelines by 45% and engineering fault-tolerant microservices scaling to 1.5M daily active users.",
  },
  education: [
    {
      id: "edu-1",
      institution: "University of California, Berkeley",
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Science & Engineering",
      graduationYear: "2024",
      gpa: "3.88 / 4.0",
      honors: "Dean's Honors List • Tau Beta Pi Engineering Honor Society",
    },
  ],
  experience: [
    {
      id: "exp-1",
      company: "Apex Cloud Technologies",
      role: "Software Engineer II - Distributed Systems",
      location: "San Francisco, CA",
      startDate: "2024",
      endDate: "Present",
      isCurrent: true,
      bullets: [
        "Architected an event-driven telemetry pipeline in Go and Apache Kafka, processing 12M+ records daily with sub-30ms P99 latency.",
        "Optimized PostgreSQL connection pooling and indexing strategies, reducing query latency by 42% across core customer billing APIs.",
        "Engineered automated CI/CD deployment workflows using Docker and Kubernetes, reducing deployment rollout failure rates from 8% to under 0.5%.",
        "Mentored 4 junior engineers on distributed consensus (Raft), clean code principles, and test-driven development.",
      ],
    },
    {
      id: "exp-2",
      company: "NeuralMatrix Labs",
      role: "AI Systems Engineering Intern",
      location: "San Jose, CA",
      startDate: "2023",
      endDate: "2023",
      isCurrent: false,
      bullets: [
        "Implemented low-rank adaptation (LoRA) fine-tuning pipelines using PyTorch for domain-specific coding assistant models.",
        "Reduced model inference memory footprint by 35% through 8-bit quantization and TensorRT-LLM optimizations.",
        "Collaborated with product teams to build interactive evaluation benchmarks assessing model accuracy across 10,000+ unit test scenarios.",
      ],
    },
  ],
  projects: [
    {
      id: "proj-1",
      name: "ProofLearn Verified Learning Engine",
      description:
        "Comprehensive technical education platform featuring proof-driven learning, automated code sandbox execution, and cryptographic certificate issuance.",
      techStack: ["Next.js", "TypeScript", "TailwindCSS", "Supabase", "Docker"],
      liveUrl: "https://prooflearn.io",
      repoUrl: "https://github.com/alexchen-tech/prooflearn-engine",
      bullets: [
        "Engineered browser-based interactive code playgrounds supporting 11 languages with sub-100ms sandboxed evaluation.",
        "Designed cryptographic certificate verification engine with deterministic credential IDs and verifiable ledger hashes.",
        "Achieved 100% Lighthouse accessibility and performance scores with responsive server-side rendering.",
      ],
    },
    {
      id: "proj-2",
      name: "VectorFlow: High-Throughput RAG Pipeline",
      description:
        "High-performance vector retrieval and re-ranking service for semantic search over unstructured technical documentation.",
      techStack: ["Python", "PyTorch", "Qdrant", "FastAPI", "Redis"],
      liveUrl: "https://vectorflow-demo.io",
      repoUrl: "https://github.com/alexchen-tech/vectorflow",
      bullets: [
        "Benchmarked hybrid sparse-dense retrieval architectures, achieving 91.4% recall on technical document queries.",
        "Implemented multi-tenant caching layer with Redis, reducing repeated embedding computation costs by $1,800/month.",
      ],
    },
  ],
  skills: {
    languages: ["Python", "TypeScript", "Go", "C++", "C", "SQL", "Rust", "Java"],
    frameworks: ["React", "Next.js", "PyTorch", "FastAPI", "Node.js", "Express", "TailwindCSS"],
    toolsAndCloud: ["Docker", "Kubernetes", "AWS (S3, EC2, ECS)", "Git", "PostgreSQL", "Redis", "Kafka", "Linux"],
    coreConcepts: [
      "Data Structures & Algorithms",
      "Distributed Systems",
      "RESTful & gRPC APIs",
      "System Design",
      "Database Internals",
      "CI/CD Pipelines",
    ],
  },
  certifications: [
    {
      id: "cert-1",
      title: "Data Structures & Algorithms Masterclass",
      issuer: "PROOFLEARN Certified Candidate",
      issueDate: "2026-08-15",
      credentialId: "PLF-2026-CSDSA-49102",
      verificationUrl: "https://prooflearn.io/certs/PLF-2026-CSDSA-49102",
      isProofLearnCert: true,
    },
    {
      id: "cert-2",
      title: "Deep Learning & PyTorch Systems",
      issuer: "PROOFLEARN Certified Candidate",
      issueDate: "2026-09-02",
      credentialId: "PLF-2026-AIPYT-88231",
      verificationUrl: "https://prooflearn.io/certs/PLF-2026-AIPYT-88231",
      isProofLearnCert: true,
    },
    {
      id: "cert-3",
      title: "AWS Certified Solutions Architect – Associate",
      issuer: "Amazon Web Services",
      issueDate: "2024-05-10",
      credentialId: "AWS-PSA-993821",
      verificationUrl: "https://aws.amazon.com/verification",
      isProofLearnCert: false,
    },
  ],
};
