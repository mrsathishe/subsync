import React, { useState, useRef, useEffect } from 'react';
import { adminAPI } from '../services/api';

const UserSearchInput = ({ selectedUsers, onUsersChange, placeholder = "Search users..." }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    setIsSearching(true);
    try {
      const result = await adminAPI.searchUsers(query);
      setSearchResults(result.users || []);
      setShowDropdown(true);
    } catch (error) {
      console.error('Error searching users:', error);
      setSearchResults([]);
      setShowDropdown(false);
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setSearchQuery(value);
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      handleSearch(value);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (searchQuery.trim()) {
        // If no users found in search, add as custom text
        if (searchResults.length === 0) {
          addCustomUser(searchQuery.trim());
        }
      }
    }
  };

  const addCustomUser = (name) => {
    const customUser = {
      id: `custom_${Date.now()}`,
      name: name,
      isCustom: true
    };
    
    const updatedUsers = [...selectedUsers, customUser];
    onUsersChange(updatedUsers);
    setInputValue('');
    setSearchQuery('');
    setShowDropdown(false);
  };

  const addUser = (user) => {
    const userToAdd = {
      id: user.id,
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      isCustom: false,
      userData: user
    };

    const updatedUsers = [...selectedUsers, userToAdd];
    onUsersChange(updatedUsers);
    setInputValue('');
    setSearchQuery('');
    setShowDropdown(false);
  };

  const removeUser = (userId) => {
    const updatedUsers = selectedUsers.filter(user => user.id !== userId);
    onUsersChange(updatedUsers);
  };

  const handleSearchIconClick = () => {
    if (searchQuery.trim()) {
      handleSearch(searchQuery);
    }
  };

  return (
    <div className="relative">
      {/* Selected Users Tags */}
      {selectedUsers.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedUsers.map((user) => (
            <div
              key={user.id}
              className="inline-flex items-center bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
            >
              <span className="mr-2">
                {user.isCustom ? user.name : `${user.name} (${user.email})`}
              </span>
              <button
                type="button"
                onClick={() => removeUser(user.id)}
                className="text-blue-600 hover:text-blue-800 focus:outline-none"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="w-full p-2 pr-10 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
        <button
          type="button"
          onClick={handleSearchIconClick}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>

      {/* Search Results Dropdown */}
      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
        >
          {isSearching && (
            <div className="p-4 text-center text-gray-500">
              Searching...
            </div>
          )}
          
          {!isSearching && searchResults.length === 0 && searchQuery.trim() && (
            <div className="p-4 text-center text-gray-500">
              <div>No users found</div>
              <button
                type="button"
                onClick={() => addCustomUser(searchQuery)}
                className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
              >
                Add "{searchQuery}" as custom entry
              </button>
            </div>
          )}

          {!isSearching && searchResults.length > 0 && (
            <>
              {searchResults.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => addUser(user)}
                  className="w-full p-3 text-left hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                  disabled={selectedUsers.some(selected => selected.id === user.id)}
                >
                  <div className="font-medium text-gray-900">
                    {user.first_name} {user.last_name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {user.email}
                  </div>
                  {selectedUsers.some(selected => selected.id === user.id) && (
                    <div className="text-xs text-green-600 mt-1">
                      Already added
                    </div>
                  )}
                </button>
              ))}
              
              {/* Option to add custom entry even when users found */}
              {searchQuery.trim() && !searchResults.some(user => 
                `${user.first_name} ${user.last_name}`.toLowerCase() === searchQuery.toLowerCase()
              ) && (
                <button
                  type="button"
                  onClick={() => addCustomUser(searchQuery)}
                  className="w-full p-3 text-left hover:bg-gray-50 border-t border-gray-200 text-blue-600"
                >
                  Add "{searchQuery}" as custom entry
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default UserSearchInput;