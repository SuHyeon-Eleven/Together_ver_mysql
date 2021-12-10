var DataTypes = require("sequelize").DataTypes;
var _comments = require("./comments");
var _joins = require("./joins");
var _posts = require("./posts");
var _users = require("./users");

function initModels(sequelize) {
  var comments = _comments(sequelize, DataTypes);
  var joins = _joins(sequelize, DataTypes);
  var posts = _posts(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);

  comments.belongsTo(posts, { as: "post", foreignKey: "postId"});
  posts.hasMany(comments, { as: "comments", foreignKey: "postId"});
  joins.belongsTo(posts, { as: "post", foreignKey: "postId"});
  posts.hasMany(joins, { as: "joins", foreignKey: "postId"});
  comments.belongsTo(users, { as: "user", foreignKey: "userId"});
  users.hasMany(comments, { as: "comments", foreignKey: "userId"});
  comments.belongsTo(users, { as: "userName_user", foreignKey: "userName"});
  users.hasMany(comments, { as: "userName_comments", foreignKey: "userName"});
  joins.belongsTo(users, { as: "user", foreignKey: "userId"});
  users.hasMany(joins, { as: "joins", foreignKey: "userId"});
  posts.belongsTo(users, { as: "user", foreignKey: "userId"});
  users.hasMany(posts, { as: "posts", foreignKey: "userId"});
  posts.belongsTo(users, { as: "userName_user", foreignKey: "userName"});
  users.hasMany(posts, { as: "userName_posts", foreignKey: "userName"});

  return {
    comments,
    joins,
    posts,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
