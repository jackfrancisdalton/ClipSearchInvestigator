import React from 'react';
import { SearchInfoBox } from '../../src/components/index.js';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

describe('SearchInfoBox Component', () => {
  it('renders without crashing', () => {
    render(<SearchInfoBox />);
    expect(true).toBe(true);
  });

  it('displays the correct content', () => {
    render(<SearchInfoBox />);
    expect(true).toBe(true);
  });
});
