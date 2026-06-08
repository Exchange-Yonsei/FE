"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";

export function JoinRequestForm({ meetupId, disabled }: { meetupId: string; disabled: boolean }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [nationality, setNationality] = useState("");
  const [shortMessage, setShortMessage] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error: insertError } = await supabase
        .from("participants")
        .insert({
          meetup_id: meetupId,
          name: name.trim(),
          nationality: nationality.trim() || null,
          short_message: shortMessage.trim() || null,
          contact_info: contactInfo.trim() || null
        })
        .select("id")
        .single();

      if (insertError) {
        setError(insertError.message);
        return;
      }

      router.push(`/requests/${data.id}?sent=1`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="rounded-3xl border border-stone-200 bg-white p-5 shadow-soft">
      <h2 className="text-xl font-black text-ink">Request to Join</h2>
      <p className="mt-2 text-sm text-stone-600">The host will review your request. Approved participants can join through WhatsApp.</p>
      <div className="mt-5 space-y-4">
        <label className="block space-y-2">
          <span className="label">Name</span>
          <input className="field" value={name} onChange={(event) => setName(event.target.value)} disabled={disabled} required />
        </label>
        <label className="block space-y-2">
          <span className="label">Nationality</span>
          <input className="field" value={nationality} onChange={(event) => setNationality(event.target.value)} disabled={disabled} />
        </label>
        <label className="block space-y-2">
          <span className="label">Short message</span>
          <textarea className="field min-h-24" value={shortMessage} onChange={(event) => setShortMessage(event.target.value)} disabled={disabled} />
        </label>
        <label className="block space-y-2">
          <span className="label">Contact info optional</span>
          <input className="field" value={contactInfo} onChange={(event) => setContactInfo(event.target.value)} disabled={disabled} />
        </label>
      </div>
      {error ? <p className="mt-4 rounded-2xl bg-rose-50 p-3 text-sm font-semibold text-rose-700">{error}</p> : null}
      <button className="btn-primary mt-5 w-full" type="submit" disabled={disabled || loading}>
        {disabled ? "Meetup unavailable" : loading ? "Sending..." : "Request to Join"}
      </button>
    </form>
  );
}
