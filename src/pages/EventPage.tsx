import { Calendar } from "lucide-react";
import { NimaEventCard } from "../component/Events";
import EventSearch from "../component/SearchComponent";
import { events } from "../mockdata";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useNavigate } from "react-router";

/* ----------------------------
   MONTH MAP
----------------------------- */
const MONTH_MAP: Record<string, number> = {
  JAN: 0,
  FEB: 1,
  MAR: 2,
  APR: 3,
  MAY: 4,
  JUN: 5,
  JUL: 6,
  AUG: 7,
  SEP: 8,
  OCT: 9,
  NOV: 10,
  DEC: 11,
};

const getEventDate = (event: any) => {
  return new Date(event.year, MONTH_MAP[event.month.toUpperCase()], event.day);
};

/* ----------------------------
   FADE IN
----------------------------- */
function FadeIn({
  children,
  delay = 0,
  direction = "up",
}: {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "left" | "right" | "none";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const translate = {
    up: "translate-y-8",
    left: "-translate-x-8",
    right: "translate-x-8",
    none: "",
  }[direction];

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        visible
          ? "opacity-100 translate-x-0 translate-y-0"
          : `opacity-0 ${translate}`
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ----------------------------
   MAIN PAGE
----------------------------- */
const EventPage = () => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const navigate = useNavigate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  /* ----------------------------
     FILTERED EVENTS
  ----------------------------- */
  const filteredEvents = useMemo(() => {
    if (!selectedDate) return events;

    const target = new Date(selectedDate);
    target.setHours(0, 0, 0, 0);

    return events.filter((event) => {
      const eventDate = getEventDate(event);
      eventDate.setHours(0, 0, 0, 0);

      return eventDate.getTime() === target.getTime();
    });
  }, [selectedDate]);

  /* ----------------------------
     TODAY FILTER
  ----------------------------- */
  const todayEvents = useMemo(() => {
    return events.filter((event) => {
      const eventDate = getEventDate(event);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate.getTime() === today.getTime();
    });
  }, []);

  // Methods
  const handleLearnMore = (id: string) => {
    navigate(`/event-details/${id}`);
  };

  return (
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
          <EventSearch onSearch={(query) => console.log("Search:", query)} />
        </FadeIn>

        {/* FILTER BAR */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* DATE PICKER */}
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-200 px-4 py-2 rounded-lg text-sm focus:ring-1 focus:ring-[#027027]"
          />

          {/* TODAY BUTTON */}
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

          {/* CLEAR FILTER */}
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
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event, i) => (
              <FadeIn
                key={event.title}
                direction={i % 2 === 0 ? "left" : "right"}
                delay={i * 80}
              >
                <NimaEventCard
                  {...event}
                  onFindMore={() => handleLearnMore(event.id)}
                />
              </FadeIn>
            ))
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

        {/* TODAY HIGHLIGHT (optional section) */}
        {!selectedDate && todayEvents.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">
              Today’s Highlights
            </h2>

            <div className="grid grid-cols-1 gap-6">
              {todayEvents.map((event, i) => (
                <FadeIn key={event.title} direction="up" delay={i * 80}>
                  <NimaEventCard {...event} />
                </FadeIn>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventPage;
