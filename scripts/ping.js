const { ethers } = require("hardhat");
async function main() {
  const net = await ethers.provider.getNetwork();
  const [signer] = await ethers.getSigners();
  console.log("ChainId:", net.chainId);
  console.log("Account:", signer.address);
  console.log("Balance:", ethers.utils.formatEther(await signer.getBalance()), "ETH");
}
main().catch((e)=>{ console.error(e); process.exit(1); });
