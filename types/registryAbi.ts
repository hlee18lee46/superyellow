export const streamRegistryAbi = [
  {
    "inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"url","type":"string"}],
    "name":"startStream","outputs":[],"stateMutability":"nonpayable","type":"function"
  },
  {
    "inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"url","type":"string"}],
    "name":"updateStream","outputs":[],"stateMutability":"nonpayable","type":"function"
  },
  {
    "inputs":[],"name":"stopStream","outputs":[],"stateMutability":"nonpayable","type":"function"
  },
  {
    "inputs":[{"internalType":"address","name":"streamer","type":"address"}],
    "name":"getStream","outputs":[
      {"components":[
        {"internalType":"address","name":"streamer","type":"address"},
        {"internalType":"string","name":"name","type":"string"},
        {"internalType":"string","name":"url","type":"string"},
        {"internalType":"bool","name":"active","type":"bool"}
      ],"internalType":"struct StreamRegistry.Stream","name":"","type":"tuple"}
    ],"stateMutability":"view","type":"function"
  },
  {
    "inputs":[],"name":"getActiveStreams","outputs":[
      {"components":[
        {"internalType":"address","name":"streamer","type":"address"},
        {"internalType":"string","name":"name","type":"string"},
        {"internalType":"string","name":"url","type":"string"},
        {"internalType":"bool","name":"active","type":"bool"}
      ],"internalType":"struct StreamRegistry.Stream[]","name":"","type":"tuple[]"}
    ],"stateMutability":"view","type":"function"
  },
  { "inputs":[],"name":"activeCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}
] as const;