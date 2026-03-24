'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  FileText,
  MessageSquare,
  RefreshCw,
  ArrowLeft,
  CheckCircle,
  Download,
  Share2,
  Clock,
  Target,
  Users,
  BookOpen,
  PenTool,
  Brain,
  ListChecks,
  Lightbulb,
  FileType2,
} from 'lucide-react';
import type { DetailedLessonPlan } from '@/lib/lesson-plan-types';

interface DetailedPlanStageProps {
  plan: DetailedLessonPlan | null;
  feedback: string;
  iterationCount: number;
  isGenerating: boolean;
  onFeedbackChange: (feedback: string) => void;
  onRefine: () => void;
  onFinalize: () => void;
  onBack: () => void;
  onExport: () => void;
  onExportWord: () => void;
  onPlanChange: (plan: DetailedLessonPlan) => void;
}

// Helper: editable single-line input styled to blend with content
function EditableField({
  value,
  onChange,
  label,
  className = '',
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  className?: string;
}) {
  return (
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={label}
      className={`h-auto py-1 text-sm bg-transparent border-dashed border-border/60 focus:border-primary focus:bg-card transition-colors ${className}`}
    />
  );
}

// Helper: editable multi-line textarea styled to blend with content
function EditableTextarea({
  value,
  onChange,
  label,
  minRows = 2,
  className = '',
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  minRows?: number;
  className?: string;
}) {
  return (
    <Textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={label}
      style={{ minHeight: `${minRows * 1.625}rem` }}
      className={`resize-none text-sm bg-transparent border-dashed border-border/60 focus:border-primary focus:bg-card transition-colors leading-relaxed ${className}`}
    />
  );
}

