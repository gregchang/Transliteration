import _ from 'lodash';
import translator from '../apis/translator';

export const toggleRomanization = (isEnabled) => {
  return {
    type: 'ROMANIZATION_ENABLED',
    payload: isEnabled
  }
}

export const selectLanguage = (language, direction) => {
  const languageCodeData = {
    simplifiedChinese: 'zh-Hans',
    traditionalChinese: 'zh-Hant'
  }

  let payload = {};
  payload[direction] = languageCodeData[language];

  return {
    type: 'LANGUAGE_SELECTED',
    payload: payload
  }
};

export const fetchTransliterationAndRomanization = (text, selectedLanguage, whitespace) => async (dispatch, getState) => {
  await dispatch(fetchTransliteration(text, selectedLanguage));
  await dispatch(fetchTransliteration(text, {...selectedLanguage, ...{output: 'Latn'}}));

  const transliterationArray = getState().transliteration.split(/[\r\n]+/);
  const romanization = getState().romanization;

  let romanizationArray = romanization.split(' ');
  whitespace.forEach(e => {
    romanizationArray.splice(e.index, 0, e.text);
  });
  romanizationArray = romanizationArray.join(' ').split(/[\r\n]+/);

  let res = [];
  for (let i = 0; i < transliterationArray.length; i++) { 
    res.push(transliterationArray[i], '\n', romanizationArray[i], '\n');
  }
  res = res.join('');

  dispatch({type: 'FETCH_TRANSLITERATION_AND_ROMANIZATION', payload: res});

  return Promise.resolve();
};

export const fetchTransliteration = (text, selectedLanguage) => async (dispatch) => {
  const textData = [
    {text}
  ];

  const scriptCodeData = {
    'zh-Hans': 'Hans',
    'zh-Hant': 'Hant',
    'Latn': 'Latn'
  }

  let result;
  if (selectedLanguage.input === selectedLanguage.output) {
    result = text;
  }
  else {
    const response = await translator.post('/transliterate', textData, {
      params: {
        'api-version': '3.0',
        language: selectedLanguage.input,
        fromScript: scriptCodeData[selectedLanguage.input],
        toScript: scriptCodeData[selectedLanguage.output]
      }
    });
    result = response.data[0].text
  }

  const type = selectedLanguage.output === 'Latn' ? 'FETCH_ROMANIZATION' : 'FETCH_TRANSLITERATION';

  dispatch({type: type, payload: result});
}
