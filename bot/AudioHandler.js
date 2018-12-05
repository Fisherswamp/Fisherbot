let Path = require('path');
let audioData = require(Path.resolve(__dirname, "../config/audio_config.json"));
(function(){
	let audioDataLocal = audioData;
	


	module.exports.getAudioData = function(){
		return audioDataLocal;
	}

}());

