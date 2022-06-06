# Decentralized Commerce Smart Contract

The Boson.sol contract can be found in the test folder. It is a simple contract which uses fungible ERC20 tokens as the payment mechanism, which can be exchanged for ether on the smart contract itself. These tokens can then be used to secure a product, which is represented through a _tokenID which points to a struct with its descriptive features (price, seller, state etc.). In this way, the product itself is represented in a Non-fungible Token manner, as each tokenID is unique. If the buyer purchases a product, they send the tokens to the smart contract where they are held in 'escrow. However, they are also then approved by the smart contract to send these tokens back to themselves or the seller. This is done through the erc20 _approve and transferFrom functions. The _approve function is an internal function, so it can only be used inside one of our functions, assuring that only in the right scenarios people can transfer the correct amount of tokens from the smart contract to the seller, or back to themselves. For the sake of the exercise i did not make any modifications to the ERC20 contract, however, it would be advisable to make the transferFrom function internal, as a buyer could transfer the tokens back to themselves, without changing the state of the order to COMPLAINT. It must also be noted that in the current format of this contract the buyer holds an asymmetric amount of power as they are the sole entity with control over the money held in escrow.



## Steps to run

1. git clone https://github.com/ILoomans/DCommerceSmartContract.git
2. cd Boson
3. npm i -g truffle
4. npm i -g ganache-cli
5. ganache-cli
6. Open new terminal
7. truffle test
