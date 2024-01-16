// src/App.tsx
import React, { useState, useRef, useEffect, KeyboardEvent } from "react";
import axios from "axios";
import "./styles.css";
import ChipDropdown from "./ChipDropdown";

interface Chip {
  id: number;
  label: string;
  iconUrl?: string;
}

const App: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [chips, setChips] = useState<Chip[]>([]);
  const [filteredItems, setFilteredItems] = useState<
    { label: string; email: string }[]
  >([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const items: string[] = [
    "Nick Giannopoulos",
    "John Doe",
    "Jane Doe",
    "Alice Johnson",
    "Bob Smith",
  ];

  const nameToEmail: { [key: string]: string } = {
    "Nick Giannopoulos": "nick@example.com",
    "John Doe": "john@example.com",
    "Jane Doe": "jane@example.com",
    "Alice Johnson": "alice@example.com",
    "Bob Smith": "bob@example.com",
  };

  const filterItems = (value: string) => {
    setFilteredItems(
      items
        .filter((item) => item.toLowerCase().includes(value.toLowerCase()))
        .map((label) => ({ label, email: nameToEmail[label] || "" })),
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    filterItems(value);
    setShowDropdown(value.trim().length > 0);
  };

  const handleChipClick = async (item: string) => {
    try {
      const response = await axios.get(
        `https://autocomplete.clearbit.com/v1/companies/suggest?query=${item}`,
      );
      const iconUrl = response.data[0]?.logo;
      const newChips = [...chips, { id: Date.now(), label: item, iconUrl }];
      setChips(newChips);
      setFilteredItems(
        filteredItems.filter((filteredItem) => filteredItem.label !== item),
      );
      setInputValue("");
      setShowDropdown(false);
    } catch (error) {
      console.error("Error fetching icon:", error);
    }
  };

  const handleChipRemove = (chipId: number) => {
    const removedChip = chips.find((chip) => chip.id === chipId);
    if (removedChip) {
      setChips(chips.filter((chip) => chip.id !== chipId));
      setFilteredItems([
        ...filteredItems,
        { label: removedChip.label, email: "" },
      ]);
    }
  };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && inputValue === "" && chips.length > 0) {
      const lastChip = chips[chips.length - 1];
      handleChipRemove(lastChip.id);
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [chips]);

  return (
    <div className="app">
      <div className="chips-container">
        {chips.map((chip) => (
          <div key={chip.id} className="chip">
            {chip.iconUrl && (
              <img
                src={chip.iconUrl}
                alt="Company Logo"
                className="chip-icon"
              />
            )}
            {chip.label}
            <button
              onClick={() => handleChipRemove(chip.id)}
              className="remove-button"
            >
              X
            </button>
          </div>
        ))}
      </div>
      <div className="dropdown-container">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          className="input-field"
          placeholder="Type here..."
        />
        {showDropdown && (
          <ChipDropdown items={filteredItems} onItemClick={handleChipClick} />
        )}
      </div>
    </div>
  );
};

export default App;
