import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

import Header from '../../../src/components/Navigation/Header';
import { AppConfigContext } from '../../../src/contexts/AppConfigContext';

const renderWithProviders = (ui: React.ReactNode, { isConfigured = true, route = '/' } = {}) => {
  return render(
    <AppConfigContext.Provider value={{ isConfigured, refreshConfig: () => {} }}>
      <MemoryRouter initialEntries={[route]}>
        {ui}
      </MemoryRouter>
    </AppConfigContext.Provider>
  );
};

describe('Header', () => {
  it('renders logo and nav tabs when isConfigured=true', () => {
    renderWithProviders(<Header />, { isConfigured: true, route: '/search' });

    expect(screen.getByTestId('logo-link')).toBeInTheDocument();
    expect(screen.getByTestId('navigation-tab-0')).toHaveTextContent('SEARCH');
    expect(screen.getByTestId('navigation-tab-1')).toHaveTextContent('OPTIONS');
  });

  it('highlights the correct nav tab for the current route', () => {
    renderWithProviders(<Header />, { isConfigured: true, route: '/' });

    const searchTab = screen.getByTestId('navigation-tab-0');
    const optionsTab = screen.getByTestId('navigation-tab-1');

    expect(searchTab).toHaveClass('bg-primary-medium');
    expect(optionsTab).not.toHaveClass('bg-primary-medium');
  });

  it('renders no nav tabs when isConfigured=false', () => {
    renderWithProviders(<Header />, { isConfigured: false, route: '/options' });

    expect(screen.queryByTestId('navigation-tab-0')).not.toBeInTheDocument();
    expect(screen.queryByTestId('navigation-tab-1')).not.toBeInTheDocument();
  });
});
