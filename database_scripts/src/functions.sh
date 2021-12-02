#!/bin/bash

DIR_PATH=$(dirname $0) 

checkPostgres () {
  if [[ $(id -u postgres 2> /dev/null) = "" ]]; then
    echo "Postgres doesn't seem to be installed";
    echo "Execute: sudo apt update && sudo apt install postgresql postgresql-contrib";
    exit;
  fi

  if [[ $(pgrep -u postgres -fa -- -D) = "" ]]; then
    echo "Postgres is not running. Trying to start it.";
    sudo service postgresql start;
  fi
}

createDatabase () {
  sudo su -c "psql -c \"CREATE DATABASE $1\";" postgres;
}

createDatabaseFromTemplate () {
  sudo su -c "psql -c \"CREATE DATABASE $1 TEMPLATE $2\";" postgres;
}

destroyDatabase () {
  sudo su -c "psql -c \"DROP DATABASE $1\";" postgres;
}

runScripts () {
  for f in $DIR_PATH/scripts/*; do
    echo "Running script $f...";
    sudo su -c "psql -d $1 -f $f" postgres;
  done
}
