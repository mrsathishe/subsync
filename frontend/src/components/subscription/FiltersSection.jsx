import React from 'react';

const FiltersContainer = ({ children }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
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
  return (
    <FiltersContainer>
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
    </FiltersContainer>
  );
};

export default FiltersSection;