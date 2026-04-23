'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { ArrowRight, BookOpen, GraduationCap, Clock, Users, FileText, Lightbulb, BarChart3, Brain, AlertTriangle } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import type { LessonParameters, PreviousKnowledgeLevel } from '@/lib/lesson-plan-types';

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

const previousKnowledgeLevels: { value: PreviousKnowledgeLevel; label: string }[] = [
  { value: 'no-prior-knowledge', label: 'No prior knowledge' },
  { value: 'limited-familiarity', label: 'Limited familiarity' },
  { value: 'basic-understanding', label: 'Basic understanding' },
  { value: 'moderate-understanding', label: 'Moderate understanding' },
  { value: 'strong-understanding', label: 'Strong understanding' },
];

// Competencies mapped by subject and chapter - dynamically populated based on selections
const competenciesMap: Record<string, Record<string, string[]>> = {
  Science: {
    '1': [
      'Can follow basic scientific instructions',
      'Can observe and describe simple phenomena',
      'Can ask basic questions about nature',
      'Can identify common objects in their environment',
      'Can use simple science vocabulary',
    ],
    '2': [
      'Can identify living and non-living things',
      'Can observe and describe objects',
      'Can classify by simple properties',
      'Can use basic science vocabulary',
      'Can answer simple why/how questions',
    ],
    '3': [
      'Can explain basic scientific concepts',
      'Can conduct simple experiments with guidance',
      'Can record observations accurately',
      'Can make basic predictions',
      'Can understand cause and effect relationships',
    ],
    '4': [
      'Can apply scientific knowledge to real-world situations',
      'Can design simple experiments',
      'Can analyze data and draw conclusions',
      'Can explain scientific reasoning',
      'Can connect concepts across topics',
    ],
    '5': [
      'Can synthesize information from multiple sources',
      'Can evaluate scientific claims',
      'Can solve complex problems independently',
      'Can communicate scientific ideas clearly',
      'Can think critically about scientific issues',
    ],
  },
  Mathematics: {
    '1': [
      'Can count numbers up to 100',
      'Can recognize basic shapes',
      'Can compare quantities (more/less)',
      'Can understand basic patterns',
      'Can follow step-by-step instructions',
    ],
    '2': [
      'Can perform basic addition and subtraction',
      'Can understand place value',
      'Can measure using standard units',
      'Can read simple graphs and charts',
      'Can solve word problems with guidance',
    ],
    '3': [
      'Can multiply and divide single digits',
      'Can work with fractions and decimals',
      'Can calculate perimeter and area',
      'Can interpret data from tables',
      'Can apply math to real situations',
    ],
    '4': [
      'Can solve multi-step problems',
      'Can work with algebraic expressions',
      'Can understand geometric transformations',
      'Can analyze statistical data',
      'Can explain mathematical reasoning',
    ],
    '5': [
      'Can solve complex equations',
      'Can prove mathematical theorems',
      'Can apply advanced problem-solving strategies',
      'Can connect mathematical concepts',
      'Can evaluate mathematical arguments',
    ],
  },
  English: {
    '1': [
      'Can recognize letters and basic sounds',
      'Can read simple words',
      'Can write basic sentences',
      'Can follow spoken instructions',
      'Can express simple ideas verbally',
    ],
    '2': [
      'Can read grade-level text fluently',
      'Can identify main ideas in a passage',
      'Can use proper punctuation',
      'Can write coherent paragraphs',
      'Can participate in class discussions',
    ],
    '3': [
      'Can analyze text structure',
      'Can make inferences from reading',
      'Can use varied vocabulary in writing',
      'Can edit and revise their work',
      'Can present ideas clearly',
    ],
    '4': [
      'Can interpret figurative language',
      'Can write persuasive essays',
      'Can conduct research independently',
      'Can synthesize information from multiple texts',
      'Can debate and defend positions',
    ],
    '5': [
      'Can analyze author\'s purpose and style',
      'Can write sophisticated compositions',
      'Can evaluate credibility of sources',
      'Can engage in literary criticism',
      'Can communicate complex ideas effectively',
    ],
  },
  'Social Studies': {
    '1': [
      'Can identify self and family',
      'Can understand basic community roles',
      'Can follow classroom rules',
      'Can use simple maps',
      'Can describe daily routines',
    ],
    '2': [
      'Can understand historical timelines',
      'Can identify geographic features',
      'Can describe different cultures',
      'Can understand basic civic concepts',
      'Can analyze simple historical events',
    ],
    '3': [
      'Can compare different time periods',
      'Can read and interpret maps',
      'Can understand economic concepts',
      'Can explain government functions',
      'Can research historical topics',
    ],
    '4': [
      'Can analyze primary sources',
      'Can understand global connections',
      'Can evaluate historical perspectives',
      'Can explain cause and effect in history',
      'Can participate in civic activities',
    ],
    '5': [
      'Can conduct historical research',
      'Can analyze complex social issues',
      'Can evaluate policy decisions',
      'Can synthesize multiple perspectives',
      'Can propose solutions to social problems',
    ],
  },
  Hindi: {
    '1': [
      'Can recognize Hindi alphabet',
      'Can read simple Hindi words',
      'Can write basic Hindi sentences',
      'Can understand spoken Hindi',
      'Can express simple ideas in Hindi',
    ],
    '2': [
      'Can read Hindi passages fluently',
      'Can use proper Hindi grammar',
      'Can write coherent paragraphs in Hindi',
      'Can understand Hindi poetry',
      'Can participate in Hindi conversations',
    ],
    '3': [
      'Can analyze Hindi text structure',
      'Can write creative compositions',
      'Can use advanced vocabulary',
      'Can interpret literary devices',
      'Can present in Hindi confidently',
    ],
    '4': [
      'Can critically analyze Hindi literature',
      'Can write persuasive Hindi essays',
      'Can understand regional variations',
      'Can translate between Hindi and English',
      'Can debate in Hindi',
    ],
    '5': [
      'Can appreciate classical Hindi literature',
      'Can write sophisticated Hindi prose',
      'Can analyze linguistic evolution',
      'Can engage in literary criticism',
      'Can communicate complex ideas in Hindi',
    ],
  },
  'Computer Science': {
    '1': [
      'Can identify computer parts',
      'Can use mouse and keyboard',
      'Can navigate basic software',
      'Can follow digital instructions',
      'Can understand basic tech vocabulary',
    ],
    '2': [
      'Can create simple documents',
      'Can use search engines effectively',
      'Can understand file organization',
      'Can follow basic coding sequences',
      'Can practice digital safety',
    ],
    '3': [
      'Can write simple programs',
      'Can debug basic code errors',
      'Can use conditional statements',
      'Can create presentations',
      'Can understand algorithms',
    ],
    '4': [
      'Can design complex algorithms',
      'Can use loops and functions',
      'Can work with data structures',
      'Can create interactive programs',
      'Can collaborate on coding projects',
    ],
    '5': [
      'Can develop complete applications',
      'Can optimize code efficiency',
      'Can implement object-oriented concepts',
      'Can analyze system requirements',
      'Can solve complex computational problems',
    ],
  },
};

