// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
//import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
//import "@openzeppelin/contracts/access/Ownable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.3/contracts/token/ERC721/ERC721.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.3/contracts/access/Ownable.sol";


contract Land is ERC721, Ownable {
    struct Building {
        string name;
        address owner;
        int256 posX;
        int256 posY;
        int256 posZ;
        uint256 sizeX;
        uint256 sizeY;
        uint256 sizeZ;
        uint256 purchasePrice;
        address operator;
        
    }

    uint256 public cost;
    uint256 public currentSupply = 0;
    uint256 public maxSupply = 13;

    // store building variable, when new Building is created, store to buildings
    Building[] public buildings;

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _initCost
    ) ERC721(_name, _symbol) {
        cost = _initCost;
        _initializeBuildings();
    }
    
    // create 13 initial buildings, waiting users to mint
    function _initializeBuildings() private {
        buildings.push(
            Building("land1", address(0x0), 0, 0, 0, 10, 10, 10, 0, address(0))
        );
        buildings.push(
            Building("land2", address(0x0), 0, 10, 0, 10, 5, 3, 0, address(0))
        );
        buildings.push(
            Building("land3", address(0x0), 0, -10, 0, 10, 5, 3,0, address(0))
        );
        buildings.push(
            Building("land4", address(0x0), 10, 0, 0, 5, 25, 5, 0, address(0))
        );
        buildings.push(
            Building("land5", address(0x0), -10, 0, 0, 5, 25, 5, 0, address(0))
        );
        buildings.push(
            Building("land6", address(0x0), 20, 0, 5, 10, 25, 10, 0, address(0))
        );
        buildings.push(
            Building("land7", address(0x0), -20, 0, 5, 10, 25, 10, 0, address(0))
        );
        buildings.push(
            Building("land8", address(0x0), 0, 20, 5, 25, 10, 3, 0, address(0))
        );
        buildings.push(
            Building("land9", address(0x0), 0, -20, 5, 25, 10, 3, 0, address(0))
        );
        buildings.push(
            Building("land10", address(0x0), 20, 20, 5, 7, 7, 5, 0, address(0))
        );
        buildings.push(
            Building("land11", address(0x0), 20, -20, 5, 7, 7, 5, 0, address(0))
        );
        buildings.push(
            Building("land12", address(0x0), -20, -20, 5, 7, 7, 5, 0, address(0))
        );
        buildings.push(
            Building("land13", address(0x0), -20, 20, 5, 7, 7, 5, 0, address(0))
        );
     
    }
    // buy property
    function mint(uint256 _id) public payable {
        require(currentSupply <= maxSupply);
        require(buildings[_id - 1].owner == address(0x0));
        require(msg.value >= cost);

        buildings[_id - 1].owner = msg.sender;
        buildings[_id - 1].purchasePrice = cost;
        currentSupply= currentSupply + 1;
        _safeMint(msg.sender, _id);
    }

    // transfer ownership
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory _data
    ) public override {
        require(
            _isApprovedOrOwner(_msgSender(), tokenId),
            "ERC721: transfer caller is not owner nor approved"
        );

        // Update Building ownership
        _safeTransfer(from, to, tokenId, _data);
        buildings[tokenId - 1].owner = to;
        
        // clear pending request
        if(buildings[tokenId - 1].operator == buildings[tokenId - 1].owner){
            buildings[tokenId - 1].operator = address(0);
        }
        
    }

    // get all buildings info
    function getBuildings() public view returns (Building[] memory) {
        return buildings;
    }

    // get specific building info 
    function getBuilding(uint256 _id) public view returns (Building memory) {
        return buildings[_id - 1];
    }

    // Owner can revise cost
    function reviseCost(uint256 _cost) public{
        cost = _cost;
    }

    // Buy can revise name
    function reviseName(uint256 _id, string memory newName) public{
        buildings[_id - 1].name = newName;
    }

    // operator request ownership transfer from current owner
    function requestTransfer(uint256 _id, address _operator) public {
        require(_operator != address(0), "Invalid operator address");
        require(_operator != buildings[_id - 1].owner, "Invalid operator address");
        buildings[_id - 1].operator = _operator;
    }


}