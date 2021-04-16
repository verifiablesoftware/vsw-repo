FROM ubuntu:18.04

WORKDIR /root

ENV DEBIAN_FRONTEND=noninteractive
RUN apt update
RUN apt install -y python3-pip
RUN pip3 install vsw
RUN apt-key adv --keyserver keyserver.ubuntu.com --recv-keys CE7709D068DB5E88
RUN apt-get install -y software-properties-common
RUN add-apt-repository "deb https://repo.sovrin.org/sdk/deb bionic stable"
RUN apt update
RUN apt install -y libindy
RUN apt install curl -ycurl -sL https://deb.nodesource.com/setup_12.x | bash -
RUN apt install -y nodejs
RUN apt install -y wget
RUN apt install -y unzip

COPY . /root/tests
