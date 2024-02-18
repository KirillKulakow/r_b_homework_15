// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

library StringFunctions {
  function compare(string memory str1, string memory str2) public pure returns (bool) {
    return keccak256(abi.encodePacked(str1)) == keccak256(abi.encodePacked(str2));
  }

  function isIncludesInArray(string[] memory array, string memory _string) public pure returns (bool){
    for (uint i = 0; i < array.length; i++) {
      string memory stringToFind = array[i];
      bool exists = compare(stringToFind, _string) ;
      if(exists == true) {
        return true;

      }
    }
    return false;
  }

  function concat(string[] calldata words) external pure returns (string memory) {
    bytes memory output;

    for (uint256 i = 0; i < words.length; i++) {
      bool isLastWord = i + 1 == words.length;
      if (isLastWord) {
        output = abi.encodePacked(output, words[i]);
      } else {
        output = abi.encodePacked(output, ", ", words[i]);
      }
    }

    return string(output);
  }
}

interface Living {
  function eat(string memory food) external returns (string memory);
}

abstract contract HasName {
  string internal _name;

  constructor(string memory name) {
    _name = name;
  }

  function getName() public view returns (string memory) {
    return _name;
  }
}

abstract contract Animal is Living {
  string[] allowFoods;
  string[] disallowFoods;

  constructor(string[] memory _allowFoods, string[] memory _disallowFoods) {
    allowFoods = _allowFoods;
    disallowFoods = _disallowFoods;
  }

  modifier eatOnly(string memory food) {
    require(StringFunctions.isIncludesInArray(allowFoods, food), string.concat("Can only eat ", StringFunctions.concat(allowFoods), " food"));
    _;
  }

  modifier badEat(string memory food) {
    require(!StringFunctions.isIncludesInArray(disallowFoods, food), string.concat("Bad choice. Can not eat ", food, " food"));
    _;
  }

  function eat(string memory food) view virtual public badEat(food) eatOnly(food) returns (string memory) {
    return string.concat(
      "Animal eats ", food
    );
  }

  function sleep() pure virtual public returns (string memory) {
    return "Z-z-z-z-z....";
  }

  function speak() pure virtual public returns (string memory) {
    return "...";
  }
}

contract Wolf is Animal {
  constructor() Animal(
    new string[](1),
    new string[](0)
  ) {
    allowFoods[0] = "meat";
  }

  function speak() pure override public returns (string memory) {
    return "Awooo";
  }
}

contract Dog is Animal, HasName {
  constructor(string memory name) HasName(name) Animal(
    new string[](2),
    new string[](1)
  ) {
    allowFoods[0] = "meat";
    allowFoods[1] = "plant";
    disallowFoods[0] = "choco";
  }
  function speak() pure override public returns (string memory) {
    return "Woof";
  }
}

contract Cow is Animal, HasName {
  constructor(string memory name) HasName(name) Animal(
    new string[](1),
    new string[](0)
  ) {
    allowFoods[0] = "plant";
  }

  function speak() pure override public returns (string memory) {
    return "Mooo";
  }
}

contract Horse is Animal, HasName {
  constructor(string memory name) HasName(name) Animal(
    new string[](1),
    new string[](0)
  ) {
    allowFoods[0] = "plant";
  }

  function speak() pure override public returns (string memory) {
    return "Igogo";
  }
}

contract Farmer {
  function feed(address animal, string memory food) view public returns (string memory) {
    return Animal(animal).eat(food);
  }

  function call(address animal) pure public returns (string memory){
    return Animal(animal).speak();
  }
}
