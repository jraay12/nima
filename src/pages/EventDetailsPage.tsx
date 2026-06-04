import { useEffect, useRef, useState, type ReactNode } from "react";
import { useParams, Link, useNavigate } from "react-router";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  ExternalLink,
  BadgeCheck,
  Building2,
  Tag,
  CalendarPlus,

} from "lucide-react";
import NimaFooter from "../component/Footer";
import { useFetchEventsById } from "../features/events/events.hook";
import { convertTo12Hours } from "../lib/convertTimeTo12";
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

const EventDetailsPage = () => {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();
  const { data: event } = useFetchEventsById(id!);

  //effects
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // optional
    });
  }, []);

  // methods
  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/events");
    }
  };

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#fafafa]">
        <p className="text-gray-500 text-lg">Event not found.</p>
        <Link
          to="/events"
          className="text-[#027027] font-medium hover:underline"
        >
          ← Back to Events
        </Link>
      </div>
    );
  }

  const isPast = new Date(`${event.event_date}`) < new Date();
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${event.venue}, ${event.address}, ${event.city}`,
  )}`;

  const date = new Date(event.event_date);

  return (
    <div className="bg-[#fafafa] min-h-screen">
      {/* Back link */}
      <div className="max-w-5xl mx-auto px-6 pt-8 mt-16">
        <FadeIn direction="none" delay={0}>
          <p
            onClick={() => handleGoBack()}
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#027027] transition-colors font-medium hover:cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </p>
        </FadeIn>
      </div>

      {/* Hero image or gradient header */}
      <div className="max-w-5xl mx-auto px-6 mt-6">
        <FadeIn direction="up" delay={60}>
          {event.image_path ? (
            <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden">
              <img
                src={`${import.meta.env.VITE_IMAGE_PREFIX}${event.image_path}`}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              {/* Date badge over image */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-4 py-2.5 rounded-xl text-center shadow-sm">
                <p className="text-2xl font-bold text-gray-900 leading-none">
                  {date.getDate().toString()}
                </p>
                <p className="text-xs font-semibold text-[#027027] tracking-widest">
                  {date
                    .toLocaleString("en-US", { month: "short" })
                    .toUpperCase()}
                </p>
                <p className="text-[11px] text-gray-500">
                  {date.getFullYear().toString()}
                </p>
              </div>
              {/* Badge over image */}
              <div className="absolute bottom-4 left-4 flex items-center gap-1.5 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg">
                <BadgeCheck className="w-3.5 h-3.5 text-[#027027]" />
                <span className="text-xs font-semibold text-[#027027] uppercase tracking-widest">
                  {event.badge}
                </span>
              </div>
            </div>
          ) : (
            <div className="relative w-full h-48 rounded-2xl bg-gradient-to-br from-[#f0f3f6] to-[#ebf5ee] flex items-center justify-center overflow-hidden">
              <Building2
                className="w-16 h-16 text-[#027027]/20"
                strokeWidth={1}
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-4 py-2.5 rounded-xl text-center shadow-sm">
                <p className="text-2xl font-bold text-gray-900 leading-none">
                  {date.getDate().toString()}
                </p>
                <p className="text-xs font-semibold text-[#027027] tracking-widest">
                  {date
                    .toLocaleString("en-US", { month: "short" })
                    .toUpperCase()}
                </p>
                <p className="text-[11px] text-gray-500">
                  {date.getFullYear().toString()}
                </p>
              </div>
              <div className="absolute bottom-4 left-4 flex items-center gap-1.5 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg">
                <BadgeCheck className="w-3.5 h-3.5 text-[#027027]" />
                <span className="text-xs font-semibold text-[#027027] uppercase tracking-widest">
                  {event.badge}
                </span>
              </div>
            </div>
          )}
        </FadeIn>
      </div>

      {/* Title block */}
      <div className="max-w-5xl mx-auto px-6 mt-8">
        {isPast && (
          <FadeIn direction="none" delay={80}>
            <p className="text-sm text-amber-600 font-medium mb-3">
              This event has passed.
            </p>
          </FadeIn>
        )}
        <FadeIn direction="up" delay={100}>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {event.title}
          </h1>
        </FadeIn>
        <FadeIn direction="up" delay={160}>
          <p className="text-xl md:text-2xl font-bold text-gray-700">
            {date.getDate().toString()}{" "}
            {date.toLocaleString("en-US", { month: "short" }).toUpperCase()},{" "}
            {date.getFullYear().toString()} @ {convertTo12Hours(event.start_time)} -{" "}
            {convertTo12Hours(event.end_time)}
          </p>
        </FadeIn>
        <div className="border-t border-gray-200 mt-6" />
      </div>

      {/* Details grid */}
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left — Details + Organizer */}
          <div className="md:col-span-1 flex flex-col gap-8">
            <FadeIn direction="left" delay={100}>
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Details
                </h2>
                <div className="flex flex-col gap-4">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <Calendar className="w-4 h-4 text-[#027027]" />
                      <p className="text-sm font-semibold text-gray-800">
                        Date:
                      </p>
                    </div>
                    <p className="text-sm text-gray-500 pl-5">
                      {date
                        .toLocaleString("en-US", { month: "short" })
                        .toUpperCase()}
                      , {date.getDate().toString()},{" "}
                      {date.getFullYear().toString()}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <Clock className="w-4 h-4 text-[#027027]" />
                      <p className="text-sm font-semibold text-gray-800">
                        Time:
                      </p>
                    </div>
                    <p className="text-sm text-gray-500 pl-5">
                      {convertTo12Hours(event.start_time)} - {convertTo12Hours(event.end_time)}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <Tag className="w-4 h-4 text-[#027027]" />
                      <p className="text-sm font-semibold text-gray-800">
                        Event Category:
                      </p>
                    </div>
                    <p className="text-sm text-[#027027] font-medium pl-5">
                      {event.badge}
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn direction="left" delay={180}>
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-lg font-bold text-gray-900 mb-3">
                  Organizer
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Nevada Iranian-American Medical Association
                </p>
                <a
                  href="mailto:info@nimanv.com"
                  className="inline-flex items-center gap-1.5 text-sm text-[#027027] hover:underline mt-1"
                >
                  info@nimanv.com
                </a>
              </div>
            </FadeIn>
          </div>

          {/* Right — Venue + Map */}
          <FadeIn direction="right" delay={140} className="md:col-span-2">
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-bold text-gray-900">Venue</h2>

              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-gray-800">
                  {event.venue}
                </p>
                <p className="text-sm text-gray-500">{event.address}</p>
                <p className="text-sm text-gray-500">
                  {event.city} United States
                </p>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-[#027027] hover:underline mt-1"
                >
                  View Venue Website
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Map embed */}
              <div className="relative w-full h-64 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute top-3 right-3 z-10 inline-flex items-center gap-1.5 bg-white text-xs font-medium text-gray-700 px-3 py-1.5 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  Open in Maps
                  <ExternalLink className="w-3 h-3" />
                </a>
                <iframe
                  title="Venue Map"
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(
                    `${event.venue}, ${event.address}, ${event.city}`,
                  )}&output=embed`}
                />
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 mt-10 pt-8">
          <FadeIn direction="up" delay={80}>
            <button className="group inline-flex items-center gap-2 border border-[#027027] text-[#027027] bg-transparent px-5 py-2.5 rounded-lg font-semibold text-sm transition-all hover:bg-green-50 hover:-translate-y-0.5 active:scale-95">
              <CalendarPlus className="w-4 h-4" />
              Add to Calendar
            </button>
          </FadeIn>
        </div>

        {event.featureSpeakers?.length > 0 && (
          <FadeIn direction="up" delay={180}>
            <div className="mt-12 border-t border-gray-200 pt-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span>
                  {event.featureSpeakers.length > 1
                    ? "Featured Speakers"
                    : "Featured Speaker"}
                </span>
                <span className="flex-1 h-px bg-gray-200" />
              </h2>

              <div className="space-y-5">
                {event.featureSpeakers.map((speaker) => (
                  <div
                    key={speaker.fullname}
                    className="group relative cursor-pointer bg-white border border-gray-100 rounded-2xl p-6 overflow-hidden
              transition-all duration-300 ease-out
              hover:-translate-y-1 hover:border-gray-200 hover:shadow-[0_8px_24px_rgba(0,0,0,0.07)]"
                  >
                    {/* Top accent bar */}
                    <span
                      className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl bg-[#027027]
                scale-x-0 origin-left transition-transform duration-400 group-hover:scale-x-100"
                    />

                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Avatar */}
                      <div className="shrink-0">
                        <div
                          className="w-36 h-36 rounded-[14px] overflow-hidden bg-gradient-to-br from-[#f0f3f6] to-[#ebf5ee]
                    flex items-center justify-center border border-gray-100
                    transition-all duration-300 group-hover:border-[#027027] group-hover:scale-[1.03]"
                        >
                          {speaker.image_path ? (
                            <img
                              src={`${import.meta.env.VITE_IMAGE_PREFIX}${speaker.image_path}`}
                              alt={speaker.fullname || "Speaker"}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-12 h-12 text-[#027027]/25" />
                          )}
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-gray-900">
                          {speaker.fullname || "Guest Speaker"}
                        </h3>

                        {/* Role badge */}
                        <span
                          className="inline-flex items-center gap-1.5 mt-2 text-xs font-semibold text-[#027027]
                    bg-[#ebf5ee] px-3 py-1 rounded-full
                    transition-colors duration-200 group-hover:bg-[#d2eedd]"
                        >
                          <BadgeCheck className="w-3 h-3" />
                          {speaker.role || "Featured Speaker"}
                        </span>

                        <p className="text-sm text-gray-500 mt-2">
                          {speaker.speciality || "Healthcare Professional"}
                        </p>

                        {/* Animated divider */}
                        <div
                          className="h-0.5 w-8 bg-[#027027] rounded-full my-3
                    transition-all duration-400 group-hover:w-14"
                        />

                        <p className="text-gray-600 leading-relaxed text-sm">
                          {speaker.description ||
                            "Speaker details will be announced soon."}
                        </p>

                        {speaker.title && (
                          <p className="text-xs text-gray-400 mt-3 flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5" />
                            {speaker.title}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        )}

        {/* Sponsors */}
        {event.sponsors?.length > 0 && (
          <FadeIn direction="up" delay={200}>
            <div className="mt-12 border-t border-gray-200 pt-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span>
                  {event.sponsors.length > 1 ? "Sponsors" : "Sponsor"}
                </span>
                <span className="flex-1 h-px bg-gray-200" />
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {event.sponsors.map((sponsor) => (
                  <a
                    key={sponsor.id}
                    href={sponsor.link || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
              group relative overflow-hidden
              bg-white border border-gray-100 rounded-2xl p-5
              hover:border-[#027027]/20
              hover:shadow-lg
              hover:-translate-y-1
              transition-all duration-300
            "
                  >
                    {/* Accent */}
                    <div className="absolute bottom-0 left-0 h-1 w-0 bg-[#027027] group-hover:w-full transition-all duration-500" />

                    <div className="flex items-start gap-4">
                      {/* Logo Placeholder */}
                      <div
                        className="
                  w-12 h-12 rounded-xl
                  bg-[#ebf5ee]
                  flex items-center justify-center
                  shrink-0
                "
                      >
                        <Building2 className="w-6 h-6 text-[#027027]" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 break-words">
                          {sponsor.name || "Sponsor"}
                        </h3>

                        <p className="text-sm text-gray-500 mt-1 break-all">
                          {sponsor.link || "No website available"}
                        </p>
                      </div>

                      {sponsor.link && (
                        <ExternalLink
                          className="
                    w-4 h-4 text-gray-400
                    group-hover:text-[#027027]
                    transition-colors
                  "
                        />
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </FadeIn>
        )}

        {event.notes && event.notes.trim() && (
          <FadeIn direction="up" delay={220}>
            <div className="mt-12 border-t border-gray-200 pt-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span>Event Notes</span>
                <span className="flex-1 h-px bg-gray-200" />
              </h2>

              <div
                className="
          group relative overflow-hidden
          bg-white border border-gray-100 rounded-2xl p-6
          shadow-sm
          transition-all duration-300
          hover:shadow-lg
          hover:border-gray-200
          hover:-translate-y-1
        "
              >
                {/* Accent bar */}
                <div
                  className="
            absolute left-0 top-0 h-full w-1
            bg-[#027027]
            transition-all duration-300
            group-hover:w-2
          "
                />

                <div className="pl-2">
                  <p className="text-gray-600 leading-8 whitespace-pre-line">
                    {event.notes}
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        )}
      </div>
      <NimaFooter />
    </div>
  );
};

export default EventDetailsPage;
