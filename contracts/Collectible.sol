// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "hardhat/console.sol";

contract Collectible is ERC721, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    uint256 public totalSupply;
    uint256 public maxSupply;

    string private _baseURIValue = "";

    constructor(string memory baseURI, uint256 maxTokens)
        ERC721("Open Art", "OPART")
    {
        _baseURIValue = baseURI;
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        maxSupply = maxTokens;
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseURIValue;
    }

    function setBaseURI(string memory baseURI) external {
        _baseURIValue = baseURI;
    }

    function mint(uint256 quantity) public onlyRole(MINTER_ROLE) {
        require(
            totalSupply + quantity <= maxSupply,
            "Purchase would exceed max supply"
        );

        for (uint256 i = 0; i < quantity; i++) {
            uint256 tokenId = totalSupply;
            if (totalSupply < maxSupply) {
                _safeMint(msg.sender, tokenId);
                totalSupply = totalSupply + 1;
            }
        }
    }
}
