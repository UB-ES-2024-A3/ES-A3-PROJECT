import React from 'react';

interface UserBarProps{
    id: string;
    username: string;
}

const UserBar: React.FC<UserBarProps> = ({id, username}) => {

    return (
        <button id={id} className="secondaryButton"  style={{textAlign: 'left', borderBottom: '1px solid #ccc', width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
            <div style = {{display: 'flex', flexDirection: 'column'}}> 
                <div> {username} </div>
            </div>
        </button>
    );
};

export default UserBar;