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
    <div className="overflow-hidden border rounded-md border-primary-dark">
      <div className="items-center justify-start p-2 bg-background-medium">
        <h3 className="font-bold text-center text-white">Transcript Terms</h3>
      </div>
      <div className="w-auto h-0.5 bg-primary-dark"></div>
      <div className="p-3 bg-background-light">
        {/* Dynamic List of Input Boxes for Search Terms */}
        <div className="mb-6">
          <label className="block mb-2 font-medium text-l text-white-medium">
            Terms you want to find in the video results
          </label>
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center mb-2">
              <input
                type="text"
                className={`w-full p-3 border rounded-lg text-white-medium bg-white-dark ${
                  errors.matchTerms ? "border-red-500" : "border-primary-darker"
                } focus:ring-2 focus:ring-primary-light focus:outline-none`}
                placeholder="Enter search term"
                {...register(`matchTerms.${index}.value`)}
                disabled={disableForm}
              />
              {index > 0 &&
                (<button
                  type="button"
                  className="p-3 ml-2 bg-red-600 rounded-lg hover:bg-red-700 text-white-medium"
                  onClick={() => remove(index)}
                  disabled={disableForm}
                >
                  <X className="w-6 h-6" strokeWidth={3} />
                </button>)
              }

            </div>
          ))}
          {errors.matchTerms && (
            <p className="mt-1 text-sm text-red-500">
              {errors.matchTerms?.root?.message}
            </p>
          )}
          <button
            type="button"
            className="p-2 mt-2 text-white rounded-lg bg-primary-medium hover:bg-primary-dark"
            onClick={() => append({ value: "" })}
            disabled={disableForm}
          >
            Add Term
          </button>
        </div>
      </div>
    </div>
  );
};

export default TranscriptFilterSubForm;
