import * as Ariakit from "@ariakit/react";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function DateDropdown({ onSelect }) {
  const [selected, setSelected] = useState("Today");
  const menu = Ariakit.useMenuStore();

  const options = [
    { label: "Today", value: "today" },
    { label: "Last Week", value: "last_week" },
    { label: "Last Month", value: "last_month" },
    { label: "1 Year", value: "1_year" },
    { label: "All Time", value: "all_time" },
  ];

  const handleSelect = (option) => {
    setSelected(option.label);
    onSelect?.(option.value);
    menu.hide();
  };

  return (
    <div className="relative">
      <Ariakit.MenuProvider>
        <Ariakit.MenuButton 
          className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
        >
          <span className="text-sm font-medium text-gray-700">
            {selected}
          </span>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </Ariakit.MenuButton>

        <Ariakit.Menu gutter={4} className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 cursor-pointer">
          {options.map((option) => (
            <Ariakit.MenuItem
              key={option.value}
              className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-50 transition-colors duration-200 ${
                selected === option.label
                  ? "text-[#00AB6B] font-medium"
                  : "text-gray-700"
              }`}
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </Ariakit.MenuItem>
          ))}
        </Ariakit.Menu>
      </Ariakit.MenuProvider>
    </div>
  );
}
