import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight, User } from "lucide-react";
import { useFetchBoardMembers } from "../features/members/member.hook";
import { useNavigate } from "react-router";
/* ---------------- FadeIn ---------------- */
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
      { threshold: 0.12 },
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

const BOARD_TITLES = [
  "Chairman of the Board",
  "Board Member",
  "Board Secretary",
];

/* ---------------- Main Component ---------------- */
const BoardMember = () => {
  const { data: boardMembers } = useFetchBoardMembers();
  const navigate = useNavigate();

  const sortedBoardMembers = [...(boardMembers ?? [])].sort((a, b) => {
    const rankA = BOARD_TITLES.indexOf(a.board_title ?? "");
    const rankB = BOARD_TITLES.indexOf(b.board_title ?? "");

    return rankA - rankB;
  });
  return (
    <section className="bg-[#fafafa] py-14 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center mb-12">
          <FadeIn direction="up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Board Members
            </h2>
          </FadeIn>

          <FadeIn direction="up" delay={120}>
            <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
              Leadership team guiding NIMA's mission in advancing healthcare,
              collaboration, and community service.
            </p>
          </FadeIn>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedBoardMembers?.map((member: any, i: number) => (
            <FadeIn key={member.id ?? i} direction="up" delay={i * 80}>
              <MemberCard
                image={
                  member.image_path
                    ? `${import.meta.env.VITE_IMAGE_PREFIX}${member.image_path}`
                    : ""
                }
                name={member.full_name}
                specialty={member.practice_name}
                role={member.board_title}
              />
            </FadeIn>
          ))}
        </div>

        {/* CTA */}
        <FadeIn direction="up" delay={100}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-center gap-6  mt-10 rounded-2xl  px-8 py-4">
            <button
              onClick={() => navigate("/members")}
              className="group inline-flex items-center gap-2 bg-[#027027] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#01551d] active:scale-95 transition-all whitespace-nowrap"
            >
              View Membership Directory
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default BoardMember;

/* ---------------- Card ---------------- */
type MemberCardProps = {
  image?: string;
  name: string;
  specialty: string;
  role: string;
};

function MemberCard({ image, name, specialty, role }: MemberCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="group bg-white border border-gray-100 rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-md relative overflow-hidden h-full flex flex-col">
      {/* Green underline */}
      <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#027027] rounded-b-2xl group-hover:w-full transition-all duration-500" />

      {/* Image */}
      <div className="flex justify-center mb-5">
        {!image || imgError ? (
          <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center ring-4 ring-gray-50">
            <User className="w-10 h-10 text-gray-400" />
          </div>
        ) : (
          <img
            src={image}
            alt={name}
            onError={() => setImgError(true)}
            className="w-24 h-24 rounded-full object-cover ring-4 ring-gray-50 group-hover:ring-green-100 transition-all duration-300"
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
          <p className="text-gray-600 text-sm mt-1">{specialty}</p>

          <div className="w-10 h-px bg-gray-200 mx-auto my-4 group-hover:w-16 group-hover:bg-[#027027] transition-all duration-300" />
        </div>

        {/* Role */}
        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-[#027027] group-hover:bg-[#027027] group-hover:text-white transition-colors duration-300">
          {role}
        </span>
      </div>
    </div>
  );
}
