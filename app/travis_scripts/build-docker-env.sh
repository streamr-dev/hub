#!/usr/bin/env bash

#trap "killall background" EXIT # clean up background jobs

##
## Pulls down streamr-docker-dev and starts an engine-and-editor instance + associated services ##
##

source "${BASH_SOURCE%/*}/utils.sh"

RETRIES=50;
RETRY_DELAY=2s;

cd $TRAVIS_BUILD_DIR || exit 1

sudo /etc/init.d/mysql stop
sudo sysctl fs.inotify.max_user_watches=524288; sudo sysctl -p
sudo ifconfig docker0 10.200.10.1/24

git clone https://github.com/streamr-dev/streamr-docker-dev.git
streamr_docker_dev='streamr-docker-dev/streamr-docker-dev/bin.sh'

$streamr_docker_dev start cassandra

# wait for cassandra to come up
waitFor $RETRIES $RETRY_DELAY nc -zv 127.0.0.1 9042;

if [ $? -eq 1 ] ; then
    echo "cassandra 9042 never up.";
    $streamr_docker_dev log;
    $streamr_docker_dev ps;
    exit 1;
fi

# start everything except eth watcher
$streamr_docker_dev start 5;

# wait for E&E to come up
waitFor $RETRIES $RETRY_DELAY checkHTTP "engine-and-editor" 200 http://localhost:8081/streamr-core/login/auth;

# exit if E&E never comes up
if [ $? -eq 1 ] ; then
    echo "engine-and-editor never up";
    $streamr_docker_dev log;
    $streamr_docker_dev ps;
    exit 1;
fi

$streamr_docker_dev restart data-api; # let's restart it for good measure (?!)

# wait briefly for data-api to come up. it probably needs restarting again.
waitFor 20 3s checkHTTP "data-api" 401 http://localhost:8890/;

# what if we just wait like 5 minutes
sleep 300;

$streamr_docker_dev ps;
$streamr_docker_dev log;
