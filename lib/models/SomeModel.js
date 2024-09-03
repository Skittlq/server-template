import mongoose from "mongoose";

const someModelSchema = new mongoose.Schema({
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

const someModel =
  mongoose.models.someModel || mongoose.model("SomeModel", someModelSchema);

export default someModel;
