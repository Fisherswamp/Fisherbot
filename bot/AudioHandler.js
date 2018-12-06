let Path = require('path');
let audioData = require(Path.resolve(__dirname, "../config/audio_config.json"));
(function(){
	
	
	module.exports.getAudioData = function(){
		return audioData;
	}


	module.exports.getAudioDataDictionary = function(){
		let audioDataDictionary = {};
		
		for(var i = 0; i < audioData.length; i++){
			audioDataDictionary[audioData[i].clip_command_name] = {
				"file_name": audioData[i].clip_file_name,
				"description": audioData[i].clip_description
			};
		}

		return audioDataDictionary;
	}

}());

