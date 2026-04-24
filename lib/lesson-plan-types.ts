// Lesson Plan Generator Types

export type PreviousKnowledgeLevel =
  | 'no-prior-knowledge'
  | 'limited-familiarity'
  | 'basic-understanding'
  | 'moderate-understanding'
  | 'strong-understanding';

export interface LessonParameters {
  board: string;
  grade: string;
  subject: string;
  selectionType: 'chapter' | 'topic';
  chapter: string;
  subTopic: string;
  // Class Readiness
  previousKnowledge: PreviousKnowledgeLevel;
  previousKnowledgeNotes: string;
  missingCompetencies: string[];
  requiredCompetencies: string[];
  achievedCompetencies: string[];
  // Duration and other settings
  duration: number;
  classStrength: number;
  includeQuiz: boolean;
  includeAssignment: boolean;
  outputStyle: 'concise' | 'detailed' | 'activity-based';
}

export interface LearningOutcome {
  id: string;
  outcome: string;
  bloomsLevel: string;
  isApproved: boolean;
}

export interface LessonSkeletonSection {
  id: string;
  phase: string;
  title: string;
  duration: string;
  description: string;
}

export interface LessonSkeleton {
  title: string;
  sections: LessonSkeletonSection[];
  totalDuration: string;
  isApproved: boolean;
}

export interface DetailedActivity {
  id: string;
  name: string;
  description: string;
  duration: string;
  materials: string[];
  teacherActions: string[];
  studentActions: string[];
  cfu: string; // Check for Understanding
}

export interface DetailedLessonPlan {
  title: string;
  gradeSubject: string;
  duration: string;
  learningOutcomes: string[];
  prerequisiteCompetencies: string[];
  entryTask: DetailedActivity;
  conceptTeaching: DetailedActivity[];
  guidedPractice: DetailedActivity;
  exitTicket: {
    questions: string[];
    duration: string;
  };
  closure: {
    mindMap: string;
    summary: string;
  };
  assessment?: {
    quiz?: string[];
    assignment?: string;
    hotsExtension?: string;
  };
}

export type Stage = 'parameters' | 'learning-outcomes' | 'lesson-skeleton' | 'detailed-plan';

export interface StageState {
  currentStage: Stage;
  parameters: LessonParameters | null;
  learningOutcomes: LearningOutcome[];
  lessonSkeleton: LessonSkeleton | null;
  detailedPlan: DetailedLessonPlan | null;
  feedback: {
    learningOutcomes: string;
    skeleton: string;
    detailedPlan: string;
  };
  isGenerating: boolean;
  iterationCount: {
    learningOutcomes: number;
    skeleton: number;
    detailedPlan: number;
  };
}
