import {
  useState,
  useRef,
  useEffect,
  type InputHTMLAttributes,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
  type ReactNode,
} from 'react';

const fieldBase =
  'w-full h-9 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 outline-none transition-all duration-150 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed';

interface FieldProps {
  label?: string;
  error?: string;
  children: ReactNode;
}

export function Field({ label, error, children }: FieldProps) {
  return (
    <div>
      {label && (
        <label className="block text-xs font-medium text-slate-600 mb-1.5 tracking-wide">
          {label}
        </label>
      )}
      {children}
      {error && <p className="mt-1.5 text-xs text-rose-600">{error}</p>}
    </div>
  );
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className = '', ...rest }: InputProps) {
  const input = <input {...rest} className={`${fieldBase} ${className}`} />;
  if (label) return <Field label={label}>{input}</Field>;
  return input;
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function Textarea({ label, className = '', ...rest }: TextareaProps) {
  const ta = (
    <textarea {...rest} className={`${fieldBase} auto leading-relaxed py-2 resize-none ${className}`} />
  );
  if (label) return <Field label={label}>{ta}</Field>;
  return ta;
}

type OptionDef = { value: string; label: string; disabled?: boolean };

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  options?: OptionDef[];
  children?: ReactNode;
  size?: 'sm' | 'md';
}

function parseOptions(children: ReactNode): OptionDef[] {
  const opts: OptionDef[] = [];
  const push = (child: any) => {
    if (!child) return;
    if (Array.isArray(child)) {
      child.forEach(push);
      return;
    }
    if (child?.type === 'option') {
      opts.push({
        value: String(child.props.value ?? ''),
        label: String(child.props.children ?? ''),
        disabled: Boolean(child.props.disabled),
      });
    } else if (child?.type === 'optgroup') {
      const groupChildren = Array.isArray(child.props.children)
        ? child.props.children
        : [child.props.children];
      groupChildren.forEach(push);
    }
  };
  push(children);
  return opts;
}

export function Select({
  label,
  className = '',
  children,
  options,
  size = 'md',
  value,
  onChange,
  disabled,
  required,
  id,
  name,
  ...rest
}: SelectProps) {
  const resolvedOptions = options ?? parseOptions(children);
  const [open, setOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const currentValue = value != null ? String(value) : '';
  const selectedIndex = resolvedOptions.findIndex(
    (o) => o.value === currentValue && !o.disabled,
  );

  const heightClass = size === 'sm' ? 'h-8 text-xs' : 'h-9 text-sm';

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  useEffect(() => {
    if (open && selectedIndex >= 0) {
      setFocusedIndex(selectedIndex);
      requestAnimationFrame(() => {
        listRef.current?.querySelector(`[data-idx="${selectedIndex}"]`)?.scrollIntoView({ block: 'nearest' });
      });
    } else if (open) {
      setFocusedIndex(0);
    }
  }, [open, selectedIndex]);

  const selectOption = (opt: OptionDef) => {
    if (opt.disabled) return;
    const syntheticEvent = {
      target: { value: opt.value, name: name ?? '' },
      currentTarget: { value: opt.value, name: name ?? '' },
    } as React.ChangeEvent<HTMLSelectElement>;
    onChange?.(syntheticEvent);
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (!open) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }
    const firstEnabled = resolvedOptions.findIndex((o) => !o.disabled);
    const lastEnabled = resolvedOptions.map((o, i) => (o.disabled ? -1 : i)).filter((i) => i >= 0).pop() ?? firstEnabled;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex((prev) => {
        let next = prev + 1;
        while (next < resolvedOptions.length && resolvedOptions[next].disabled) next++;
        return next >= resolvedOptions.length ? lastEnabled : next;
      });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex((prev) => {
        let next = prev - 1;
        while (next >= 0 && resolvedOptions[next].disabled) next--;
        return next < 0 ? firstEnabled : next;
      });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (focusedIndex >= 0) selectOption(resolvedOptions[focusedIndex]);
    } else if (e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      if (focusedIndex >= 0) selectOption(resolvedOptions[focusedIndex]);
    }
  };

  const selectedLabel =
    selectedIndex >= 0 ? resolvedOptions[selectedIndex].label : '';

  const triggerClass = `${fieldBase} ${heightClass} cursor-pointer flex items-center justify-between gap-2 ${className}`;

  const trigger = (
    <div
      ref={wrapperRef}
      className="relative w-full"
    >
      <select
        {...rest}
        name={name}
        id={id}
        required={required}
        value={currentValue}
        onChange={onChange}
        disabled={disabled}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
      >
        {resolvedOptions.map((o) => (
          <option key={o.value} value={o.value} disabled={o.disabled}>
            {o.label}
          </option>
        ))}
      </select>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={triggerClass}
      >
        <span className={selectedLabel ? 'text-slate-900 truncate' : 'text-slate-400'}>
          {selectedLabel || 'Seleccionar...'}
        </span>
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`h-4 w-4 text-slate-400 transition-transform duration-150 shrink-0 ${open ? 'rotate-180' : ''}`}
        >
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>

      {open && (
        <div
          ref={listRef}
          role="listbox"
          className="absolute z-40 top-[calc(100%+4px)] left-0 right-0 max-h-60 overflow-y-auto bg-white border border-slate-200 rounded-lg shadow-pop py-1 animate-fade-in"
        >
          {resolvedOptions.length === 0 ? (
            <div className="px-3 py-2 text-sm text-slate-400">Sin opciones</div>
          ) : (
            resolvedOptions.map((opt, idx) => {
              const isSelected = idx === selectedIndex;
              const isFocused = idx === focusedIndex;
              return (
                <div
                  key={opt.value}
                  data-idx={idx}
                  role="option"
                  aria-selected={isSelected}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    selectOption(opt);
                  }}
                  onMouseEnter={() => setFocusedIndex(idx)}
                  className={`flex items-center justify-between gap-2 px-3 h-9 text-sm cursor-pointer transition-colors ${
                    opt.disabled
                      ? 'text-slate-300 cursor-not-allowed'
                      : isFocused
                        ? 'bg-brand-50 text-brand-700'
                        : isSelected
                          ? 'text-brand-700'
                          : 'text-slate-700'
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {!opt.disabled && isSelected && (
                    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-brand-600 shrink-0">
                      <path fillRule="evenodd" d="M16.7 5.3a1 1 0 010 1.4l-8 8a1 1 0 01-1.4 0l-4-4a1 1 0 011.4-1.4L8 12.6l7.3-7.3a1 1 0 011.4 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );

  if (label) return <Field label={label}>{trigger}</Field>;
  return trigger;
}
