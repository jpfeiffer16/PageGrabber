const path = require('path');

module.exports = function(cb) {
  //Set up Sequelize and sqlite db
  const Sequelize = require('sequelize');
  const sequelize = new Sequelize({
    logging: false,
    dialect: 'sqlite',
    storage: path.normalize(path.join(__dirname, '../data.sqlite'))
  });

  //Define Modules
  let Models = {};
  Models.Result = require('./result')(sequelize, Sequelize);
  
  //Tie logic to on db setup
  sequelize.sync().then(() => { 
    cb(Models);
  });
};