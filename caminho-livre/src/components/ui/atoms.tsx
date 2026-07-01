"use client";

import type { ChangeEvent, InputHTMLAttributes, ReactNode } from "react";

export function Label({ children }: { children: ReactNode }) {
  return <span className="mb-1.5 block text-sm font-semibold text-muted">{children}</span>;
}

export function TextField({
  value,
  onChange,
  ...rest
}: {
  value: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
} & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      value={value}
      onChange={onChange}
      className="w-full box-border rounded-xl border border-[rgba(var(--border-rgb),0.12)] bg-card px-3.5 py-3 text-[16px] text-text outline-none"
      {...rest}
    />
  );
}

export function PrimaryButton({ onClick, children, className = "" }: { onClick: () => void; children: ReactNode; className?: string }) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-xl bg-accent px-4 py-3.5 text-center text-[16.5px] font-bold text-[#0D1311] shadow-[0_0_26px_rgba(var(--accent-rgb),0.3)] ${className}`}
    >
      {children}
    </div>
  );
}

export function GhostButton({ onClick, children, className = "" }: { onClick: () => void; children: ReactNode; className?: string }) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-xl border border-[rgba(var(--border-rgb),0.18)] px-3.5 py-[13px] text-center text-base font-semibold text-text ${className}`}
    >
      {children}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-[rgba(var(--border-rgb),0.08)] bg-card p-4 ${className}`}>{children}</div>
  );
}

export function ErrorText({ children }: { children: ReactNode }) {
  return <div className="mb-2 text-sm text-orange">{children}</div>;
}

export function BackChevron({ onClick }: { onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="flex h-[34px] w-[34px] shrink-0 cursor-pointer items-center justify-center rounded-[10px] border border-[rgba(var(--border-rgb),0.12)] bg-card"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M15 5l-7 7 7 7" stroke="var(--text)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M9 5l7 7-7 7" stroke="var(--accent)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
