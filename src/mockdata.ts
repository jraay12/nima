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
    id: "nima-annual-meeting-2026",
    title: "NIMA Annual Meeting 2026",
    badge: "SIGNATURE EVENT",

    featuredSpeaker: [
      {
        name: "Stavros Anthony",
        title: "Nevada Lieutenant Governor",
        role: "Keynote Speaker",
        specialty: "Government Leadership",
        description:
          "Opening keynote speaker discussing leadership and healthcare collaboration.",
        image:
          "",
      },
      {
        name: "Dr. Sarah Ahmed",
        title: "Chairman of the Board",
        role: "Panel Speaker",
        specialty: "Physical Medicine & Rehabilitation",
        description:
          "Discussing physician leadership, innovation, and community healthcare initiatives.",
        image:
          "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Dr. Michael Rahimi",
        title: "Internal Medicine Specialist",
        role: "Guest Speaker",
        specialty: "Internal Medicine",
        description:
          "Sharing insights on preventive care and the future of patient-centered healthcare.",
        image:
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80",
      },
    ],

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
    event_notes: "A short fundraising event for the speaker will take place from 5:30 PM to 6:00 PM.",
    icon: Mic,
  },
];
