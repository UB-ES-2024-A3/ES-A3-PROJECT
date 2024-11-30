import React from 'react';


interface ListSearchNavBarProps {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const ListSearchNavBar: React.FC<ListSearchNavBarProps> = ({ activeTab, setActiveTab }) => {
    const tabs = [
        {
        id: 'books',
        label: 'BOOKS',
        },
        {
        id: 'users',
        label: 'USERS',
        }
    ]
    
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      {tabs.map((tab) => (
        <button
            className={`navigation ${activeTab === tab.id ? 'active' : ''}`}
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default ListSearchNavBar;