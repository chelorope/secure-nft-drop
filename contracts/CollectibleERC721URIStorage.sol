// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

import "hardhat/console.sol";

contract CollectibleERC721URIStorage is ERC721URIStorage, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    uint256 public maxSupply;

    struct TokenData {
        uint256 id;
        string metadataUrl;
    }
    uint256 public totalSupply;

    constructor(uint256 maxTokens) ERC721("Open Art", "OPART") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        totalSupply = 0;
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

    function mint(TokenData[] memory _tokensData) public onlyRole(MINTER_ROLE) {
        require(
            totalSupply + _tokensData.length <= maxSupply,
            "Purchase would exceed max supply"
        );

        for (uint256 i = 0; i < _tokensData.length; i++) {
            if (totalSupply < maxSupply) {
                _safeMint(msg.sender, _tokensData[i].id);
                _setTokenURI(_tokensData[i].id, _tokensData[i].metadataUrl);
                totalSupply = totalSupply + 1;
            }
        }
    }
}
