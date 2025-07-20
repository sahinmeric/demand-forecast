import { useState } from "react";

export function useConfirmDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [onConfirmCallback, setOnConfirmCallback] = useState<() => void>(
    () => {}
  );
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");

  const confirm = ({
    message,
    title,
    onConfirm,
  }: {
    message: string;
    title?: string;
    onConfirm: () => void;
  }) => {
    setTitle(title || "Confirm Action");
    setMessage(message);
    setOnConfirmCallback(() => onConfirm);
    setIsOpen(true);
  };

  const handleConfirm = () => {
    onConfirmCallback();
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    message,
    title,
    confirm,
    handleConfirm,
    handleCancel,
  };
}
