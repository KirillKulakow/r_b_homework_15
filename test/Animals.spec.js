const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const chai = require("chai");
const { ethers} = require("hardhat");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

const { expect } = chai;
const HORSE_NAME = "March";
const DOG_NAME = "HASKY";

describe("Contracts Animals", function () {
  async function deployHorseAndFarmerFixture() {
    const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
    const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;

    const library = await ethers.getContractFactory("StringFunctions");
    const resultLib = await library.deploy();
    const libAddress = await resultLib.getAddress();

    const HorseContract = await ethers.getContractFactory("Horse", {
      libraries: {
          StringFunctions: libAddress,
      }
    });
    const horseDeployed = await HorseContract.deploy(HORSE_NAME);

    const DogContract = await ethers.getContractFactory("Dog", {
        libraries: {
            StringFunctions: libAddress,
        }
    });
    const dogDeployed = await DogContract.deploy(DOG_NAME);

    const FarmerContract = await ethers.getContractFactory("Farmer");
    const farmerDeployed = await FarmerContract.deploy();

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    return { farmer: farmerDeployed, horse: horseDeployed, dog: dogDeployed, unlockTime, owner, otherAccount };
  }

  describe("Horse and Farmer", function () {
        // Horse has the correct name.
        // Horse can sleep.
        // Horse can eat “plant”.
        // Horse cannot eat ”meat”, ”not-food”, ”plastic”.
        // Farmer can call Horse, Horse responds correctly (”Igogo” або інші відповідні звуки які видає ваш контракт Horse).
        // Farmer can feed Horse with plant(if you have any other plant-based food - it is okay.
        // Farmer cannot feed Horse with anything else(”meat”,”plastic”,”fingers”,etc).

    it("Horse has the correct name.", async function () {
      this.timeout(60000);
      const { horse } = await loadFixture(deployHorseAndFarmerFixture);
      const horseAddress = await horse.getAddress();
      const horseContract = await ethers.getContractAt("Horse", horseAddress);
      const response = await horseContract.getName();
      expect(response).to.equal(HORSE_NAME);
    });

    it("Horse can sleep.", async function () {
      this.timeout(60000);
      const { horse } = await loadFixture(deployHorseAndFarmerFixture);
      const horseAddress = await horse.getAddress();
      const horseContract = await ethers.getContractAt("Horse", horseAddress);
      await expect(horseContract.sleep()).to.eventually.be.not.rejected;
      const response = await horseContract.sleep();
      expect(response).to.equal("Z-z-z-z-z....");
    });

    it("Horse can eat “plant”.", async function () {
        this.timeout(30000);
        const { horse } = await loadFixture(deployHorseAndFarmerFixture);
        const horseAddress = await horse.getAddress();
        const horseContract = await ethers.getContractAt("Horse", horseAddress);
        expect(horseContract.eat("plant")).to.eventually.be.not.rejected;
    });

    it("Horse cannot eat ”meat”, ”not-food”, ”plastic”.", async function () {
        const { horse } = await loadFixture(deployHorseAndFarmerFixture);
        const horseAddress = await horse.getAddress();
        const horseContract = await ethers.getContractAt("Horse", horseAddress);
        await expect(horseContract.eat("meat")).to.eventually.be.rejected;
    });

    it("Farmer can call Horse.", async function () {
        const { farmer, horse } = await loadFixture(deployHorseAndFarmerFixture);
        const horseAddress = await horse.getAddress();
        const farmerAddress = await farmer.getAddress();
        const farmerContract = await ethers.getContractAt("Farmer", farmerAddress);
        await expect(farmerContract.call(horseAddress)).to.eventually.be.not.rejected;
        const response = await farmerContract.call(horseAddress);
        expect(response).to.equal("Igogo");
    });

    it("Farmer can feed Horse with plant", async function () {
        const { farmer, horse } = await loadFixture(deployHorseAndFarmerFixture);
        const horseAddress = await horse.getAddress();
        const farmerAddress = await farmer.getAddress();
        const farmerContract = await ethers.getContractAt("Farmer", farmerAddress);
        await expect(farmerContract.feed(horseAddress, "plant")).to.eventually.be.not.rejected;
    });

    it("Farmer cannot feed Horse with meat, plastic", async function () {
        const { farmer, horse } = await loadFixture(deployHorseAndFarmerFixture);
        const horseAddress = await horse.getAddress();
        const farmerAddress = await farmer.getAddress();
        const farmerContract = await ethers.getContractAt("Farmer", farmerAddress);
        await expect(farmerContract.feed(horseAddress, "meat")).to.eventually.be.rejected;
        await expect(farmerContract.feed(horseAddress, "plastic")).to.eventually.be.rejected;
    });
  });

  describe("Dog and Farmer", function () {
      // Dog has the correct name.
      // Dog can sleep.
      // Dog can eat “plant”.
      // Dog can eat ”meat”.
      // Dog cannot eat ”not-food”, ”plastic”, ”chocolate”.
      // Farmer can call Dog, Dog responds correctly.(”Woof” або інші відповідні звуки які видає ваш контракт Dog)
      // Farmer can feed Dog with ”meat”,”plant”.
      // Farmer cannot feed Dog with ”not-food”, ”plastic” and anything else.
      it("Dog has the correct name", async function () {
          const { dog } = await loadFixture(deployHorseAndFarmerFixture);
          const dogAddress = await dog.getAddress();
          const dogContract = await ethers.getContractAt("Dog", dogAddress);
          const response = await dogContract.getName();
          expect(response).to.equal(DOG_NAME);
      });

      it("Dog can sleep.", async function () {
          const { dog } = await loadFixture(deployHorseAndFarmerFixture);
          const dogAddress = await dog.getAddress();
          const dogContract = await ethers.getContractAt("Dog", dogAddress);
          await expect(dogContract.sleep()).to.eventually.be.not.rejected;
          const response = await dogContract.sleep();
          expect(response).to.equal("Z-z-z-z-z....");
      });

      it("Dog can eat plant.", async function () {
          const { dog } = await loadFixture(deployHorseAndFarmerFixture);
          const dogAddress = await dog.getAddress();
          const dogContract = await ethers.getContractAt("Dog", dogAddress);
          await expect(dogContract.eat("plant")).to.eventually.be.not.rejected;
      });

      it("Dog can eat meat.", async function () {
          const { dog } = await loadFixture(deployHorseAndFarmerFixture);
          const dogAddress = await dog.getAddress();
          const dogContract = await ethers.getContractAt("Dog", dogAddress);
          await expect(dogContract.eat("meat")).to.eventually.be.not.rejected;
      });

      it("Dog can`t eat choco.", async function () {
          const { dog } = await loadFixture(deployHorseAndFarmerFixture);
          const dogAddress = await dog.getAddress();
          const dogContract = await ethers.getContractAt("Dog", dogAddress);
          await expect(dogContract.eat("choco")).to.eventually.be.rejected;
      });

      it("Dog can`t eat plastic.", async function () {
          const { dog } = await loadFixture(deployHorseAndFarmerFixture);
          const dogAddress = await dog.getAddress();
          const dogContract = await ethers.getContractAt("Dog", dogAddress);
          await expect(dogContract.eat("plastic")).to.eventually.be.rejected;
      });

      it("Farmer can call Dog.", async function () {
          const { dog, farmer } = await loadFixture(deployHorseAndFarmerFixture);
          const dogAddress = await dog.getAddress();
          const farmerAddress = await farmer.getAddress();
          const farmerContract = await ethers.getContractAt("Farmer", farmerAddress);
          await expect(farmerContract.call(dogAddress)).to.eventually.be.not.rejected;
          const response = await farmerContract.call(dogAddress);
          expect(response).to.equal("Woof");
      });

      it("Farmer can feed Dog with plant and meat", async function () {
          const { dog, farmer } = await loadFixture(deployHorseAndFarmerFixture);
          const dogAddress = await dog.getAddress();
          const farmerAddress = await farmer.getAddress();
          const farmerContract = await ethers.getContractAt("Farmer", farmerAddress);
          await expect(farmerContract.feed(dogAddress, "plant")).to.eventually.be.not.rejected;
          await expect(farmerContract.feed(dogAddress, "meat")).to.eventually.be.not.rejected;
      });

      it("Farmer cannot feed Horse with meat, plastic", async function () {
          const { dog, farmer } = await loadFixture(deployHorseAndFarmerFixture);
          const dogAddress = await dog.getAddress();
          const farmerAddress = await farmer.getAddress();
          const farmerContract = await ethers.getContractAt("Farmer", farmerAddress);
          await expect(farmerContract.feed(dogAddress, "not-food")).to.eventually.be.rejected;
          await expect(farmerContract.feed(dogAddress, "plastic")).to.eventually.be.rejected;
      });
  })
});
