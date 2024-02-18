const { ethers } = require("hardhat");

async function main() {
    const CONTRACT_REF = { cow: "", horse: "", wolf: "", farmer: "" };

    const library = await ethers.getContractFactory("StringFunctions");
    const resultLib = await library.deploy();
    await resultLib.deploymentTransaction().wait(2);
    const libAddress = await resultLib.getAddress();

    //Cow, Horse, Wolf і Farmer
    const CowContract = await ethers.getContractFactory("Cow", {
        libraries: {
            StringFunctions: libAddress,
        }
    });
    const cowDeployed = await CowContract.deploy("Buryonka");
    await cowDeployed.deploymentTransaction().wait(2);
    CONTRACT_REF.cow = await cowDeployed.getAddress();
    console.log(`Created Cow Contract`);

    const HorseContract = await ethers.getContractFactory("Horse", {
        libraries: {
            StringFunctions: libAddress,
        }
    });
    const horseDeployed = await HorseContract.deploy("March");
    await horseDeployed.deploymentTransaction().wait(2);
    CONTRACT_REF.horse = await horseDeployed.getAddress();
    console.log(`Created Horse Contract`);

    const WolfContract = await ethers.getContractFactory("Wolf", {
        libraries: {
            StringFunctions: libAddress,
        }
    });
    const wolfDeployed = await WolfContract.deploy();
    await wolfDeployed.deploymentTransaction().wait(2);
    CONTRACT_REF.wolf = await wolfDeployed.getAddress();
    console.log(`Created Wolf Contract`);

    const FarmerContract = await ethers.getContractFactory("Farmer");
    const farmerDeployed = await FarmerContract.deploy();
    await farmerDeployed.deploymentTransaction().wait(2);
    CONTRACT_REF.farmer = await farmerDeployed.getAddress();
    console.log(`Created Farmer Contract`);
    console.log(`Have next contracts: ${CONTRACT_REF}`)

    // methods call
    const farmer = await ethers.getContractAt("Farmer", CONTRACT_REF.farmer);
    try {
        const cowResponse = await farmer.call(CONTRACT_REF.cow);
        console.log(`Result of farmer call cow: ${cowResponse}`);
        const horseResponse = await farmer.call(CONTRACT_REF.horse);
        console.log(`Result of farmer call horse: ${horseResponse}`);
    } catch (e) {
        console.error(`Error with call animals:\n${e}`)
    }

    // other methods call
    try {
        const wolfFeedPlant = await farmer.feed(CONTRACT_REF.wolf, "plant");
        console.log(`Result of farmer feed wolf -> plant: ${wolfFeedPlant}`);
    } catch (e) {
        console.error(`Result of farmer feed wolf -> plant: ${e}`)
    }

    const wolfFeedMeat = await farmer.feed(CONTRACT_REF.wolf, "meat");
    console.log(`Result of farmer feed wolf -> meat: ${wolfFeedMeat}`);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
