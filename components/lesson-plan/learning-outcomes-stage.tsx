'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Target,
  MessageSquare,
  RefreshCw,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Lightbulb,
  Pencil,
} from 'lucide-react';
import type { LearningOutcome } from '@/lib/lesson-plan-types';

interface LearningOutcomesStageProps {
  outcomes: LearningOutcome[];
  feedback: string;
  iterationCount: number;
  isGenerating: boolean;
  onFeedbackChange: (feedback: string) => void;
  onRefine: () => void;
  onApprove: () => void;
  onBack: () => void;
  onToggleOutcome: (id: string) => void;
  onEditOutcome: (id: string, newText: string) => void;
}

const bloomsColors: Record<string, string> = {
  Remember: 'bg-blue-100 text-blue-700 border-blue-200',
  Understand: 'bg-green-100 text-green-700 border-green-200',
  Apply: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  Analyze: 'bg-orange-100 text-orange-700 border-orange-200',
  Evaluate: 'bg-purple-100 text-purple-700 border-purple-200',
  Create: 'bg-pink-100 text-pink-700 border-pink-200',
};

export function LearningOutcomesStage({
  outcomes,
  feedback,
  iterationCount,
  isGenerating,
  onFeedbackChange,
  onRefine,
  onApprove,
  onBack,
  onToggleOutcome,
  onEditOutcome,
}: LearningOutcomesStageProps) {
  const [isSelecting, setIsSelecting] = useState(false);
  const approvedCount = outcomes.filter((o) => o.isApproved).length;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Stage Header */}
      <Card className="border-primary/20 bg-card shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="font-heading text-xl">Stage 1: Learning Outcomes</CardTitle>
                <CardDescription>
                  Review, edit directly, and refine the learning outcomes for this lesson
                </CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="text-xs">
              Iteration {iterationCount}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Generated Outcomes */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-heading flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              Generated Learning Outcomes
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSelecting(!isSelecting)}
              className="text-muted-foreground"
            >
              <Pencil className="h-4 w-4 mr-1" />
              {isSelecting ? 'Done' : 'Select'}
            </Button>
          </div>
          <CardDescription className="flex items-center gap-1">
            <Pencil className="h-3 w-3" />
            Click any outcome text to edit it directly &mdash; {approvedCount} of {outcomes.length} selected
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {outcomes.map((outcome, index) => (
            <div
              key={outcome.id}
              className={`group relative rounded-lg border transition-all ${
                outcome.isApproved
                  ? 'border-primary/30 bg-primary/5'
                  : 'border-border bg-muted/30 opacity-60'
              }`}
            >
              <div className="flex gap-3 p-4">
                {isSelecting && (
                  <Checkbox
                    id={`outcome-${outcome.id}`}
                    checked={outcome.isApproved}
                    onCheckedChange={() => onToggleOutcome(outcome.id)}
                    className="mt-1 shrink-0"
                  />
                )}
                <div className="flex-1 space-y-2 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-semibold text-sm text-muted-foreground shrink-0">
                      LO{index + 1}:
                    </span>
                    <Badge
                      variant="outline"
                      className={`shrink-0 text-xs ${
                        bloomsColors[outcome.bloomsLevel] || 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {outcome.bloomsLevel}
                    </Badge>
                  </div>
                  <Textarea
                    value={outcome.outcome}
                    onChange={(e) => onEditOutcome(outcome.id, e.target.value)}
                    className="min-h-[60px] resize-none text-sm bg-transparent border-dashed border-border/60 focus:border-primary focus:bg-card transition-colors leading-relaxed"
                    aria-label={`Learning outcome ${index + 1}`}
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Feedback Section */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-heading flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Your Feedback
          </CardTitle>
          <CardDescription>
            Provide suggestions to refine the learning outcomes or approve to proceed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="feedback" className="sr-only">
              Feedback
            </Label>
            <Textarea
              id="feedback"
              value={feedback}
              onChange={(e) => onFeedbackChange(e.target.value)}
              placeholder="e.g., Make outcomes more measurable, focus on practical application, add higher-order thinking..."
              className="min-h-[100px] bg-background resize-none"
            />
          </div>

          {/* Quick feedback suggestions */}
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-muted-foreground">Quick suggestions:</span>
            {[
              'More measurable',
              'Add HOTS',
              'Simplify language',
              'Focus on skills',
              'Include practical application',
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
                    Refine Outcomes
                  </>
                )}
              </Button>
              <Button onClick={onApprove} disabled={isGenerating || approvedCount === 0} className="flex-1">
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve & Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
