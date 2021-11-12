const express = require("express");
const app = express();
const cors = require("cors");

require("dotenv").config();
const { MongoClient } = require("mongodb");

app.use(cors());
app.use(express.json());
const port = process.env.PORT || 8000;
const ObjectId = require("mongodb").ObjectId;

const uri = ` mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rhkgk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    console.log("database connected");

    const database = client.db("car_land");
    const carCollection = database.collection("cars");
    const orderCollection = database.collection("orders");
    const reviewsCollection = database.collection("reviews");
    const usersCollection = database.collection("users");

    // GET ALL CAR
    app.get("/cars", async (req, res) => {
      const cursor = carCollection.find({});
      const cars = await cursor.toArray();
      res.send(cars);
    });

    // GET SINGLE CAR

    app.get("/cars/:id", async (req, res) => {
      const id = req.params.id;
      const qurey = { _id: ObjectId(id) };
      const car = await carCollection.findOne(qurey);
      res.json(car);
    });

    // GET ALL ORDERS
    app.get("/orders", async (req, res) => {
      const cursor = orderCollection.find({});
      const cars = await cursor.toArray();

      res.send(cars);
    });

    // new added code
    app.get("/users", async (req, res) => {
      const cursor = usersCollection.find({});
      const cars = await cursor.toArray();

      res.send(cars);
    });
    // POST USERS
    app.post("/users", async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await usersCollection.insertOne(user);

      res.json(result);
    });

    // GET ADMIN BY CHECKING ROLE
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === "admin") {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    });

    // GET ALL REVIEWS
    app.get("/reviews", async (req, res) => {
      const cursor = reviewsCollection.find({});
      const cars = await cursor.toArray();

      res.send(cars);
    });

    // GET SINGLE ORDER BY ID
    app.get("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const qurey = { _id: ObjectId(id) };
      const order = await orderCollection.findOne(qurey);
      res.json(order);
    });

    // POST CAR
    app.post("/cars", async (req, res) => {
      const car = req.body;
      const result = await carCollection.insertOne(car);
      res.json(result);
    });

    // POST ORDERS
    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.json(result);
    });

    // POST REVIEW
    app.post("/reviews", async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await reviewsCollection.insertOne(user);

      res.json(result);
    });

    app.put("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const updateStatus = req.body;

      // const status = updateStatus.order.status;
      const filter = { _id: ObjectId(id) };
      const option = { upsert: true };
      const updateDoc = { $set: { status: updateStatus.status } };
      const result = await orderCollection.updateOne(filter, updateDoc, option);
      res.json(result);
    });

    // UPDATE USER TO SET ROLE ADMIN
    app.put("/users", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      // const options = { upsert: true };
      const updateDoc = { $set: { role: "admin" } };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.json(result);
    });

    // DELETE SINGLE CAR
    app.delete("/cars/:id", async (req, res) => {
      const id = req.params.id;
      const qurey = { _id: new ObjectId(id) };
      const result = await carCollection.deleteOne(qurey);
      res.json(result);
    });

    // DELETE SINGLE ORDER
    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const qurey = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(qurey);
      res.json(result);
    });
  } finally {
    //  await client.close()
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("The Car Land assinment12");
});

app.listen(port, () => {
  console.log("Listening form port : ", port);
});
