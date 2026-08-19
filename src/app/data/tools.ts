export interface Tool {
  id:               string;
  slug:             string;
  name:             string;
  tagline:          string;
  plainDescription: string;
  description:      string;
  howToUse:         string[];
  audience:         string[];
  thinkingPartner:  'YES' | 'PARTIAL' | 'SOLO ONLY';
  tpPrompt:         string;
  example:          string;
  driveUrl:         string;
}

export interface MoveData {
  key:       string;
  label:     string;
  color:     string;
  textColor: string;
  hindi:     string;
  tagline:   string;
  tools:     Tool[];
}

export const toolsData: MoveData[] = [
  {
    key: 'OPEN', label: 'OPEN', color: '#FFD167', textColor: '#1A1A1A',
    hindi: 'खुलना', tagline: 'Challenge the given',
    tools: [
      {
        id: 'open-a', slug: 'reframe-machine',
        name: 'The Reframe Machine',
        tagline: 'Same problem. Five completely different ways of seeing it.',
        plainDescription: 'Use this when your best thinking keeps returning to the same unhelpful answer.',
        description: "When you're stuck in a loop returning to the same unhelpful answer. Best for decisions that feel impossible because you can't see a good option.",
        howToUse: [
          'Write the problem exactly as it\'s in your head.',
          'View it through each of 5 lenses: Money / Feeling / History / Right-Wrong / Flip It — fill one box per lens.',
          'Ask: which surprised me? Which made me uncomfortable? That\'s your new angle.',
        ],
        audience: ['Solo', 'Small Group'],
        thinkingPartner: 'YES',
        tpPrompt: 'Help me use The Reframe Machine on this problem: [your problem]. Walk me through each lens one by one.',
        example: 'A student deciding whether to drop a course views the decision through the "Feeling" lens and realises the real issue is fear of disappointing parents — not the course itself.',
        driveUrl: 'https://drive.google.com/file/d/1pIGQCwVCX9nugilqwpKKkRIjgWyPbxzB/view?usp=drive_link',
      },
      {
        id: 'open-b', slug: 'ruled-out-list',
        name: 'The Ruled-Out List',
        tagline: 'The options you dismissed in 2 seconds are usually the most interesting.',
        plainDescription: 'Use this when your brainstorm keeps producing the same ideas in different clothes.',
        description: 'When brainstorming feels repetitive and you keep circling the same ideas. Especially useful for career decisions, course choices, and creative blocks.',
        howToUse: [
          'Write your question or decision at the top.',
          'List every option you ruled out without really considering — write fast, no filtering.',
          'For each option, tick ONE box: FACT (genuinely impossible) / MY BELIEF (I assumed it wouldn\'t work) / NOT MY RULE (someone else\'s rule I adopted).',
          'Identify the option worth a second look.',
        ],
        audience: ['Solo', 'Small Group'],
        thinkingPartner: 'YES',
        tpPrompt: 'I\'m deciding [X]. Walk me through The Ruled-Out List.',
        example: 'A 17-year-old lists "starting my own thing" as ruled out, ticks "MY BELIEF", and realises the rule came from their father — not from evidence.',
        driveUrl: 'https://drive.google.com/file/d/1Nrh1dJQUPhR_wSZ2BUuOqSJLhWtBjni2/view?usp=drive_link',
      },
      {
        id: 'open-c', slug: 'yes-and',
        name: 'Yes, And...',
        tagline: 'Keep building instead of shutting down. See how far an idea can actually go.',
        plainDescription: 'Use this when an idea feels too weird, too small, or too early to take seriously.',
        description: 'When an idea feels too small, too wild, or too early to take seriously. Great for group brainstorms, early-stage projects, and any moment when someone says "that will never work".',
        howToUse: [
          'Write your starting idea at Step 1 — it can be tiny or half-formed.',
          'Add "Yes, and..." and build on it in Round 2.',
          'Repeat through Round 5 without stopping, without judging.',
          'Read back: the 4th or 5th version is almost always the interesting one.',
        ],
        audience: ['Solo', 'Small Group', 'Large Group'],
        thinkingPartner: 'YES',
        tpPrompt: 'Let\'s play Yes And. My starting idea is [X]. Build it with me — one round at a time.',
        example: 'A design team starts with "what if we made the packaging edible?" Five rounds later they\'re designing a zero-waste food system — a fundamentally different brief.',
        driveUrl: 'https://drive.google.com/file/d/1STbRl5-odxKkgPDGUNlompqzDRIw7av9/view?usp=drive_link',
      },
      {
        id: 'open-d', slug: 'opposite-world',
        name: 'The Opposite World',
        tagline: 'Flip everything. What the opposite reveals about what you were assuming.',
        plainDescription: 'Use this when you want to stress-test a belief by flipping it completely.',
        description: 'When you want to stress-test an idea or belief. When you\'re stuck in one framing and can\'t see another. When a conversation has gone in circles.',
        howToUse: [
          'Write your current belief, plan, or situation in the left box.',
          'Write the complete opposite in the right box.',
          'Ask: what does the opposite world reveal about what I was assuming? Write the insight below both boxes.',
        ],
        audience: ['Solo', 'Small Group'],
        thinkingPartner: 'YES',
        tpPrompt: 'My belief/plan is [X]. Use The Opposite World — flip it and tell me what it reveals.',
        example: 'A student believes "studying more = better grades". The opposite: "studying less = better grades". The reveal: they were confusing hours with quality of attention.',
        driveUrl: 'https://drive.google.com/file/d/1o1NSBYj4ToEqzaYQ_PSZVr2xkM-HlAfY/view?usp=drive_link',
      },
      {
        id: 'open-e', slug: 'question-behind',
        name: 'The Question Behind the Question',
        tagline: 'The question you\'re asking might not be the right one.',
        plainDescription: 'Use this when your question feels important but the answers you get never satisfy you.',
        description: 'When you keep getting answers but none feel satisfying. When your thinking goes in circles. When a question has been nagging you for a long time without resolution.',
        howToUse: [
          'Write the question you\'ve been asking.',
          'Break it apart across three prompts: What does my question assume? / What can\'t be said as an answer to this? / Whose interests does this framing serve?',
          'Write the better question that emerges underneath.',
        ],
        audience: ['Solo'],
        thinkingPartner: 'YES',
        tpPrompt: 'My question is [X]. Help me find the question behind it.',
        example: '"Should I take PCM or PCB?" becomes "Am I choosing a stream or choosing whose expectations to meet?" — a fundamentally different and answerable question.',
        driveUrl: 'https://drive.google.com/file/d/19RSGsRe0qYKk4FQqjIh_qqDwiUmtCjsH/view?usp=drive_link',
      },
    ],
  },
  {
    key: 'TRACE', label: 'TRACE', color: '#E27238', textColor: '#FFFFFF',
    hindi: 'उलझना', tagline: 'Map the system',
    tools: [
      {
        id: 'trace-a', slug: 'the-ripple',
        name: 'The Ripple',
        tagline: 'Your decision doesn\'t just affect you — see how far it actually spreads.',
        plainDescription: 'Use this when you\'re only thinking about the immediate effect of your decision.',
        description: 'When making a decision and only thinking about the immediate effects. Best for any significant personal, professional, or group decision.',
        howToUse: [
          'Write your decision in the centre circle.',
          'Fill Ring 1: what changes this week?',
          'Ring 2: this month.',
          'Ring 3: this year.',
          'Ring 4: in 10 years.',
          'Ask: who shows up in Ring 4 that didn\'t appear in Ring 1?',
        ],
        audience: ['Solo', 'Small Group'],
        thinkingPartner: 'YES',
        tpPrompt: 'I\'m deciding [X]. Walk me through The Ripple — ring by ring.',
        example: 'A student deciding to quit their school debate team maps Ring 4: a future where they never developed the skill to disagree in public — which affects their career, relationships, and civic life.',
        driveUrl: 'https://drive.google.com/file/d/1nO3j_RrbJ1b7as4UEfqR8m2-vBdeAPVu/view?usp=drive_link',
      },
      {
        id: 'trace-b', slug: 'the-domino',
        name: 'The Domino',
        tagline: 'One thing falls — trace every domino after it.',
        plainDescription: 'Use this when you want to see what changes after one thing changes.',
        description: 'When you want to think through what happens if one specific thing changes. For policies, new rules, relationship decisions, and workplace changes.',
        howToUse: [
          'Write the first change (the first domino).',
          'Ask: what does that cause? Write Domino 2.',
          'Repeat through Domino 5.',
          'Look for the domino you didn\'t expect — that\'s where the insight is.',
        ],
        audience: ['Solo', 'Small Group', 'Large Group'],
        thinkingPartner: 'YES',
        tpPrompt: 'My first domino is [X]. Walk me through The Domino — trace what falls next.',
        example: '"School removes free period" → "Students lose social time" → "Social anxiety increases" → "Students disengage from academics" → "School measures drop" — the unexpected Domino 4 reverses the original decision\'s intent.',
        driveUrl: 'https://drive.google.com/file/d/169MhMTlbq8jCvckoX0VSHN6vgmR1oGXJ/view?usp=drive_link',
      },
      {
        id: 'trace-c', slug: 'the-slow-burn',
        name: 'The Slow Burn',
        tagline: 'Most of what matters about a decision happens years later.',
        plainDescription: 'Use this when a decision feels small but you suspect its long-term weight.',
        description: 'When a decision feels small in the moment but you suspect its long-term weight. Great for habits, study choices, digital behaviours, and relationship patterns.',
        howToUse: [
          'Write the decision at the top.',
          'Fill in each time point from left to right: 1 Week / 1 Month / 6 Months / 1 Year / 5 Years / 20 Years.',
          'The last row is almost always the most surprising. That\'s the point.',
        ],
        audience: ['Solo'],
        thinkingPartner: 'YES',
        tpPrompt: 'I\'m deciding [X]. Help me use The Slow Burn — walk me through each time point and push me at the later ones.',
        example: '"I\'ll skip the gym just this week" — at 20 years: a pattern of self-exemption that has compounded across every area requiring discipline. The 1-week decision was about identity, not exercise.',
        driveUrl: 'https://drive.google.com/file/d/11f-mR_fAl-dZADt3OgIWNRrXNP8Wi-yI/view?usp=drive_link',
      },
      {
        id: 'trace-d', slug: 'the-butterfly',
        name: 'The Butterfly Effect',
        tagline: 'Find the smallest change that makes the biggest difference.',
        plainDescription: 'Use this when the obvious lever isn\'t working and you need to find the smallest change that matters.',
        description: 'When you want to know where to intervene in a complex situation. For design, community work, policy thinking, and problem-solving where the obvious lever isn\'t working.',
        howToUse: [
          'Write your situation.',
          'Generate 3 possible small changes (butterflies).',
          'For each: what is the chain between this small change and a large effect?',
          'Pick the smallest one with the highest potential.',
        ],
        audience: ['Solo', 'Small Group'],
        thinkingPartner: 'YES',
        tpPrompt: 'My situation is [X]. Help me use The Butterfly — find the smallest change with the biggest consequence.',
        example: 'A classroom where students don\'t participate. Butterfly: the teacher begins every class by asking for one wrong answer (rewarding error). Chain: psychological safety → participation → depth of thinking → exam performance.',
        driveUrl: 'https://drive.google.com/file/d/1y3oju4wWh1ZFcEUrqb3pOI9ZecPrY9tD/view?usp=drive_link',
      },
      {
        id: 'trace-e', slug: 'before-after',
        name: 'The Before / After',
        tagline: 'Map what actually changed — across every dimension that matters.',
        plainDescription: 'Use this when something just happened and you want to understand what actually shifted.',
        description: 'When something has happened — a decision, a conversation, an event — and you want to understand what really shifted versus what you expected to shift.',
        howToUse: [
          'Name the event at the top.',
          'For each row (Feelings / Relationships / Options / Beliefs), write what was true BEFORE and what\'s true AFTER.',
          'Look for the change you didn\'t expect — that row is the insight.',
        ],
        audience: ['Solo', 'Small Group'],
        thinkingPartner: 'YES',
        tpPrompt: 'Something just happened: [X]. Walk me through The Before/After — help me see what actually changed.',
        example: 'After a difficult conversation with a parent, a student finds that "Options" changed most — not "Feelings". The conversation didn\'t hurt; it closed doors they hadn\'t noticed were open.',
        driveUrl: 'https://drive.google.com/file/d/1bNVKZ0Ra9dxr7H4yDqfPzEozSUSR4fn8/view?usp=drive_link',
      },
    ],
  },
  {
    key: 'SHIFT', label: 'SHIFT', color: '#465BA4', textColor: '#FFFFFF',
    hindi: 'बदलना', tagline: 'Imagine alternatives',
    tools: [
      {
        id: 'shift-a', slug: 'the-swap',
        name: 'The Swap',
        tagline: 'Think from inside someone else\'s actual constraints — not their feelings, their real limits.',
        plainDescription: 'Use this when every option feels the same and you want genuinely different territory.',
        description: 'When you can\'t understand why someone made a choice that seems obviously wrong. For family conflicts, team disagreements, policy thinking, and any situation where you need to understand another person\'s logic.',
        howToUse: [
          'Write your constraints in the left column across 4 dimensions.',
          'Write THEIR constraints in the right column.',
          'Ask: from their constraint set, what does my position look like?',
          'Find the thing you can see from where they stand that\'s invisible from where you are.',
        ],
        audience: ['Solo', 'Small Group'],
        thinkingPartner: 'YES',
        tpPrompt: 'I don\'t understand why [person] made [decision]. Help me use The Swap — build their constraint set with me.',
        example: 'A student can\'t understand why their friend chose a "safe" career. After mapping the friend\'s actual constraints (family debt, no safety net, first-generation college), the choice becomes not just understandable but rational.',
        driveUrl: 'https://drive.google.com/file/d/1S9Tk7WPC7i2_-61D7YXzttgNnq1kK9Y-/view?usp=drive_link',
      },
      {
        id: 'shift-b', slug: 'strongest-case',
        name: 'The Strongest Case',
        tagline: 'Build the most rigorous version of the argument you disagree with.',
        plainDescription: 'Use this when you\'ve made up your mind and want to check you\'re not missing something.',
        description: 'When you find yourself dismissing an opposing view without really engaging with it. Before any significant debate, negotiation, or conversation where you hold a strong position.',
        howToUse: [
          'Write your position.',
          'Write the opposing position.',
          'For the opposing position: find its best evidence, the values behind it, and what it costs the person who holds it.',
          'Write the strongest 3-sentence version you can.',
          'Identify the part you can\'t counter.',
        ],
        audience: ['Solo', 'Small Group'],
        thinkingPartner: 'YES',
        tpPrompt: 'I believe [X] and disagree with [Y]. Help me build The Strongest Case for [Y].',
        example: 'A student who believes "homework should be banned" builds the strongest case for homework: the structure provides security for students from chaotic home environments. They can\'t counter this — and their position becomes more honest.',
        driveUrl: 'https://drive.google.com/file/d/1yO8x8_OokKVL1BASd2rIevJ7j_xrcp-b/view?usp=drive_link',
      },
      {
        id: 'shift-c', slug: 'walk-a-mile',
        name: 'Walk a Mile',
        tagline: 'Step into one person\'s life and describe their Tuesday from the inside.',
        plainDescription: 'Use this when you can\'t understand why someone else thinks the way they do.',
        description: 'When you need a concrete perspective from someone very different from you. Essential for design work, civic decisions, and any situation where you\'re making choices that affect people unlike yourself.',
        howToUse: [
          'Name the person.',
          'Fill in their Tuesday from inside their life: morning routine / worry / who they depend on / what they\'re proudest of / what they find hard / how they see your situation.',
          'Ask: what could I not have understood without walking this mile?',
        ],
        audience: ['Solo'],
        thinkingPartner: 'YES',
        tpPrompt: 'I need to walk a mile as [person]. Interview me as them — ask me questions one at a time to build their Tuesday from the inside.',
        example: 'A policy student walks a mile as a daily-wage construction worker before designing a financial literacy curriculum. They realise the curriculum assumed literacy, stable income, and trust in institutions — none of which apply.',
        driveUrl: 'https://drive.google.com/file/d/1heFnQJ3GKLlg2mwYvvkyslgtA4oflDgQ/view?usp=drive_link',
      },
      {
        id: 'shift-d', slug: 'the-venn',
        name: 'The Venn',
        tagline: 'Where do two very different views actually overlap — even when they seem totally opposed?',
        plainDescription: 'Use this when two ideas seem to contradict but you suspect they don\'t.',
        description: 'When a disagreement feels total and you need to find somewhere to build from. For team conflicts, family disputes, political disagreements, or any situation with two apparently incompatible positions.',
        howToUse: [
          'Label View A and View B.',
          'Fill the left circle (only A believes this).',
          'Fill the right circle (only B believes this).',
          'Find the overlap — things both actually believe, even if expressed differently.',
          'The overlap is where the conversation begins.',
        ],
        audience: ['Small Group', 'Large Group'],
        thinkingPartner: 'YES',
        tpPrompt: 'View A is [X] and View B is [Y]. Help me find the Venn overlap — what do both actually share?',
        example: 'Two students arguing about social media — one thinks it\'s harmful, one thinks it\'s essential. Their Venn overlap: both want genuine connection and both feel social media makes it harder. The disagreement was about means, not ends.',
        driveUrl: 'https://drive.google.com/file/d/1Djn6Kq8pBQKcHzQs1r8ELg6tV7fK9ocX/view?usp=drive_link',
      },
      {
        id: 'shift-e', slug: 'devils-advocate',
        name: 'The Devil\'s Advocate',
        tagline: 'Argue the opposite of your position for 3 minutes. Then see what survives.',
        plainDescription: 'Use this when your group agrees too easily and nobody is pushing back.',
        description: 'When you want to check whether a belief is solid or just comfortable. Before any important decision, conversation, or commitment. When you notice you can\'t explain why you\'re right.',
        howToUse: [
          'Write your actual position.',
          'Argue the OPPOSITE for 3 minutes — write fast, no holding back.',
          'Afterwards: what survived? What didn\'t? What nuance do you now have that you didn\'t before?',
        ],
        audience: ['Solo', 'Small Group'],
        thinkingPartner: 'YES',
        tpPrompt: 'My position is [X]. Be my devil\'s advocate — argue the opposite hard. Then tell me what parts of my position survived.',
        example: 'A student who believes "reservation is unfair" argues the opposite for 3 minutes. What survives: their original position. What\'s new: they now hold it with the specific counter-arguments embedded, making them impossible to dismiss with easy responses.',
        driveUrl: 'https://drive.google.com/file/d/1TdnvMDaKdnlvdEwrJUpPLII4jMpwL3du/view?usp=drive_link',
      },
    ],
  },
  {
    key: 'SURFACE', label: 'SURFACE', color: '#4DB49F', textColor: '#FFFFFF',
    hindi: 'उभरना', tagline: 'See your thinking',
    tools: [
      {
        id: 'surface-a', slug: 'assumption-spotter',
        name: 'The Assumption Spotter',
        tagline: 'Find the hidden "obviously" in your thinking.',
        plainDescription: 'Use this when an argument feels off but you can\'t say exactly why.',
        description: 'Before acting on any plan, argument, or position. When you want to catch what you\'re taking for granted before it becomes a problem.',
        howToUse: [
          'Write your plan or position.',
          'Complete "I\'m assuming that..." at least 5 times — write fast.',
          'For each: rate it ✅ verified / ⚠️ unsure / ❌ probably wrong.',
          'Find the assumption that — if wrong — would most change your plan.',
        ],
        audience: ['Solo', 'Small Group'],
        thinkingPartner: 'YES',
        tpPrompt: 'My plan is [X]. Help me use The Assumption Spotter — generate assumptions I might be making that I haven\'t noticed.',
        example: 'A student presenting a business idea assumes "people will pay for this". The Assumption Spotter surfaces 4 more: that the internet works reliably in the target area, that users trust new apps, that the pricing model is legal, that parents will allow it. Only one is verified.',
        driveUrl: 'https://drive.google.com/file/d/1k2WhfsGHZ4QOoGrJWlv71-O2-p0y8ZnN/view?usp=drive_link',
      },
      {
        id: 'surface-b', slug: 'how-sure',
        name: 'How Sure Are You?',
        tagline: 'Separate what you KNOW from what you THINK from what you\'re GUESSING.',
        plainDescription: 'Use this when you\'re about to commit to something you haven\'t actually examined.',
        description: 'Before any important conversation, decision, or argument where you\'re acting on beliefs you haven\'t examined. When you want to be honest about the confidence level of each thing you believe.',
        howToUse: [
          'List everything you believe about your situation (at least 6 things).',
          'Rate each: ❄️ Just guessing / ⛅ Kind of think so / ☀️ Pretty sure / 🔥 Very confident / 💯 Certain.',
          'Find the belief you\'re most overconfident about.',
        ],
        audience: ['Solo'],
        thinkingPartner: 'YES',
        tpPrompt: 'I believe these things about my situation: [list]. Rate my confidence on each — and challenge the ones I\'m most certain about first.',
        example: 'A student rates "my parents will say no to this" as 💯 Certain. The Thinking Partner asks: when did they last actually say no? Have you asked? The certainty was performing a role — avoiding the conversation.',
        driveUrl: 'https://drive.google.com/file/d/17zCxoOBZsz5xC9pxnyGy_ZdzVL2-aPfN/view?usp=drive_link',
      },
      {
        id: 'surface-c', slug: 'the-iceberg',
        name: 'The Iceberg',
        tagline: 'What\'s visible above the surface — and what\'s driving this underneath?',
        plainDescription: 'Use this when you want to understand what\'s really driving a situation.',
        description: 'When the obvious explanation doesn\'t feel complete. For recurring problems, systemic issues, and anything that has persisted despite efforts to fix it.',
        howToUse: [
          'Write the visible event at the top.',
          'Below the waterline: what PATTERN produces this event?',
          'What STRUCTURE produces that pattern?',
          'What MENTAL MODEL (belief) makes this structure exist?',
          'Intervene at the level that changes the most.',
        ],
        audience: ['Solo', 'Small Group'],
        thinkingPartner: 'YES',
        tpPrompt: 'The visible event is [X]. Help me use The Iceberg — go layer by layer underneath it.',
        example: 'Visible event: students don\'t participate in class. Pattern: questions are always directed at the same 3 students. Structure: teacher unconsciously calls on those who respond fastest. Mental model: fast response = smart. The iceberg reveals a structural bias, not a participation problem.',
        driveUrl: 'https://drive.google.com/file/d/1zLO0hggFdgnBXynB7PZtJLL6xES9dhE-/view?usp=drive_link',
      },
      {
        id: 'surface-d', slug: 'but-why',
        name: 'The But Why?',
        tagline: 'Keep asking why — until you hit the actual reason.',
        plainDescription: 'Use this when an explanation feels complete but leaves you unsatisfied.',
        description: 'When an explanation feels too surface-level. For recurring problems, persistent patterns, and anything that keeps happening despite efforts to fix it.',
        howToUse: [
          'Write the surface explanation.',
          'Ask "But why is that true?"',
          'Write the next level.',
          'Repeat 5 times.',
          'The 5th answer is the root — and almost always different from what you started with.',
        ],
        audience: ['Solo', 'Small Group'],
        thinkingPartner: 'YES',
        tpPrompt: 'The situation is [X]. Ask me But Why five times — each time, push past my first answer.',
        example: 'Surface: "I procrastinate on assignments." Why? → Fear of starting. Why? → Fear of doing it wrong. Why? → Grades feel like judgements of intelligence. Why? → I believe intelligence is fixed. Why? → Every school system I\'ve been in rewarded right answers, not good thinking. Root: the grading system, not procrastination.',
        driveUrl: 'https://drive.google.com/file/d/1u86s1XDX6FIFoVK8ozFdA64N6PKSsiQJ/view?usp=drive_link',
      },
      {
        id: 'surface-e', slug: 'fact-or-feeling',
        name: 'Fact or Feeling?',
        tagline: 'Separate what you know from what you feel — they\'re both valid, but they\'re very different.',
        plainDescription: 'Use this when you can\'t tell whether you\'re working from evidence or from emotion.',
        description: 'Before any difficult conversation, decision under pressure, or forming a public opinion. When you want to check whether your position rests on evidence or on a strong feeling that feels like evidence.',
        howToUse: [
          'Write out everything you "know" about the situation.',
          'Sort each item: FACT (saw it / heard it / measured it) or FEELING (sense it / fear it / believe it).',
          'Where do facts and feelings agree? Where do they contradict?',
        ],
        audience: ['Solo', 'Small Group'],
        thinkingPartner: 'YES',
        tpPrompt: 'I think I know these things about my situation: [list]. Help me use Fact or Feeling to sort them — challenge anything that might be a feeling masquerading as a fact.',
        example: 'A student making a career decision lists 7 things they "know". After sorting: 2 are facts. 5 are feelings, including "I\'m not good enough for this" — which had been functioning as a fact with decisive weight.',
        driveUrl: 'https://drive.google.com/file/d/1UW4MFgFK9oswxHPsSJrHj96dozXMfeOJ/view?usp=drive_link',
      },
    ],
  },
  {
    key: 'COMMIT', label: 'COMMIT', color: '#DA3832', textColor: '#FFFFFF',
    hindi: 'प्रतिबद्ध', tagline: 'Act under uncertainty',
    tools: [
      {
        id: 'commit-a', slug: 'under-pressure',
        name: 'Put It Under Pressure',
        tagline: 'Test your position with 4 types of pressure before you commit.',
        plainDescription: 'Use this when you have a position but aren\'t sure it can hold.',
        description: 'When you\'ve formed a view and want to know if it\'s genuinely solid or just comfortable. Before any major decision or important conversation.',
        howToUse: [
          'Write your position.',
          'Apply four pressures: 💡 New Evidence / 👨‍🏫 Authority / 💸 Cost / ⏰ Act Now.',
          'After each: does the position hold, wobble, or change?',
          'What remains after all four pressures is your real position.',
        ],
        audience: ['Solo', 'Small Group'],
        thinkingPartner: 'YES',
        tpPrompt: 'My position is [X]. Put it under pressure — apply all 4 types hard and don\'t hold back. Then tell me what actually survived.',
        example: 'A student committed to "I\'ll take a gap year." Under Cost pressure: savings will run out in 4 months. Under Act Now pressure: applications close in 3 weeks. Position after pressure: "I\'ll defer, not gap" — a different and more honest commitment.',
        driveUrl: 'https://drive.google.com/file/d/1v03X6nYmQ4x3aoVSPWKo6Lf-qoowGt2c/view?usp=drive_link',
      },
      {
        id: 'commit-b', slug: 'for-now',
        name: 'For Now',
        tagline: 'Commit — but be honest about your certainty and what would change your mind.',
        plainDescription: 'Use this when you need to land somewhere but know you might change your mind.',
        description: 'After any significant thinking session when you need to land somewhere. The most honest kind of commitment: a position held firmly enough to act on, lightly enough to revise.',
        howToUse: [
          'Fill 5 fields: I think... (one specific sentence) / I\'m... sure (High/Medium/Low) / Because... (2–3 reasons) / I\'d change my mind if... (something specific, not vague) / I\'ll revisit on... (a real date).',
        ],
        audience: ['Solo'],
        thinkingPartner: 'YES',
        tpPrompt: 'I\'ve been thinking about [X]. Walk me through the For Now format — help me commit without being dishonest about my certainty.',
        example: '"I think I want to become a journalist. I\'m Medium sure. Because: I like writing and asking questions. I\'d change my mind if: someone showed me a way to do this work without the job insecurity. I\'ll revisit on: March 15th." This is a real commitment — not a declaration.',
        driveUrl: 'https://drive.google.com/file/d/1eOQbVWDyo26cwLEWELMhwpsa16YeIjZF/view?usp=drive_link',
      },
      {
        id: 'commit-c', slug: 'pro-con-plus-one',
        name: 'The Pro/Con+1',
        tagline: 'Pros, cons — and the one thing you\'re conveniently not looking at.',
        plainDescription: 'Use this when the pros and cons cancel out and you need a tiebreaker.',
        description: 'When a pros and cons list doesn\'t feel like enough. The +1 is the thing you keep leaving off the list because it\'s uncomfortable or complicates the obvious answer.',
        howToUse: [
          'Write pros in the left column.',
          'Cons in the middle.',
          'Force yourself to find The +1 in the right column — the thing you keep not putting on the list.',
          'Ask: what question were my pros and cons actually avoiding?',
        ],
        audience: ['Solo', 'Small Group'],
        thinkingPartner: 'YES',
        tpPrompt: 'I\'m deciding [X]. I\'ve been listing pros and cons. What\'s my +1 — what am I conveniently not looking at?',
        example: 'Deciding whether to tell a friend something difficult. Pros and cons cover comfort and honesty. +1: "I\'m not sure I have the right to decide what they know about themselves." The question the list was avoiding: whose needs is this decision really serving?',
        driveUrl: 'https://drive.google.com/file/d/1CB5zBjHjaVKkvWgRtrKKQlN3k0QFKc2U/view?usp=drive_link',
      },
      {
        id: 'commit-d', slug: 'what-does-this-cost',
        name: 'What Does This Cost?',
        tagline: 'A real position always costs something. Find what you\'re giving up.',
        plainDescription: 'Use this when a decision looks good on paper but something feels wrong.',
        description: 'When your position feels obvious and you can\'t understand why others don\'t agree. Before any real commitment — to make sure you know what you\'re trading.',
        howToUse: [
          'Write your position in the centre.',
          'Map four costs outward: Relationship Cost / Resource Cost / Identity Cost / Option Cost.',
          'For each: am I willing to pay this?',
          'Still committing — yes or no?',
        ],
        audience: ['Solo'],
        thinkingPartner: 'YES',
        tpPrompt: 'My commitment is [X]. Help me use What Does This Cost — find all 4 costs I might be avoiding.',
        example: 'A student committing to moving to another city for college maps the Identity Cost: "I will become someone my current friends don\'t recognise in 3 years." They commit anyway — but now with full knowledge of the trade.',
        driveUrl: 'https://drive.google.com/file/d/1xpWFH6RMNeDq96ESIwPL7Dj7KmcZm3W2/view?usp=drive_link',
      },
      {
        id: 'commit-e', slug: 'one-sentence',
        name: 'One Sentence',
        tagline: 'After all the thinking — just one sentence. Everything else was warmup.',
        plainDescription: 'Use this after any extended thinking session when you need to land in one clear position.',
        description: 'After any extended thinking session when you need to actually land somewhere. The final move in every TARK session. If you can\'t say it in one sentence, you haven\'t finished thinking it yet.',
        howToUse: [
          'Write 3 quick drafts of your position as one sentence each.',
          'Check each: Can you act on it? / Could someone prove it wrong? / Is it what you ACTUALLY think?',
          'The sentence that passes all three is your commit. Write it in the large box.',
        ],
        audience: ['Solo'],
        thinkingPartner: 'YES',
        tpPrompt: 'I\'ve been thinking about [X] for a while. Help me get to One Sentence — write 3 drafts with me and challenge each one hard.',
        example: 'Draft 1: "I think education should be reformed." (Can\'t act on it. Fail.) Draft 2: "I think the exam system rewards recall over thinking." (Better. But vague.) Draft 3: "I think I will design for a system that tests thinking, not memory — starting with this project." Passes all three.',
        driveUrl: 'https://drive.google.com/file/d/1ZNwteBrvacWt1YVbkO1bnCQXnI41Wvdg/view?usp=drive_link',
      },
    ],
  },
];

export function getMoveData(moveKey: string): MoveData | undefined {
  return toolsData.find((m) => m.key === moveKey.toUpperCase());
}

export function getToolBySlug(moveKey: string, toolSlug: string): { move: MoveData; tool: Tool } | undefined {
  const move = getMoveData(moveKey);
  if (!move) return undefined;
  const tool = move.tools.find((t) => t.slug === toolSlug);
  if (!tool) return undefined;
  return { move, tool };
}

export function getNextTool(moveKey: string, toolSlug: string): { move: MoveData; tool: Tool } | undefined {
  const move = getMoveData(moveKey);
  if (!move) return undefined;
  const idx = move.tools.findIndex((t) => t.slug === toolSlug);
  if (idx === -1) return undefined;
  if (idx < move.tools.length - 1) return { move, tool: move.tools[idx + 1] };
  const moveIdx = toolsData.findIndex((m) => m.key === moveKey.toUpperCase());
  const nextMove = toolsData[(moveIdx + 1) % toolsData.length];
  return { move: nextMove, tool: nextMove.tools[0] };
}
