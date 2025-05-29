import { render, screen } from '@testing-library/react';
import BigButton from '../../../src/components/Shared/BigButton';
import { describe, expect, it } from 'vitest';

describe('BigButton Component', () => {

    it('renders enabled button with correct text', () => {
        render(<BigButton disabled={false} disabledText="Disabled" enabledText="Enabled" />);

        const button = screen.getByTestId('shared-big-button') as HTMLButtonElement;

        expect(button.disabled).toBe(false);
        expect(button.textContent).toBe('Enabled');
    });

    it('renders disabled button with correct text', () => {
        render(<BigButton disabled={true} disabledText="Disabled" enabledText="Enabled" />);

        const button = screen.getByTestId('shared-big-button') as HTMLButtonElement;

        expect(button.disabled).toBe(true);
        expect(button.textContent).toBe('Disabled');
    });

    it('applies correct styles when enabled', () => {
        render(<BigButton disabled={false} disabledText="Disabled" enabledText="Enabled" />);

        const button = screen.getByTestId('shared-big-button');

        expect(button.classList.contains('bg-primary-medium')).toBe(true);
        expect(button.classList.contains('hover:bg-primary-dark')).toBe(true);
    });

    it('applies correct styles when disabled', () => {
        render(<BigButton disabled={true} disabledText="Disabled" enabledText="Enabled" />);

        const button = screen.getByTestId('shared-big-button');

        expect(button.classList.contains('bg-gray-500')).toBe(true);
        expect(button.classList.contains('cursor-not-allowed')).toBe(true);
    });
});