FROM ubuntu:18.04

RUN apt-get update -y && apt-get install -y autoconf \
	curl \
	git \
	gnupg \
	g++ \
	libtool \
	make

#RUN git clone https://github.com/Fisherswamp/Fisherbot.git /app/

RUN curl -sL https://deb.nodesource.com/setup_11.x | bash -
RUN apt-get update && apt-get install -y nodejs

COPY ./bot/ /app/bot/
WORKDIR /app/bot/

RUN npm install

CMD ["/bin/bash", "wrapper.sh"]
