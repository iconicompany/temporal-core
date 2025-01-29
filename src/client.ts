import { Client } from "@temporalio/client";
import { getLazyConnection } from "./getLazyConnection.js";

function makeClient() {
  return new Client({
    connection: getLazyConnection(),
    namespace: process.env.TEMPORAL_NAMESPACE,
  });
}

const client = makeClient();

export function getTemporalClient(): Client {
  return client;
}
