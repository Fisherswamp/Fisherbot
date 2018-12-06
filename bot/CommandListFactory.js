var Opus = require('node-opus');
var Path = require('path');
var AudioHandler = require(Path.resolve(__dirname, "AudioHandler.js"));

var prefix = "/";
var delimiter = ",";

var commands = [
	{
		name: "ping",
		arguments: 0,
		description: "Responds with pong, whenever the user enters \'ping\'.",
		isAdminCommand: false,
		method: function(message,args){
			message.channel.sendMessage("pong");
		}
	},
	{
		name: "clip",
		arguments: null,
		description: "Deals with song clips. First option is action type: 'play', 'stop', 'list'  or 'describe'."
				+ " Second option is the clip name."
				+ "\n Example: " + prefix + "clip" + delimiter + " play" + delimiter + " diamonds",
		isAdminCommand: false,
		method: function(message,args){
			// Voice only works in guilds, if the message does not come from a guild,
  			// we ignore it
			if (!message.guild) return;
			if(args.length == 0){
				message.channel.send("Unable to process the 'clip' command with 0 arguments."		
							+ " Use '" + prefix + "help" + delimiter + "clip' to see correct syntax."
					);
				return;
			}

			let audioData = AudioHandler.getAudioData();
			let audioDataDictionary = AudioHandler.getAudioDataDictionary();
			
			let action = args[0].trim();

			if(action == 'play'){
				if(args.length != 2){
					message.channel.send("I am not sure what clip you would like me to play." 
								+ " Use '" + prefix + "help" + delimiter + "clip' to see correct syntax."
						);
				}else{
					let song = args[1].trim();
					if(audioDataDictionary[song]){	
						playClip(audioDataDictionary[song], message);
					}else{
						message.channel.send("Unable to find clip " + song);
					}
				}
			}else if(action == 'stop'){
				if(args.length != 1){
					message.channel.send("Incorrect command usage. Try: " + prefix + "clip" + delimiter + " " + action);
				}else{
					playClip(null, message);
				}
			}else if(action == 'list'){	
				if(args.length != 1){
					message.channel.send("Incorrect command usage. Try: " + prefix + "clip" + delimiter + " " + action);
				}else{
					message.channel.send(Object.keys(audioDataDictionary));
				}
			}else if(action == 'describe'){
				if(args.length != 2){
					message.channel.send("I am not sure what clip you would like me to describe." 
								+ " Use '" + prefix + "help" + delimiter + "clip' to see correct syntax."
						);
				}else{
					let song = args[1].trim();
					if(audioDataDictionary[song]){
						message.channel.send(song + ": " + audioDataDictionary[song].description);
					}else{
						message.channel.send("Unable to find clip " + song);
					}

				}
			}else{
				message.channel.send("Unknown argument " + action
					+ ". Could you mean '" + prefix + "clip" + delimiter + " play" + delimiter + " " + action + "' ?");
			}
		}
	}
];

function playClip(songData, message){
	ch = message.member.voiceChannel;
	if(songData == null){
		message.channel.send("This function is still in development.");
		return;
	}
	if(ch == null){
		message.channel.send("Please join a channel first.");
	}else{
		message.member.voiceChannel.join().then(connection => {
			let pathString = Path.resolve(__dirname, "../audio_clips/" + songData.file_name);
			let dispatcher = connection.playFile(pathString);
			dispatcher.on('error', e => {
				console.log(e);	
			});

			dispatcher.on('debug', msg => {
				console.log(msg);
			});

			dispatcher.on('end', ()=> {
				console.log("Clip has finished playing file " + pathString);
				message.member.voiceChannel.leave();
			});

			dispatcher.setVolume(1);
		}).catch(
			function(error){
				message.channel.send("I have encountered an error trying to play this clip. Please ask my developer to check the error logs.");
				console.log(error);
			}
		);
	}
}

(function(){
	module.exports.getCommands = function(){
		return commands;
	}
}());
