// Coaching Intelligence - Sample Q&A Pairs for Ask Anything

export const sampleQA = [
  {
    id: "qa001",
    question: "Why is David's team struggling?",
    answer: "David's team has the lowest quota attainment (62%) and this correlates directly with coaching absence. In the last 30 days, David reviewed only 3 calls with zero feedback provided.\n\nHis two lowest performers have received no coaching:\n• Jessica Huang (54% quota) — 0 calls coached\n• Rachel Green (58% quota) — 1 call, no feedback\n\nMeanwhile, Sarah Chen's lowest performer (Ryan Patel, 108%) received 14 coached calls with 3 scorecards.",
    citations: [
      { id: "ae_dist", label: "AE Distribution", type: "table" },
      { id: "CALL-4008", label: "CALL-4008", type: "call" }
    ],
    suggested_actions: [
      { id: "add_1on1", label: "Add to 1:1 with David", icon: "calendar" }
    ],
    follow_ups: [
      "What was David doing at the start of the quarter?",
      "Which AEs need immediate attention?"
    ]
  },
  {
    id: "qa002",
    question: "Why hasn't Lauren Kim been coached?",
    answer: "Lauren has the lowest quota on Marcus's team (89%) but received only 2 coached calls in 30 days—the least of any AE on his team. Her last feedback was 53 days ago.\n\nThis is an inverted pattern: struggling reps should receive more attention, not less. Marcus's coaching declined 35% from Month 1 to Month 3.",
    citations: [
      { id: "ae_dist", label: "AE Distribution", type: "table" },
      { id: "CALL-2023", label: "CALL-2023", type: "call" }
    ],
    suggested_actions: [
      { id: "add_1on1", label: "Add 'Lauren Kim gap' to 1:1 with Marcus", icon: "calendar" }
    ],
    follow_ups: [
      "Show me Marcus's coaching in the last 2 weeks",
      "What feedback has Lauren received?"
    ]
  },
  {
    id: "qa003",
    question: "What makes Sarah's feedback so effective?",
    answer: "Sarah's feedback has three consistent patterns:\n\n1. **Specific moments** — She cites exact timestamps and behaviors ('When they pushed back at minute 23...')\n\n2. **Framework references** — She connects to coaching frameworks ('This is exactly the pricing anchor technique we practiced')\n\n3. **One clear action** — Every comment ends with a single next step ('Next time, pause longer after stating the anchor')\n\nHer team's 42% win rate (vs 31% org average) suggests this approach works.",
    citations: [
      { id: "CALL-1042", label: "CALL-1042", type: "call" },
      { id: "CALL-1103", label: "CALL-1103", type: "call" }
    ],
    suggested_actions: [
      { id: "template", label: "Create template from Sarah's approach", icon: "file-text" }
    ],
    follow_ups: [
      "Show me more examples of Sarah's feedback",
      "How does this compare to Jennifer's feedback?"
    ]
  }
];

export const findAnswer = (question) => {
  const q = question.toLowerCase();
  return sampleQA.find(qa => 
    q.includes(qa.question.toLowerCase().split(' ').slice(0, 3).join(' '))
  );
};
