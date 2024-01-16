// src/ChipDropdown.tsx
import React from "react";
import "./ChipDropdown.css";

interface ChipDropdownProps {
  items: { label: string; email: string }[];
  onItemClick: (item: string) => void;
}

const ChipDropdown: React.FC<ChipDropdownProps> = ({ items, onItemClick }) => {
  return (
    <div className="chip-dropdown">
      {items.map((item) => (
        <div
          key={item.label}
          className="chip-dropdown-item"
          onClick={() => onItemClick(item.label)}
        >
          <span className="dropdown-name">{item.label}</span>
          <span className="dropdown-email">{item.email}</span>
        </div>
      ))}
    </div>
  );
};

export default ChipDropdown;
