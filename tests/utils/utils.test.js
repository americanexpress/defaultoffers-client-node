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

const utils = require('../../lib/utils');

test('should return true if empty', () => {
    expect(utils.isEmpty('')).toBe(true);
    expect(utils.isEmpty([])).toBe(true);
    expect(utils.isEmpty(undefined)).toBe(true);
    expect(utils.isEmpty('test')).toBe(false);
});

test('should append parameters', () => {
    expect(utils.appendParameters('/example', {param:'value'})).toBe('/example?param=value');
    expect(utils.appendParameters('/example', {param1:'value1', param2:'value2'}))
        .toBe('/example?param1=value1&param2=value2');
    expect(utils.appendParameters('/example')).toBe('/example');
    expect(utils.appendParameters('/example', {})).toBe('/example');
    expect(utils.appendParameters('/example', null)).toBe('/example');
});
