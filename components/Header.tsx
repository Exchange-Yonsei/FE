import Link from "next/link";
import { UsersRound } from "lucide-react";
import { SignOutButton } from "@/components/SignOutButton";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function Header() {
  let isLoggedIn = false;

  if (hasSupabaseEnv()) {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase.auth.getUser();
    isLoggedIn = Boolean(data.user);
  }

  return (
    <header className="sticky top-0 z-30 border-b border-stone-200/70 bg-[#fbfaf6]/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-black text-ink">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-leaf text-white">
            <UsersRound className="h-5 w-5" aria-hidden />
          </span>
          TableMate Yonsei
        </Link>
        <div className="flex items-center gap-2">
          <Link className="hidden text-sm font-semibold text-stone-700 sm:inline" href="/meetups">
            Meetups
          </Link>
          {isLoggedIn ? (
            <>
              <Link className="btn-secondary px-4 py-2" href="/dashboard">
                Dashboard
              </Link>
              <SignOutButton />
            </>
          ) : (
            <Link className="btn-primary px-4 py-2" href="/login">
              Host login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
