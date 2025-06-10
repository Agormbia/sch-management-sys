import Image from "next/image";
import React from "react";

interface TableSearchProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const TableSearch: React.FC<TableSearchProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="w-full md:w-auto flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
      <Image src="/search.png" alt="" width={14} height={14} />
      <input
        type="text"
        placeholder="Search..."
        className="w-[200px] p-2 bg-transparent outline-none"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default TableSearch;
