export default (state = [], action) => {
  switch (action.type) {
    case 'GET_WHITESPACE':
      return action.payload;
    default:
      return state;
  }
};
