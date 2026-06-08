"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";

export function SignOutButton() {
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button className="btn-secondary px-3 py-2" type="button" onClick={signOut} aria-label="Sign out">
      <LogOut className="h-4 w-4" aria-hidden />
    </button>
  );
}
