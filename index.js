const rwClient = require("./twitterClient.js")
const CronJob = require("cron").CronJob

const currentDate = new Date();
const europaLeaugeFinal = new Date("2023-05-31")
const days = (europaLeaugeFinal.getTime() - currentDate.getTime()) / (1000 * 3600 * 24)
const content = (Math.ceil(days) + " days until Europa Leauge glory!")

const tweet = async () => {
	try {
		await rwClient.v2.tweet(content)
	} catch (e) {
		console.log(e)
		
	}
}

const job = new CronJob("0 5 * * *", () => {
	tweet()
})

job.start()
