const { expect } = require("chai");
const { ethers } = require("hardhat");

let Token, token, owner, addr1, addr2, adminRole, minterRole, burnerRole;

beforeEach(async () => {
  Token = await ethers.getContractFactory("FatShiba");
  token = await Token.deploy();
  await token.deployed();
  [owner, addr1, addr2] = await ethers.getSigners();
  adminRole = await token.ADMIN_ROLE();
  minterRole = await token.MINTER_ROLE();
  burnerRole = await token.BURNER_ROLE();
});

describe("FatShiba", async () => {
  it("Should confirm the admin role of owner", async () => {
    expect(await token.hasRole(adminRole, owner.address)).to.equal(true);
  });

  it("Should return the correct max supply", async () => {
    expect(await token.maxSupply()).to.equal(
      ethers.utils.parseUnits("1000000000", 18)
    );
  });

  it("Should check minter role", async () => {
    expect(await token.hasRole(minterRole, owner.address)).to.equal(false);

    await expect(
      token.mint(owner.address, ethers.utils.parseUnits("100", 18))
    ).to.be.revertedWith("Not Authorized!");

    await token.grantRole(minterRole, owner.address);
    expect(await token.hasRole(minterRole, owner.address)).to.equal(true);

    await token.mint(owner.address, ethers.utils.parseUnits("100", 18));
    expect(await token.balanceOf(owner.address)).to.equal(
      ethers.utils.parseUnits("100", 18)
    );

    await expect(
      token.mint(owner.address, ethers.utils.parseUnits("1000000000", 18))
    ).to.be.revertedWith("Can't mint over 1B tokens");
  });

  it("Should check burner role", async () => {
    expect(await token.hasRole(burnerRole, owner.address)).to.equal(false);
    await token.grantRole(minterRole, owner.address);
    await token.mint(owner.address, ethers.utils.parseUnits("100", 18));
    await expect(
      token.burn(owner.address, ethers.utils.parseUnits("100", 18))
    ).to.be.revertedWith("Not Authorized!");

    await token.grantRole(burnerRole, owner.address);
    expect(await token.hasRole(burnerRole, owner.address)).to.equal(true);

    token.burn(owner.address, ethers.utils.parseUnits("100", 18));
    expect(await token.balanceOf(owner.address)).to.equal(0);
  });

  it("Check pause/unpause transfer", async () => {
    expect(await token.isPaused()).to.equal(false);
    await token.grantRole(minterRole, owner.address);
    await token.mint(owner.address, ethers.utils.parseUnits("100", 18));

    await token.transfer(addr1.address, ethers.utils.parseUnits("50", 18));
    expect(await token.balanceOf(owner.address)).to.equal(
      ethers.utils.parseUnits("50", 18)
    );

    await token.changePauseState();
    expect(await token.isPaused()).to.equal(true);

    await expect(
      token.transfer(addr2.address, ethers.utils.parseUnits("50", 18))
    ).to.be.revertedWith("All transfer activities are paused.");
  });
});
