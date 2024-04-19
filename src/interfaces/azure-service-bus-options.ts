export interface Receiver {
  name: string;
  subscription?: string;
  provider?: string;
}

export interface Sender {
  name: string;
  identifier?: string;
}

export interface AzureServiceBusOptions {
  connectionString: string;
  senders?: Sender[];
}

export interface AzureServiceBusOptionsWithName extends AzureServiceBusOptions {
  name?: string;
}
