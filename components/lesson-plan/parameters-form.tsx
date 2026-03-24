'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { ArrowRight, BookOpen, GraduationCap, Clock, Users, FileText, Lightbulb, BarChart3 } from 'lucide-react';
import type { LessonParameters } from '@/lib/lesson-plan-types';

interface ParametersFormProps {
  onSubmit: (params: LessonParameters) => void;
}

const boards = ['CBSE', 'ICSE', 'State Board', 'IB', 'Cambridge'];
const grades = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const subjects = ['Mathematics', 'Science', 'English', 'Social Studies', 'Hindi', 'Computer Science'];
const chapters = [
  { id: '1', name: '1: Introduction' },
  { id: '2', name: '2: Basics' },
  { id: '3', name: '3: Advanced Concepts' },
  { id: '4', name: '4: Applications' },
  { id: '5', name: '5: Practice & Review' },
];

export function ParametersForm({ onSubmit }: ParametersFormProps) {
  const [formData, setFormData] = useState<LessonParameters>({
    board: 'CBSE',
    grade: '3',
    subject: 'Science',
    selectionType: 'chapter',
    chapter: '2',
    subTopic: '',
    duration: 45,
    classStrength: 30,
    includeQuiz: false,
    includeAssignment: false,
    outputStyle: 'detailed',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-md border-border/50">
      <CardHeader className="pb-4">
        <CardTitle className="font-heading text-2xl flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          Lesson Configuration
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Set up the parameters for your AI-generated lesson plan
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Board and Grade Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="board" className="flex items-center gap-2 text-sm font-medium">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                Select Board
              </Label>
              <Select
                value={formData.board}
                onValueChange={(value) => setFormData({ ...formData, board: value })}
              >
                <SelectTrigger id="board" className="bg-card">
                  <SelectValue placeholder="Select board" />
                </SelectTrigger>
                <SelectContent>
                  {boards.map((board) => (
                    <SelectItem key={board} value={board}>
                      {board}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="grade" className="flex items-center gap-2 text-sm font-medium">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                Select Grade
              </Label>
              <Select
                value={formData.grade}
                onValueChange={(value) => setFormData({ ...formData, grade: value })}
              >
                <SelectTrigger id="grade" className="bg-card">
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  {grades.map((grade) => (
                    <SelectItem key={grade} value={grade}>
                      Grade {grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject" className="flex items-center gap-2 text-sm font-medium">
              <FileText className="h-4 w-4 text-muted-foreground" />
              Select Subject
            </Label>
            <Select
              value={formData.subject}
              onValueChange={(value) => setFormData({ ...formData, subject: value })}
            >
              <SelectTrigger id="subject" className="bg-card">
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Selection Type */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Choose Option</Label>
            <RadioGroup
              value={formData.selectionType}
              onValueChange={(value: 'chapter' | 'topic') =>
                setFormData({ ...formData, selectionType: value })
              }
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="chapter" id="by-chapter" />
                <Label htmlFor="by-chapter" className="font-normal cursor-pointer">
                  By Chapter
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="topic" id="by-topic" />
                <Label htmlFor="by-topic" className="font-normal cursor-pointer">
                  By Topic
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Chapter / Topic Selection */}
          {formData.selectionType === 'chapter' ? (
            <div className="space-y-2">
              <Label htmlFor="chapter" className="text-sm font-medium">
                Select Chapter
              </Label>
              <Select
                value={formData.chapter}
                onValueChange={(value) => setFormData({ ...formData, chapter: value })}
              >
                <SelectTrigger id="chapter" className="bg-card">
                  <SelectValue placeholder="Select chapter" />
                </SelectTrigger>
                <SelectContent>
                  {chapters.map((ch) => (
                    <SelectItem key={ch.id} value={ch.id}>
                      {ch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="topic" className="text-sm font-medium">
                Enter Topic
              </Label>
              <Input
                id="topic"
                value={formData.subTopic}
                onChange={(e) => setFormData({ ...formData, subTopic: e.target.value })}
                placeholder="e.g., Photosynthesis, Fractions"
                className="bg-card"
              />
            </div>
          )}

          {/* Sub Topic (Optional) */}
          {formData.selectionType === 'chapter' && (
            <div className="space-y-2">
              <Label htmlFor="subtopic" className="text-sm font-medium text-muted-foreground">
                Sub Topic (Optional)
              </Label>
              <Input
                id="subtopic"
                value={formData.subTopic}
                onChange={(e) => setFormData({ ...formData, subTopic: e.target.value })}
                placeholder="Specific focus within chapter"
                className="bg-card"
              />
            </div>
          )}

          {/* Duration and Class Strength */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration" className="flex items-center gap-2 text-sm font-medium">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Duration (minutes)
              </Label>
              <Input
                id="duration"
                type="number"
                min={15}
                max={120}
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 45 })}
                className="bg-card"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="classStrength" className="flex items-center gap-2 text-sm font-medium">
                <Users className="h-4 w-4 text-muted-foreground" />
                Class Strength
              </Label>
              <Input
                id="classStrength"
                type="number"
                min={1}
                max={100}
                value={formData.classStrength}
                onChange={(e) =>
                  setFormData({ ...formData, classStrength: parseInt(e.target.value) || 30 })
                }
                className="bg-card"
              />
            </div>
          </div>

          {/* Output Style */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Lightbulb className="h-4 w-4 text-muted-foreground" />
              Output Style
            </Label>
            <RadioGroup
              value={formData.outputStyle}
              onValueChange={(value: 'concise' | 'detailed' | 'activity-based') =>
                setFormData({ ...formData, outputStyle: value })
              }
              className="grid grid-cols-1 sm:grid-cols-3 gap-3"
            >
              <Label
                htmlFor="style-concise"
                className="flex items-center gap-3 rounded-lg border border-border p-3 cursor-pointer hover:bg-muted/50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5"
              >
                <RadioGroupItem value="concise" id="style-concise" />
                <div>
                  <span className="font-medium text-sm">Concise</span>
                  <p className="text-xs text-muted-foreground">Quick overview</p>
                </div>
              </Label>
              <Label
                htmlFor="style-detailed"
                className="flex items-center gap-3 rounded-lg border border-border p-3 cursor-pointer hover:bg-muted/50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5"
              >
                <RadioGroupItem value="detailed" id="style-detailed" />
                <div>
                  <span className="font-medium text-sm">Detailed</span>
                  <p className="text-xs text-muted-foreground">Full breakdown</p>
                </div>
              </Label>
              <Label
                htmlFor="style-activity"
                className="flex items-center gap-3 rounded-lg border border-border p-3 cursor-pointer hover:bg-muted/50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5"
              >
                <RadioGroupItem value="activity-based" id="style-activity" />
                <div>
                  <span className="font-medium text-sm">Activity</span>
                  <p className="text-xs text-muted-foreground">Hands-on focus</p>
                </div>
              </Label>
            </RadioGroup>
          </div>

          {/* Optional Toggles */}
          <div className="flex flex-wrap gap-6 pt-2">
            <div className="flex items-center gap-3">
              <Switch
                id="quiz"
                checked={formData.includeQuiz}
                onCheckedChange={(checked) => setFormData({ ...formData, includeQuiz: checked })}
              />
              <Label htmlFor="quiz" className="font-normal cursor-pointer">
                Include Quiz
              </Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                id="assignment"
                checked={formData.includeAssignment}
                onCheckedChange={(checked) => setFormData({ ...formData, includeAssignment: checked })}
              />
              <Label htmlFor="assignment" className="font-normal cursor-pointer">
                Include Assignment
              </Label>
            </div>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full mt-6" size="lg">
            Generate Learning Outcomes
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
