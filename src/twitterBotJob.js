const rwClient = require("./twitterClient.js")
const cron = require("node-cron");
const { response } = require("express");
const axios = require('axios');

const currentDate = new Date();
// const europaLeaugeFinal = new Date("2023-05-31")
const firstPremGame = new Date("2023-08-05")
const days = (firstPremGame.getTime() - currentDate.getTime()) / (1000 * 3600 * 24)
const content = (Math.ceil(days) + " day(s) until our Premier Leauge opener against Crystal Palace! #COYG")

async function getStatistics() {
	let url ="https://v3.football.api-sports.io/fixtures?team=42&season=2021"
	const headers = {
		"x-rapidapi-host": process.env.X_RAPIDAPI_HOST,
		"x-apisports-key": process.env.X_RAPIDAPI_KEY
	  }
	let res = await axios.get(url, {transformRequest:  (data, headers ) => {
		delete headers.common["Authorization"]
	}
	})
	const test = res.data
	console.log(test)
}

// console.log(getStatistics())

// const tweet = async () => {
// 	try {
// 		await rwClient.v2.tweet(content)
// 	} catch (e) {
// 		console.log(e)
		
// 	}
// }

// const job = cron.schedule("0 5 * * *", () => {
// 	tweet()
// 	console.log("sent a tweet")
// })

// module.exports = { job, getStatistics }
module.exports = { getStatistics }