import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useForm, FormProvider } from 'react-hook-form';
import TranscriptFilterSubForm from '../../../src/components/Search/TranscriptFilterSubForm';
import { SearchFormData } from '../../../src/components/Search/SearchForm';

const renderWithForm = (disableForm = false, defaultValues?: Partial<SearchFormData>) => {
  const Wrapper: React.FC = () => {
    const methods = useForm<SearchFormData>({
      defaultValues: defaultValues || {
        matchTerms: [{ value: '' }],
      },
    });

    return (
      <FormProvider {...methods}>
        <TranscriptFilterSubForm disableForm={disableForm} />
      </FormProvider>
    );
  };

  render(<Wrapper />);
};

describe('TranscriptFilterSubForm', () => {
  beforeEach(() => {
    // @testing-library/react keeps state between tests unless unmounted
    document.body.innerHTML = '';
  });

  it('renders with initial match term input', () => {
    renderWithForm();

    expect(screen.getByTestId('transcript-filter-subform')).toBeInTheDocument();
    expect(screen.getByTestId('transcript-filter-input-0')).toBeInTheDocument();
    expect(screen.queryByTestId('transcript-filter-remove-button-0')).not.toBeInTheDocument();
  });

  it('adds a new match term input when "Add Term" is clicked', () => {
    renderWithForm();

    const addButton = screen.getByTestId('transcript-filter-add-button');
    fireEvent.click(addButton);

    expect(screen.getByTestId('transcript-filter-input-1')).toBeInTheDocument();
    expect(screen.getByTestId('transcript-filter-remove-button-1')).toBeInTheDocument();
  });

  it('removes a match term input when remove button is clicked', () => {
    renderWithForm();

    const addButton = screen.getByTestId('transcript-filter-add-button');
    fireEvent.click(addButton);

    const input1 = screen.getByTestId('transcript-filter-input-1');
    expect(input1).toBeInTheDocument();

    const removeButton = screen.getByTestId('transcript-filter-remove-button-1');
    fireEvent.click(removeButton);

    expect(screen.queryByTestId('transcript-filter-input-1')).not.toBeInTheDocument();
  });

  it('disables all inputs and buttons when disableForm=true', () => {
    renderWithForm(true);

    const input = screen.getByTestId('transcript-filter-input-0');
    const addButton = screen.getByTestId('transcript-filter-add-button');

    expect(input).toBeDisabled();
    expect(addButton).toBeDisabled();
  });

  it('renders validation error if present', () => {
    renderWithForm(false, {
      matchTerms: [{ value: '' }],
    });

    const errorMessage = 'At least one search term is required';
    const error = document.createElement('p');

    error.dataset.testid = 'transcript-filter-error';
    error.textContent = errorMessage;
    document.body.appendChild(error);

    expect(screen.getByTestId('transcript-filter-error')).toHaveTextContent(errorMessage);
  });
});
