# angular-oauth
Angular OAuth is an OAuth library for [AngularJS](http://angularjs.org).

## Get Started
**1.** Get Angular OAuth in one of the following ways:
    - clone this repository
    - via **[Bower](http://bower.io/)**: by running `$ bower install angular-oauth` from your console
    
**2.** Include `angular-oauth.js` in your `index.html`, after Angular itself

**3.** Add `'mm.oauth'` to your main module's list of dependencies

## Usage
**1.** Configuration
```javascript
(function(){
    'use strict';
    
    angular
        .module('yourModule')
        .config(config);
        
        config.$inject = ['oAuthServiceProvider'];
        function config(){
            oAuthServiceProvider.configure({
                baseUrl: 'http://api.your-website.com',
                clientId: 'CLIENT_ID',
                clientSecret: 'CLIENT_SECRET',
                grantPath: '/oauth/v2/token',       //OPTIONAL
                storageKey: 'OAuth-data'            //OPTIONAL
            });
        }
})();
```

**2.** Generating the access token
```javascript
     /**
     * Requests a new access token using a username and password
     * @param {string} username
     * @param {string} password
     * @returns {promise}
     */
    oAuthService.generateAccessToken(username, password);
```

**3.** Refreshing the access token
```javascript
    /**
     * Request a new access token using the stored refresh token
     * @returns {promise}
     */
     oAuthService.refreshAccessToken();
```

**4.** Removing the access token
```javascript
    /**
     * Removes OAuthData from local storage
     */
    oAuthService.removeAccessToken();
```

**5.** Getting OAuthData from local storage
```javascript
    /**
     * Retrieves OAuthData
     */
    oAuthService.getOAuthData();
```