"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import { categories } from "@/lib/types";

type FormState = {
  title: string;
  description: string;
  category: string;
  location: string;
  starts_at: string;
  max_participants: string;
  estimated_cost_min: string;
  estimated_cost_max: string;
  language: string;
  host_name: string;
  whatsapp_link: string;
  additional_notes: string;
};

const initialState: FormState = {
  title: "",
  description: "",
  category: "Food",
  location: "",
  starts_at: "",
  max_participants: "4",
  estimated_cost_min: "",
  estimated_cost_max: "",
  language: "English",
  host_name: "",
  whatsapp_link: "",
  additional_notes: ""
};

export function MeetupForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialState);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function validate() {
    const maxParticipants = Number(form.max_participants);
    const minCost = form.estimated_cost_min ? Number(form.estimated_cost_min) : null;
    const maxCost = form.estimated_cost_max ? Number(form.estimated_cost_max) : null;

    if (!form.title.trim() || !form.description.trim() || !form.location.trim() || !form.starts_at || !form.category || !form.language.trim()) {
      return "Title, description, category, location, date, and language are required.";
    }
    if (!form.whatsapp_link.trim()) return "WhatsApp link is required.";
    if (!form.host_name.trim()) return "Host name is required.";
    if (!Number.isFinite(maxParticipants) || maxParticipants <= 1) return "Max participants must be greater than 1.";
    if (minCost !== null && maxCost !== null && maxCost < minCost) return "Estimated max cost should be greater than or equal to min cost.";
    return "";
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        router.push("/login");
        return;
      }

      const { data, error: insertError } = await supabase
        .from("meetups")
        .insert({
          host_user_id: userData.user.id,
          title: form.title.trim(),
          description: form.description.trim(),
          category: form.category,
          location: form.location.trim(),
          starts_at: new Date(form.starts_at).toISOString(),
          max_participants: Number(form.max_participants),
          estimated_cost_min: form.estimated_cost_min ? Number(form.estimated_cost_min) : null,
          estimated_cost_max: form.estimated_cost_max ? Number(form.estimated_cost_max) : null,
          language: form.language.trim(),
          host_name: form.host_name.trim(),
          whatsapp_link: form.whatsapp_link.trim(),
          additional_notes: form.additional_notes.trim() || null
        })
        .select("id")
        .single();

      if (insertError) {
        setError(insertError.message);
        return;
      }

      router.push(`/meetups/${data.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="rounded-3xl border border-stone-200 bg-white p-5 shadow-soft sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 sm:col-span-2">
          <span className="label">Title</span>
          <input className="field" value={form.title} onChange={(event) => update("title", event.target.value)} required />
        </label>
        <label className="block space-y-2 sm:col-span-2">
          <span className="label">Description</span>
          <textarea className="field min-h-32" value={form.description} onChange={(event) => update("description", event.target.value)} required />
        </label>
        <label className="block space-y-2">
          <span className="label">Category</span>
          <select className="field" value={form.category} onChange={(event) => update("category", event.target.value)} required>
            {categories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </label>
        <label className="block space-y-2">
          <span className="label">Date and time</span>
          <input className="field" type="datetime-local" value={form.starts_at} onChange={(event) => update("starts_at", event.target.value)} required />
        </label>
        <label className="block space-y-2 sm:col-span-2">
          <span className="label">Location</span>
          <input className="field" value={form.location} onChange={(event) => update("location", event.target.value)} required />
        </label>
        <label className="block space-y-2">
          <span className="label">Max participants</span>
          <input className="field" type="number" min={2} value={form.max_participants} onChange={(event) => update("max_participants", event.target.value)} required />
        </label>
        <label className="block space-y-2">
          <span className="label">Language</span>
          <input className="field" value={form.language} onChange={(event) => update("language", event.target.value)} required />
        </label>
        <label className="block space-y-2">
          <span className="label">Estimated min cost KRW</span>
          <input className="field" type="number" min={0} value={form.estimated_cost_min} onChange={(event) => update("estimated_cost_min", event.target.value)} />
        </label>
        <label className="block space-y-2">
          <span className="label">Estimated max cost KRW</span>
          <input className="field" type="number" min={0} value={form.estimated_cost_max} onChange={(event) => update("estimated_cost_max", event.target.value)} />
        </label>
        <label className="block space-y-2">
          <span className="label">Host name</span>
          <input className="field" value={form.host_name} onChange={(event) => update("host_name", event.target.value)} required />
        </label>
        <label className="block space-y-2">
          <span className="label">WhatsApp invite link</span>
          <input className="field" value={form.whatsapp_link} onChange={(event) => update("whatsapp_link", event.target.value)} required />
        </label>
        <label className="block space-y-2 sm:col-span-2">
          <span className="label">Additional notes</span>
          <textarea className="field min-h-24" value={form.additional_notes} onChange={(event) => update("additional_notes", event.target.value)} />
        </label>
      </div>
      {error ? <p className="mt-5 rounded-2xl bg-rose-50 p-3 text-sm font-semibold text-rose-700">{error}</p> : null}
      <button className="btn-primary mt-6 w-full sm:w-auto" type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Meetup"}
      </button>
    </form>
  );
}
