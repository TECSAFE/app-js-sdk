import TecsafeApi from "./TecsafeApi";
import { CustomerToken } from "./CommonTypes";

export interface GetCustomerTokenCallback {
  (): Promise<CustomerToken>;
}

export async function initializeTecsafeApi(
  getCustomerTokenCallback: GetCustomerTokenCallback,
): Promise<TecsafeApi> {
  const api = new TecsafeApi(getCustomerTokenCallback);
  await api.initialize();

  return api;
}

export default {
  initializeTecsafeApi,
};
