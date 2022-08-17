const { MongoClient } = require("mongodb");

require("dotenv").config();

const client = new MongoClient(process.env.MONGO_TOKEN);

try {
  client.connect();
  const items = client.db("shop").collection("items");
  const categories = client.db("shop").collection("categories");
  const users = client.db("shop").collection("users");
  const orders = client.db("shop").collection("orders");
  const cart = client.db("shop").collection("cart");
  const counter = client.db("shop").collection("counter");

  module.exports = { items, categories, users, orders, cart, counter };
} catch (error) {
  console.log(error);
}
