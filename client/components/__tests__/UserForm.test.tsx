import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import UserForm from '../../app/UserForm';

describe('UserForm Validations', () => {
  it('shows error if passwords do not match', async () => {
    const { getByPlaceholderText, getByText } = render(<UserForm />);
    fireEvent.press(getByText("Don't have an account? Register"));
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'password124');
    fireEvent.press(getByText('Register'));

    await waitFor(() => {
      expect(getByText('Passwords do not match.')).toBeTruthy();
    });
  });

  it('validates that first name does not contain numbers', async () => {
    const { getByPlaceholderText, getByText } = render(<UserForm />);
    fireEvent.press(getByText("Don't have an account? Register"));
    fireEvent.changeText(getByPlaceholderText('First Name'), 'John123');
    fireEvent.press(getByText('Register'));

    await waitFor(() => {
      expect(getByText('First name can only contain letters.')).toBeTruthy();
    });
  });
});
