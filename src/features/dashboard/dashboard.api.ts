import { api } from "../../lib/axios";
import type { Dashboard } from "../../types";

export const dashboard = async(): Promise<Dashboard> => {
  const response = await api.get("/dashboard")
  return response.data
}