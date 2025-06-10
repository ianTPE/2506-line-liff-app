import { Liff } from '@line/liff';

export interface LiffContextType {
  liff: Liff | null;
  liffError: string | null;
  isLoggedIn: boolean;
  isInClient: boolean;
  isReady: boolean;
}

export interface LiffMessage {
  type: 'text' | 'image' | 'video';
  text?: string;
  originalContentUrl?: string;
  previewImageUrl?: string;
}
