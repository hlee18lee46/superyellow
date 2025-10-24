// types/abi.ts
export const erc20Abi = [
  { type: "function", name: "balanceOf", stateMutability: "view", inputs: [{ name: "a", type: "address" }], outputs: [{ type: "uint256" }] },
  { type: "function", name: "allowance", stateMutability: "view", inputs: [{ name: "o", type: "address" }, { name: "s", type: "address" }], outputs: [{ type: "uint256" }] },
  { type: "function", name: "approve", stateMutability: "nonpayable", inputs: [{ name: "sp", type: "address" }, { name: "amt", type: "uint256" }], outputs: [{ type: "bool" }] },
  { type: "function", name: "transfer", stateMutability: "nonpayable", inputs: [{ name: "to", type: "address" }, { name: "amt", type: "uint256" }], outputs: [{ type: "bool" }] },
] as const;

export const tipRouterAbi = [
  { type: "function", name: "price", stateMutability: "view", inputs: [{ name: "token", type: "address" }], outputs: [{ type: "uint256" }] },
  { type: "function", name: "tip", stateMutability: "nonpayable",
    inputs: [
      { name: "tipToken", type: "address" },
      { name: "streamer", type: "address" },
      { name: "yusdAmount", type: "uint256" },
      { name: "message", type: "string" },
    ],
    outputs: []
  },
  // If you later add tipBatch in your contract, include its signature here.
] as const;
