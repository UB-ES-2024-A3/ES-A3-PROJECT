import React from 'react';
import { Pen, ListMusic, ListPlus } from 'lucide-react'


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
        },
        {
        id: 'created-lists',
        label: 'CREATED LISTS',
        icon: <ListMusic className="w-4 h-4" />
        },
        {
        id: 'followed-lists',
        label: 'FOLLOWED LISTS',
        icon: <ListPlus className="w-4 h-4" />
        }
    ]
    
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      {tabs.map((tab) => (
        <button
          className={`navigation ${activeTab === tab.id ? 'active' : ''}`}
          key={tab.id}
          id={'profile-' + tab.id + '-tab'}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default ProfileNavBar;
