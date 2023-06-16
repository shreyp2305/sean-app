module.exports = (sequelize, Sequelize) => {
  const Post = sequelize.define('post', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    author: {
      type: Sequelize.STRING,
      allowNull: false
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },
    content: {
      type: Sequelize.STRING,
      allowNull: false
    }
  },
  {
    freezeTableName: true,
    timestamps: false
  });

  // Sync Post manually
  Post.sync({ alter: true }).then(() => {
    console.log('Successfully synced Post model')
  }).catch((err) => {
    console.log('Error syncing Post model');
  })

  return Post;
}
