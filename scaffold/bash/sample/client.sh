#!/bin/bash

curl -X POST -d "orderId=1" http://127.0.0.1:9093/v1/getDemoOrder
echo

exit 0