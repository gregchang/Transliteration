export default (state = null, action) => {
  switch (action.type) {
    case 'FETCH_TRANSLITERATION':
      return action.payload;
    default:
      return state;
  }
}
