import { useApiKeysManagement } from '../hooks/useApiKeysManagement.js';
import ApiKeyManagementTable from '../components/Options/ApiKeyManagementTable.js';
import AddNewApiKey from '../components/Options/AddNewApiKey.js';
import FactoryResetApp from '../components/Options/FactoryResetApp.js';

const OptionsPage = () => {
  const { apiKeys, errors, activateKey, deleteKey, saveKey, deleteAllKeys } = useApiKeysManagement();

  return (
    <div className="flex p-4 bg-background-dark">
      <div className="p-4 rounded bg-background-medium">
        <h3 className="mb-2 text-xl text-white">Manage API Keys</h3>
        {errors.fetch && (
          <div className="p-2 mb-2 text-sm text-white bg-red-500 rounded">
            {errors.fetch}
          </div>
        )}
        <ApiKeyManagementTable
          apiKeys={apiKeys}
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
