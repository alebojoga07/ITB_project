const hre = require("hardhat");

async function main() {
    const IBTToken = await hre.ethers.getContractFactory("IBTToken");
    const ibtToken = await IBTToken.deploy();

    await ibtToken.deployed();
    console.log("IBT Token deployed to:", ibtToken.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
