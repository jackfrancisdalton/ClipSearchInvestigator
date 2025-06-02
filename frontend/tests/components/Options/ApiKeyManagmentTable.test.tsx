import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ApiKey } from '../../../src/types';
import ApiKeyManagementTable from '../../../src/components/Options/ApiKeyManagementTable';

describe('ApiKeyManagementTable', () => {
  const mockActivate = vi.fn();
  const mockDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders API key rows with correct text content', () => {
    const apiKeys: ApiKey[] = [
        { id: 1, apiKey: 'key-one-123456', isActive: false },
        { id: 2, apiKey: 'key-two-abcdef', isActive: true },
    ];

    render(
      <ApiKeyManagementTable
        apiKeys={apiKeys}
        errors={{}}
        onActivate={mockActivate}
        onDelete={mockDelete}
      />
    );

    apiKeys.forEach((key, idx) => {
      expect(screen.getByTestId(`api-key-management-table_api-key-${idx}`)).toHaveTextContent(key.apiKey);
      expect(screen.getByTestId(`api-key-management-table_status-${idx}`)).toBeInTheDocument();
      expect(screen.getByTestId(`api-key-management-table_delete-button-${idx}`)).toBeInTheDocument();
    });
  });

  it('shows "Is Active" status for active keys and "Activate" button for inactive ones', () => {
    const apiKeys: ApiKey[] = [
        { id: 1, apiKey: 'key-one-123456', isActive: false },
        { id: 2, apiKey: 'key-two-abcdef', isActive: true },
    ];

    render(
      <ApiKeyManagementTable
        apiKeys={apiKeys}
        errors={{}}
        onActivate={mockActivate}
        onDelete={mockDelete}
      />
    );

    const status0 = screen.getByTestId('api-key-management-table_status-0');
    const status1 = screen.getByTestId('api-key-management-table_status-1');

    expect(status0).toHaveTextContent('Activate');
    expect(status1).toHaveTextContent('Is Active');
  });

  it('calls onActivate with correct id when "Activate" is clicked', () => {
    const apiKeys: ApiKey[] = [
        { id: 1, apiKey: 'key-one-123456', isActive: false },
        { id: 2, apiKey: 'key-two-abcdef', isActive: true },
    ];

    render(
      <ApiKeyManagementTable
        apiKeys={apiKeys}
        errors={{}}
        onActivate={mockActivate}
        onDelete={mockDelete}
      />
    );

    const activateButton = screen.getByTestId('api-key-management-table_status-0').querySelector('button');
    fireEvent.click(activateButton!);

    expect(mockActivate).toHaveBeenCalledTimes(1);
    expect(mockActivate).toHaveBeenCalledWith(1);
  });

  it('calls onDelete with correct id when "Delete" is clicked', () => {
    const apiKeys: ApiKey[] = [
        { id: 1, apiKey: 'key-one-123456', isActive: false },
        { id: 2, apiKey: 'key-two-abcdef', isActive: true },
    ];

    render(
      <ApiKeyManagementTable
        apiKeys={apiKeys}
        errors={{}}
        onActivate={mockActivate}
        onDelete={mockDelete}
      />
    );

    const deleteButton = screen.getByTestId('api-key-management-table_delete-button-0');
    fireEvent.click(deleteButton);

    expect(mockDelete).toHaveBeenCalledTimes(1);
    expect(mockDelete).toHaveBeenCalledWith(1);
  });

  it('disables "Delete" button if only one inactive key exists', () => {
    const oneInactiveKey: ApiKey[] = [
        { id: 1, apiKey: 'solo-key-9999', isActive: false }
    ];

    render(
      <ApiKeyManagementTable
        apiKeys={oneInactiveKey}
        errors={{}}
        onActivate={mockActivate}
        onDelete={mockDelete}
      />
    );

    const deleteButton = screen.getByTestId('api-key-management-table_delete-button-0');

    expect(deleteButton).toBeDisabled();
    expect(deleteButton).toHaveAttribute(
      'title',
      'You must have at least one API key, add a new one if you wish to delete this one'
    );
  });

  it('renders error message for key when provided in errors object', () => {
    const apiKeys: ApiKey[] = [
        { id: 1, apiKey: 'key-one-123456', isActive: false },
        { id: 2, apiKey: 'key-two-abcdef', isActive: true },
    ];
    const errors = {
        1: 'Activation failed for key-one.',
    };

    render(
      <ApiKeyManagementTable
        apiKeys={apiKeys}
        errors={errors}
        onActivate={mockActivate}
        onDelete={mockDelete}
      />
    );

    const rowWithError = screen.getByTestId('api-key-management-table_api-key-0');
    expect(rowWithError).toBeInTheDocument();
    expect(screen.getByText(errors[1])).toBeInTheDocument();
  });
});
