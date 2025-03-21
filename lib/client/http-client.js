
/*
 * Copyright 2020 American Express Travel Related Services Company, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 */



"use strict";
const fetch = require('node-fetch');
const HttpsProxyAgent = require('https-proxy-agent');
const https = require('https');
const { DefaultOffersAPIError, DefaultOffersResourceNotFoundError,
    DefaultOffersRequestValidationError, DefaultOffersAuthenticationError } = require('../errors');
const config = require('../config');
const utils = require('../utils');


/**
 * Call HTTP Service and return parsed response body.
 * @param {String} path - mandatory - complete url path 
 * @param {String} method - mandatory - http method 
 * @param {Object} headers - optional - header object for http request
 * @param {Object} body - optional - request body for http
 */
async function callService(path, method, headers, body) {

    const url = config.rootUrl.startsWith('https') ? `${config.rootUrl}${path}` : `https://${config.rootUrl}${path}`;
    let httpResponse = {};
    let httpsAgent = new https.Agent({
        key: config.mutualAuth.privateKey,
        cert: config.mutualAuth.publicCert
    });

    if (config.httpProxy.isEnabled) {
        const proxy = `${config.httpProxy.host}:${config.httpProxy.port}`;
        const proxyAgent = new HttpsProxyAgent(proxy);
        httpsAgent = Object.assign(proxyAgent, httpsAgent);
    }

    const options = {
        method,
        agent: httpsAgent,
        headers,
        body: body
    }
    return fetch(url, options).then(result => {
        httpResponse = result;
        const contentType = result.headers.get('content-type');
        switch (contentType) {
            case 'application/json;charset=utf-8':
            case 'application/json': {
                return result.json();
            }
            case 'text/html': {
                return result.text();
            }
            default: {
                if (result.status >= 200 && result.status < 300 && result.headers.get('content-length') <= 0) {
                    return true;
                }
                throw new DefaultOffersAPIError('Invalid response from API');
            }
        }
    }).catch(e => {
        throw new DefaultOffersAPIError(e);
    }).then(body => {
        return handleHttpStatusCodes(body, httpResponse);
    });
}

/**
 * handle the responses based on the status codes 
 *  
 * @param {Object} responseBody 
 * @param {Object} httpResponse 
 */
function handleHttpStatusCodes(responseBody, httpResponse) {
    const message = typeof responseBody === 'object' ? JSON.stringify(responseBody) : responseBody;
    const status = httpResponse.status;
    switch (true) {
        case status >= 200 && status < 300: {
            return responseBody;
        }
        case status === 404: {
            throw new DefaultOffersResourceNotFoundError(message);
        }
        case status === 400: {
            throw new DefaultOffersRequestValidationError(message);
        }
        case status === 401: {
            throw new DefaultOffersAuthenticationError(message);
        }
        default: {
            throw new DefaultOffersAPIError(message);
        }
    }
}

module.exports = {
    callService
}