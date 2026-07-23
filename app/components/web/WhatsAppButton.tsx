import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/2348143230439"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#38c625] text-[#0d0a1f] p-4 rounded-full shadow-[0_4px_20px_rgba(166,198,37,0.4)] hover:bg-[#5840bb] hover:text-white transform hover:scale-110 transition-all"
      aria-label="Contact Our Sure Plug via WhatsApp">
      <MessageCircle className="w-7 h-7 text-white" />
    </a>
  );
}
