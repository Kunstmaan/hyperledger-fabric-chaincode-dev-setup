#!/bin/bash
docker exec -it cli bash

peer chaincode invoke -n fabcar1 -c '{"function":"initLedger","Args":[]}' -C defaultchannel
peer chaincode query -n fabcar1 -c '{"function":"queryCar","Args":["CAR0"]}' -C defaultchannel
peer chaincode invoke -n fabcar1 -c '{"function":"createCar","Args":["CAR100","Ferrari","Scuderia","red","Eddy"]}' -C defaultchannel

peer chaincode invoke -n fabcar2 -c '{"function":"initLedger","Args":[]}' -C defaultchannel
peer chaincode query -n fabcar2 -c '{"function":"queryCar","Args":["CAR0"]}' -C defaultchannel
peer chaincode invoke -n fabcar2 -c '{"function":"createCar","Args":["CAR100","Ferrari","Scuderia","red","Eddy"]}' -C defaultchannel
