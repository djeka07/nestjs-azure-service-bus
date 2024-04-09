import buildAzureServiceBusReceiverKey from './build-azure-service-bus-receiver-key';

describe('GIVEN buildAzureServiceBusReveiverKey', () => {
  test('WHEN receiver is undefined THEN should return empty string', () => {
    expect(buildAzureServiceBusReceiverKey(undefined)).toBe('');
  });

  test('WHEN receiver only has name THEN should return string with that name', () => {
    expect(buildAzureServiceBusReceiverKey({ name: 'name' })).toBe('name');
  });

  test('WHEN receiver has name and subscription THEN should return string with that name/subscription', () => {
    expect(
      buildAzureServiceBusReceiverKey({
        name: 'name',
        subscription: 'subscription',
      }),
    ).toBe('name/subscription');
  });

  test('WHEN receiver has name, subscription and provider THEN should return string with that provider/name/subscription', () => {
    expect(
      buildAzureServiceBusReceiverKey({
        provider: 'provider',
        name: 'name',
        subscription: 'subscription',
      }),
    ).toBe('provider/name/subscription');
  });
});
