if [ ! -z "$DISCORD_API_KEY" ]
then
	mkdir -p ../login_info
	echo -e '{\n\t"login_id": "'$DISCORD_API_KEY'"\n}' > ../login_info/login.json
	node fisherbot.js
else
	echo "ERROR: Please pass discord api key via environment variable \"DISCORD_API_KEY\""
fi
