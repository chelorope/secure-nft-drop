// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/ECDSAUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

import "hardhat/console.sol";

contract CollectibleERC721SecurityUpgradeableV2Test is
    Initializable,
    ERC721Upgradeable,
    AccessControlUpgradeable,
    UUPSUpgradeable
{
    using ECDSAUpgradeable for bytes32;

    string public constant CONTRACT_VERSION = "V2";
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    uint256 public constant MAX_SUPPLY = 25;
    uint256 public constant MAX_TOKENS_PER_ADDRESS = 5;
    uint256 public constant TOKEN_PRICE = 0.00002 ether;
    address private constant _SIGNER =
        0xB10eFf9454bd358FbFdb1AF033a20768e9247cB6;

    uint256 public totalSupply;

    string private _baseURIValue;
    mapping(string => bool) private _usedNonces;
    mapping(address => uint256) public addressToMintedQuantity;

    function init(string memory baseURI) public initializer {
        __ERC721_init("Open Art", "OPART");
        __AccessControl_init();
        __UUPSUpgradeable_init();
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _baseURIValue = baseURI;
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyRole(DEFAULT_ADMIN_ROLE)
    {}

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721Upgradeable, AccessControlUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseURIValue;
    }

    function setBaseURI(string memory baseURI) external onlyRole(ADMIN_ROLE) {
        _baseURIValue = baseURI;
    }

    function mint(
        bytes32 hash,
        bytes memory signature,
        string memory nonce,
        uint256 quantity
    ) external payable {
        require(
            totalSupply + quantity <= MAX_SUPPLY,
            "Purchase would exceed max supply / test change"
        );
        require(
            addressToMintedQuantity[msg.sender] + quantity <=
                MAX_TOKENS_PER_ADDRESS,
            "Max tokens reached for this address"
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

        for (uint256 i = 0; i < quantity; i++) {
            _safeMint(msg.sender, totalSupply);
            totalSupply = totalSupply + 1;
        }

        addressToMintedQuantity[msg.sender] =
            addressToMintedQuantity[msg.sender] +
            quantity;
        _usedNonces[nonce] = true;
    }

    function matchAddresSigner(bytes32 hash, bytes memory signature)
        private
        pure
        returns (bool)
    {
        return _SIGNER == hash.recover(signature);
    }

    function hashTransaction(
        address sender,
        uint256 quantity,
        string memory nonce
    ) private pure returns (bytes32) {
        return
            keccak256(
                abi.encodePacked(
                    "\x19Ethereum Signed Message:\n32",
                    keccak256(abi.encodePacked(sender, quantity, nonce))
                )
            );
    }
}
