"use client";

import { useState, useEffect, useCallback } from "react";
import {
  useRoomContext,
  useLocalParticipant,
  useMediaDeviceSelect,
  useMediaDevices,
  useTrackVolume,
} from "@livekit/components-react";
import { Track, type LocalAudioTrack } from "livekit-client";
import { Modal } from "@/src/components/ui/Modal";
import { Button } from "@/src/components/ui/Button";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const room = useRoomContext();
  const { localParticipant } = useLocalParticipant();

  const {
    devices: micDevices,
    activeDeviceId: activeMicId,
    setActiveMediaDevice: setActiveMic,
  } = useMediaDeviceSelect({
    kind: "audioinput",
    room,
    requestPermissions: isOpen,
  });

  const outputDevices = useMediaDevices({
    kind: "audiooutput",
  });

  const [activeOutputId, setActiveOutputId] = useState<string>(() => {
    return room?.getActiveDevice("audiooutput") ?? "default";
  });

  const micPublication = localParticipant.getTrackPublication(
    Track.Source.Microphone,
  );
  const micTrack = micPublication?.track as LocalAudioTrack | undefined;
  const volume = useTrackVolume(micTrack);
  const micLevel = typeof volume === "number" ? volume : 0;

  const handleOutputChange = useCallback(
    async (deviceId: string) => {
      if (!room) return;
      try {
        await room.switchActiveDevice("audiooutput", deviceId);
        setActiveOutputId(deviceId);
      } catch (e) {
        console.warn("Failed to switch output device:", e);
      }
    },
    [room],
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Audio settings">
      <div className="space-y-6">
        {/* Microphone test */}
        <section>
          <h3 className="mb-2 text-sm font-medium text-neutral-300">
            Microphone level
          </h3>
          <div className="flex items-center gap-3">
            <div className="h-3 flex-1 overflow-hidden rounded-full bg-neutral-700">
              <div
                className="h-full bg-green-500 transition-all duration-75"
                style={{ width: `${Math.min(100, micLevel * 100)}%` }}
              />
            </div>
            <span className="text-xs text-neutral-400">
              {Math.round(micLevel * 100)}%
            </span>
          </div>
          <p className="mt-1 text-xs text-neutral-500">
            Speak to test your microphone. The bar should move when you talk.
          </p>
        </section>

        {/* Microphone selection */}
        <section>
          <h3 className="mb-2 text-sm font-medium text-neutral-300">
            Microphone
          </h3>
          <select
            value={activeMicId ?? "default"}
            onChange={(e) => setActiveMic(e.target.value)}
            className="w-full rounded-lg border border-neutral-600 bg-neutral-700 px-3 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {micDevices.map((device) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Device ${device.deviceId.slice(0, 8)}`}
              </option>
            ))}
          </select>
        </section>

        {/* Speaker selection */}
        <section>
          <h3 className="mb-2 text-sm font-medium text-neutral-300">
            Speaker / Output
          </h3>
          <select
            value={activeOutputId}
            onChange={(e) => handleOutputChange(e.target.value)}
            className="w-full rounded-lg border border-neutral-600 bg-neutral-700 px-3 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="default">Default</option>
            {outputDevices.map((device) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Device ${device.deviceId.slice(0, 8)}`}
              </option>
            ))}
          </select>
        </section>

        <div className="flex justify-end pt-2">
          <Button variant="primary" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
}
