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
const sdk = require('../../index');
const fetch = require('node-fetch');
const httpclient = require('../../lib/client/http-client');
const { DefaultOffersResourceNotFoundError, DefaultOffersRequestValidationError, DefaultOffersAuthenticationError, DefaultOffersAPIError } = require('../../lib/errors');

jest.mock('node-fetch');

beforeEach(() => {
    jest.clearAllMocks();
});

beforeAll(() => {
    sdk.configure({
        rootUrl: 'https://example.com',
        authentication: {
            bearerToken: '',
            clientKey: 'key',
            clientSecret: 'secret'
        },
        mutualAuth: {
            privateKey: 'privateKey',
            publicCert: 'publicCert'
        },
        httpProxy: {
            isEnabled: true,
            host: 'host',
            port: 'port'
        }
    });
});

test('should return json body', () => {
    const fetchJsonResponse = Promise.resolve({
        status: 200,
        headers: {
            get: (key) => {
                return ('application/json;charset=utf-8');
            }
        },
        json: () => {
            return {
                scope: 'default',
                status: 'approved',
                access_token: 'SGgKpuAG1DLMQPwYCG2AqZUPVdTL'
            };
        },
    });

    fetch.mockImplementation(() => fetchJsonResponse);
    httpclient.callService('/example', 'POST', {}, {}).then(function ( data) {
        expect(data).toHaveProperty('access_token');
        expect(data).toHaveProperty('status');
    }).catch((e) => {
        console.log(e)
    });
});

test('should throw Default Offers Resource Not Found Exception', () => {
    let response = Promise.resolve({
        status: 404,
        headers: {
            get: (key) => 'application/json'
        },
        json: () => {
            return {
                message: "error"
            }
        },
    });
    fetch.mockImplementation(() => response);
    expect(httpclient.callService('/example', 'POST', {},{}))
        .rejects.toThrow(new DefaultOffersResourceNotFoundError('{\"message\":\"error\"}'));
});

test('should throw Offer Request Validation Error', () => {
    let response = Promise.resolve({
        status: 400,
        headers: {
            get: (key) => 'text/html'
        },
        text: () => 'error',
    });
    fetch.mockImplementation(() => response);
    expect(httpclient.callService('/example', 'POST', {}, {}))
        .rejects.toThrow(new DefaultOffersRequestValidationError('error'));
});

test('should throw Default Offers Authentication Error', () => {
    let response = Promise.resolve({
        status: 401,
        headers: {
            get: (key) => 'text/html'
        },
        text: () => 'error',
    });
    fetch.mockImplementation(() => response);
    expect(httpclient.callService('/example', 'POST', {}, {}))
        .rejects.toThrow(new DefaultOffersAuthenticationError('error'));
});

test('should throw Default Offers API Generic Error', () => {
    let response = Promise.resolve({
        headers: {
            get: (key) => 'text/html'
        },
        text: () => 'error',
    });
    fetch.mockImplementation(() => response);
    expect(httpclient.callService('/example', 'POST', {}, {}))
        .rejects.toThrow(new DefaultOffersAPIError('error'));
});

test('should return true if no response body with http status code 200', () => {
    const fetchJsonResponse = Promise.resolve({
        status: 200,
        headers: {
            get: (key) => {
                return (0);
            }
        }
    });

    fetch.mockImplementation(() => fetchJsonResponse);
    httpclient.callService('/example', 'POST', {}, {}).then(function (data) {
        expect(data).toBe(true);
    }).catch((e) => {
        console.log(e)
    });
});

test('should throw Default Offers API Error in case of invalid response from API', () => {
    sdk.configure({
        rootUrl: 'https://example.com',
        authentication: {
            bearerToken: '',
            clientKey: 'key',
            clientSecret: 'secret'
        },
        httpProxy: {
            isEnabled: false,
            host: 'host',
            port: 'port'
        }
    })
    const fetchJsonResponse = Promise.resolve({
        headers: {
            get: (key) => {
                return (0);
            }
        }
    });

    fetch.mockImplementation(() => fetchJsonResponse);
    expect(httpclient.callService('/example', 'POST', {}, {}))
        .rejects.toThrow(new DefaultOffersAPIError('DefaultOffersAPIError: Invalid response from API'));
});