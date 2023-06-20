const Sequelize = require('sequelize');
const sequelize = new Sequelize(
  'newsletter_db',
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

// DB initialization
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.posts = require("./post.model.js")(sequelize, Sequelize);
db.comments = require("./comment.model.js")(sequelize, Sequelize);

// Associations
db.posts.hasOne(db.comments);

let thisPost, thisComment;

// Syncing
db.sequelize.sync({ alter: true }).then(() => {
  console.log('Successfully synced Comment model');
  return db.posts.findOne({ where: { title: 'USA' }})
}).then( data => {
  thisPost = data;
  return thisPost.getComment();
}).then( data => {
  console.log(data.toJSON());
}).catch((err) => {
  // console.log(err);
  console.log('Error syncing Post model');
})

module.exports = db;
