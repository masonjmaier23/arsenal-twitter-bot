const express = require("express")
const path = require('path');

const { job } = require("./src/twitterBotJob.js");

const app = express();

app.get("/", (req, res) => {
	res.send("Check out @ArsenalEuroBot on Twitter")
	job.start()
})

app.listen(process.env.PORT || 3000, () => {
	console.log("Server running on port 3000")
})