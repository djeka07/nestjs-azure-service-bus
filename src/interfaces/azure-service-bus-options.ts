export interface Receiver {
  name: string;
  subscription?: string;
}

export interface Sender {
  name: string;
  identifier?: string;
}

export interface AzureServiceBusOptions {
  connectionString: string;
  senders?: Sender[];
  receivers?: Receiver[];
}
