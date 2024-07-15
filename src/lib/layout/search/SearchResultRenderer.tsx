import { EmptyState } from "lib/components/state";
import type {
  ResultMetadata,
  SearchResultType,
} from "lib/services/searchService";
import type { Option } from "lib/types";

import { SearchResultItem } from "./SearchResultItem";

interface SearchResultRendererProps {
  results: SearchResultType[];
  keyword: string;
  cursor: Option<number>;
  metadata: ResultMetadata;
  setCursor: (index: Option<number>) => void;
  handleSelectResult: (type?: SearchResultType, isClick?: boolean) => void;
  onClose?: () => void;
}
export const SearchResultRenderer = ({
  results,
  keyword,
  cursor,
  metadata,
  setCursor,
  handleSelectResult,
  onClose,
}: SearchResultRendererProps) => (
  <>
    {!results.length ? (
      <EmptyState
        imageVariant="not-found"
        textVariant="body2"
        message="Matches not found. Please check your spelling or make sure you have
            selected the correct network."
      />
    ) : (
      results.map((type, index) => (
        <SearchResultItem
          key={type}
          index={index}
          type={type}
          value={keyword}
          cursor={cursor}
          metadata={metadata}
          setCursor={setCursor}
          handleSelectResult={handleSelectResult}
          onClose={onClose}
        />
      ))
    )}
  </>
);
