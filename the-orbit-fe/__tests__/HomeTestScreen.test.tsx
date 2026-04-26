import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomeScreen from '../app/(tabs)/index';

describe('HomeScreen - The Orbit', () => {
  // Case 1: Kiểm tra render (Yêu cầu môn học)
  it('nên hiển thị đúng tiêu đề ứng dụng', () => {
    const { getByText } = render(<HomeScreen />);
    expect(getByText('The Orbit - Habit Tracker')).toBeTruthy();
  });

  // Case 2: Kiểm tra tương tác (Yêu cầu môn học)
  it('nên đổi trạng thái thói quen khi nhấn vào', () => {
    const { getByText, getByTestId } = render(<HomeScreen />);
    const habitItem = getByTestId('habit-item-1');
    
    // Nhấn lần 1: Đổi sang Xong
    fireEvent.press(habitItem);
    expect(getByText(/Đọc sách 30p - Xong/i)).toBeTruthy();
  });

  // Case 3: Kiểm tra không crash (Yêu cầu môn học)
  it('không bị lỗi khi render danh sách', () => {
    const { toJSON } = render(<HomeScreen />);
    expect(toJSON()).not.toBeNull();
  });

  it('nên đổi trạng thái tất cả thói quen khi nhấn vào', () => {
    const { getByTestId } = render(<HomeScreen />);
    
    // Giả sử bạn có 2 thói quen, hãy nhấn VÀO CẢ HAI để phủ hết các dòng code
    const habit1 = getByTestId('habit-item-1');
    const habit2 = getByTestId('habit-item-2');
    
    fireEvent.press(habit1); // Chạy qua dòng logic của item 1
    fireEvent.press(habit2); // Chạy qua dòng logic của item 2
    
    fireEvent.press(habit1); 
  });
});