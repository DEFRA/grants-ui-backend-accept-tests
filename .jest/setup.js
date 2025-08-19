require('dotenv').config()

global.baseUrl = `https://grants-ui-backend.${process.env.ENVIRONMENT}.cdp-int.defra.cloud`
