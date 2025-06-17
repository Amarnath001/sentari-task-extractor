import { describe, it, expect } from 'vitest';
import { extractTasks, ExtractedTask } from '../src/lib/taskExtractor.js';
import { VoiceEntry } from '../src/lib/types.js';

describe('Task Extractor', () => {
  const mockEntry: VoiceEntry = {
    id: 'test-1',
    user_id: 'user-1',
    audio_url: null,
    transcript_raw: '',
    transcript_user: '',
    language_detected: 'en',
    language_rendered: 'en',
    tags_model: [],
    tags_user: [],
    category: null,
    created_at: '2024-03-20T00:00:00Z',
    updated_at: '2024-03-20T00:00:00Z',
    emotion_score_score: null,
    embedding: null
  };

  it('should extract tasks with due dates', () => {
    const entry: VoiceEntry = {
      ...mockEntry,
      transcript_user: 'I need to call my doctor tomorrow. I should also schedule a dentist appointment by next week.'
    };

    const tasks = extractTasks(entry);
    expect(tasks).toHaveLength(2);
    
    const doctorTask = tasks.find(t => t.task_text.includes('doctor'));
    expect(doctorTask).toBeDefined();
    expect(doctorTask?.due_date).toBeDefined();
    expect(doctorTask?.category).toBe('health');
    expect(doctorTask?.priority).toBe('medium');

    const dentistTask = tasks.find(t => t.task_text.includes('dentist'));
    expect(dentistTask).toBeDefined();
    expect(dentistTask?.due_date).toBeDefined();
    expect(dentistTask?.category).toBe('health');
    expect(dentistTask?.priority).toBe('medium');
  });

  it('should extract tasks with categories', () => {
    const entry: VoiceEntry = {
      ...mockEntry,
      transcript_user: 'I need to clean my room and organize my desk. I should also call my mom this weekend.'
    };

    const tasks = extractTasks(entry);
    expect(tasks).toHaveLength(3);
    
    const cleaningTask = tasks.find(t => t.task_text.includes('clean'));
    expect(cleaningTask).toBeDefined();
    expect(cleaningTask?.category).toBe('home');
    expect(cleaningTask?.priority).toBe('low');

    const organizingTask = tasks.find(t => t.task_text.includes('organize'));
    expect(organizingTask).toBeDefined();
    expect(organizingTask?.category).toBe('home');
    expect(organizingTask?.priority).toBe('low');

    const momTask = tasks.find(t => t.task_text.includes('mom'));
    expect(momTask).toBeDefined();
    expect(momTask?.category).toBe('social');
    expect(momTask?.due_date).toBeDefined();
  });

  it('should handle urgent tasks', () => {
    const entry: VoiceEntry = {
      ...mockEntry,
      transcript_user: 'I need to submit this report ASAP. It\'s urgent!'
    };

    const tasks = extractTasks(entry);
    expect(tasks).toHaveLength(1);
    expect(tasks[0].priority).toBe('high');
  });

  it('should handle tasks with specific months', () => {
    const entry: VoiceEntry = {
      ...mockEntry,
      transcript_user: 'I need to finish the project by July. Also, I should start the new course by September.'
    };

    const tasks = extractTasks(entry);
    expect(tasks).toHaveLength(2);
    
    const projectTask = tasks.find(t => t.task_text.includes('project'));
    expect(projectTask?.due_date).toBeDefined();
    
    const courseTask = tasks.find(t => t.task_text.includes('course'));
    expect(courseTask?.due_date).toBeDefined();
    expect(courseTask?.category).toBe('education');
  });

  it('should not extract non-task statements', () => {
    const entry: VoiceEntry = {
      ...mockEntry,
      transcript_user: 'I had a great day today. The weather was nice and I went for a walk.'
    };

    const tasks = extractTasks(entry);
    expect(tasks).toHaveLength(0);
  });
}); 