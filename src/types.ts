import { Euler } from "three";

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
};
