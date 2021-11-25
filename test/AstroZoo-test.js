const { expect } = require("chai");
const { ethers } = require("hardhat");

let Token, token, owner, addr1, addr2;

beforeEach(async () => {
  Token = await ethers.getContractFactory("AstroZoo");
  token = await Token.deploy();
  await token.deployed();
  [owner, addr1, addr2] = await ethers.getSigners();
});

describe("AstroZoo", async () => {
  it("Should mint", async () => {
    await token.mint();
    expect(await token.ownerOf(0)).to.equal(owner.address);
    expect(await token.balanceOf(owner.address)).to.equal(1);
  });

  it("Should return token URI", async () => {
    await token.mint();
    expect(await token.tokenURI(0)).to.equal(
      "https://www.google.com/search?q=0"
    );
    await token.mint();
    expect(await token.tokenURI(1)).to.equal(
      "https://www.google.com/search?q=1"
    );
  });
});
