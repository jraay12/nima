import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  MapPin,
  Clock,
  User,
  ExternalLink,
  BadgeCheck,
  Calendar,
} from "lucide-react";
import { events } from "../mockdata";
import { useNavigate } from "react-router";

function FadeIn({
  children,
  delay = 0,
  direction = "up",
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "left" | "right" | "none";
  className?: string;
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
      className={`transition-all duration-700 ease-out ${className} ${
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

const Events = () => {
  const navigate = useNavigate();

  // methods

  const handleLearnMore = (id: string) => {
    navigate(`/event-details/${id}`);
  };
  return (
    <div className="pb-20 px-6 bg-[#fafafa] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-12">
          <FadeIn direction="up" delay={0}>
            <h2 className="text-3xl md:text-4xl font-bold text-[#027027]">
              Upcoming Events
            </h2>
          </FadeIn>
          <FadeIn direction="up" delay={120}>
            <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
              Leadership team guiding NIMA's mission in advancing healthcare,
              collaboration, and community service.
            </p>
          </FadeIn>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 gap-8">
          {events && events.length > 0 ? (
            events.slice(0, 3).map((event, i) => (
              <FadeIn
                key={event.title}
                direction={i % 2 === 0 ? "left" : "right"}
                delay={i * 100}
              >
                <NimaEventCard
                  title={event.title}
                  // speaker={event.speaker}
                  // speakerTitle={event.speakerTitle}
                  timeRange={event.timeRange}
                  timeNote={event.timeNote}
                  venue={event.venue}
                  address={event.address}
                  city={event.city}
                  day={event.day}
                  month={event.month}
                  year={event.year}
                  image={event.image}
                  onRegister={() => console.log("Register:", event.title)}
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
                No Upcoming Events
              </h3>

              <p className="text-gray-500 mt-2 max-w-md">
                There are currently no scheduled events. Please check back later
                for updates from NIMA.
              </p>
            </div>
          )}
        </div>

        {/* View All button */}
        <FadeIn direction="up" delay={100}>
          <div className="flex justify-center mt-10">
            <button
              onClick={() => navigate("/events")}
              className="group inline-flex items-center gap-3 border border-[#027027] text-[#027027] bg-transparent px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:bg-green-50 hover:-translate-y-0.5 active:scale-95"
            >
              <span>View All Events</span>
              <span className="border-l border-[#027027]/30 pl-3 flex items-center">
                <Calendar className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </span>
            </button>
          </div>
        </FadeIn>
      </div>
    </div>
  );
};

export default Events;

interface Speaker {
  name: string;
  title: string;
  role: string;
  specialty: string;
  description: string;
  image: string;
}

interface EventCardProps {
  image?: string;
  badge?: string;
  title: string;
  featuredSpeaker: Speaker[];
  timeRange: string;
  timeNote: string;
  venue: string;
  address: string;
  city: string;
  mapUrl?: string;
  onRegister?: () => void;
  onFindMore?: () => void;
  day: number;
  month: string;
  year: number;
}

export function NimaEventCard({
  image,
  badge = "SIGNATURE EVENT",
  title,
  featuredSpeaker = [],
  timeRange,
  timeNote,
  venue,
  address,
  city,
  mapUrl = "#",
  onRegister,
  onFindMore,
  day,
  month,
  year,
}: Partial<EventCardProps>) {
  return (
    <div className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 relative">
      {/* Bottom green sweep */}
      <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#027027] group-hover:w-full transition-all duration-500 z-10" />

      <div className="grid grid-cols-1 md:grid-cols-3">
        {/* IMAGE SECTION */}
        <div className="relative md:col-span-1 h-64 md:h-full bg-gray-100 overflow-hidden">
          {image ? (
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
              <MapPin className="w-10 h-10 mb-2" />
              <span className="text-sm">No Image Available</span>
            </div>
          )}

          {/* Date overlay */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-2 rounded-lg text-center shadow-sm">
            <p className="text-xl font-bold text-gray-900 leading-none">
              {day}
            </p>
            <p className="text-xs font-semibold text-[#027027] tracking-widest">
              {month}
            </p>
            <p className="text-[10px] text-gray-500">{year}</p>
          </div>
        </div>

        {/* CONTENT */}
        <div className="md:col-span-2 p-6 flex flex-col gap-4">
          {/* Badge */}
          <div className="flex items-center gap-2">
            <BadgeCheck className="w-4 h-4 text-[#027027]" />
            <span className="text-xs font-semibold text-[#027027] uppercase tracking-widest">
              {badge}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-gray-900 leading-snug">
            {title}
          </h2>

          {/* Speaker */}
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <User className="w-4 h-4 mt-0.5" />

            <div>
              {featuredSpeaker.length > 0 && (
                <>
                  <span className="font-medium text-gray-800">
                    {featuredSpeaker[0].name}
                  </span>
                  {featuredSpeaker.length > 1 && (
                    <p className="text-xs text-[#027027] mt-1 font-medium">
                      +{featuredSpeaker.length - 1} more speaker
                      {featuredSpeaker.length > 2 ? "s" : ""}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Time */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>
              <span className="text-gray-800 font-medium">{timeRange}</span> —{" "}
              {timeNote}
            </span>
          </div>

          {/* Location */}
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 mt-0.5" />
            <div>
              <p>
                {venue}, {address}, {city}
              </p>
              <a
                href={mapUrl}
                className="inline-flex items-center gap-1 text-[#027027] text-xs mt-1 hover:underline"
              >
                View on map
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-2">
            <button
              onClick={onRegister}
              className="bg-[#027027] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#01551d] active:scale-95 transition-all"
            >
              Register
            </button>
            <button
              onClick={onFindMore}
              className="border border-gray-300 text-gray-600 px-5 py-2 rounded-lg text-sm hover:bg-gray-50 active:scale-95 transition-all"
            >
              Learn more
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
