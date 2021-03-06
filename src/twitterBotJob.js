const rwClient = require("./twitterClient.js")
const cron = require("node-cron")
const axios = require('axios')

const headers = {
	"x-rapidapi-key": process.env.X_RAPIDAPI_KEY,
	"x-rapidapi-host": process.env.X_RAPIDAPI_HOST
}

const getFixture = async () => {
	try {
		// GET requests to RapidAPI
		const fixtures = await axios.get("https://v3.football.api-sports.io/fixtures?season=2022&team=42&next=2", {"headers" : headers})
		const fixtureId = fixtures.data.response[0].fixture.id
		const predictions = await axios.get(`https://v3.football.api-sports.io/predictions?fixture=${fixtureId}`, {"headers" : headers})

		// days til match
		const countDownDate = new Date(fixtures.data.response[0].fixture.date).getTime()
		const now = new Date().getTime()
		const timeLeft = countDownDate - now
		var days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
		var hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
		

		// content 1 
		const opponent = (fixtures.data.response[0].teams.home.name.includes("Arsenal") 
		? fixtures.data.response[0].teams.away.name : fixtures.data.response[0].teams.home.name)
		const stadium = fixtures.data.response[0].fixture.venue.name
		const city = fixtures.data.response[0].fixture.venue.city
		const leagueName= predictions.data.response[0].league.name
		const arsenalForm = (predictions.data.response[0].teams.home.name.includes("Arsenal") 
		? predictions.data.response[0].teams.home.league.form : predictions.data.response[0].teams.away.league.form)

		// content 2 
		// const winner = predictions.data.response[0].predictions.winner.name
		// const winOrDraw = predictions.data.response[0].predictions.win_or_draw
		// const winOrDraw = predictions.data.response[0].predictions.win_or_draw.includes("true") ? "Yes" : "No"
		// const overUnder = predictions.data.response[0].predictions.under_over.includes("-") 
        //         ? predictions.data.response[0].predictions.under_over.replace(/-/g, "U") 
        //         : predictions.data.response[0].predictions.under_over.replace(/+/g, "O")
		const advice = predictions.data.response[0].predictions.advice
	
		// tweet messages
		const content1 = `??? Arsenal face ${opponent} in ${days} day(s) ${hours} hr(s) ???? Stadium: ${stadium} ???
		Location: ${city} ???? League: ${leagueName} ??? Current Form: ${arsenalForm} ??? 
		#arsenal #afc #coyg #sportsBetting #freePicks #goonerBot`
	
		const content2 = `??? PREDICTION ???? ${advice} ???`

		// send tweets
		rwClient.v2.tweet(content1)
		if (days < 1) {
			rwClient.v2.tweet(content2)
		}
		// console.log(content1)
		// console.log(content2)

	} catch (error) {
		console.log(error)
	}
}

	// heroku uses GMT
	// 0 15 * * * = 8am Phoenix MST
	const job = cron.schedule("0 16 * * *", async () => {
		await getFixture()
		console.log("Successfully sent a tweet at: " + new Date())
})

module.exports = { getFixture, job }
