import React, { useState } from 'react';

const FiltersContainer = ({ children }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
    {children}
  </div>
);

const FiltersHeader = ({ isExpanded, onToggle, hasActiveFilters }) => (
  <div className="flex items-center justify-between p-4 border-b border-gray-200 cursor-pointer" onClick={onToggle}>
    <div className="flex items-center gap-3">
      <span className="text-lg font-semibold text-gray-800">Filters & Search</span>
      {hasActiveFilters && (
        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
          Active
        </span>
      )}
    </div>
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500">
        {isExpanded ? 'Hide' : 'Show'} Filters
      </span>
      <span className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
        ▼
      </span>
    </div>
  </div>
);

const FiltersContent = ({ children }) => (
  <div className="p-6">
    {children}
  </div>
);

const FiltersGrid = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
    {children}
  </div>
);

const FilterGroup = ({ children }) => (
  <div className="flex flex-col gap-2">{children}</div>
);

const FilterLabel = ({ children }) => (
  <label className="text-sm font-semibold text-gray-700">{children}</label>
);

const FilterInput = ({ ...props }) => (
  <input 
    className="p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
    {...props}
  />
);

const FilterSelect = ({ children, ...props }) => (
  <select 
    className="p-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
    {...props}
  >
    {children}
  </select>
);

const Button = ({ children, variant = 'primary', disabled, ...props }) => {
  const baseClasses = "px-4 py-2 rounded-md text-sm font-semibold cursor-pointer transition-all border-none disabled:opacity-60 disabled:cursor-not-allowed";
  
  const variantClasses = {
    primary: "bg-brand-600 text-white hover:bg-brand-700",
    secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50",
    danger: "bg-red-600 text-white hover:bg-red-700"
  };

  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

const FiltersSection = ({ 
  filterConfig, 
  filters, 
  onFilterChange, 
  onClearFilters 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Check if any filters have values
  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <FiltersContainer>
      <FiltersHeader
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded(!isExpanded)}
        hasActiveFilters={hasActiveFilters}
      />
      
      {isExpanded && (
        <FiltersContent>
          <FiltersGrid>
            {filterConfig.map((filter) => (
              <FilterGroup key={filter.key}>
                <FilterLabel>{filter.label}</FilterLabel>
                {filter.type === 'input' ? (
                  <FilterInput
                    type="text"
                    placeholder={filter.placeholder}
                    value={filters[filter.key]}
                    onChange={(e) => onFilterChange(filter.key, e.target.value)}
                  />
                ) : (
                  <FilterSelect
                    value={filters[filter.key]}
                    onChange={(e) => onFilterChange(filter.key, e.target.value)}
                  >
                    {filter.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </FilterSelect>
                )}
              </FilterGroup>
            ))}
          </FiltersGrid>
          
          <div className="flex gap-3">
            <Button variant="secondary" onClick={onClearFilters}>
              Clear Filters
            </Button>
          </div>
        </FiltersContent>
      )}
    </FiltersContainer>
  );
};

export default FiltersSection;