import { useState, useMemo, useRef, useEffect } from "react";
import {
  CalendarDays,
  MapPin,
  Clock,
  Users,
  Building2,
  ChevronLeft,
  Pencil,
  Save,
  X,
  Lock,
  ExternalLink,
  FileText,
  CheckCircle2,
  Hash,
  Camera,
  Plus,
  Trash2,
  Star,
  Tag,
} from "lucide-react";
import { useParams, useNavigate } from "react-router";
import {
  useCreateEvent,
  useFetchEventsById,
} from "../../features/events/events.hook";
import type { Event, FeatureSpeaker, Sponsor } from "../../types";

// ─── Local-only form types (extends API types with preview fields) ─────────────

interface SpeakerForm extends FeatureSpeaker {
  imagePreview?: string;
  imageFile?: File;
}

interface EventForm extends Event {
  imagePreview?: string;
  imageFile?: File;
  featureSpeakers: SpeakerForm[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const BADGE_OPTIONS = [
  "SIGNATURE EVENT",
  "CME",
  "NETWORKING",
  "WORKSHOP",
  "OTHER",
];

const badgeStyles: Record<
  string,
  { bg: string; text: string; dot: string; border: string }
> = {
  "SIGNATURE EVENT": {
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-400",
    border: "border-amber-200",
  },
  CME: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    dot: "bg-blue-400",
    border: "border-blue-200",
  },
  NETWORKING: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    dot: "bg-purple-400",
    border: "border-purple-200",
  },
  WORKSHOP: {
    bg: "bg-rose-50",
    text: "text-rose-700",
    dot: "bg-rose-400",
    border: "border-rose-200",
  },
  DEFAULT: {
    bg: "bg-green-50",
    text: "text-[#027027]",
    dot: "bg-[#027027]",
    border: "border-green-200",
  },
};

function getBadgeStyle(badge: string) {
  return badgeStyles[badge?.toUpperCase()] ?? badgeStyles.DEFAULT;
}

