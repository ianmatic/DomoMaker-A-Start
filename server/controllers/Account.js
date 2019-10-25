const models = require('../models');
const Account = models.Account;
const loginPage = (req, res) => {
  res.render('login');
};
const signupPage = (req, res) => {
  res.render('signup');
};
const logout = (req, res) => {
  res.redirect('/');
};

const login = (req, res) => {
  const rq = req;
  const rs = res;

  const username = `${rq.body.username}`;
  const password = `${rq.body.pass}`;

  if (!username || !password) {
    return rs.status(400).json({ error: 'RAWR! All fields are required' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    return res.json({ redirect: '/maker' });
  });
};

const signup = (req, res) => {
  const rq = req;
  const rs = res;

    // cast to strings to cover up security flaws
  rq.body.username = `${rq.body.username}`;
  rq.body.pass = `${rq.body.pass}`;
  rq.body.pass2 = `${rq.body.pass2}`;

  if (!rq.body.username || !rq.body.pass || !rq.body.pass2) {
    return rs.status(400).json({ error: 'RAWR! All fields are required' });
  }
  if (rq.body.pass !== rq.body.pass2) {
    return rs.status(400).json({ error: 'RAWR! Passwords do not match' });
  }

  return Account.AccountModel.generateHash(rq.body.pass, (salt, hash) => {
    const accountData = {
      username: rq.body.username,
      salt,
      password: hash,
    };

    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    savePromise.then(() => rs.json({ redirect: '/maker' }));

    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return rs.status(400).json({ error: 'Username already in use.' });
      }

      return res.status(400).json({ error: 'An error occurred' });
    });
  });
};

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signupPage = signupPage;
module.exports.signup = signup;
