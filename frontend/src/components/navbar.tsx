import React from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { FaUser, FaHome } from 'react-icons/fa';

// Component parameters definition
interface NavBarProps {
  handleNavBarSelection: (tab: string) => void;
  tabSelected: string;
}

const NavBar: React.FC<NavBarProps> = ({ handleNavBarSelection, tabSelected }) => {
  // Updates the tab selected when the user clicks on a new tab
  const handleNavigation = (tab: string) => {
    handleNavBarSelection(tab);
  };

  // Tabs definition
  const buttons = [
    {
      name: 'timeline',
      icon: <FaHome size={32} className="mx-auto" />,
    },
    {
      name: 'profile',
      icon: <FaUser size={32} className="mx-auto" />,
    },
  ];

  return (
    <Sidebar
      collapsed={true}
      rootStyles={{
        height: '100vh',
        width: '8%',
        position: 'fixed'
      }}
    >
      <Menu>
        {buttons.map((button) => (
          <MenuItem
            key={button.name}
            icon={button.icon}
            active={tabSelected === button.name}
            onClick={() => handleNavigation(button.name)}
            rootStyles={{
              color: tabSelected === button.name ? 'var(--icon-selected)' : 'var(--icon-normal)',
              justifyContent: 'center',
              padding: '20px 0',
            }}
          >
          </MenuItem>
        ))}
      </Menu>
    </Sidebar>
  );
};

export default NavBar;

