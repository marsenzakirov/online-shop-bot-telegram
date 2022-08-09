const { MongoClient } = require("mongodb");

const client = new MongoClient(
  "mongodb+srv://marsen:marsen12@cluster0.zqiez6t.mongodb.net/?retryWrites=true&w=majority"
);

try {
  client.connect();
  const items = client.db("shop").collection("items");
  const categories = client.db("shop").collection("categories");
  const users = client.db("shop").collection("users");
  const orders = client.db("shop").collection("orders");
  const cart = client.db("shop").collection("cart");
  module.exports = { items, categories, users, orders, cart };
} catch (error) {
  console.log(error);
}
