a=$(ps aux | grep 'node ./bot/fisherbot.js' | grep -v grep | awk '{print $2}')
if [ -z "$a" ]
then
	echo "No process to stop"
else
	echo "Stopping current process $a"
	kill $a 
fi
node ./bot/fisherbot.js > ./log/stdout.txt 2> ./log/stderr.txt &
exit 0
