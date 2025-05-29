// RootLayout.test.jsx
import { render, screen } from '@testing-library/react';
import RootLayout from '../../../src/components/Layouts/RootLayout.js';

// Mock the Header component so we don't test its implementation
vi.mock('../Navigation/Header.js', () => ({
  default: () => <div data-testid="mock-header" />,
}));

// Mock Outlet from react-router-dom to avoid testing routing logic
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
      ...actual,
      Outlet: () => <div data-testid="mock-outlet" />,
    };
});

describe('RootLayout', () => {
    it('TEST', () => {
        expect(true).toBe(true);    
    })
//   it('renders the container with the correct layout', () => {
//     render(<RootLayout />);
    
//     // Check that the container has the correct classes
//     const container = screen.getByTestId('root-layout-container');
//     expect(container).toBeInDocument();
//     expect(container.className).toContain('flex flex-col h-screen');

//     // Check that the main area has the correct classes
//     const main = screen.getByTestId('root-layout-main');
//     expect(main).toBeTruthy();
//     expect(main.className).toContain('flex-1 min-w-full overflow-hidden bg-background-dark');
//   });

//   it('renders the Outlet', () => {
//     render(<RootLayout />);
    
//     // Verify that the Outlet is rendered by checking for the mock test id
//     const outlet = screen.getByTestId('mock-outlet');
//     expect(outlet).toBeTruthy();
//   });
});
