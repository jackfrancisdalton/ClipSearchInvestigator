import { deleteAllApiKeys } from "../api";

const options = [
  "Option 1",
  "Option 2",
  "Option 3",
  "Option 4",
  // …more options
];

const OptionsPage = () => {

  const deleteApiKeys = async () => {
    const result = await deleteAllApiKeys()
  }


  return (
    <div className="h-full p-4 overflow-auto">
      <h2 className="mb-4 text-2xl font-semibold">Options</h2>
      <ul className="space-y-2">
        {options.map((option, index) => (
          <li key={index} className="p-4 bg-white rounded-md shadow">
            {option}
          </li>
        ))}
      </ul>
      <button onClick={() => deleteApiKeys()}>Delete All API Keys</button>
    </div>
  );
};

export default OptionsPage;