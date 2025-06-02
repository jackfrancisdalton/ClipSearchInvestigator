import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { fireEvent, screen, render } from '@testing-library/react';
import VideoSearchSubForm from '../../../src/components/Search/VideoSearchSubForm';
import { SearchFormData } from '../../../src/components/Search/SearchForm';
import { VideoSearchSortOrder } from '../../../src/types';

const renderWithForm = (disableForm = false, defaultValues?: Partial<SearchFormData>) => {
  const Wrapper: React.FC = () => {
    const methods = useForm<SearchFormData>({
      defaultValues: defaultValues || {
        videoSearchQuery: '',
        maxResults: 10,
        sortOrder: VideoSearchSortOrder.Relevance,
        publishedAfter: '',
        publishedBefore: '',
        channelName: '',
        matchTerms: [{ value: '' }],
      },
    });

    return (
      <FormProvider {...methods}>
        <VideoSearchSubForm disableForm={disableForm} />
      </FormProvider>
    );
  };

  render(<Wrapper />);
};

describe('VideoSearchSubForm', () => {
  it('renders required base inputs', () => {
    renderWithForm();

    expect(screen.getByTestId('video-search-subform')).toBeInTheDocument();
    expect(screen.getByTestId('video-search-query-input')).toBeInTheDocument();
    expect(screen.getByTestId('video-search-max-results-slider')).toBeInTheDocument();
    expect(screen.getByTestId('video-search-show-more-button')).toBeInTheDocument();
  });

  it('toggles additional inputs when "Show More" is clicked', () => {
    renderWithForm();

    const button = screen.getByTestId('video-search-show-more-button');
    fireEvent.click(button);

    expect(screen.getByTestId('video-search-channel-name')).toBeInTheDocument();
    expect(screen.getByTestId('video-search-sort-order')).toBeInTheDocument();
    expect(screen.getByTestId('video-search-published-after')).toBeInTheDocument();
    expect(screen.getByTestId('video-search-published-before')).toBeInTheDocument();
  });

  it('hides advanced inputs when "Show Less" is clicked', () => {
    renderWithForm();

    const button = screen.getByTestId('video-search-show-more-button');
    fireEvent.click(button); // Show more
    fireEvent.click(button); // Show less

    expect(screen.queryByTestId('video-search-channel-name')).not.toBeInTheDocument();
    expect(screen.queryByTestId('video-search-sort-order')).not.toBeInTheDocument();
    expect(screen.queryByTestId('video-search-published-after')).not.toBeInTheDocument();
    expect(screen.queryByTestId('video-search-published-before')).not.toBeInTheDocument();
  });

  it('disables all inputs when disableForm=true', () => {
    renderWithForm(true);

    expect(screen.getByTestId('video-search-query-input')).toBeDisabled();
    expect(screen.getByTestId('video-search-max-results-slider')).toBeDisabled();

    fireEvent.click(screen.getByTestId('video-search-show-more-button'));
    expect(screen.getByTestId('video-search-channel-name-input')).toBeDisabled();
    expect(screen.getByTestId('video-search-sort-order-select')).toBeDisabled();
    expect(screen.getByTestId('video-search-published-after-input')).toBeDisabled();
    expect(screen.getByTestId('video-search-published-before-input')).toBeDisabled();
  });

  it('displays error message for videoSearchQuery if present', async () => {
    const WrapperWithError: React.FC = () => {
      const methods = useForm<SearchFormData>({
        defaultValues: {
          videoSearchQuery: '',
          maxResults: 10,
          sortOrder: VideoSearchSortOrder.Relevance,
          publishedAfter: '',
          publishedBefore: '',
          channelName: '',
          matchTerms: [{ value: '' }],
        },
      });
  
      useEffect(() => {
        methods.setError('videoSearchQuery', {
          type: 'manual',
          message: 'Search query is required',
        });
      }, []);
  
      return (
        <FormProvider {...methods}>
          <VideoSearchSubForm disableForm={false} />
        </FormProvider>
      );
    };
  
    render(<WrapperWithError />);
  
    const errorMessage = await screen.findByTestId('video-search-query-error');
    expect(errorMessage).toHaveTextContent('Search query is required');
  });
});
