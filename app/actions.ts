"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";

async function requireUser() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login");
  return { supabase, user: data.user };
}

export async function updateParticipantStatus(participantId: string, status: "APPROVED" | "REJECTED", meetupId: string) {
  const { supabase, user } = await requireUser();

  const { data: meetup } = await supabase.from("meetups").select("id").eq("id", meetupId).eq("host_user_id", user.id).single();
  if (!meetup) throw new Error("You can only manage your own meetups.");

  const { error } = await supabase.from("participants").update({ status }).eq("id", participantId).eq("meetup_id", meetupId);
  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/meetups/${meetupId}`);
  revalidatePath(`/meetups/${meetupId}`);
}

export async function updateMeetupStatus(meetupId: string, status: "OPEN" | "CLOSED") {
  const { supabase, user } = await requireUser();
  const { error } = await supabase.from("meetups").update({ status }).eq("id", meetupId).eq("host_user_id", user.id);
  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/meetups/${meetupId}`);
  revalidatePath(`/meetups/${meetupId}`);
}

export async function deleteMeetup(meetupId: string) {
  const { supabase, user } = await requireUser();
  const { error } = await supabase.from("meetups").delete().eq("id", meetupId).eq("host_user_id", user.id);
  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
  revalidatePath("/meetups");
  redirect("/dashboard");
}
