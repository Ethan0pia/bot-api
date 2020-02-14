const express = require('express');
let cors = require('cors');
const app = express();
app.use(cors());
const port = 3000;

let traderStatus = {};
let orbStatus = [];
let levelerStatus = [];
let tradePartner = "";
let givePartner = "";
let doneLeveling = [];
let giveTime = 0;
let tradeTime = 0;
let trade = false;
let give = false;
let quantity = 0;
let mod = false;

app.get('/reset', (req, res) => {
	try{
		traderStatus = {};
		orbStatus = [];
		levelerStatus = [];
		tradePartner = "";
		givePartner = "";
		doneLeveling = [];
		giveTime = 0;
		tradeTime = 0;
		trade = false;
		give = false;
		quantity = 0;
		mod = false;
		res.sendStatus(200);
	} catch(e){
		console.log(e);
		res.sendStatus(500);
	}
});

app.get('/removeMod', (req, res) => {
	try{
		this.mod = false;
		res.sendStatus(200);
	} catch(e){
		console.log(e);
		res.sendStatus(500);
	}
});

app.get('/', (req, res) => {
	try{
		let date = Date.now();
		let trader_Status = {};
		if(this.traderStatus !== {}){
			trader_Status = {
				"runtime" : this.traderStatus.runtime,
				"gp" : this.traderStatus.gp,
				"gph" : this.traderStatus.gph,
				"totalGp": this.traderStatus.totalGp,
				"lastCheckin" : Math.floor((date-this.traderStatus.lastCheckin)/1000)
			}
		}

		let orb_status = orbStatus.map(elem => {
			return {
				"userName": elem.userName,
				"name": elem.name,
				"name2": elem.name2,
				"currentAlias": elem.currentAlias,
				"runtime" : elem.runtime,
				"gp" : elem.gp,
				"gph" : elem.gph,
				"oph":elem.oph,
				"orbs": elem.orbs,
				"magicLevel": elem.magicLevel,
				"deaths": elem.deaths,
				"lastTrade": elem.lastTrade,
				"lastCheckin" : Math.floor((date-elem.lastCheckin)/1000)
			}
		});

		let leveler_status = levelerStatus.map(elem => {
			return {
				"userName": elem.userName,
				"level": elem.level,
				"name": elem.name,
				"runtime" : elem.runtime,
				"done": elem.done,
				"lastCheckin" : Math.floor((date-elem.lastCheckin)/1000)
			}
		});

		let response = {
			"trader_status": trader_Status,
			"orb_status": orb_status,
			"leveler_status": leveler_status,
			"done_leveling": doneLeveling,
			"trading": trade,
			"trade_partner": tradePartner,
			"giving_coins": give,
			"give_partner": givePartner,
			"give_quantity": quantity,
			"mod": mod
		}
		console.log("Request received");
		res.json(response);
	} catch(err){
		console.log(err);
		res.sendStatus(500);
	}
});

app.get('/info', (req, res) => {
	try{

		traderStatus = this.traderStatus;
		let response ='<table style="width:100%"><tr><th>BotName</th><th>Runtime</th><th>GP</th><th>GPH</th><th>Total GP</th><th>Last Check-in</th></tr>';
		if(traderStatus!==undefined && traderStatus!=={}){
			let lastCheckin = Math.floor((Date.now()-traderStatus.lastCheckin)/1000);
			let color = '"background-color:green;"';
			if(lastCheckin>30){
				color = '"background-color:red;"';
			}
			response = response.concat('' + `<tr><th>Trader</th><th>${traderStatus.runtime}</th><th>${traderStatus.gp}</th><th>${traderStatus.gph}</th><th>${traderStatus.totalGp}</th><th style=${color}>${lastCheckin}</th></tr></table>`);
		}
	
		if(orbStatus.length>0) {
			response = response.concat('<table style="width:100%"><tr><th>Orbs</th><th>Runtime</th><th>GP</th><th>GPH</th><th>oph</th><th>deaths</th><th>Magic Lvl</th><th>Last Trade</th><th>Last Check-in</th></tr>')
			orbStatus.forEach(bot=> {
				let lastCheckin = Math.floor((Date.now()-bot.lastCheckin)/1000);
				let color = '"background-color:green;"';
				if(lastCheckin>30) {
					color = '"background-color:red;"';
				}

				let orbColor = '""';
				if(bot.oph<300) {
					orbColor = '"background-color:red;"';
				}
				response = response.concat('' + `<tr><th>${bot.name + '/' + bot.name2}</th><th>${bot.runtime}</th><th>${bot.gp}</th><th>${bot.gph}</th><th style=${orbColor}>${bot.oph}</th><th>${bot.deaths}</th><th>${bot.magicLevel}</th><th>${bot.lastTrade}</th><th style=${color}>${lastCheckin}</th></tr>`);
			});
			resonse = response.concat('</table>');
		}

		if(levelerStatus.length>0) {
			response = response.concat('<table style="width:100%"><tr><th>Training</th><th>Runtime</th><th>Level</th><th>Last Check-in</th></tr>')
			levelerStatus.forEach(bot=> {
				let lastCheckin = Math.floor((Date.now()-bot.lastCheckin)/1000);
				let color = '"background-color:green;"';
				if(lastCheckin>30) {
					color = '"background-color:red;"';
				}
				response = response.concat('' + `<tr><th>${bot.name}</th><th>${bot.runtime}</th><th>${bot.level}</th><th style=${color}>${lastCheckin}</th></tr>`);
			});
			resonse = response.concat('</table>');
		}

		if(doneLeveling.length>0) {
			response = response.concat('<table style="width:100%"><tr><th>BotName</th><th>Level</th><th>Runtime</th></tr>')
			doneLeveling.forEach(bot=> {
				response = response.concat('' + `<tr><th>${bot.name}</th><th>${bot.level}</th><th>${bot.runtime}</th></tr>`);
			});
			resonse = response.concat('</table>');
		}
		resonse = response.concat('</table>');
		res.send(response);
	} catch(err) {
		console.log(err);
		res.sendStatus(500);
	}
});

