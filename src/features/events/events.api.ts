import { api } from "../../lib/axios";
import type { GetEventsResponse,Event } from "../../types";

export const createEvent = async (data: any) => {
  const response = await api.post("/event/create", data);
  return response.data;
};


export const fetchEvents = async (): Promise<GetEventsResponse> => {
  const response = await api.get("/event/")
  return response.data
}

export const fetchEventsById = async (id: string): Promise<Event> => {
  const response = await api.get(`/event/${id}`)
  return response.data.event
}