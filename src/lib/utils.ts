import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function parseTimeString(time: string): { hours: number; minutes: number } | null {
  // Handle "6:00 PM" / "6:00 AM" format
  const match12 = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (match12) {
    let hours = parseInt(match12[1], 10);
    const minutes = parseInt(match12[2], 10);
    const meridiem = match12[3].toUpperCase();
    if (meridiem === 'PM' && hours !== 12) hours += 12;
    if (meridiem === 'AM' && hours === 12) hours = 0;
    return { hours, minutes };
  }
  // Handle "18:00" format
  const match24 = time.match(/^(\d{1,2}):(\d{2})$/);
  if (match24) {
    return { hours: parseInt(match24[1], 10), minutes: parseInt(match24[2], 10) };
  }
  return null;
}

export function isCurrentlyLive(date?: string, time?: string): boolean {
  if (!date || !time) return false;
  const now = new Date();
  const [year, month, day] = date.split('-').map(Number);
  if (now.getFullYear() !== year || (now.getMonth() + 1) !== month || now.getDate() !== day) {
    return false;
  }
  const parsed = parseTimeString(time);
  if (!parsed) return false;
  const startMs = new Date(year, month - 1, day, parsed.hours, parsed.minutes).getTime();
  const endMs = startMs + 4 * 60 * 60 * 1000;
  const nowMs = now.getTime();
  return nowMs >= startMs && nowMs <= endMs;
}