app.get('/give', (req, res) => {
	try{
		console.log(req.rawHeaders);
		give = true;
		giveTime = Date.now();
		givePartner = "Ethan0pia";
		quantity = parseInt(req.query.quantity);
		res.json({
			"give": give,
			"givePartner": givePartner,
			"quantity": quantity
		});
	} catch(err){
		console.log(err);
		res.sendStatus(500);
	}
});

app.get('/nogive', (req, res) => {
	try{
		give = false;
		givePartner = "";
		giveTime = 0;
		quantity = 0;
		res.json({
			"give": give,
			"givePartner": givePartner,
			"quantity": quantity
		});
	} catch(err){
		console.log(err);
		res.sendStatus(500);
	}
});

app.get('/stop/orb', (req, res) => {
	try{
		orbStatus[parseInt(req.query.index)].stop = true;
		res.sendStatus(200);
	} catch(err){
		console.log(err);
		res.sendStatus(500);
	}
});

app.get('/stoptrader', (req, res) => {
	try{
		traderStatus.stop = true;
		res.sendStatus(200);
	} catch(err){
		console.log(err);
		res.sendStatus(500);
	}
});

app.get('/removetrader', (req, res) => {
	try{
		traderStatus = null;
		res.sendStatus(200);
	} catch(err){
		console.log(err);
		res.sendStatus(500);
	}
});


app.get('/stoporb', (req, res) => {
	try{
		orbStatus[parseInt(req.query.index)].stop = true;
		res.sendStatus(200);
	} catch(err){
		console.log(err);
		res.sendStatus(500);
	}
});

app.get('/removeorb', (req, res) => {
	try{
		orbStatus.splice(parseInt(req.query.index), 1);
		res.sendStatus(200);
	} catch(err){
		console.log(err);
		res.sendStatus(500);
	}
});

app.get('/stopleveler', (req, res) => {
	try{
		levelerStatus[parseInt(req.query.index)].stop = true;
		res.sendStatus(200);
	} catch(err){
		console.log(err);
		res.sendStatus(500);
	}
});

app.get('/removeleveler', (req, res) => {
	try{
		levelerStatus.splice(parseInt(req.query.index), 1);
		res.sendStatus(200);
	} catch(err){
		console.log(err);
		res.sendStatus(500);
	}
});

app.get('/removedone', (req, res) => {
	try{
		doneLeveling.splice(parseInt(req.query.index), 1);
		res.sendStatus(200);
	} catch(err){
		console.log(err);
		res.sendStatus(500);
	}
});

app.get('/removeall', (req, res) => {
	try{
		doneLeveling=[];
		orbStatus=[];
		levelerStatus=[];
		traderStatus=null;
		res.sendStatus(200);
	} catch(err){
		console.log(err);
		res.sendStatus(500);
	}
});

app.get('/stopall', (req, res) => {
	orbStatus.forEach((element)=> element.stop = true);
	levelerStatus.forEach((element)=> element.stop = true);
	if(traderStatus) {
		traderStatus.stop = true;
	}
	res.sendStatus(200);
});

app.get('/unstop', (req, res) => {
	orbStatus.forEach((element)=> element.stop = false);
	levelerStatus.forEach((element)=> element.stop = false);
	if(traderStatus) {
		traderStatus.stop = false;
	}
	res.sendStatus(200);
});

