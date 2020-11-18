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
const httpclient = require('../client/http-client');
const utils = require('../utils');
const validations = require('../utils/validations');
const { DefaultOffersRequestValidationError } = require('../errors');

/**
 * Implementation for getting Default Offers from American Express
 * @param {String} eep - required - The External Entry Point that will determine which default offer is returned
 * @param {Object} headerParams  - required - Params required to call the service.
 * The accepted parameters are :
 *     	- message_type_id - will be shared by AMEX
 *     	- request_id - unique id for tracking
 * 		- client_id - client Id provided by AMEX; different from the client Id configured in config
 * 		- country_code - the ISO 3166 two-letter (alpha-2) Country Codes. e.g. US, GB
 * 		- bearer_token - bearer token from the Authentication call
 */
function getDefaultOffers(eep, headerParams) {
	const errors = validations.validateHeaders(headerParams);
	if (!utils.isEmpty(errors)) {
		throw new DefaultOffersRequestValidationError(errors);
	}
	var path = utils.appendParameters('/acquisition/digital/v1/offers/cards/default_offers', {eep:eep});
	return httpclient.callService(path, 'GET', utils.createHeaders(headerParams), null);
}

module.exports = {
	getDefaultOffers
}