const speakerAvatarColors = [
  "from-[#ebf5ee] to-[#d2eedd] text-[#027027]",
  "from-blue-50 to-blue-100 text-blue-700",
  "from-amber-50 to-amber-100 text-amber-700",
  "from-purple-50 to-purple-100 text-purple-700",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function convertTo12Hours(time: string): string {
  if (!time) return "";
  const [h, m] = time.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, "0")} ${suffix}`;
}

function formatFullDate(dateStr: string): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getInitials(name: string): string {
  return (name || "?")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function nanoid(): string {
  return Math.random().toString(36).slice(2, 10);
}

const inputCls =
  "w-full text-sm text-gray-900 border border-gray-200 rounded-xl px-3 py-2.5 outline-none transition-all focus:border-[#027027] focus:ring-2 focus:ring-[#027027]/10 hover:border-gray-300 bg-white";

// ─── Field ────────────────────────────────────────────────────────────────────

interface FieldProps {
  label: string;
  value: string;
  editing: boolean;
  onChange?: (v: string) => void;
  icon: React.ReactNode;
  multiline?: boolean;
  type?: string;
}

function Field({
  label,
  value,
  editing,
  onChange,
  icon,
  multiline,
  type = "text",
}: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase flex items-center gap-1.5">
        <span className="text-gray-400">{icon}</span>
        {label}
      </label>
      {editing ? (
        multiline ? (
          <textarea
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            rows={3}
            className={`${inputCls} resize-none`}
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            className={inputCls}
          />
        )
      ) : (
        <p className="text-sm text-gray-700 leading-relaxed min-h-[20px]">
          {value || <span className="text-gray-400 italic">Not set</span>}
        </p>
      )}
    </div>
  );
}

// ─── ImageUpload ──────────────────────────────────────────────────────────────

interface ImageUploadProps {
  onUpload: (dataUrl: string, file: File) => void;
  className?: string;
  children: React.ReactNode;
}

function ImageUpload({ onUpload, className = "", children }: ImageUploadProps) {
  const ref = useRef<HTMLInputElement>(null);
  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onUpload(reader.result as string, file);
    reader.readAsDataURL(file);
    // reset so same file can be re-picked
    e.target.value = "";
  }
  return (
    <>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
      <div
        className={`relative cursor-pointer group ${className}`}
        onClick={() => ref.current?.click()}
      >
        {children}
      </div>
    </>
  );
}

// ─── SpeakerCard ──────────────────────────────────────────────────────────────

interface SpeakerCardProps {
  speaker: SpeakerForm;
  index: number;
  editing: boolean;
  imagePrefix: string;
  onChange: (updated: SpeakerForm) => void;
  onRemove: () => void;
}

function SpeakerCard({
  speaker,
  index,
  editing,
  imagePrefix,
  onChange,
  onRemove,
}: SpeakerCardProps) {
  const avatarGradient =
    speakerAvatarColors[index % speakerAvatarColors.length];
  const preview =
    speaker.imagePreview ||
    (speaker.image_path ? `${imagePrefix}${speaker.image_path}` : "");

  return (
    <div
      className={`border rounded-2xl overflow-hidden transition-all ${editing ? "border-gray-200 shadow-sm" : "border-gray-100"}`}
    >
      <div className="flex items-start gap-4 p-4">
        {/* Avatar */}
        {editing ? (
          <ImageUpload
            onUpload={(url, file) =>
              onChange({ ...speaker, imagePreview: url, imageFile: file })
            }
            className="shrink-0"
          >
            <div
              className={`w-14 h-14 rounded-xl bg-gradient-to-br ${avatarGradient} flex items-center justify-center font-bold text-base border-2 border-white shadow-sm overflow-hidden`}
            >
              {preview ? (
                <img
                  src={preview}
                  alt={speaker.fullname}
                  className="w-full h-full object-cover"
                />
              ) : (
                getInitials(speaker.fullname)
              )}
            </div>
            <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="w-4 h-4 text-white" />
            </div>
          </ImageUpload>
        ) : (
          <div
            className={`w-14 h-14 rounded-xl bg-gradient-to-br ${avatarGradient} flex items-center justify-center font-bold text-base border-2 border-white shadow-sm overflow-hidden shrink-0`}
          >
            {preview ? (
              <img
                src={preview}
                alt={speaker.fullname}
                className="w-full h-full object-cover"
              />
            ) : (
              getInitials(speaker.fullname)
            )}
          </div>
        )}

        {/* Name + role */}
        <div className="flex-1 min-w-0">
          {editing ? (
            <div className="space-y-2">
              <input
                value={speaker.fullname}
                onChange={(e) =>
                  onChange({ ...speaker, fullname: e.target.value })
                }
                placeholder="Full name"
                className={`${inputCls} font-semibold`}
              />
              <input
                value={speaker.role}
                onChange={(e) => onChange({ ...speaker, role: e.target.value })}
                placeholder="Role (e.g. Keynote Speaker)"
                className={inputCls}
              />
            </div>
          ) : (
            <>
              <p className="text-sm font-semibold text-gray-900">
                {speaker.fullname}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{speaker.role}</p>
            </>
          )}
        </div>

        {editing && (
          <button
            onClick={onRemove}
            className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {editing ? (
        <div className="px-4 pb-4 grid grid-cols-2 gap-3 border-t border-gray-100 pt-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
              Title
            </label>
            <input
              value={speaker.title}
              onChange={(e) => onChange({ ...speaker, title: e.target.value })}
              placeholder="e.g. Web Developer"
              className={inputCls}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
              Speciality
            </label>
            <input
              value={speaker.speciality}
              onChange={(e) =>
                onChange({ ...speaker, speciality: e.target.value })
              }
              placeholder="e.g. Node.js"
              className={inputCls}
            />
          </div>
          <div className="col-span-2 space-y-1">
            <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
              Description
            </label>
            <textarea
              value={speaker.description}
              onChange={(e) =>
                onChange({ ...speaker, description: e.target.value })
              }
              placeholder="Short bio…"
              rows={2}
              className={`${inputCls} resize-none`}
            />
          </div>
        </div>
      ) : (
        <div className="px-4 pb-4 border-t border-gray-50 pt-3 space-y-1">
          <p className="text-xs text-gray-500">
            {speaker.title} · {speaker.speciality}
          </p>
          {speaker.description && (
            <p className="text-xs text-gray-400 leading-relaxed">
              {speaker.description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── SponsorRow ───────────────────────────────────────────────────────────────

interface SponsorRowProps {
  sponsor: Sponsor;
  index: number;
  editing: boolean;
  onChange: (updated: Sponsor) => void;
  onRemove: () => void;
}

function SponsorRow({
  sponsor,
  index,
  editing,
  onChange,
  onRemove,
}: SponsorRowProps) {
  const colors = [
    "bg-[#ebf5ee] text-[#027027]",
    "bg-blue-50 text-blue-700",
    "bg-amber-50 text-amber-700",
    "bg-purple-50 text-purple-700",
  ];

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${editing ? "bg-white border border-gray-200" : "bg-gray-50 hover:bg-green-50"}`}
    >
      <div
        className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${colors[index % colors.length]}`}
      >
        {(sponsor.name || "SP").slice(0, 2).toUpperCase()}
      </div>
      {editing ? (
        <div className="flex-1 min-w-0 grid grid-cols-2 gap-2">
          <input
            value={sponsor.name}
            onChange={(e) => onChange({ ...sponsor, name: e.target.value })}
            placeholder="Sponsor name"
            className={inputCls}
          />
          <input
            value={sponsor.link}
            onChange={(e) => onChange({ ...sponsor, link: e.target.value })}
            placeholder="https://…"
            className={inputCls}
          />
        </div>
      ) : (
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900">{sponsor.name}</p>
          <p className="text-xs text-gray-400 truncate">{sponsor.link}</p>
        </div>
      )}
      {editing ? (
        <button
          onClick={onRemove}
          className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      ) : (
        <a
          href={sponsor.link}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:text-[#027027] transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      )}
    </div>
  );
}

// ─── Loading Skeleton ─────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-52 bg-gray-100 rounded-2xl" />
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-10 bg-gray-100 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: event, isLoading, isError } = useFetchEventsById(id!);
  const updateEventMutation = useCreateEvent();
  const [form, setForm] = useState<EventForm | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (event) {
      setForm({ ...event, imagePreview: undefined });
    }
  }, [event]);

  const isPast = useMemo(() => {
    if (!event) return false;
    const [hours, minutes] = (event.end_time || "23:59").split(":").map(Number);
    const eventEnd = new Date(event.event_date);
    eventEnd.setHours(hours, minutes, 0, 0);
    return eventEnd < new Date();
  }, [event]);

  function handleSave() {
    if (!form) return;
    const fd = new FormData();

    fd.append("id", form.id);
    fd.append("title", form.title);
    fd.append("badge", form.badge);
    fd.append("start_time", form.start_time);
    fd.append("end_time", form.end_time);
    fd.append("event_date", form.event_date);
    fd.append("venue", form.venue);
    fd.append("city", form.city);
    fd.append("address", form.address);
    fd.append("state", form.state);
    fd.append("zipcode", String(form.zipcode));
    fd.append("notes", form.notes ?? "");

    // ✅ Only append if there's a real new file
    if (form.imageFile) {
      fd.append("event_image", form.imageFile);
    }

    // ✅ Send existing image_path per speaker so backend can fall back to it
    fd.append(
      "featureSpeakers",
      JSON.stringify(
        form.featureSpeakers.map(
          ({ imagePreview, imageFile, ...rest }) => rest,
        ),
      ),
    );

    // ✅ Only append actual File objects, not path strings
    form.featureSpeakers.forEach((speaker, index) => {
      if (speaker.imageFile) {
        fd.append(`speaker_images_${index}`, speaker.imageFile);
      }
    });

    fd.append("sponsors", JSON.stringify(form.sponsors));

    updateEventMutation.mutate(fd, {
      onSuccess: () => {
        setEditMode(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      },
      onError: (error) => {
        console.error("Failed to save event:", error);
      },
    });
  }

  function handleCancel() {
    if (event) setForm({ ...event, imagePreview: undefined });
    setEditMode(false);
  }

  // Speaker helpers
  function updateSpeaker(index: number, updated: SpeakerForm) {
    if (!form) return;
    const next = [...form.featureSpeakers];
    next[index] = updated;
    setForm({ ...form, featureSpeakers: next });
  }

  function removeSpeaker(index: number) {
    if (!form) return;
    setForm({
      ...form,
      featureSpeakers: form.featureSpeakers.filter((_, i) => i !== index),
    });
  }

  function addSpeaker() {
    if (!form) return;
    const blank: SpeakerForm = {
      id: nanoid(),
      event_id: form.id,
      fullname: "",
      role: "",
      title: "",
      speciality: "",
      image_path: "",
      description: "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setForm({ ...form, featureSpeakers: [...form.featureSpeakers, blank] });
  }

  // Sponsor helpers
  function updateSponsor(index: number, updated: Sponsor) {
    if (!form) return;
    const next = [...form.sponsors];
    next[index] = updated;
    setForm({ ...form, sponsors: next });
  }

  function removeSponsor(index: number) {
    if (!form) return;
    setForm({ ...form, sponsors: form.sponsors.filter((_, i) => i !== index) });
  }

  function addSponsor() {
    if (!form) return;
    const blank: Sponsor = {
      id: nanoid(),
      event_id: form.id,
      name: "",
      link: "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setForm({ ...form, sponsors: [...form.sponsors, blank] });
  }

  // ── Guards ──
  if (isLoading || !form)
    return (
      <div className="max-w-4xl mx-auto pb-16">
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Events
          </button>
        </div>
        <Skeleton />
      </div>
    );

  if (isError)
    return (
      <div className="max-w-4xl mx-auto pb-16 flex flex-col items-center justify-center py-24 text-center">
        <p className="text-gray-700 font-semibold mb-1">Failed to load event</p>
        <p className="text-sm text-gray-400 mb-4">
          Please check your connection and try again.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="text-sm font-semibold text-[#027027] hover:underline"
        >
          Go back
        </button>
      </div>
    );

  const badge = getBadgeStyle(form.badge);
  const date = new Date(form.event_date);
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const imagePrefix = import.meta.env.VITE_IMAGE_PREFIX ?? "";
  const coverPreview =
    form.imagePreview ||
    (form.image_path ? `${imagePrefix}${form.image_path}` : "");

  return (
    <div className="mx-auto pb-16">
      {/* ── Top bar ── */}
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Events
        </button>

        <div className="flex items-center gap-2">
          {saved && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#027027] bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">
              <CheckCircle2 className="w-3.5 h-3.5" /> Saved
            </span>
          )}

          {isPast ? (
            <div className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 bg-gray-50 border border-gray-200 px-4 py-2 rounded-xl cursor-not-allowed select-none">
              <Lock className="w-3.5 h-3.5" /> Edit locked
            </div>
          ) : editMode ? (
            <div className="flex items-center gap-2">
              <button
                onClick={handleCancel}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 border border-gray-200 bg-white px-4 py-2 rounded-xl hover:border-gray-300 hover:text-gray-700 transition-all active:scale-[0.98]"
              >
                <X className="w-3.5 h-3.5" /> Cancel
              </button>
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-[#027027] px-4 py-2 rounded-xl hover:bg-[#025f22] transition-all active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#027027]/30"
              >
                <Save className="w-3.5 h-3.5" /> Save Changes
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-[#027027] px-4 py-2.5 rounded-xl hover:bg-[#025f22] transition-all active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#027027]/30"
            >
              <Pencil className="w-3.5 h-3.5" /> Edit Event
            </button>
          )}
        </div>
      </div>

      {/* ── Hero / Cover ── */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden mb-5 shadow-sm">
        {/* Cover image */}
        <div className="relative h-52 bg-gradient-to-br from-[#f0f3f6] to-[#ebf5ee] overflow-hidden">
          {coverPreview ? (
            <img
              src={coverPreview}
              alt={form.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <CalendarDays
                className="w-16 h-16 text-[#027027]/15"
                strokeWidth={1}
              />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent pointer-events-none" />

          {editMode && (
            <ImageUpload
              onUpload={(url, file) =>
                setForm({ ...form, imagePreview: url, imageFile: file })
              }
              className="absolute inset-0"
            >
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 bg-white/90 backdrop-blur-sm text-gray-900 text-sm font-semibold px-4 py-2 rounded-xl shadow-sm">
                  <Camera className="w-4 h-4" /> Change Cover Photo
                </div>
              </div>
            </ImageUpload>
          )}

          {/* Date badge */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl text-center min-w-[52px] shadow-sm pointer-events-none">
            <p className="text-xl font-bold text-gray-900 leading-none">
              {isNaN(day) ? "—" : day}
            </p>
            <p className="text-[9px] font-bold text-[#027027] tracking-widest mt-0.5">
              {month}
            </p>
          </div>

          <div
            className={`absolute top-4 right-4 text-[11px] font-semibold px-3 py-1.5 rounded-lg pointer-events-none ${isPast ? "bg-black/50 text-white" : "bg-[#027027]/80 text-white"}`}
          >
            {isPast ? "Past Event" : "Upcoming"}
          </div>

          {form.featureSpeakers.length > 0 && (
            <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg pointer-events-none">
              <Users className="w-3 h-3 text-gray-600" />
              <span className="text-[11px] font-semibold text-gray-700">
                {form.featureSpeakers.length} speaker
                {form.featureSpeakers.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}

          <div className="absolute bottom-4 left-4 right-28 pointer-events-none">
            <div
              className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full mb-2 ${badge.bg} ${badge.text}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
              {form.badge}
            </div>
            <h1 className="text-xl font-bold text-white leading-snug drop-shadow-sm">
              {form.title}
            </h1>
          </div>
        </div>

        {/* Meta strip */}
        <div className="px-6 py-4 flex flex-wrap items-center gap-5 border-b border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <CalendarDays className="w-4 h-4 text-gray-400 shrink-0" />
            <span>{formatFullDate(form.event_date)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4 text-gray-400 shrink-0" />
            <span>
              {convertTo12Hours(form.start_time)} –{" "}
              {convertTo12Hours(form.end_time)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
            <span>
              {form.venue}, {form.city}
            </span>
          </div>
        </div>

        {/* Banners */}
        {editMode && (
          <div className="mx-6 mt-4 flex items-center gap-2.5 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
            <Pencil className="w-3.5 h-3.5 text-[#027027] shrink-0" />
            <p className="text-xs font-medium text-[#027027]">
              Edit mode active — all fields, speakers, sponsors, and images are
              editable. Click <strong>Save Changes</strong> when done.
            </p>
          </div>
        )}
        {isPast && (
          <div className="mx-6 mt-4 flex items-center gap-2.5 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
            <Lock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <p className="text-xs font-medium text-gray-500">
              This event has already taken place. Past events cannot be edited.
            </p>
          </div>
        )}

        {/* ── Event Fields ── */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field
            label="Event Title"
            value={form.title}
            editing={editMode}
            onChange={(v) => setForm({ ...form, title: v })}
            icon={<CalendarDays className="w-3 h-3" />}
          />

          {/* Badge */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase flex items-center gap-1.5">
              <Tag className="w-3 h-3 text-gray-400" /> Badge
            </label>
            {editMode ? (
              <select
                value={form.badge}
                onChange={(e) => setForm({ ...form, badge: e.target.value })}
                className={inputCls}
              >
                {BADGE_OPTIONS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            ) : (
              <div
                className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1.5 rounded-full border ${badge.bg} ${badge.text} ${badge.border}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                {form.badge}
              </div>
            )}
          </div>

          {/* Date */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase flex items-center gap-1.5">
              <CalendarDays className="w-3 h-3 text-gray-400" /> Event Date
            </label>
            {editMode ? (
              <input
                type="date"
                value={form.event_date?.slice(0, 10)}
                onChange={(e) =>
                  setForm({ ...form, event_date: e.target.value })
                }
                className={inputCls}
              />
            ) : (
              <p className="text-sm text-gray-700">
                {formatFullDate(form.event_date)}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Start Time"
              value={form.start_time}
              editing={editMode}
              onChange={(v) => setForm({ ...form, start_time: v })}
              icon={<Clock className="w-3 h-3" />}
              type="time"
            />
            <Field
              label="End Time"
              value={form.end_time}
              editing={editMode}
              onChange={(v) => setForm({ ...form, end_time: v })}
              icon={<Clock className="w-3 h-3" />}
              type="time"
            />
          </div>

          <Field
            label="Venue"
            value={form.venue}
            editing={editMode}
            onChange={(v) => setForm({ ...form, venue: v })}
            icon={<Building2 className="w-3 h-3" />}
          />
          <Field
            label="Address"
            value={form.address}
            editing={editMode}
            onChange={(v) => setForm({ ...form, address: v })}
            icon={<MapPin className="w-3 h-3" />}
          />
          <Field
            label="City"
            value={form.city}
            editing={editMode}
            onChange={(v) => setForm({ ...form, city: v })}
            icon={<MapPin className="w-3 h-3" />}
          />
          <Field
            label="State / Province"
            value={form.state}
            editing={editMode}
            onChange={(v) => setForm({ ...form, state: v })}
            icon={<Hash className="w-3 h-3" />}
          />

          {/* Zipcode */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase flex items-center gap-1.5">
              <Hash className="w-3 h-3 text-gray-400" /> Zipcode
            </label>
            {editMode ? (
              <input
                type="number"
                value={form.zipcode}
                onChange={(e) =>
                  setForm({ ...form, zipcode: Number(e.target.value) })
                }
                className={inputCls}
              />
            ) : (
              <p className="text-sm text-gray-700">{form.zipcode}</p>
            )}
          </div>

          <div className="sm:col-span-2">
            <Field
              label="Notes"
              value={form.notes ?? ""}
              editing={editMode}
              onChange={(v) => setForm({ ...form, notes: v })}
              icon={<FileText className="w-3 h-3" />}
              multiline
            />
          </div>
        </div>
      </div>

      {/* ── Speakers ── */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-[#027027]" />
            Featured Speakers
            <span className="text-xs font-semibold text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">
              {form.featureSpeakers.length}
            </span>
          </h2>
          {editMode && (
            <button
              onClick={addSpeaker}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#027027] bg-green-50 border border-green-100 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Speaker
            </button>
          )}
        </div>
        <div className="space-y-4">
          {form.featureSpeakers.length === 0 ? (
            <p className="text-center py-8 text-sm text-gray-400">
              No speakers yet.{editMode && " Click 'Add Speaker' to add one."}
            </p>
          ) : (
            form.featureSpeakers.map((sp, i) => (
              <SpeakerCard
                key={sp.id}
                speaker={sp}
                index={i}
                editing={editMode}
                imagePrefix={imagePrefix}
                onChange={(updated) => updateSpeaker(i, updated)}
                onRemove={() => removeSpeaker(i)}
              />
            ))
          )}
        </div>
      </div>

      {/* ── Sponsors ── */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <Star className="w-4 h-4 text-[#027027]" />
            Sponsors
            <span className="text-xs font-semibold text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">
              {form.sponsors.length}
            </span>
          </h2>
          {editMode && (
            <button
              onClick={addSponsor}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#027027] bg-green-50 border border-green-100 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Sponsor
            </button>
          )}
        </div>
        <div className="space-y-2.5">
          {form.sponsors.length === 0 ? (
            <p className="text-center py-6 text-sm text-gray-400">
              No sponsors yet.{editMode && " Click 'Add Sponsor' to add one."}
            </p>
          ) : (
            form.sponsors.map((s, i) => (
              <SponsorRow
                key={s.id}
                sponsor={s}
                index={i}
                editing={editMode}
                onChange={(updated) => updateSponsor(i, updated)}
                onRemove={() => removeSponsor(i)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
