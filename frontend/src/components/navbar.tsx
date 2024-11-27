import React from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { FaUser } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Image from 'next/image';

// Component parameters definition
interface NavBarProps {
  children: React.ReactNode
}

const NavBar: React.FC<NavBarProps> = ({ children }) => {
  const router = useRouter();
  const [tabSelected, setTabSelected] = useState("profile");

  // Updates the tab selected when the user clicks on a new tab
  const handleNavigation = (tab: string) => {
    router.push("/" + tab);
  };

  // Tabs definition
  const buttons = [
    {
      name: 'timeline',
      icon: <Image src='/rebook_logo_without_name.png' alt='Timeline' width={50} height={50} />,
    },
    {
      name: 'profile',
      icon: <FaUser size={32} className="mx-auto" />,
    },
  ];

  useEffect(() => {
    const currentPath = router.pathname;
    if (currentPath.startsWith("/timeline")) {
      setTabSelected('timeline');
    } else if (currentPath.startsWith("/profile")) {
      setTabSelected('profile');
    }
  }, [router.pathname]);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{width: '8%'}}>
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
    </div>
    <div style = {{width: '100%'}}>{children}</div>
    </div>
  )
};

export default NavBar;

