import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MobilePopOutMenu } from '../../../src/components';

describe('MobilePopOutMenu', () => {
  const DummyContent = () => {
    return (<div data-testid="dummy-child">Sidebar content</div>)
  };

  it('renders with content when open', () => {
    render(
      <MobilePopOutMenu isOpen={true} toggleSidebar={vi.fn()}>
        <DummyContent />
      </MobilePopOutMenu>
    );

    const container = screen.getByTestId('menu_container');
    const content = screen.getByTestId('menu_content');
    const button = screen.getByTestId('toggle-button');

    expect(container).toBeInTheDocument();
    expect(content).toContainElement(screen.getByTestId('dummy-child'));
    expect(button.textContent).toBe('Close');
    expect(container.className).toMatch(/translate-y-0/);
  });

  it('renders collapsed state when closed', () => {
    render(
      <MobilePopOutMenu isOpen={false} toggleSidebar={vi.fn()}>
        <DummyContent />
      </MobilePopOutMenu>
    );

    const container = screen.getByTestId('menu_container');
    const button = screen.getByTestId('toggle-button');

    expect(container.className).toMatch(/translate-y-full/);
    expect(container.className).toMatch(/h-0/);
    expect(button.textContent).toBe('Open');
  });

  it('calls toggleSidebar when button is clicked', () => {
    const toggleMock = vi.fn();

    render(
      <MobilePopOutMenu isOpen={true} toggleSidebar={toggleMock}>
        <DummyContent />
      </MobilePopOutMenu>
    );

    const button = screen.getByTestId('toggle-button');
    fireEvent.click(button);
    expect(toggleMock).toHaveBeenCalledTimes(1);
  });
});
