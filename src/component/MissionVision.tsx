import { HeartHandshake, type LucideIcon } from "lucide-react";
import { missions } from "../mockdata";

const MissionVision = () => {
  return (
    <div>
      <section className="bg-gradient-to-br from-[#f0f3f6] to-[#ebf5ee] py-24 px-6">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
          <span className="uppercase tracking-[0.2em] text-sm font-semibold text-[#027027] mb-4">
            Nevada Iranian-American Medical Association
          </span>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our Mission & Vision
          </h2>

          <p className="max-w-2xl text-lg leading-relaxed text-gray-600">
            Dedicated to medical excellence, cultural heritage, and the
            professional advancement of Iranian-American healthcare leaders in
            Nevada.
          </p>
        </div>
      </section>
      <section className="bg-[#f5f5f7] px-10 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Section Title */}
          <div className="flex items-center gap-4 mb-12">
            <div className="w-14 border-t-2 border-[#027027]" />

            <h1 className="text-3xl font-bold text-[#027027] whitespace-nowrap">
              Mission Statement
            </h1>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {missions.map((mission) => (
              <MissionCard
                key={mission.title}
                title={mission.title}
                description={mission.description}
                Icon={mission.icon}
              />
            ))}
          </div>
        </div>
      </section>
      {/* Vision */}
      <section className="bg-white ">
        <section className="px-6 py-16 ">
          <div className="max-w-7xl mx-auto bg-[#f2faf5] border border-green-100 rounded-2xl p-10 md:p-14">
            {/* Section Title */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 border-t-2 border-[#027027]" />

              <h1 className="text-3xl font-bold text-[#027027] whitespace-nowrap">
                Vision Statement
              </h1>
            </div>

            <p className="text-lg md:text-xl leading-relaxed text-gray-700 max-w-3xl border-l-4 border-[#027027] pl-6 italic ">
              “Reviving Iran’s rich medical heritage and honoring the intrinsic
              value of Iranian doctors, reconnecting our historic knowledge with
              our culture.”
            </p>
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
    <div className="relative bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      {/* Icon */}
      <div className="absolute top-6 left-6">
        <div className="flex items-center justify-center w-12 h-12 rounded-md bg-green-100">
          <Icon className="w-6 h-6 text-[#027027]" />
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
