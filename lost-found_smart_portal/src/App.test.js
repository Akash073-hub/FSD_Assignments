import { render, screen, fireEvent } from '@testing-library/react';
import LoginPage from './Loginpage';

test('login page does not show captcha field', () => {
  render(<LoginPage />);

  expect(screen.queryByText(/security verification/i)).not.toBeInTheDocument();
  expect(screen.queryByLabelText(/captcha/i)).not.toBeInTheDocument();
});

test('login page shows forgot password action', () => {
  const onForgotPassword = jest.fn();
  render(<LoginPage onForgotPassword={onForgotPassword} />);

  fireEvent.click(screen.getByRole('button', { name: /forgot password\?/i }));
  expect(onForgotPassword).toHaveBeenCalledTimes(1);
});
