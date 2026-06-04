import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Mail,
  Phone,
  Globe,
  Crown,
  MapPin,
  Edit2,
  Trash2,
  User,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Search,
  ArrowRight,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Member = {
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

export type MemberListProps = {
  members: Member[];
  mode?: "admin" | "public";
  imageBaseUrl?: string;
  onEdit?: (member: Member) => void;
  onDelete?: (member: Member) => void;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function resolveBiography(bio: Member["biography"]): string {
  if (!bio) return "";
  // Already HTML string(s)
  if (typeof bio === "string") return bio;
  if (Array.isArray(bio)) return bio.join("");
  // Tiptap/ProseMirror JSON
  if (typeof bio === "object" && "content" in bio) {
    return tiptapToHtml(bio as TiptapDoc);
  }
  return "";
}

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

function resolveImageUrl(path: string | null, base?: string): string | null {
  if (!path) return null;
  const clean = path.replace(/\\/g, "/");
  if (clean.startsWith("http")) return clean;
  return base ? `${base.replace(/\/$/, "")}/${clean}` : `/${clean}`;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

// ─── MemberAvatar ─────────────────────────────────────────────────────────────

function MemberAvatar({
  member,
  size = "md",
  imageBaseUrl = import.meta.env.VITE_IMAGE_PREFIX,
}: {
  member: Member;
  size?: "sm" | "md" | "lg";
  imageBaseUrl?: string;
}) {
  const [imgError, setImgError] = useState(false);
  const src = resolveImageUrl(member.image_path, imageBaseUrl);
  console.log(src)
  const sizeMap = {
    sm: "w-10 h-10 text-sm",
    md: "w-14 h-14 text-base",
    lg: "w-24 h-24 text-2xl",
  };

  if (src && !imgError) {
    return (
      <img
        src={src}
        alt={member.full_name}
        onError={() => setImgError(true)}
        className={`${sizeMap[size]} rounded-full object-cover shrink-0 ring-2 ring-white shadow-sm`}
      />
    );
  }

  return (
    <div
      className={`${sizeMap[size]} rounded-full shrink-0 bg-[#ebf5ee] flex items-center justify-center ring-2 ring-white shadow-sm`}
    >
      <span className="font-bold text-[#027027]">
        {getInitials(member.full_name)}
      </span>
    </div>
  );
}

// ─── BiographyRenderer ────────────────────────────────────────────────────────

function BiographyRenderer({ bio }: { bio: Member["biography"] }) {
  const [expanded, setExpanded] = useState(false);
  const html = resolveBiography(bio);
  if (!html)
    return (
      <p className="text-sm text-gray-400 italic">No biography provided.</p>
    );

  return (
    <div>
      <div
        className={`text-sm text-gray-600 overflow-hidden transition-all duration-300 prose prose-sm max-w-none
          [&_h1]:text-base [&_h1]:font-bold [&_h1]:text-gray-900 [&_h1]:mb-1 [&_h1]:mt-2
          [&_h2]:text-sm [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:mb-1 [&_h2]:mt-2
          [&_h3]:text-sm [&_h3]:font-bold [&_h3]:text-gray-900 [&_h3]:mb-1 [&_h3]:mt-2
          [&_h5]:text-sm [&_h5]:font-bold [&_h5]:text-gray-900 [&_h5]:mb-1 [&_h5]:mt-2
          [&_p]:mb-1.5 [&_p]:leading-relaxed
          [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:mb-1.5 [&_ul]:space-y-0.5
          [&_ol]:list-decimal [&_ol]:pl-4 [&_ol]:mb-1.5
          [&_li]:leading-relaxed
          [&_blockquote]:border-l-4 [&_blockquote]:border-[#027027]/30 [&_blockquote]:pl-3 [&_blockquote]:text-gray-500 [&_blockquote]:italic
          [&_strong]:font-semibold [&_strong]:text-gray-800
        `}
        style={{ maxHeight: expanded ? "9999px" : "80px" }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="mt-1 flex items-center gap-1 text-xs font-medium text-[#027027] hover:text-[#025f22] transition-colors"
      >
        {expanded ? (
          <>
            <ChevronUp className="w-3 h-3" /> Show less
          </>
        ) : (
          <>
            <ChevronDown className="w-3 h-3" /> Read more
          </>
        )}
      </button>
    </div>
  );
}

// ─── Admin Card ───────────────────────────────────────────────────────────────

function AdminMemberCard({
  member,
  imageBaseUrl = import.meta.env.VITE_IMAGE_PREFIX,
  onEdit,
  onDelete,
}: {
  member: Member;
  imageBaseUrl?: string;
  onEdit?: (m: Member) => void;
  onDelete?: (m: Member) => void;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md hover:border-gray-200 transition-all duration-200 group">
      <div className="flex items-start gap-4">
        <MemberAvatar member={member} size="md" imageBaseUrl={imageBaseUrl} />

        <div className="flex-1 min-w-0">
          {/* Name + badge */}
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-gray-900 truncate">
                {member.full_name}
              </h3>
              <p className="text-xs text-gray-500 truncate mt-0.5">
                {member.practice_name}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {member.is_boardMember && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200">
                  <Crown className="w-2.5 h-2.5" />
                  {member.board_title ?? "Board Member"}
                </span>
              )}

              {/* Admin actions — visible on hover */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {onEdit && (
                  <button
                    type="button"
                    onClick={() => onEdit(member)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-[#027027] hover:bg-[#ebf5ee] transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                )}
                {onDelete && (
                  <button
                    type="button"
                    onClick={() => onDelete(member)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Contact row */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2.5">
            {member.practice_email && (
              <a
                href={`mailto:${member.practice_email}`}
                className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-[#027027] transition-colors"
              >
                <Mail className="w-3 h-3" />
                <span className="truncate max-w-[180px]">
                  {member.practice_email}
                </span>
              </a>
            )}
            {member.practice_contact_number && (
              <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                <Phone className="w-3 h-3" />
                {member.practice_contact_number}
              </span>
            )}
            {member.city && (
              <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                <MapPin className="w-3 h-3" />
                {[member.city, member.state].filter(Boolean).join(", ")}
              </span>
            )}
            {member.website && (
              <a
                href={member.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-[#027027] hover:underline"
              >
                <Globe className="w-3 h-3" />
                Website
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Biography */}
      <div className="mt-4 pt-4 border-t border-gray-50">
        <BiographyRenderer bio={member.biography} />
      </div>
    </div>
  );
}

// ─── Public Card ──────────────────────────────────────────────────────────────

function PublicMemberCard({
  member,
  imageBaseUrl = import.meta.env.VITE_IMAGE_PREFIX,
}: {
  member: Member;
  imageBaseUrl?: string;
}) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/members/${member.id}`)}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-[#027027]/20 transition-all duration-300 flex flex-col group cursor-pointer"
    >
      {/* Top color strip + avatar */}
      <div className="relative h-20 bg-gradient-to-br from-[#027027] to-[#014d1a] shrink-0">
        <div className="absolute -bottom-7 left-5">
          <MemberAvatar member={member} size="lg" imageBaseUrl={imageBaseUrl} />
        </div>
        {member.is_boardMember && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full bg-white/20 text-white backdrop-blur-sm">
              <Crown className="w-3 h-3" />
              {member.board_title ?? "Board Member"}
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="pt-10 px-5 pb-5 flex flex-col flex-1">
        <h3 className="text-base font-bold text-gray-900 leading-snug">
          {member.full_name}
        </h3>
        <p className="text-xs text-[#027027] font-medium mt-0.5 line-clamp-1">
          {member.practice_name}
        </p>

        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3">
          {member.city && (
            <span className="inline-flex items-center gap-1 text-xs text-gray-500">
              <MapPin className="w-3 h-3 text-gray-400" />
              {[member.city, member.state].filter(Boolean).join(", ")}
            </span>
          )}
          {member.practice_email && (
            <a
              href={`mailto:${member.practice_email}`}
              className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-[#027027] transition-colors"
            >
              <Mail className="w-3 h-3 text-gray-400" />
              <span className="truncate max-w-[140px]">
                {member.practice_email}
              </span>
            </a>
          )}
        </div>

        {/* Bio preview */}
        {/* {bioHtml && (
          <div className="mt-4 flex-1">
            <div
              className={`text-xs text-gray-500 leading-relaxed overflow-hidden transition-all duration-300
                [&_h1]:font-bold [&_h1]:text-gray-700 [&_h1]:text-xs [&_h1]:mt-1
                [&_h2]:font-bold [&_h2]:text-gray-700 [&_h2]:text-xs [&_h2]:mt-1
                [&_h3]:font-bold [&_h3]:text-gray-700 [&_h3]:text-xs [&_h3]:mt-1
                [&_h5]:font-bold [&_h5]:text-gray-700 [&_h5]:text-xs [&_h5]:mt-1
                [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:space-y-0.5
                [&_ol]:list-decimal [&_ol]:pl-4
                [&_p]:mb-1 [&_strong]:text-gray-700 [&_strong]:font-semibold
              `}
              style={{ maxHeight: showBio ? "400px" : "52px" }}
              dangerouslySetInnerHTML={{ __html: bioHtml }}
            />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setShowBio((v) => !v); }}
              className="mt-1.5 text-[11px] font-semibold text-[#027027] hover:text-[#025f22] flex items-center gap-0.5 transition-colors"
            >
              {showBio ? <><ChevronUp className="w-3 h-3" />Less</> : <><ChevronDown className="w-3 h-3" />Read bio</>}
            </button>
          </div>
        )} */}

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
          {member.practice_contact_number ? (
            <span
              className="inline-flex items-center gap-1 text-xs text-gray-500"
              onClick={(e) => e.stopPropagation()}
            >
              <Phone className="w-3 h-3" />
              {member.practice_contact_number}
            </span>
          ) : (
            <span />
          )}
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#027027] group-hover:gap-2 transition-all duration-200">
            View profile
            <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── MemberList (main export) ─────────────────────────────────────────────────

export function MemberList({
  members,
  mode = "admin",
  imageBaseUrl = import.meta.env.VITE_IMAGE_PREFIX,
  onEdit,
  onDelete,
}: MemberListProps) {
  const [search, setSearch] = useState("");
  const [boardOnly, setBoardOnly] = useState(false);

  const filtered = members?.filter((m) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      m.full_name.toLowerCase().includes(q) ||
      m.practice_name.toLowerCase().includes(q) ||
      (m.board_title ?? "").toLowerCase().includes(q) ||
      m.city.toLowerCase().includes(q);
    const matchesBoard = !boardOnly || m.is_boardMember;
    return matchesSearch && matchesBoard;
  });

  // ── Admin layout ──
  if (mode === "admin") {
    return (
      <div>
        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search members…"
              className="w-full pl-9 pr-3.5 py-2 text-sm border border-gray-200 rounded-xl bg-white outline-none
                focus:border-[#027027] focus:ring-2 focus:ring-[#027027]/10 transition-all"
            />
          </div>
          <button
            type="button"
            onClick={() => setBoardOnly((v) => !v)}
            className={`inline-flex items-center gap-2 text-sm font-medium px-3.5 py-2 rounded-xl border transition-all
              ${
                boardOnly
                  ? "bg-amber-50 text-amber-700 border-amber-200"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
              }`}
          >
            <Crown className="w-4 h-4" />
            Board only
          </button>
          <span className="text-xs text-gray-400 font-medium">
            {filtered?.length} member{filtered?.length !== 1 ? "s" : ""}
          </span>
        </div>

        {filtered?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <User className="w-10 h-10 mb-3 opacity-30" />
            <p className="text-sm font-medium">No members found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered?.map((member) => (
              <AdminMemberCard
                key={member.id}
                member={member}
                imageBaseUrl={imageBaseUrl}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── Public layout ──
  return (
    <div>
      {/* Search */}
      <div className="flex items-center gap-3 mb-8 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search members…"
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white outline-none
              focus:border-[#027027] focus:ring-2 focus:ring-[#027027]/10 transition-all shadow-sm"
          />
        </div>
        <button
          type="button"
          onClick={() => setBoardOnly((v) => !v)}
          className={`inline-flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-xl border transition-all shadow-sm
            ${
              boardOnly
                ? "bg-amber-50 text-amber-700 border-amber-200"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
            }`}
        >
          <Crown className="w-4 h-4" />
          Board members
        </button>
      </div>

      {filtered?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <User className="w-12 h-12 mb-3 opacity-20" />
          <p className="text-base font-medium">No members found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered?.map((member) => (
            <PublicMemberCard
              key={member.id}
              member={member}
              imageBaseUrl={imageBaseUrl}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default MemberList;
