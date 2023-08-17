// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract Poll {
    uint256 public cat;
    uint256 public dog;

    function voteCat() public {
        cat++;
    }

    function voteDog() public {
        dog++;
    }
}