export function ParametersForm({ onSubmit }: ParametersFormProps) {
  const [formData, setFormData] = useState<LessonParameters>({
    board: 'CBSE',
    grade: '3',
    subject: 'Science',
    selectionType: 'chapter',
    chapter: '2',
    subTopic: '',
    previousKnowledge: 'basic-understanding',
    previousKnowledgeNotes: '',
    missingCompetencies: [],
    duration: 45,
    classStrength: 30,
    includeQuiz: false,
    includeAssignment: false,
    outputStyle: 'detailed',
  });

  // Get available competencies based on current subject and chapter
  const availableCompetencies =
    competenciesMap[formData.subject]?.[formData.chapter] ||
    competenciesMap[formData.subject]?.['1'] ||
    [];

  // Handle competency toggle
  const handleCompetencyToggle = (competency: string) => {
    setFormData((prev) => ({
      ...prev,
      missingCompetencies: prev.missingCompetencies.includes(competency)
        ? prev.missingCompetencies.filter((c) => c !== competency)
        : [...prev.missingCompetencies, competency],
    }));
  };

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

          {/* Class Readiness Section */}
          <div className="space-y-4 rounded-lg border border-border p-4 bg-muted/30">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              <span className="font-medium text-base">Class Readiness</span>
            </div>

            {/* Previous Knowledge */}
            <div className="space-y-2">
              <Label htmlFor="previousKnowledge" className="text-sm font-medium">
                Previous Knowledge Level
              </Label>
              <Select
                value={formData.previousKnowledge}
                onValueChange={(value: PreviousKnowledgeLevel) =>
                  setFormData({ ...formData, previousKnowledge: value })
                }
              >
                <SelectTrigger id="previousKnowledge" className="bg-card">
                  <SelectValue placeholder="Select knowledge level" />
                </SelectTrigger>
                <SelectContent>
                  {previousKnowledgeLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Previous Knowledge Notes */}
            <div className="space-y-2">
              <Label htmlFor="previousKnowledgeNotes" className="text-sm font-medium text-muted-foreground">
                Additional Notes (Optional)
              </Label>
              <Textarea
                id="previousKnowledgeNotes"
                value={formData.previousKnowledgeNotes}
                onChange={(e) => setFormData({ ...formData, previousKnowledgeNotes: e.target.value })}
                placeholder="Any specific observations about student readiness..."
                className="bg-card resize-none"
                rows={2}
              />
            </div>

            {/* Missing Competencies */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Missing Competencies
                <span className="text-xs text-muted-foreground font-normal">(Select gaps observed)</span>
              </Label>
              {availableCompetencies.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto rounded-md border border-border bg-card p-3">
                  {availableCompetencies.map((competency, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Checkbox
                        id={`competency-${index}`}
                        checked={formData.missingCompetencies.includes(competency)}
                        onCheckedChange={() => handleCompetencyToggle(competency)}
                        className="mt-0.5"
                      />
                      <Label
                        htmlFor={`competency-${index}`}
                        className="text-sm font-normal cursor-pointer leading-relaxed"
                      >
                        {competency}
                      </Label>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  Select a subject and chapter to see available competencies.
                </p>
              )}
              {formData.missingCompetencies.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  {formData.missingCompetencies.length} competenc{formData.missingCompetencies.length === 1 ? 'y' : 'ies'} selected
                </p>
              )}
            </div>
          </div>

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
