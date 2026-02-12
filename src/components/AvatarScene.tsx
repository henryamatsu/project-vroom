"use client";

import { Color } from "three";
import { Avatar } from "./Avatar";
import { Participant } from "@/src/types";
import { View } from "@react-three/drei";

export function AvatarScene({
  participant,
  // mirrored = false,
  // style,
}: {
  participant: Participant;
}) {
  return (
    // <View>
    <>
      <ambientLight intensity={1} />
      <pointLight
        position={[10, 10, 10]}
        color={new Color(1, 1, 0)}
        intensity={0.5}
        castShadow
      />
      <pointLight
        position={[-10, 0, 10]}
        color={new Color(1, 0, 0)}
        intensity={0.5}
        castShadow
      />
      <pointLight position={[0, 0, 10]} intensity={0.5} castShadow />
      <Avatar participant={participant} />
    </>
    // </View>
  );
}
