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

'use strict';
const utils = require('../utils');

/**
 * validate mandatory fields
 * @param {Object} headers 
 */
function validateHeaders(headers) {
    const errors = [];
    if (utils.isEmpty(headers)) errors.push('headers is empty');
    if (utils.isEmpty(headers['request_id']))
        errors.push('request id is missing in headers');
    if (utils.isEmpty(headers['client_id']))
        errors.push('client id is missing in headers');
    if (utils.isEmpty(headers['country_code']))
        errors.push('country code is missing in headers');
    if (utils.isEmpty(headers['message_type_id']))
        errors.push('message type id is missing in headers');
    return errors;
}

module.exports = {
    validateHeaders
}