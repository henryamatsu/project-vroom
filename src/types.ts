import { Euler } from "three";
import type { Participant as LiveKitParticipant } from "livekit-client";

export type BlendshapeCategory = {
  categoryName: string;
  score: number;
};

export type Participant = {
  id: string;
  name: string;
  url: string;
  blendshapes: BlendshapeCategory[];
  rotation: Euler;
  isMuted: boolean;
  isSpeaking: boolean;
  isMirrored: boolean;
  liveKitParticipant: LiveKitParticipant;
};
