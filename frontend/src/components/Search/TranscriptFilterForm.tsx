import { TranscriptFilterState } from "../../types";


interface TranscriptFilterFormProps {
    transcriptFilterState: TranscriptFilterState;
    setTranscriptFilterState: (state: Partial<TranscriptFilterState>) => void;
    disableForm: boolean
}

function TranscriptFilterForm({ transcriptFilterState, setTranscriptFilterState, disableForm }: TranscriptFilterFormProps) {

  return (
    <div>
      <div className="items-center justify-start inline-block p-2 bg-primary-600">
        <h3 className="text-white-50">Search transcripts for</h3>
      </div>
      <div className="w-auto h-0.5 bg-primary-600"></div>
      <div className="p-3 bg-background-500">
          {/* Dynamic List of Input Boxes for Search Terms */}
        <div className="mb-6">
          <label className="block mb-2 font-medium text-l text-white-100">Transcript Term you want to find</label>
          {transcriptFilterState.matchTerms.map((term, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="text"
                className="w-full p-3 border rounded-lg text-white-100 bg-white-700 border-primary-800 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                value={term}
                onChange={(e) => {
                  const newTerms = [...transcriptFilterState.matchTerms];
                  newTerms[index] = e.target.value;
                  setTranscriptFilterState({ matchTerms: newTerms });
                }}
              />
              <button
                type="button"
                className="p-3 ml-2 bg-red-600 rounded-lg text-white-100"
                onClick={() => {
                  const newTerms = transcriptFilterState.matchTerms.filter((_, i) => i !== index);
                  setTranscriptFilterState({ matchTerms: newTerms });
                }}
              >
                [X]
              </button>
            </div>
          ))}
          <button
            type="button"
            className="p-2 mt-2 text-white rounded-lg bg-primary-600"
            onClick={() => setTranscriptFilterState({ matchTerms: [...transcriptFilterState.matchTerms, ''] })}
          >
            Add Term
          </button>
        </div>
      </div>
    </div>
  );
}

export default TranscriptFilterForm;