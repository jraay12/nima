import React, { useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  ArrowLeft,
  Mail,
  Phone,
  Globe,
  MapPin,
  Crown,
  Printer,
  ExternalLink,
  Building2,
} from "lucide-react";
import { useFetchMembersById } from "../features/members/member.hook";

// ─── Types (re-use from MemberList or import from shared types file) ──────────

type Member = {
  id: string;
  full_name: string;
  practice_name: string;
  is_boardMember: boolean;
  board_title: string | null;
  practice_email: string;
  practice_referral_email: string | null;
  practice_contact_number: string;
  fax_number: string;
  website: string;
  biography: string | string[] | object;
  image_path: string | null;
  city: string;
  state: string;
  country: string;
  created_at: string;
  updated_at: string;
};

// ─── Biography helpers (same as MemberList) ──────────────────────────────────

type TiptapDoc = { type: string; content?: TiptapNode[] };
type TiptapNode = {
  type: string;
  text?: string;
  content?: TiptapNode[];
  marks?: { type: string }[];
};

function tiptapToHtml(node: TiptapDoc | TiptapNode): string {
  if (!node) return "";
  if ("text" in node && node.text) {
    let t = node.text;
    const marks = (node as TiptapNode).marks || [];
    if (marks.find((m) => m.type === "bold")) t = `<strong>${t}</strong>`;
    if (marks.find((m) => m.type === "italic")) t = `<em>${t}</em>`;
    if (marks.find((m) => m.type === "underline")) t = `<u>${t}</u>`;
    return t;
  }
  const children = (node.content || []).map(tiptapToHtml).join("");
  switch (node.type) {
    case "doc":
      return children;
    case "paragraph":
      return `<p>${children}</p>`;
    case "heading":
      return `<h3>${children}</h3>`;
    case "bulletList":
      return `<ul>${children}</ul>`;
    case "orderedList":
      return `<ol>${children}</ol>`;
    case "listItem":
      return `<li>${children}</li>`;
    case "blockquote":
      return `<blockquote>${children}</blockquote>`;
    default:
      return children;
  }
}

function resolveBiography(bio: Member["biography"]): string {
  if (!bio) return "";
  if (typeof bio === "string") return bio;
  if (Array.isArray(bio)) return bio.join("");
  if (typeof bio === "object" && "content" in bio)
    return tiptapToHtml(bio as TiptapDoc);
  return "";
}

