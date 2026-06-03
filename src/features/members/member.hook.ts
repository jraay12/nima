import { useMutation } from "@tanstack/react-query";
import { createMember } from "./member.api";

export const useCreateMember = () => {
  return useMutation({
    mutationFn: createMember,
  });
};
