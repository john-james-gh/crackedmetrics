import {describe, expect, it} from 'vitest';

import {cn} from './merge-class-names';

describe('cn', () => {
  it('should merge multiple class strings', () => {
    const result = cn('text-red-500', 'bg-blue-500', 'p-4');
    expect(result).toBe('text-red-500 bg-blue-500 p-4');
  });

  it('should handle conditional classes', () => {
    const isActive = true;
    const isDisabled = false;

    const result = cn('base-class', isActive && 'active-class', isDisabled && 'disabled-class');

    expect(result).toBe('base-class active-class');
  });

  it('should handle array inputs', () => {
    const result = cn(['text-lg', 'font-bold'], 'text-center');
    expect(result).toBe('text-lg font-bold text-center');
  });

  it('should handle nested arrays', () => {
    const result = cn(['text-lg', ['font-bold', 'text-center']], 'mt-4');
    expect(result).toBe('text-lg font-bold text-center mt-4');
  });

  it('should handle object notation', () => {
    const result = cn({
      'text-lg': true,
      'font-bold': true,
      'text-red-500': false,
      'bg-blue-500': true,
    });

    expect(result).toBe('text-lg font-bold bg-blue-500');
  });

  it('should handle mixed inputs', () => {
    const isActive = true;
    const classes = ['text-lg', 'font-bold'];

    const result = cn('base-class', classes, isActive && 'active-class', {'conditional-class': true});

    expect(result).toBe('base-class text-lg font-bold active-class conditional-class');
  });

  it('should handle empty inputs', () => {
    const result = cn('', null, undefined, false, []);
    expect(result).toBe('');
  });

  it('should handle Tailwind CSS class conflicts', () => {
    // tailwind-merge should resolve conflicts by keeping the last occurrence
    const result = cn('text-red-500', 'text-blue-500', 'text-green-500');
    expect(result).toBe('text-green-500');
  });

  it('should handle complex Tailwind CSS merging', () => {
    const result = cn('px-2 py-1 bg-red-500', 'px-4 py-2 bg-blue-500', 'text-white');

    expect(result).toBe('px-4 py-2 bg-blue-500 text-white');
  });

  it('should handle responsive and variant classes', () => {
    const result = cn('text-sm md:text-lg', 'text-base lg:text-xl', 'font-normal hover:font-bold');

    expect(result).toBe('md:text-lg text-base lg:text-xl font-normal hover:font-bold');
  });

  it('should handle arbitrary values', () => {
    const result = cn('w-[100px]', 'h-[200px]', 'bg-[#ff0000]');
    expect(result).toBe('w-[100px] h-[200px] bg-[#ff0000]');
  });

  it('should handle complex conditional logic', () => {
    const variant = 'primary' as string;
    const size = 'large' as string;
    const disabled = false;

    const result = cn(
      'btn',
      variant === 'primary' && 'btn-primary',
      variant === 'secondary' && 'btn-secondary',
      size === 'large' && 'btn-lg',
      size === 'small' && 'btn-sm',
      disabled && 'btn-disabled',
    );

    expect(result).toBe('btn btn-primary btn-lg');
  });
});
