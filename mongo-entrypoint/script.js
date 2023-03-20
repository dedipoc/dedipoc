db = db.getSiblingDB("admin-dedipoc-db");

db.createUser({
  user: "dedipoc",
  pwd: "sausages",
  roles: [{ role: "readWrite", db: "dedipoc-db" }],
});
