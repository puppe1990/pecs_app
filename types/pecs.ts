export interface PecsImage {
  id: string;
  name: string;
  src: string;
  category: 'food' | 'toys' | 'activities' | 'people' | 'places' | 'emotions' | 'actions' | 'objects';
  description?: string;
}

export interface PecsPhase {
  id: number;
  name: string;
  description: string;
  instructions: string;
  completed: boolean;
}

export interface PecsSession {
  id: string;
  userId: string;
  phase: number;
  startTime: Date;
  endTime?: Date;
  actions: PecsAction[];
  success: boolean;
}

export interface PecsAction {
  id: string;
  type: 'image_select' | 'image_exchange' | 'phrase_build' | 'question_answer';
  imageId?: string;
  timestamp: Date;
  correct: boolean;
  responseTime: number;
}

export interface PecsPhrase {
  id: string;
  elements: PecsElement[];
  type: 'request' | 'comment' | 'answer';
}

export interface PecsElement {
  type: 'text' | 'image';
  content: string; // text content or image ID
}

export interface UserProgress {
  userId: string;
  currentPhase: number;
  phasesCompleted: number[];
  totalSessions: number;
  successRate: number;
  lastActivity: Date;
}

export interface PecsSettings {
  voiceEnabled: boolean;
  animationsEnabled: boolean;
  autoAdvance: boolean;
  difficultyLevel: 'easy' | 'medium' | 'hard';
  sessionDuration: number; // in minutes
}

export type DragItem = {
  id: string;
  type: 'image';
  image: PecsImage;
};