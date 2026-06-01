import {
  GraduationCap,
  ShieldCheck,
  Handshake,
  HeartHandshake,
  Landmark,
  Stethoscope,
  MapPin,
  Calendar,
  Users,
  Mic,
  BadgeCheck,
} from "lucide-react";

export const missions = [
  {
    title: "Professional Development",
    description:
      "Promote professional development and advancement of our members through educational programs, networking opportunities, financial and business opportunities, and mentorship initiatives.",
    icon: GraduationCap,
  },
  {
    title: "Patient Care Excellence",
    description:
      "Advocate for the highest standards of patient care and ethical practices within the medical community.",
    icon: ShieldCheck,
  },
  {
    title: "Community Collaboration",
    description:
      "Serve as a bridge between the Iranian-American healthcare community and the broader community in Nevada, fostering cross-cultural understanding and collaboration.",
    icon: Handshake,
  },
  {
    title: "Philanthropy & Service",
    description:
      "Provide a platform for our members to engage in philanthropic and community service activities, positively impacting the lives of Nevadans.",
    icon: HeartHandshake,
  },
  {
    title: "Cultural Heritage",
    description:
      "Preserve and celebrate the rich cultural heritage and contributions of Iranian-Americans in the field of medicine.",
    icon: Landmark,
  },
  {
    title: "Physician Integration",
    description:
      "Facilitate the integration of Iranian physicians into the Nevada healthcare system and support their professional growth and success.",
    icon: Stethoscope,
  },
];

export const boardMembers = [
  {
    name: "Dr. Sarah Ahmed",
    specialty: "Physical Medicine & Rehabilitation",
    role: "Chairman of the Board",
    description:
      "Leads strategic direction and governance for NIMA, ensuring alignment with its mission of advancing medical excellence and community impact in Nevada.",
    image:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80",
    icon: GraduationCap,
  },
  {
    name: "Dr. Michael Rahimi",
    specialty: "Internal Medicine",
    role: "Vice Chairman",
    description:
      "Supports organizational leadership and oversees collaborative initiatives that strengthen physician engagement and professional development.",
    image:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=600&q=80",
    icon: ShieldCheck,
  },
  {
    name: "Dr. Leila Hosseini",
    specialty: "Cardiology",
    role: "Secretary",
    description:
      "Manages board communications, documentation, and ensures transparent coordination across all committees and programs.",
    image:
      "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?auto=format&fit=crop&w=600&q=80",
    icon: Handshake,
  },
];

export const events = [
  {
    title: "NIMA Annual Meeting 2026",
    badge: "SIGNATURE EVENT",
    speaker: "Stavros Anthony",
    speakerTitle: "Nevada Lieutenant Governor (Guest Speaker)",
    timeRange: "5:30 PM – 6:00 PM",
    timeNote: "Opening keynote and networking session",
    venue: "Red Rock Country Club",
    address: "2250 Red Springs Dr",
    city: "Las Vegas, NV 89135",
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
    day: 20,
    month: "MAY",
    year: 2026,
    icon: Mic,
  },
  {
    title: "NIMA Medical Innovation Forum",
    badge: "PROFESSIONAL FORUM",
    speaker: "Dr. Reza Farhadi",
    speakerTitle: "Chief of Neurology, UCLA Health",
    timeRange: "2:00 PM – 4:30 PM",
    timeNote: "Panel discussion on modern clinical advancements",
    venue: "Las Vegas Convention Center",
    address: "3150 Paradise Rd",
    city: "Las Vegas, NV 89109",
    image:
      "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=1200&q=80",
    day: 12,
    month: "JUN",
    year: 2026,
    icon: BadgeCheck,
  },
  {
    title: "Community Health & Outreach Day",
    badge: "COMMUNITY SERVICE",
    speaker: "Dr. Leila Hosseini",
    speakerTitle: "Cardiology Consultant",
    timeRange: "9:00 AM – 1:00 PM",
    timeNote: "Free screenings and public health education",
    venue: "Sunrise Hospital",
    address: "3186 S Maryland Pkwy",
    city: "Las Vegas, NV 89109",
    image:
      "",
    day: 5,
    month: "APR",
    year: 2026,
    icon: Users,
  },
  {
    title: "Physician Networking & Gala Night",
    badge: "NETWORKING EVENT",
    speaker: "Dr. Michael Rahimi",
    speakerTitle: "Internal Medicine Specialist",
    timeRange: "7:00 PM – 11:00 PM",
    timeNote: "Formal dinner and professional networking",
    venue: "Wynn Las Vegas",
    address: "3131 Las Vegas Blvd S",
    city: "Las Vegas, NV 89109",
    image:
      "",
    day: 28,
    month: "SEP",
    year: 2026,
    icon: Calendar,
  },
];
