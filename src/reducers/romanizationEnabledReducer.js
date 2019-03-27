export default (state = [], action) => {
  switch (action.type) {
    case 'ROMANIZATION_ENABLED':
      return action.payload;
    default:
      return state;
  }
};
