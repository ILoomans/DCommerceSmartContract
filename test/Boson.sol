pragma solidity ^0.8.0;

import "./library/EnumerableSet.sol";
import "./library/ERC20.sol";


// ERC20 will be used for the creation of a payment token for the sale of goods
// Ether is used to purchase these tokens from the smart contract and can then be resold to the contract to retrieve ether
contract Boson is ERC20{
    //
    using EnumerableSet for EnumerableSet.AddressSet;
    using EnumerableSet for EnumerableSet.UintSet;
    address payable caddress;
    uint256 public price;

    EnumerableSet.AddressSet Sellers;
    address public admin;

    enum SaleState {NONE,SALE,ESCROW,RECEIVED,COMPLAINT}

    struct item {
        string  title;
        uint256 price;
        address seller;
        SaleState saleState;
        address buyer;
    }
   
    constructor() ERC20("BOSON","BOS"){
        admin = msg.sender;
        caddress =payable(address(this));
        price = 1000000000/10**decimals();
    }
   
    mapping (uint256 => item) itemsForSale;
    mapping (address => EnumerableSet.UintSet) internal itemsPerSeller;
    //
    modifier isAdmin(){
        require(msg.sender==admin,'Only the admin can call this function');
        _;
    }
    modifier isSeller(){
        require(Sellers.contains(msg.sender),'Only a seller can call this function');
        _;
    }
    modifier idNotTaken(uint256 _tokenID){
        require(itemsForSale[_tokenID].seller == address(0),'The id has already been used');
        _;
    }
   
    modifier tokenStateIs(uint256 _tokenID, SaleState _saleState){
        require(itemsForSale[_tokenID].saleState==_saleState,'There is a mismatch between the function called and the state of the items transaction');
        _;
    }
   
    modifier senderIs(address _address){
        require(msg.sender==_address,'Mismatch between the message sender and the appropriate sender');
        _;
    }
   
    modifier valueIs(uint256 value){
        require(msg.value==value,'Mismatch between price and value sent');
        _;
    }
    function buyTokens(uint256 _tokens) valueIs(price * _tokens) payable public {
        _mint(msg.sender,_tokens);
    }
    
    function sellTokens(uint256 _amount) public payable{
        _burn(msg.sender,_amount);
        payable(msg.sender).transfer(_amount*price);
    }
   
    function addSeller(address _seller) isAdmin public {
        Sellers.add(_seller);
    }
   
   
    function addItemForSale(uint256 _tokenID, string memory _title,uint256 _price) idNotTaken(_tokenID) public{
        // require that the token index isnt already forsale
        itemsPerSeller[msg.sender].add(_tokenID);
        itemsForSale[_tokenID] = item(_title,_price,msg.sender,SaleState.SALE,address(0));
    }
   
    function purchaseItem(uint256 _tokenID,uint256 _amount) tokenStateIs(_tokenID, SaleState.SALE) public{
        require(_amount==itemsForSale[_tokenID].price,'The amount of tokens transfered does not meet the price of the product');
         transfer(address(this),_amount);
         _approve(address(this),msg.sender,_amount);
         itemsForSale[_tokenID].saleState = SaleState.ESCROW;
         itemsForSale[_tokenID].buyer = msg.sender;
    }
    
    
    
    // senderIs modifier is needed to make sure they are sending tokens for the correct product as tokens are ft's 
    // conceivable someone with tokens staked and approved to transfer some could take tokens from another person who has staked them using their tokenID creating confusion
   
    function confirmReceived(uint256 _tokenID) tokenStateIs(_tokenID,SaleState.ESCROW) senderIs(itemsForSale[_tokenID].buyer)public  {
        transferFrom(address(this),itemsForSale[_tokenID].seller,itemsForSale[_tokenID].price);
        itemsForSale[_tokenID].saleState=SaleState.RECEIVED;
    }
   
    function complaint(uint256 _tokenID) tokenStateIs(_tokenID,SaleState.ESCROW) senderIs(itemsForSale[_tokenID].buyer) public {
        transferFrom(address(this),msg.sender,itemsForSale[_tokenID].price);
        itemsForSale[_tokenID].saleState=SaleState.COMPLAINT;
    }
   
    function getContractBalance() public view returns(uint256){
        return balanceOf(address(this));
    }

    function sellerStatus(address _address) public view returns(bool){
        return Sellers.contains(_address);
    }
    
    function viewItem(uint256 _tokenID) public view returns (string memory,uint256,address,SaleState,address){
        return (itemsForSale[_tokenID].title,itemsForSale[_tokenID].price, itemsForSale[_tokenID].seller, itemsForSale[_tokenID].saleState, itemsForSale[_tokenID].buyer);
    }
}