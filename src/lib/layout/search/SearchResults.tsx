import { EmptyState } from "lib/components/state";
import type { SearchResult } from "lib/services/searchService";
import type { Option } from "lib/types";

import { SearchResultItem } from "./SearchResultItem";

interface SearchResultsProps {
  results: SearchResult[];
  cursor: Option<number>;
  setCursor: (index: Option<number>) => void;
  handleSelectResult: (result?: SearchResult, isClick?: boolean) => void;
}
export const SearchResults = ({
  results,
  cursor,
  setCursor,
  handleSelectResult,
}: SearchResultsProps) => (
  <>
    {!results.length ? (
      <EmptyState
        imageVariant="not-found"
        textVariant="body2"
        message="Matches not found. Please check your spelling or make sure you have
            selected the correct network."
      />
    ) : (
      results.map((result, index) => (
        <SearchResultItem
          key={result.type + index.toString()}
          index={index}
          result={result}
          cursor={cursor}
          setCursor={setCursor}
          handleSelectResult={handleSelectResult}
        />
      ))
    )}
  </>
);
