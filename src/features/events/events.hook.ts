import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createEvent, fetchEvents, fetchEventsById } from "./events.api";

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEvent,
    onSuccess: (_, variables) => {
      const id = (variables as FormData).get("id");
      queryClient.invalidateQueries({ queryKey: ["events"] });

      if (id) {
        queryClient.invalidateQueries({ queryKey: ["event", id] });
      }
    },
  });
};

export const useFetchEvents = () => {
  return useQuery({
    queryFn: fetchEvents,
    queryKey: ["events"],
  });
};

export const useFetchEventsById = (id: string) => {
  return useQuery({
    queryFn: () => fetchEventsById(id),
    queryKey: ["events", id],
  });
};
