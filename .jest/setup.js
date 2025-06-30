global.baseUrl = process.env.ENVIRONMENT ?
  `https://grants-ui-backend.${process.env.ENVIRONMENT}.cdp-int.defra.cloud` : `https://grants-ui-backend.test.cdp-int.defra.cloud`
