// Citation ID format: CALL-XXXX (4 digits, zero-padded)
import { feedbackLog } from './feedback.js';

const CITATION_PATTERN = /^CALL-\d{4}$/;

export const isValidCitationId = (id) => CITATION_PATTERN.test(id);

export const formatCitationId = (numericId) =>
  `CALL-${String(numericId).padStart(4, '0')}`;

export const parseCitationId = (id) => {
  if (!isValidCitationId(id)) return null;
  return parseInt(id.replace('CALL-', ''), 10);
};

export const extractCitations = (text) => {
  // Match [-> CALL-XXXX], [-> CALL-XXXX], or just CALL-XXXX
  const pattern = /(?:\[(?:->|→)?\s*)?(CALL-\d{4})(?:\])?/gi;
  const matches = [];
  let match;
  while ((match = pattern.exec(text)) !== null) {
    matches.push(match[1].toUpperCase());
  }
  return [...new Set(matches)]; // Remove duplicates
};

export const lookupCitation = (callId) =>
  feedbackLog.find(f => f.call_id === callId);

export const getCitationDetails = (callId) => {
  const feedback = lookupCitation(callId);
  if (!feedback) return null;

  return {
    callId: feedback.call_id,
    date: feedback.date,
    managerName: feedback.manager_name,
    aeName: feedback.ae_name,
    pipelineStage: feedback.pipeline_stage,
    duration: feedback.duration,
    type: feedback.type,
    feedback: feedback.feedback,
    quality: feedback.quality,
    coachingActivity: {
      listened: feedback.listened,
      attended: feedback.attended,
      hasFeedback: feedback.has_feedback,
      hasComments: feedback.has_comments,
      hasScorecard: feedback.has_scorecard
    }
  };
};
