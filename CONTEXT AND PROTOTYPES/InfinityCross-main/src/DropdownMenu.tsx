import React, { useState } from "react";
import DropdownButton from "./DropdownButton.tsx";

const DropdownMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const toggleSubMenu = (submenu: string) => {
    setOpenSubMenu(openSubMenu === submenu ? null : submenu);
  };

  const menuItems = [
    {
      name: "Work",
      subItems: [
        {
          name: "The Breath of God into my Lungs",
          href: "https://example.com/project1",
        },
        { name: "Project 2", href: "https://example.com/project2" },
        { name: "Project 3", href: "https://example.com/project3" },
      ],
    },
    {
      name: "About",
      subItems: [
        { name: "Bio", href: "https://example.com/bio" },
        { name: "Skills", href: "https://example.com/skills" },
      ],
    },
    {
      name: "Contact",
      subItems: [
        { name: "Email", href: "mailto:example@example.com" },
        { name: "LinkedIn", href: "https://linkedin.com/in/example" },
      ],
    },
  ];

  return (
    <div className="dropdown-menu">
      <DropdownButton
        onClick={toggleDropdown}
        title="Joseph Gleasure"
        buttonType="main"
      />
      {isOpen && (
        <div className="dropdown-content">
          <ul>
            {menuItems.map((item) => (
              <li key={item.name}>
                <DropdownButton
                  onClick={() => toggleSubMenu(item.name)}
                  title={item.name}
                  buttonType="dropdown"
                />
                {openSubMenu === item.name && (
                  <ul className="sub-menu">
                    {item.subItems.map((subItem) => (
                      <li key={subItem.name}>
                        <a
                          href={subItem.href}
                          className="dropdown-button sub-menu-button"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          {subItem.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
