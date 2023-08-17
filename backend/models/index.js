require("dotenv").config();
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    dialect: "mysql",
    freezeTableName: true,
  }
);

// Test to check connection ---------------------
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection Successful!");
  })
  .catch((err) => {
    console.log("Error connecting to database!");
  });

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.posts = require("./post.model.js")(sequelize, Sequelize);
db.users = require("./user.model.js")(sequelize, Sequelize);

// Associations
db.users.hasMany(db.posts);
db.posts.belongsTo(db.users);

// Re-syncs all tables if they been modified
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Successfully synced DB");
  })
  .catch((err) => {
    console.log("Error syncing DB: \n" + err);
  });

module.exports = db;
