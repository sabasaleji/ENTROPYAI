import { LucideIcon } from 'lucide-react';

export interface ServiceSubPoint {
  title: string;
  description?: string;
}

export interface Service {
  id: string;
  title: string;
  icon: LucideIcon;
  description: string;
  details: ServiceSubPoint[];
}

export interface DemoResponse {
  analysis: string;
  recommendation: string;
}
