"use client";

import { MessageCircle } from "lucide-react";

interface WhatsAppButtonProps {
  productName: string;
}

export function WhatsAppButton({ productName }: WhatsAppButtonProps) {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "918050790981";
  const message = encodeURIComponent(
    `Hi, I'm interested in ${productName}. Please share more details.`
  );
  const url = `https://wa.me/${phone}?text=${message}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all border border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700 h-10 px-6 w-full"
    >
      <MessageCircle className="h-4 w-4" />
      WhatsApp Chat
    </a>
  );
}
