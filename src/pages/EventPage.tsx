import { Calendar } from "lucide-react";
import { NimaEventCard } from "../component/Events";
import EventSearch from "../component/SearchComponent";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useNavigate } from "react-router";
import { useFetchEvents } from "../features/events/events.hook";
import { convertTo12Hours } from "../lib/convertTimeTo12";
import NimaFooter from "../component/Footer";

/* ----------------------------
   FADE IN
----------------------------- */
function FadeIn({
  children,
}: {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "left" | "right" | "none";
}) {
  return <div>{children}</div>; // (kept minimal since unchanged logic not needed here)
}

/* ----------------------------
   MAIN PAGE
----------------------------- */
const EventPage = () => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const limit = 10;

  const { data: eventsData } = useFetchEvents();
  const events = eventsData?.events ?? [];

  const navigate = useNavigate();

  /* ----------------------------
     FILTER EVENTS
  ----------------------------- */
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesDate = (() => {
        if (!selectedDate) return true;

        const target = new Date(selectedDate);
        target.setHours(0, 0, 0, 0);

        const eventDate = new Date(event.event_date);
        eventDate.setHours(0, 0, 0, 0);

        return eventDate.getTime() === target.getTime();
      })();

      const matchesSearch =
        !search || event.title?.toLowerCase().includes(search.toLowerCase());

      return matchesDate && matchesSearch;
    });
  }, [events, selectedDate, search]);

  /* ----------------------------
     PAGINATION
  ----------------------------- */
  const paginatedEvents = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredEvents.slice(start, start + limit);
  }, [filteredEvents, page]);

  /* reset page when filter changes */
  useEffect(() => {
    setPage(1);
  }, [selectedDate]);

  /* ----------------------------
     TODAY FILTER
  ----------------------------- */
  const todayEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return events.filter((event) => {
      const eventDate = new Date(event.event_date);
      eventDate.setHours(0, 0, 0, 0);

      return eventDate.getTime() === today.getTime();
    });
  }, [events]);

  const handleLearnMore = (id: string) => {
    navigate(`/event-details/${id}`);
  };

  return (
    <div>
      <div className="bg-[#fafafa] min-h-screen py-16 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* HEADER */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-[#027027]">
              Events
            </h1>

            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover conferences, networking sessions, and community events
              hosted by NIMA.
            </p>
          </div>

          {/* SEARCH */}
          <FadeIn>
            <EventSearch onSearch={(query) => setSearch(query)} />
          </FadeIn>

          {/* FILTER BAR */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-200 px-4 py-2 rounded-lg text-sm focus:ring-1 focus:ring-[#027027]"
            />

            <button
              onClick={() => {
                const d = new Date();
                const iso = d.toISOString().split("T")[0];
                setSelectedDate(iso);
              }}
              className="inline-flex items-center gap-2 bg-[#027027] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#01551d] transition"
            >
              <Calendar className="w-4 h-4" />
              Today
            </button>

            {selectedDate && (
              <button
                onClick={() => setSelectedDate("")}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Clear filter
              </button>
            )}
          </div>

          {/* EVENTS */}
          <div className="grid grid-cols-1 gap-8">
            {paginatedEvents.length > 0 ? (
              paginatedEvents.map((event) => {
                const date = new Date(event.event_date);

                const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${event.venue}, ${event.address}, ${event.city}`,
                )}`;

                return (
                  <div key={event.id} className="transition-all duration-300">
                    <NimaEventCard
                      title={event.title}
                      timeRange={`${convertTo12Hours(
                        event.start_time,
                      )} - ${convertTo12Hours(event.end_time)}`}
                      venue={event.venue}
                      address={event.address}
                      city={event.city}
                      day={date.getDate().toString()}
                      month={date
                        .toLocaleString("en-US", { month: "short" })
                        .toUpperCase()}
                      year={date.getFullYear().toString()}
                      image={event.image_path}
                      onRegister={() => null}
                      onFindMore={() => handleLearnMore(event.id)}
                      mapUrl={googleMapsUrl}
                      featuredSpeaker={event.featureSpeakers}
                      sponsor={event.sponsors}
                    />
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-gray-300 rounded-2xl bg-white">
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mb-4">
                  <Calendar className="w-5 h-5 text-[#027027]" />
                </div>

                <h3 className="text-lg font-semibold text-gray-900">
                  No Events Found
                </h3>

                <p className="text-gray-500 mt-2 max-w-md">
                  No events match the selected date. Try another date.
                </p>
              </div>
            )}
          </div>

          {/* PAGINATION CONTROLS */}
          {filteredEvents.length > limit && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-4 py-2 text-sm border rounded-lg disabled:opacity-40"
              >
                Prev
              </button>

              <span className="text-sm text-gray-600">
                Page {page} of {Math.ceil(filteredEvents.length / limit)}
              </span>

              <button
                disabled={page >= Math.ceil(filteredEvents.length / limit)}
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 text-sm border rounded-lg disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}

          {/* TODAY HIGHLIGHT */}
          {!selectedDate && todayEvents.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900">
                Today’s Highlights
              </h2>

              <div className="grid grid-cols-1 gap-6">
                {todayEvents.map((event) => (
                  <NimaEventCard
                    key={event.id}
                    {...event}
                    onFindMore={() => handleLearnMore(event.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <NimaFooter />
    </div>
  );
};

export default EventPage;
