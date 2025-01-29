import { Connection, type ConnectionOptions } from "@temporalio/client";
import fs from "fs";

/**
 *
 */
export function getLazyConnection() {
  const temporalUrl = process.env.TEMPORAL_URL;
  const certPath = process.env.TEMPORAL_CERT_PATH;
  const keyPath = process.env.TEMPORAL_KEY_PATH;
  const rootCACertPath = process.env.TEMPORAL_ROOT_CA_CERT_PATH;
  const tls = process.env.TEMPORAL_TLS;

  let connectionOptions: ConnectionOptions = {
    address: temporalUrl,
  };

  // if (!temporalUrl) {
  //   throw new Error("TEMPORAL_URL is not set");
  // }

  if (tls === "true") {
    if (!certPath || !keyPath || !rootCACertPath) {
      throw new Error("TEMPORAL_CERT_PATH and TEMPORAL_KEY_PATH and TEMPORAL_ROOT_CA_CERT_PATH must be set when TEMPORAL_TLS is true");
    }

    connectionOptions.tls = {
      clientCertPair: {
        crt: fs.readFileSync(certPath),
        key: fs.readFileSync(keyPath),
      },
      serverRootCACertificate: fs.readFileSync(rootCACertPath),
      serverNameOverride: "temporal-frontend",
    };
  }

  return Connection.lazy(connectionOptions);
}
