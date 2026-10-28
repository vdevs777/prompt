"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { CheckIcon, CopyIcon } from "lucide-react";
import { toast } from "sonner";

export interface CopyButtonProps {
  content: string;
}

export function CopyButton({ content }: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isContentEmpty = !content.trim();

  function clearTimer() {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  async function handleCopy() {
    const text = content.trim();

    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);

      clearTimer();

      timerRef.current = setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      const _error = error as Error;
      toast.error(`Erro ao copiar o texto: ${_error.message}`);
    }
  }

  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, []);

  return (
    <Button
      variant="outline"
      type="button"
      size="sm"
      className="disabled:opacity-50"
      disabled={isContentEmpty}
      onClick={handleCopy}
    >
      {isCopied ? (
        <CheckIcon className="size-4 text-green-400" />
      ) : (
        <CopyIcon className="size-4" />
      )}
      <span>{isCopied ? "Copied" : "Copy"}</span>
    </Button>
  );
}
