
import { useState } from 'react'
import ListService from '@/services/listService';

const CreateListButton = () =>{
  const [isOpen, setIsOpen] = useState(false);
  const [listName, setListName] = useState("");
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const maxChars = 50;

  const  handleSubmit = async () => {
    if (listName.trim() == ""){
        setErrorMessage("The list name cannot be empty");
        setShowError(true); 
    }
    else {
      ListService.createListRequest(listName.trim())
      .then(results => {
        handleCancel();
      })
      .catch(errorMsg => {
        const message = errorMsg.split(": ")[1];
        setErrorMessage(message);
        setShowError(true); 
      });
    }  
  }
  
  const handleCancel = () => {
    setIsOpen(false);
    setListName('');
    setShowError(false);
  }

  return (
    <div style={{ padding: '1rem' }}>
      <button id='create-list-btn' onClick={() => setIsOpen(true)}>
        Create List
      </button>

      {isOpen && (
        <div style={{ position: 'fixed', inset: '0', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',}}>
          <div id='create-list-popup' style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', width: '100%', height: 'fit-content', maxWidth: '30%'}}>
            <div style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.75rem' }}>
                List name
              </h2>
              <div style={{ position: 'relative' }}>
                <textarea
                  value={listName}
                  onChange={(e) => {
                    if (e.target.value.length <= maxChars) {
                      setListName(e.target.value)
                    }
                  }}
                  placeholder="Write your list name..."
                  style={{resize: 'none',
                    width: '100%',
                    padding: '0.5rem 2.5rem 0.5rem 0.75rem',
                    border: `1px solid ${showError ? '#f56565' : '#d1d5db'}`,
                    borderRadius: '0.375rem', 
                    outline: 'none',
                    transition: 'color 0.2s ease, border-color 0.2s ease',
                    boxShadow: showError
                      ? '0 0 0 2px #f56565' 
                      : '0 0 0 2px #3b82f6', 
                    }}
                  maxLength={maxChars}
                />
              </div>
              {showError && (
                <p className="mt-1 text-sm text-red-500">{errorMessage}</p>
              )}

              <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  id='cancel-btn'
                  onClick={handleCancel}
                  className='secondaryButton'
                >
                  Cancel
                </button>
                <button
                  id='post-list-btn'
                  onClick={handleSubmit}
                >
                  Create List
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CreateListButton;