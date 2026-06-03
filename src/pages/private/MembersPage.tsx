import { Plus } from "lucide-react";
import { useNavigate } from "react-router";
import MemberList from "../../component/MemberList";
import { useFetchMembers } from "../../features/members/member.hook";

const MembersPage = () => {
  const navigate = useNavigate();
  const { data } = useFetchMembers();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* Title Section */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Members
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage all registered members and board professionals
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={() => navigate("/member/create")}
          className="inline-flex items-center gap-2 bg-[#027027] text-white text-sm font-semibold
            px-4 py-2.5 rounded-xl transition-all duration-200
            hover:bg-[#025f22] active:scale-[0.98]
            focus:outline-none focus:ring-2 focus:ring-[#027027]/30"
        >
          <Plus className="w-4 h-4" />
          Create Member
        </button>
      </div>

      {/* List */}
      <MemberList
        members={data}
        mode="admin"
        imageBaseUrl={import.meta.env.VITE_IMAGE_PREFIX}
        onEdit={(member) => navigate(`/members/${member.id}/edit`)}
        // onDelete={(member) => confirmDelete(member)}
      />
    </div>
  );
};

export default MembersPage;