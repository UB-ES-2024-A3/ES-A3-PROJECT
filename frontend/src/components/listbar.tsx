import React from 'react';

interface ListBarProps{
    id: string;
    name: string;
    handleOpenList: (id:string) => void;
}

const ListBar: React.FC<ListBarProps> = ({id, name, handleOpenList}) => {
    const handleClickList = () => {
        handleOpenList(id);
    };

    return (
        <button id={id} className="secondaryButton" onClick={handleClickList} style={{textAlign: 'left', borderBottom: '1px solid #ccc', width: '100%', minHeight: '64px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <div> 
                <div style={{ margin: 'auto 0' }}> {name} </div>
            </div>
        </button>
    );
};

export default ListBar;