'use client';

import { useState, useRef } from 'react';

// TypeScript declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { ArrowRight, BookOpen, GraduationCap, Clock, Users, FileText, Lightbulb, BarChart3, Brain, AlertTriangle, Plus, X, CheckCircle2, Target, Lock, Calendar, Hash, Mic, Camera, Upload, Paperclip, Image as ImageIcon, ChevronRight, StopCircle } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import type { LessonParameters, PreviousKnowledgeLevel, NextSessionRecommendation, SessionType } from '@/lib/lesson-plan-types';

// Teacher proficiency levels for RBAC control
type TeacherProficiency = 'beginner' | 'intermediate' | 'advanced' | 'expert';

interface ParametersFormProps {
  onSubmit: (params: LessonParameters) => void;
  teacherProficiency?: TeacherProficiency; // Controls edit access for PK
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

const nextSessionRecommendations: { value: NextSessionRecommendation; label: string; description: string }[] = [
  { value: 'reteach', label: 'Reteach', description: 'Start over and teach the concept again from the beginning' },
  { value: 'reinforce', label: 'Reinforce', description: 'Strengthen the concept students mostly know, but have not mastered' },
  { value: 'continue-sequence', label: 'Continue', description: 'Move to the next session as planned' },
  { value: 'enrichment', label: 'Enrich', description: 'Go beyond the current level into deeper or higher-order work' },
];

// Session Context options
const cohorts = [
  { id: 'grade-3-a', name: 'Grade 3 - A' },
  { id: 'grade-3-b', name: 'Grade 3 - B' },
  { id: 'grade-3-c', name: 'Grade 3 - C' },
  { id: 'grade-4-a', name: 'Grade 4 - A' },
  { id: 'grade-4-b', name: 'Grade 4 - B' },
  { id: 'grade-5-a', name: 'Grade 5 - A' },
];

const semesters = [
  { id: 'semester-1', name: 'Semester 1' },
  { id: 'semester-2', name: 'Semester 2' },
  { id: 'term-1', name: 'Term 1' },
  { id: 'term-2', name: 'Term 2' },
];

const sessionTypes: { value: SessionType; label: string }[] = [
  { value: 'regular', label: 'Regular Curricular Session' },
  { value: 'remedial', label: 'Remedial Class' },
  { value: 'revision', label: 'Revision Class' },
];

// Required Previous Knowledge competencies (recommendations based on subject/chapter)
const requiredPKMap: Record<string, Record<string, string[]>> = {
  Science: {
    '1': ['Basic observation skills', 'Curiosity about surroundings'],
    '2': ['Understanding of living vs non-living', 'Basic classification skills', 'Simple vocabulary for describing objects'],
    '3': ['Knowledge of basic scientific method', 'Understanding of measurements', 'Ability to record observations'],
    '4': ['Understanding of variables in experiments', 'Data interpretation basics', 'Scientific reasoning skills'],
    '5': ['Critical thinking abilities', 'Research skills', 'Ability to synthesize information'],
  },
  Mathematics: {
    '1': ['Number recognition 1-20', 'Basic counting skills', 'Shape recognition'],
    '2': ['Single digit addition/subtraction', 'Place value understanding', 'Basic measurement concepts'],
    '3': ['Multiplication tables up to 5', 'Fraction concepts', 'Basic geometry knowledge'],
    '4': ['Multi-digit operations', 'Decimal understanding', 'Basic algebraic thinking'],
    '5': ['Equation solving', 'Geometric proofs basics', 'Statistical concepts'],
  },
  English: {
    '1': ['Alphabet recognition', 'Basic phonics', 'Simple word reading'],
    '2': ['Sentence reading fluency', 'Basic punctuation knowledge', 'Paragraph comprehension'],
    '3': ['Text structure understanding', 'Vocabulary building', 'Writing coherent paragraphs'],
    '4': ['Literary analysis basics', 'Essay structure knowledge', 'Research skills'],
    '5': ['Critical reading skills', 'Advanced composition', 'Source evaluation'],
  },
};

// Achieved Previous Knowledge competencies (what students have mastered)
const achievedPKMap: Record<string, Record<string, string[]>> = {
  Science: {
    '1': ['Can name common objects', 'Shows interest in nature'],
    '2': ['Identifies plants and animals', 'Describes object properties', 'Uses science vocabulary'],
    '3': ['Conducts guided experiments', 'Records observations', 'Makes predictions'],
    '4': ['Designs simple experiments', 'Analyzes basic data', 'Explains scientific concepts'],
    '5': ['Evaluates scientific claims', 'Synthesizes information', 'Communicates findings'],
  },
  Mathematics: {
    '1': ['Counts to 100', 'Identifies shapes', 'Compares quantities'],
    '2': ['Adds and subtracts within 20', 'Understands place value', 'Reads simple graphs'],
    '3': ['Multiplies and divides', 'Works with fractions', 'Calculates perimeter'],
    '4': ['Solves multi-step problems', 'Uses algebraic expressions', 'Analyzes data'],
    '5': ['Solves equations', 'Proves theorems', 'Applies problem-solving strategies'],
  },
  English: {
    '1': ['Recognizes all letters', 'Reads simple words', 'Writes name'],
    '2': ['Reads fluently', 'Uses punctuation', 'Writes paragraphs'],
    '3': ['Analyzes text structure', 'Uses varied vocabulary', 'Edits own work'],
    '4': ['Writes persuasive essays', 'Conducts research', 'Debates effectively'],
    '5': ['Analyzes literature critically', 'Writes sophisticated compositions', 'Evaluates sources'],
  },
};

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

export function ParametersForm({ onSubmit, teacherProficiency = 'intermediate' }: ParametersFormProps) {
  // RBAC: Only advanced and expert teachers can edit Previous Knowledge
  const canEditPK = teacherProficiency === 'advanced' || teacherProficiency === 'expert';

  const [formData, setFormData] = useState<LessonParameters>({
    board: 'CBSE',
    grade: '3',
    subject: 'Science',
    selectionType: 'chapter',
    chapter: '2',
    subTopic: '',
    cohort: '',
    semester: '',
    sessionNumber: 1,
    sessionType: 'regular',
    previousKnowledge: 'basic-understanding',
    nextSessionRecommendation: 'continue-sequence',
    previousKnowledgeNotes: '',
    missingCompetencies: [],
    requiredCompetencies: [],
    achievedCompetencies: [],
    duration: 45,
    classStrength: 30,
    includeQuiz: false,
    includeAssignment: false,
    outputStyle: 'detailed',
  });

  // Validation state for Session Context
  const [validationErrors, setValidationErrors] = useState<{
    cohort?: string;
    semester?: string;
    sessionNumber?: string;
    sessionType?: string;
  }>({});

  // State for custom competency input
  const [newCustomCompetency, setNewCustomCompetency] = useState('');
  const [customCompetencies, setCustomCompetencies] = useState<string[]>([]);
  
  // State for custom PK competency inputs
  const [newRequiredPK, setNewRequiredPK] = useState('');
  const [newAchievedPK, setNewAchievedPK] = useState('');
  const [customRequiredPK, setCustomRequiredPK] = useState<string[]>([]);
  const [customAchievedPK, setCustomAchievedPK] = useState<string[]>([]);

  // State for topic input with attachments
  const [topicPrompt, setTopicPrompt] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<{ name: string; type: 'pdf' | 'image'; url?: string }[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);

  // Get available competencies based on current subject and chapter
  const availableCompetencies =
    competenciesMap[formData.subject]?.[formData.chapter] ||
    competenciesMap[formData.subject]?.['1'] ||
    [];

  // Get recommended PK competencies based on subject and chapter
  const recommendedRequiredPK =
    requiredPKMap[formData.subject]?.[formData.chapter] ||
    requiredPKMap[formData.subject]?.['1'] ||
    [];

  const recommendedAchievedPK =
    achievedPKMap[formData.subject]?.[formData.chapter] ||
    achievedPKMap[formData.subject]?.['1'] ||
    [];

  // Combined PK lists (recommended + custom)
  const allRequiredPK = [...recommendedRequiredPK, ...customRequiredPK];
  const allAchievedPK = [...recommendedAchievedPK, ...customAchievedPK];

  // Handle competency toggle
  const handleCompetencyToggle = (competency: string) => {
    setFormData((prev) => ({
      ...prev,
      missingCompetencies: prev.missingCompetencies.includes(competency)
        ? prev.missingCompetencies.filter((c) => c !== competency)
        : [...prev.missingCompetencies, competency],
    }));
  };

  // Add custom competency to missing competencies list
  const handleAddCustomCompetency = () => {
    if (newCustomCompetency.trim() && !customCompetencies.includes(newCustomCompetency.trim())) {
      setCustomCompetencies((prev) => [...prev, newCustomCompetency.trim()]);
      setNewCustomCompetency('');
    }
  };

  // Remove custom competency
  const handleRemoveCustomCompetency = (competency: string) => {
    setCustomCompetencies((prev) => prev.filter((c) => c !== competency));
    setFormData((prev) => ({
      ...prev,
      missingCompetencies: prev.missingCompetencies.filter((c) => c !== competency),
    }));
  };

  // Combined competencies list (predefined + custom)
  const allCompetencies = [...availableCompetencies, ...customCompetencies];

  // Handle Required PK toggle
  const handleRequiredPKToggle = (competency: string) => {
    if (!canEditPK) return;
    setFormData((prev) => ({
      ...prev,
      requiredCompetencies: prev.requiredCompetencies.includes(competency)
        ? prev.requiredCompetencies.filter((c) => c !== competency)
        : [...prev.requiredCompetencies, competency],
    }));
  };

  // Handle Achieved PK toggle
  const handleAchievedPKToggle = (competency: string) => {
    if (!canEditPK) return;
    setFormData((prev) => ({
      ...prev,
      achievedCompetencies: prev.achievedCompetencies.includes(competency)
        ? prev.achievedCompetencies.filter((c) => c !== competency)
        : [...prev.achievedCompetencies, competency],
    }));
  };

  // Add custom Required PK
  const handleAddRequiredPK = () => {
    if (!canEditPK) return;
    if (newRequiredPK.trim() && !customRequiredPK.includes(newRequiredPK.trim())) {
      setCustomRequiredPK((prev) => [...prev, newRequiredPK.trim()]);
      setNewRequiredPK('');
    }
  };

  // Remove custom Required PK
  const handleRemoveRequiredPK = (competency: string) => {
    if (!canEditPK) return;
    setCustomRequiredPK((prev) => prev.filter((c) => c !== competency));
    setFormData((prev) => ({
      ...prev,
      requiredCompetencies: prev.requiredCompetencies.filter((c) => c !== competency),
    }));
  };

  // Add custom Achieved PK
  const handleAddAchievedPK = () => {
    if (!canEditPK) return;
    if (newAchievedPK.trim() && !customAchievedPK.includes(newAchievedPK.trim())) {
      setCustomAchievedPK((prev) => [...prev, newAchievedPK.trim()]);
      setNewAchievedPK('');
    }
  };

  // Remove custom Achieved PK
  const handleRemoveAchievedPK = (competency: string) => {
    if (!canEditPK) return;
    setCustomAchievedPK((prev) => prev.filter((c) => c !== competency));
    setFormData((prev) => ({
      ...prev,
      achievedCompetencies: prev.achievedCompetencies.filter((c) => c !== competency),
    }));
  };

  // Handle PDF file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        if (file.type === 'application/pdf') {
          setAttachedFiles((prev) => [...prev, { name: file.name, type: 'pdf' }]);
        }
      });
    }
    e.target.value = '';
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        if (file.type.startsWith('image/')) {
          const url = URL.createObjectURL(file);
          setAttachedFiles((prev) => [...prev, { name: file.name, type: 'image', url }]);
        }
      });
    }
    e.target.value = '';
  };

  // Handle camera capture
  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // Create a video element to capture the image
      const video = document.createElement('video');
      video.srcObject = stream;
      await video.play();
      
      // Create canvas and capture image
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d')?.drawImage(video, 0, 0);
      
      // Stop the stream
      stream.getTracks().forEach(track => track.stop());
      
      // Convert to blob and add to attachments
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          setAttachedFiles((prev) => [...prev, { 
            name: `captured-${Date.now()}.jpg`, 
            type: 'image', 
            url 
          }]);
        }
      }, 'image/jpeg');
    } catch {
      alert('Unable to access camera. Please check permissions.');
    }
  };

  // Handle voice recording
  const handleVoiceRecording = async () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setTopicPrompt((prev) => prev + ' ' + transcript);
      };

      recognition.onerror = () => {
        setIsRecording(false);
        alert('Voice recognition error. Please try again.');
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
      setIsRecording(true);
    } catch {
      alert('Voice recognition is not supported in this browser.');
    }
  };

  // Remove attached file
  const handleRemoveFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate Session Context fields
    const errors: typeof validationErrors = {};
    if (!formData.cohort) errors.cohort = 'Cohort is required';
    if (!formData.semester) errors.semester = 'Semester is required';
    if (!formData.sessionNumber || formData.sessionNumber < 1) errors.sessionNumber = 'Session number must be greater than 0';
    if (!formData.sessionType) errors.sessionType = 'Session type is required';

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    setValidationErrors({});
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
            <div className="space-y-3">
              <Label htmlFor="topic" className="text-sm font-medium">
                Enter Topic or Describe Your Lesson
              </Label>
              
              {/* Rich Input Container */}
              <div className="rounded-lg border border-border bg-card overflow-hidden">
                {/* Attached Files Preview */}
                {attachedFiles.length > 0 && (
                  <div className="p-3 border-b border-border bg-muted/30">
                    <div className="flex flex-wrap gap-2">
                      {attachedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 bg-background rounded-md px-3 py-1.5 border border-border"
                        >
                          {file.type === 'pdf' ? (
                            <FileText className="h-4 w-4 text-red-500" />
                          ) : (
                            <ImageIcon className="h-4 w-4 text-blue-500" />
                          )}
                          <span className="text-sm truncate max-w-32">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(index)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input Row */}
                <div className="flex items-center gap-2 p-2">
                  {/* Plus Button with Dropdown Menu */}
                  <DropdownMenu open={showAttachMenu} onOpenChange={setShowAttachMenu}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 shrink-0 rounded-full hover:bg-muted"
                      >
                        <Plus className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                      <DropdownMenuItem
                        onClick={() => document.getElementById('pdf-upload')?.click()}
                        className="cursor-pointer"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload PDF
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => document.getElementById('image-upload')?.click()}
                        className="cursor-pointer"
                      >
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Add Photos
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleCameraCapture}
                        className="cursor-pointer"
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        Capture Image
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Hidden File Inputs */}
                  <input
                    type="file"
                    id="pdf-upload"
                    accept=".pdf"
                    multiple
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                  />

                  {/* Text Input */}
                  <Input
                    id="topic"
                    value={topicPrompt}
                    onChange={(e) => {
                      setTopicPrompt(e.target.value);
                      setFormData({ ...formData, subTopic: e.target.value });
                    }}
                    placeholder="Ask anything or describe the lesson topic..."
                    className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
                  />

                  {/* Voice Recording Button */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleVoiceRecording}
                    className={`h-9 w-9 shrink-0 rounded-full ${
                      isRecording 
                        ? 'bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400' 
                        : 'hover:bg-muted'
                    }`}
                    title={isRecording ? 'Stop Recording' : 'Start Voice Input'}
                  >
                    {isRecording ? (
                      <StopCircle className="h-5 w-5" />
                    ) : (
                      <Mic className="h-5 w-5" />
                    )}
                  </Button>

                  {/* Dictate Button */}
                  <Button
                    type="button"
                    variant="default"
                    size="sm"
                    onClick={handleVoiceRecording}
                    className={`shrink-0 rounded-full px-3 ${
                      isRecording 
                        ? 'bg-red-600 hover:bg-red-700' 
                        : 'bg-foreground text-background hover:bg-foreground/90'
                    }`}
                  >
                    <Mic className="h-4 w-4 mr-1" />
                    {isRecording ? 'Stop' : 'Dictate'}
                  </Button>
                </div>

                {/* Recording Indicator */}
                {isRecording && (
                  <div className="px-4 py-2 border-t border-border bg-red-50 dark:bg-red-950/20">
                    <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                      </span>
                      Recording... Speak now
                    </div>
                  </div>
                )}
              </div>

              <p className="text-xs text-muted-foreground">
                You can type, upload PDFs, add images, or use voice to describe your lesson topic.
              </p>
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

          {/* Session Context Section */}
          <div className="space-y-4 rounded-lg border border-border p-4 bg-muted/30">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span className="font-medium text-base">Session Context</span>
            </div>

            {/* Cohort and Semester Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Cohort */}
              <div className="space-y-2">
                <Label htmlFor="cohort" className="text-sm font-medium">
                  Select Cohort <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.cohort}
                  onValueChange={(value) => {
                    setFormData({ ...formData, cohort: value });
                    if (validationErrors.cohort) {
                      setValidationErrors((prev) => ({ ...prev, cohort: undefined }));
                    }
                  }}
                >
                  <SelectTrigger id="cohort" className={`bg-card ${validationErrors.cohort ? 'border-destructive' : ''}`}>
                    <SelectValue placeholder="Choose class / section" />
                  </SelectTrigger>
                  <SelectContent>
                    {cohorts.map((cohort) => (
                      <SelectItem key={cohort.id} value={cohort.id}>
                        {cohort.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {validationErrors.cohort && (
                  <p className="text-xs text-destructive">{validationErrors.cohort}</p>
                )}
              </div>

              {/* Semester */}
              <div className="space-y-2">
                <Label htmlFor="semester" className="text-sm font-medium">
                  Select Semester <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.semester}
                  onValueChange={(value) => {
                    setFormData({ ...formData, semester: value });
                    if (validationErrors.semester) {
                      setValidationErrors((prev) => ({ ...prev, semester: undefined }));
                    }
                  }}
                >
                  <SelectTrigger id="semester" className={`bg-card ${validationErrors.semester ? 'border-destructive' : ''}`}>
                    <SelectValue placeholder="Choose semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {semesters.map((sem) => (
                      <SelectItem key={sem.id} value={sem.id}>
                        {sem.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {validationErrors.semester && (
                  <p className="text-xs text-destructive">{validationErrors.semester}</p>
                )}
              </div>
            </div>

            {/* Session Number */}
            <div className="space-y-2">
              <Label htmlFor="sessionNumber" className="flex items-center gap-2 text-sm font-medium">
                <Hash className="h-4 w-4 text-muted-foreground" />
                Session Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="sessionNumber"
                type="number"
                min={1}
                value={formData.sessionNumber}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  setFormData({ ...formData, sessionNumber: value });
                  if (validationErrors.sessionNumber && value >= 1) {
                    setValidationErrors((prev) => ({ ...prev, sessionNumber: undefined }));
                  }
                }}
                placeholder="e.g. 4"
                className={`bg-card max-w-32 ${validationErrors.sessionNumber ? 'border-destructive' : ''}`}
              />
              {validationErrors.sessionNumber && (
                <p className="text-xs text-destructive">{validationErrors.sessionNumber}</p>
              )}
            </div>

            {/* Session Type */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                Session Type <span className="text-destructive">*</span>
              </Label>
              <RadioGroup
                value={formData.sessionType}
                onValueChange={(value: SessionType) => {
                  setFormData({ ...formData, sessionType: value });
                  if (validationErrors.sessionType) {
                    setValidationErrors((prev) => ({ ...prev, sessionType: undefined }));
                  }
                }}
                className="flex flex-wrap gap-4"
              >
                {sessionTypes.map((type) => (
                  <div key={type.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={type.value} id={`session-${type.value}`} />
                    <Label htmlFor={`session-${type.value}`} className="font-normal cursor-pointer">
                      {type.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              {validationErrors.sessionType && (
                <p className="text-xs text-destructive">{validationErrors.sessionType}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Choose whether this session follows the regular curriculum or is intended for reteaching/revision.
              </p>
            </div>
          </div>

          {/* Class Readiness Section */}
          <div className="space-y-4 rounded-lg border border-border p-4 bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                <span className="font-medium text-base">Class Readiness</span>
              </div>
              {!canEditPK && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                  <Lock className="h-3 w-3" />
                  <span>PK editing requires advanced access</span>
                </div>
              )}
            </div>

            {/* Previous Knowledge Section - Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Left: Previous Knowledge Competencies (Required & Achieved) */}
              <div className="lg:col-span-2 space-y-4">
                <Label className="text-sm font-medium">Previous Knowledge Competencies</Label>
                
                {/* Two columns for Required and Achieved */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Required PK */}
                  <div className="space-y-3 rounded-md border border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20 p-3">
                    <Label className="flex items-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-400">
                      <Target className="h-4 w-4" />
                      Required PK
                    </Label>
                    
                    {allRequiredPK.length > 0 ? (
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {allRequiredPK.map((competency, index) => {
                          const isCustom = customRequiredPK.includes(competency);
                          return (
                            <div key={index} className="flex items-start gap-2">
                              <Checkbox
                                id={`required-pk-${index}`}
                                checked={formData.requiredCompetencies.includes(competency)}
                                onCheckedChange={() => handleRequiredPKToggle(competency)}
                                disabled={!canEditPK}
                                className="mt-0.5"
                              />
                              <Label
                                htmlFor={`required-pk-${index}`}
                                className={`text-xs font-normal leading-relaxed flex-1 ${!canEditPK ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                              >
                                {competency}
                              </Label>
                              {isCustom && canEditPK && (
                                <Button
                                  type="button"
                                  size="icon"
                                  variant="ghost"
                                  className="h-4 w-4 shrink-0 text-muted-foreground hover:text-destructive"
                                  onClick={() => handleRemoveRequiredPK(competency)}
                                >
                                  <X className="h-2.5 w-2.5" />
                                </Button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground italic">No recommendations available</p>
                    )}
                    
                    {/* Add custom Required PK */}
                    {canEditPK && (
                      <div className="flex gap-1.5 pt-1">
                        <Input
                          value={newRequiredPK}
                          onChange={(e) => setNewRequiredPK(e.target.value)}
                          placeholder="Add required..."
                          className="bg-card flex-1 text-xs h-7"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddRequiredPK();
                            }
                          }}
                        />
                        <Button
                          type="button"
                          size="icon"
                          variant="outline"
                          className="h-7 w-7"
                          onClick={handleAddRequiredPK}
                          disabled={!newRequiredPK.trim()}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Achieved PK */}
                  <div className="space-y-3 rounded-md border border-green-200 dark:border-green-900 bg-green-50/50 dark:bg-green-950/20 p-3">
                    <Label className="flex items-center gap-2 text-sm font-medium text-green-700 dark:text-green-400">
                      <CheckCircle2 className="h-4 w-4" />
                      Achieved PK
                    </Label>
                    
                    {allAchievedPK.length > 0 ? (
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {allAchievedPK.map((competency, index) => {
                          const isCustom = customAchievedPK.includes(competency);
                          return (
                            <div key={index} className="flex items-start gap-2">
                              <Checkbox
                                id={`achieved-pk-${index}`}
                                checked={formData.achievedCompetencies.includes(competency)}
                                onCheckedChange={() => handleAchievedPKToggle(competency)}
                                disabled={!canEditPK}
                                className="mt-0.5"
                              />
                              <Label
                                htmlFor={`achieved-pk-${index}`}
                                className={`text-xs font-normal leading-relaxed flex-1 ${!canEditPK ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                              >
                                {competency}
                              </Label>
                              {isCustom && canEditPK && (
                                <Button
                                  type="button"
                                  size="icon"
                                  variant="ghost"
                                  className="h-4 w-4 shrink-0 text-muted-foreground hover:text-destructive"
                                  onClick={() => handleRemoveAchievedPK(competency)}
                                >
                                  <X className="h-2.5 w-2.5" />
                                </Button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground italic">No recommendations available</p>
                    )}
                    
                    {/* Add custom Achieved PK */}
                    {canEditPK && (
                      <div className="flex gap-1.5 pt-1">
                        <Input
                          value={newAchievedPK}
                          onChange={(e) => setNewAchievedPK(e.target.value)}
                          placeholder="Add achieved..."
                          className="bg-card flex-1 text-xs h-7"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddAchievedPK();
                            }
                          }}
                        />
                        <Button
                          type="button"
                          size="icon"
                          variant="outline"
                          className="h-7 w-7"
                          onClick={handleAddAchievedPK}
                          disabled={!newAchievedPK.trim()}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              </div>

            {/* Missing Competencies */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Missing Competencies
                <span className="text-xs text-muted-foreground font-normal">(Select gaps)</span>
              </Label>

              {allCompetencies.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto rounded-md border border-border bg-card p-3">
                  {allCompetencies.map((competency, index) => {
                    const isCustom = customCompetencies.includes(competency);
                    return (
                      <div key={index} className="flex items-start gap-3">
                        <Checkbox
                          id={`competency-${index}`}
                          checked={formData.missingCompetencies.includes(competency)}
                          onCheckedChange={() => handleCompetencyToggle(competency)}
                          className="mt-0.5"
                        />
                        <Label
                          htmlFor={`competency-${index}`}
                          className="text-sm font-normal cursor-pointer leading-relaxed flex-1"
                        >
                          {competency}
                        </Label>
                        {isCustom && (
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="h-5 w-5 shrink-0 text-muted-foreground hover:text-destructive"
                            onClick={() => handleRemoveCustomCompetency(competency)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    );
                  })}
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

              {/* Add New Competency Input - Below the list */}
              <div className="flex gap-2 pt-2">
                <Input
                  value={newCustomCompetency}
                  onChange={(e) => setNewCustomCompetency(e.target.value)}
                  placeholder="Add new competency..."
                  className="bg-card flex-1 text-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomCompetency();
                    }
                  }}
                />
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  onClick={handleAddCustomCompetency}
                  disabled={!newCustomCompetency.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Horizontal Divider */}
            <div className="flex items-center gap-4 py-2">
              <div className="flex-1 border-t border-border" />
              <span className="text-xs text-muted-foreground font-medium">OR</span>
              <div className="flex-1 border-t border-border" />
            </div>

            {/* Instructor Assessment of Overall Previous Knowledge Competency */}
            <div className="space-y-4">
              <Label className="text-sm font-medium">
                Instructor Assessment of Overall Previous Knowledge Competency
              </Label>
              
              {/* Flex row with two dropdowns */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Knowledge Level Dropdown */}
                <div className="flex-1 space-y-2">
                  <Label htmlFor="previousKnowledge" className="text-xs text-muted-foreground">
                    Knowledge Level
                  </Label>
                  <Select
                    value={formData.previousKnowledge}
                    onValueChange={(value: PreviousKnowledgeLevel) =>
                      setFormData({ ...formData, previousKnowledge: value })
                    }
                  >
                    <SelectTrigger id="previousKnowledge" className="bg-card">
                      <SelectValue placeholder="Select level" />
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

                {/* Next Session Recommendation Dropdown */}
                <div className="flex-1 space-y-2">
                  <Label htmlFor="nextSessionRecommendation" className="text-xs text-muted-foreground">
                    Next-Session Recommendation
                  </Label>
                  <Select
                    value={formData.nextSessionRecommendation}
                    onValueChange={(value: NextSessionRecommendation) =>
                      setFormData({ ...formData, nextSessionRecommendation: value })
                    }
                  >
                    <SelectTrigger id="nextSessionRecommendation" className="bg-card">
                      <SelectValue placeholder="Select recommendation" />
                    </SelectTrigger>
                    <SelectContent>
                      {nextSessionRecommendations.map((rec) => (
                        <SelectItem key={rec.value} value={rec.value} className="py-2">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-medium">{rec.label}</span>
                            <span className="text-xs text-muted-foreground">{rec.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
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
