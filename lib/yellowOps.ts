// lib/yellowOps.ts
export async function sendOffchainTip(client, channelId, viewer, treasury, token, amount) {
  const prev = await client.getLatestState(channelId);

  const next = {
    intent: "OPERATE",
    version: prev.version + 1,
    data: JSON.stringify({ action: "tip", token, amount }),
    allocations: [
      { destination: viewer, token, amount: (Number(prev.allocations[0].amount) - amount).toString() },
      { destination: treasury, token, amount: (Number(prev.allocations[1].amount) + amount).toString() },
    ],
  };

  await client.updateState(channelId, next);
}
