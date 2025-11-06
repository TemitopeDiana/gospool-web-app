import { useEffect, useMemo, useRef, useState } from 'react';
import SvgIcon from './svg-icon';

export type Option = { value: string; label: string };

interface SelectProps {
  options: Option[];
  multiple?: boolean;
  value?: string | string[] | null;
  onChange: (value: string | string[] | null) => void;
  placeholder?: string;
  className?: string;
}

export default function TypeSelect({
  options,
  multiple = false,
  value,
  onChange,
  placeholder = 'Select',
  className = '',
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState<number>(-1);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const selectedArray = useMemo(() => {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  }, [value]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  useEffect(() => {
    if (open) setActiveIdx(0);
    else setActiveIdx(-1);
  }, [open]);

  const isSelected = (val: string) => selectedArray.indexOf(val) >= 0;

  const toggleSelect = (val: string) => {
    if (multiple) {
      const next = isSelected(val)
        ? selectedArray.filter((v) => v !== val)
        : [...selectedArray, val];
      onChange(next.length ? next : null);
    } else {
      onChange(val);
      setOpen(false);
    }
  };

  const removeChip = (val: string) => {
    if (!multiple) {
      onChange(null);
      return;
    }
    const next = selectedArray.filter((v) => v !== val);
    onChange(next.length ? next : null);
  };

  const onKeyDown: React.KeyboardEventHandler = (e) => {
    if (
      !open &&
      (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ')
    ) {
      e.preventDefault();
      setOpen(true);
      return;
    }
    if (open) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIdx((i) => Math.min(i + 1, options.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIdx((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Escape') {
        setOpen(false);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (activeIdx >= 0) {
          toggleSelect(options[activeIdx].value);
        }
      }
    }
  };

  return (
    <div
      ref={rootRef}
      className={`relative w-full ${className}`}
      onKeyDown={onKeyDown}
    >
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((s) => !s)}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border
                    border-gray-200 bg-background text-left   focus:outline-none focus:ring-0 focus:border-gray-200 focus:shadow-none transition-shadow`}
      >
        <div className="flex-1 truncate">
          {selectedArray.length === 0 ? (
            <span className="text-gray-400">{placeholder}</span>
          ) : multiple ? (
            <span className="text-gray-800">{`${selectedArray.length} selected`}</span>
          ) : (
            <span className="text-gray-800">
              {options.find((o) => o.value === selectedArray[0])?.label}
            </span>
          )}
        </div>

        <SvgIcon
          name="arrow-down"
          className={`w-4 h-4 ml-3 transition-transform ${open ? 'rotate-180' : 'rotate-0'} text-gray-500`}
        />
      </button>

      {/* Selected chips area — only for multi-select */}
      {multiple && selectedArray.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {selectedArray.map((val) => {
            const opt = options.find((o) => o.value === val);
            return (
              <div
                key={val}
                className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-sm text-gray-800"
              >
                <span className="max-w-[240px] truncate">
                  {opt?.label ?? val}
                </span>
                <button
                  type="button"
                  onClick={() => removeChip(val)}
                  className="p-1 rounded-full hover:bg-gray-200"
                  aria-label={`Remove ${opt?.label ?? val}`}
                >
                  <SvgIcon name="close" className="w-3 h-3 text-gray-600" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Dropdown list */}
      {open && (
        <ul
          role="listbox"
          aria-multiselectable={multiple || undefined}
          tabIndex={-1}
          className="absolute z-50 mt-2 w-full bg-background border border-gray-200 rounded-lg shadow-lg max-h-56 overflow-auto"
        >
          {options.map((opt, idx) => {
            const selected = isSelected(opt.value);
            const active = idx === activeIdx;

            return (
              <li
                key={opt.value}
                id={`option-${idx}`}
                role="option"
                aria-selected={selected}
                onMouseEnter={() => setActiveIdx(idx)}
                onClick={() => toggleSelect(opt.value)}
                className={`cursor-pointer px-4 py-3 flex items-center justify-between ${
                  active ? 'bg-gray-50' : ''
                } ${selected ? 'font-semibold' : 'text-gray-700'}`}
              >
                <span className="truncate">{opt.label}</span>
                {selected && (
                  <SvgIcon name="check" className="w-4 h-4 text-primary-500" />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
