import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CheckIcon, ChevronDownIcon, SearchIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export type SelectOption = {
  label: string
  value: string
  icon?: ReactNode
  description?: string
}

const ITEM_HEIGHT = 36;
const ITEM_HEIGHT_WITH_DESC = 52;
const LIST_HEIGHT = 252;
const OVERSCAN = 3;

function getItemHeight(option: SelectOption) {
  return option.description ? ITEM_HEIGHT_WITH_DESC : ITEM_HEIGHT;
}

export type VirtualSelectProps = {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  className?: string;
};

export function VirtualSelect({
  options,
  value,
  onChange,
  placeholder,
  disabled,
  invalid,
  className,
}: VirtualSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [scrollTop, setScrollTop] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options;
    const lower = search.toLowerCase();
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(lower) ||
        opt.description?.toLowerCase().includes(lower),
    );
  }, [options, search]);

  // Cumulative offsets para virtualização com alturas variáveis
  const offsets = useMemo(() => {
    const result: number[] = [];
    let top = 0;
    for (const opt of filteredOptions) {
      result.push(top);
      top += getItemHeight(opt);
    }
    result.push(top); // sentinel = totalHeight
    return result;
  }, [filteredOptions]);

  const totalHeight = offsets[offsets.length - 1] ?? 0;
  const listHeight = Math.min(LIST_HEIGHT, totalHeight);

  const startIndex = useMemo(() => {
    const threshold = Math.max(0, scrollTop - OVERSCAN * ITEM_HEIGHT_WITH_DESC);
    let i = 0;
    while (i < offsets.length - 1 && offsets[i + 1] <= threshold) i++;
    return i;
  }, [offsets, scrollTop]);

  const endIndex = useMemo(() => {
    const threshold = scrollTop + LIST_HEIGHT + OVERSCAN * ITEM_HEIGHT_WITH_DESC;
    let i = startIndex;
    while (i < filteredOptions.length - 1 && offsets[i] < threshold) i++;
    return i;
  }, [offsets, startIndex, scrollTop, filteredOptions.length]);

  const virtualItems = filteredOptions.slice(startIndex, endIndex + 1);

  const selectedOption = options.find((opt) => opt.value === value);

  const handleOpen = useCallback(() => {
    if (disabled) return;
    setOpen((prev) => !prev);
  }, [disabled]);

  const handleSelect = useCallback(
    (val: string) => {
      onChange?.(val);
      setOpen(false);
      setSearch("");
    },
    [onChange],
  );

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 0);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={handleOpen}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-invalid={invalid}
        className={cn(
          "flex h-8 w-full items-center justify-between gap-1.5 rounded-lg border border-input bg-transparent py-2 pr-2 pl-2.5 text-sm whitespace-nowrap outline-none select-none transition-colors",
          "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
        )}
      >
        <span className={cn("flex min-w-0 items-center gap-1.5", !value && "text-muted-foreground")}>
          {selectedOption?.icon && (
            <span className="shrink-0 [&>svg]:size-4">{selectedOption.icon}</span>
          )}
          <span className="truncate">{selectedOption?.label ?? placeholder}</span>
        </span>
        <ChevronDownIcon
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform duration-150",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10">
          <div className="flex items-center gap-2 border-b border-input px-2 py-1.5">
            <SearchIcon className="size-3.5 shrink-0 text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setScrollTop(0);
                if (listRef.current) listRef.current.scrollTop = 0;
              }}
              placeholder="Buscar..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>

          {filteredOptions.length === 0 ? (
            <div className="py-4 text-center text-sm text-muted-foreground">
              Nenhum resultado encontrado
            </div>
          ) : (
            <div
              ref={listRef}
              role="listbox"
              style={{ height: listHeight, overflowY: "auto" }}
              onScroll={handleScroll}
            >
              <div style={{ height: totalHeight, position: "relative" }}>
                {virtualItems.map((option, i) => {
                  const absoluteIndex = startIndex + i;
                  const isSelected = option.value === value;
                  return (
                    <div
                      key={option.value}
                      role="option"
                      aria-selected={isSelected}
                      style={{
                        position: "absolute",
                        top: offsets[absoluteIndex],
                        left: 0,
                        right: 0,
                        height: getItemHeight(option),
                      }}
                      className={cn(
                        "flex cursor-pointer select-none items-center justify-between gap-2 px-3 text-sm",
                        "hover:bg-accent hover:text-accent-foreground",
                        isSelected && "bg-accent/50 font-medium",
                      )}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSelect(option.value);
                      }}
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        {option.icon && (
                          <span className="shrink-0 text-muted-foreground [&>svg]:size-4">
                            {option.icon}
                          </span>
                        )}
                        <div className="min-w-0">
                          <p className="truncate">{option.label}</p>
                          {option.description && (
                            <p className="truncate text-xs font-normal text-muted-foreground">
                              {option.description}
                            </p>
                          )}
                        </div>
                      </div>
                      {isSelected && (
                        <CheckIcon className="size-4 shrink-0 text-primary" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
