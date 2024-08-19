// middleware.js
const { createProxyMiddleware } = require('http-proxy-middleware');

const apiProxy = createProxyMiddleware('/api', {
  target: 'http://3.111.33.229:8080/api/', // Replace with your Node.js app URL
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/', // Remove /api from the request URL
  },
});

module.exports = function (req, res, next) {
  if (req.url.startsWith('/api')) {
    console.log(`Proxying request: ${req.url}`);
    return apiProxy(req, res, next);
  }
  next();
};
