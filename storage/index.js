module.exports = function(cb) {
  //Set up Sequelize and sqlite db
  const Sequelize = require('sequelize');
  const sequelize = new Sequelize({
    logging: false,
    dialect: 'sqlite',
    storage: require('path').normalize(require('path').join(__dirname, 'data.sqlite'))
  });
  console.log(require('path').normalize(require('path').join(__dirname, 'data.sqlite')));
  //Define Modules
  let Models = {};
  Models.Result = require('./result')(sequelize, Sequelize);

  //Temp
  // let Result = require('./result')(sequelize, Sequelize);
  // console.log('Result:');
  // // console.dir(Result, { depth: 2 });
  // require('./result')(sequelize, Sequelize)
  //   .findAll()
  //   .then((dbresults) => {
  //     console.log('Found all');
  //     console.log(dbresults);
  //   });

  //Tie logic to on db setup
  sequelize.sync().then(() => { 
    cb(Models);
  });
};