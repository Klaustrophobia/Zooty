export type UserRole = 'owner' | 'professional';

export interface Service {
  id: number;
  name: string;
  duration: string;
  price: string;
}

export interface DaySchedule {
  enabled: boolean;
  from: string;
  to: string;
}

export type WeekSchedule = Record<string, DaySchedule>;
