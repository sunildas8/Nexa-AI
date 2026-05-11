/**
 * Chat Configuration
 * Centralized settings for the chat application
 */

export const CHAT_CONFIG = {
  ASSISTANT_NAME: 'Nexa AI',
  ASSISTANT_EMOJI: '⚡',
  API_RESPONSE_DELAY: 1200, // milliseconds
  MAX_MESSAGE_LENGTH: 10000,
  CHAT_HISTORY_LIMIT: 50,
  TYPING_INDICATOR_SPEED: 300,
};

export const MESSAGE_ROLES = {
  USER: 'user',
  ASSISTANT: 'assistant',
};

export const UI_CONFIG = {
  SIDEBAR_WIDTH: 'w-64',
  MAX_CONTENT_WIDTH: 'max-w-4xl',
  ANIMATION_DURATION: 300,
};

export default CHAT_CONFIG;
