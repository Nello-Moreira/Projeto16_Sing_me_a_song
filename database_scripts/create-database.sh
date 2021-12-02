#!/bin/bash

DIR_PATH=$(dirname $0) 

source $DIR_PATH/src/functions.sh;

DATABASE=$(cat $DIR_PATH/database_name.txt);
DEV='_development';
TEST='_test';

echo $DATABASE$'_teste'

echo "Checking postgres' status..." &&
checkPostgres &&

echo "Creating database (production)..." &&
createDatabase $DATABASE &&

echo "Running scripts..." &&
runScripts $DATABASE &&

echo "Creating database (development)..." &&
createDatabaseFromTemplate $DATABASE$DEV $DATABASE  &&

echo "Creating database (test)..." &&
createDatabaseFromTemplate $DATABASE$TEST $DATABASE;