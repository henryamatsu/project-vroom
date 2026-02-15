import { BlendshapeCategory } from "@/src/types";
import { Euler } from "three";

export const FACE_TRACKING_TOPIC = "face-tracking" as const;
export const EMOJI_TOPIC = "emoji" as const;

export const DEFAULT_AVATAR_URL = "/models/default-avatar.glb";

export interface FaceTrackingPayload {
  blendshapes: BlendshapeCategory[];
  rotation: { x: number; y: number; z: number };
}

export function serializeFaceData(
  blendshapes: BlendshapeCategory[],
  rotation: Euler
): FaceTrackingPayload {
  return {
    blendshapes,
    rotation: { x: rotation.x, y: rotation.y, z: rotation.z },
  };
}

export function payloadToEuler(payload: FaceTrackingPayload): Euler {
  const { x, y, z } = payload.rotation;
  return new Euler(x, y, z);
}
