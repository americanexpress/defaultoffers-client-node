# Default Offers Node SDK
The Default Offers API allows a Partner to request AMEX's standard card offers and display them to prospective customers.

​This Node SDK allows AMEX partners to integrate seamlessly to the Default Offers Service and reduces the complexity of coding service layer integration with the Default Offers API. It assumes you have already set up your credentials with American Express and have your certs prepared.

## Table of Contents

- [Documentation](#documentation)    
- [Installation](#installation)
- [Compatibility](#compatibility)
- [Configuration](#configuring-sdk)
- [Authentication](#authentication)
- [Get Default Offers](#Get-Default-Offers)
- [Error Handling](#error-handling)
- [Samples](#Running-Samples)
- [Open Source Contribution](#Contributing)
- [License](#license)
- [Code of Conduct](#code-of-conduct)


<br/>

## Installation

```sh
npm install @americanexpress/default-offers-client-node
```
<br/>

## Compatibility

This sdk will support Node Version 6 or higher and NPM version 3.8.6 or higher.

- On newer version of Node you can use `async/await` instead of promises (all the below examples in the sdk will be using Promises)
- On older version of Node you can use either callbacks or promises, all the SDK functions will have an optional parameter to support call back.

Sample for call back support :

```js
var defaultOffersClient = require('@americanexpress/default-offers-client-node');
var config = {}
defaultOffersClient.configure(config);

defaultOffersClient.defaultOffersService.getDefaultOffers(eep, headers, function (err, response) {
    if(err) {
        //handle error
    }
    else {
        //display default offer
    }
})


```


<br/>

## Configuring SDK

SDK needs to be configured with OAuth and Mutual Auth configurations. Below is a sample configuration snippet.

```js
const fs = require('fs');
const defaultOffersClient = require('@americanexpress/default-offers-client-node');
const config = {
    //-- required, based on the environment(test, production) it will change, AMEX will provide the root URls
    rootUrl: 'api.qasb2s.americanexpress.com', 
    /**
     *OAuth configuration  
     */
    authentication: {
        //optional -- if you have an active bearerToken, you can set this property and skip authentication call.
        bearerToken: '',
        //--required, OAuth key, will be provided by American Express.
        clientKey: '',
        //--required, OAuth Secret, will be provided by American Express.
        clientSecret: ''
    },
    /**
     * 2-way SSL(Mutual Auth) configuration
     */
    mutualAuth: {
        //--required, Client needs to provide file  private key file in .pem format
        privateKey: fs.readFileSync(''),
        // --required, Client needs to provide their public key file
        publicCert: fs.readFileSync('') 
    },
    /**
     * Support for calling APIs over internet 
     */
    httpProxy: {
        //false, if it is not needed.
        isEnabled: false, 
        // host, can support both http and https 
        host: '',
        // port, port number for the proxy 
        port: '' 
    }
}

defaultOffersClient.configure(config);

```

<br/>

## Authentication

AMEX Default Offers Service uses token based authentication. The following examples demonstrates how to generate bearer tokens using the SDK.
```js
defaultOffersClient.authentication.getBearerToken().then(resp => {
    //success response
    defaultOffersClient.setBearerToken(resp.access_token); //set the bearertoken for further api calls 
})

```
Sample Resposne : 

```js
{
  scope: 'default',
  status: 'approved',
  expires_in: '3599', // token expirty in seconds, you can cache the token for the amount of time specified.
  token_type: 'BearerToken',
  access_token: 'access token example'
}

```
Note : you can skip this call if you have an active Token in your cache. if you have an active token, you can just set the bearerToken in config under authentication or call `setBearerToken('access_token')` method to update the config.



<br/>

## Get Default Offers

API mandatory fields can be found at [API Specifications](https://developer.americanexpress.com/products/default-offers-public/resources#readme).

```js
const headers = {
    "request_id": uuidv1(),
    "client_id": 'ASDFSD334235DDD', //client Id provided by AMEX, not the client id used for authentication
    "message_type_id": "5101", //value will be provided by AMEX
    "country_code": "US"
};

//The External Entry Point (EEP) will determine which default offer is returned.
return defaultOffersClient.defaultOffersService.getDefaultOffers("exampleEEP", headers).then(resp => {
    //successful response
});

```

This will return a default offer. You can find more information about the response at [reference guide](https://developer.americanexpress.com/products/default-offers-public/resources#readme).

<br/>

## Error Handling

In case exceptions are encountered while calling American Express APIs, the SDK will throw Errors. 

If a callback function is provided, the error will be sent back as the first argument of the callback function.

```js 
defaultOffersClient.defaultOffersService.getDefaultOffers(eep, headers, function (err, result) {
    if(err){
        // handle exception
    }
});
```
If a callback function is not provided, SDK will reject Promise

```js
defaultOffersClient.defaultOffersService.getDefaultOffers(eep, headers).then(res => {
    //success 
}).catch(err => {
    //handle exception 
});

```

Possible exceptions : 
```js
- DefaultOffersAuthenticationError      // Authentication errors with the API -- example : invalid API Key or Secret is sent to the API.

- DefaultOffersRequestValidationError   // Request or configs provided to the SDK are invalid. You can see more info in error.fields for the fields that failed validations.

- DefaultOffersAPIError                 // A generic type of error. It will be raised when there is an Internal server error or any other error which is not covered by any of the named errors.

- DefaultOffersResourceNotFoundError    // Raised when the API resource could not be found.
```

<br/>

## Running Samples 
Instructions for running the sample are in the [sample directory](/samples/README.md).

<br/>

## Contributing

We welcome Your interest in the American Express Open Source Community on Github. Any Contributor to
any Open Source Project managed by the American Express Open Source Community must accept and sign
an Agreement indicating agreement to the terms below. Except for the rights granted in this 
Agreement to American Express and to recipients of software distributed by American Express, You
reserve all right, title, and interest, if any, in and to Your Contributions. Please
[fill out the Agreement](https://cla-assistant.io/americanexpress/defaultoffers-client-node).

<br/>

## License

Any contributions made under this project will be governed by the
[Apache License 2.0](./LICENSE.txt).


<br/>

## Code of Conduct

This project adheres to the [American Express Community Guidelines](./CODE_OF_CONDUCT.md). By
participating, you are expected to honor these guidelines.