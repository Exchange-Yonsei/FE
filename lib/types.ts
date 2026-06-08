export const categories = ["Food", "Cafe", "Drinks", "Study", "Trip", "Culture", "Sports", "Other"] as const;

export type Category = (typeof categories)[number];
export type MeetupStatus = "OPEN" | "CLOSED";
export type ParticipantStatus = "PENDING" | "APPROVED" | "REJECTED";

export type Meetup = {
  id: string;
  host_user_id: string;
  title: string;
  description: string;
  category: Category | string;
  location: string;
  starts_at: string;
  max_participants: number;
  estimated_cost_min: number | null;
  estimated_cost_max: number | null;
  language: string;
  host_name: string;
  whatsapp_link?: string;
  additional_notes: string | null;
  status: MeetupStatus;
  created_at: string;
  updated_at: string;
};

export type PublicMeetup = Omit<Meetup, "whatsapp_link"> & {
  approved_count: number;
};

export type Participant = {
  id: string;
  meetup_id: string;
  name: string;
  nationality: string | null;
  short_message: string | null;
  contact_info: string | null;
  status: ParticipantStatus;
  created_at: string;
  updated_at: string;
};

export type RequestWithMeetup = Participant & {
  meetup: Meetup | null;
};
