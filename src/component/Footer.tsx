import { Mail } from "lucide-react";

interface FooterLink {
  label: string;
  href: string;
  indented?: boolean;
}

interface FooterColumn {
  heading: string;
  links: FooterLink[];
}

const navigation: FooterColumn[] = [
  {
    heading: "Navigation",
    links: [
      { label: "Members", href: "#" },
      { label: "Events", href: "#" },
      { label: "Speakers", href: "#", indented: true },
      { label: "Guest Speeches", href: "#", indented: true },
    ],
  },
  {
    heading: "Community",
    links: [
      { label: "Vendors", href: "/community" },
      { label: "Supporters", href: "/community" },
    ],
  },
  {
    heading: "Contact",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy-policy" },
    ],
  },
];

export default function NimaFooter() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Top section */}
        <div className="flex flex-col md:grid md:grid-cols-4 gap-8 mb-8">

          {/* Brand */}
          <div className="md:col-span-1 flex flex-col gap-4">
            <img
              src="https://nimanv.com/wp-content/uploads/2024/12/nima-logo.png"
              alt="NIMA — Nevada Iranian-American Medical Association"
              className="w-32 object-contain"
            />
           
          </div>

          {/* Nav columns — 2-col grid on mobile, flat on desktop */}
          <div className="grid grid-cols-2 gap-6 md:contents">
            {navigation.map((col) => (
              <div key={col.heading}>
                <h3 className="text-sm font-semibold text-gray-800 mb-3">
                  {col.heading}
                </h3>
                <ul className="flex flex-col gap-2">
                  {col.links.map((link) => (
                    <li key={link.label} className={link.indented ? "pl-3" : ""}>
                      <a
                        href={link.href}
                        className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}

                  {col.heading === "Contact" && (
                    <li className="mt-2 pt-2 border-t border-gray-200">
                      <p className="text-sm font-semibold text-gray-800 mb-1">
                        Nevada Iranian-American Medical Association
                      </p>
                      <a
                        href="mailto:info@nimanv.com"
                        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5 shrink-0" />
                        info@nimanv.com
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-200 pt-5">
          <p className="text-xs text-gray-400 text-center">
            © 2024 NIMA. Nevada Iranian-American Medical Association. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}