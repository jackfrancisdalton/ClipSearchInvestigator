import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const newApiKeySchema = z.object({
  apiKey: z.string().min(10, 'API key must be at least 10 characters'),
});

type FormData = z.infer<typeof newApiKeySchema>;

interface ApiKeyFormProps {
  onSave: (apiKey: string) => Promise<void>;
  errorMessage: string;
}

const AddNewApiKey: React.FC<ApiKeyFormProps> = ({ onSave, errorMessage }) => {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(newApiKeySchema),
    defaultValues: { apiKey: '' },
  });

  const onSubmit = async (data: FormData) => {
    await onSave(data.apiKey);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
      <h3>Add a new API Key</h3>
      <h4>Add a new API key you'd like to use</h4>
      <input
        type="text"
        {...register('apiKey')}
        className="px-4 py-2 mr-2 text-sm bg-gray-800 border border-gray-600 rounded text-white-50"
        placeholder="Enter new API key"
      />
      {errors.apiKey && <div className="mt-1 text-sm text-red-500">{errors.apiKey.message}</div>}
      <button
        type="submit"
        disabled={isSubmitting || (watch('apiKey')?.length || 0) < 10}
        className="px-4 py-2 font-medium bg-blue-600 rounded text-white-50"
      >
        {isSubmitting ? 'Adding...' : 'Add API Key'}
      </button>
      {errorMessage && <div className="mt-1 text-sm text-red-500">{errorMessage}</div>}
    </form>
  );
};

export default AddNewApiKey;
