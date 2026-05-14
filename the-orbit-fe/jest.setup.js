import '@testing-library/jest-native/extend-expect';

jest.mock('expo-router', () => {
  const React = require('react');
  const router = {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  };

  const MockLink = (props) => React.createElement('View', props, props.children);

  MockLink.Trigger = (props) => React.createElement('View', props, props.children);
  MockLink.Preview = (props) => React.createElement('View', props, props.children);

  return {
    Link: MockLink,
    router,
    useRouter: () => router,
    useLocalSearchParams: () => ({}),
  };
});

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(async () => null),
  setItemAsync: jest.fn(async () => undefined),
  deleteItemAsync: jest.fn(async () => undefined),
}));
