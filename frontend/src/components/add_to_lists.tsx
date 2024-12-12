import { useEffect, useState } from 'react'

interface AddToListsButtonFields {
  lists: ListCheckboxProps[];
  callback: () => void;
}

export interface ListCheckboxProps {
  list_id: string;
  name: string;
  checked: boolean;
}

const AddToListsButton: React.FC<AddToListsButtonFields> = ({lists, callback}) =>{
  const [isOpen, setIsOpen] = useState(false);
  const [listsCheckbox, setListsCheckbox] = useState<ListCheckboxProps[]>(lists);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    setListsCheckbox(lists);
  }, [lists]);

  const sendReviewRequest = async () => {
    // return ReviewService.createReviewRequest(
    //   bookId
    // )
    // .then(result => {
    //   callback();
    //   return true;
    // })
    // .catch(errorMsg => {
    //   console.log(errorMsg);
    //   return false;
    // });
  };

  const  handleSubmit = async () => {
    // const success = await sendReviewRequest();
    // if (success === true) {
    //   setIsOpen(false);
    // }
    // else {
    //   setShowError(true);
    // }
    
  };
  
  const handleCancelReview = () => {
    setIsOpen(false);
  };

  return (
    <div style={{ padding: '1rem' }}>
      <button id='add-review-btn' onClick={() => setIsOpen(true)}>
        Add to my lists
      </button>

      {isOpen && (
        <div style={{ position: 'fixed', inset: '0', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',}}>
          <div id='add-to_lists-popup' style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', width: '100%', height: 'fit-content', maxWidth: '35%'}}>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ position: 'relative' }}>
              {listsCheckbox.length ? (listsCheckbox.map((list) => (
                <div key={list.list_id}>
                  <input type="checkbox" name={list.list_id} id={list.list_id} defaultChecked={list.checked} />
                  <label htmlFor={list.list_id}>{list.name}</label>
                </div>
              ))) : (
                <p style={{ color: 'grey' }}>You have no lists yet</p>
              )}
              </div>
              {showError && (
                <p className="mt-1 text-sm text-red-500">{"There have been an error submiting your review. Please try again later."}</p>
              )}

              <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  id='cancel-update-lists-btn'
                  onClick={handleCancelReview}
                  className='secondaryButton'
                >
                  Cancel
                </button>
                <button
                  id='update-lists-btn'
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