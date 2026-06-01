import { useState } from "react";
import { useNavigate } from "react-router";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Breadcrumb from "../../component/BreadCrumb";
import {
  CalendarDays,
  Clock,
  MapPin,
  Image as ImageIcon,
  Plus,
  Trash2,
  User,
  ChevronDown,
  Save,
  Globe,
  AlertCircle,
  CheckCircle2,
  FileText,
  Tag,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Speaker = {
  name: string;
  title: string;
  role: string;
  specialty: string;
  description: string;
  image: string;
};

type EventFormValues = {
  title: string;
  badge: string;
  day: string;
  month: string;
  year: string;
  start_time: string;
  end_time: string;
  timeNote: string;
  venue: string;
  address: string;
  city: string;
  image: File | null;
  event_notes: string;
  featuredSpeaker: Speaker[];
};

// ─── Constants ────────────────────────────────────────────────────────────────

const BADGE_OPTIONS = [
  "SIGNATURE EVENT",
  "SPECIAL EVENT",
  "CME",
  "NETWORKING",
  "WORKSHOP",
  "SEMINAR",
  "FUNDRAISER",
  "OTHER",
];

const MONTHS = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

const SPEAKER_ROLES = [
  "Keynote Speaker",
  "Panel Speaker",
  "Guest Speaker",
  "Moderator",
  "Presenter",
];

const EMPTY_SPEAKER: Speaker = {
  name: "",
  title: "",
  role: "",
  specialty: "",
  description: "",
  image: "",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="flex items-center gap-1.5 text-xs text-red-500 mt-1.5">
      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
      {message}
    </p>
  );
}

