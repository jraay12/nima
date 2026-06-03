import React from "react";
import { useFetchMembers } from "../features/members/member.hook";
import MemberList from "../component/MemberList";
import NimaFooter from "../component/Footer";
const MemberPagePublic = () => {
  const { data } = useFetchMembers();
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
            members={data}
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
