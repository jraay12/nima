import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createMember,
  deactivate,
  fetchBoardMember,
  fetchMember,
  fetchMemberById,
} from "./member.api";

export const useCreateMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
  });
};

export const useFetchMembers = () => {
  return useQuery({
    queryFn: fetchMember,
    queryKey: ["members"],
  });
};

export const useFetchMembersById = (id: string) => {
  return useQuery({
    queryFn: () => fetchMemberById(id),
    queryKey: ["members", id],
  });
};

export const useFetchBoardMembers = () => {
  return useQuery({
    queryFn: fetchBoardMember,
    queryKey: ["board-members"],
  });
};

export const useDeactivateMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deactivate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
  });
};
