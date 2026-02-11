import { Euler } from "three";

export type BlendshapeCategory = {
  categoryName: string;
  score: number;
};

export type Participant = {
  name: string;
  url: string;
  blendshapes: BlendshapeCategory[];
  rotation: Euler;
  isMuted: boolean;
  isSpeaking: boolean;
  isMirrored: boolean;
};
