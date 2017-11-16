#!/bin/bash
docker exec -it cli bash

peer chaincode invoke -n mycc -c '{"function":"initLedger","Args":[]}' -C myc
peer chaincode query -n mycc -c '{"function":"queryCar","Args":["CAR0"]}' -C myc
peer chaincode invoke -n mycc -c '{"function":"createCar","Args":["CAR100","Ferrari","Scuderia","Red","Jan"]}' -C myc
