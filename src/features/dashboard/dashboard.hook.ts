import { useQuery } from "@tanstack/react-query";
import { dashboard } from "./dashboard.api";

export const useDashboard = () => {
  return useQuery({
    queryFn: dashboard,
    queryKey: ["stats"],
  });
};