app.get('/status/trader', (req, res) => {
	try{
		let traderInfo = {
			runtime : req.query.runtime,
			gp : parseInt(req.query.gp),
			gph : parseInt(req.query.gph),
			totalGp: parseInt(req.query.totalGp),
			lastCheckin : Date.now()
		}
		let stopping = (req.query.stop == 'true');

		if(traderStatus) {
			if(stopping) {
				traderInfo.stop = false;
			} else {
				traderInfo.stop = traderStatus.stop;
			}
		} else {
			traderInfo.stop = false;
		}
		this.traderStatus = traderInfo;
		if(tradeTime!=0 && tradeTime<Date.now()-300000){
			tradePartner = "";
			trade = false;
			tradeTime = 0;
		}
		if(giveTime!=0 && giveTime<Date.now()-300000){
			givePartner = "";
			give = false;
			giveTime = 0;
			quantity=0;
		}
		let response = {
			"trade": trade,
			"tradePartner": tradePartner,
			"givePartner": givePartner,
			"give": give,
			"quantity": quantity,
			"stop": traderInfo.stop
		}
		res.json(response);
	} catch(err) {
		console.log(err);
		res.sendStatus(500);
	}
});


app.get('/status/orb', (req, res) => {
	try{
		let orbInfo = {
			userName: req.query.userName,
			name: req.query.name,
			name2: req.query.name2,
			runtime : req.query.runtime,
			currentAlias: req.query.currentAlias,
			gp : parseInt(req.query.gp),
			gph : parseInt(req.query.gph),
			oph: parseInt(req.query.oph),
			orbs: parseInt(req.query.orbs),
			deaths: parseInt(req.query.deaths),
			lastTrade: req.query.lastTrade,
			magicLevel: parseInt(req.query.magicLevel),
			lastCheckin : Date.now()
		}
		let trading = (req.query.trade == 'true');
		let modSeen = (req.query.mod == 'true');
		let giving = (req.query.give == 'true');
		let stopping = (req.query.stop == 'true');
		index = orbStatus.findIndex((elem)=>
		elem.name == orbInfo.name || elem.name == orbInfo.name2);
		
		if(modSeen){
			console.log("Mod seen by", orbInfo.name);
			this.mod=true;
		}
		if(index>=0) {
			if(stopping) {
				orbInfo.stop = false;
			} else {
				orbInfo.stop = orbStatus[index].stop;
			}
			orbStatus[index] = orbInfo;
		} else {
			orbInfo.stop = false;
			orbStatus.push(orbInfo);
		}

		if(trading) {
			trade = true;
			if(tradePartner == "") {
				tradePartner = req.query.userName;
			}
		} else if (tradePartner === req.query.userName) {
			tradePartner = "";
			trade=false;
			tradeTime=0;
		}
		
		if(giving) {
			give = true;
			if(givePartner == "") {
				giveTime = Date.now();
				quantity = parseInt(req.query.quantity);
				givePartner = orbInfo.userName;
			}
		} else if(givePartner === orbInfo.userName) {
			givePartner = "";
			give = false;
			quantity = 0;
			giveTime=0;
		}
		res.json({"stopBot": orbInfo.stop,"mod": this.mod});
	} catch(err){
		console.log(err);
		res.sendStatus(500);
	}
});

app.get('/status/leveler', (req, res) => {
	try{
		let levelerInfo = {
			userName: req.query.userName,
			level: req.query.level,
			name: req.query.name,
			runtime : req.query.runtime,
			done: req.query.done,
			lastCheckin : Date.now()
		}
		index = levelerStatus.findIndex((elem)=>
		elem.name == levelerInfo.name);
		let giving = (req.query.give == 'true');
		let done = (req.query.done == 'true');

		if(index>=0) {
			if(done) {
				doneLeveling.push(levelerStatus[index]);
				levelerStatus.splice(index, 1);
			} else {
				levelerInfo.stop = levelerStatus[index].stop;
				levelerStatus[index] = levelerInfo;
			}
		} else if(!done) {
			levelerInfo.stop = false;
			levelerStatus.push(levelerInfo);
		}

		if(giving) {
			give = true;
			if(givePartner == "") {
				quantity = parseInt(req.query.quantity);
				givePartner = levelerInfo.userName;
			}
		} else if(givePartner === levelerInfo.userName) {
			givePartner = "";
			give = false;
			quantity = 0;
			giveTime=0;
		}
		res.json({"stopBot": levelerInfo.stop});
	} catch(err) {
		console.log(err);
		res.sendStatus(500);
	}
});

app.listen(port, ()=> console.log("Listening on port ", port));