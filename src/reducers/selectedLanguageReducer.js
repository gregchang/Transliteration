export default (state = {}, action) => {
  switch (action.type) {
    case 'LANGUAGE_SELECTED':
      return {...state, ...action.payload};
    default:
      return state;
  }
};