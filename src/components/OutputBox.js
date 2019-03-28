import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';

import { UserAgentApplication } from 'msal';
import { getUserDetails, createNote } from '../apis/GraphService';
import config from '../apis/graphConfig';

import toastr from 'toastr';

class OutputBox extends React.Component {
  constructor(props) {
    super(props);

    this.userAgentApplication = new UserAgentApplication(config.appId, null, null);

    var user = this.userAgentApplication.getUser();

    this.state = {
      text: null,
      isAuthenticated: (user !== null),
      user: {},
      error: null
    };

    if (user) {
      // Populate user object with data from Graph
      this.getUserProfile();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      const { 
        transliteration,
        romanization,
        transliterationAndRomanization,
        romanizationEnabled
      } = this.props;

      let outputText;
      if (romanizationEnabled) {
        outputText = transliterationAndRomanization;
      }
      else {
        outputText = transliteration;
      }

      this.setState({ text: outputText });
      this.props.change('outputText', outputText);
    }
  }

  login = async () => {
    try {
      if (!this.state.isAuthenticated) {
        await this.userAgentApplication.loginPopup(config.scopes);
      }

      if (this.state.user === {}) {
        await this.getUserProfile();
      }

      await this.saveNote();
    }
    catch(err) {
      var errParts = err.split('|');
      this.setState({
        isAuthenticated: false,
        user: {},
        error: { message: errParts[1], debug: errParts[0] }
      });
    }
  }

  logout = () => {
    this.userAgentApplication.logout();
  }

  getUserProfile = async () => {
    try {
      // Get the access token silently
      // If the cache contains a non-expired token, this function
      // will just return the cached token. Otherwise, it will
      // make a request to the Azure OAuth endpoint to get a token
      var accessToken = await this.userAgentApplication.acquireTokenSilent(config.scopes);

      if (accessToken) {
        // Get the user's profile from Graph
        var user = await getUserDetails(accessToken);

        this.setState({
          isAuthenticated: true,
          user: {
            displayName: user.displayName,
            email: user.mail || user.userPrincipalName
          },
          error: null
        });
      }
    }
    catch(err) {
      this.handleGraphError(err);
    }
  }

  saveNote = async () => {
    try {
      var accessToken = await this.userAgentApplication.acquireTokenSilent(config.scopes);

      if (accessToken) {
        const content = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>New Note</title>
          </head>
          <body>
            <p>${this.state.text.replace(/\n/g, '<br />')}</p>
          </body>
        </html>`;
        var response = await createNote(accessToken, content);
        
        toastr.options = {
          "closeButton": false,
          "debug": false,
          "newestOnTop": false,
          "progressBar": false,
          "positionClass": "toast-top-right",
          "preventDuplicates": true,
          "showDuration": "300",
          "hideDuration": "1000",
          "timeOut": "3000",
          "extendedTimeOut": "1000",
          "showEasing": "swing",
          "hideEasing": "linear",
          "showMethod": "fadeIn",
          "hideMethod": "fadeOut",
          'onclick': () => {
            toastr.clear();
          }
        }
        if (response) {
          toastr.success('Saved!', 'Success').css("width","150px");
        }
        else {
          toastr.success('Save unsuccessful', 'Error');
        }

        this.setState({
          isAuthenticated: true,
          error: null
        });
      }
    }
    catch(err) {
      this.handleGraphError(err);
    }
  }

  handleGraphError = (err) => {
    var error = {};
      if (typeof(err) === 'string') {
        var errParts = err.split('|');
        error = errParts.length > 1 ?
          { message: errParts[1], debug: errParts[0] } :
          { message: err };
      } else {
        error = {
          message: err.message,
          debug: JSON.stringify(err)
        };
      }

      this.setState({
        isAuthenticated: false,
        user: {},
        error: error
      });
  }

  saveToOneNote = async () => {
    this.login();
  }

  showLogout = () => {
    if (!this.state.isAuthenticated) {
      return;
    }

    return(
      <button className='ui button' type='button' onClick={this.logout}>
        Logout
      </button>
    );
  }

  render() {
    const  { pristine } = this.props;
    const placeholder = `你住的 巷子里 我租了一间公寓
nǐ zhù de   xiàng zi lǐ   wǒ zū le yì jiān gōng yù
为了想与你不期而遇
wèi le xiǎng yǔ nǐ bù qī ér yù`;

    return(
      <div className='ui segment'>
        <h4 className='ui left aligned header'>Output Text</h4>
        <form className='ui form'>
          <div className='field'>
            <div>
              <Field
                name='outputText'
                component='textarea'
                placeholder={placeholder}
              />
            </div>
          </div>
          <div>
            <button
              className='ui button'
              type='button'
              disabled={pristine}
              onClick={() => {navigator.clipboard.writeText(this.props.transliteration)}}
            >
              Copy
            </button>
            <button
              className='ui button'
              type='button'
              disabled={pristine}
              onClick={this.saveToOneNote}
            >
              Save to OneNote
            </button>
            {this.showLogout()}
          </div>
        </form>
      </div>
    );
  };
};

const mapStateToProps = (state) => {
  return {
    transliteration: state.transliteration,
    romanization: state.romanization,
    transliterationAndRomanization: state.transliterationAndRomanization,
    romanizationEnabled: state.romanizationEnabled
  };
}

export default connect(mapStateToProps) (reduxForm({
    form: 'outputBox' // an unique identifier for this form
})(OutputBox));