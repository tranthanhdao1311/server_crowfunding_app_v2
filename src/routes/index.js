const auth=require('./auth.route')
const campaigns=require('./campaigns.route')
const jsonServer = require('json-server')
const initRouter = (app) => {

  app.use('/auth', auth);
  app.use('/api', campaigns)
 

};

module.exports = initRouter;