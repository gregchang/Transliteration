import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toggleRomanization } from '../actions';

class RomanizationToggle extends Component {
  constructor(props) {
    super(props);
    this.isChecked = true;
  }
  
  componentDidMount() {
    this.props.toggleRomanization(this.isChecked);
  }

  onChange = (e) => {
    this.props.toggleRomanization(e.target.checked);
  }

  render() {
    return(
      <div className="ui toggle checkbox">
        <input type="checkbox" name="romanizationToggle" onChange={this.onChange} defaultChecked={this.isChecked} />
        <label>Include Pinyin romanization?</label>
        <br />
      </div>
    );
  }
}

export default connect(null, { toggleRomanization })(RomanizationToggle);