const username = process.env.DEVOPS_USERNAME;
const pat = process.env.PAT_KEY;

const authorization = `Basic ${Buffer.from(pat).toString(
  "base64"
)}`;

export const headers = {
  Authorization: authorization,
  "Content-Type": "application/json",
  "User-Agent": "node-fetch/1.0 (+https://github.com/bitinn/node-fetch)",
};
