import axios from 'axios';

export default axios.create({
  baseURL: 'https://api.cognitive.microsofttranslator.com',
  headers: {
    'Ocp-Apim-Subscription-Key': 'INSERT_KEY',
    'Content-Type': 'application/json'
  }
});