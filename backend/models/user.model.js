module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "user",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        required: true,
        unique: "email",
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        required: true,
      },
    },
    {
      timestamps: false,
    }
  );

  // Sync Post manually
  User.sync({ alter: true })
    .then(() => {
      console.log("Successfully synced User model");
    })
    .catch((err) => {
      console.log("Error syncing User model: \n" + err);
    });

  return User;
};
