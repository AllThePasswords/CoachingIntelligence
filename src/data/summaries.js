// Coaching Intelligence - AI-Generated Summaries
// Pre-generated summaries for each manager

export const managerSummaries = {
  MGR001: {
    manager_id: "MGR001",
    manager_name: "Sarah Chen",
    headline: "Consistently high coaching engagement with measurable team impact",
    
    sections: {
      effort: {
        title: "Coaching Investment",
        level: "High",
        value: "171 activities",
        detail: "Sarah invested significant coaching effort this quarter, reviewing 171 calls across 57 active days. This is 2.5x the team average and represents consistent daily engagement rather than sporadic bursts. She averages 3 calls reviewed per working day, with 65% receiving written feedback."
      },
      trend: {
        title: "Trend Over Time",
        level: "Stable",
        value: "90 days",
        detail: "Coaching volume has been stable across all 13 weeks. No decline despite quarter-end pressure. Week-over-week variance is minimal, indicating coaching is a deliberate habit, not an afterthought.",
        weekly: [
          { week: 1, calls: 14 }, { week: 2, calls: 16 }, { week: 3, calls: 15 },
          { week: 4, calls: 15 }, { week: 5, calls: 13 }, { week: 6, calls: 14 },
          { week: 7, calls: 12 }, { week: 8, calls: 15 }, { week: 9, calls: 14 },
          { week: 10, calls: 13 }, { week: 11, calls: 14 }, { week: 12, calls: 12 }, { week: 13, calls: 14 }
        ]
      },
      methods: {
        title: "How They Coach",
        detail: "Sarah uses the full coaching toolkit with emphasis on written feedback.",
        breakdown: {
          calls_listened: 171,
          calls_attended: 18,
          calls_with_feedback: 112,
          calls_with_comments: 156,
          calls_with_scorecards: 42
        }
      },
      distribution: {
        title: "Coaching Distribution",
        level: "Even",
        detail: "Coaching is distributed across all AEs, with appropriate weighting toward development needs. Alex receives focused attention for senior role development. Ryan received targeted coaching on qualification skills after a slow start.",
        ae_breakdown: [
          { name: "Alex Rivera", quota: 125, calls: 18, comments: 12, scorecards: 5 },
          { name: "Emma Liu", quota: 115, calls: 16, comments: 10, scorecards: 4 },
          { name: "Ryan Patel", quota: 108, calls: 14, comments: 8, scorecards: 3 },
          { name: "Sofia Andersson", quota: 122, calls: 12, comments: 8, scorecards: 2 }
        ]
      },
      feedback_quality: {
        title: "Feedback Quality",
        level: "Specific & Actionable",
        detail: "Sarah's feedback is specific, actionable, and tied to observable behaviors. She consistently cites specific moments, connects to frameworks or prior coaching, and provides one clear action item.",
        examples: [
          {
            call_id: "CALL-1042",
            ae: "Alex Rivera",
            date: "Jan 22",
            stage: "Negotiation",
            quote: "Strong pricing defense. When they pushed back on the 15% increase, you anchored to value delivered last year ($2.3M in efficiency gains) before discussing numbers. This is exactly the framework we practiced."
          },
          {
            call_id: "CALL-1103",
            ae: "Ryan Patel",
            date: "Jan 20",
            stage: "Qualification",
            quote: "I noticed you didn't ask about their decision timeline until minute 38. By then we'd done a full capability overview for someone who might not have budget until Q3. Let's work on your BANT qualification."
          }
        ]
      }
    },
    
    flags: [
      { type: "positive", text: "Top coaching performer. Consider documenting her feedback approach as a best practice template for other managers." },
      { type: "positive", text: "All 4 AEs above quota. Team win rate (42%) is 11 points above org average." }
    ],
    
    suggested_actions: [
      { id: "recognize", label: "Recognize Sarah in team channel", icon: "star" },
      { id: "template", label: "Create coaching template from her approach", icon: "file-text" },
      { id: "pair", label: "Pair Sarah with David for peer coaching", icon: "users" }
    ],
    
    follow_up_questions: [
      "What makes Sarah's feedback so effective?",
      "How does Sarah prioritize which calls to review?",
      "Can you show me Sarah's coaching on negotiation calls?"
    ]
  },

  MGR002: {
    manager_id: "MGR002",
    manager_name: "Marcus Jones",
    headline: "Solid foundation but declining engagement in recent weeks",
    
    sections: {
      effort: {
        title: "Coaching Investment",
        level: "Medium",
        value: "89 activities",
        detail: "Marcus reviewed 89 calls this quarter across 35 active days. This is below the benchmark of 135 calls but represents meaningful engagement when it occurs. However, activity has declined significantly in the last 30 days."
      },
      trend: {
        title: "Trend Over Time",
        level: "Declining",
        value: "90 days",
        detail: "Coaching activity has declined 35% from Month 1 to Month 3. Week 4 of Month 3 showed zero written feedback despite calls being reviewed. This coincided with quarter-end, suggesting coaching was deprioritised under pressure.",
        weekly: [
          { week: 1, calls: 10 }, { week: 2, calls: 12 }, { week: 3, calls: 9 },
          { week: 4, calls: 11 }, { week: 5, calls: 8 }, { week: 6, calls: 7 },
          { week: 7, calls: 8 }, { week: 8, calls: 6 }, { week: 9, calls: 5 },
          { week: 10, calls: 4 }, { week: 11, calls: 5 }, { week: 12, calls: 3 }, { week: 13, calls: 2 }
        ]
      },
      methods: {
        title: "How They Coach",
        detail: "Marcus relies primarily on call listening with selective feedback. Scorecard usage is reasonable but written feedback is the gap.",
        breakdown: {
          calls_listened: 89,
          calls_attended: 8,
          calls_with_feedback: 34,
          calls_with_comments: 62,
          calls_with_scorecards: 16
        }
      },
      distribution: {
        title: "Coaching Distribution",
        level: "Uneven",
        detail: "Coaching distribution shows a gap with the lowest performer. Lauren Kim has the lowest quota attainment (89%) but received the least coaching. This is an inverted pattern—struggling reps should receive more attention.",
        ae_breakdown: [
          { name: "James Wilson", quota: 102, calls: 5, comments: 4, scorecards: 2 },
          { name: "Priya Sharma", quota: 94, calls: 4, comments: 3, scorecards: 1 },
          { name: "Michael Brown", quota: 98, calls: 3, comments: 2, scorecards: 1 },
          { name: "Lauren Kim", quota: 89, calls: 2, comments: 1, scorecards: 0, flag: "undercoached" }
        ]
      },
      feedback_quality: {
        title: "Feedback Quality",
        level: "Moderate to Vague",
        detail: "When Marcus provides feedback, it's relevant but often lacks specificity. Comments are brief and occasionally actionable, but lack the framework references that drive skill development.",
        examples: [
          {
            call_id: "CALL-2015",
            ae: "James Wilson",
            date: "Jan 8",
            stage: "Discovery",
            quote: "Good probing on their current process. The question about 'what happens when a deal slips' got them talking about their real pain."
          },
          {
            call_id: "CALL-2067",
            ae: "Priya Sharma",
            date: "Jan 14",
            stage: "Demo",
            quote: "Demo ran a bit long. Try to keep it under 45 mins. Otherwise, good energy."
          }
        ]
      }
    },
    
    flags: [
      { type: "warning", text: "Week 4 coaching dropped to zero feedback. Check if quarter-end pressure is causing coaching to be deprioritised." },
      { type: "warning", text: "Lauren Kim (89% quota) received least coaching. Consider reversing this—struggling AEs typically need more attention." },
      { type: "info", text: "Feedback quality is inconsistent. May benefit from coaching calibration session with Sarah Chen." }
    ],
    
    suggested_actions: [
      { id: "add_1on1", label: "Add 'Lauren Kim coaching gap' to 1:1 with Marcus", icon: "calendar" },
      { id: "send_summary", label: "Send coaching trend summary to Marcus", icon: "mail" },
      { id: "pair", label: "Set up peer session with Sarah Chen", icon: "users" }
    ],
    
    follow_up_questions: [
      "Why hasn't Lauren Kim been coached?",
      "Show me Marcus's coaching in the last 2 weeks",
      "What happened to Marcus's coaching after Week 8?"
    ]
  },

  MGR003: {
    manager_id: "MGR003",
    manager_name: "Jennifer Walsh",
    headline: "Listening but not coaching—feedback lacks substance",
    
    sections: {
      effort: {
        title: "Coaching Investment",
        level: "Low",
        value: "44 activities",
        detail: "Jennifer reviewed 44 calls this quarter across 26 active days. While she's showing up more days than David, her depth of engagement is lower—only 18% of calls received meaningful feedback. She's listening to calls but not converting listening into coaching interventions."
      },
      trend: {
        title: "Trend Over Time",
        level: "Stable",
        value: "90 days",
        detail: "Activity has been inconsistent with no clear pattern. The pattern suggests coaching is reactive rather than planned—activity when time permits rather than a deliberate practice. No improvement trend.",
        weekly: [
          { week: 1, calls: 4 }, { week: 2, calls: 3 }, { week: 3, calls: 4 },
          { week: 4, calls: 3 }, { week: 5, calls: 4 }, { week: 6, calls: 2 },
          { week: 7, calls: 3 }, { week: 8, calls: 4 }, { week: 9, calls: 3 },
          { week: 10, calls: 4 }, { week: 11, calls: 3 }, { week: 12, calls: 4 }, { week: 13, calls: 2 }
        ]
      },
      methods: {
        title: "How They Coach",
        detail: "Jennifer's coaching is heavily weighted to passive listening. The feedback rate (18%) is significantly below the 60% benchmark. She's monitoring activity but not actively developing her team.",
        breakdown: {
          calls_listened: 44,
          calls_attended: 3,
          calls_with_feedback: 8,
          calls_with_comments: 28,
          calls_with_scorecards: 6
        }
      },
      distribution: {
        title: "Coaching Distribution",
        level: "Sporadic",
        detail: "Coaching skews toward higher performers, leaving struggling AEs under-supported. Amanda (82%) and Natalie (84%) are both below 85% quota and received the least coaching with zero scorecards. This pattern suggests Jennifer may be avoiding difficult coaching conversations.",
        ae_breakdown: [
          { name: "Chris Taylor", quota: 95, calls: 5, comments: 3, scorecards: 1 },
          { name: "Kevin O'Brien", quota: 91, calls: 4, comments: 2, scorecards: 1 },
          { name: "Amanda Foster", quota: 82, calls: 2, comments: 1, scorecards: 0, flag: "undercoached" },
          { name: "Natalie Cruz", quota: 84, calls: 2, comments: 1, scorecards: 0, flag: "undercoached" }
        ]
      },
      feedback_quality: {
        title: "Feedback Quality",
        level: "Generic",
        detail: "The limited feedback provided lacks substance. Jennifer's comments are brief affirmations that don't identify specific strengths to repeat or areas to develop. This is encouragement, not coaching.",
        examples: [
          {
            call_id: "CALL-3022",
            ae: "Chris Taylor",
            date: "Jan 10",
            stage: "Discovery",
            quote: "Nice job."
          },
          {
            call_id: "CALL-3041",
            ae: "Kevin O'Brien",
            date: "Jan 16",
            stage: "Qualification",
            quote: "Good call. Keep it up."
          }
        ]
      }
    },
    
    flags: [
      { type: "warning", text: "18% feedback rate is well below 60% benchmark. Calls are being reviewed but not coached." },
      { type: "warning", text: "Amanda Foster (82%) and Natalie Cruz (84%) have received zero scorecards and minimal feedback. Both are at risk of missing quota." },
      { type: "info", text: "Feedback quality suggests Jennifer may benefit from training on how to give specific, actionable coaching comments." }
    ],
    
    suggested_actions: [
      { id: "add_1on1", label: "Add coaching quality discussion to 1:1", icon: "calendar" },
      { id: "training", label: "Recommend feedback skills training", icon: "book" },
      { id: "template", label: "Share Sarah's feedback templates", icon: "file-text" }
    ],
    
    follow_up_questions: [
      "What feedback has Amanda Foster received?",
      "Compare Jennifer's feedback to Sarah's",
      "Which AEs on Jennifer's team are at risk?"
    ]
  },

  MGR004: {
    manager_id: "MGR004",
    manager_name: "David Park",
    headline: "Critical coaching gap with team in crisis",
    
    sections: {
      effort: {
        title: "Coaching Investment",
        level: "Minimal",
        value: "22 activities",
        detail: "David reviewed only 22 calls this quarter across 12 active days. This represents an 84% gap versus the 135-call benchmark and is the lowest engagement across all managers. His team is the only one with all AEs below quota."
      },
      trend: {
        title: "Trend Over Time",
        level: "Declining",
        value: "90 days",
        detail: "Coaching activity has effectively ceased. Month 1 showed some engagement (15 calls), but activity dropped sharply in Month 2 (5 calls) and Month 3 (2 calls). Zero coaching activity in the past 14 days. This is not a dip—it's an absence.",
        weekly: [
          { week: 1, calls: 4 }, { week: 2, calls: 5 }, { week: 3, calls: 3 },
          { week: 4, calls: 3 }, { week: 5, calls: 2 }, { week: 6, calls: 1 },
          { week: 7, calls: 1 }, { week: 8, calls: 1 }, { week: 9, calls: 1 },
          { week: 10, calls: 1 }, { week: 11, calls: 0 }, { week: 12, calls: 0 }, { week: 13, calls: 0 }
        ]
      },
      methods: {
        title: "How They Coach",
        detail: "David is not using any coaching tools in a meaningful way. The single feedback entry recorded was minimal and non-actionable.",
        breakdown: {
          calls_listened: 22,
          calls_attended: 1,
          calls_with_feedback: 1,
          calls_with_comments: 8,
          calls_with_scorecards: 0
        }
      },
      distribution: {
        title: "Coaching Distribution",
        level: "Absent",
        detail: "Two AEs received minimal attention. Two received nothing. Tyler Morgan and Jessica Huang have had zero coaching despite being significantly below quota. Jessica is the lowest-performing AE in the entire organisation.",
        ae_breakdown: [
          { name: "Brandon Lee", quota: 72, calls: 1, comments: 1, scorecards: 0, flag: "undercoached" },
          { name: "Rachel Green", quota: 58, calls: 1, comments: 0, scorecards: 0, flag: "critical" },
          { name: "Tyler Morgan", quota: 65, calls: 0, comments: 0, scorecards: 0, flag: "critical" },
          { name: "Jessica Huang", quota: 54, calls: 0, comments: 0, scorecards: 0, flag: "critical" }
        ]
      },
      feedback_quality: {
        title: "Feedback Quality",
        level: "None",
        detail: "Only one feedback comment was recorded this quarter. There are no examples of actionable feedback, skill development, or deal-specific guidance. David's AEs are operating without management support.",
        examples: [
          {
            call_id: "CALL-4008",
            ae: "Brandon Lee",
            date: "Jan 6",
            stage: "Discovery",
            quote: "Listened to this one. Seemed fine."
          }
        ]
      }
    },
    
    flags: [
      { type: "critical", text: "Zero coaching activity in past 14 days. Immediate intervention required." },
      { type: "critical", text: "Jessica Huang (54%) and Rachel Green (58%) are in critical performance territory with no coaching support." },
      { type: "critical", text: "Team quota at 62%—lowest across all regions. Direct correlation with coaching absence." }
    ],
    
    suggested_actions: [
      { id: "add_1on1", label: "Schedule urgent 1:1 with David", icon: "calendar" },
      { id: "send_summary", label: "Send coaching report to David", icon: "mail" },
      { id: "flag_hr", label: "Flag for HR review", icon: "alert-triangle" }
    ],
    
    follow_up_questions: [
      "What was David doing at the start of the quarter?",
      "Which AEs need immediate attention?",
      "Compare David to Sarah's approach"
    ]
  }
};

export const getSummaryByManager = (managerId) => managerSummaries[managerId];
