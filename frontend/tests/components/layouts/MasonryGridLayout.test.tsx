import { cleanup, render, screen } from '@testing-library/react';
import MasonryGridLayout from '../../../src/components/Layouts/MasonryGridLayout';

describe('MasonryGridLayout', () => {
    it('renders without crashing', () => {
        render(<MasonryGridLayout><div>Test Child</div></MasonryGridLayout>);
        const parentElement = screen.getByTestId('masonary-grid-layout_parent');
        expect(parentElement).toBeInTheDocument();
    });

    it('renders children correctly', () => {
        render(
            <MasonryGridLayout>
                <div>Child 1</div>
                <div>Child 2</div>
            </MasonryGridLayout>
        );
        const childrenElements = screen.getAllByTestId('masonary-grid-layout_children');
        expect(childrenElements.length).toBe(2);
        expect(childrenElements[0].textContent).toEqual('Child 1');
        expect(childrenElements[1].textContent).toEqual('Child 2');
    });

    it('applies correct classes to parent and children', () => {
        render(
            <MasonryGridLayout>
                <div>Child 1</div>
                <div>Child 2</div>
            </MasonryGridLayout>
        );
        const parentElement = screen.getByTestId('masonary-grid-layout_parent');
        expect(parentElement.className).toContain('gap-4 columns-1 sm:columns-1 md:columns-1 lg:columns-1 xl:columns-2 2xl:columns-3');

        const childrenElements = screen.getAllByTestId('masonary-grid-layout_children');
        childrenElements.forEach(child => {
            expect(child.className).toContain('mb-4 break-inside-avoid');
        });
    });

    afterEach(() => {
        cleanup();
    });
});