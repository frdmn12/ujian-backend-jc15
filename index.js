const express = require("express")
const app = express()
const server = require("http").createServer(app);
const cors = require("cors");
const bodyParser = require("body-parser");
const port = 2000;
const { moviesRouter, userRouter } = require("./router");
// const { query, db } = require("./database");

// app.use(bearerToken());
app.use(bodyParser());
app.use(cors());
app.use(express.static("public"));
app.get("/", (req,res) => {
    res.status(200).send("<h1>Express API</h1>");
})

app.use("/movies", moviesRouter)
app.use("/users", userRouter)


server.listen(port, () => console.log(`API active at port ${port}`));