import Link from "next/link";
import { Scale, Share2, Camera, X as XIcon, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-navy-800 dark:bg-[#0a0e1a] text-white mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid sm:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-gold-400">
              <Scale size={16} />
            </div>
            <span className="text-lg font-extrabold font-serif">Legal<span className="text-gold-400">Ease</span></span>
          </div>
          <p className="text-sm text-navy-100/80 mt-3 leading-relaxed">
            Connecting you with trusted legal professionals — browse, hire, and manage your legal matters in one place.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-sm mb-3 text-gold-400">Quick Links</h3>
          <ul className="space-y-2 text-sm text-navy-100/80">
            <li><Link href="/lawyers" className="hover:text-white transition-colors">Browse Lawyers</Link></li>
            <li><Link href="/register" className="hover:text-white transition-colors">Join as a Lawyer</Link></li>
            <li><Link href="/login" className="hover:text-white transition-colors">Login</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-sm mb-3 text-gold-400">Stay Connected</h3>
          <p className="flex items-center gap-2 text-sm text-navy-100/80 mb-4"><Mail size={14} /> support@legalease.com</p>
          <div className="flex items-center gap-3">
            <a href="#" aria-label="Share" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"><Share2 size={16} /></a>
            <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"><Camera size={16} /></a>
            <a href="#" aria-label="X" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"><XIcon size={16} /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-navy-100/60">
        © {new Date().getFullYear()} LegalEase. Built for DIU coursework.
      </div>
    </footer>
  );
}
