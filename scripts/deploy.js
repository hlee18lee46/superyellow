const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);
  console.log("Balance:", ethers.utils.formatEther(await deployer.getBalance()), "ETH");

  const ONE_M = ethers.utils.parseUnits("1000000", 18);

  const Mock = await ethers.getContractFactory("MockERC20");
  console.log("Deploying Mock A…");
  const a = await Mock.deploy("Mock A", "MOCKA", ONE_M);
  await a.deployed();
  console.log("MOCKA:", a.address);

  console.log("Deploying Mock B…");
  const b = await Mock.deploy("Mock B", "MOCKB", ONE_M);
  await b.deployed();
  console.log("MOCKB:", b.address);

  console.log("Deploying SimpleExchange…");
  const priceBPerA = ethers.utils.parseUnits("2", 18); // 1 A = 2 B
  const Ex = await ethers.getContractFactory("SimpleExchange");
  const ex = await Ex.deploy(a.address, b.address, priceBPerA);
  await ex.deployed();
  console.log("SimpleExchange:", ex.address);

  console.log("Seeding B liquidity…");
  await (await b.transfer(ex.address, ethers.utils.parseUnits("500000", 18))).wait();

  console.log("✅ Done");
}
main().catch((e)=>{ console.error(e); process.exit(1); });
