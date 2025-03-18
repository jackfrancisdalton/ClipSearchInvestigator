import { useApiKeysManagagment } from '../hooks/apiKeysManagement';
import ApiKeyManagementTable from '../components/Options/ApiKeyManagementTable';
import AddNewApiKey from '../components/Options/AddNewApiKey';
import FactoryResetApp from '../components/Options/FactoryResetApp';

const OptionsPage = () => {
  const { apiKeys, errors, activateKey, deleteKey, saveKey, deleteAllKeys } = useApiKeysManagagment();

  return (
    <div className="flex p-4 bg-background-700">
      <div className="p-4 rounded bg-background-600">
        <h3>Manage API Keys</h3>
        {errors.fetch && <div className="mb-2 text-sm text-red-500">{errors.fetch}</div>}

        <ApiKeyManagementTable
          apiKeys={apiKeys.apiKeys}
          errors={errors.row}
          onActivate={activateKey}
          onDelete={deleteKey}
        />

        <AddNewApiKey onSave={saveKey} errorMessage={errors.newApiKey} />

        <FactoryResetApp onDeleteAll={deleteAllKeys} errorMessage={errors.deleteAll} />
      </div>
    </div>
  );
};

export default OptionsPage;
