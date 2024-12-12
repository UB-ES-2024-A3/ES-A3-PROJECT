// MOCK CONNECTION TO API
// ALL METHODS HERE SHOULD BE SUBSTITUTED FOR FUNCTIONAL ONES

const lists = [
    {
        id: 'list1',
        name: 'Fantasy and magic'
    },
    {
        id: 'list2',
        name: '3 a.m. reading'
    }
];

const listsWithBook = [
    {
        list_id: 'list1',
        name: 'Fantasy and magic',
        checked: true
    },
    {
        list_id: 'list2',
        name: '3 a.m. reading',
        checked: false
    }
];

const mockService = {
    getUserLists: async (id: string) => {
        return lists;
    },
    getListsWithBook: async (bookId: string) => {
        return listsWithBook;
    }
}

export default mockService;