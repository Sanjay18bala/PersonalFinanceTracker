const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const port = 3000;
const cors = require("cors");
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));

const userSchema = new mongoose.Schema({
  USERNAME: {
    type: String,
    required: true,
  },
  PASSWORD: {
    type: String,
    required: true,
  },
  EMAIL: {
    type: String,
    required: true,
  },
});

const financeSchema = new mongoose.Schema({
  USERNAME: {
    type: String,
    required: true,
  },
  CARD_DETAILS: {
    type: Object,
    required: true,
  },
  TOTAL_BALANCE: {
    type: String,
    required: true,
  },
  SAVINGS: {
    type: String,
    required: true,
  },
  DEBTS: {
    type: String,
    required: true,
  },
  EXPENSES: {
    type: Object,
    required: true,
  },
});

mongoose
  .connect("mongodb+srv://sanjay18bala:1234@cluster0.8jsw6.mongodb.net/")
  .then(() => {
    console.log("Connected to mongoDB");
  })
  .catch(() => {
    console.log("Error connecting to mongoDB");
  });

app.listen(port, () => {
  console.log("server is running on port 3000");
});

const User = mongoose.model("User", userSchema);
const Finance = mongoose.model("Finance", financeSchema);

let email = "";

app.post("/getUserDetails", async (req, res) => {
  try {
    const { EMAIL } = req.body;
    email = EMAIL;
    // pass = PASSWORD;
    // console.log(USERNAME, PASSWORD);
    const user = await User.findOne({ EMAIL: EMAIL });
    res.send(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.get("/getFinanceDetails", async (req, res) => {
  try {
    const financeDetails = await Finance.findOne({ USERNAME: "S" });
    if (!financeDetails) {
      return res.status(404).json({ message: "Finance details not found" });
    }
    res.status(200).json(financeDetails);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
});

app.post("/updateTotalBalance", async (req, res) => {
  try {
    const { TOTAL_BALANCE } = req.body;

    console.log(TOTAL_BALANCE);

    await Finance.updateOne(
      { USERNAME: "S" },
      {
        TOTAL_BALANCE: TOTAL_BALANCE,
      }
    );

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
