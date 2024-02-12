// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;


import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract ShrodingerCoin is ERC20, Ownable {
    address public pool;
    mapping(address => bool) public holders;
    address[] public holdersList;
    
    event Shroded(address indexed from, address indexed to, uint256 amount);


    constructor(uint _initialsuply) ERC20("Shrodinger coin", "SHROD"){
        _mint(msg.sender, _initialsuply);
    }


    
    function _transfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override {
        if (to == pool) {
            uint256 random = uint256(keccak256(abi.encodePacked(block.prevrandao, block.timestamp, amount)));
            if (random % 2 == 0 ) {
                address winner = holdersList[random % holdersList.length];
               super. _transfer(from, winner, amount);
                emit Shroded(from, winner, amount);
            } else {
                _burn(from, amount);
            }
            
        } else {
            if (holders[to] == false) {
                holders[to] = true;
                holdersList.push(to);
            }
            super._transfer(from, to, amount);
        }
    }

    function setLpadress(address _lpaddress) public onlyOwner {
        pool = _lpaddress;
    }

}      