const { expect } = require("chai");
const { ethers } = require("hardhat");

let Token, token, owner, addr1, addr2;

beforeEach(async () => {
  Token = await ethers.getContractFactory("AstroZoo");
  token = await Token.deploy();
  await token.deployed();
  [owner, addr1, addr2] = await ethers.getSigners();
});
