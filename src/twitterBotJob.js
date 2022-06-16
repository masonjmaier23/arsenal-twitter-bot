const rwClient = require("./twitterClient.js")
const cron = require("node-cron");

const currentDate = new Date();
// const europaLeaugeFinal = new Date("2023-05-31")
const firstPremGame = new Date("2023-08-05")
const days = (firstPremGame.getTime() - currentDate.getTime()) / (1000 * 3600 * 24)
const content = (Math.ceil(days) + " day(s) until our Premier Leauge opener against Crystal Palace! #COYG")

const tweet = async () => {
	try {
		await rwClient.v2.tweet(content)
	} catch (e) {
		console.log(e)
		
	}
}

const job = cron.schedule("0 5 * * *", () => {
	tweet()
	console.log("sent a tweet")
})

module.exports = { job }