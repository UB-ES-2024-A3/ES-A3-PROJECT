import React from 'react';

interface ListBarProps{
    id: string;
    name: string;
    username?: string;
    handleOpenList: (id:string, name:string, ownLists: boolean) => void;
    ownLists: boolean;
}

const ListBar: React.FC<ListBarProps> = ({id, name, username, handleOpenList, ownLists}) => {
    const handleClickList = () => {
        handleOpenList(id, name, ownLists);
    };

    return (
        <button id={id} className="secondaryButton" onClick={handleClickList} style={{textAlign: 'left', borderBottom: '1px solid #ccc', width: '100%', minHeight: '64px', display: 'flow', justifyContent: 'space-between'}}>
            <div> 
                <div style={{ margin: 'auto 0' }}> {username? name + " | " + username: name} </div>
            </div>
        </button>
    );
};

export default ListBar;