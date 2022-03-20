/*
********************************************************************************
**____________________________________________________________________________**
**_____/\/\/\/\/\___/\/\____________/\/\/\/\/\/\_/\/\__/\/\__/\/\_____________**
**____/\/\____/\/\_______/\/\__/\/\____/\/\___________/\/\__/\/\__/\/\/\/\/\__**
**___/\/\/\/\/\___/\/\____/\/\/\______/\/\_____/\/\__/\/\__/\/\______/\/\_____**
**__/\/\_________/\/\____/\/\/\______/\/\_____/\/\__/\/\__/\/\____/\/\________**
**_/\/\_________/\/\__/\/\__/\/\____/\/\_____/\/\__/\/\__/\/\__/\/\/\/\/\_____**
**____________________________________________________________________________**
**                                                                            **
**----- Author --------------{ PixTillz }-------------------------------------**
**----- File ----------------{ cubefusion-test.js }---------------------------**
**----- Created -------------{ 2022-03-20 10:27:43 }--------------------------**
**----- Updated -------------{ 2022-03-20 15:23:55 }--------------------------**
********************************************************************************
*/

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Solidify_Beginner_Cubes", function () {
  it("Deploy contract and test with wrong element", async function () {
    const CubeFusion = await ethers.getContractFactory("CubeFusion");
    
    const cf = await CubeFusion.deploy();
    await cf.deployed();

    await expect(cf.generateCube("wrongElementString")).to.revertedWith('Invalid Cube element.');
    // await expect(await cf.greet()).to.equal("Hello, world!");
  });

  // it("Should create a cube with wrong element and return an error", async function () {
  //   const CubeFusion = await ethers.getContractFactory("CubeFusion");
  //   const cf = await CubeFusion.deploy();
  //   await cf.deployed();
  //   expect(await cf.generateCube("wrongElementString")).to.revertedWith();

  //   // expect(await cf.greet()).to.equal("Hello, world!");

  //   // const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

  //   // // wait until the transaction is mined
  //   // await setGreetingTx.wait();

  //   // expect(await greeter.greet()).to.equal("Hola, mundo!");
  // });
});

// const { expect } = require("chai");
// const { ethers } = require("hardhat");

// describe("Greeter", function () {
//   it("Should return the new greeting once it's changed", async function () {
//     const Greeter = await ethers.getContractFactory("Greeter");
//     const greeter = await Greeter.deploy("Hello, world!");
//     await greeter.deployed();

//     expect(await greeter.greet()).to.equal("Hello, world!");

//     const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

//     // wait until the transaction is mined
//     await setGreetingTx.wait();

//     expect(await greeter.greet()).to.equal("Hola, mundo!");
//   });
// });

