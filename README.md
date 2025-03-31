# Otaris Launchpad FrontEnd

This repository contains a MVP FrontEnd to serve Otaris Launchpad.

## Requirements

- Node.js 14.17.1

## Environment Variables

| Env var                  | Description                                     |
|--------------------------|-------------------------------------------------|
| REACT_APP_BASE_URL       | Backend API URL (only used for development)     |
| REACT_APP_WS_URL         | Websocket Server URL (only used for developemnt)|
| REACT_APP_CHAIN_ID       | Network ID                                      |

## Published URL

- Dev : https://otaris-dev-app.faculty.tools/
- UAT : https://otaris-uat-app.faculty.tools/
- PROD: https://app.otaris.io/

## Glossary

| Term                     | Definition                                      |
|--------------------------|-------------------------------------------------|
| Payment token            | address of the token in which contributions are made |
| Project token            | address of the token that is being sold during the fundraising process of a given project |
| Private sale             | a sale that is only accessible and visible for the private investor that is whitelisted to the given sale and able to contribute a fixed amount as defined in the investment contract|
| Public sale              | a sale that is visible to everyone, users need to apply to the whitelist of a public sale and they need to fit the criteria defined by the admin user to have a chance of getting whitelisted |

## Functionalties

- Sale Pools

 There are three types of the Sale : `Private Sale`, `Unlimited Sale`, `TierBased Sale`
 Users can participate the sale to get Project Tokens using the Payment Tokens

- Staking & Farming

 Users stake(deposite) a single token or LP tokens into Staking or Farming pool to get more rewards.

- MemberShip

 MemberShip NFT represents a given membership status for its holder. 
 Different levels of memberships with varying access levels to sales, linked to Membership NFTs.

# Project setup and run

## Install

`yarn install`

## Build docker image

`docker build -f ./Dockerfile `