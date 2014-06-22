/**
 * Schemas for the DPIC data set.
 * Shared between the server and the client.
 */
util.provide('dab.schemas.dpic');

dab.schemas.dpic = {
  race: {
    key: "race",
    values: [
      "white",
      "black",
      "latino",
      "native american",
      "asian",
      "other"
    ],
  },
  method: {
    key: "method",
    values: [
      "lethal injection",
      "electrocution",
      "gas chamber",
      "firing squad",
      "hanging",
      "other"
    ],
  },
  region: {
    key: "region",
    values: [
      "s",
      "w",
      "m",
      "n"
    ],
    nicenames: {
      "s": "South",
      "w": "West",
      "m": "Midwest",
      "n": "Northeast"
    }
  }
};