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

const validations = require('../../lib/utils/validations');

test('should return empty array if no validation errors', () => {
    expect(validations.validateHeaders({
        message_type_id: 5101,
        country_code: 'US',
        request_id: 'uuid_request_id',
        client_id: 'ASDFSD334235DDD'
    })).toMatchObject([]);
});

test('should return Array of errors', () => {
    expect(validations.validateHeaders({})).toMatchObject([
        'headers is empty',
        'request id is missing in headers',
        'client id is missing in headers',
        'country code is missing in headers',
        'message type id is missing in headers'
    ]);
});

