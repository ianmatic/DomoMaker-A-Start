const models = require('../models');
const Domo = models.Domo;
const makerPage = (req, res) => {
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.render('app', { csrfToken: req.csrfToken(), domos: docs });
  });
};

let uniqueid = 0;
const makeDomo = (req, res) => {
  if (!req.body.name || !req.body.age) {
    return res.status(400).json({ error: 'RAWR! Both name and age are required' });
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    owner: req.session.account._id,
    id: uniqueid
  };

  const newDomo = new Domo.DomoModel(domoData);

  const domoPromise = newDomo.save();
  domoPromise.then(() => res.json({ redirect: '/maker' }));
  domoPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists.' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });

  // successfully created a new Domo
  uniqueid++;
  return domoPromise;
};

const getDomos = (req, res) => {
  const rq = req;
  const rs = res;

  return Domo.DomoModel.findByOwner(rq.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return rs.status(400).json({ error: 'An error occurred' });
    }

    return rs.json({ domos: docs });
  });
};

const deleteDomo = (req, res) => {
  
};
module.exports.makerPage = makerPage;
module.exports.getDomos = getDomos;
module.exports.makeDomo = makeDomo;
module.exports.deleteDomo = deleteDomo;
