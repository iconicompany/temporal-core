import { Connection, type ConnectionOptions } from "@temporalio/client";
import fs from "fs/promises";

/**
 *
 */
export async function getConnection() {
  const temporalUrl = process.env.TEMPORAL_URL;
  const certPath = process.env.TEMPORAL_CERT_PATH;
  const keyPath = process.env.TEMPORAL_KEY_PATH;
  const rootCACertPath = process.env.TEMPORAL_ROOT_CA_CERT_PATH;
  const tls = process.env.TEMPORAL_TLS;

  let connectionOptions: ConnectionOptions = {
    address: process.env.TEMPORAL_URL,
  };

  // if (!temporalUrl) {
  //   throw new Error("TEMPORAL_URL is not set");
  // }

  if (tls === "true") {
    if (!certPath || !keyPath || !rootCACertPath) {
      throw new Error(
        "TEMPORAL_CERT_PATH and TEMPORAL_KEY_PATH and TEMPORAL_ROOT_CA_CERT_PATH must be set when TEMPORAL_TLS is true",
      );
    }

    connectionOptions.tls = {
      clientCertPair: {
        crt: await fs.readFile(certPath),
        key: await fs.readFile(keyPath),
      },
      serverRootCACertificate: await fs.readFile(rootCACertPath),
      serverNameOverride: "temporal-frontend",
    };
  }

  return Connection.connect(connectionOptions);
}
