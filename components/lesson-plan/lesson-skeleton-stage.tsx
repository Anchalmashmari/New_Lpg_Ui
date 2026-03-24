'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Layout,
  MessageSquare,
  RefreshCw,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Clock,
  GripVertical,
} from 'lucide-react';
import type { LessonSkeleton, LearningOutcome, LessonSkeletonSection } from '@/lib/lesson-plan-types';

interface LessonSkeletonStageProps {
  skeleton: LessonSkeleton | null;
  learningOutcomes: LearningOutcome[];
  feedback: string;
  iterationCount: number;
  isGenerating: boolean;
  onFeedbackChange: (feedback: string) => void;
  onRefine: () => void;
  onApprove: () => void;
  onBack: () => void;
  onEditSection: (id: string, field: keyof LessonSkeletonSection, value: string) => void;
}

const phaseColors: Record<string, string> = {
  'Entry Task': 'border-l-blue-500',
  'Concept Teaching': 'border-l-green-500',
  'Guided Practice': 'border-l-yellow-500',
  'Exit Ticket': 'border-l-purple-500',
  Closure: 'border-l-pink-500',
};

const phaseLabels: Record<string, string> = {
  'Entry Task': 'Entry Task',
  'Concept Teaching': 'Concept Teaching',
  'Guided Practice': 'Guided Practice',
  'Exit Ticket': 'Exit Ticket',
  Closure: 'Closure',
};

export function LessonSkeletonStage({
  skeleton,
  learningOutcomes,
  feedback,
  iterationCount,
  isGenerating,
  onFeedbackChange,
  onRefine,
  onApprove,
  onBack,
  onEditSection,
}: LessonSkeletonStageProps) {
  const approvedOutcomes = learningOutcomes.filter((o) => o.isApproved);

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Stage Header */}
      <Card className="border-primary/20 bg-card shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Layout className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="font-heading text-xl">Stage 2: Lesson Outline</CardTitle>
                <CardDescription>
                  Review, edit directly, and refine the lesson structure before generating details
                </CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="text-xs">
              Iteration {iterationCount}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Approved Learning Outcomes Reference */}
      <Card className="shadow-sm bg-muted/30 border-dashed">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Based on Approved Learning Outcomes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1">
            {approvedOutcomes.map((outcome, index) => (
              <li key={outcome.id} className="text-sm text-foreground/80 flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>
                  <span className="font-medium">LO{index + 1}:</span> {outcome.outcome}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Generated Skeleton */}
      {skeleton && (
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <div>
              <CardTitle className="text-lg font-heading">{skeleton.title}</CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <Clock className="h-4 w-4" />
                Total Duration: {skeleton.totalDuration}
              </CardDescription>
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              Edit any field below — title, duration, or description — to customise the outline.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {skeleton.sections.map((section) => (
              <div
                key={section.id}
                className={`relative rounded-lg border-l-4 bg-card border border-border ${
                  phaseColors[section.phase] || 'border-l-gray-400'
                }`}
              >
                <div className="flex items-start gap-3 p-4">
                  <div className="flex items-center gap-1 text-muted-foreground pt-1 shrink-0">
                    <GripVertical className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-3 min-w-0">
                    {/* Phase label */}
                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                      {phaseLabels[section.phase] || section.phase}
                    </p>

                    {/* Title + Duration row */}
                    <div className="flex gap-3 items-start">
                      <div className="flex-1 min-w-0">
                        <Label className="text-xs text-muted-foreground mb-1 block">Section Title</Label>
                        <Input
                          value={section.title}
                          onChange={(e) => onEditSection(section.id, 'title', e.target.value)}
                          className="h-8 text-sm font-semibold bg-transparent border-dashed border-border/60 focus:border-primary focus:bg-card transition-colors"
                          aria-label={`Title for ${section.phase} section`}
                        />
                      </div>
                      <div className="w-28 shrink-0">
                        <Label className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                          <Clock className="h-3 w-3" /> Duration
                        </Label>
                        <Input
                          value={section.duration}
                          onChange={(e) => onEditSection(section.id, 'duration', e.target.value)}
                          className="h-8 text-sm bg-transparent border-dashed border-border/60 focus:border-primary focus:bg-card transition-colors"
                          aria-label={`Duration for ${section.phase} section`}
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1 block">Description</Label>
                      <Textarea
                        value={section.description}
                        onChange={(e) => onEditSection(section.id, 'description', e.target.value)}
                        className="min-h-[64px] resize-none text-sm bg-transparent border-dashed border-border/60 focus:border-primary focus:bg-card transition-colors leading-relaxed"
                        aria-label={`Description for ${section.phase} section`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Feedback Section */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-heading flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Your Feedback
          </CardTitle>
          <CardDescription>
            Suggest changes to the lesson structure or approve to generate the detailed plan
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="skeleton-feedback" className="sr-only">
              Feedback
            </Label>
            <Textarea
              id="skeleton-feedback"
              value={feedback}
              onChange={(e) => onFeedbackChange(e.target.value)}
              placeholder="e.g., Add more time for guided practice, include a collaborative activity, simplify the entry task..."
              className="min-h-[100px] bg-background resize-none"
            />
          </div>

          {/* Quick feedback suggestions */}
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-muted-foreground">Quick suggestions:</span>
            {[
              'More practice time',
              'Add group activity',
              'Shorten lecture',
              'Include real examples',
              'Add differentiation',
            ].map((suggestion) => (
              <Button
                key={suggestion}
                type="button"
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                onClick={() => onFeedbackChange(feedback ? `${feedback}, ${suggestion}` : suggestion)}
              >
                {suggestion}
              </Button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button variant="outline" onClick={onBack} disabled={isGenerating} className="flex-1 sm:flex-none">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div className="flex gap-3 flex-1">
              <Button
                variant="secondary"
                onClick={onRefine}
                disabled={isGenerating || !feedback.trim()}
                className="flex-1"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Refining...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refine Outline
                  </>
                )}
              </Button>
              <Button onClick={onApprove} disabled={isGenerating || !skeleton} className="flex-1">
                <CheckCircle className="mr-2 h-4 w-4" />
                Generate Details
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
