const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://namastedev:UOr0uxEdGDaXJUKO@namastenode.fzzikww.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
