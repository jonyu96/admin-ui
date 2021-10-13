const PROXY_CONFIG = {
    "/proxy-api/*": {
        "target": "https://zoey-stg.t-mobile.com",
        "secure": true,
        "changeOrigin": true,
        "pathRewrite": {
            "^/proxy-api": ""
        }
    }
    // "/zoey-admin-api/*": {
    //     "target": "http://localhost:8081",
    //     "secure": false,
    //     "changeOrigin": false,
    //     "pathRewrite": {
    //         "^/zoey-admin-api": "" 
    //     }
    // },
    // "/logger-api/*": {
    //     "target": "http://localhost:8082",
    //     "secure": false,
    //     "changeOrigin": false,
    //     "pathRewrite": {
    //         "^/logger-api": "" 
    //     }
    // }
}

module.exports = PROXY_CONFIG;