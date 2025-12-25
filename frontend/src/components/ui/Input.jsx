import React from 'react';
import { Input as AriaInput, Label, TextField } from 'react-aria-components';
import { cx } from '@/utils/cx';

const inputStyles = {
  base: "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:cursor-not-allowed disabled:opacity-50",
  label: "block text-sm font-medium text-gray-700 mb-1",
  container: "w-full"
};

export function Input({ 
  label, 
  className, 
  containerClassName,
  ...props 
}) {
  return (
    <TextField className={cx(inputStyles.container, containerClassName)}>
      {label && (
        <Label className={inputStyles.label}>
          {label}
        </Label>
      )}
      <AriaInput
        className={cx(inputStyles.base, className)}
        {...props}
      />
    </TextField>
  );
}