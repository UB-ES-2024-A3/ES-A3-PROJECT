import React, { useState } from 'react';
import { Bookmark, Grid, Tag } from 'lucide-react'
import ProfileReview from './profile_review';

interface ProfileProps{
    handleLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({handleLogout}) => {
    const [activeTab, setActiveTab] = useState('publications')

    const tabs = [
        {
        id: 'publications',
        label: 'PUBLICACIONES',
        icon: <Grid className="w-4 h-4" />
        },
        {
        id: 'saved',
        label: 'GUARDADAS',
        icon: <Bookmark className="w-4 h-4" />
        },
        {
        id: 'tagged',
        label: 'ETIQUETADAS',
        icon: <Tag className="w-4 h-4" />
        }
    ]
    
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{width: '65%'}}>
                <header style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ccc' }}>
                    <h1 style={{ fontSize: '1rem', fontWeight: '500' }}>username</h1>
                    <button onClick={handleLogout}>Logout</button>
                </header>
                <div style={{ width: '100%', borderTop: '1px solid #ddd' }}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        {tabs.map((tab) => (
                            <button
                                className='profileNavigation'
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
                                    ...(activeTab === tab.id
                                        ? {
                                            color: 'black',
                                            fontWeight: 'bold',
                                            borderTop: '2px solid black',
                                            marginTop: '-1px',
                                        }
                                        : { color: '#6b7280', ':hover': { color: '#1f2937' } }),
                                }}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
                <main style={{ flex: 1, padding: '16px' }}>
                    <div style={{ maxWidth: '640px', margin: '0 auto' }}>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '16px',
                                maxHeight: 'calc(100vh - 300px)',
                                overflowY: 'auto',
                                paddingRight: '16px',
                                scrollbarWidth: 'thin',
                                scrollbarColor: '#d1d5db #f3f4f6',
                            }}
                        >
                            {[1, 2, 3, 4, 5].map((review, index) => (
                                <ProfileReview key={index} />
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Profile;