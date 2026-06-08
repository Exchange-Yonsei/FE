import { mockMeetups } from "@/lib/mockData";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Meetup, Participant, PublicMeetup, RequestWithMeetup } from "@/lib/types";

const publicMeetupSelect = `
  id,
  host_user_id,
  title,
  description,
  category,
  location,
  starts_at,
  max_participants,
  estimated_cost_min,
  estimated_cost_max,
  language,
  host_name,
  additional_notes,
  status,
  created_at,
  updated_at
`;

export async function getPublicMeetups(): Promise<PublicMeetup[]> {
  if (!hasSupabaseEnv()) return mockMeetups;

  const supabase = await createServerSupabaseClient();
  const { data: meetups, error } = await supabase.from("meetups").select(publicMeetupSelect).order("starts_at", { ascending: true });

  if (error || !meetups) return mockMeetups;

  const ids = meetups.map((meetup) => meetup.id);
  const { data: participants } = ids.length
    ? await supabase.from("participants").select("meetup_id").eq("status", "APPROVED").in("meetup_id", ids)
    : { data: [] };

  const counts = new Map<string, number>();
  participants?.forEach((participant) => {
    counts.set(participant.meetup_id, (counts.get(participant.meetup_id) ?? 0) + 1);
  });

  return meetups.map((meetup) => ({
    ...meetup,
    approved_count: counts.get(meetup.id) ?? 0
  })) as PublicMeetup[];
}

export async function getPublicMeetup(id: string): Promise<(PublicMeetup & { approvedParticipants: Pick<Participant, "name">[] }) | null> {
  if (!hasSupabaseEnv()) {
    const mock = mockMeetups.find((meetup) => meetup.id === id);
    return mock ? { ...mock, approvedParticipants: [{ name: "Minji" }, { name: "Alex" }].slice(0, mock.approved_count) } : null;
  }

  const supabase = await createServerSupabaseClient();
  const { data: meetup, error } = await supabase.from("meetups").select(publicMeetupSelect).eq("id", id).single();

  if (error || !meetup) return null;

  const { data: approvedParticipants } = await supabase
    .from("participants")
    .select("name")
    .eq("meetup_id", id)
    .eq("status", "APPROVED")
    .order("created_at", { ascending: true });

  return {
    ...(meetup as Omit<PublicMeetup, "approved_count">),
    approved_count: approvedParticipants?.length ?? 0,
    approvedParticipants: approvedParticipants ?? []
  };
}

export async function getHostMeetups(): Promise<Array<Meetup & { participants: Participant[] }>> {
  if (!hasSupabaseEnv()) return [];

  const supabase = await createServerSupabaseClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return [];

  const { data: meetups, error } = await supabase
    .from("meetups")
    .select("*, participants(*)")
    .eq("host_user_id", userData.user.id)
    .order("starts_at", { ascending: true });

  if (error || !meetups) return [];
  return meetups as Array<Meetup & { participants: Participant[] }>;
}

export async function getHostMeetup(id: string): Promise<(Meetup & { participants: Participant[] }) | null> {
  if (!hasSupabaseEnv()) return null;

  const supabase = await createServerSupabaseClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return null;

  const { data, error } = await supabase
    .from("meetups")
    .select("*, participants(*)")
    .eq("id", id)
    .eq("host_user_id", userData.user.id)
    .single();

  if (error || !data) return null;
  return data as Meetup & { participants: Participant[] };
}

export async function getRequestById(id: string): Promise<RequestWithMeetup | null> {
  if (!hasSupabaseEnv()) return null;

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.rpc("get_participant_request", { request_id: id }).single();

  if (error || !data) return null;

  const row = data as {
    id: string;
    meetup_id: string;
    name: string;
    nationality: string | null;
    short_message: string | null;
    contact_info: string | null;
    status: "PENDING" | "APPROVED" | "REJECTED";
    created_at: string;
    updated_at: string;
    meetup: Meetup | null;
  };

  return row;
}
