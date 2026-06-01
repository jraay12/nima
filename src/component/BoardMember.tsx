import { useEffect, useRef, useState, type ReactNode } from "react";
import { boardMembers } from "../mockdata";
import { ArrowRight } from "lucide-react";

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
      { threshold: 0.12 }
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

const BoardMember = () => {
  return (
    <section className="bg-[#fafafa] py-20 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">

        {/* Section Title */}
        <div className="text-center mb-12">
          <FadeIn direction="up" delay={0}>
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
          {boardMembers.map((member, i) => (
            <FadeIn key={member.name} direction="up" delay={i * 80}>
              <MemberCard
                image={member.image}
                name={member.name}
                specialty={member.specialty}
                role={member.role}
              />
            </FadeIn>
          ))}
        </div>

        {/* CTA banner */}
        <FadeIn direction="up" delay={100}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 bg-white mt-10 rounded-2xl shadow-sm border border-gray-100 px-8 py-10">
            <div className="max-w-2xl">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                NIMA Members
              </h1>
              <p className="text-gray-600 leading-relaxed">
                Our organization is comprised of hundreds of dedicated medical
                professionals across Nevada. Connect with colleagues, specialists,
                and community leaders through our comprehensive member network.
              </p>
            </div>

            <button className="group inline-flex items-center gap-2 bg-[#027027] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#01551d] active:scale-95 transition-all whitespace-nowrap">
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

type MemberCardProps = {
  image: string;
  name: string;
  specialty: string;
  role: string;
};

function MemberCard({ image, name, specialty, role }: MemberCardProps) {
  return (
    <div className="group bg-white border border-gray-100 rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-md relative overflow-hidden">
      {/* Animated green underline */}
      <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#027027] rounded-b-2xl group-hover:w-full transition-all duration-500" />

      {/* Image with ring animation */}
      <div className="flex justify-center mb-5">
        <img
          src={image}
          alt={name}
          className="w-24 h-24 rounded-full object-cover ring-4 ring-gray-50 group-hover:ring-green-100 transition-all duration-300"
        />
      </div>

      {/* Name */}
      <h3 className="text-lg font-semibold text-gray-900">{name}</h3>

      {/* Specialty */}
      <p className="text-gray-600 text-sm mt-1">{specialty}</p>

      {/* Divider with expand animation */}
      <div className="w-10 h-px bg-gray-200 mx-auto my-4 group-hover:w-16 group-hover:bg-[#027027] transition-all duration-300" />

      {/* Role badge */}
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-[#027027] group-hover:bg-[#027027] group-hover:text-white transition-colors duration-300">
        {role}
      </span>
    </div>
  );
}