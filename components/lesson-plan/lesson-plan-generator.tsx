'use client';

import { useState, useCallback } from 'react';
import { StageIndicator } from './stage-indicator';
import { ParametersForm } from './parameters-form';
import { LearningOutcomesStage } from './learning-outcomes-stage';
import { LessonSkeletonStage } from './lesson-skeleton-stage';
import { DetailedPlanStage } from './detailed-plan-stage';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle, Download, Share2, RotateCcw } from 'lucide-react';
import type {
  Stage,
  StageState,
  LessonParameters,
  LearningOutcome,
  LessonSkeletonSection,
  DetailedLessonPlan,
} from '@/lib/lesson-plan-types';
import {
  mockLearningOutcomes,
  mockLessonSkeleton,
  mockDetailedPlan,
} from '@/lib/lesson-plan-mock-data';

const initialState: StageState = {
  currentStage: 'parameters',
  parameters: null,
  learningOutcomes: [],
  lessonSkeleton: null,
  detailedPlan: null,
  feedback: {
    learningOutcomes: '',
    skeleton: '',
    detailedPlan: '',
  },
  isGenerating: false,
  iterationCount: {
    learningOutcomes: 1,
    skeleton: 1,
    detailedPlan: 1,
  },
};

export function LessonPlanGenerator() {
  const [state, setState] = useState<StageState>(initialState);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);

  // Simulate API call delay
  const simulateGeneration = useCallback((callback: () => void, delay = 1500) => {
    setState((prev) => ({ ...prev, isGenerating: true }));
    setTimeout(() => {
      callback();
      setState((prev) => ({ ...prev, isGenerating: false }));
    }, delay);
  }, []);

  // Stage 1: Parameters submitted - Generate Learning Outcomes
  const handleParametersSubmit = useCallback(
    (params: LessonParameters) => {
      setState((prev) => ({ ...prev, parameters: params }));
      simulateGeneration(() => {
        setState((prev) => ({
          ...prev,
          currentStage: 'learning-outcomes',
          learningOutcomes: mockLearningOutcomes,
        }));
      });
    },
    [simulateGeneration]
  );

  // Stage 1: Refine Learning Outcomes
  const handleRefineOutcomes = useCallback(() => {
    simulateGeneration(() => {
      setState((prev) => ({
        ...prev,
        learningOutcomes: prev.learningOutcomes.map((lo) => ({
          ...lo,
          outcome: `[Refined] ${lo.outcome}`,
        })),
        feedback: { ...prev.feedback, learningOutcomes: '' },
        iterationCount: {
          ...prev.iterationCount,
          learningOutcomes: prev.iterationCount.learningOutcomes + 1,
        },
      }));
    });
  }, [simulateGeneration]);

  // Stage 1: Approve Learning Outcomes - Move to Stage 2
  const handleApproveOutcomes = useCallback(() => {
    simulateGeneration(() => {
      setState((prev) => ({
        ...prev,
        currentStage: 'lesson-skeleton',
        lessonSkeleton: mockLessonSkeleton,
      }));
    });
  }, [simulateGeneration]);

  // Stage 2: Refine Skeleton
  const handleRefineSkeleton = useCallback(() => {
    simulateGeneration(() => {
      setState((prev) => ({
        ...prev,
        lessonSkeleton: prev.lessonSkeleton
          ? {
              ...prev.lessonSkeleton,
              title: `[Refined] ${prev.lessonSkeleton.title}`,
            }
          : null,
        feedback: { ...prev.feedback, skeleton: '' },
        iterationCount: {
          ...prev.iterationCount,
          skeleton: prev.iterationCount.skeleton + 1,
        },
      }));
    });
  }, [simulateGeneration]);

  // Stage 2: Approve Skeleton - Move to Stage 3
  const handleApproveSkeleton = useCallback(() => {
    simulateGeneration(() => {
      setState((prev) => ({
        ...prev,
        currentStage: 'detailed-plan',
        detailedPlan: mockDetailedPlan,
      }));
    }, 2000);
  }, [simulateGeneration]);

  // Stage 3: Refine Detailed Plan
  const handleRefineDetailedPlan = useCallback(() => {
    simulateGeneration(() => {
      setState((prev) => ({
        ...prev,
        detailedPlan: prev.detailedPlan
          ? {
              ...prev.detailedPlan,
              title: `[Refined] ${prev.detailedPlan.title}`,
            }
          : null,
        feedback: { ...prev.feedback, detailedPlan: '' },
        iterationCount: {
          ...prev.iterationCount,
          detailedPlan: prev.iterationCount.detailedPlan + 1,
        },
      }));
    });
  }, [simulateGeneration]);

  // Stage 3: Finalize Plan
  const handleFinalizePlan = useCallback(() => {
    setShowCompletionDialog(true);
  }, []);

  // Toggle learning outcome approval
  const handleToggleOutcome = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      learningOutcomes: prev.learningOutcomes.map((lo) =>
        lo.id === id ? { ...lo, isApproved: !lo.isApproved } : lo
      ),
    }));
  }, []);

  // Direct edit: LO text
  const handleEditOutcome = useCallback((id: string, newText: string) => {
    setState((prev) => ({
      ...prev,
      learningOutcomes: prev.learningOutcomes.map((lo) =>
        lo.id === id ? { ...lo, outcome: newText } : lo
      ),
    }));
  }, []);

  // Direct edit: Skeleton section field
  const handleEditSection = useCallback(
    (id: string, field: keyof LessonSkeletonSection, value: string) => {
      setState((prev) => ({
        ...prev,
        lessonSkeleton: prev.lessonSkeleton
          ? {
              ...prev.lessonSkeleton,
              sections: prev.lessonSkeleton.sections.map((s) =>
                s.id === id ? { ...s, [field]: value } : s
              ),
            }
          : null,
      }));
    },
    []
  );

  // Direct edit: Detailed plan field
  const handlePlanChange = useCallback((updatedPlan: DetailedLessonPlan) => {
    setState((prev) => ({ ...prev, detailedPlan: updatedPlan }));
  }, []);

  // Update feedback
  const handleFeedbackChange = useCallback((stage: keyof StageState['feedback'], value: string) => {
    setState((prev) => ({
      ...prev,
      feedback: { ...prev.feedback, [stage]: value },
    }));
  }, []);

  // Navigation
  const handleBack = useCallback((toStage: Stage) => {
    setState((prev) => ({ ...prev, currentStage: toStage }));
  }, []);

  // Export
  const handleExport = useCallback(() => {
    // In a real app, this would generate a PDF
    alert('Exporting lesson plan to PDF...');
  }, []);

  const handleExportWord = useCallback(() => {
    // In a real app, this would generate a .docx file
    alert('Exporting lesson plan to Word (.docx)...');
  }, []);

  // Start Over
  const handleStartOver = useCallback(() => {
    setState(initialState);
    setShowCompletionDialog(false);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="font-heading text-2xl font-bold text-foreground">
                Lesson Plan Generator
              </h1>
              <p className="text-sm text-muted-foreground">
                AI-powered interactive lesson planning
              </p>
            </div>
            {state.currentStage !== 'parameters' && (
              <Button variant="outline" size="sm" onClick={handleStartOver}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Start Over
              </Button>
            )}
          </div>
          <StageIndicator currentStage={state.currentStage} isGenerating={state.isGenerating} />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {state.currentStage === 'parameters' && (
          <ParametersForm onSubmit={handleParametersSubmit} />
        )}

        {state.currentStage === 'learning-outcomes' && (
          <LearningOutcomesStage
            outcomes={state.learningOutcomes}
            feedback={state.feedback.learningOutcomes}
            iterationCount={state.iterationCount.learningOutcomes}
            isGenerating={state.isGenerating}
            onFeedbackChange={(value) => handleFeedbackChange('learningOutcomes', value)}
            onRefine={handleRefineOutcomes}
            onApprove={handleApproveOutcomes}
            onBack={() => handleBack('parameters')}
            onToggleOutcome={handleToggleOutcome}
            onEditOutcome={handleEditOutcome}
          />
        )}

        {state.currentStage === 'lesson-skeleton' && (
          <LessonSkeletonStage
            skeleton={state.lessonSkeleton}
            learningOutcomes={state.learningOutcomes}
            feedback={state.feedback.skeleton}
            iterationCount={state.iterationCount.skeleton}
            isGenerating={state.isGenerating}
            onFeedbackChange={(value) => handleFeedbackChange('skeleton', value)}
            onRefine={handleRefineSkeleton}
            onApprove={handleApproveSkeleton}
            onBack={() => handleBack('learning-outcomes')}
            onEditSection={handleEditSection}
          />
        )}

        {state.currentStage === 'detailed-plan' && (
          <DetailedPlanStage
            plan={state.detailedPlan}
            feedback={state.feedback.detailedPlan}
            iterationCount={state.iterationCount.detailedPlan}
            isGenerating={state.isGenerating}
            onFeedbackChange={(value) => handleFeedbackChange('detailedPlan', value)}
            onRefine={handleRefineDetailedPlan}
            onFinalize={handleFinalizePlan}
            onBack={() => handleBack('lesson-skeleton')}
  onExport={handleExport}
  onExportWord={handleExportWord}
  onPlanChange={handlePlanChange}
  />
        )}
      </main>

      {/* Completion Dialog */}
      <Dialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <DialogTitle className="text-center font-heading text-xl">
              Lesson Plan Complete!
            </DialogTitle>
            <DialogDescription className="text-center">
              Your lesson plan has been finalized and is ready for use in the classroom.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-4">
            <Button onClick={handleExport} className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
            <Button variant="outline" className="w-full">
              <Share2 className="mr-2 h-4 w-4" />
              Share with Colleagues
            </Button>
            <Button variant="ghost" onClick={handleStartOver} className="w-full">
              Create Another Lesson Plan
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
