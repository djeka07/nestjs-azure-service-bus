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
  receivers?: Omit<Receiver, 'provider'>[];
}

export interface AzureServiceBusOptionsWithName extends AzureServiceBusOptions {
  name?: string;
}
