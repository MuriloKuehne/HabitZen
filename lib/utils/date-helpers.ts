import { format, startOfDay, endOfDay, isSameDay, parseISO, startOfWeek, endOfWeek } from "date-fns";

export function formatDate(date: Date | string, formatStr = "MM/dd/yyyy"): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, formatStr);
}

export function getStartOfDay(date: Date | string): Date {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return startOfDay(dateObj);
}

export function getEndOfDay(date: Date | string): Date {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return endOfDay(dateObj);
}

export function isSameDate(date1: Date | string, date2: Date | string): boolean {
  const date1Obj = typeof date1 === "string" ? parseISO(date1) : date1;
  const date2Obj = typeof date2 === "string" ? parseISO(date2) : date2;
  return isSameDay(date1Obj, date2Obj);
}

export function getToday(): Date {
  return new Date();
}

export function getTodayString(): string {
  return formatDate(getToday());
}

export function getWeekStart(date: Date | string): Date {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return startOfDay(startOfWeek(dateObj, { weekStartsOn: 0 }));
}

export function getWeekEnd(date: Date | string): Date {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return endOfDay(endOfWeek(dateObj, { weekStartsOn: 0 }));
}

export function getWeekRange(date: Date | string): { start: Date; end: Date } {
  return {
    start: getWeekStart(date),
    end: getWeekEnd(date),
  };
}

