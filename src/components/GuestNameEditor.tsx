"use client";

import { useState } from "react";

interface GuestNameEditorProps {
  currentName: string;
  onNameChange: (name: string) => void | Promise<void>;
}

export default function GuestNameEditor({
  currentName,
  onNameChange,
}: GuestNameEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(currentName);

  const handleSave = () => {
    const trimmed = value.trim() || "Guest";
    setValue(trimmed);
    onNameChange(trimmed);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
          className="px-2 py-1 rounded bg-gray-800 border border-gray-600 text-sm text-white w-32"
          autoFocus
        />
        <button
          onClick={handleSave}
          className="text-xs text-blue-400 hover:text-blue-300"
        >
          Save
        </button>
        <button
          onClick={() => {
            setValue(currentName);
            setIsEditing(false);
          }}
          className="text-xs text-gray-400 hover:text-gray-300"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsEditing(true)}
      className="text-xs text-gray-400 hover:text-gray-300 flex items-center gap-1"
      title="Change your display name"
    >
      {currentName}
      <span>✎</span>
    </button>
  );
}
