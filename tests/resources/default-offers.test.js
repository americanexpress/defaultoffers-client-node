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
const httpclient = require('../../lib/client/http-client');
const { DefaultOffersRequestValidationError } = require('../../lib/errors');

jest.mock('../../lib/client/http-client');
jest.mock('node-jose');

beforeAll(() => {
    sdk.configure({
        rootUrl: 'example.com',
        authentication: {
            bearerToken: 'bearer_token_value',
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

beforeEach(() => {
    jest.clearAllMocks();
});

test('can instantiate sdk with configs', () => {
    expect(typeof (sdk)).toBe('object');
    expect(sdk).toHaveProperty('authentication');
    expect(sdk).toHaveProperty('defaultOffersService');
});

const headerParams = {
    message_type_id: 5101,
    country_code: "US",
    request_id: 'uuid_request_id',
    client_id: 'ASDFSD334235DDD'
};

const response = {
    "offers": [
        {
            "acquisition_offer_id": "ABCD12345",
            "product_name": "Example American Express Card",
            "product_type": "LENDING",
            "rewards": [
                {
                    "currency": "USD",
                    "value": 100
                }
            ],
            "urls": [
                {
                    "name": "APPLY_URL",
                    "value": "example.com"
                },
                {
                    "name": "TERMS_AND_CONDITIONS_URL",
                    "value": "example.com"
                },
                {
                    "name": "OFFER_TERMS_URL",
                    "value": "example.com"
                },
                {
                    "name": "BENEFITS_TERMS_URL",
                    "value": "example.com"
                },
                {
                    "name": "CARD_ART_URL",
                    "value": "example.com"
                }
            ],
            "fees": [
                {
                    "name": "INTRODUCTORY_ANNUAL_FEE",
                    "type": "FIXED",
                    "value": "$0",
                    "currency": "USD",
                    "display_text": "Marketing Introductory fee text"
                },
                {
                    "name": "ANNUAL_FEE",
                    "type": "FIXED",
                    "value": "$0",
                    "currency": "USD",
                    "display_text": "Marketing Annual fee text"
                }
            ],
            "content_groups": [
                {
                    "name": "MARKETING_OFFER_TEXT",
                    "contents": [
                        {
                            "sequence_order": 1,
                            "title": "Special Offer",
                            "display_text": [
                                {
                                    "text": "Marketing Offer Text"
                                }
                            ]
                        }
                    ]
                },
                {
                    "name": "BENEFITS_TEXT",
                    "contents": [
                        {
                            "sequence_order": 2,
                            "display_text": [
                                {
                                    "text": "Marketing Benefits messages"
                                }
                            ]
                        }
                    ]
                },
                {
                    "name": "ANNUAL_FEE_TEXT",
                    "contents": [
                        {
                            "sequence_order": 3,
                            "title": "ANNUAL FEE",
                            "display_text": [
                                {
                                    "text": "Marketing Annual Fee message"
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ],
    "refresh_interval": "14400000"
}

test('should return a default offer', () => {
    httpclient.callService.mockReturnValueOnce(Promise.resolve(response));
    return sdk.defaultOffersService.getDefaultOffers("example_eep", headerParams).then(resp => {
        expect(resp).toBe(response);
        expect(httpclient.callService).toHaveBeenCalledTimes(1);
        expect(httpclient.callService.mock.calls[0][0]).toBe('/acquisition/digital/v1/offers/cards/default_offers?eep=example_eep');
        expect(httpclient.callService.mock.calls[0][1]).toBe('GET');
        const headers = httpclient.callService.mock.calls[0][2];
        expect(headers['X-AMEX-API-KEY']).toBe('key');
        expect(headers['Authorization']).toBe('Bearer bearer_token_value');
        expect(headers['content-type']).toBe('application/json');
        expect(headers['message_type_id']).toBe(5101);
        expect(headers['country_code']).toBe('US');
        expect(headers['request_id']).toBe('uuid_request_id');
    });
});

test('should return validation exception if headers are empty', () => {
    try {
        sdk.defaultOffersService.getDefaultOffers("eep", {})
    } catch (e) {
        expect(e).toBeInstanceOf(DefaultOffersRequestValidationError);
    }
});


