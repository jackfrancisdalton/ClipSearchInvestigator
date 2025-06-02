import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { SearchFormData } from "./SearchForm.js";
import { X } from "lucide-react";

interface TranscriptFilterSubFormProps {
  disableForm: boolean;
}

const TranscriptFilterSubForm: React.FC<TranscriptFilterSubFormProps> = ({ disableForm }) => {
  const { control, register, formState: { errors } } = useFormContext<SearchFormData>();
  const { fields, append, remove } = useFieldArray({
    name: "matchTerms",
    control,
  });
  
  return (
    <div
      className="overflow-hidden border rounded-md border-primary-dark"
      data-testid="transcript-filter-subform"
    >
      {/* Header */}
      <div
        className="items-center justify-start p-2 bg-background-medium"
        data-testid="transcript-filter-header"
      >
        <h3 className="font-bold text-center text-white">Transcript Terms</h3>
      </div>
      
      {/* Line Break */}
      <div className="w-auto h-0.5 bg-primary-dark"></div>
      
      <div 
        className="p-3 bg-background-light" 
        data-testid="transcript-filter-body"
      >
        <div 
          className="mb-6" 
          data-testid="transcript-filter-terms-section"
        >
          <label
            className="block mb-2 font-medium text-l text-white-medium"
            data-testid="transcript-filter-label"
          >
            Terms you want to find in the video results
          </label>
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex items-center mb-2"
              data-testid={`transcript-filter-term-${index}`}
            >
              <input
                type="text"
                className={`w-full p-3 border rounded-lg text-white-medium bg-white-dark ${
                  errors.matchTerms ? "border-red-500" : "border-primary-darker"
                } focus:ring-2 focus:ring-primary-light focus:outline-none`}
                placeholder="Enter search term"
                {...register(`matchTerms.${index}.value`)}
                disabled={disableForm}
                data-testid={`transcript-filter-input-${index}`}
              />
              {index > 0 && (
                <button
                  type="button"
                  className="p-3 ml-2 bg-red-600 rounded-lg hover:bg-red-700 text-white-medium"
                  onClick={() => remove(index)}
                  disabled={disableForm}
                  data-testid={`transcript-filter-remove-button-${index}`}
                >
                  <X className="w-6 h-6" strokeWidth={3} />
                </button>
              )}
            </div>
          ))}
          {errors.matchTerms && (
            <p className="mt-1 text-sm text-red-500" data-testid="transcript-filter-error">
              {errors.matchTerms?.root?.message}
            </p>
          )}
          <button
            type="button"
            className="p-2 mt-2 text-white transition-colors duration-300 rounded-lg bg-primary-medium hover:bg-primary-dark"
            onClick={() => append({ value: "" })}
            disabled={disableForm}
            data-testid="transcript-filter-add-button"
          >
            Add Term
          </button>
        </div>
      </div>
    </div>
    );
  };

export default TranscriptFilterSubForm;