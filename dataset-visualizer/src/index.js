// index.js o App.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';

ReactDOM.render(
    <Auth0Provider
        domain="dev-eebpi21tivkgj1ly.us.auth0.com"
        clientId="FaxxWmhr8bEXdN9RlxhEVZxIxwmqgy8R"
        redirectUri={window.location.origin}
    >
        <App />
    </Auth0Provider>,
    document.getElementById('root')
);
