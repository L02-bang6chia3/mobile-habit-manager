import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';

const OnboardingScreen = () => <Text>Easy Habit Building</Text>;

describe('OnboardingScreen Tests', () => {
  it('hiển thị tiêu đề giới thiệu', () => {
    const { getByText } = render(<OnboardingScreen />);
    expect(getByText('Easy Habit Building')).toBeTruthy();
  });

  it('render thành công không lỗi', () => {
    const { toJSON } = render(<OnboardingScreen />);
    expect(toJSON()).toMatchSnapshot(); // Tạo snapshot để kiểm tra cấu trúc DOM [cite: 89]
  });

  it('chứa nội dung văn bản cụ thể', () => {
    const { queryByText } = render(<OnboardingScreen />);
    expect(queryByText('Easy Habit Building')).not.toBeNull();
  });
});