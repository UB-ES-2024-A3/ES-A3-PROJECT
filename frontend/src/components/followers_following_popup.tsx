
import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import FollowersService from '@/services/followersService';
import { useTimelineContext } from '@/contexts/TimelineContext';
import { useRouter } from 'next/router';

interface FollowersFollowingPopupFields {
    amount: number | null;
    _tabSelected: string;
    userId: string | null;
}

interface User {
    user_id: string;
    username: string;
}

const FollowersFollowingPopup: React.FC<FollowersFollowingPopupFields> = ({amount, _tabSelected, userId}) =>{
  const [isOpen, setIsOpen] = useState(false)
  const [tabSelected, setTabSelected] = useState("")
  const [followers, setFollowers] = useState<User[]>([])
  const [following, setFollowing] = useState<User[]>([])
  const {setTimelineState} = useTimelineContext();
  const router = useRouter();

  useEffect(() => {
    setTabSelected(_tabSelected);
    if (userId) {
      FollowersService.getFollowersFollowing(userId)
      .then(response => {
        console.log(response)
        setFollowers(response.followers);
        setFollowing(response.following);
      })
      .catch(except => {
          console.log(except);
      });
    }
    }, [userId]);

    const handleClickUsername = (user_id: string) => {
      setTimelineState({page: 'user', data: user_id});
      router.push("/timeline/user/" + user_id);
    }

  return (
    <div>
      <div id={_tabSelected + '-btn'} onClick={() => setIsOpen(true)} style={{display: 'flex', gap: '10px', cursor: 'pointer'}}>
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
                height: "25rem",
                maxHeight: "25rem",
                overflowY: "scroll"
              }}>
                <div style={{
                  padding: "1rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                  alignItems: "center"
                }}>
                  {(tabSelected === 'Followers' ? followers : following).length > 0 ? (
                    (tabSelected === 'Followers' ? followers : following).map((user, index) => (
                      <button
                        key={index}
                        style={{
                          backgroundColor: "white",
                          color: "var(--primary-green)",
                          width: "100%",
                          padding: "0.75rem",
                          textAlign: "left",
                          borderRadius: "0.5rem",
                          border: "1px solid var(--primary-beige)",
                        }}
                        onClick={() => handleClickUsername(user.user_id)}
                      >
                        {user.username}
                      </button>
                    ))
                  ) : (
                    <p>{tabSelected === 'Followers' ? 'No users follow you yet' : "You don't follow any users yet"}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
      )}
    </div>
  )
}

export default FollowersFollowingPopup;