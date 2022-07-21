const Auth = require('../services/Auth');

module.exports = {
  login: async (req, res) => {
    const auth = new Auth(req.body);
    const response = auth.login();
    console.log('Login response: ', response);
    return res.josn(response);
  },
};
