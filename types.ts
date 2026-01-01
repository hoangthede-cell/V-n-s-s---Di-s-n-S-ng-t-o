
export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  groundingMetadata?: any;
}

export interface ChatSession {
  id: string;
  messages: Message[];
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

// Gamification Types
export type ActionType = 'polish' | 'roleplay' | 'local_explore' | 'genre_analysis' | 'script_explore' | 'music_explore' | 'local_author_explore';

export interface BadgeDefinition {
  id: ActionType;
  name: string;
  description: (threshold: number) => string;
  icon: string;
  threshold: number;
}

export type ActionCounts = {
  [key in ActionType]?: number;
};

export interface GamificationProfile {
  xp: number;
  level: number;
  actionCounts: ActionCounts;
  unlockedBadges: ActionType[];
}