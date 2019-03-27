import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { selectLanguage } from '../actions';

class CharacterTypeSelection extends Component {
  constructor(props) {
    super(props);

    this.characterType = `${this.props.parentName}CharacterType`;
  }

  componentDidMount() {
    const initialValue = this.props.parentName === 'input' ? 'traditionalChinese' : 'simplifiedChinese'
    this.props.change(this.characterType, initialValue);
    this.onChange(initialValue);
  }

  onChange = (val) => {
     this.props.selectLanguage(val, this.props.parentName);
  }

  render() {
    return(
      <div className="inline fields">
        <label htmlFor={this.characterType}>Chinese character type:</label>
        <div className="field">
          <div className="ui radio">
            <label>
              <Field name={this.characterType} component="input" type="radio" value="simplifiedChinese" onChange={e => this.onChange(e.target.value)} />
              &nbsp;&nbsp;Simplified
            </label>
          </div>
        </div>
        <div className="field">
          <div className="ui radio">
            <label>
              <Field name={this.characterType} component="input" type="radio" value="traditionalChinese" onChange={e => this.onChange(e.target.value)} />
              &nbsp;&nbsp;Traditional
            </label>
          </div>
        </div>
      </div>
    );
  };
};

export default connect(null, { selectLanguage })(reduxForm({
  form: 'characterSelectionType'
})(CharacterTypeSelection));