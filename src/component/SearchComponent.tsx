import { Search } from "lucide-react";
import { useState } from "react";

type Props = {
  onSearch: (query: string) => void;
};

const EventSearch = ({ onSearch }: Props) => {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (!query.trim()) return;
    onSearch(query);
  };

  return (
    <div className="flex items-center gap-2 w-full max-w-xl mx-auto">
      {/* Input */}
      <div className="flex items-center flex-1 bg-white border border-gray-200 rounded-lg px-4 py-2 focus-within:ring-1 focus-within:ring-[#027027]">
        <Search className="w-4 h-4 text-gray-400 mr-2" />

        <input
          type="text"
          placeholder="Search for events"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full outline-none text-gray-700 text-sm"
        />
      </div>

      {/* Button */}
      <button
        onClick={handleSearch}
        className="
          bg-[#027027]
          text-white
          px-5 py-2
          rounded-lg
          font-medium
          text-sm
          hover:bg-[#01551d]
          transition-colors
          whitespace-nowrap
        "
      >
        Find Events
      </button>
    </div>
  );
};

export default EventSearch;