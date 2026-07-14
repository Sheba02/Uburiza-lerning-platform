export type Role = "LEARNER" | "ADMIN";
export type Level = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
export type LessonType = "VIDEO" | "TEXT" | "QUIZ";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  type: LessonType;
  contentUrl: string | null;
  orderIndex: number;
  durationMins: number | null;
  progress?: { completed: boolean }[];
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  orderIndex: number;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: Level;
  thumbnailUrl: string | null;
  isFree: boolean;
  price: number | null;
  published: boolean;
  createdAt: string;
  modules?: Module[];
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: string;
  completedAt: string | null;
  course?: Course;
}

export interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  issuedAt: string;
  certificateUid: string;
  course?: { title: string };
  user?: { name: string };
}

export interface Resource {
  id: string;
  title: string;
  category: string;
  fileUrl: string;
  fileType: string;
  uploadedAt: string;
}

export interface ProgressSummary {
  total: number;
  completed: number;
  percentage: number;
}
