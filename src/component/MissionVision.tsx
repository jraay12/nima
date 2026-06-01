import { useEffect, useRef, useState, type ReactNode } from "react";
import { type LucideIcon } from "lucide-react";
import { missions } from "../mockdata";

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
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.15 }
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
        visible ? "opacity-100 translate-x-0 translate-y-0" : `opacity-0 ${translate}`
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

const MissionVision = () => {
  return (
    <div>
      {/* Hero section */}
      <section className="bg-gradient-to-br from-[#f0f3f6] to-[#ebf5ee] py-24 px-6 overflow-hidden">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
          <FadeIn delay={0}>
            <span className="uppercase tracking-[0.2em] text-sm font-semibold text-[#027027] mb-4 block">
              Nevada Iranian-American Medical Association
            </span>
          </FadeIn>

          <FadeIn delay={120}>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our Mission & Vision
            </h2>
          </FadeIn>

          <FadeIn delay={240}>
            <p className="max-w-2xl text-lg leading-relaxed text-gray-600">
              Dedicated to medical excellence, cultural heritage, and the
              professional advancement of Iranian-American healthcare leaders in
              Nevada.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Mission cards section */}
      <section className="bg-[#f5f5f7] px-10 py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <FadeIn direction="left">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-14 border-t-2 border-[#027027]" />
              <h1 className="text-3xl font-bold text-[#027027] whitespace-nowrap">
                Mission Statement
              </h1>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {missions.map((mission, i) => (
              <FadeIn key={mission.title} delay={i * 100} direction="up">
                <MissionCard
                  title={mission.title}
                  description={mission.description}
                  Icon={mission.icon}
                />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Vision section */}
      <section className="bg-white">
        <section className="px-6 py-16">
          <div className="max-w-7xl mx-auto">
            <FadeIn direction="up">
              <div className="bg-[#f2faf5] border border-green-100 rounded-2xl p-10 md:p-14">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 border-t-2 border-[#027027]" />
                  <h1 className="text-3xl font-bold text-[#027027] whitespace-nowrap">
                    Vision Statement
                  </h1>
                </div>

                <FadeIn delay={200} direction="up">
                  <p className="text-lg md:text-xl leading-relaxed text-gray-700 max-w-3xl border-l-4 border-[#027027] pl-6 italic">
                    "Reviving Iran's rich medical heritage and honoring the intrinsic
                    value of Iranian doctors, reconnecting our historic knowledge with
                    our culture."
                  </p>
                </FadeIn>
              </div>
            </FadeIn>
          </div>
        </section>
      </section>
    </div>
  );
};

export default MissionVision;

type MissionCardProps = {
  title: string;
  description: string;
  Icon: LucideIcon;
};

function MissionCard({ title, description, Icon }: MissionCardProps) {
  return (
    <div className="group relative bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 min-h-60 ">
      {/* Animated green bar on hover */}
      <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#027027] rounded-b-xl group-hover:w-full transition-all duration-500" />

      {/* Icon */}
      <div className="absolute top-6 left-6">
        <div className="flex items-center justify-center w-12 h-12 rounded-md bg-green-100 group-hover:bg-[#027027] transition-colors duration-300">
          <Icon className="w-6 h-6 text-[#027027] group-hover:text-white transition-colors duration-300" />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col items-center justify-center text-center pt-12">
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}