import Link from "next/link";
import { MessageCircle } from "lucide-react";

export default function WhatsAppWidget() {
    return (
        <Link 
            href="https://wa.me/967733338633" 
            target="_blank" 
            rel="noopener noreferrer"
            className="fixed bottom-20 left-6 z-50 md:bottom-8 md:left-8 group"
            title="تواصل معنا عبر واتساب للمساعدة الفورية"
        >
            <div className="relative flex items-center justify-center w-14 h-14 bg-green-500 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300">
                <MessageCircle className="w-8 h-8 text-white" />
                
                {/* Ping animation behind the button */}
                <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-20 group-hover:animate-ping -z-10"></span>
                
                {/* Tooltip */}
                <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-black/80 text-white text-xs font-bold rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none border border-white/10">
                    تحتاج مساعدة؟ كلمنا!
                </span>
            </div>
        </Link>
    );
}
