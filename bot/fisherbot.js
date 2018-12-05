var FileSystem = require('fs');
var Opus = require('node-opus');
var Discord = require('discord.js');
var Path = require('path');
var AudioHandler = require(Path.resolve(__dirname, "AudioHandler.js"));
var prefix = "/";
var delimiter = ",";

var functions = [
	{
		name: "ping",
		arguments: 0,
		description: "Responds with pong, whenever the user enters \'ping\'.",
		isAdminCommand: false,
		method: function(message,args){
					message.channel.sendMessage("pong");
				}
	}
];

//TEST

console.log(AudioHandler.ping());

//
console.log("Running");

var bot = new Discord.Client();

bot.on('ready', () => {
  console.log('Initilization finished');
  bot.user.setActivity("Now in Fisherbox : D");
});

bot.on(
	"message",
	function(message){

		for(var i = 0; i < functions.length; i++){
			if(message.content.toLowerCase().startsWith(prefix + functions[i].name.toLowerCase())){
				if(functions[i].isAdminCommand && !isAdmin(message.member)){
					message.channel.sendMessage("You are not authorized to use this command");
				}else{
					let argsList = [];
					if(functions[i].arguments > 0){
						//argsList = message.content.split(" ");
						argsList = message.content.substring(functions[i].name.length+1).split(delimiter);
						argsList.splice(0,1);//remove first element in argsList, which is the comma
						//console.log(argsList);

					}
					if(argsList.length == functions[i].arguments){
						functions[i].method(message,argsList);
					}else{
						message.channel.sendMessage("This function has " + functions[i].arguments + " arguments, whereas you entered " + argsList.length + ".");
					}

				}
			}
		}

	}
);

bot.on("guildMemberRemove", (member) => {
	member.guild.defaultChannel.send(member.user + " has left the channel.");
});

bot.on('guildMemberAdd', member => {
	member.guild.defaultChannel.send(member.user + " has joined the channel.");
});

let content = JSON.parse(FileSystem.readFileSync(Path.resolve(__dirname, "../login_info/login.json"), "UTF-8"));

bot.login(content.login_id).catch(
	function(error){
		console.log("Error with login id " + content.login_id + " : " + error);
	}
);

