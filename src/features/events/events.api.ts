import { api } from "../../lib/axios";

export const createEvent = async (data: any) => {
  const response = await api.post("/event/create", data);
  return response.data;
};
