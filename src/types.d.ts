export interface LoginInput {
  email: string
  password: string
}

export interface Sponsor {
  id: string;
  event_id: string;
  name: string;
  link: string;
  created_at: string;
  updated_at: string;
}

export interface FeatureSpeaker {
  id: string;
  event_id: string;
  fullname: string;
  role: string;
  title: string;
  speciality: string;
  image_path: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  title: string;
  badge: string;
  start_time: string;
  end_time: string;
  event_date: string;
  venue: string;
  city: string;
  address: string;
  state: string;
  zipcode: number;
  image_path: string;
  notes: string;
  created_at: string;
  updated_at: string;

  featureSpeakers: FeatureSpeaker[];
  sponsors: Sponsor[];
}

export interface GetEventsResponse {
  message: string;
  count: number;
  events: Event[];
}

export interface GetEventsResponseById {
  events: Event;
}