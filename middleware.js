// middleware.js
const { createProxyMiddleware } = require('http-proxy-middleware');

const apiProxy = createProxyMiddleware('/api', {
  target: 'http://3.111.33.229:8080', // Replace with your Node.js app URL
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/', // Remove /api from the request URL
  },
});

module.exports = function (req, res, next) {
  if (req.url.startsWith('/api')) {
    return apiProxy(req, res, next);
  }
  next();
};
