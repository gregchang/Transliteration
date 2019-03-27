export default (state = null, action) => {
  switch (action.type) {
    case 'FETCH_TRANSLITERATION_AND_ROMANIZATION':
      return action.payload;
    default:
      return state;
  }
}
