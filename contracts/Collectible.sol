// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "hardhat/console.sol";

contract Collectible is ERC721URIStorage, AccessControl {
    using SafeMath for uint256;
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    uint256 public constant MAX_TOKENS = 2;

    struct TokenData {
        uint256 id;
        string metadataUrl;
    }
    uint256 public totalSupply;

    constructor() ERC721("Jam3Collectible", "JAM3") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        totalSupply = 0;
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
            totalSupply.add(_tokensData.length) <= MAX_TOKENS,
            "Purchase would exceed max supply"
        );

        for (uint256 i = 0; i < _tokensData.length; i++) {
            if (totalSupply < MAX_TOKENS) {
                _safeMint(msg.sender, _tokensData[i].id);
                _setTokenURI(_tokensData[i].id, _tokensData[i].metadataUrl);
                totalSupply = totalSupply.add(1);
            }
        }
    }
}
