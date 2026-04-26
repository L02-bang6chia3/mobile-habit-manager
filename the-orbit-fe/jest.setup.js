import '@testing-library/jest-native/extend-expect';

jest.mock('expo-router', () => {
  const React = require('react');
  // Giả lập thành phần Link hoạt động như một View đơn giản
  const MockLink = (props) => React.createElement('View', props, props.children);
  
  // Gán các thuộc tính phụ mà code của bạn đang dùng
  MockLink.Trigger = (props) => React.createElement('View', props, props.children);
  MockLink.Preview = (props) => React.createElement('View', props, props.children);

  return {
    Link: MockLink,
    useRouter: () => ({
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
    }),
    useLocalSearchParams: () => ({}),
  };
});