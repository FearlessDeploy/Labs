const database = db.getSiblingDB("blogdb");

database.createCollection("posts");

database.posts.createIndex({ category: 1 });
database.posts.createIndex({ status: 1 });
database.posts.createIndex({
  title: "text",
  content: "text"
});

