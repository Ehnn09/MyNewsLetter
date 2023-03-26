const express = require("express");
const bodyParser = require("body-parser");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const https = require("https");
const request = require("request");

const mailChimpAPIKey = "0180f86a92069fa54df80c57e42de269-us21";
// audieceID = 7d53050436
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

// Connecting to mailchimp API
mailchimp.setConfig({
  apiKey: mailChimpAPIKey,
  server: "us21",
});

app.post("/", function (req, res) {
  var firstName = req.body.firstname;
  var secondName = req.body.lastname;
  var email = req.body.email;

  var listId = "7d53050436";

  //Creating an object with the users data
  const subscribingUser = {
    firstName: firstName,
    lastName: secondName,
    email: email,
  };

  async function run() {
    const response = await mailchimp.lists.addListMember(listId, {
      email_address: subscribingUser.email,
      status: "subscribed",
      merge_fields: {
        FNAME: subscribingUser.firstName,
        LNAME: subscribingUser.lastName,
      },
    });
    //If all goes well logging the contact's id
    res.sendFile(__dirname + "/success.html");

    // console.log(
    //   `Successfully added contact as an audience member. The contact's id is ${response.id}.`
    // );

    console.log(response.statusCode);
  }

  run().catch((e) => res.sendFile(__dirname + "/failure.html"));
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("server is running");
});
