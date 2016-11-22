const Sequelize = require('sequelize');
const sequelize = new Sequelize({
  logging: false,
  dialect: 'sqlite',
  storage: './data.sqlite'
});

let Result = sequelize.define('result', {
  url: {
    type: Sequelize.STRING
  },
  html: {
    type: Sequelize.STRING
  }
});

sequelize.sync().then(() => {
  Result.findAll().then((results) => {
    var top = 0;
    var middle = 0;
    var bottom = 0;

    results.forEach((result) => {
      var html = result.toJSON().html;
      let length = html.split(/\r\n|\r|\n/).length;
      console.log(length);
      console.log(result.url);
    });
  });
});
