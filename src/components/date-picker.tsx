import { format, isValid, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Popover, PopoverAnchor, PopoverContent } from './ui/popover';
import { Input } from './ui/input';
import { Calendar } from './ui/calendar';
import { useEffect, useRef, useState } from 'react';

const DATE_FORMAT = 'dd/MM/yyyy';

function maskDate(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  const d = digits.slice(0, 2);
  const m = digits.slice(2, 4);
  const y = digits.slice(4, 8);
  if (digits.length > 4) return `${d}/${m}/${y}`;
  if (digits.length > 2) return `${d}/${m}`;
  return d;
}

function parseDate(value: string): Date | undefined {
  if (value.length < 10) return undefined;
  const parsed = parse(value, DATE_FORMAT, new Date());
  return isValid(parsed) ? parsed : undefined;
}

interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  invalid?: boolean;
}

export function DatePicker({
  value,
  onChange,
  placeholder = 'dd/mm/aaaa',
  disabled,
  className,
  invalid,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(
    value ? format(value, DATE_FORMAT) : '',
  );
  const [month, setMonth] = useState<Date>(value ?? new Date());
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Keep input in sync when external value changes
  useEffect(() => {
    setInputValue(value ? format(value, DATE_FORMAT) : '');
  }, [value]);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const masked = maskDate(e.target.value);
    setInputValue(masked);

    const parsed = parseDate(masked);
    if (parsed) {
      setMonth(parsed);
      onChange?.(parsed);
    } else if (masked === '') {
      onChange?.(undefined);
    }
  }

  function handleInputBlur() {
    // Reset to last valid value if the typed string is incomplete/invalid
    const parsed = parseDate(inputValue);
    if (!parsed) {
      setInputValue(value ? format(value, DATE_FORMAT) : '');
    }
  }

  function handleSelect(date: Date | undefined) {
    onChange?.(date);
    setInputValue(date ? format(date, DATE_FORMAT) : '');
    setOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') setOpen(false);
    if (e.key === 'Enter' && parseDate(inputValue)) setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <div ref={wrapperRef} className={cn('relative w-full', className)}>
          <Input
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onFocus={() => !disabled && setOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            inputMode="numeric"
            aria-invalid={invalid}
            className="pr-9"
          />
          <CalendarIcon className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
      </PopoverAnchor>

      <PopoverContent
        align="start"
        className="w-auto p-0"
        onOpenAutoFocus={(e) => e.preventDefault()}
        onInteractOutside={(e) => {
          if (wrapperRef.current?.contains(e.target as Node)) {
            e.preventDefault();
          }
        }}
      >
        <Calendar
          mode="single"
          locale={ptBR}
          month={month}
          selected={value}
          onSelect={handleSelect}
          onMonthChange={setMonth}
        />
      </PopoverContent>
    </Popover>
  );
}
