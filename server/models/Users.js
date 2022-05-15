export default (sequelize, DataTypes) => {
  return sequelize.define(
    "Users",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      account: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "Users",
      timestamps: true,
      charset: "utf8",
      collation: "utf8_general_ci",
    }
  );
};
