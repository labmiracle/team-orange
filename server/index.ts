import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));

//routes
app.get("/camperas", (req, res) => {
    res.send([
        { nombre: "campera1", marca: "adidas", color: "negra" },
        { nombre: "campera2", marca: "nike", color: "azul" },
    ]);
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
