var mongoose = require("mongoose");

const password = "n96ByN7xrPMvp3aA";

var options = {
  connectTimeoutMS: 5000,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(
  `mongodb+srv://admin:${password}@cluster0.sqlye.mongodb.net/?retryWrites=true&w=majority`,
  options,
  function (err) {
    console.log(err);
  }
);
