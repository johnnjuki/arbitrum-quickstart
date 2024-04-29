const hre = require('hardhat');

async function main() {
    const vendingMachine = await hre.ethers.deployContract('VendingMachine');
    await vendingMachine.waitForDeployment();
    console.log(`Cupcake vending machine deployed to ${vendingMachine.target}`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
