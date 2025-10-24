const { ethers } = require("hardhat");

async function main() {
  const ONE_M = ethers.utils.parseUnits("1000000", 18);

  const Mock = await ethers.getContractFactory("MockERC20");
  const a = await Mock.deploy("Mock A", "MOCKA", ONE_M);
  await a.deployed();

  const b = await Mock.deploy("Mock B", "MOCKB", ONE_M);
  await b.deployed();

  // price: 1 A = 2 B
  const priceBPerA = ethers.utils.parseUnits("2", 18);
  const Ex = await ethers.getContractFactory("SimpleExchange");
  const ex = await Ex.deploy(a.address, b.address, priceBPerA);
  await ex.deployed();

  // seed B liquidity to exchange
  const tx = await b.transfer(ex.address, ethers.utils.parseUnits("500000", 18));
  await tx.wait();

  console.log("MOCKA:", a.address);
  console.log("MOCKB:", b.address);
  console.log("SimpleExchange:", ex.address);
}

main().catch((e) => { console.error(e); process.exit(1); });
