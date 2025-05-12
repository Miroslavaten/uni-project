import React, { FC, useState, useRef, useEffect } from "react";

interface EditableFieldProps {
  value: string;
  onSave: (newValue: string) => Promise<void> | void;
  textarea?: boolean;
  className?: string;
}

export const EditableField: FC<EditableFieldProps> = ({
  value,
  onSave,
  textarea = false,
  className,
}) => {
  const [editing, setEditing] = useState<boolean>(false);
  const [tempValue, setTempValue] = useState<string>(value);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (editing && !textarea && inputRef.current) inputRef.current!.focus();
    if (editing && textarea && textAreaRef.current)
      textAreaRef.current!.focus();
  }, [editing]);

  const handleBlur = async () => {
    if (tempValue !== value) {
      await onSave(tempValue);
    }
    setEditing(false);
  };

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      await handleBlur();
    } else if (e.key === "Escape") {
      setTempValue(value);
      setEditing(false);
    }
  };

  return editing ? (
    textarea ? (
      <textarea
        ref={textAreaRef}
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={className}
        rows={3}
      />
    ) : (
      <input
        ref={inputRef}
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={className}
      />
    )
  ) : (
    <div
      className={className}
      onClick={() => setEditing(true)}
      style={{ cursor: "pointer" }}
    >
      {value || <span style={{ color: "#aaa" }}>— empty —</span>}
    </div>
  );
};
