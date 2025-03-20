import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { SearchFormData } from "./SearchForm";

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
    <div className="border border-primary-700">
      <div className="items-center justify-start p-2 bg-background-600">
        <h3 className="font-bold text-center text-white-50">Transcript Search</h3>
      </div>
      <div className="w-auto h-0.5 bg-primary-700"></div>
      <div className="p-3 bg-background-500">
        {/* Dynamic List of Input Boxes for Search Terms */}
        <div className="mb-6">
          <label className="block mb-2 font-medium text-l text-white-100">
            Transcript Term you want to find
          </label>
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center mb-2">
              <input
                type="text"
                className={`w-full p-3 border rounded-lg text-white-100 bg-white-700 ${
                  errors.matchTerms ? "border-red-500" : "border-primary-800"
                } focus:ring-2 focus:ring-primary-500 focus:outline-none`}
                placeholder="Enter search term"
                {...register(`matchTerms.${index}.value`)}
                disabled={disableForm}
              />
              <button
                type="button"
                className="p-3 ml-2 bg-red-600 rounded-lg text-white-100"
                onClick={() => remove(index)}
                disabled={disableForm}
              >
                X
              </button>
            </div>
          ))}
          {errors.matchTerms && (
            <p className="mt-1 text-sm text-red-500">
              {errors.matchTerms?.root?.message}
            </p>
          )}
          <button
            type="button"
            className="p-2 mt-2 text-white rounded-lg bg-primary-600"
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
