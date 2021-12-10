const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('posts', {
    postId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    subject: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'userId'
      }
    },
    userName: {
      type: DataTypes.STRING(45),
      allowNull: false,
      references: {
        model: 'users',
        key: 'userName'
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    deadline_date: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    currentState: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    state: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'posts',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "postId" },
        ]
      },
      {
        name: "FK_posts_userId_users_userId",
        using: "BTREE",
        fields: [
          { name: "userId" },
          { name: "userName" },
        ]
      },
    ]
  });
};
