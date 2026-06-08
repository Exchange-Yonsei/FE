import { redirect } from "next/navigation";
import { MeetupForm } from "@/components/MeetupForm";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function NewMeetupPage() {
  if (!hasSupabaseEnv()) {
    redirect("/login");
  }

  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login");

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-ink">Create Meetup</h1>
        <p className="mt-2 text-stone-600">Create a casual meetup in minutes.</p>
      </div>
      <MeetupForm />
    </main>
  );
}
