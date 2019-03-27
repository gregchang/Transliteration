import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import transliterationReducer from './transliterationReducer';
import romanizationReducer from './romanizationReducer';
import transliterationAndRomanizationReducer from'./transliterationAndRomanizationReducer';
import whitespaceReducer from './whitespaceReducer';
import selectedLanguageReducer from './selectedLanguageReducer';
import romanizationEnabledReducer from './romanizationEnabledReducer';

export default combineReducers({
  form: formReducer,
  transliteration: transliterationReducer,
  romanization: romanizationReducer,
  transliterationAndRomanization: transliterationAndRomanizationReducer,
  whitespace: whitespaceReducer,
  selectedLanguage: selectedLanguageReducer,
  romanizationEnabled: romanizationEnabledReducer
});
