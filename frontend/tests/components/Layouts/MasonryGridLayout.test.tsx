import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MasonryGridLayout } from '../../../src/components';

describe('MasonryGridLayout', () => {
  it('renders the parent container', () => {
    render(
      <MasonryGridLayout>
        <div>Item 1</div>
        <div>Item 2</div>
      </MasonryGridLayout>
    );

    const parent = screen.getByTestId('masonary-grid-layout_parent');
    expect(parent).toBeInTheDocument();
  });

  it('wraps each child in a div with the correct class and test ID', () => {
    render(
      <MasonryGridLayout>
        <div>Item A</div>
        <div>Item B</div>
        <div>Item C</div>
      </MasonryGridLayout>
    );

    const children = screen.getAllByTestId('child');
    expect(children).toHaveLength(3);

    expect(children[0].textContent).toBe('Item A');
    expect(children[1].textContent).toBe('Item B');
    expect(children[2].textContent).toBe('Item C');
  });

  it('handles no children gracefully', () => {
    render(<MasonryGridLayout />);

    const parent = screen.getByTestId('masonary-grid-layout_parent');
    expect(parent).toBeInTheDocument();
    expect(screen.queryAllByTestId('child')).toHaveLength(0);
  });
});
