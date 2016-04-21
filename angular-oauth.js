(function () {
	'use strict';

	angular
		.module('mm.oauth', [])
		.provider('oAuthService', oAuthProvider);

	function oAuthProvider() {
		var config,
			requiredConfigFields = ['baseUrl', 'clientId', 'clientSecret'],
			defaultConfigFields = {
				baseUrl: null,
				clientId: null,
				clientSecret: null,
				grantPath: '/oauth/v2/token',
				storageKey: 'OAuth-data'
			};

		this.configure = function (params) {
			// Check if the config parameters is an object
			if (!(params instanceof Object)) {
				throw Error('Invalid argument: `config` must be an `object`.');
			}

			// Check if the required config fields are set
			angular.forEach(requiredConfigFields, function (field) {
				if (!params[field]) {
					throw Error('Missing parameter: ' + field);
				}
			});

			// Set the config fields
			config = angular.extend({}, defaultConfigFields, params);

			config.baseUrl = config.baseUrl.replace(/\/$/, '');

			return config;
		};

        this.$inject = ['$q', '$http'];
		this.$get = function ($q, $http) {
			return new Oauth($q, $http, config);
		};
	}

	var Oauth = function ($q, $http, config) {
		return {
			isAuthenticated: isAuthenticated,
			generateAccessToken: generateAccessToken,
			refreshAccessToken: refreshAccessToken,
			getOAuthData: getOAuthData,
			removeAccessToken: removeAccessToken
		};

		/**
		 * Requests a new access token using a username and password
		 * @param {string} username
		 * @param {string} password
		 * @returns {promise}
		 */
		function generateAccessToken(username, password) {
			var data = {
				username: username,
				password: password,
				grant_type: 'password',
				client_id: config.clientId,
				client_secret: config.clientSecret
			};

			return $http.post(config.baseUrl + config.grantPath, data)
				.then(function (response) {
					return storeOAuthData(response.data);
				});
		}

		/**
		 * Request a new access token using the stored refresh token
		 * @returns {promise}
		 */
		function refreshAccessToken() {
			var oAuthData = getOAuthData();

			if (!oAuthData || !oAuthData.refresh_token) {
				return $q.reject();
			}

			var	data = {
				refresh_token: getOAuthData().refresh_token,
				grant_type: 'refresh_token',
				client_id: config.clientId,
				client_secret: config.clientSecret
			};

			return $http.post(config.baseUrl + config.grantPath, data)
				.then(function (response) {
					return storeOAuthData(response.data);
				});
		}

		function isAuthenticated() {
			var oAuthData = getOAuthData();

			return oAuthData && oAuthData.access_token;
		}

		function storeOAuthData(data) {
			data.createdAt = Date.now();

			localStorage.setItem(config.storageKey, JSON.stringify(data));

			return data;
		}

		function getOAuthData() {
			var jsonData = localStorage.getItem(config.storageKey);

			try {
				return JSON.parse(jsonData);
			} catch(error) {
				return {};
			}
		}

		/**
		 * Removes access token
		 */
		function removeAccessToken(){
			localStorage.removeItem(config.storageKey);
		}
	}
})();
