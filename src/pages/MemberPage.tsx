import { useMemo } from "react";
import { useFetchMembers } from "../features/members/member.hook";
import MemberList from "../component/MemberList";
import NimaFooter from "../component/Footer";

const getSortableMemberName = (name?: string | null) => {
  return (name ?? "")
    .replace(/^dr\.?\s+/i, "")
    .trim()
    .toLowerCase();
};

const MemberPagePublic = () => {
  const { data } = useFetchMembers();

  const sortedMembers = useMemo(() => {
    return [...(data ?? [])].sort((a, b) =>
      getSortableMemberName(a.full_name).localeCompare(
        getSortableMemberName(b.full_name),
      ),
    );
  }, [data]);

  return (
    <div>
      <div className="bg-[#fafafa] min-h-screen py-16 px-6 mt-4">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* HEADER */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-[#027027]">
              Members
            </h1>

            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover conferences, networking sessions, and community events
              hosted by NIMA.
            </p>
          </div>

          <MemberList
            members={sortedMembers}
            mode="public"
            imageBaseUrl={import.meta.env.VITE_IMAGE_PREFIX}
          />
        </div>
      </div>
      <NimaFooter />
    </div>
  );
};

export default MemberPagePublic;