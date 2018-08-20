const initialState = {
  isAuthenticated: false,
  user: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        id: action.id
      };
    default:
      return state;
  }
};
