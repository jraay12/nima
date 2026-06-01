import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Globe,
  MessageSquare,
  ImageIcon,
  Cookie,
  MonitorPlay,
  Share2,
  Clock,
  ShieldCheck,
  Send,
} from "lucide-react";
import NimaFooter from "../component/Footer";

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
      { threshold: 0.1 },
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

const sections = [
  {
    icon: Globe,
    title: "Who We Are",
    content: (
      <p className="text-gray-600 leading-relaxed">
        Our website address is:{" "}
        <a
          href="http://nimanv.com"
          className="text-[#027027] hover:underline font-medium"
        >
          http://nimanv.com
        </a>
        .
      </p>
    ),
  },
  {
    icon: MessageSquare,
    title: "Comments",
    content: (
      <div className="flex flex-col gap-3 text-gray-600 leading-relaxed">
        <p>
          When visitors leave comments on the site we collect the data shown in
          the comments form, and also the visitor's IP address and browser user
          agent string to help spam detection.
        </p>
        <p>
          An anonymized string created from your email address (also called a
          hash) may be provided to the Gravatar service to see if you are using
          it. The Gravatar service privacy policy is available here:{" "}
          <a
            href="https://automattic.com/privacy/"
            target="_blank"
            rel="noreferrer"
            className="text-[#027027] hover:underline"
          >
            https://automattic.com/privacy/
          </a>
          . After approval of your comment, your profile picture is visible to
          the public in the context of your comment.
        </p>
      </div>
    ),
  },
  {
    icon: ImageIcon,
    title: "Media",
    content: (
      <p className="text-gray-600 leading-relaxed">
        If you upload images to the website, you should avoid uploading images
        with embedded location data (EXIF GPS) included. Visitors to the website
        can download and extract any location data from images on the website.
      </p>
    ),
  },
  {
    icon: Cookie,
    title: "Cookies",
    content: (
      <div className="flex flex-col gap-3 text-gray-600 leading-relaxed">
        <p>
          If you leave a comment on our site you may opt-in to saving your name,
          email address and website in cookies. These are for your convenience
          so that you do not have to fill in your details again when you leave
          another comment. These cookies will last for one year.
        </p>
        <p>
          If you visit our login page, we will set a temporary cookie to
          determine if your browser accepts cookies. This cookie contains no
          personal data and is discarded when you close your browser.
        </p>
        <p>
          When you log in, we will also set up several cookies to save your
          login information and your screen display choices. Login cookies last
          for two days, and screen options cookies last for a year. If you
          select "Remember Me", your login will persist for two weeks. If you
          log out of your account, the login cookies will be removed.
        </p>
        <p>
          If you edit or publish an article, an additional cookie will be saved
          in your browser. This cookie includes no personal data and simply
          indicates the post ID of the article you just edited. It expires after
          1 day.
        </p>
      </div>
    ),
  },
  {
    icon: MonitorPlay,
    title: "Embedded Content from Other Websites",
    content: (
      <div className="flex flex-col gap-3 text-gray-600 leading-relaxed">
        <p>
          Articles on this site may include embedded content (e.g. videos,
          images, articles, etc.). Embedded content from other websites behaves
          in the exact same way as if the visitor has visited the other website.
        </p>
        <p>
          These websites may collect data about you, use cookies, embed
          additional third-party tracking, and monitor your interaction with
          that embedded content, including tracking your interaction with the
          embedded content if you have an account and are logged in to that
          website.
        </p>
      </div>
    ),
  },
  {
    icon: Share2,
    title: "Who We Share Your Data With",
    content: (
      <p className="text-gray-600 leading-relaxed">
        If you request a password reset, your IP address will be included in the
        reset email.
      </p>
    ),
  },
  {
    icon: Clock,
    title: "How Long We Retain Your Data",
    content: (
      <div className="flex flex-col gap-3 text-gray-600 leading-relaxed">
        <p>
          If you leave a comment, the comment and its metadata are retained
          indefinitely. This is so we can recognize and approve any follow-up
          comments automatically instead of holding them in a moderation queue.
        </p>
        <p>
          For users that register on our website (if any), we also store the
          personal information they provide in their user profile. All users can
          see, edit, or delete their personal information at any time (except
          they cannot change their username). Website administrators can also
          see and edit that information.
        </p>
      </div>
    ),
  },
  {
    icon: ShieldCheck,
    title: "What Rights You Have Over Your Data",
    content: (
      <p className="text-gray-600 leading-relaxed">
        If you have an account on this site, or have left comments, you can
        request to receive an exported file of the personal data we hold about
        you, including any data you have provided to us. You can also request
        that we erase any personal data we hold about you. This does not include
        any data we are obliged to keep for administrative, legal, or security
        purposes.
      </p>
    ),
  },
  {
    icon: Send,
    title: "Where Your Data Is Sent",
    content: (
      <p className="text-gray-600 leading-relaxed">
        Visitor comments may be checked through an automated spam detection
        service.
      </p>
    ),
  },
];

const PrivacyPolicyPage = () => {
  return (
    <div className="bg-[#fafafa] min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#f0f3f6] to-[#ebf5ee] py-20 px-6 overflow-hidden">
        <div className="max-w-3xl mx-auto text-center">
          <FadeIn delay={0}>
            <span className="uppercase tracking-[0.2em] text-sm font-bold text-[#027027] mb-4 block">
              Legal
            </span>
          </FadeIn>
          <FadeIn delay={120}>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5">
              Privacy Policy
            </h1>
          </FadeIn>
          <FadeIn delay={240}>
            <p className="text-lg text-gray-600 leading-relaxed">
              Your privacy matters to us. This policy explains what data we
              collect, how we use it, and the rights you have over your
              information.
            </p>
          </FadeIn>
          <FadeIn delay={320}>
            <p className="text-sm text-gray-400 mt-4">
              Last updated: January 1, 2026
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-6 py-16 overflow-hidden">
        <div className="flex flex-col gap-6">
          {sections.map((section, i) => {
            const Icon = section.icon;
            return (
              <FadeIn key={section.title} direction="up" delay={i * 60}>
                <div className="group bg-white border border-gray-100 rounded-2xl p-7 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden">
                  {/* Green sweep */}
                  <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#027027] group-hover:w-full transition-all duration-500" />

                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="shrink-0 flex items-center justify-center w-11 h-11 rounded-lg bg-green-50 group-hover:bg-[#027027] transition-colors duration-300 mt-0.5">
                      <Icon className="w-5 h-5 text-[#027027] group-hover:text-white transition-colors duration-300" />
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg font-bold text-gray-900 mb-3">
                        {section.title}
                      </h2>
                      {section.content}
                    </div>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>

        {/* Contact CTA */}
        <FadeIn direction="up" delay={100} className="mt-10">
          <div className="relative bg-[#006e25] rounded-2xl px-8 py-10 overflow-hidden text-center">
            <h3 className="text-2xl font-bold text-white mb-2">
              Questions About Your Privacy?
            </h3>
            <p className="text-green-100 mb-6 max-w-lg mx-auto">
              If you have any questions or concerns about this privacy policy or
              your personal data, don't hesitate to reach out.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 bg-white text-[#006e25] font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 active:scale-95 transition-all"
            >
              Contact Us
            </a>
            {/* Decorative */}
            <ShieldCheck
              className="absolute -right-6 -bottom-6 w-36 h-36 text-white/[0.06]"
              strokeWidth={1}
            />
          </div>
        </FadeIn>
      </section>
      <NimaFooter />
    </div>
  );
};

export default PrivacyPolicyPage;
