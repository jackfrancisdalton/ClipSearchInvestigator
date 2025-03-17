import { z } from "zod";
import { VideoSearchSortOrder } from "../../types";
import TranscriptFilterSubForm from "./TranscriptFilterSubForm";
import VideoSearchSubForm from "./VideoSearchSubForm";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const searchFormSchema = z.object({
    videoSearchQuery: z.string().nonempty("Search query is required"),
    maxResults: z.number().min(1).max(50),
    sortOrder: z.nativeEnum(VideoSearchSortOrder),
    publishedAfter: z.string().optional(),
    publishedBefore: z.string().optional(),
    channelName: z.string().optional(),
    matchTerms: z.array(z.object({ value: z.string() })),
  })
  .superRefine((data, ctx) => {
    if (!data.matchTerms.some(term => term.value.trim() !== "")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "At least one search term is required",
        path: ["matchTerms"],
      });
    }
  });

export type SearchFormData = z.infer<typeof searchFormSchema>;

interface SearchFormProps {
  onSubmit: (data: SearchFormData) => void;
  loading: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSubmit, loading }) => {
  const methods = useForm<SearchFormData>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      videoSearchQuery: "",
      maxResults: 10,
      sortOrder: VideoSearchSortOrder.Relevance,
      publishedAfter: "",
      publishedBefore: "",
      channelName: "",
      matchTerms: [{ value: "" }],
    },
  });

  const { handleSubmit } = methods;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-6">
        <VideoSearchSubForm disableForm={loading} />
        <TranscriptFilterSubForm disableForm={loading} />
        <div className="text-center">
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-3 ${
              loading ? "bg-gray-500 cursor-not-allowed" : "bg-primary-600 hover:bg-primary-300"
            } text-white font-semibold rounded-lg shadow-md w-full focus:outline-none focus:ring-2 focus:ring-primary-500`}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

export default SearchForm;