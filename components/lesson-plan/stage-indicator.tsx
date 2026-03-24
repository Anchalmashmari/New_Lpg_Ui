'use client';

import { CheckCircle, Circle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Stage } from '@/lib/lesson-plan-types';

interface StageIndicatorProps {
  currentStage: Stage;
  isGenerating: boolean;
}

const stages = [
  { key: 'parameters', label: 'Setup', description: 'Configure lesson parameters' },
  { key: 'learning-outcomes', label: 'Learning Outcomes', description: 'Define & refine LOs' },
  { key: 'lesson-skeleton', label: 'Lesson Outline', description: 'Structure the lesson' },
  { key: 'detailed-plan', label: 'Detailed Plan', description: 'Full lesson content' },
] as const;

export function StageIndicator({ currentStage, isGenerating }: StageIndicatorProps) {
  const currentIndex = stages.findIndex((s) => s.key === currentStage);

  return (
    <nav aria-label="Progress" className="w-full">
      <ol className="flex items-center justify-between gap-2 md:gap-4">
        {stages.map((stage, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isPending = index > currentIndex;

          return (
            <li key={stage.key} className="flex-1">
              <div
                className={cn(
                  'group flex flex-col items-center gap-2 rounded-lg p-3 transition-all',
                  isCurrent && 'bg-card shadow-sm border border-border'
                )}
              >
                <div className="flex items-center gap-2">
                  {isCompleted ? (
                    <CheckCircle className="h-6 w-6 text-primary" aria-hidden="true" />
                  ) : isCurrent && isGenerating ? (
                    <Loader2 className="h-6 w-6 text-primary animate-spin" aria-hidden="true" />
                  ) : isCurrent ? (
                    <div className="h-6 w-6 rounded-full border-2 border-primary bg-primary/10 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                  ) : (
                    <Circle
                      className={cn('h-6 w-6', isPending ? 'text-muted-foreground/40' : 'text-muted-foreground')}
                      aria-hidden="true"
                    />
                  )}
                  <span
                    className={cn(
                      'font-heading text-sm font-semibold hidden sm:inline',
                      isCompleted && 'text-primary',
                      isCurrent && 'text-foreground',
                      isPending && 'text-muted-foreground/60'
                    )}
                  >
                    {stage.label}
                  </span>
                </div>
                <span
                  className={cn(
                    'text-xs text-center hidden md:block',
                    isCurrent ? 'text-muted-foreground' : 'text-muted-foreground/50'
                  )}
                >
                  {stage.description}
                </span>
              </div>
              {index < stages.length - 1 && (
                <div
                  className={cn(
                    'hidden lg:block h-0.5 w-full mt-3',
                    isCompleted ? 'bg-primary' : 'bg-border'
                  )}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
