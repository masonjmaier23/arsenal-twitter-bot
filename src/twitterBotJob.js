const rwClient = require("./twitterClient.js")

const cron = require("node-cron");
const axios = require('axios');

const config = {
	method: "get",
	url: "https://v3.football.api-sports.io/fixtures?season=2022&team=42&next=2",
	headers: {
		"x-rapidapi-key": process.env.X_RAPIDAPI_KEY,
		"x-rapidapi-host": process.env.X_RAPIDAPI_HOST
	}
};

const currentDate = new Date();
const firstPremGame = new Date("2023-08-05")
const days = (firstPremGame.getTime() - currentDate.getTime()) / (1000 * 3600 * 24)

const tweetBot = async () => {
	axios(config)
		.then(function (fixtures) {
			const fixtureDate = new Date(fixtures.data.response[0].fixture.date)
			const days = (fixtureDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24)
			const opponent =
				(fixtures.data.response[0].teams.home.name.includes("Arsenal")
					? fixtures.data.response[0].teams.away.name :
					fixtures.data.response[0].teams.home.name)
			const stadium = fixtures.data.response[0].fixture.venue.name
			const city = fixtures.data.response[0].fixture.venue.city
			// const fixtureId = fixtures.data.response[0].fixture.id

			const content = (Math.ceil(days) + ` day(s) til we play ${opponent} at ${stadium}, ${city}`)
			rwClient.v2.tweet(content)
		})
		.catch(function (error) {
			console.log(error);
		});
}

// heroku uses GMT
const job = cron.schedule("30 16 * * *", () => {
	tweetBot()
	console.log("Successfully sent a tweet at: " + new Date())
})

module.exports = { job }