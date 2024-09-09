import mongoose from "mongoose";

export const dbConnection = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Connected to Database Successfully");
    })
    .catch((err) => {
      console.log(`error while connecting to database${err}`);
    });
};
