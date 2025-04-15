/**
 * Delete Cloudflare Tunnel Action for GitHub
 */

const cp = require("child_process");

const CF_API_BASE_URL = "https://api.cloudflare.com/client/v4";

const getCurrentTunnelId = () => {
  const params = new URLSearchParams({
    name: process.env.INPUT_NAME,
    is_deleted: "false",
  });

  const { status, stdout } = cp.spawnSync("curl", [
    ...["--header", `Authorization: Bearer ${process.env.INPUT_TOKEN}`],
    ...["--header", "Content-Type: application/json"],
    `${CF_API_BASE_URL}/accounts/${process.env.INPUT_ACCOUNT_ID}/cfd_tunnel?${params.toString()}`,
  ]);

  if (status !== 0) {
    process.exit(status);
  }

  const { success, result, errors } = JSON.parse(stdout.toString());

  if (!success) {
    console.log(`::error::Lookup failed: ${errors[0].message}`);
    process.exit(1);
  }

  const name = process.env.INPUT_NAME;
  const record = result.find((x) => x.name === name);

  if (!record) {
    return null
  }

  return record.id;
};

const cleanupTunnel = (id) => {
  // https://api.cloudflare.com/#dns-records-for-a-zone-delete-dns-record
  const { status, stdout } = cp.spawnSync("curl", [
    ...["--silent", "--request", "DELETE"],
    ...["--header", `Authorization: Bearer ${process.env.INPUT_TOKEN}`],
    ...["--header", "Content-Type: application/json"],
    `${CF_API_BASE_URL}/accounts/${process.env.INPUT_ACCOUNT_ID}/cfd_tunnel/${id}/connections`,
  ]);

  if (status !== 0) {
    process.exit(status);
  }

  const { success, errors } = JSON.parse(stdout.toString());

  if (!success) {
    console.log(`::error::Failed to do cleanup: ${errors[0].message}`);
    process.exit(1);
  }
};

const deleteTunnel = (id) => {
  // https://api.cloudflare.com/#dns-records-for-a-zone-delete-dns-record
  const { status, stdout } = cp.spawnSync("curl", [
    ...["--silent", "--request", "DELETE"],
    ...["--header", `Authorization: Bearer ${process.env.INPUT_TOKEN}`],
    ...["--header", "Content-Type: application/json"],
    `${CF_API_BASE_URL}/accounts/${process.env.INPUT_ACCOUNT_ID}/cfd_tunnel/${id}`,
  ]);

  if (status !== 0) {
    process.exit(status);
  }

  const { success, errors } = JSON.parse(stdout.toString());

  if (!success) {
    console.log(`::error::Error deleting: ${errors[0].message}`);
    process.exit(1);
  }
};

const id = process.env.INPUT_ID || getCurrentTunnelId();
if (!id) {
  console.log("Tunnel doesn't exist. Nothing to delete.");
  process.exit(0);
}
cleanupTunnel(id);
deleteTunnel(id);


