//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "./NotOpenZeppline/ERC20.sol";

contract FatShiba is ERC20 {
    uint256 public maxSupply = 10**(9+decimals());

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    
    mapping(bytes32 => mapping(address=>bool)) private _roles;

    bool public isPaused = false;

    constructor() ERC20("FAT SHIBA", "FINU") {
        _grantRole(ADMIN_ROLE,msg.sender);
    }

    modifier onlyRole(bytes32 role) {
        require(hasRole(role,msg.sender),"Not Authorized!");
        _;
    }

    function grantRole(bytes32 role, address account) public onlyRole(ADMIN_ROLE) {
        _grantRole(role, account);
    }

    function _grantRole(bytes32 role, address account) private {
        _roles[role][account] = true;
    }

    function revokeRole(bytes32 role, address account) public onlyRole(ADMIN_ROLE) {
        _roles[role][account] = false;
    }

    function hasRole(bytes32 role, address account) public view returns (bool) {
        return _roles[role][account];
    }

    function mint(address account, uint256 amount) public onlyRole(MINTER_ROLE){
        require(amount <= maxSupply - totalSupply(), "Can't mint over 1B tokens" );
        _mint(account,amount);
    }

    function burn(address account, uint256 amount) public onlyRole(BURNER_ROLE){
        _burn(account,amount);
    }

    function changePauseState() public onlyRole(ADMIN_ROLE) {
        isPaused=!isPaused;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override {
        super._beforeTokenTransfer(from,to,amount);
        require(!isPaused,"All transfer activities are paused.");
    }

}