export function DetailedPlanStage({
  plan,
  feedback,
  iterationCount,
  isGenerating,
  onFeedbackChange,
  onRefine,
  onFinalize,
  onBack,
  onExport,
  onExportWord,
  onPlanChange,
}: DetailedPlanStageProps) {
  if (!plan) return null;

  // Convenience updater — merges a partial patch into the plan
  const update = (patch: Partial<DetailedLessonPlan>) => {
    onPlanChange({ ...plan, ...patch });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Stage Header */}
      <Card className="border-primary/20 bg-card shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="font-heading text-xl">Stage 3: Detailed Lesson Plan</CardTitle>
                <CardDescription>
                  Review and edit the complete lesson plan — all fields are directly editable
                </CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="text-xs">
              Iteration {iterationCount}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Lesson Plan Card */}
      <Card className="shadow-md">
        {/* Header */}
        <CardHeader className="bg-primary/5 border-b border-border">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1 space-y-2">
              <Label className="text-xs text-muted-foreground">Lesson Title</Label>
              <Input
                value={plan.title}
                onChange={(e) => update({ title: e.target.value })}
                aria-label="Lesson title"
                className="font-heading text-xl font-bold bg-transparent border-dashed border-border/60 focus:border-primary focus:bg-card transition-colors h-auto py-1"
              />
              <Label className="text-xs text-muted-foreground">Grade / Subject</Label>
              <Input
                value={plan.gradeSubject}
                onChange={(e) => update({ gradeSubject: e.target.value })}
                aria-label="Grade and subject"
                className="text-base bg-transparent border-dashed border-border/60 focus:border-primary focus:bg-card transition-colors h-auto py-1"
              />
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <Input
                value={plan.duration}
                onChange={(e) => update({ duration: e.target.value })}
                aria-label="Duration"
                className="w-28 text-sm bg-transparent border-dashed border-border/60 focus:border-primary focus:bg-card transition-colors h-8"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Learning Outcomes */}
          <div className="p-6 border-b border-border">
            <h3 className="font-heading font-semibold text-lg flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-primary" />
              Learning Outcomes
            </h3>
            <div className="space-y-2">
              {plan.learningOutcomes.map((outcome, index) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-2" />
                  <EditableField
                    value={outcome}
                    label={`Learning outcome ${index + 1}`}
                    className="flex-1"
                    onChange={(v) => {
                      const updated = [...plan.learningOutcomes];
                      updated[index] = v;
                      update({ learningOutcomes: updated });
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Prerequisites */}
          <div className="p-6 border-b border-border bg-muted/20">
            <h3 className="font-heading font-semibold text-lg flex items-center gap-2 mb-4">
              <BookOpen className="h-5 w-5 text-primary" />
              Prerequisite Competencies
            </h3>
            <div className="space-y-2">
              {plan.prerequisiteCompetencies.map((prereq, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-primary mt-2 shrink-0">•</span>
                  <EditableField
                    value={prereq}
                    label={`Prerequisite ${index + 1}`}
                    className="flex-1 text-muted-foreground"
                    onChange={(v) => {
                      const updated = [...plan.prerequisiteCompetencies];
                      updated[index] = v;
                      update({ prerequisiteCompetencies: updated });
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Lesson Flow Accordion */}
          <div className="p-6">
            <h3 className="font-heading font-semibold text-lg flex items-center gap-2 mb-4">
              <ListChecks className="h-5 w-5 text-primary" />
              Lesson Flow
            </h3>

            <Accordion
              type="multiple"
              defaultValue={['entry', 'concept', 'practice', 'exit', 'closure']}
              className="space-y-3"
            >
              {/* ── Entry Task ── */}
              <AccordionItem value="entry" className="border rounded-lg px-4 bg-blue-50/50">
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🎯</span>
                    <div className="text-left">
                      <h4 className="font-semibold">{plan.entryTask.name}</h4>
                      <p className="text-xs text-muted-foreground font-normal">
                        Entry Task • {plan.entryTask.duration}
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-4 pl-9">
                    {/* Name + Duration */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="md:col-span-2">
                        <Label className="text-xs text-muted-foreground mb-1 block">Activity Name</Label>
                        <EditableField
                          value={plan.entryTask.name}
                          label="Entry task name"
                          onChange={(v) => update({ entryTask: { ...plan.entryTask, name: v } })}
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                          <Clock className="h-3 w-3" /> Duration
                        </Label>
                        <EditableField
                          value={plan.entryTask.duration}
                          label="Entry task duration"
                          onChange={(v) => update({ entryTask: { ...plan.entryTask, duration: v } })}
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1 block">Description</Label>
                      <EditableTextarea
                        value={plan.entryTask.description}
                        label="Entry task description"
                        onChange={(v) => update({ entryTask: { ...plan.entryTask, description: v } })}
                      />
                    </div>

                    {/* Teacher / Student Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h5 className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1">
                          <Users className="h-3 w-3" /> Teacher Actions
                        </h5>
                        {plan.entryTask.teacherActions.map((action, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <span className="text-primary mt-2 shrink-0">•</span>
                            <EditableField
                              value={action}
                              label={`Entry task teacher action ${i + 1}`}
                              className="flex-1"
                              onChange={(v) => {
                                const updated = [...plan.entryTask.teacherActions];
                                updated[i] = v;
                                update({ entryTask: { ...plan.entryTask, teacherActions: updated } });
                              }}
                            />
                          </div>
                        ))}
                      </div>
                      <div className="space-y-2">
                        <h5 className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1">
                          <PenTool className="h-3 w-3" /> Student Actions
                        </h5>
                        {plan.entryTask.studentActions.map((action, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <span className="text-primary mt-2 shrink-0">•</span>
                            <EditableField
                              value={action}
                              label={`Entry task student action ${i + 1}`}
                              className="flex-1"
                              onChange={(v) => {
                                const updated = [...plan.entryTask.studentActions];
                                updated[i] = v;
                                update({ entryTask: { ...plan.entryTask, studentActions: updated } });
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Materials */}
                    {plan.entryTask.materials.length > 0 && (
                      <div>
                        <Label className="text-xs text-muted-foreground mb-2 block">Materials</Label>
                        <div className="flex flex-wrap gap-2">
                          {plan.entryTask.materials.map((material, i) => (
                            <div key={i} className="relative">
                              <Input
                                value={material}
                                onChange={(e) => {
                                  const updated = [...plan.entryTask.materials];
                                  updated[i] = e.target.value;
                                  update({ entryTask: { ...plan.entryTask, materials: updated } });
                                }}
                                aria-label={`Entry task material ${i + 1}`}
                                className="h-7 text-xs w-auto min-w-[80px] border-border/60 border-dashed focus:border-primary focus:bg-card"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* CFU */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 space-y-1">
                      <h5 className="text-xs font-semibold text-yellow-700">
                        CFU (Check for Understanding)
                      </h5>
                      <EditableTextarea
                        value={plan.entryTask.cfu}
                        label="Entry task CFU"
                        minRows={2}
                        className="bg-transparent border-yellow-300 focus:border-yellow-500 text-yellow-900"
                        onChange={(v) => update({ entryTask: { ...plan.entryTask, cfu: v } })}
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* ── Concept Teaching ── */}
              <AccordionItem value="concept" className="border rounded-lg px-4 bg-green-50/50">
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📚</span>
                    <div className="text-left">
                      <h4 className="font-semibold">Concept Teaching</h4>
                      <p className="text-xs text-muted-foreground font-normal">
                        {plan.conceptTeaching.length} activities
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-4 pl-9">
                    {plan.conceptTeaching.map((activity, index) => (
                      <div key={activity.id} className="p-4 bg-card rounded-lg border space-y-3">
                        {/* Name + Duration */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="md:col-span-2">
                            <Label className="text-xs text-muted-foreground mb-1 block">Activity Name</Label>
                            <EditableField
                              value={activity.name}
                              label={`Concept activity ${index + 1} name`}
                              className="font-semibold"
                              onChange={(v) => {
                                const updated = [...plan.conceptTeaching];
                                updated[index] = { ...updated[index], name: v };
                                update({ conceptTeaching: updated });
                              }}
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                              <Clock className="h-3 w-3" /> Duration
                            </Label>
                            <EditableField
                              value={activity.duration}
                              label={`Concept activity ${index + 1} duration`}
                              onChange={(v) => {
                                const updated = [...plan.conceptTeaching];
                                updated[index] = { ...updated[index], duration: v };
                                update({ conceptTeaching: updated });
                              }}
                            />
                          </div>
                        </div>

                        {/* Description */}
                        <div>
                          <Label className="text-xs text-muted-foreground mb-1 block">Description</Label>
                          <EditableTextarea
                            value={activity.description}
                            label={`Concept activity ${index + 1} description`}
                            onChange={(v) => {
                              const updated = [...plan.conceptTeaching];
                              updated[index] = { ...updated[index], description: v };
                              update({ conceptTeaching: updated });
                            }}
                          />
                        </div>

                        {/* CFU */}
                        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 space-y-1">
                          <h5 className="text-xs font-semibold text-yellow-700">CFU</h5>
                          <EditableTextarea
                            value={activity.cfu}
                            label={`Concept activity ${index + 1} CFU`}
                            minRows={2}
                            className="bg-transparent border-yellow-300 focus:border-yellow-500 text-yellow-900"
                            onChange={(v) => {
                              const updated = [...plan.conceptTeaching];
                              updated[index] = { ...updated[index], cfu: v };
                              update({ conceptTeaching: updated });
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* ── Guided Practice ── */}
              <AccordionItem value="practice" className="border rounded-lg px-4 bg-yellow-50/50">
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🤝</span>
                    <div className="text-left">
                      <h4 className="font-semibold">{plan.guidedPractice.name}</h4>
                      <p className="text-xs text-muted-foreground font-normal">
                        Guided Practice • {plan.guidedPractice.duration}
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-4 pl-9">
                    {/* Name + Duration */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="md:col-span-2">
                        <Label className="text-xs text-muted-foreground mb-1 block">Activity Name</Label>
                        <EditableField
                          value={plan.guidedPractice.name}
                          label="Guided practice name"
                          onChange={(v) => update({ guidedPractice: { ...plan.guidedPractice, name: v } })}
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                          <Clock className="h-3 w-3" /> Duration
                        </Label>
                        <EditableField
                          value={plan.guidedPractice.duration}
                          label="Guided practice duration"
                          onChange={(v) => update({ guidedPractice: { ...plan.guidedPractice, duration: v } })}
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1 block">Description</Label>
                      <EditableTextarea
                        value={plan.guidedPractice.description}
                        label="Guided practice description"
                        onChange={(v) => update({ guidedPractice: { ...plan.guidedPractice, description: v } })}
                      />
                    </div>

                    {/* Teacher / Student Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h5 className="text-xs font-semibold uppercase text-muted-foreground">Teacher Actions</h5>
                        {plan.guidedPractice.teacherActions.map((action, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <span className="text-primary mt-2 shrink-0">•</span>
                            <EditableField
                              value={action}
                              label={`Guided practice teacher action ${i + 1}`}
                              className="flex-1"
                              onChange={(v) => {
                                const updated = [...plan.guidedPractice.teacherActions];
                                updated[i] = v;
                                update({ guidedPractice: { ...plan.guidedPractice, teacherActions: updated } });
                              }}
                            />
                          </div>
                        ))}
                      </div>
                      <div className="space-y-2">
                        <h5 className="text-xs font-semibold uppercase text-muted-foreground">Student Actions</h5>
                        {plan.guidedPractice.studentActions.map((action, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <span className="text-primary mt-2 shrink-0">•</span>
                            <EditableField
                              value={action}
                              label={`Guided practice student action ${i + 1}`}
                              className="flex-1"
                              onChange={(v) => {
                                const updated = [...plan.guidedPractice.studentActions];
                                updated[i] = v;
                                update({ guidedPractice: { ...plan.guidedPractice, studentActions: updated } });
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CFU */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 space-y-1">
                      <h5 className="text-xs font-semibold text-yellow-700">CFU</h5>
                      <EditableTextarea
                        value={plan.guidedPractice.cfu}
                        label="Guided practice CFU"
                        minRows={2}
                        className="bg-transparent border-yellow-300 focus:border-yellow-500 text-yellow-900"
                        onChange={(v) => update({ guidedPractice: { ...plan.guidedPractice, cfu: v } })}
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* ── Exit Ticket ── */}
              <AccordionItem value="exit" className="border rounded-lg px-4 bg-purple-50/50">
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📝</span>
                    <div className="text-left">
                      <h4 className="font-semibold">Exit Ticket</h4>
                      <p className="text-xs text-muted-foreground font-normal">
                        Assessment • {plan.exitTicket.duration}
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-3 pl-9">
                    <div className="flex items-center gap-3 mb-2">
                      <Label className="text-xs text-muted-foreground">Duration</Label>
                      <EditableField
                        value={plan.exitTicket.duration}
                        label="Exit ticket duration"
                        className="w-28"
                        onChange={(v) => update({ exitTicket: { ...plan.exitTicket, duration: v } })}
                      />
                    </div>
                    <h5 className="text-xs font-semibold uppercase text-muted-foreground">Questions</h5>
                    <div className="space-y-2">
                      {plan.exitTicket.questions.map((question, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="text-sm font-medium text-muted-foreground mt-2 w-5 shrink-0">
                            {i + 1}.
                          </span>
                          <EditableField
                            value={question}
                            label={`Exit ticket question ${i + 1}`}
                            className="flex-1"
                            onChange={(v) => {
                              const updated = [...plan.exitTicket.questions];
                              updated[i] = v;
                              update({ exitTicket: { ...plan.exitTicket, questions: updated } });
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* ── Closure ── */}
              <AccordionItem value="closure" className="border rounded-lg px-4 bg-pink-50/50">
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🧠</span>
                    <div className="text-left">
                      <h4 className="font-semibold">Closure & Mind Map</h4>
                      <p className="text-xs text-muted-foreground font-normal">Consolidation</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-4 pl-9">
                    <div className="space-y-2">
                      <h5 className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1">
                        <Brain className="h-3 w-3" /> Mind Map Structure
                      </h5>
                      <Textarea
                        value={plan.closure.mindMap}
                        onChange={(e) => update({ closure: { ...plan.closure, mindMap: e.target.value } })}
                        aria-label="Mind map structure"
                        className="resize-none text-xs font-mono bg-muted/50 border-dashed border-border/60 focus:border-primary focus:bg-card transition-colors leading-relaxed min-h-[80px]"
                      />
                    </div>
                    <div className="space-y-2">
                      <h5 className="text-xs font-semibold uppercase text-muted-foreground">Summary</h5>
                      <EditableTextarea
                        value={plan.closure.summary}
                        label="Closure summary"
                        onChange={(v) => update({ closure: { ...plan.closure, summary: v } })}
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Assessment Section */}
          {plan.assessment && (
            <div className="p-6 border-t border-border bg-muted/20">
              <h3 className="font-heading font-semibold text-lg flex items-center gap-2 mb-4">
                <Lightbulb className="h-5 w-5 text-primary" />
                Additional Assessment
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {plan.assessment.quiz && plan.assessment.quiz.length > 0 && (
                  <Card className="p-4">
                    <h4 className="font-semibold text-sm mb-3">Quiz Questions</h4>
                    <div className="space-y-2">
                      {plan.assessment.quiz.map((q, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="text-sm font-medium text-muted-foreground mt-2 w-5 shrink-0">
                            {i + 1}.
                          </span>
                          <EditableField
                            value={q}
                            label={`Quiz question ${i + 1}`}
                            className="flex-1"
                            onChange={(v) => {
                              const updated = [...(plan.assessment?.quiz ?? [])];
                              updated[i] = v;
                              update({ assessment: { ...plan.assessment, quiz: updated } });
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {plan.assessment.assignment !== undefined && (
                  <Card className="p-4">
                    <h4 className="font-semibold text-sm mb-2">Assignment</h4>
                    <EditableTextarea
                      value={plan.assessment.assignment ?? ''}
                      label="Assignment"
                      onChange={(v) =>
                        update({ assessment: { ...plan.assessment, assignment: v } })
                      }
                    />
                  </Card>
                )}

                {plan.assessment.hotsExtension !== undefined && (
                  <Card className="p-4 md:col-span-2">
                    <h4 className="font-semibold text-sm mb-2">HOTS Extension</h4>
                    <EditableTextarea
                      value={plan.assessment.hotsExtension ?? ''}
                      label="HOTS Extension"
                      onChange={(v) =>
                        update({ assessment: { ...plan.assessment, hotsExtension: v } })
                      }
                    />
                  </Card>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Feedback Section */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-heading flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Final Adjustments
          </CardTitle>
          <CardDescription>
            Make any last refinements or finalize your lesson plan
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="plan-feedback" className="sr-only">
              Feedback
            </Label>
            <Textarea
              id="plan-feedback"
              value={feedback}
              onChange={(e) => onFeedbackChange(e.target.value)}
              placeholder="e.g., Add more differentiation strategies, simplify the CFU questions, include more visual aids..."
              className="min-h-[100px] bg-background resize-none"
            />
          </div>

          {/* Quick feedback suggestions */}
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-muted-foreground">Quick suggestions:</span>
            {[
              'More scaffolding',
              'Add visuals',
              'Simplify questions',
              'Include differentiation',
              'Add extension activity',
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
                    Refine Plan
                  </>
                )}
              </Button>
              <Button
                onClick={onFinalize}
                disabled={isGenerating}
                className="flex-1"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Finalize Plan
              </Button>
            </div>
          </div>

          {/* Export Options */}
          <div className="flex flex-wrap gap-3 pt-1">
            <Button variant="outline" onClick={onExport} className="flex-1 sm:flex-none">
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
            <Button variant="outline" onClick={onExportWord} className="flex-1 sm:flex-none">
              <FileType2 className="mr-2 h-4 w-4" />
              Export Word
            </Button>
            <Button variant="outline" className="flex-1 sm:flex-none">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
