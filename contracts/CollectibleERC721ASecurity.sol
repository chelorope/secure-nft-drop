// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract CollectibleERC721ASecurity is ERC721A {
    using ECDSA for bytes32;

    uint256 public constant MAX_SUPPLY = 25;
    uint256 public constant TOKEN_PRICE = 0.00002 ether;

    string private _baseURIValue;
    mapping(string => bool) private _usedNonces;
    address private _signerAddress;

    constructor(string memory baseURI) ERC721A("Open Art", "OPART") {
        _baseURIValue = baseURI;
        _signerAddress = msg.sender;
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721A)
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

    function mint(
        bytes32 hash,
        bytes memory signature,
        string memory nonce,
        uint256 quantity
    ) external payable {
        console.log("Transaction Hash");
        console.logBytes32(hashTransaction(msg.sender, quantity, nonce));
        require(
            totalSupply() + quantity <= MAX_SUPPLY,
            "Purchase would exceed max supply"
        );
        require(
            msg.value >= TOKEN_PRICE * quantity,
            "Not enough eth transfered"
        );
        require(
            hashTransaction(msg.sender, quantity, nonce) == hash,
            "Failed validating hash"
        );
        require(!_usedNonces[nonce], "Hash already used");
        require(matchAddresSigner(hash, signature), "Direct mint disallowed");

        _safeMint(msg.sender, quantity);

        _usedNonces[nonce] = true;
    }

    function matchAddresSigner(bytes32 hash, bytes memory signature)
        private
        view
        returns (bool)
    {
        return _signerAddress == hash.recover(signature);
    }

    function hashTransaction(
        address sender,
        uint256 quantity,
        string memory nonce
    ) private pure returns (bytes32) {
        bytes32 hash = keccak256(abi.encodePacked(sender, quantity, nonce));

        return hash;
    }
}
