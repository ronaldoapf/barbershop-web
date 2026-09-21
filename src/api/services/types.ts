export const ServiceStatus = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
} as const

export type ServiceStatus = (typeof ServiceStatus)[keyof typeof ServiceStatus]

export interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  durationMinutes: number;
  status: ServiceStatus;
  order: number;
  pointsEarned: number;
  pointsRequired: number;
  createdAt: Date;
  disabledAt: Date | null;
  barbers: { id: string; name: string }[];
}

export type Services = Service[]

export interface ListServicesParams {
  page: number;
  limit: number;
  status?: ServiceStatus;
}

export interface CreateServiceDto {
  name: string;
  description?: string;
  price: number;
  durationMinutes: number;
  order: number;
  pointsEarned?: number;
  pointsRequired?: number;
  barberIds?: string[];
}