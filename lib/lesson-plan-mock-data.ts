import type { LearningOutcome, LessonSkeleton, DetailedLessonPlan } from './lesson-plan-types';

export const mockLearningOutcomes: LearningOutcome[] = [
  {
    id: '1',
    outcome:
      'Students will be able to identify and describe the basic characteristics of living and non-living things using at least three distinguishing features.',
    bloomsLevel: 'Understand',
    isApproved: true,
  },
  {
    id: '2',
    outcome:
      'Students will be able to classify given objects into living and non-living categories with 90% accuracy.',
    bloomsLevel: 'Apply',
    isApproved: true,
  },
  {
    id: '3',
    outcome:
      'Students will be able to compare and contrast living and non-living things using a Venn diagram.',
    bloomsLevel: 'Analyze',
    isApproved: true,
  },
  {
    id: '4',
    outcome:
      'Students will be able to give real-world examples of living and non-living things from their environment.',
    bloomsLevel: 'Apply',
    isApproved: false,
  },
];

export const mockLessonSkeleton: LessonSkeleton = {
  title: 'Understanding Living and Non-Living Things',
  totalDuration: '45 minutes',
  isApproved: false,
  sections: [
    {
      id: '1',
      phase: 'Entry Task',
      title: 'Picture Sort Challenge',
      duration: '5 mins',
      description:
        'Students sort picture cards into two groups based on what they think makes something "alive." This activates prior knowledge and creates curiosity.',
    },
    {
      id: '2',
      phase: 'Concept Teaching',
      title: 'Characteristics of Living Things',
      duration: '15 mins',
      description:
        'Teacher explains the key characteristics: movement, growth, reproduction, respiration, response to stimuli, nutrition, and excretion. Uses interactive examples and real objects.',
    },
    {
      id: '3',
      phase: 'Guided Practice',
      title: 'Classification Activity',
      duration: '12 mins',
      description:
        'In pairs, students classify items using a worksheet. Teacher circulates to provide support and ask probing questions.',
    },
    {
      id: '4',
      phase: 'Exit Ticket',
      title: 'Quick Check',
      duration: '5 mins',
      description:
        'Students answer 3 quick questions to demonstrate understanding of the key concepts.',
    },
    {
      id: '5',
      phase: 'Closure',
      title: 'Mind Map Summary',
      duration: '8 mins',
      description:
        'Class collaboratively builds a mind map on the board, then students copy key points into their notebooks.',
    },
  ],
};

