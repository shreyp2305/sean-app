const Sequelize = require('sequelize');
const sequelize = new Sequelize(
  'newsletter',
  'root',
  'APbmCP70!',
  {
    dialect: 'mysql',
    // freezeTableName: true,
  }
);

// Test to check connection ---------------------
sequelize.authenticate().then( () => {
  console.log('Connection Successful!')
}).catch((err) => {
  console.log('Error connecting to database!')
});

// Re-syncs all tables if they been modified ----
// sequelize.sync({ alter: true });

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.posts = require("./post.model.js")(sequelize, Sequelize);

module.exports = db;