function SectionHeader({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-start gap-3 mb-5">
      <div className="w-8 h-8 rounded-lg bg-[#ebf5ee] flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-[#027027]" />
      </div>
      <div>
        <h2 className="text-sm font-bold text-gray-900">{title}</h2>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

function InputField({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      <FieldError message={error} />
    </div>
  );
}

const inputCls =
  "w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 " +
  "outline-none transition-all duration-200 focus:border-[#027027] focus:ring-2 focus:ring-[#027027]/10 hover:border-gray-300";

const selectCls = inputCls + " appearance-none cursor-pointer pr-8";

// ─── Main Component ───────────────────────────────────────────────────────────

const CreateEventPage = () => {
  const navigate = useNavigate();
  const [submitType, setSubmitType] = useState<"draft" | "publish" | null>(
    null,
  );
  const [eventDate, setEventDate] = useState<Date | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EventFormValues>({
    defaultValues: {
      title: "",
      badge: "",
      day: "",
      month: "",
      year: new Date().getFullYear().toString(),
      start_time: "",
      end_time: "",
      timeNote: "",
      venue: "",
      address: "",
      city: "",
      image: null,
      event_notes: "",
      featuredSpeaker: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "featuredSpeaker",
  });

  const imageFile = watch("image");

  const onSubmit = async (data: EventFormValues) => {
    const id = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const formData = new FormData();

    formData.append("id", id);
    formData.append("title", data.title);
    formData.append("badge", data.badge);
    formData.append("day", String(Number(data.day)));
    formData.append("month", data.month);
    formData.append("year", data.year);
    formData.append("start_time", data.start_time);
    formData.append("end_time", data.end_time);
    formData.append("timeNote", data.timeNote);
    formData.append("venue", data.venue);
    formData.append("address", data.address);
    formData.append("city", data.city);
    formData.append("event_notes", data.event_notes);
    formData.append("status", submitType === "publish" ? "published" : "draft");

    if (data.image) {
      formData.append("image", data.image);
    }

    formData.append("featuredSpeaker", JSON.stringify(data.featuredSpeaker));
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center">
          <CheckCircle2 className="w-7 h-7 text-[#027027]" />
        </div>
        <p className="text-gray-900 font-bold text-lg">
          Event {submitType === "publish" ? "published" : "saved as draft"}!
        </p>
        <p className="text-sm text-gray-400">Redirecting to events…</p>
      </div>
    );
  }

  return (
    <div className=" mx-auto  pb-20">
      <Breadcrumb />

      <div className="mt-4 mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Create Event
          </h1>
          <p className="text-sm text-gray-500">
            Fill in the details below to create a new NIMANV event.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="space-y-6">
          {/* ── Section 1: Basic Info ── */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <SectionHeader
              icon={FileText}
              title="Basic Information"
              subtitle="Event title, category, and cover image"
            />

            <div className="space-y-5">
              {/* Title */}
              <InputField
                label="Event Title"
                required
                error={errors.title?.message}
              >
                <input
                  {...register("title", {
                    required: "Event title is required",
                    minLength: {
                      value: 5,
                      message: "Title must be at least 5 characters",
                    },
                  })}
                  placeholder="e.g. NIMA Healthcare Leadership Summit 2026"
                  className={inputCls}
                />
              </InputField>

              {/* Badge */}
              <InputField
                label="Event Category / Badge"
                required
                error={errors.badge?.message}
              >
                <div className="relative">
                  <select
                    {...register("badge", {
                      required: "Please select a category",
                    })}
                    className={selectCls}
                  >
                    <option value="">Select a category…</option>
                    {BADGE_OPTIONS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </InputField>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Cover Image
                </label>

                <label
                  htmlFor="image"
                  className="relative flex flex-col items-center justify-center w-full h-52 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer overflow-hidden hover:border-[#014d1a] transition group"
                >
                  {/* Preview Background */}
                  {preview ? (
                    <img
                      src={preview}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : null}

                  {/* Dark overlay when image exists */}
                  {preview && (
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" />
                  )}

                  {/* Upload Content */}
                  <div className="relative z-10 text-center">
                    <p
                      className={`text-sm font-medium ${preview ? "text-white" : "text-gray-700"}`}
                    >
                      {preview
                        ? "Change Cover Image"
                        : "Click to upload cover image"}
                    </p>

                    <p
                      className={`text-xs mt-1 ${preview ? "text-white/80" : "text-gray-500"}`}
                    >
                      PNG, JPG, WEBP (max 5MB)
                    </p>
                  </div>

                  <input
                    id="image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    {...register("image", {
                      required: "Cover image is required",
                      onChange: (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setPreview(URL.createObjectURL(file));
                      },
                    })}
                  />
                </label>

                {errors.image && (
                  <p className="text-sm text-red-500 mt-2">
                    {errors.image.message as string}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ── Section 2: Date & Time ── */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <SectionHeader
              icon={CalendarDays}
              title="Date & Time"
              subtitle="When will the event take place?"
            />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* DATE PICKER (WIDER) */}
              <div className="md:col-span-2">
                <InputField label="Event Date" required>
                  <DatePicker
                    selected={eventDate}
                    onChange={(date: any) => setEventDate(date)}
                    dateFormat="MMMM d, yyyy"
                    placeholderText="Select event date"
                    className={inputCls + " w-full"}
                  />
                </InputField>
              </div>

              {/* START TIME */}
              <div className="md:col-span-1">
                <InputField
                  label="Start Time"
                  required
                  error={errors.start_time?.message}
                >
                  <div className="relative">
                    <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="time"
                      {...register("start_time", {
                        required: "Start time is required",
                      })}
                      className={inputCls + " pl-10 w-full"}
                    />
                  </div>
                </InputField>
              </div>

              {/* END TIME */}
              <div className="md:col-span-1">
                <InputField
                  label="End Time"
                  required
                  error={errors.end_time?.message}
                >
                  <div className="relative">
                    <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="time"
                      {...register("end_time", {
                        required: "End time is required",
                      })}
                      className={inputCls + " pl-10 w-full"}
                    />
                  </div>
                </InputField>
              </div>
            </div>
          </div>

          {/* ── Section 3: Venue ── */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <SectionHeader
              icon={MapPin}
              title="Venue"
              subtitle="Where will the event be held?"
            />

            <div className="space-y-5">
              <InputField
                label="Venue Name"
                required
                error={errors.venue?.message}
              >
                <input
                  {...register("venue", { required: "Venue name is required" })}
                  placeholder="e.g. Green Valley Ranch Resort"
                  className={inputCls}
                />
              </InputField>

              <InputField
                label="Street Address"
                required
                error={errors.address?.message}
              >
                <input
                  {...register("address", { required: "Address is required" })}
                  placeholder="e.g. 2300 Paseo Verde Pkwy"
                  className={inputCls}
                />
              </InputField>

              <InputField
                label="City, State, ZIP"
                required
                error={errors.city?.message}
              >
                <input
                  {...register("city", { required: "City is required" })}
                  placeholder="e.g. Henderson, NV 89052"
                  className={inputCls}
                />
              </InputField>
            </div>
          </div>

          {/* ── Section 4: Notes ── */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <SectionHeader
              icon={Tag}
              title="Event Notes"
              subtitle="Additional info for attendees (optional)"
            />

            <InputField label="Notes" error={errors.event_notes?.message}>
              <textarea
                {...register("event_notes", {
                  maxLength: {
                    value: 600,
                    message: "Max 600 characters",
                  },
                })}
                rows={3}
                placeholder="e.g. Business attire is recommended. Complimentary dinner provided…"
                className={inputCls + " resize-none"}
              />
            </InputField>
          </div>

          {/* ── Section 5: Featured Speakers ── */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <SectionHeader
              icon={User}
              title="Featured Speakers"
              subtitle="Add keynote, panel, or guest speakers"
            />

            <div className="space-y-4">
              {fields.map((field: any, index: any) => (
                <div
                  key={field.id}
                  className="border border-gray-100 rounded-xl p-4 bg-[#fafafa] relative"
                >
                  {/* Speaker header */}
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">
                      Speaker {index + 1}
                    </p>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 transition-colors font-medium"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <InputField
                      label="Full Name"
                      required
                      error={errors.featuredSpeaker?.[index]?.name?.message}
                    >
                      <input
                        {...register(`featuredSpeaker.${index}.name`, {
                          required: "Speaker name is required",
                        })}
                        placeholder="Dr. Jennifer Lee"
                        className={inputCls}
                      />
                    </InputField>

                    {/* Role */}
                    <InputField
                      label="Role"
                      required
                      error={errors.featuredSpeaker?.[index]?.role?.message}
                    >
                      <div className="relative">
                        <select
                          {...register(`featuredSpeaker.${index}.role`, {
                            required: "Role is required",
                          })}
                          className={selectCls}
                        >
                          <option value="">Select role…</option>
                          {SPEAKER_ROLES.map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </InputField>

                    {/* Title */}
                    <InputField
                      label="Title / Position"
                      error={errors.featuredSpeaker?.[index]?.title?.message}
                    >
                      <input
                        {...register(`featuredSpeaker.${index}.title`)}
                        placeholder="Chief Medical Officer"
                        className={inputCls}
                      />
                    </InputField>

                    {/* Specialty */}
                    <InputField
                      label="Specialty"
                      error={
                        errors.featuredSpeaker?.[index]?.specialty?.message
                      }
                    >
                      <input
                        {...register(`featuredSpeaker.${index}.specialty`)}
                        placeholder="Healthcare Leadership"
                        className={inputCls}
                      />
                    </InputField>

                    {/* Image URL */}
                    <InputField
                      label="Photo URL"
                      error={errors.featuredSpeaker?.[index]?.image?.message}
                    >
                      <input
                        {...register(`featuredSpeaker.${index}.image`, {
                          pattern: {
                            value: /^(https?:\/\/).+/,
                            message: "Must be a valid URL",
                          },
                        })}
                        placeholder="https://…"
                        className={inputCls}
                      />
                    </InputField>

                    {/* Description – full width */}
                    <div className="sm:col-span-2">
                      <InputField
                        label="Description"
                        error={
                          errors.featuredSpeaker?.[index]?.description?.message
                        }
                      >
                        <textarea
                          {...register(`featuredSpeaker.${index}.description`)}
                          rows={2}
                          placeholder="Brief bio or session description…"
                          className={inputCls + " resize-none"}
                        />
                      </InputField>
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => append(EMPTY_SPEAKER)}
                className="w-full flex items-center justify-center gap-2 border border-dashed border-gray-300 text-gray-500
                  text-sm font-medium py-3 rounded-xl hover:border-[#027027] hover:text-[#027027]
                  transition-all duration-200 hover:bg-green-50/50"
              >
                <Plus className="w-4 h-4" />
                Add Speaker
              </button>
            </div>
          </div>

          {/* ── Action bar ── */}
          <div className="bg-white border border-gray-100 rounded-2xl px-6 py-4 flex items-center justify-between gap-4 flex-wrap sticky bottom-16 shadow-[0_4px_24px_rgba(0,0,0,0.07)]">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors"
            >
              Cancel
            </button>

            <div className="flex items-center gap-3">
              {/* Save as Draft */}
              <button
                type="submit"
                disabled={isSubmitting}
                onClick={() => setSubmitType("draft")}
                className="inline-flex items-center gap-2 border border-gray-200 bg-white text-gray-700
                  text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-200
                  hover:border-gray-300 hover:bg-gray-50 active:scale-[0.98] disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                Save as Draft
              </button>

              {/* Publish */}
              <button
                type="submit"
                disabled={isSubmitting}
                onClick={() => setSubmitType("publish")}
                className="inline-flex items-center gap-2 bg-[#027027] text-white
                  text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-200
                  hover:bg-[#025f22] active:scale-[0.98] disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#027027]/30"
              >
                {isSubmitting ? (
                  <svg
                    className="animate-spin w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                    />
                  </svg>
                ) : (
                  <Globe className="w-4 h-4" />
                )}
                Publish Event
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateEventPage;
