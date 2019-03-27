var graph = require('@microsoft/microsoft-graph-client');

function getAuthenticatedClient(accessToken) {
  // Initialize Graph client
  const client = graph.Client.init({
    // Use the provided access token to authenticate requests
    authProvider: (done) => {
      done(null, accessToken);
    }
  });

  return client;
}

export async function createNote(accessToken, content) {
  const client = getAuthenticatedClient(accessToken);

  const response = await client
    .api('/me/onenote/pages')
    .header('Content-Type', 'text/html')
    .post(content);
  return response;
}

export async function getUserDetails(accessToken) {
  const client = getAuthenticatedClient(accessToken);

  const user = await client.api('/me').get();
  return user;
}
