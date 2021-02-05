pragma solidity ^0.8.0;

import "./library/EnumerableSet.sol";

contract Boson{
    using EnumerableSet for EnumerableSet.AddressSet;
    using EnumerableSet for EnumerableSet.UintSet;
    address payable caddress;

    EnumerableSet.AddressSet Sellers;
    address public admin;
    // 0 -> Not for sale
    // 1 -> Item for sale
    // 2 -> Item bought
    // 3 -> Item received
    // 4 -> complaint
    
    // we will use enum 
    enum SaleState {NONE,SALE,BOUGHT,RECEIVED,COMPLAINT}

    struct item {
        string  title;
        uint256 price;
        address seller;
        SaleState saleState;
        address buyer;
    }
   
    constructor() {
        admin = msg.sender;
        caddress =payable(address(this));

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
   
    function addSeller(address _seller) isAdmin public {
        Sellers.add(_seller);
    }
   
   
    function addItemForSale(uint256 _tokenID, string memory _title,uint256 _price) idNotTaken(_tokenID) public{
        // require that the token index isnt already forsale
        itemsPerSeller[msg.sender].add(_tokenID);
        itemsForSale[_tokenID] = item(_title,_price,msg.sender,SaleState.SALE,address(0));
    }
   
   
    // still need to require that msg.value== the price
    function purchaseItem(uint256 _tokenID) tokenStateIs(_tokenID, SaleState.SALE) valueIs(itemsForSale[_tokenID].price) public payable{
         itemsForSale[_tokenID].saleState = SaleState.BOUGHT;
         itemsForSale[_tokenID].buyer = msg.sender;
    }
   
    function confirmReceived(uint256 _tokenID) tokenStateIs(_tokenID,SaleState.BOUGHT) senderIs(itemsForSale[_tokenID].buyer)public payable {
        payable(msg.sender).transfer(itemsForSale[_tokenID].price);
        itemsForSale[_tokenID].saleState=SaleState.RECEIVED;
    }
   
    function complaint(uint256 _tokenID) tokenStateIs(_tokenID,SaleState.BOUGHT) senderIs(itemsForSale[_tokenID].buyer) public payable{
        itemsForSale[_tokenID].saleState=SaleState.COMPLAINT;
        // track complaints
        //resend the funds to the buyer
        payable(msg.sender).transfer(itemsForSale[_tokenID].price);
    }
   
    function getContractBalance() public view returns(uint256){
        return address(this).balance;
    }
   
}