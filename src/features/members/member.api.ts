import { api } from "../../lib/axios";

export const createMember = async (data: any) => {
  const response = await api.post("/members", data);
  return response.data;
};
