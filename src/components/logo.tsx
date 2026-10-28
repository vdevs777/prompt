import { MessageSquareIcon } from "lucide-react";
import Link from "next/link";

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 hover:text-accent-600 rounded-lg transition-colors"
    >
      <MessageSquareIcon />
      <span className="text-lg font-semibold">PROMPTS</span>
    </Link>
  );
}
