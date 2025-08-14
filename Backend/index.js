const express = require("express");
const cors = require("cors");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const userrouter = require("./Routes/userrouter");
const submitfeedback=require("./Routes/Feedbackroutes");
app.use("/api", userrouter);
app.use("/api", submitfeedback);
app.listen(8000, () => {
    console.log("Server is running on port 8000");
});



