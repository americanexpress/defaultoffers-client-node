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
const fs = require('fs');
const uuidv1 = require('uuid/v1');
const _ = require('lodash');
const content = fs.readFileSync("../config.json");
const config = JSON.parse(content);

/**
 * provide certificates/key files to the config.
 */
config.mutualAuth.privateKey = fs.readFileSync(config.mutualAuth.privateKey);
config.mutualAuth.publicCert = fs.readFileSync(config.mutualAuth.publicCert);

const sdk = require('../../index');
sdk.configure(config);

const headers = {
    "request_id": uuidv1(),
    "client_id": 'ASDFSD334235DDD', //client Id provided by Amex, not the client id used for authentication,
    "message_type_id": "5101",
    "country_code": "US"
};

sdk.authentication.getBearerToken().then(resp => {
    console.log('OAuth Token Response: ', resp);
    if (resp.access_token) {
        sdk.setBearerToken(resp.access_token); // set access_token, you can cache this token until the expiry time provided in response
        return sdk.defaultOffersService.getDefaultOffers('defaultoffer', headers);
    }
}).then(response => {
    console.log('Default Offer: ', response);
}).catch(e => {
    console.log('Error : ', e);
});