export const mockDetailedPlan: DetailedLessonPlan = {
  title: 'Understanding Living and Non-Living Things',
  gradeSubject: 'Grade 3 • Science • CBSE',
  duration: '45 minutes',
  learningOutcomes: [
    'Students will be able to identify and describe the basic characteristics of living and non-living things using at least three distinguishing features.',
    'Students will be able to classify given objects into living and non-living categories with 90% accuracy.',
    'Students will be able to compare and contrast living and non-living things using a Venn diagram.',
  ],
  prerequisiteCompetencies: [
    'Basic observation skills - students can describe what they see',
    'Familiarity with common objects and animals in their environment',
    'Ability to work in pairs and participate in group discussions',
  ],
  entryTask: {
    id: 'entry-1',
    name: 'Picture Sort Challenge',
    description:
      'Students receive a set of 8 picture cards showing various objects (plant, rock, bird, toy car, fish, chair, butterfly, pencil) and sort them into two groups based on their initial understanding of "alive" vs "not alive."',
    duration: '5 mins',
    materials: ['Picture cards (8 per pair)', 'Sorting mat with two sections'],
    teacherActions: [
      'Distribute picture cards and sorting mats to pairs',
      'Give clear instructions without revealing criteria',
      'Observe how students are grouping items',
      'Note common misconceptions for addressing later',
    ],
    studentActions: [
      'Work with partner to sort cards',
      'Discuss reasoning for each placement',
      'Be ready to explain their grouping logic',
    ],
    cfu: 'Ask 2-3 pairs to share their grouping criteria. "What made you put these together?"',
  },
  conceptTeaching: [
    {
      id: 'concept-1',
      name: 'Introduction to Living Things',
      description:
        'Teacher introduces the scientific definition of living things using the MRS GREN acronym (Movement, Respiration, Sensitivity, Growth, Reproduction, Excretion, Nutrition).',
      duration: '8 mins',
      materials: ['Whiteboard', 'Real plant', 'Picture of lifecycle'],
      teacherActions: [
        'Write MRS GREN on board',
        'Explain each characteristic with simple examples',
        'Use the real plant to demonstrate growth and nutrition',
      ],
      studentActions: [
        'Listen and take notes',
        'Respond to teacher questions',
        'Share observations about the plant',
      ],
      cfu: 'Thumbs up/down: "Is a growing tree showing one characteristic of living things?"',
    },
    {
      id: 'concept-2',
      name: 'Understanding Non-Living Things',
      description:
        'Teacher explains how non-living things differ - they do not have all the characteristics of living things. Some may have one or two (like a car that moves) but not all.',
      duration: '7 mins',
      materials: ['Various objects (rock, toy car, book)'],
      teacherActions: [
        'Show each object and discuss which MRS GREN characteristics it lacks',
        'Address common misconception: "Does a car that moves mean it is alive?"',
        'Create comparison chart on board',
      ],
      studentActions: [
        'Analyze objects using the criteria learned',
        'Participate in discussion',
        'Ask clarifying questions',
      ],
      cfu: 'Quick poll: "How many characteristics of MRS GREN does a rock have?" (Answer: 0)',
    },
  ],
  guidedPractice: {
    id: 'practice-1',
    name: 'Classification Worksheet Activity',
    description:
      'Students work in pairs to complete a classification worksheet where they categorize 10 items and explain their reasoning using at least one MRS GREN characteristic.',
    duration: '12 mins',
    materials: ['Classification worksheet', 'Pencils', 'Reference chart of MRS GREN'],
    teacherActions: [
      'Distribute worksheets and explain task',
      'Circulate and ask probing questions',
      'Support struggling pairs with guiding questions',
      'Challenge advanced pairs with tricky examples (seeds, eggs)',
    ],
    studentActions: [
      'Read each item carefully',
      'Discuss with partner before writing',
      'Use MRS GREN criteria to justify answers',
      'Complete all 10 items',
    ],
    cfu: 'Stop after item 5 and do a quick whole-class check on the trickiest item.',
  },
  exitTicket: {
    duration: '5 mins',
    questions: [
      'Name any TWO characteristics of living things (2 marks)',
      'Is a robot a living thing? Why or why not? (2 marks)',
      'Draw and label one living thing and one non-living thing you see in your classroom. (1 mark)',
    ],
  },
  closure: {
    mindMap:
      '                    LIVING vs NON-LIVING\n                           |\n          ┌────────────────┼────────────────┐\n          │                                 │\n     LIVING THINGS                   NON-LIVING THINGS\n          │                                 │\n    ┌─────┼─────┐                    ┌─────┼─────┐\n    │     │     │                    │     │     │\n  Move  Grow  Breathe            No growth  No breathing\n    │     │     │                    │     │     │\n Examples:                        Examples:\n Plants, Animals,                Rocks, Books,\n Humans, Insects                 Chairs, Toys',
    summary:
      'Today we learned that living things have special characteristics remembered by MRS GREN. Non-living things do not have all these characteristics. We can use this knowledge to classify anything in our world!',
  },
  assessment: {
    quiz: [
      'Which of these is NOT a characteristic of living things? a) Growth b) Movement c) Made of metal d) Reproduction',
      'A seed is: a) Living b) Non-living c) Neither',
      'What does the "G" in MRS GREN stand for?',
    ],
    assignment:
      'Take a nature walk at home or in your neighborhood. Make a list of 5 living things and 5 non-living things you observe. For each living thing, write which MRS GREN characteristic you can see.',
    hotsExtension:
      'Is fire a living thing? It moves, it grows, it needs "food" (fuel). Write a paragraph explaining your reasoning using what you learned today.',
  },
};
