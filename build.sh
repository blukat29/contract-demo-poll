#!/bin/sh

npm run build
npx hardhat compile

cd app
npm run build

