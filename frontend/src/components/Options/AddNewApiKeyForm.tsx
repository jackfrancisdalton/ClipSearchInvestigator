import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// TODO: rename this component to AddNewApiKeyForm

const newApiKeySchema = z.object({
  apiKey: z.string().min(10, 'API key must be at least 10 characters'), // TODO: specify what the valid api key length is
});

type FormData = z.infer<typeof newApiKeySchema>;

interface ApiKeyFormProps {
  onSave: (apiKey: string) => Promise<void>;
  errorMessage: string;
}

const AddNewApiKeyForm: React.FC<ApiKeyFormProps> = ({ onSave, errorMessage }) => {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(newApiKeySchema),
    defaultValues: { apiKey: '' },
  });

  const onSubmit = async (data: FormData) => {
    await onSave(data.apiKey);
  };

  const renderFormError = () => (
    <>
      {errors.apiKey && (
        <div
          className="mt-1 text-sm text-red-500"
          data-testid="add-new-api-key-form_error"
        >
          {errors.apiKey.message}
        </div>
      )}
    </>
  );

  const renderError = () => (
    <>
      {errorMessage && (
        <div
          className="mt-1 text-sm text-red-500"
          data-testid="add-new-api-key-error"
        >
          {errorMessage}
        </div>
      )}
    </>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
      <div className="flex items-center">
      <input
        type="text"
        {...register('apiKey')}
        className="px-4 py-2 text-sm text-white bg-gray-800 border border-gray-600 rounded-l focus:outline-primary-medium"
        placeholder="Enter new API key here..."
        data-testid="add-new-api-key_input"
      />
      <button
        type="submit"
        disabled={isSubmitting || (watch('apiKey')?.length || 0) < 10}
        className="px-4 py-2 font-medium text-white rounded-r bg-primary-medium"
        data-testid="add-new-api-key_button"
      >
        {isSubmitting ? 'Adding...' : 'Add API Key'}
      </button>
      </div>
      {renderFormError()}
      {renderError()}
    </form>
  );
};

export default AddNewApiKeyForm;
