"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { BilletService } from "../services/BilletService";
import { isLoggedIn } from "../lib/auth";

export default function Header() {
  const router   = useRouter();
  const pathname = usePathname();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(isLoggedIn());
  }, [pathname]);

  function handleLogout() {
    BilletService.logout();
    setLoggedIn(false);
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-violet-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-white text-xs font-bold shadow-sm group-hover:bg-violet-700 transition-colors">
            B2LP
          </span>
          <span className="text-lg font-semibold text-slate-900 group-hover:text-violet-700 transition-colors">
            MonBlog
          </span>
        </Link>

        <nav className="flex items-center gap-3">
          {loggedIn ? (
            <>
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 border border-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                Connecté
              </span>
              <button
                onClick={handleLogout}
                className="rounded-lg border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-600 hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-all"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-4 py-1.5 text-sm font-medium text-slate-600 hover:text-violet-700 transition-colors"
              >
                Se connecter
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-violet-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-violet-700 transition-colors"
              >
                Créer un compte
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
