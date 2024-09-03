import express from "express";

const route = express.Router();

route.get("/route", async (req, res) => {
  try {
    res.status(200).json({ success: true, data: "Hello World!" });
  } catch (error) {
    return res.status(500).json({ success: false, error });
  }
});

export default route;
