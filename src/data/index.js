// Central export point for all data and utilities

// Manager data and utilities
export {
  managers,
  getManagerById,
  getManagersByPerformance
} from './managers.js';

// AE data and utilities
export {
  aes,
  getAEsByManager,
  getAEById,
  getUndercoached
} from './aes.js';

// Feedback data and utilities
export {
  feedbackLog,
  getFeedbackByManager,
  getFeedbackByAE,
  getFeedbackByCallId,
  getRecentFeedback
} from './feedback.js';

// Timeframe data and utilities
export {
  timeframes,
  getTimeframeData,
  getManagerTimeframeData,
  getBenchmark,
  getScoreTrend
} from './timeframes.js';

// AI summaries
export {
  managerSummaries,
  getSummaryByManager
} from './summaries.js';

// Sample Q&A for Ask Anything
export {
  sampleQA,
  findAnswer
} from './sampleQA.js';

// Citation utilities
export {
  isValidCitationId,
  formatCitationId,
  parseCitationId,
  extractCitations,
  lookupCitation,
  getCitationDetails
} from './citations.js';
