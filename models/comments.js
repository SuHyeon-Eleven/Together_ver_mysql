const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('comments', {
    commentId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'posts',
        key: 'postId'
      }
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
    }
  }, {
    sequelize,
    tableName: 'comments',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "commentId" },
        ]
      },
      {
        name: "FK_comments_userId_users_userId",
        using: "BTREE",
        fields: [
          { name: "userId" },
          { name: "userName" },
        ]
      },
      {
        name: "FK_comments_postId_posts_postId",
        using: "BTREE",
        fields: [
          { name: "postId" },
        ]
      },
    ]
  });
};
