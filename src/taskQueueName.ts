import "./helpers/env.js";

function getTaskQueueName() {
  const werfEnv = process.env?.WERF_ENV;

  if (!werfEnv) {
    throw new Error("WERF_ENV is not set");
  }

  const nameSpace = process.env?.WERF_NAMESPACE;

  if (!nameSpace) {
    throw new Error("WERF_NAMESPACE is not set");
  }

  // imarketplace-main-prod or imarketplace-main-test or imarketplace-fix-###-development
  return nameSpace + "-" + werfEnv;
}

export const taskQueueName = getTaskQueueName();
