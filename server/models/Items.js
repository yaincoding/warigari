export default (sequelize, DataTypes) => {
  return sequelize.define(
    "Items",
    {
      itemId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      productName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      productPart: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      unitPrice: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "Items",
      timestamps: true,
      charset: "utf8",
      collation: "utf8_general_ci",
    }
  );
};
