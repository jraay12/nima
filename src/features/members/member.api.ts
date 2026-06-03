import { api } from "../../lib/axios";

export const createMember = async (data: any) => {
  const response = await api.post("/members", data);
  return response.data;
};

export const fetchMember = async () => {
  const response = await api.get("/members");
  return response.data.data;
};

export const fetchMemberById = async (id: string) => {
  const response = await api.get(`/members/${id}`);
  return response.data.data;
};

export const fetchBoardMember = async () => {
  const response = await api.get("/members/board");
  return response.data.data;
};
