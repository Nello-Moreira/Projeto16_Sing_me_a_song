#!/bin/bash

DIR_PATH=$(dirname $0) 

source $DIR_PATH/src/functions.sh;

DATABASE=$(cat $DIR_PATH/database_name.txt);
DEV='_development';
TEST='_test';

echo "Checking postgres' status..." &&
checkPostgres &&

echo "Deleting database (production)..." &&
destroyDatabase $DATABASE &&

echo "Deleting database (development)..." &&
destroyDatabase "$DATABASE$DEV" &&

echo "Deleting database (test)..." &&
destroyDatabase "$DATABASE$TEST";
