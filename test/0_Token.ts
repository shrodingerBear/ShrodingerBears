import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Shrod", function () {

  async function deployShrodFixture() {
    const [owner, user1,user2,pool] = await ethers.getSigners();

    const Shrod = await ethers.getContractFactory("ShrodingerCoin");
    const shrod = await Shrod.deploy(ethers.parseEther("10000"));

    return { shrod, owner, user1,user2 ,pool};
  }

  describe("Token", function () {
    it("should mint the correct amount of tokens", async function () {
      const { shrod, owner} = await loadFixture(deployShrodFixture);

      expect(await shrod.balanceOf(owner.address)).to.equal(ethers.parseEther("10000"));
    });

    it("Should not activate the shrodinger if the destination is not the pool", async function () {
      const { shrod, owner, user1} = await loadFixture(deployShrodFixture);

      await shrod.connect(owner).transfer(user1.address, ethers.parseEther("20"));
      expect(await shrod.balanceOf(user1.address)).to.equal(ethers.parseEther("20"));
    } );

    it("Should set the pool address", async function () {
      const { shrod, owner, pool} = await loadFixture(deployShrodFixture);

      await shrod.connect(owner).setLpadress(pool.address);
      expect(await shrod.pool()).to.equal(pool.address);
    } );

    it("THe shrod part should work properly", async function () {
      const { shrod, owner, user1, pool} = await loadFixture(deployShrodFixture);

      await shrod.connect(owner).setLpadress(pool.address);
      
      await shrod.connect(owner).transfer(user1.address, ethers.parseEther("20"));

      let tx = await shrod.connect(owner).transfer(pool.address, ethers.parseEther("20"));
      let receipt = await tx.wait()

      if (receipt.logs[0].args[1] == user1.address) {
        expect(await shrod.balanceOf(user1.address)).to.equal(ethers.parseEther("40"));
      }else{
        expect(await shrod.balanceOf(user1.address)).to.equal(ethers.parseEther("20"));
      }
      
    } );


  });
});

