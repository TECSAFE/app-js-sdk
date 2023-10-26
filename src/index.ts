import TecsafeApi, { Config } from "./TecsafeApi";
import { CustomerToken } from "./CommonTypes";

export interface GetCustomerTokenCallback {
  (): Promise<CustomerToken | null>;
}

export async function initializeTecsafeApi(
  getCustomerTokenCallback: GetCustomerTokenCallback,
  config: Config,
): Promise<TecsafeApi> {
  const api = new TecsafeApi(getCustomerTokenCallback, config);
  await api.initialize();

  return api;
}

export default {
  initializeTecsafeApi,
};
