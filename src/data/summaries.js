// Coaching Intelligence - AI-Generated Summaries
// Pre-generated summaries for each manager

import { getAEsByManager } from './aes.js';

// Compute breakdown metrics from AE data
function computeBreakdown(managerId) {
  const aes = getAEsByManager(managerId);
  return {
    calls_listened: aes.reduce((sum, ae) => sum + ae.calls_coached, 0),
    calls_attended: aes.reduce((sum, ae) => sum + ae.live_attended, 0),
    calls_with_feedback: aes.reduce((sum, ae) => sum + ae.comments, 0),
    calls_with_comments: aes.reduce((sum, ae) => sum + ae.comments, 0),
    calls_with_scorecards: aes.reduce((sum, ae) => sum + ae.scorecards, 0)
  };
}

export const managerSummaries = {
  MGR001: {
    manager_id: "MGR001",
    manager_name: "Sarah Chen",
    headline: "Sarah is a top-performing coach investing 4x the team average in coaching, with 60 calls coached this month and 63% receiving written feedback. Her team shows the results: all 4 AEs are above quota with a 42% win rate (11 points above org average). Coaching is consistent week-over-week and distributed appropriately across skill levels.",
    
    sections: {
      effort: {
        title: "Coaching Investment",
        level: "High",
        value: "60 calls coached",
        detail: "Sarah invested significant coaching effort this quarter, coaching 60 calls across her team. This is 4x the team average and represents consistent engagement. She averages 15 calls per AE, with 63% receiving written comments—the highest rate across all managers."
      },
      trend: {
        title: "Trend Over Time",
        level: "Stable",
        value: "30 days",
        detail: "Coaching volume has been stable across the month. No decline despite quarter-end pressure. Week-over-week variance is minimal, indicating coaching is a deliberate habit, not an afterthought.",
        weekly: [
          { week: 1, calls: 15 }, { week: 2, calls: 16 }, { week: 3, calls: 14 }, { week: 4, calls: 15 }
        ]
      },
      methods: {
        title: "Coaching Activity",
        detail: "Sarah uses the full coaching toolkit with emphasis on written feedback and scorecards.",
        breakdown: {
          calls_listened: 60,
          calls_attended: 6,
          calls_with_feedback: 38,
          calls_with_comments: 38,
          calls_with_scorecards: 14
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
        title: "Feedback Analysis",
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
          },
          {
            call_id: "CALL-1089",
            ae: "Emma Liu",
            date: "Jan 18",
            stage: "Demo",
            quote: "Good discovery recap at the start of the demo. You connected their pain points (manual reporting, 3hrs/week) directly to the dashboard walkthrough. The CFO was nodding throughout."
          },
          {
            call_id: "CALL-1029",
            ae: "Alex Rivera",
            date: "Jan 15",
            stage: "Negotiation",
            quote: "Good use of the 'feel, felt, found' framework on the security objection. The customer visibly relaxed when you shared the Meridian case study."
          },
          {
            call_id: "CALL-1156",
            ae: "Sofia Andersson",
            date: "Jan 22",
            stage: "Proposal",
            quote: "Excellent job handling the competitive objection. When they mentioned Clari, you didn't bash the competitor—you asked what specific capabilities they were comparing."
          },
          {
            call_id: "CALL-1076",
            ae: "Emma Liu",
            date: "Jan 14",
            stage: "Qualification",
            quote: "Strong BANT qualification. You uncovered the $50K budget in the first 10 minutes without being pushy. The question 'What happens if you don't solve this by Q2?' was perfect."
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
    headline: "Marcus's coaching volume has declined from 5 calls in week 1 to just 2 calls in week 4, coinciding with quarter-end pressure. However, his feedback quality has improved significantly—recent comments are specific and actionable. The concern: Lauren Kim (89% quota) received the least coaching despite needing it most. Marcus needs to maintain his improved quality while increasing volume.",
    
    sections: {
      effort: {
        title: "Coaching Investment",
        level: "Medium",
        value: "14 calls coached",
        detail: "Marcus coached 14 calls across his team this month. While this is meaningful engagement, it's 4x below Sarah's level. Activity has declined in recent weeks, particularly for lower-performing AEs."
      },
      trend: {
        title: "Trend Over Time",
        level: "Declining",
        value: "30 days",
        detail: "Coaching activity has declined from Week 1 to Week 4. The most recent week showed only 2 calls coached. This coincided with quarter-end, suggesting coaching was deprioritised under pressure.",
        weekly: [
          { week: 1, calls: 5 }, { week: 2, calls: 4 }, { week: 3, calls: 3 }, { week: 4, calls: 2 }
        ]
      },
      methods: {
        title: "Coaching Activity",
        detail: "Marcus relies primarily on call listening with selective comments. Scorecard usage is reasonable but written feedback frequency is the gap.",
        breakdown: {
          calls_listened: 14,
          calls_attended: 1,
          calls_with_feedback: 10,
          calls_with_comments: 10,
          calls_with_scorecards: 4
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
        title: "Feedback Analysis",
        level: "Low Volume, High Quality",
        detail: "While Marcus's coaching volume has declined, his feedback quality has improved significantly. Recent comments are specific, reference frameworks, and include actionable next steps. The gap is frequency, not substance—when he coaches, he coaches well.",
        examples: [
          // Earliest - vague and generic
          {
            call_id: "CALL-2023",
            ae: "Lauren Kim",
            date: "Dec 2",
            stage: "Discovery",
            quote: "Good start. Keep building rapport."
          },
          {
            call_id: "CALL-2045",
            ae: "Michael Brown",
            date: "Dec 15",
            stage: "Qualification",
            quote: "Scorecard: 4/5 overall. Solid qualification call."
          },
          // Mid-period - somewhat specific
          {
            call_id: "CALL-2015",
            ae: "James Wilson",
            date: "Jan 8",
            stage: "Discovery",
            quote: "Good probing on their current process. The question about 'what happens when a deal slips' got them talking about their real pain."
          },
          // Most recent - specific and actionable
          {
            call_id: "CALL-2067",
            ae: "Priya Sharma",
            date: "Jan 14",
            stage: "Demo",
            quote: "Demo ran 52 mins—try to keep under 45. The extra time came from the integrations section. For prospects at their stage, a 2-min overview is enough; save deep-dive for technical eval."
          },
          {
            call_id: "CALL-2089",
            ae: "James Wilson",
            date: "Jan 18",
            stage: "Demo",
            quote: "Good demo structure. The way you mapped their 3 pain points to our 3 features kept them engaged. One thing: the CFO checked out during the technical deep-dive. Next time, gauge executive attention and pivot to business impact sooner."
          },
          {
            call_id: "CALL-2112",
            ae: "James Wilson",
            date: "Jan 22",
            stage: "Negotiation",
            quote: "Strong use of the anchoring technique we discussed. When they pushed on price, you led with the ROI calculation ($180K savings) before discussing discount. That's the right sequence—value first, then numbers."
          }
        ]
      }
    },

    flags: [
      { type: "positive", text: "Feedback quality has improved significantly. Recent comments are specific, reference frameworks, and include actionable next steps." },
      { type: "warning", text: "Week 4 coaching dropped to 2 calls. Activity volume is declining even as quality improves." },
      { type: "warning", text: "Lauren Kim (89% quota) received least coaching. Struggling AEs need more of Marcus's improved feedback approach." }
    ],
    
    suggested_actions: [
      { id: "recognize", label: "Recognize Marcus's feedback quality improvement", icon: "star" },
      { id: "add_1on1", label: "Discuss increasing coaching volume in 1:1", icon: "calendar" },
      { id: "focus", label: "Direct improved feedback approach to Lauren Kim", icon: "users" }
    ],

    follow_up_questions: [
      "How has Marcus's feedback improved over time?",
      "Why hasn't Lauren Kim been coached?",
      "Show me Marcus's best coaching examples"
    ]
  },

  MGR003: {
    manager_id: "MGR003",
    manager_name: "Jennifer Walsh",
    headline: "Jennifer is listening to calls but not converting that into meaningful coaching—only 54% of reviewed calls received comments, and feedback is generic ('Nice job', 'Good call'). Her two lowest performers, Amanda (82%) and Natalie (84%), have received zero scorecards and minimal attention. This pattern suggests avoidance of difficult coaching conversations.",
    
    sections: {
      effort: {
        title: "Coaching Investment",
        level: "Low",
        value: "13 calls coached",
        detail: "Jennifer coached 13 calls across her team this month. While she's showing more activity than David, her depth of engagement is low—only 54% of calls received comments. She's listening to calls but not converting listening into coaching interventions."
      },
      trend: {
        title: "Trend Over Time",
        level: "Stable",
        value: "30 days",
        detail: "Activity has been inconsistent with no clear pattern. The pattern suggests coaching is reactive rather than planned—activity when time permits rather than a deliberate practice. No improvement trend.",
        weekly: [
          { week: 1, calls: 4 }, { week: 2, calls: 3 }, { week: 3, calls: 4 }, { week: 4, calls: 2 }
        ]
      },
      methods: {
        title: "Coaching Activity",
        detail: "Jennifer's coaching is heavily weighted to passive listening. The feedback rate (54%) is below the 60% benchmark. She's monitoring activity but not actively developing her team with scorecards.",
        breakdown: {
          calls_listened: 13,
          calls_attended: 1,
          calls_with_feedback: 7,
          calls_with_comments: 7,
          calls_with_scorecards: 2
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
        title: "Feedback Analysis",
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
          },
          {
            call_id: "CALL-3045",
            ae: "Chris Taylor",
            date: "Jan 18",
            stage: "Demo",
            quote: "Good call."
          },
          {
            call_id: "CALL-3033",
            ae: "Amanda Foster",
            date: "Jan 5",
            stage: "Discovery",
            quote: "OK."
          },
          {
            call_id: "CALL-3055",
            ae: "Kevin O'Brien",
            date: "Jan 20",
            stage: "Demo",
            quote: "Scorecard: 3/5 overall."
          },
          {
            call_id: "CALL-3028",
            ae: "Natalie Cruz",
            date: "Dec 12",
            stage: "Discovery",
            quote: "Fine."
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
    headline: "David has effectively stopped coaching—only 2 calls reviewed this month with zero activity in the past 14 days. His team is in crisis: all 4 AEs are below quota, with Jessica Huang at 54% (lowest in the org) receiving no coaching whatsoever. Team quota sits at 62%, directly correlating with the coaching absence. Immediate intervention required.",
    
    sections: {
      effort: {
        title: "Coaching Investment",
        level: "Minimal",
        value: "2 calls coached",
        detail: "David coached only 2 calls this month across his entire team. This represents a 97% gap versus Sarah's output and is the lowest engagement across all managers. His team is the only one with all AEs below quota."
      },
      trend: {
        title: "Trend Over Time",
        level: "Declining",
        value: "30 days",
        detail: "Coaching activity has effectively ceased. Week 1 showed some engagement (2 calls), but activity dropped to zero in recent weeks. Zero coaching activity in the past 14 days. This is not a dip—it's an absence.",
        weekly: [
          { week: 1, calls: 2 }, { week: 2, calls: 0 }, { week: 3, calls: 0 }, { week: 4, calls: 0 }
        ]
      },
      methods: {
        title: "Coaching Activity",
        detail: "David is not using any coaching tools in a meaningful way. The single comment recorded was minimal and non-actionable. Zero scorecards.",
        breakdown: {
          calls_listened: 2,
          calls_attended: 0,
          calls_with_feedback: 1,
          calls_with_comments: 1,
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
        title: "Feedback Analysis",
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

export const getSummaryByManager = (managerId) => {
  const summary = managerSummaries[managerId];
  if (!summary) return null;

  // Merge computed breakdown into the summary
  const computedBreakdown = computeBreakdown(managerId);
  return {
    ...summary,
    sections: {
      ...summary.sections,
      methods: {
        ...summary.sections.methods,
        breakdown: computedBreakdown
      }
    }
  };
};
