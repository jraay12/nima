import {
  GraduationCap,
  Users,
  Handshake,
  HeartHandshake,
  BriefcaseMedicalIcon,
  Tag,
  TicketPercent,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router";

const JoinNima = () => {
  return (
    <div className="bg-[#f5f5f7] pb-10">
      <section className=" py-24 px-6">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
          <span className="uppercase tracking-[0.2em] text-sm font-bold text-[#027027] mb-4">
            membership benefits
          </span>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Why Join NIMA?
          </h2>

          <p className="max-w-2xl text-lg leading-relaxed text-gray-600">
            Join a community of Iranian-American healthcare professionals
            dedicated to connection, growth, and service. We represent the
            pinnacle of clinical excellence and cultural heritage in Nevada.
          </p>
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-6 pb-14 ">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Row 1 - Large Left */}
          <div className="relative lg:col-span-8 bg-white rounded-2xl p-8 pt-24 border border-gray-100 shadow-sm">
            <div className="absolute top-6 left-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-md bg-green-100">
                <GraduationCap className="w-6 h-6 text-[#027027]" />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Professional Growth
            </h3>

            <p className="text-gray-600 leading-relaxed max-w-md text-justify    ">
              Access to specialized events, local mentorship programs, and
              continuous medical education (CME) credits designed to elevate
              your career trajectory in the Nevada healthcare landscape.
            </p>
          </div>

          <div className="relative lg:col-span-4 bg-white rounded-2xl p-8 pt-24 border border-green-100">
            <div className="absolute top-6 left-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-md bg-green-100">
                <Users className="w-6 h-6 text-[#027027]" />
              </div>
            </div>

            <h3 className="text-xl font-bold mb-4">Patient Access</h3>

            <p className="text-gray-600">
              Enhanced visibility through NIMA's exclusive member directory and
              outreach programs, connecting you with patients seeking
              specialized Iranian-American medical expertise.
            </p>
          </div>

          <div className="relative lg:col-span-4 bg-white rounded-2xl p-8 pt-24 border border-green-100">
            <div className="absolute top-6 left-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-md bg-green-100">
                <Handshake className="w-6 h-6 text-[#027027]" />
              </div>
            </div>

            <h3 className="text-xl font-bold mb-4">Community Connection</h3>

            <p className="text-gray-600">
              Meaningful professional relationships via cultural and social
              gatherings that celebrate our shared heritage while advancing
              medicine.
            </p>
          </div>

          <div className="relative overflow-hidden lg:col-span-8 bg-white rounded-2xl p-8 pt-24 border border-gray-100 shadow-sm">
            {/* Top Icon */}
            <div className="absolute top-6 left-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-md bg-green-100">
                <HeartHandshake className="w-6 h-6 text-[#027027]" />
              </div>
            </div>

            {/* Background Icon */}
            <BriefcaseMedicalIcon
              className="absolute -bottom-3 hidden md:block right-4 w-40 h-40 text-[#027027]/10"
              strokeWidth={1.2}
            />

            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Philanthropic Opportunities
            </h3>

            <p className="text-gray-600 leading-relaxed max-w-md text-justify relative z-10">
              Participate in healthcare initiatives that give back to the Nevada
              community, providing care for the underserved and supporting
              future medical students through scholarships.
            </p>
          </div>
        </div>
      </div>
      <div className="relative bg-[#006e25] rounded-2xl max-w-7xl mx-auto px-8 py-10 md:px-12 md:py-8 overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div className="relative">
            {/* Icon */}
            <div className="absolute top-0 left-0">
              <div className="flex items-center justify-center w-12 h-12 rounded-md bg-white/15 backdrop-blur-sm">
                <Tag className="w-6 h-6 text-white" />
              </div>
            </div>

            {/* Content */}
            <div className="pl-16">
              <h3 className="text-3xl font-bold text-white mb-3">
                Exclusive Member Pricing
              </h3>

              <p className="text-green-50 max-w-2xl text-lg leading-relaxed">
                Discounted rates for you and your family at all NIMA medical
                galas, social events, and seminars.
              </p>
            </div>
          </div>

          <button className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-white text-[#006e25] font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap">
            Become a Member Today
          </button>
        </div>

        {/* Decorative Background Element */}
        <TicketPercent
          className="absolute -right-8 -bottom-8 w-40 h-40 text-white/[0.06]"
          strokeWidth={1}
        />
      </div>
      <div className="flex justify-center mt-8">
        <Link
          to="/membership"
          className="group inline-flex items-center gap-2 font-semibold text-[#027027] transition-colors duration-200 hover:text-[#01551d]"
        >
          <span>Learn More About Membership</span>

          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
};

export default JoinNima;
