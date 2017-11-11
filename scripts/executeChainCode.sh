#!/bin/bash
docker exec -it -e VERSION=0 cli bash

peer chaincode invoke -n mycc${VERSION} -c '{"function":"initLedger","Args":[]}' -C myc
peer chaincode query -n mycc${VERSION} -c '{"function":"queryCar","Args":["CAR0"]}' -C myc
peer chaincode invoke -n mycc${VERSION} -c '{"function":"createCar","Args":["CAR100","Ferrari","Scuderia","Red","Jan"]}' -C myc
