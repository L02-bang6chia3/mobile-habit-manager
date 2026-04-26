import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';

// describe giúp gom nhóm các bài test [cite: 192]
describe('Kiểm tra khởi tạo', () => {
  // it hoặc test định nghĩa một ca kiểm thử cụ thể [cite: 193]
  it('Hiển thị đúng tên ứng dụng The Orbit', () => {
    const { getByText } = render(<Text>The Orbit</Text>);
    // expect dùng để kiểm tra kết quả mong đợi [cite: 195]
    expect(getByText('The Orbit')).toBeTruthy(); 
  });
});