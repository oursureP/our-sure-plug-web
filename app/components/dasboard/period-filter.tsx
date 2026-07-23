"use client";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function PeriodFilter({
  month,
  year,
  onChange,
}: {
  month: number;
  year: number;
  onChange: (month: number, year: number) => void;
}) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i); // last 5 years

  const selectClass =
    "rounded-lg border border-border bg-card px-3 py-2 text-[13px] font-medium text-foreground outline-none transition-colors focus:border-primary dark:bg-[#161427]";

  return (
    <div className="flex items-center gap-2">
      <select
        value={month}
        onChange={(e) => onChange(Number(e.target.value), year)}
        className={selectClass}>
        {MONTHS.map((m, i) => (
          <option key={m} value={i + 1}>
            {m}
          </option>
        ))}
      </select>
      <select
        value={year}
        onChange={(e) => onChange(month, Number(e.target.value))}
        className={selectClass}>
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>
  );
}
