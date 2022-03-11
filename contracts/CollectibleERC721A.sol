// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";

import "hardhat/console.sol";

import "erc721a/contracts/ERC721A.sol";

contract CollectibleERC721A is ERC721A, AccessControl {
    string private _baseURIValue = "";
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    uint256 public maxSupply;

    constructor(string memory baseURI, uint256 maxTokens)
        ERC721A("Open Art", "OPART")
    {
        _baseURIValue = baseURI;
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        maxSupply = maxTokens;
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721A, AccessControl)
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

    function mint(uint256 quantity) external payable onlyRole(MINTER_ROLE) {
        require(
            totalSupply() + quantity <= maxSupply,
            "Purchase would exceed max supply"
        );

        _safeMint(msg.sender, quantity);
    }
}
