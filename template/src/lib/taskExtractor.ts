import { VoiceEntry } from './types.js';

export interface ExtractedTask {
  task_text: string;
  due_date: string | null;
  status: 'pending' | 'completed';
  category: string | null;
  priority: 'low' | 'medium' | 'high';
  source_entry_id: string;
}

// Common task-related verbs
const TASK_VERBS = new Set([
  'need', 'want', 'have to', 'must', 'should', 'plan', 'going to',
  'gotta', 'need to', 'have to', 'should', 'must', 'plan to',
  'intend to', 'aim to', 'hope to', 'wish to', 'try to', 'schedule', 'call', 'clean', 'organize', 'submit', 'finish', 'start'
]);

// Common time indicators
const TIME_INDICATORS = new Map([
  ['tomorrow', 1],
  ['next week', 7],
  ['next month', 30],
  ['this weekend', 3],
  ['today', 0],
  ['tonight', 0],
  ['this week', 3],
  ['this month', 15],
  ['in a few days', 3],
  ['in a couple of days', 2],
  ['later this week', 3],
  ['by friday', 5],
  ['by wednesday', 3],
  ['by thursday', 4],
  ['by monday', 1],
  ['by tuesday', 2],
  ['by next week', 7],
  ['by next month', 30]
]);

// Common task categories
const CATEGORIES = new Map([
  ['health', ['doctor', 'dentist', 'appointment', 'checkup', 'medical', 'health']],
  ['work', ['work', 'job', 'career', 'business', 'meeting', 'interview', 'presentation', 'report']],
  ['personal', ['personal', 'self', 'myself', 'me']],
  ['social', ['friend', 'family', 'mom', 'dad', 'grandpa', 'grandma', 'aunt', 'uncle']],
  ['home', ['home', 'house', 'apartment', 'room', 'kitchen', 'bathroom', 'clean', 'organize']],
  ['finance', ['money', 'finance', 'bank', 'insurance', 'bill', 'payment']],
  ['education', ['learn', 'study', 'course', 'class', 'school', 'university', 'college']]
]);

function extractDueDate(text: string): string | null {
  const lowerText = text.toLowerCase();
  
  // Check for specific time indicators
  for (const [indicator, days] of TIME_INDICATORS) {
    if (lowerText.includes(indicator)) {
      const date = new Date();
      date.setDate(date.getDate() + days);
      return date.toISOString().split('T')[0];
    }
  }
  
  // Check for specific dates (e.g., "by July", "next summer")
  const monthMatches = lowerText.match(/by\s+(january|february|march|april|may|june|july|august|september|october|november|december)/i);
  if (monthMatches) {
    const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
    const targetMonth = months.indexOf(monthMatches[1].toLowerCase());
    const currentMonth = new Date().getMonth();
    const date = new Date();
    date.setMonth(targetMonth);
    if (targetMonth < currentMonth) {
      date.setFullYear(date.getFullYear() + 1);
    }
    return date.toISOString().split('T')[0];
  }
  
  return null;
}

function determineCategory(text: string): string | null {
  const lowerText = text.toLowerCase();
  
  for (const [category, keywords] of CATEGORIES) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      return category;
    }
  }
  
  return null;
}

function determinePriority(text: string, dueDate: string | null): 'low' | 'medium' | 'high' {
  const lowerText = text.toLowerCase();
  
  // High priority indicators
  if (lowerText.includes('urgent') || 
      lowerText.includes('asap') || 
      lowerText.includes('immediately') ||
      lowerText.includes('right away')) {
    return 'high';
  }
  
  // Medium priority if there's a due date
  if (dueDate) {
    return 'medium';
  }
  
  return 'low';
}

function splitCompoundVerbs(sentence: string): string[] {
  // Split on 'and' between verbs (e.g., 'clean my room and organize my desk')
  // We'll look for 'and' that is followed by a verb from our list
  const regex = /\s+and\s+(?=\w+)/gi;
  const parts = sentence.split(regex).map(s => s.trim()).filter(Boolean);
  return parts;
}

function splitIntoTasks(text: string): string[] {
  // Split by sentence boundaries
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const tasks: string[] = [];
  
  for (let sentence of sentences) {
    sentence = sentence.trim();
    // If sentence starts with 'also', remove it
    if (sentence.toLowerCase().startsWith('also ')) {
      sentence = sentence.slice(5);
    }
    // Split compound verbs
    const parts = splitCompoundVerbs(sentence);
    for (const part of parts) {
      // Check if the part contains a task verb
      const hasTaskVerb = Array.from(TASK_VERBS).some(verb => part.toLowerCase().includes(verb));
      if (hasTaskVerb) {
        tasks.push(part.trim());
      }
    }
  }
  return tasks;
}

export function extractTasks(entry: VoiceEntry): ExtractedTask[] {
  const tasks: ExtractedTask[] = [];
  const text = entry.transcript_user;
  
  // Split text into potential tasks
  const potentialTasks = splitIntoTasks(text);
  
  for (const taskText of potentialTasks) {
    const dueDate = extractDueDate(taskText);
    const category = determineCategory(taskText);
    const priority = determinePriority(taskText, dueDate);
    
    tasks.push({
      task_text: taskText.trim(),
      due_date: dueDate,
      status: 'pending',
      category,
      priority,
      source_entry_id: entry.id
    });
  }
  
  return tasks;
}

export function processEntries(entries: VoiceEntry[]): ExtractedTask[] {
  const allTasks: ExtractedTask[] = [];
  
  for (const entry of entries) {
    const tasks = extractTasks(entry);
    allTasks.push(...tasks);
  }
  
  return allTasks;
} 