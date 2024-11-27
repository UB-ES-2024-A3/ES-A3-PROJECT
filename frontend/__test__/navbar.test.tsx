import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/router';
import NavBar from '../src/components/navbar';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

it('navigates to the correct page when a menu item is clicked', async () => {
  const pushMock = jest.fn();
  (useRouter as jest.Mock).mockReturnValue({
    push: pushMock,
    pathname: '/profile',
  });

  render(<NavBar><div>Child Content</div></NavBar>);

  const timelineButton = screen.getByTestId('menuitem-timeline');
  expect(timelineButton).toBeInTheDocument();
  await userEvent.click(timelineButton);
  await waitFor(() => expect(pushMock).toHaveBeenCalled());

  expect(pushMock).toHaveBeenCalled(); 
  expect(pushMock).toHaveBeenCalledWith('/timeline'); 
});
