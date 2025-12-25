import React, { useState, useRef } from 'react';

// Tailwind CSS Components
const TagsContainer = ({ children, onClick }) => (
  <div 
    className="border border-gray-300 rounded-md p-2 min-h-[40px] flex flex-wrap gap-2 items-center cursor-text transition-all duration-200 focus-within:border-brand-500 focus-within:shadow-[0_0_0_3px_rgba(127,86,217,0.1)]"
    onClick={onClick}
  >
    {children}
  </div>
);

const Tag = ({ children }) => (
  <span className="bg-brand-100 text-brand-600 px-2 py-1 rounded-sm text-sm flex items-center gap-1">
    {children}
  </span>
);

const TagRemoveButton = ({ onClick }) => (
  <button 
    className="bg-transparent border-none text-brand-600 cursor-pointer text-xs p-0 hover:text-red-600 transition-colors"
    onClick={onClick}
  >
    ×
  </button>
);

const TagInput = React.forwardRef(({ ...props }, ref) => (
  <input 
    ref={ref}
    className="border-none outline-none flex-1 min-w-[120px] text-base bg-transparent"
    {...props}
  />
));
TagInput.displayName = 'TagInput';

const SuggestionsList = ({ children }) => (
  <ul className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md max-h-[200px] overflow-y-auto z-10 m-0 p-0 list-none shadow-md">
    {children}
  </ul>
);

const SuggestionItem = ({ children, isHighlighted, onClick }) => (
  <li 
    className={`p-2 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors ${
      isHighlighted ? 'bg-gray-50' : 'hover:bg-gray-50'
    }`}
    onClick={onClick}
  >
    {children}
  </li>
);

const SuggestionsContainer = ({ children }) => (
  <div className="relative">
    {children}
  </div>
);

function TagsInput({ 
  tags = [], 
  onChange, 
  placeholder = "Type and press Enter to add...", 
  suggestions = [],
  onSearch
}) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef(null);

  const addTag = (tag) => {
    if (tag && !tags.includes(tag)) {
      onChange([...tags, tag]);
      setInputValue('');
      setShowSuggestions(false);
      setHighlightedIndex(-1);
    }
  };

  const removeTag = (tagToRemove) => {
    onChange(tags.filter(tag => tag !== tagToRemove));
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    
    if (onSearch) {
      onSearch(value);
    }
    
    setShowSuggestions(value.length > 0 && suggestions.length > 0);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
        addTag(suggestions[highlightedIndex]);
      } else if (inputValue.trim()) {
        addTag(inputValue.trim());
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setHighlightedIndex(-1);
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    addTag(suggestion);
    inputRef.current?.focus();
  };

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  return (
    <SuggestionsContainer>
      <TagsContainer onClick={handleContainerClick}>
        {tags.map((tag, index) => (
          <Tag key={index}>
            {tag}
            <TagRemoveButton 
              onClick={(e) => {
                e.stopPropagation();
                removeTag(tag);
              }}
            />
          </Tag>
        ))}
        <TagInput
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : ''}
          onFocus={() => {
            if (inputValue && suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          onBlur={() => {
            // Delay hiding suggestions to allow clicks
            setTimeout(() => setShowSuggestions(false), 150);
          }}
        />
      </TagsContainer>
      
      {showSuggestions && suggestions.length > 0 && (
        <SuggestionsList>
          {suggestions.map((suggestion, index) => (
            <SuggestionItem
              key={index}
              isHighlighted={index === highlightedIndex}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </SuggestionItem>
          ))}
        </SuggestionsList>
      )}
    </SuggestionsContainer>
  );
}

export default TagsInput;