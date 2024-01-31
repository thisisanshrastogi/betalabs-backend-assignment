import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import Handler from "./dbhandle";
dotenv.config();

const app: Express = express();

const port = process.env.PORT || 3000;
const dbhandle = new Handler();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const cors = require("cors");
app.use(cors());
app.get("/users", async (req: Request, res: Response) => {
  try {
    const data = await dbhandle.readData("users");
    res.json(data);
  } catch (e) {
    res.json({ status: 418 });
  }
});

app.post("/users/", async (req: Request, res: Response) => {
  const data = req.body;
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  if (data.username.length < 2 || !emailRegex.test(data.email)) {
    return res
      .json({
        message: "Bad Request",
        code: 400,
      })
      .status(400);
  }
  if (await dbhandle.writeData({ collection: "users", data: { ...data } })) {
    res.json({ message: "OK", code: 200 });
  } else res.json({ message: "something went wrong", code: 418 }).status(418);
});

app.delete("/users/", async (req: Request, res: Response) => {
  const data = req.body;
  if (data.username?.length < 2) {
    res.json({ message: "Bad Request", code: 400 }).status(400);
  }
  if (await dbhandle.deleteEntry({ collection: "users", query: { ...data } })) {
    res.json({ code: 200, message: "ok" });
  } else res.json({ code: 418, message: "something went wrong" }).status(418);
});

app.put("/users/", async (req: Request, res: Response) => {
  const data = req.body;
  if (data.username?.length < 2) {
    res.json({ message: "Bad Request", code: 400 }).status(400);
  }
  if (
    await dbhandle.UpdateOne({
      collection: "users",
      query: { username: data.username },
      newData: data,
    })
  ) {
    res.json({ code: 200, message: "ok" });
  } else res.json({ code: 418, message: "something went wrong" }).status(418);
});

const server = app.listen(port, async () => {
  if (await dbhandle.connect()) {
    console.log("Connected to Mongodb server...");
  } else {
    console.log("Failed to connect");
  }
});

process.on("SIGINT", async () => {
  dbhandle.disconnect();
  console.log("disconnected");
  process.exit(0);
});
