export interface WorksheetKit {
  id:          string;
  title:       string;
  subtitle:    string;
  description: string;
  color:       string;
  textColor:   string;
  status:      'available' | 'coming-soon';
  audience:    string;
  count:       number;
  contents:    string[];
}

export const worksheetKits: WorksheetKit[] = [
  {
    id:          'classroom',
    title:       'Classroom Kit',
    subtitle:    'For secondary school facilitation',
    description: 'Eight structured sessions, each targeting one cognitive move. Designed for classes of 25–40 students with a single facilitator. No technology required.',
    color:       '#465BA4',
    textColor:   '#FFFFFF',
    status:      'coming-soon',
    audience:    'Age 15–17 · Class setting',
    count:       8,
    contents:    ['8 Worksheets', 'Facilitator Guide', 'Assessment Rubric', 'Reflection Cards'],
  },
  {
    id:          'home',
    title:       'Home Kit',
    subtitle:    'For independent learners and families',
    description: 'Self-directed worksheets for students working alone or with a parent. Each sheet takes 15–20 minutes and requires only a pen. Covers all five TARK moves.',
    color:       '#4DB49F',
    textColor:   '#FFFFFF',
    status:      'coming-soon',
    audience:    'Age 14–22 · Home use',
    count:       10,
    contents:    ['10 Worksheets', 'Self-Assessment Tool', 'Parent Guide'],
  },
  {
    id:          'financial-literacy',
    title:       'Financial Literacy Kit',
    subtitle:    'Applied thinking for money decisions',
    description: 'TARK moves applied to real financial scenarios: loan decisions, insurance choices, salary negotiation, and savings trade-offs. Grounded in everyday Indian contexts.',
    color:       '#FFD167',
    textColor:   '#1A1A1A',
    status:      'coming-soon',
    audience:    'Age 18–22 · College / Young adults',
    count:       6,
    contents:    ['6 Worksheets', 'Case Scenarios', 'Decision Templates'],
  },
  {
    id:          'digital-literacy',
    title:       'Digital Literacy Kit',
    subtitle:    'Thinking clearly in information environments',
    description: 'Tools for evaluating viral claims, tracing algorithmic bias, and committing to positions online. Addresses the specific cognitive challenges of digital information.',
    color:       '#E27238',
    textColor:   '#FFFFFF',
    status:      'coming-soon',
    audience:    'Age 15–20 · Any context',
    count:       7,
    contents:    ['7 Worksheets', 'Bias Reference Card', 'Source Audit Template'],
  },
  {
    id:          'civic-literacy',
    title:       'Civic Literacy Kit',
    subtitle:    'Thinking through public and political life',
    description: 'Worksheets for reasoning about civic issues: policy trade-offs, historical narratives, community decisions. Emphasises stakeholder mapping and perspective-taking.',
    color:       '#DA3832',
    textColor:   '#FFFFFF',
    status:      'coming-soon',
    audience:    'Age 16–22 · Civic education',
    count:       8,
    contents:    ['8 Worksheets', 'Stakeholder Maps', 'Debate Structure Cards'],
  },
  {
    id:          'real-life',
    title:       'Real Life Kit',
    subtitle:    'For messy, high-stakes personal decisions',
    description: 'The hardest kit. No hypotheticals. Students bring a real current decision and work through it using all five TARK moves. Requires facilitation or strong self-awareness.',
    color:       '#1A1A1A',
    textColor:   '#FFFFFF',
    status:      'coming-soon',
    audience:    'Age 17+ · Facilitated group',
    count:       5,
    contents:    ['5 Worksheets', 'Full TARK Walkthrough', 'Commitment Contract'],
  },
];
