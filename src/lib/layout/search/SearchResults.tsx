import type { SearchResult } from "lib/services/searchService";
import type { Option } from "lib/types";

import { EmptyState } from "lib/components/state";

import { SearchResultItem } from "./SearchResultItem";

interface SearchResultsProps {
  cursor: Option<number>;
  handleSelectResult: (result?: SearchResult, isClick?: boolean) => void;
  results: SearchResult[];
  setCursor: (index: Option<number>) => void;
}
export const SearchResults = ({
  cursor,
  handleSelectResult,
  results,
  setCursor,
}: SearchResultsProps) => (
  <>
    {!results.length ? (
      <EmptyState
        imageVariant="not-found"
        message="Matches not found. Please check your spelling or make sure you have
            selected the correct network."
        textVariant="body2"
      />
    ) : (
      results.map((result, index) => (
        <SearchResultItem
          key={result.type + index.toString()}
          cursor={cursor}
          handleSelectResult={handleSelectResult}
          index={index}
          result={result}
          setCursor={setCursor}
        />
      ))
    )}
  </>
);
