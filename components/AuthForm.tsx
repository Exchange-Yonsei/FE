"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");
    setLoading(true);

    try {
      const supabase = createClient();
      const result =
        mode === "login"
          ? await supabase.auth.signInWithPassword({ email, password })
          : await supabase.auth.signUp({ email, password });

      if (result.error) {
        setError(result.error.message);
        return;
      }

      if (mode === "signup" && !result.data.session) {
        setNotice("Check your email to confirm your account, then log in.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-md rounded-3xl border border-stone-200 bg-white p-6 shadow-soft">
      <h1 className="text-2xl font-black text-ink">{mode === "login" ? "Host login" : "Create a host account"}</h1>
      <p className="mt-2 text-sm text-stone-600">
        {mode === "login" ? "Manage your Yonsei meetups." : "Use email and password. No OAuth or university verification yet."}
      </p>
      <div className="mt-6 space-y-4">
        <label className="block space-y-2">
          <span className="label">Email</span>
          <input className="field" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </label>
        <label className="block space-y-2">
          <span className="label">Password</span>
          <input
            className="field"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={6}
            required
          />
        </label>
      </div>
      {error ? <p className="mt-4 rounded-2xl bg-rose-50 p-3 text-sm font-semibold text-rose-700">{error}</p> : null}
      {notice ? <p className="mt-4 rounded-2xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">{notice}</p> : null}
      <button className="btn-primary mt-6 w-full" type="submit" disabled={loading}>
        {loading ? "Working..." : mode === "login" ? "Log in" : "Sign up"}
      </button>
      <p className="mt-4 text-center text-sm text-stone-600">
        {mode === "login" ? "New host?" : "Already have an account?"}{" "}
        <Link className="font-bold text-leaf" href={mode === "login" ? "/signup" : "/login"}>
          {mode === "login" ? "Sign up" : "Log in"}
        </Link>
      </p>
    </form>
  );
}
