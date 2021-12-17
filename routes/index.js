var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");

// const elastic = require("elasticsearch");
const config = require("../config/config");
const signupValidator = require("../validators/signupValidator");
const noteValidator = require("../validators/noteValidation");

const userModel = require("../models/user");
const noteModel = require("../models/note");
const authCheck = require("../middleware/auth");
const moment = require("moment");

// const elasticClient = new elastic.Client({
//   host: "localhost:9200",
// });

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/signup", signupValidator.signup, async (req, res, next) => {
  let { firstName, lastName, email, phone, password, gender, dob } = req.body;
  console.log("req.body: ", req.body);

  let existinguser = await userModel.find({
    email,
  });

  if (existinguser.length) {
    res.json({
      status: "Error",
      msg: "User already Exists",
    });
  } else {
    let user = await userModel.create({
      firstName,
      lastName,
      email,
      phone,
      password,
      gender,
      dob,
    });

    if (user) {
      res.json({
        status: "Success",
        msg: "User Created successfully",
      });
    } else {
      res.json({
        status: "Error",
        msg: "There was an error please try again",
      });
    }
  }
});

router.post("/login", async (req, res) => {
  let { email, password } = req.body;
  console.log("req.body: ", req.body);

  let user = await userModel.findOne({ email });
  console.log("user: ", user);

  if (user && user.password == password) {
    let token = jwt.sign({ _id: user._id }, config.encryptionKey, {
      expiresIn: "1hr",
    });
    res.json({
      status: "success",
      msg: "Logged In",
      token: token,
      user: user,
    });
  } else {
    res.json({
      status: "error",
      msg: "User not found",
    });
  }
});

router.post(
  "/create-note",
  authCheck.auth,
  noteValidator.create,
  async (req, res, next) => {
    let { title, description } = req.body;
    console.log("req.body: ", req.body);
    let note = await noteModel.create({
      user_id: req.body.user_id,
      title,
      description,
      date: moment().format("YYYY-MM-DD"),
    });

    if (note) {
      res.json({
        status: "success",
        msg: "note created",
        note,
      });
    } else {
      res.json({
        status: "error",
        msg: "there was an issue try again",
      });
    }
  }
);

router.post("/get-note", authCheck.auth, async (req, res, next) => {
  let { _id, user_id } = req.body;
  console.log("req.body: ", req.body);

  let note = await noteModel.findOne({ _id, user_id });
  console.log("note: ", note);

  if (note) {
    res.json({
      status: "success",
      msg: "Note retrieved",
      note: note,
    });
  } else {
    res.json({
      status: "error",
      msg: "Note not found",
    });
  }
});

router.post("/get-all-notes", authCheck.auth, async (req, res, next) => {
  let note = await noteModel.find({
    id: req.body._id,
    user_id: req.body.user_id,
  });

  if (note.length) {
    res.json({
      status: "success",
      msg: "Note retrieved",
      note: note,
    });
  } else {
    res.json({
      status: "error",
      msg: "no notes found",
    });
  }
});

router.post("/update-note", authCheck.auth, async (req, res, next) => {
  let { _id, title, description, user_id } = req.body;
  console.log("update");
  noteModel.findOneAndUpdate(
    { _id, user_id: user_id },
    { title, description },
    function (err, resp) {
      if (err) {
        console.log(err);
        res.json({
          status: "error",
          msg: "no notes found",
        });
      } else {
        console.log("Updated Note: ", resp);
        res.json({
          status: "success",
          msg: "Note updated",
          note: resp,
        });
      }
    }
  );
});

router.post("/delete-note", authCheck.auth, async (req, res, next) => {
  let { _id, user_id } = req.body;

  let note = await noteModel
    .findByIdAndDelete({ _id, user_id })
    .then((err, resp) => {
      if (err) {
        console.log(err);
        res.json({
          status: "error",
          msg: "no notes found",
        });
      } else {
        console.log("Deleted Note : ", resp);
        res.json({
          status: "success",
          msg: "Note deleted",
          note: resp,
        });
      }
    });
});

// router.use((req, res, next) => {
//   elasticClient
//     .index({
//       index: "logs",
//       body: {
//         url: req.url,
//         method: req.method,
//       },
//     })
//     .then((res) => {
//       console.log("Logs created");
//     })
//     .catch((err) => {
//       console.log("err: ", err);
//     });
//   next();
// });

// let dataToIjest = [
//   {
//     id: "0001",
//     type: "donut",
//     name: "Cake",
//     ppu: 0.55,
//     batters: {
//       batter: [
//         { id: "1001", type: "Regular" },
//         { id: "1002", type: "Chocolate" },
//         { id: "1003", type: "Blueberry" },
//         { id: "1004", type: "Devil's Food" },
//       ],
//     },
//     topping: [
//       { id: "5001", type: "None" },
//       { id: "5002", type: "Glazed" },
//       { id: "5005", type: "Sugar" },
//       { id: "5007", type: "Powdered Sugar" },
//       { id: "5006", type: "Chocolate with Sprinkles" },
//       { id: "5003", type: "Chocolate" },
//       { id: "5004", type: "Maple" },
//     ],
//   },
//   {
//     id: "0002",
//     type: "donut",
//     name: "Raised",
//     ppu: 0.55,
//     batters: {
//       batter: [{ id: "1001", type: "Regular" }],
//     },
//     topping: [
//       { id: "5001", type: "None" },
//       { id: "5002", type: "Glazed" },
//       { id: "5005", type: "Sugar" },
//       { id: "5003", type: "Chocolate" },
//       { id: "5004", type: "Maple" },
//     ],
//   },
//   {
//     id: "0003",
//     type: "donut",
//     name: "Old Fashioned",
//     ppu: 0.55,
//     batters: {
//       batter: [
//         { id: "1001", type: "Regular" },
//         { id: "1002", type: "Chocolate" },
//       ],
//     },
//     topping: [
//       { id: "5001", type: "None" },
//       { id: "5002", type: "Glazed" },
//       { id: "5003", type: "Chocolate" },
//       { id: "5004", type: "Maple" },
//     ],
//   },
// ];

// router.post("/injest", (req, res, next) => {
//   console.log("INJESTING DATA");
//   elasticClient
//     .index({
//       index: "products",
//       body: req.body,
//     })
//     .then((resp) => {
//       res.json({
//         msg: "Recipes indexed",
//       });
//     })
//     .catch((err) => {
//       res.json({
//         msg: err,
//       });
//     });
// });

// router.get("/recipe/:id", async (req, res, next) => {
//   console.log("req.params: ", req.params);
//   let query = {
//     index: "products",
//     id: 0,
//   };
//   elasticClient
//     .get(query)
//     .then((resp) => {
//       if (!resp) {
//         res.json({
//           msg: "No products found",
//           products: resp,
//         });
//       } else {
//         res.json({
//           msg: "products found",
//           products: resp,
//         });
//       }
//     })
//     .catch((err) => {
//       console.log("err: ", err);
//       res.json(err);
//     });
//   await elasticClient.indices.refresh({ index: "products" });
// });

module.exports = router;
