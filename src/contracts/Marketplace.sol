//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.5.16;

contract Marketplace {
    string public name;
    uint public productCount = 0;
    mapping(uint => Product) public products;

    struct Product {        
        uint id;
        string name;
        uint price;
        address payable owner;
        bool purchased;
    }

    event ProductCreated(
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased
    );

    event ProductPurchased(
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased
    );

    constructor() public {
        name = "Dapp University Marketplace";
    }

    function createProduct(string memory _name, uint _price) public {
        //mrequire a valid name
        require(bytes(_name).length > 0);
        //require a valid price
        require(_price > 0);
        //Increment Product Count
        productCount ++;
        //create the product
        products[productCount] = Product(productCount, _name, _price, msg.sender, false);
        //trigger an event
        emit ProductCreated(productCount, _name, _price, msg.sender, false);
    }

    function purchaseProduct(uint _id) public payable {
        //fetch product
        Product memory _product = products[_id];
        //fetch owner
        address payable _seller = _product.owner;
        //make sure the product has valid id
        require(_product.id > 0 && _product.id <= productCount);
        //make sure enough eth
        require(msg.value >= _product.price);
        //require that product hasn't already been purchased
        require(!_product.purchased);
        //require that buyer is not seller
        require(_seller != msg.sender);
        //purchase product
        //transfer ownership to buyer
        _product.owner = msg.sender;
        //mark as purchased
        _product.purchased = true;
        //update the product
        products[_id] = _product;
        //pay the seller by sending them ETH
        address(_seller).transfer(msg.value);
        //trigger an event
        emit ProductPurchased(productCount, _product.name, _product.price, msg.sender, true);
    }
}