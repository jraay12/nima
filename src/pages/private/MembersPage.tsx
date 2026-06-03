import { Plus } from "lucide-react";
import { useNavigate } from "react-router";

const MembersPage = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-end mb-8 gap-4 flex-wrap">
        <button
          onClick={() => navigate("/member/create")}
          className="inline-flex items-center gap-2 bg-[#027027] text-white text-sm font-semibold
            px-4 py-2.5 rounded-xl transition-all duration-200
            hover:bg-[#025f22] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#027027]/30"
        >
          <Plus className="w-4 h-4" />
          Create Event
        </button>
      </div>

      {/* Content placeholder */}
      <div className="border rounded-lg p-4 text-gray-500">
        Members list will go here...
      </div>
    </div>
  );
};

export default MembersPage;
