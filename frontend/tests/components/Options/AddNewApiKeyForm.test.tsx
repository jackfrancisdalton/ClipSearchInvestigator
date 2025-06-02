import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddNewApiKeyForm from '../../../src/components/Options/AddNewApiKeyForm';

describe('AddNewApiKeyForm', () => {
  const mockOnSave = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders input and submit button', () => {
    render(<AddNewApiKeyForm onSave={mockOnSave} errorMessage="" />);

    expect(screen.getByTestId('add-new-api-key_input')).toBeInTheDocument();
    expect(screen.getByTestId('add-new-api-key_button')).toBeInTheDocument();
  });

  it('disables submit button if input is less than 10 characters', () => {
    render(<AddNewApiKeyForm onSave={mockOnSave} errorMessage="" />);

    const input = screen.getByTestId('add-new-api-key_input');
    const button = screen.getByTestId('add-new-api-key_button');

    fireEvent.change(input, { target: { value: '123456789' } });
    expect(button).toBeDisabled();
  });

  it('enables submit button if input is 10 characters', () => {
    render(<AddNewApiKeyForm onSave={mockOnSave} errorMessage="" />);

    const input = screen.getByTestId('add-new-api-key_input');
    const button = screen.getByTestId('add-new-api-key_button');

    fireEvent.change(input, { target: { value: '123456789X' } });
    expect(button).toBeEnabled();
  });

  it('shows validation error if input is too short and submitted via form', async () => {
    render(<AddNewApiKeyForm onSave={mockOnSave} errorMessage="" />);
  
    const input = screen.getByTestId('add-new-api-key_input');
    const form = input.closest('form')!;
  
    fireEvent.change(input, { target: { value: '123456789' } });  
    fireEvent.submit(form);
  
    const formError = await screen.findByTestId('add-new-api-key-form_error');
    expect(formError).toBeInTheDocument();
    expect(formError).toHaveTextContent('API key must be at least 10 characters');
  });

  it('calls onSave with correct input when valid', async () => {
    const validKey = '123456789X';
    render(<AddNewApiKeyForm onSave={mockOnSave} errorMessage="" />);

    const input = screen.getByTestId('add-new-api-key_input');
    const button = screen.getByTestId('add-new-api-key_button');

    fireEvent.change(input, { target: { value: validKey } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(validKey);
    });
  });

  it('shows server error message if errorMessage prop is provided', () => {
    render(<AddNewApiKeyForm onSave={mockOnSave} errorMessage="Something went wrong" />);

    const error = screen.getByTestId('add-new-api-key-error');
    expect(error).toBeInTheDocument();
    expect(error).toHaveTextContent('Something went wrong');
  });
});
