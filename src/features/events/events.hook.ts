import { useMutation } from "@tanstack/react-query";
import { createEvent } from "./events.api";

export const useCreateEvent = () => {
  return useMutation({
    mutationFn: createEvent,
  });
};
