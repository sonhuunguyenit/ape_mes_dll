import express from "express";
import { PullDllSDK } from "./PullDllSDK.js";

const app = express();
const PORT = 5000;

app.get("/connect", async (req, res) => {
  const params = {
    ipaddress: "192.168.1.201",
    port: "4370",
    timeout: 5000,
    passwd: "",
  };

  const sdk = new PullDllSDK(params);
  const result = await sdk.connect(params);

  console.log(result);
  res.json(result);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
