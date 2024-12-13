
import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

interface FollowersFollowingPopupFields {
    amount: number | null;
    _tabSelected: string;
}

interface User {
    userId: string;
    username: string;
}

const FollowersFollowingPopup: React.FC<FollowersFollowingPopupFields> = ({amount, _tabSelected}) =>{
  const [isOpen, setIsOpen] = useState(false)
  const [tabSelected, setTabSelected] = useState("")
  const [followers, setFollowers] = useState<User[]>([])
  const [following, setFollowing] = useState<User[]>([])

  useEffect(() => {
    setTabSelected(_tabSelected);
    const _followers = [{username: "Fanny", userId: "1234"}, {username: "Blai", userId: "1334"}, {username: "Alba", userId: "1434"}, {username: "Fanny", userId: "1234"}, {username: "Blai", userId: "1334"}, {username: "Alba", userId: "1434"}, {username: "Fanny", userId: "1234"}, {username: "Blai", userId: "1334"}, {username: "Alba", userId: "1434"}, {username: "Fanny", userId: "1234"}, {username: "Blai", userId: "1334"}, {username: "Alba", userId: "1434"}, {username: "Fanny", userId: "1234"}, {username: "Blai", userId: "1334"}, {username: "Alba", userId: "1434"}]
    const _following = [{username: "Laura", userId: "1224"}, {username: "David", userId: "1314"}, {username: "Joaquin", userId: "1424"}]
    setFollowers(_followers);
    setFollowing(_following);
    }, []);

  return (
    <div>
      <div id='followers-btn' onClick={() => setIsOpen(true)} style={{display: 'flex', gap: '10px', cursor: 'pointer'}}>
        <span style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>{amount}</span>
        <span style={{ fontSize: '0.85rem', color: '#6b7280', marginRight: '10px'}}>{tabSelected}</span>
      </div>

      {isOpen && (
        <div style={{
            position: "fixed",
            inset: "0",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem"
          }}>
            <div style={{
              backgroundColor: "var(--primary-beige)",
              borderRadius: "0.5rem",
              width: "100%",
              maxWidth: "28rem",
              boxShadow: "0 10px 15px rgba(0, 0, 0, 0.1)"
            }}>
              <div style={{
                borderBottom: "1px solid var(--primary-beige)"
              }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "1rem"
                }}>
                  <div style={{
                    display: "flex",
                    gap: "1rem"
                  }}>
                    <button
                      onClick={() => setTabSelected('Followers')}
                      style={{
                        padding: "0.5rem 1rem",
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        borderRadius: "0.375rem",
                        transition: "background-color 0.2s, color 0.2s",
                        backgroundColor: "transparent",
                        color: tabSelected === 'Followers' ? "var(--primary-green)" : "black",
                      }}
                    >
                      Followers
                    </button>
                    <button
                      onClick={() => setTabSelected('Following')}
                      style={{
                        padding: "0.5rem 1rem",
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        borderRadius: "0.375rem",
                        transition: "background-color 0.2s, color 0.2s",
                        backgroundColor: "transparent",
                        color: tabSelected === 'Following' ? "var(--primary-green)" : "black",
                      }}
                    >
                      Following
                    </button>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    style={{
                      padding: "0.5rem",
                      borderRadius: "50%",
                      transition: "background-color 0.2s",
                      backgroundColor: "var(--primary-beige)"
                    }}
                  >
                    <X style={{ width: "1.25rem", height: "1.25rem", color: "black", backgroundColor: "var(--primary-beige)"}} />
                  </button>
                </div>
              </div>
          
              <div style={{
                height: "400px",
                maxHeight: "400px",
                overflowY: "scroll"
              }}>
                <div style={{
                  padding: "1rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem"
                }}>
                  {(tabSelected === 'Followers' ? followers : following).map((user, index) => (
                    <button
                      key={index}
                      style={{
                        backgroundColor: "white",
                        color: "black",
                        width: "100%",
                        padding: "0.75rem",
                        textAlign: "left",
                        borderRadius: "0.5rem",
                        border: "1px solid var(--primary-beige)",
                    
                      }}
                    >
                      {user.username}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
      )}
    </div>
  )
}

export default FollowersFollowingPopup;