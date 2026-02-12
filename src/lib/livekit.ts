import { BlendshapeCategory } from "@/src/types";
import { Euler } from "three";

export const FACE_TRACKING_TOPIC = "face-tracking" as const;
export const ROOM_NAME = "vroom-demo";

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
