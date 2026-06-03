import { useMutation, useQuery } from "@tanstack/react-query";
import { createMember, fetchBoardMember, fetchMember, fetchMemberById } from "./member.api";

export const useCreateMember = () => {
  return useMutation({
    mutationFn: createMember,
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