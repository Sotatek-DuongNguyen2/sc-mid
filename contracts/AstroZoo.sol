//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "./NotOpenZeppline/ERC721.sol";

contract AstroZoo is ERC721 {

    uint public counter=0;

    constructor() ERC721("ASTRO ZOO", "AZOO"){}

    function _baseURI() internal pure override returns (string memory) {
        return "https://www.google.com/search?q=";
    }

    function mint() public {
        _safeMint(msg.sender,counter);
        counter++;
    }

}