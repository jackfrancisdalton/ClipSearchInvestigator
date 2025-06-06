import { z } from "zod";
import { VideoSearchSortOrder } from "../../types/index.js";
import TranscriptFilterSubForm from "./TranscriptFilterSubForm.js";
import VideoSearchSubForm from "./VideoSearchSubForm.js";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import BigButton from "../Shared/BigButton.js";

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

export const SearchForm: React.FC<SearchFormProps> = ({ onSubmit, loading }) => {
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
      <form 
        onSubmit={handleSubmit(onSubmit)} 
        role="form"
        className="p-4 space-y-6" 
        data-testid="search-form" 
      >
        <VideoSearchSubForm 
          disableForm={loading}
          data-testid="video-search-subform"
        />
        <TranscriptFilterSubForm 
          disableForm={loading} 
          data-testid="transcript-filter-subform"
        />
        <BigButton 
          disabled={loading} 
          disabledText="Searching..." 
          enabledText="Search"
          data-testid="big-button"
        ></BigButton>
      </form>
    </FormProvider>
  );
};