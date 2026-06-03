import { useState } from "react";
import { useNavigate } from "react-router";
import {
  CalendarDays,
  MapPin,
  Clock,
  Plus,
  Search,
  ChevronRight,
  Users,
} from "lucide-react";
import { useFetchEvents } from "../../features/events/events.hook";
import type { Event } from "../../types";
import { convertTo12Hours } from "../../lib/convertTimeTo12";

// Badge color map
const badgeStyles: Record<string, { bg: string; text: string; dot: string }> = {
  "SIGNATURE EVENT": {
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-400",
  },
  CME: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-400" },
  NETWORKING: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    dot: "bg-purple-400",
  },
  WORKSHOP: { bg: "bg-rose-50", text: "text-rose-700", dot: "bg-rose-400" },
  DEFAULT: {
    bg: "bg-green-50",
    text: "text-[#027027]",
    dot: "bg-[#027027]",
  },
};

function getBadgeStyle(badge: string) {
  return badgeStyles[badge?.toUpperCase()] ?? badgeStyles.DEFAULT;
}

const FILTERS = [
  "All",
  "Upcoming",
  "Past",
  "Signature Event",
  "CME",
  "Networking",
];

const EventsPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const { data: events } = useFetchEvents();
  console.log(events)
  let past: boolean;
  const filtered = events?.events?.filter((e: Event) => {
    const matchSearch =
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.venue.toLowerCase().includes(search.toLowerCase()) ||
      e.city.toLowerCase().includes(search.toLowerCase());

    past = new Date(e.event_date) < new Date();

    const matchFilter =
      activeFilter === "All" ||
      (activeFilter === "Upcoming" && !past) ||
      (activeFilter === "Past" && past) ||
      e.badge?.toUpperCase() === activeFilter.toUpperCase();

    return matchSearch && matchFilter;
  });

  return (
    <div className=" mx-auto">
      {/* Page header */}
      <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Events</h1>
          <p className="text-sm text-gray-500">
            {events?.events.length} event
            {events?.events.length !== 1 ? "s" : ""} total ·{" "}
            {events?.events.filter(() => !past).length} upcoming
          </p>
        </div>
        <button
          onClick={() => navigate("/event/create")}
          className="inline-flex items-center gap-2 bg-[#027027] text-white text-sm font-semibold
            px-4 py-2.5 rounded-xl transition-all duration-200
            hover:bg-[#025f22] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#027027]/30"
        >
          <Plus className="w-4 h-4" />
          Create Event
        </button>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events, venues, cities…"
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white text-gray-900
              placeholder-gray-400 outline-none transition-all
              focus:border-[#027027] focus:ring-2 focus:ring-[#027027]/10 hover:border-gray-300"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-150 border
                ${
                  activeFilter === f
                    ? "bg-[#027027] text-white border-[#027027]"
                    : "bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700"
                }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      {search && (
        <p className="text-xs text-gray-400 mb-4">
          {filtered?.length} result{filtered?.length !== 1 ? "s" : ""} for
          &quot;
          {search}&quot;
        </p>
      )}

      {/* Events grid */}
      {filtered?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
            <CalendarDays className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-gray-700 font-semibold mb-1">No events found</p>
          <p className="text-sm text-gray-400">
            Try adjusting your search or filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered?.map((event: Event) => {
            const [hours, minutes] = event.end_time.split(":").map(Number);
            const eventEnd = new Date(event.event_date);
            eventEnd.setHours(hours, minutes, 0, 0);

            const past = eventEnd < new Date();
            const badge = getBadgeStyle(event.badge);
            const speakerCount = event.featureSpeakers?.length ?? 0;

            const date = new Date(event.event_date);

            const day = date.getDate();

            const month = date
              .toLocaleString("en-US", {
                month: "short",
              })
              .toUpperCase();

            return (
              <div
                key={event.id}
                onClick={() => navigate(`/event/details/${event.id}`)}
                className={`group bg-white border border-gray-100 rounded-xl overflow-hidden cursor-pointer
  transition-all duration-200 ease-out
  hover:-translate-y-0.5 hover:shadow-md
  ${past ? "opacity-70" : ""}`}
              >
                {/* Image */}
                <div className="relative h-36 bg-gradient-to-br from-[#f0f3f6] to-[#ebf5ee] overflow-hidden">
                  {event?.image_path ? (
                    <img
                      src={`${import.meta.env.VITE_IMAGE_PREFIX}${event.image_path}`}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <CalendarDays
                        className="w-10 h-10 text-[#027027]/20"
                        strokeWidth={1}
                      />
                    </div>
                  )}

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                  {/* Date badge */}
                  <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-center min-w-[42px]">
                    <p className="text-base font-bold text-gray-900 leading-none">
                      {day}
                    </p>
                    <p className="text-[9px] font-bold text-[#027027] tracking-widest">
                      {month}
                    </p>
                  </div>

                  {/* Past pill */}
                  {past && (
                    <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1 rounded-lg">
                      Past
                    </div>
                  )}

                  {/* Speaker count */}
                  {speakerCount > 0 && (
                    <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg">
                      <Users className="w-3 h-3 text-gray-600" />
                      <span className="text-[11px] font-semibold text-gray-700">
                        {speakerCount} speaker{speakerCount !== 1 ? "s" : ""}
                      </span>
                    </div>
                  )}
                </div>

                {/* Body */}
                <div className="p-4">
                  {/* Badge */}
                  <div
                    className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full mb-2.5 ${badge.bg} ${badge.text}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                    {event.badge}
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-semibold text-gray-900 mb-2 leading-snug line-clamp-2 group-hover:text-[#027027]">
                    {event.title}
                  </h3>

                  {/* Meta */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="truncate">
                        {convertTo12Hours(event.start_time)} - {convertTo12Hours(event.end_time)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="truncate">
                        {event.venue}, {event.city}
                      </span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-4 pt-3.5 border-t border-gray-100">
                    {/* Speakers preview */}
                    {speakerCount > 0 ? (
                      <div className="flex items-center gap-1.5">
                        <div className="flex -space-x-1.5">
                          {event.featureSpeakers
                            .slice(0, 3)
                            .map((s: any, i: any) => (
                              <div
                                key={i}
                                className="w-6 h-6 rounded-full border-2 border-white bg-gradient-to-br from-[#ebf5ee] to-[#d2eedd] overflow-hidden shrink-0"
                                style={{ zIndex: 3 - i }}
                              >
                                {s.image_path ? (
                                  <img
                                    src={`${import.meta.env.VITE_IMAGE_PREFIX}${s.image_path}`}
                                    alt={s.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <span className="text-[8px] font-bold text-[#027027]">
                                      {s.name?.charAt(0) ?? "?"}
                                    </span>
                                  </div>
                                )}
                              </div>
                            ))}
                        </div>
                        <span className="text-[11px] text-gray-400">
                          {speakerCount > 1
                            ? `+${speakerCount - 1} more`
                            : event.featureSpeakers[0]?.fullname}
                        </span>
                      </div>
                    ) : (
                      <div />
                    )}

                    <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-[#027027] group-hover:gap-1.5 transition-all duration-150">
                      View
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EventsPage;
