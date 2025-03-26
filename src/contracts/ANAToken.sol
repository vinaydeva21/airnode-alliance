
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ANAToken
 * @dev ERC20 token for the AirNode Alliance ecosystem
 */
contract ANAToken is ERC20, ERC20Burnable, Ownable {
    // Cap on total supply
    uint256 public immutable cap;
    
    // Addresses that can mint tokens
    mapping(address => bool) public minters;
    
    event MinterAdded(address minter);
    event MinterRemoved(address minter);
    
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        uint256 _cap
    ) ERC20(name, symbol) Ownable(msg.sender) {
        require(_cap > 0, "Cap must be greater than 0");
        require(initialSupply <= _cap, "Initial supply cannot exceed cap");
        
        cap = _cap;
        
        if (initialSupply > 0) {
            _mint(msg.sender, initialSupply);
        }
        
        // Add deployer as minter
        minters[msg.sender] = true;
        emit MinterAdded(msg.sender);
    }
    
    /**
     * @dev Creates new tokens
     * @param to Address to receive the tokens
     * @param amount Amount of tokens to mint
     */
    function mint(address to, uint256 amount) external {
        require(minters[msg.sender], "Not authorized to mint");
        require(totalSupply() + amount <= cap, "Exceeds cap");
        
        _mint(to, amount);
    }
    
    /**
     * @dev Adds a new minter
     * @param minter Address to add as minter
     */
    function addMinter(address minter) external onlyOwner {
        require(minter != address(0), "Invalid address");
        require(!minters[minter], "Already a minter");
        
        minters[minter] = true;
        emit MinterAdded(minter);
    }
    
    /**
     * @dev Removes a minter
     * @param minter Address to remove as minter
     */
    function removeMinter(address minter) external onlyOwner {
        require(minters[minter], "Not a minter");
        
        minters[minter] = false;
        emit MinterRemoved(minter);
    }
}
