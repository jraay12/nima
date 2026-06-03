import React, { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import {
  User,
  Mail,
  Phone,
  Globe,
  MapPin,
  Building2,
  FileText,
  AlertCircle,
  ChevronDown,
  Crown,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  Quote,
  Minus,
  Undo,
  Redo,
  Type,
} from "lucide-react";
import { useCreateMember } from "../../features/members/member.hook";

// ─── Types ────────────────────────────────────────────────────────────────────

type MemberFormValues = {
  full_name: string;
  practice_name: string;
  practice_email: string;
  practice_contact_number: string;
  fax_number: string;
  website: string;
  city: string;
  state: string;
  country: string;
  is_boardMember: boolean;
  board_title: string;
  member: File | null;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const BOARD_TITLES = [
  "Chairman of the Board",
  "Vice Chairman",
  "President",
  "Vice President",
  "Secretary",
  "Treasurer",
  "Board Member",
  "Executive Director",
  "Advisory Member",
];

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

// ─── Rich Text Toolbar Button ─────────────────────────────────────────────────

function ToolbarBtn({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`p-1.5 rounded-lg transition-all duration-150 text-gray-600 hover:bg-gray-100 hover:text-gray-900
        ${active ? "bg-[#ebf5ee] text-[#027027]" : ""}`}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <div className="w-px h-5 bg-gray-200 mx-0.5" />;
}

// ─── Rich Text Editor ─────────────────────────────────────────────────────────

function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());

  const exec = useCallback((command: string, val?: string) => {
    document.execCommand(command, false, val);
    editorRef.current?.focus();
    updateActiveFormats();
  }, []);

  const updateActiveFormats = () => {
    const formats = new Set<string>();
    if (document.queryCommandState("bold")) formats.add("bold");
    if (document.queryCommandState("italic")) formats.add("italic");
    if (document.queryCommandState("underline")) formats.add("underline");
    if (document.queryCommandState("insertUnorderedList")) formats.add("ul");
    if (document.queryCommandState("insertOrderedList")) formats.add("ol");
    setActiveFormats(formats);
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
    updateActiveFormats();
  };

  const insertHeading = (level: number) => {
    document.execCommand("formatBlock", false, `h${level}`);
    editorRef.current?.focus();
  };

  const insertParagraph = () => {
    document.execCommand("formatBlock", false, "p");
    editorRef.current?.focus();
  };

  const insertBlockquote = () => {
    document.execCommand("formatBlock", false, "blockquote");
    editorRef.current?.focus();
  };

  const insertDivider = () => {
    document.execCommand(
      "insertHTML",
      false,
      '<hr style="border:none;border-top:1px solid #e5e7eb;margin:12px 0"/>',
    );
    editorRef.current?.focus();
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:border-[#027027] focus-within:ring-2 focus-within:ring-[#027027]/10 transition-all duration-200">
      {/* Toolbar */}
      <div className="flex items-center flex-wrap gap-0.5 px-2 py-2 bg-gray-50 border-b border-gray-200">
        {/* Text style */}
        <ToolbarBtn title="Paragraph" onClick={insertParagraph}>
          <Type className="w-3.5 h-3.5" />
        </ToolbarBtn>
        <ToolbarBtn title="Heading 1" onClick={() => insertHeading(1)}>
          <Heading1 className="w-3.5 h-3.5" />
        </ToolbarBtn>
        <ToolbarBtn title="Heading 2" onClick={() => insertHeading(2)}>
          <Heading2 className="w-3.5 h-3.5" />
        </ToolbarBtn>

        <ToolbarDivider />

        {/* Formatting */}
        <ToolbarBtn
          title="Bold"
          active={activeFormats.has("bold")}
          onClick={() => exec("bold")}
        >
          <Bold className="w-3.5 h-3.5" />
        </ToolbarBtn>
        <ToolbarBtn
          title="Italic"
          active={activeFormats.has("italic")}
          onClick={() => exec("italic")}
        >
          <Italic className="w-3.5 h-3.5" />
        </ToolbarBtn>
        <ToolbarBtn
          title="Underline"
          active={activeFormats.has("underline")}
          onClick={() => exec("underline")}
        >
          <Underline className="w-3.5 h-3.5" />
        </ToolbarBtn>

        <ToolbarDivider />

        {/* Lists */}
        <ToolbarBtn
          title="Bullet List"
          active={activeFormats.has("ul")}
          onClick={() => exec("insertUnorderedList")}
        >
          <List className="w-3.5 h-3.5" />
        </ToolbarBtn>
        <ToolbarBtn
          title="Numbered List"
          active={activeFormats.has("ol")}
          onClick={() => exec("insertOrderedList")}
        >
          <ListOrdered className="w-3.5 h-3.5" />
        </ToolbarBtn>

        <ToolbarDivider />

        {/* Alignment */}
        <ToolbarBtn title="Align Left" onClick={() => exec("justifyLeft")}>
          <AlignLeft className="w-3.5 h-3.5" />
        </ToolbarBtn>
        <ToolbarBtn title="Align Center" onClick={() => exec("justifyCenter")}>
          <AlignCenter className="w-3.5 h-3.5" />
        </ToolbarBtn>
        <ToolbarBtn title="Align Right" onClick={() => exec("justifyRight")}>
          <AlignRight className="w-3.5 h-3.5" />
        </ToolbarBtn>

        <ToolbarDivider />

        {/* Block elements */}
        <ToolbarBtn title="Blockquote" onClick={insertBlockquote}>
          <Quote className="w-3.5 h-3.5" />
        </ToolbarBtn>
        <ToolbarBtn title="Horizontal Rule" onClick={insertDivider}>
          <Minus className="w-3.5 h-3.5" />
        </ToolbarBtn>

        <ToolbarDivider />

        {/* History */}
        <ToolbarBtn title="Undo" onClick={() => exec("undo")}>
          <Undo className="w-3.5 h-3.5" />
        </ToolbarBtn>
        <ToolbarBtn title="Redo" onClick={() => exec("redo")}>
          <Redo className="w-3.5 h-3.5" />
        </ToolbarBtn>
      </div>

      {/* Editable area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onKeyUp={updateActiveFormats}
        onMouseUp={updateActiveFormats}
        data-placeholder="Write a biography... You can use bullet points, headings, and more."
        className="
          min-h-[200px] px-4 py-3 text-sm text-gray-900 bg-white outline-none
          [&_h1]:text-xl [&_h1]:font-bold [&_h1]:text-gray-900 [&_h1]:mb-2 [&_h1]:mt-3
          [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:mb-2 [&_h2]:mt-3
          [&_p]:mb-2 [&_p]:leading-relaxed
          [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-2 [&_ul]:space-y-1
          [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-2 [&_ol]:space-y-1
          [&_li]:leading-relaxed
          [&_blockquote]:border-l-4 [&_blockquote]:border-[#027027] [&_blockquote]:pl-4
          [&_blockquote]:text-gray-600 [&_blockquote]:italic [&_blockquote]:my-3
          empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 empty:before:pointer-events-none
        "
      />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const CreateMemberPage = () => {
  const navigate = useNavigate();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [biography, setBiography] = useState("");
  const [isBoardMember, setIsBoardMember] = useState(false);
  const createMemberMutation = useCreateMember();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MemberFormValues>({
    defaultValues: {
      full_name: "",
      practice_name: "",
      practice_email: "",
      practice_contact_number: "",
      fax_number: "",
      website: "",
      city: "",
      state: "",
      country: "",
      is_boardMember: false,
      board_title: "",
      member: null,
    },
  });

  const onSubmit = async (data: MemberFormValues) => {
    const formData = new FormData();

    formData.append("full_name", data.full_name);
    formData.append("practice_name", data.practice_name);
    formData.append("practice_email", data.practice_email);
    formData.append("practice_contact_number", data.practice_contact_number);
    formData.append("fax_number", data.fax_number);
    formData.append("website", data.website);
    formData.append("city", data.city);
    formData.append("state", data.state);
    formData.append("country", data.country);
    formData.append("biography", biography);
    formData.append("is_boardMember", String(isBoardMember));
    formData.append("board_title", data.board_title);

    if (data.member) {
      formData.append("member", data.member);
    }

    createMemberMutation.mutate(formData, {
      onSuccess: () => {
        reset();
        setPhotoPreview(null);
        setBiography("");
        setIsBoardMember(false);
        navigate(-1);
      },
    });
    // On success:
  };

  return (
    <div className="mx-auto pb-20">
      <div className="mt-4 mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Create Member
          </h1>
          <p className="text-sm text-gray-500">
            Fill in the details below to add a new NIMANV member.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6">
          {/* ── Section 1: Profile Photo & Basic Info ── */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <SectionHeader
              icon={User}
              title="Personal Information"
              subtitle="Member's name and profile photo"
            />

            <div className="space-y-5">
              {/* Photo Upload */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Profile Photo
                </label>

                <div className="flex items-center gap-5">
                  <label
                    htmlFor="member-photo"
                    className="relative flex flex-col items-center justify-center w-24 h-24 rounded-full border-2 border-dashed border-gray-300 cursor-pointer overflow-hidden hover:border-[#027027] transition group shrink-0"
                  >
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-8 h-8 text-gray-300" />
                    )}
                    <div
                      className={`absolute inset-0 flex items-center justify-center rounded-full transition
                        ${photoPreview ? "bg-black/30 group-hover:bg-black/50" : "bg-transparent group-hover:bg-black/5"}`}
                    >
                      {photoPreview && (
                        <p className="text-white text-[10px] font-semibold opacity-0 group-hover:opacity-100 transition">
                          Change
                        </p>
                      )}
                    </div>
                    <input
                      id="member-photo"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setValue("member", file, { shouldValidate: true });
                        setPhotoPreview(URL.createObjectURL(file));
                      }}
                    />
                  </label>

                  <div className="text-xs text-gray-500 space-y-1">
                    <p className="font-medium text-gray-700">
                      Upload a profile photo
                    </p>
                    <p>PNG, JPG, WEBP accepted</p>
                    <p>Recommended: square image, min 200×200px</p>
                  </div>
                </div>
              </div>

              {/* Full Name */}
              <InputField label="Full Name" error={errors.full_name?.message}>
                <input
                  {...register("full_name")}
                  placeholder="Dr. John Doe"
                  className={inputCls}
                />
              </InputField>

              {/* Practice Name */}
              <InputField
                label="Practice Name"
                error={errors.practice_name?.message}
              >
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    {...register("practice_name")}
                    placeholder="e.g. Interventional Radiology and Red Rock Radiology Associates"
                    className={inputCls + " pl-10"}
                  />
                </div>
              </InputField>
            </div>
          </div>

          {/* ── Section 2: Contact Information ── */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <SectionHeader
              icon={Mail}
              title="Contact Information"
              subtitle="Practice email, phone, fax, and website"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField
                label="Practice Email"
                error={errors.practice_email?.message}
              >
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    {...register("practice_email")}
                    type="email"
                    placeholder="referral@email.com"
                    className={inputCls + " pl-10"}
                  />
                </div>
              </InputField>

              <InputField
                label="Contact Number"
                error={errors.practice_contact_number?.message}
              >
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    {...register("practice_contact_number")}
                    placeholder="+1 234 567 8901"
                    className={inputCls + " pl-10"}
                  />
                </div>
              </InputField>

              <InputField label="Fax Number" error={errors.fax_number?.message}>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    {...register("fax_number")}
                    placeholder="123-456-789"
                    className={inputCls + " pl-10"}
                  />
                </div>
              </InputField>

              <InputField label="Website" error={errors.website?.message}>
                <div className="relative">
                  <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    {...register("website")}
                    placeholder="https://example.com"
                    className={inputCls + " pl-10"}
                  />
                </div>
              </InputField>
            </div>
          </div>

          {/* ── Section 3: Location ── */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <SectionHeader
              icon={MapPin}
              title="Location"
              subtitle="City, state, and country"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputField label="City" error={errors.city?.message}>
                <input
                  {...register("city")}
                  placeholder="Cagayan de Oro"
                  className={inputCls}
                />
              </InputField>

              <InputField
                label="State / Province"
                error={errors.state?.message}
              >
                <input
                  {...register("state")}
                  placeholder="Misamis Oriental"
                  className={inputCls}
                />
              </InputField>

              <InputField label="Country" error={errors.country?.message}>
                <input
                  {...register("country")}
                  placeholder="Philippines"
                  className={inputCls}
                />
              </InputField>
            </div>
          </div>

          {/* ── Section 4: Biography ── */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <SectionHeader
              icon={FileText}
              title="Biography"
              subtitle="A rich-text biography for this member — supports headings, bullet points, and more"
            />

            <RichTextEditor value={biography} onChange={setBiography} />
          </div>

          {/* ── Section 5: Board Membership ── */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <SectionHeader
              icon={Crown}
              title="Board Membership"
              subtitle="Designate this member as a board member and assign a title"
            />

            <div className="space-y-5">
              {/* Toggle */}
              <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Board Member
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Mark this member as part of the board
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsBoardMember((v) => !v);
                    setValue("is_boardMember", !isBoardMember);
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#027027]/30
                    ${isBoardMember ? "bg-[#027027]" : "bg-gray-200"}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200
                      ${isBoardMember ? "translate-x-6" : "translate-x-1"}`}
                  />
                </button>
              </div>

              {/* Board Title — only shown when toggled on */}
              {isBoardMember && (
                <InputField
                  label="Board Title"
                  error={errors.board_title?.message}
                >
                  <div className="relative">
                    <select {...register("board_title")} className={selectCls}>
                      <option value="">Select a title…</option>
                      {BOARD_TITLES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </InputField>
              )}
            </div>
          </div>

          {/* ── Action bar ── */}
          <div className="bg-white border border-gray-100 rounded-2xl px-6 py-4 flex items-center justify-between gap-4 flex-wrap shadow-[0_4px_24px_rgba(0,0,0,0.07)]">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
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
                <User className="w-4 h-4" />
              )}
              Save Member
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateMemberPage;
