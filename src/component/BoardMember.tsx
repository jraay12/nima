import { boardMembers } from "../mockdata";
import { ArrowRight } from "lucide-react";

const BoardMember = () => {
  return (
    <section className="bg-[#fafafa] py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Board Members
          </h2>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
            Leadership team guiding NIMA’s mission in advancing healthcare,
            collaboration, and community service.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {boardMembers.map((member) => (
            <MemberCard
              key={member.name}
              image={member.image}
              name={member.name}
              specialty={member.specialty}
              role={member.role}
            />
          ))}
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 bg-white mt-10 rounded-2xl shadow-sm border border-gray-100 px-8 py-10">
          {/* Text */}
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

          {/* Button */}
          <button className="group inline-flex items-center gap-2 bg-[#027027] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#01551d] transition-colors whitespace-nowrap">
            View Membership Directory
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
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
    <div className="group bg-white border border-gray-100 rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      {/* Image */}
      <div className="flex justify-center mb-5">
        <img
          src={image}
          alt={name}
          className="w-24 h-24 rounded-full object-cover ring-4 ring-gray-50"
        />
      </div>

      {/* Name */}
      <h3 className="text-lg font-semibold text-gray-900">{name}</h3>

      {/* Specialty */}
      <p className="text-gray-600 text-sm mt-1">{specialty}</p>

      {/* Divider */}
      <div className="w-10 h-px bg-gray-200 mx-auto my-4" />

      {/* Role */}
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-[#027027]">
        {role}
      </span>
    </div>
  );
}