function resolveImageUrl(path: string | null, base?: string): string | null {
  if (!path) return null;

  const clean = path.replace(/\\/g, "/");

  if (clean.startsWith("http")) return clean;

  const normalizedBase = base?.replace(/\/$/, "");
  const normalizedPath = clean.replace(/^\/+/, ""); // 🔥 FIX HERE

  return normalizedBase
    ? `${normalizedBase}/${normalizedPath}`
    : `/${normalizedPath}`;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

function Avatar({
  member,
  imageBaseUrl,
}: {
  member: Member;
  imageBaseUrl?: string;
}) {
  const [err, setErr] = useState(false);
  const src = resolveImageUrl(member.image_path, imageBaseUrl);

  if (src && !err) {
    return (
      <img
        src={src}
        alt={member.full_name}
        onError={() => setErr(true)}
        className="w-full h-full object-cover"
      />
    );
  }
  return (
    <div className="w-full h-full flex items-center justify-center bg-[#ebf5ee]">
      <span className="text-5xl font-bold text-[#027027] select-none">
        {getInitials(member.full_name)}
      </span>
    </div>
  );
}

// ─── Contact Pill ─────────────────────────────────────────────────────────────

function ContactPill({
  icon: Icon,
  label,
  href,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-100 rounded-2xl hover:border-[#027027]/30 hover:shadow-sm transition-all duration-200 group/pill">
      <div className="w-8 h-8 rounded-xl bg-[#ebf5ee] flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-[#027027]" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
          {label}
        </p>
        <p className="text-sm font-medium text-gray-800 truncate group-hover/pill:text-[#027027] transition-colors">
          {value}
        </p>
      </div>
      {href && (
        <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover/pill:text-[#027027] ml-auto shrink-0 transition-colors" />
      )}
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel="noopener noreferrer"
      >
        {content}
      </a>
    );
  }
  return content;
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="animate-pulse">
      {/* Hero */}
      <div className="h-64 bg-gray-200 rounded-3xl mb-8" />
      <div className="max-w-4xl mx-auto space-y-4 px-4">
        <div className="h-8 bg-gray-200 rounded-xl w-64" />
        <div className="h-4 bg-gray-100 rounded-xl w-48" />
        <div className="grid grid-cols-2 gap-3 mt-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-2xl" />
          ))}
        </div>
        <div className="h-48 bg-gray-100 rounded-2xl mt-6" />
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const MemberDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: member, isLoading } = useFetchMembersById(id!);
  const bioHtml = member ? resolveBiography(member.biography) : "";

  if (isLoading) return <Skeleton />;

  if (!member) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-gray-400">
        <p className="text-lg font-semibold mb-2">Member not found</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-sm text-[#027027] font-medium hover:underline flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> Go back
        </button>
      </div>
    );
  }

  return (
    <div className="pb-24">
      {/* ── Back Button ── */}
      <div className="mb-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#027027] transition-colors group"
        >
          <span className="w-8 h-8 rounded-xl border border-gray-200 bg-white flex items-center justify-center group-hover:border-[#027027]/30 group-hover:bg-[#ebf5ee] transition-all shadow-sm">
            <ArrowLeft className="w-4 h-4" />
          </span>
          Back to Members
        </button>
      </div>

      {/* ── Hero Banner ── */}
      <div className="relative h-56 md:h-72 rounded-3xl overflow-hidden mb-0 bg-gradient-to-br from-[#013d18] via-[#027027] to-[#0a9e3a]">
        {/* Decorative pattern */}
        <svg
          className="absolute inset-0 w-full h-full opacity-10"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="dots"
              x="0"
              y="0"
              width="24"
              height="24"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1.5" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>

        {/* Soft radial glow */}
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-64 h-64 rounded-full bg-white/5 blur-2xl" />

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-5 left-5 z-10 inline-flex items-center gap-2 text-white/80 hover:text-white
            bg-white/10 hover:bg-white/20 backdrop-blur-sm px-3.5 py-2 rounded-xl text-sm font-medium transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Board badge */}
        {member.is_boardMember && (
          <div className="absolute top-5 right-5 z-10">
            <span
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest
              px-3 py-1.5 rounded-full bg-amber-400/20 text-amber-200 border border-amber-300/30 backdrop-blur-sm"
            >
              <Crown className="w-3.5 h-3.5" />
              {member.board_title ?? "Board Member"}
            </span>
          </div>
        )}
      </div>

      {/* ── Profile Card (overlaps hero) ── */}
      <div className="max-w-4xl mx-auto px-4 -mt-16 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8">
          {/* Avatar + name row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
            {/* Avatar */}
            <div className="w-28 h-28 md:w-36 md:h-50 rounded-2xl overflow-hidden shrink-0 ring-4 ring-white shadow-lg -mt-20 sm:-mt-24 bg-[#ebf5ee]">
              <Avatar
                member={member}
                imageBaseUrl={import.meta.env.VITE_IMAGE_PREFIX}
              />
            </div>

            {/* Name block */}
            <div className="flex-1 pb-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                {member.full_name}
              </h1>

              <div className="mt-1.5 space-y-1">
                {member.practice_name && (
                  <span className="flex items-center gap-1.5 text-sm text-[#027027] font-semibold">
                    <Building2 className="w-3.5 h-3.5" />
                    {member.practice_name}
                  </span>
                )}

                {member.speciality && (
                  <p className="text-sm text-gray-600">{member.speciality}</p>
                )}

                {(member.city || member.state || member.country) && (
                  <span className="flex items-center gap-1 text-sm text-gray-500">
                    <MapPin className="w-3.5 h-3.5" />
                    {[member.city, member.state, member.country]
                      .filter(Boolean)
                      .join(", ")}
                  </span>
                )}
              </div>
            </div>

            {/* Print button */}
            <button
              onClick={() => window.print()}
              className="shrink-0 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700
                border border-gray-200 hover:border-gray-300 px-3.5 py-2 rounded-xl transition-all"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
            </button>
          </div>

          {/* Divider */}
          <div className="my-6 border-t border-gray-100" />

          {/* ── Contact grid ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {member.practice_email && (
              <ContactPill
                icon={Mail}
                label="Pratice Email"
                value={member.practice_email}
                href={`mailto:${member.practice_email}`}
              />
            )}
            {member.practice_referral_email && (
              <ContactPill
                icon={Mail}
                label="Practice Referral Email"
                value={member.practice_referral_email}
                href={`mailto:${member.practice_referral_email}`}
              />
            )}
            {member.practice_contact_number && (
              <ContactPill
                icon={Phone}
                label="Practice Contact Number"
                value={member.practice_contact_number}
                href={`tel:${member.practice_contact_number}`}
              />
            )}
            {member.fax_number && (
              <ContactPill
                icon={Phone}
                label="Fax Number"
                value={member.fax_number}
              />
            )}
            {member.website && (
              <ContactPill
                icon={Globe}
                label="Website"
                value={member.website.replace(/^https?:\/\//, "")}
                href={member.website}
              />
            )}
            {(member.city || member.state) && (
              <ContactPill
                icon={MapPin}
                label="Location"
                value={[member.city, member.state, member.country]
                  .filter(Boolean)
                  .join(", ")}
              />
            )}
          </div>
        </div>

        {/* ── Biography ── */}
        {bioHtml && (
          <div className="mt-6 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Section header */}
            <div className="flex items-center gap-3 px-6 md:px-8 py-5 border-b border-gray-50">
              <div className="w-1 h-6 rounded-full bg-[#027027]" />
              <h2 className="text-base font-bold text-gray-900 tracking-tight">
                Biography
              </h2>
            </div>

            {/* Bio content */}
            <div
              className="px-6 md:px-8 py-6 text-sm text-gray-700 leading-relaxed
                [&_h1]:text-xl [&_h1]:font-bold [&_h1]:text-gray-900 [&_h1]:mb-3 [&_h1]:mt-5
                [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:mb-2 [&_h2]:mt-5
                [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-gray-900 [&_h3]:mb-2 [&_h3]:mt-4
                [&_h4]:text-sm [&_h4]:font-bold [&_h4]:text-gray-900 [&_h4]:mb-1.5 [&_h4]:mt-3
                [&_h5]:text-sm [&_h5]:font-bold [&_h5]:text-gray-800 [&_h5]:mb-1.5 [&_h5]:mt-3
                [&_p]:mb-3 [&_p]:leading-7
                [&_ul]:mb-3 [&_ul]:space-y-1.5
                [&_ol]:mb-3 [&_ol]:space-y-1.5 [&_ol]:pl-5
                [&_li]:leading-relaxed [&_li]:text-gray-600
                [&_ul_li]:relative [&_ul_li]:pl-5
                [&_ul_li]:before:content-[''] [&_ul_li]:before:absolute [&_ul_li]:before:left-0
                [&_ul_li]:before:top-[0.55em] [&_ul_li]:before:w-1.5 [&_ul_li]:before:h-1.5
                [&_ul_li]:before:rounded-full [&_ul_li]:before:bg-[#027027]
                [&_blockquote]:border-l-4 [&_blockquote]:border-[#027027] [&_blockquote]:pl-5
                [&_blockquote]:text-gray-500 [&_blockquote]:italic [&_blockquote]:my-4
                [&_strong]:font-semibold [&_strong]:text-gray-900
                [&_em]:text-gray-600
                [&_hr]:border-gray-100 [&_hr]:my-5
              "
              dangerouslySetInnerHTML={{ __html: bioHtml }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberDetails;
