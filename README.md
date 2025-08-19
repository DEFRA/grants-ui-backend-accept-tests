# grants-ui-backend-accept-tests

This is the acceptance test suite for the `grants-ui-backend` service located at https://github.com/DEFRA/grants-ui-backend, and is maintained by Grants Application Enablement (GAE) team. This repository is based on a CDP journey test suite, amended to run Jest tests against the service's REST API.

## Running tests locally

Specify the application you are testing in the url specified as `global.baseUrl` in [.jest/setup.js](.jest/setup.js). The presence of `process.env.ENVIRONMENT` in this file is assumed to mean the tests are running in the CDP portal.

```bash
# you must provide the following environment variables in your environment, e.g. in an .env file
# ENVIRONMENT
# GRANTS_UI_BACKEND_AUTH_TOKEN
# GRANTS_UI_BACKEND_ENCRYPTION_KEY

npm test
```

### Licence

THIS INFORMATION IS LICENSED UNDER THE CONDITIONS OF THE OPEN GOVERNMENT LICENCE found at:

<http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3>

The following attribution statement MUST be cited in your products and applications when using this information.

> Contains public sector information licensed under the Open Government licence v3

#### About the licence

The Open Government Licence (OGL) was developed by the Controller of Her Majesty's Stationery Office (HMSO) to enable
information providers in the public sector to license the use and re-use of their information under a common open
licence.

It is designed to encourage use and re-use of information freely and flexibly, with only a few conditions.
