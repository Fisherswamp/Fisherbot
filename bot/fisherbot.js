var FileSystem = require('fs');
var Opus = require('node-opus');
var Discord = require('discord.js');
var Path = require('path');
var Commands = require(Path.resolve(__dirname, "CommandListFactory.js"));


var prefix = "/";
var delimiter = ",";



console.log("Running");

var bot = new Discord.Client();

bot.on('ready', () => {
  console.log('Initilization finished');
  bot.user.setActivity("Now in Fisherbox : D");
});

bot.on(
	"message",
	function(message){
		let functions = Commands.getCommands(); 
		for(var i = 0; i < functions.length; i++){
			if(message.content.toLowerCase().startsWith(prefix + functions[i].name.toLowerCase())){
				if(functions[i].isAdminCommand && !isAdmin(message.member)){
					message.channel.sendMessage("You are not authorized to use this command");
				}else{
					let argsList = [];
					let isDynamicArgumentFunction = (functions[i].arguments == null);
					
					if(functions[i].arguments > 0 || isDynamicArgumentFunction){
						argsList = message.content.substring(functions[i].name.length+1).split(delimiter);
						argsList.splice(0,1);//remove first element in argsList, which is the comma
						//console.log(argsList);

					}
					if(isDynamicArgumentFunction || argsList.length == functions[i].arguments){
						functions[i].method(message,argsList);
					}else{
						message.channel.sendMessage("This function (" + functions[i].name + ") has " + functions[i].arguments + " arguments, whereas you entered " + argsList.length + ".");
					}

				}
			}
		}

	}
);

bot.on("guildMemberRemove", (member) => {
	if(member.guild.defaultChannel){
		member.guild.defaultChannel.send(member.user + " has left the channel.");
	}
});

bot.on('guildMemberAdd', member => {
	if(member.guild.defaultChannel){
		member.guild.defaultChannel.send(member.user + " has joined the channel.");
	}
});


function isAdmin(user){
	return (user.hasPermission('ADMINISTRATOR') || user.id == "102514568432988160");
}


let content = JSON.parse(FileSystem.readFileSync(Path.resolve(__dirname, "../login_info/login.json"), "UTF-8"));

bot.login(content.login_id).catch(
	function(error){
		console.log("Error with login id " + content.login_id + " : " + error);
	}
);



