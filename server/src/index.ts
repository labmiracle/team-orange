import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import router from "./routes";
import morgan from "morgan";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use("/", express.static(path.join(__dirname, "../client/dist")));
app.use(morgan("tiny"));
//routes
app.use(router);

app.get("/", async (req, res) => {
    const clientPath = path.join(__dirname, "../../client/dist/index.html");
    res.sendFile(clientPath);
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
