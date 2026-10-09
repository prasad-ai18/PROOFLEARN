import type {
  Course,
  CourseCategory,
  Module,
  PracticeQuestion,
  ProofChallenge,
  Resource,
} from "./course-types";

export interface CourseSpec {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  category: CourseCategory;
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
  estimatedHours?: number;
  iconName?: string;
  badgeColor?: string;
  prerequisites?: string[];
  learningOutcomes: string[];
  roadmapSlug?: string;
  googleSkillsUrl?: string;
  mindlusterUrl?: string;
  videoEmbedId: string;
  videoTitle: string;
  modules: {
    id: string;
    slug: string;
    title: string;
    description: string;
    lessons: {
      id: string;
      slug: string;
      title: string;
      summary: string;
      durationMinutes?: number;
      content: string;
      keyTakeaways: string[];
      practiceQuestions: PracticeQuestion[];
      proofChallenge: ProofChallenge;
    }[];
  }[];
}

export function buildCatalogCourse(spec: CourseSpec): Course {
  const roadmapUrl = spec.roadmapSlug
    ? `https://roadmap.sh/${spec.roadmapSlug}`
    : `https://roadmap.sh/${spec.slug}`;

  const googleSkills =
    spec.googleSkillsUrl ||
    `https://www.cloudskillsboost.google/paths`;

  const mindluster =
    spec.mindlusterUrl ||
    `https://www.mindluster.com/certificate/programming`;

  const videoUrl = `https://www.youtube.com/watch?v=${spec.videoEmbedId}`;

  const resources: Resource[] = [
    {
      id: `${spec.slug}-roadmap`,
      title: `${spec.title} Visual Roadmap`,
      provider: "Roadmap.sh",
      type: "platform",
      url: roadmapUrl,
      description: `Interactive skill roadmap and prerequisite tree for ${spec.title}.`,
      difficulty: "All Levels",
      isFree: true,
      badge: "Roadmap.sh",
    },
    {
      id: `${spec.slug}-google`,
      title: `Google Skills & Cloud Learning: ${spec.title}`,
      provider: "Google Skills",
      type: "course",
      url: googleSkills,
      description: `Hands-on labs and certifications from Google Cloud Skills Boost.`,
      difficulty: spec.difficulty || "Beginner",
      isFree: true,
      badge: "Google Skills",
    },
    {
      id: `${spec.slug}-mindluster`,
      title: `MindLuster Free Certification Course`,
      provider: "MindLuster",
      type: "course",
      url: mindluster,
      description: `Comprehensive video training course with free certificate of completion.`,
      difficulty: spec.difficulty || "Beginner",
      isFree: true,
      badge: "MindLuster",
    },
    {
      id: `${spec.slug}-youtube`,
      title: spec.videoTitle,
      provider: "YouTube",
      type: "video",
      url: videoUrl,
      embedUrl: `https://www.youtube-nocookie.com/embed/${spec.videoEmbedId}`,
      description: `Full masterclass video tutorial for ${spec.title}.`,
      difficulty: spec.difficulty || "Beginner",
      isFree: true,
      badge: "YouTube",
    },
  ];

  const modules: Module[] = spec.modules.map((m, mIdx) => ({
    id: m.id,
    slug: m.slug,
    title: m.title,
    description: m.description,
    order: mIdx + 1,
    lessons: m.lessons.map((l, lIdx) => ({
      id: l.id,
      slug: l.slug,
      title: l.title,
      summary: l.summary,
      durationMinutes: l.durationMinutes || 30,
      order: lIdx + 1,
      content: l.content,
      keyTakeaways: l.keyTakeaways,
      practiceQuestions: l.practiceQuestions,
      proofChallenge: l.proofChallenge,
      videoUrl: videoUrl,
      videoEmbedId: spec.videoEmbedId,
      videoTitle: spec.videoTitle,
      learningLinks: [
        {
          title: `Roadmap.sh ${spec.title}`,
          provider: "Roadmap.sh",
          url: roadmapUrl,
          badge: "Roadmap.sh",
          description: `Roadmap checkpoint for ${l.title}`,
        },
        {
          title: `Google Skills Lab`,
          provider: "Google Skills",
          url: googleSkills,
          badge: "Google Skills",
          description: `Google certified learning materials`,
        },
        {
          title: `MindLuster Certification`,
          provider: "MindLuster",
          url: mindluster,
          badge: "MindLuster",
          description: `Free certificate path on MindLuster`,
        },
      ],
    })),
  }));

  return {
    id: spec.id,
    slug: spec.slug,
    title: spec.title,
    tagline: spec.tagline,
    description: spec.description,
    category: spec.category,
    difficulty: spec.difficulty || "Beginner",
    estimatedHours: spec.estimatedHours || 30,
    iconName: spec.iconName || "BookOpen",
    badgeColor: spec.badgeColor || "blue",
    prerequisites: spec.prerequisites || [],
    learningOutcomes: spec.learningOutcomes,
    resources,
    modules,
    roadmapUrl,
    googleSkillsUrl: googleSkills,
    mindlusterUrl: mindluster,
    featuredVideoUrl: videoUrl,
    featuredVideoEmbedId: spec.videoEmbedId,
    featuredVideoTitle: spec.videoTitle,
  };
}
