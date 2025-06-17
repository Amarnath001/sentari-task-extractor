import { VoiceEntry } from './types.js';

export const mockVoiceEntries: VoiceEntry[] = [
  {
    id: '1',
    user_id: 'user-1',
    audio_url: null,
    transcript_raw: 'I need to call my doctor tomorrow.',
    transcript_user: 'I need to call my doctor tomorrow.',
    language_detected: 'en',
    language_rendered: 'en',
    tags_model: ['reflection'],
    tags_user: ['reflection'],
    category: null,
    created_at: '2024-03-20T00:00:00Z',
    updated_at: '2024-03-20T00:00:00Z',
    emotion_score_score: 0.5,
    embedding: null
  },
  {
    id: '2',
    user_id: 'user-1',
    audio_url: null,
    transcript_raw: 'I should clean my room and organize my desk.',
    transcript_user: 'I should clean my room and organize my desk.',
    language_detected: 'en',
    language_rendered: 'en',
    tags_model: ['reflection'],
    tags_user: ['reflection'],
    category: null,
    created_at: '2024-03-20T00:00:00Z',
    updated_at: '2024-03-20T00:00:00Z',
    emotion_score_score: 0.3,
    embedding: null
  }
]; 