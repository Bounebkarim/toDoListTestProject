const express = require("express");
const mongoose = require("mongoose");
const _ = require("lodash");
const date = require(__dirname + "/date.js");
const app = express();
const port = 3000;

app.use(function (req, res, next) {
  if (req.originalUrl && req.originalUrl.split("/").pop() === "favicon.ico") {
    return res.sendStatus(204);
  }

  return next();
});
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.connect(
  "mongodb+srv://admin-Karim:Koukibouneb123@cluster0.yxi1r.mongodb.net/todolistDB"
);
const { Schema } = mongoose;
const itemsSchema = new Schema({
  name: String,
});
const Item = mongoose.model("Item", itemsSchema);
const item1 = new Item({
  name: "welcome",
});
const item2 = new Item({
  name: "this is sooo easy",
});
const item3 = new Item({
  name: "just try stuff",
});
const defaultItems = [item1, item2, item3];
const listsSchema = new Schema({
  name: String,
  items: [itemsSchema],
});
const day = date.getDay;
const List = mongoose.model("List", listsSchema);
app.get("/", (req, res) => {
  Item.find({}, (err, itemsFound) => {
    if (itemsFound.length === 0) {
      Item.insertMany(defaultItems, (err) => {
        if (err) {
          console.log(err);
        } else {
          res.redirect("/");
        }
      });
    } else {
      res.render("list", { listTitle: day, itemS: itemsFound });
    }
  });
});
app.post("/", (req, res) => {
  let addedItem = req.body.item;
  let stuff = req.body.list;
  console.log(stuff);
  if (addedItem !== "") {
    const item = new Item({
      name: addedItem,
    });
    if (stuff === day) {
      item.save();
      console.log("hello");
      res.redirect("/");
    } else {
      List.findOne({ name: stuff }, (err, listFound) => {
        console.log(listFound);
        listFound.items.push(item);
        listFound.save();
        res.redirect("/" + stuff);
      });
    }
  }
});

app.get("/:customeRoute", (req, res) => {
  let customRoute = _.capitalize(req.params.customeRoute);
  console.log(customRoute);
  List.findOne({ name: customRoute }, (err, result) => {
    if (result) {
      console.log("exist");
      res.render("list", { listTitle: customRoute, itemS: result.items });
    } else {
      console.log("don't exist");
      const list = new List({
        name: customRoute,
        items: defaultItems,
      });
      list.save();
      res.render("list", { listTitle: customRoute, itemS: defaultItems });
    }
  });
});
app.post("/delete", (req, res) => {
  const id = req.body.checkbox.trim();
  const listName = req.body.listName;
  console.log(listName);
  if (listName === day) {
    Item.findByIdAndDelete(id, (err) => {
      if (!err) {
        console.log("deleted");
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: id } } },
      (err, foundList) => {
        if (!err) {
          res.redirect("/" + listName);
        }
      }
    );
  }
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
