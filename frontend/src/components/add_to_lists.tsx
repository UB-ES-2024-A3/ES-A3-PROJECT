import { ChangeEvent, ChangeEventHandler, useEffect, useState } from 'react'

interface AddToListsButtonFields {
  lists: ListCheckboxProps[];
  callback: (updateChecks: UpdateListsInterface) => Promise<void>;
}

export interface ListCheckboxProps {
  list_id: string;
  name: string;
  checked: boolean;
}

export interface UpdateListsInterface {
  [id_list: string]: boolean;
}

const AddToListsButton: React.FC<AddToListsButtonFields> = ({lists, callback}) =>{
  const [isOpen, setIsOpen] = useState(false);
  const [listsCheckbox, setListsCheckbox] = useState<ListCheckboxProps[]>(lists);
  const [showError, setShowError] = useState(false);
  const [sending, setSending] = useState(false);
  let listCheckState: UpdateListsInterface = {};

  useEffect(() => {
    setListsCheckbox(lists);
    listCheckState = {};
    lists.forEach(list => {
      listCheckState[list.list_id] = list.checked;
    });
  }, [lists]);

  const  handleSubmit = async () => {
    setSending(true);
    await callback(listCheckState);
    setSending(false);
    setIsOpen(false);
  };
  
  const handleCancelUpdate = () => {
    setIsOpen(false);
  };

  const changeChecked: ChangeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
    listCheckState[e.target.id] = e.target.checked;
  }

  return (
    <div style={{ padding: '1rem' }}>
      <button id='add-to-lists-btn' onClick={() => setIsOpen(true)}>
        Add to my lists
      </button>

      {isOpen && (
        <div style={{ position: 'fixed', inset: '0', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',}}>
          <div id='add-to-lists-popup' style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', width: '100%', height: 'fit-content', maxWidth: '35%'}}>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ position: 'relative' }}>
              {listsCheckbox.length ? (listsCheckbox.map((list) => (
                <div key={list.list_id} className='list-checkbox'>
                  <input type="checkbox" name={list.list_id} id={list.list_id} defaultChecked={list.checked} onChange={changeChecked} />
                  <label htmlFor={list.list_id}>{list.name}</label>
                </div>
              ))) : (
                <p style={{ color: 'grey' }}>You have no lists yet</p>
              )}
              </div>
              {showError && (
                <p className="mt-1 text-sm text-red-500">{"There have been an error submiting the changes. Please try again later."}</p>
              )}

              <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  id='cancel-update-lists-btn'
                  onClick={handleCancelUpdate}
                  className='secondaryButton'
                >
                  Cancel
                </button>
                <button
                  id='update-lists-btn'
                  className={sending ? 'waiting' : ''}
                  disabled={sending}
                  onClick={handleSubmit}
                >
                  Accept
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AddToListsButton;