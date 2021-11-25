// SPDX-License-Identifier: Unlicensed

pragma solidity ^0.8.0;

import "./NotOpenZeppline/ERC721.sol";

contract AstroZoo is ERC721 {

    uint8 public counter=0;

    constructor() ERC721("ASTRO ZOO", "AZOO"){}

    function _baseURI() internal pure override returns (string memory) {
        return "https://www.google.com/search?q=";
    }

    function mintCollectible() public {
        _safeMint(msg.sender,counter);
        counter++;
    }

}