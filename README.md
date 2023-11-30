# Virland - Virtual Land Ownership
Virland is a metaverse platform that enables users to buy, transfer, and own virtual land, creating immersive virtual experiences that mirror real-life scenarios.

Website: https://virland.webflow.io/

## Project Overview:
This project utilizes the ERC-721 standard for non-fungible tokens (NFTs). The front-end is developed using the React framework, while the blockchain contract is written in Solidity. The web application allows users to mint new tokens, transfer ownership of tokens, and store and manage their tokens on the blockchain. Each token in this project represents a unique building within the virtual land.

## Running the Project

To start the program, please follow the steps below:

1. Install web dependencies:
   ```
   $ npm install
   ```
   Note: Node.js must be installed.

2. Connect to the AxiomLedger Testnet:
   - Make sure you have the Metamask wallet installed.
   - Refer to the [Axiomesh Testnet documentation](https://docs.axiomesh.io/en/documentation/getting-started/resources/resources) to add the RPC address, chain ID, and token symbol to Metamask.

3. Compile and deploy the contract:
   - By default, the contract is deployed at address "0x747B998A0E472Ae23ECc34dc124B1e0F0A736814".
   - If you want to deploy a new contract:
     - Go to Remix and upload the `land.sol` file.
     - Compile and deploy the contract.
     - Copy the new contract address.
     - Replace the contract address in `src/App.js` line 60 with the new contract address.
   - Deployment Process in Remix:
     - ENVIRONMENT: Select "injected Provider - MetaMask".
     - ACCOUNT: Choose any account to be the deployer address.
     - CONTRACT: Select `land.sol`.
     - DEPLOY:
       - _NAME: Choose any preferred name.
       - _SYMBOL: Choose any preferred symbol.
       - _INITCOST: Set the initial cost for buying a land.
     - Example:
       ![5871701325171_ pic](https://github.com/ZixinMa27/MSBD5017Project/assets/72734552/53a640de-5842-4228-8629-c815a4c4e9c1)

4. Run the web application:
   ```
   $ npm start
   ```
   The web application will be accessible at http://localhost:3000/.
