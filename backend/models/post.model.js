module.exports = (sequelize, Sequelize) => {
  const Post = sequelize.define("posts", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    content: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    imagePath: {
      type: Sequelize.STRING,
      allowNull: false,
      required: false,
      defaultValue: "",
    },
  });

  // Sync Post manually
  Post.sync({ alter: true })
    .then(() => {
      console.log("Successfully synced Post model");
    })
    .catch((err) => {
      console.log("Error syncing Post model: \n" + err);
    });

  return Post;
};
