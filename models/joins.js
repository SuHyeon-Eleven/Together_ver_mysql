const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('joins', {
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
    }
  }, {
    sequelize,
    tableName: 'joins',
    timestamps: false,
    indexes: [
      {
        name: "FK_joins_postId_posts_postId",
        using: "BTREE",
        fields: [
          { name: "postId" },
        ]
      },
      {
        name: "FK_joins_userId_users_userId",
        using: "BTREE",
        fields: [
          { name: "userId" },
        ]
      },
    ]
  });
};
