import React from "react";

interface DropdownButtonProps {
  onClick: () => void;
  title: string;
  buttonType: 'main' | 'dropdown' | 'submenu';
}

const DropdownButton: React.FC<DropdownButtonProps> = ({
  onClick,
  title,
  buttonType
}) => {
  const getButtonClass = () => {
    switch (buttonType) {
      case 'main':
        return 'main-menu-button';
      case 'dropdown':
        return 'dropdown-menu-button';
      case 'submenu':
        return 'sub-menu-button';
      default:
        return '';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`dropdown-button ${getButtonClass()}`}
    >
      {title}
    </button>
  );
};

export default DropdownButton;
