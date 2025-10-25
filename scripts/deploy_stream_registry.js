const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployer:", deployer.address);

  const SR = await hre.ethers.getContractFactory("StreamRegistry");
  const sr = await SR.deploy();
  await sr.deployed();

  console.log("StreamRegistry:", sr.address);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});