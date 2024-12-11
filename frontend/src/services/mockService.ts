// MOCK CONNECTION TO API
// ALL METHODS HERE SHOULD BE SUBSTITUTED FOR FUNCTIONAL ONES

const mockService = {
    getUserLists: async (id: string) => {
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
        return lists;
    }
}

export default mockService;