import './InputBox.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { getWhitespace, fetchTransliteration, fetchTransliterationAndRomanization } from '../actions';
import CharacterTypeSelection from './CharacterTypeSelection';

class InputBox extends React.Component {
  componentDidMount() {
    ReactDOM.findDOMNode(this.textInput).focus();
  }

  onSubmit = (data) => {
    const rawText = data.inputText;

    if (!rawText) {
      return;
    }

    let text = '';
    let whitespace = [];
    let whitespaceChunk = '';
    let idx = -1;
    rawText.split('').forEach((letter, index) => {
      if (['\n', '\r', '\t', ' '].includes(letter)) {
        if (idx === -1) {
          idx = index;
        }
        whitespaceChunk += letter;
      }
      else {
        if (whitespaceChunk !== '') {
          whitespace.push({ index: idx, text: whitespaceChunk });
          whitespaceChunk = '';
          idx = -1;
        }
        text += letter;
      }
    });

    if (whitespaceChunk !== '') {
      whitespace.push({ index: idx, text: whitespaceChunk });
    }

    whitespace.forEach(e => {
      text = text.substring(0, e.index) + e.text + text.substring(e.index);
    });

    this.props.fetchTransliterationAndRomanization(data.inputText, this.props.selectedLanguage, whitespace);
  };

  render() {
    const { handleSubmit, pristine, reset, submitting } = this.props;

    return(
      <div className="ui segment">
        <h4 className="ui left aligned header">Input Text</h4>
        <form className="ui form">
          <CharacterTypeSelection parentName="input" />
          <div className="field">
            <div>
              <Field name="inputText" component="textarea" ref={(input) => this.textInput = input} />
            </div>
          </div>
          <div>
            <button className="ui primary button" type="submit" disabled={pristine || submitting} onClick={handleSubmit(data => this.onSubmit(data))}>
              Submit
            </button>
            <button className="ui button" type="button" disabled={pristine || submitting} onClick={reset}>
              Clear
            </button>
          </div>
        </form>
      </div>
    );
  };
};

const mapStateToProps = (state) => {
  return {
    selectedLanguage: state.selectedLanguage,
    transliteration: state.transliteration
  };
}

export default connect(mapStateToProps, { getWhitespace, fetchTransliteration, fetchTransliterationAndRomanization })(reduxForm({
    form: 'inputBox' // an unique identifier for this form
})(InputBox));