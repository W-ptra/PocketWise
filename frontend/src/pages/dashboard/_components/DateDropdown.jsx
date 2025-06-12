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
          className="flex items-center gap-2 bg-[#F8F9FA] px-1 md:px-4 py-2 rounded-lg border-2 border-[#00AB6B] hover:bg-[#F2F2F2] transition-all duration-200 cursor-pointer group"
        >
          <span className="text-sm font-semibold text-[#787878] group-hover:text-[#00AB6B] transition-colors duration-200">
            {selected}
          </span>
          <ChevronDown className="w-4 h-4 text-[#00AB6B] transition-transform duration-200 group-hover:scale-110" />
        </Ariakit.MenuButton>

        <Ariakit.Menu 
          gutter={4} 
          className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border-2 border-[#00AB6B]/10 py-1 z-50"
        >
          {options.map((option) => (
            <Ariakit.MenuItem
              key={option.value}
              className={`w-full px-4 py-2.5 text-sm text-left cursor-pointer transition-all duration-200 ${
                selected === option.label
                  ? "text-[#00AB6B] font-semibold bg-[#00AB6B]/5"
                  : "text-[#787878] hover:bg-[#F8F9FA] hover:text-[#00AB6B]"
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
