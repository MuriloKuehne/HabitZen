import { format, startOfDay, endOfDay, isSameDay, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

export function formatDate(date: Date | string, formatStr = "dd/MM/yyyy"): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, formatStr, { locale: ptBR });
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

