module.exports = function(connection,  Sequelize) {
  let Result = connection.define('result', {
    url: {
      type: Sequelize.STRING
    },
    html: {
      type: Sequelize.TEXT
    }
  });
  
  return Result;
};