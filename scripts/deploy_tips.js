const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);
  console.log("Balance:", ethers.utils.formatEther(await deployer.getBalance()), "ETH");

  const Mock = await ethers.getContractFactory("MockERC20");
  const oneM = ethers.utils.parseUnits("1000000", 18);

  // 1) Deploy YUSD (stable)
  const yusd = await Mock.deploy("Yellow USD", "YUSD", oneM);
  await yusd.deployed();
  console.log("YUSD:", yusd.address);

  // 2) Deploy tip tokens
  const love  = await Mock.deploy("LOVE Token",  "LOVE",  oneM);
  await love.deployed();   console.log("LOVE :", love.address);

  const smile = await Mock.deploy("SMILE Token", "SMILE", oneM);
  await smile.deployed();  console.log("SMILE:", smile.address);

  const wink  = await Mock.deploy("WINK Token",  "WINK",  oneM);
  await wink.deployed();   console.log("WINK :", wink.address);

  const supert = await Mock.deploy("SUPER Token", "SUPER", oneM);
  await supert.deployed(); console.log("SUPER:", supert.address);

  // 3) Deploy TipRouter with YUSD
  const Router = await ethers.getContractFactory("TipRouter");
  const router = await Router.deploy(yusd.address);
  await router.deployed();
  console.log("TipRouter:", router.address);

  // 4) Set prices: tip tokens per 1 YUSD (1e18 scale)
  await (await router.setPrice(love.address,   ethers.utils.parseUnits("100", 18))).wait();
  await (await router.setPrice(smile.address,  ethers.utils.parseUnits("75",  18))).wait();
  await (await router.setPrice(wink.address,   ethers.utils.parseUnits("50",  18))).wait();
  await (await router.setPrice(supert.address, ethers.utils.parseUnits("25",  18))).wait();

  // 5) Fund router treasury with tip tokens (so it can pay streamers)
  const fundAmt = ethers.utils.parseUnits("500000", 18);
  const tipTokens = [love, smile, wink, supert];

  for (const t of tipTokens) {
    await (await t.approve(router.address, fundAmt)).wait();
    await (await router.fundTipTreasury(t.address, fundAmt)).wait();
    console.log("Funded treasury with", ethers.utils.formatUnits(fundAmt, 18), await t.symbol());
  }

  console.log("\n✅ Deployed and funded TipRouter");
  console.log("\n--- Addresses ---");
  console.log("YUSD:", yusd.address);
  console.log("LOVE:", love.address);
  console.log("SMILE:", smile.address);
  console.log("WINK:", wink.address);
  console.log("SUPER:", supert.address);
  console.log("TipRouter:", router.address);
}

main().catch((e) => { console.error(e); process.exit(1); });
