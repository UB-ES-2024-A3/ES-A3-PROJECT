import React from 'react';
import { Pen } from 'lucide-react'


interface ProfileNavBarProps {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const ProfileNavBar: React.FC<ProfileNavBarProps> = ({ activeTab, setActiveTab }) => {
    const tabs = [
        {
        id: 'reviews',
        label: 'REVIEWS',
        icon: <Pen className="w-4 h-4" />
        }
    ]
    
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      {tabs.map((tab) => (
        <button
          className="profileNavigation"
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '16px 48px',
            fontSize: '12px',
            letterSpacing: '1px',
            transition: 'all 0.3s ease',
            borderRadius: '0',
            ...(activeTab === tab.id
              ? {
                  color: 'black',
                  fontWeight: 'bold',
                  borderTop: '2px solid black',
                  marginTop: '-1px',
                }
              : { color: 'gray', ':hover': { color: 'black' } }),
          }}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default ProfileNavBar;
