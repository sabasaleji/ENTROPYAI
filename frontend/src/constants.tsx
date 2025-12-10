import { Service } from './types';
import { Bot, BarChart3, TrendingUp, Network } from 'lucide-react';

export const SERVICES: Service[] = [
  {
    id: 'chatbots',
    title: 'Custom Chatbots',
    icon: Bot,
    description: 'Intelligent conversational agents designed to handle complex interactions with human-like understanding.',
    details: [
      { title: 'Make custom chatbots' },
      { title: '24/7 Automated Support' },
      { title: 'Multi-platform Integration' },
    ]
  },
  {
    id: 'data-analytics',
    title: 'Data Analytics',
    icon: BarChart3,
    description: 'Transform raw data into actionable intelligence with advanced visualization and processing.',
    details: [
      { title: 'Data analytics' },
      { title: 'Real-time Dashboarding' },
      { title: 'Operational Efficiency Audits' },
    ]
  },
  {
    id: 'predictive',
    title: 'Predictive Analytics & ML',
    icon: TrendingUp,
    description: 'Stop reacting, start anticipating. Use historical data to forecast future market dynamics.',
    details: [
      { title: 'Forecast future trends and market dynamics' },
      { title: 'Build intelligent recommendation engines' },
      { title: 'Predict customer behaviour and preferences' },
      { title: 'Optimize sales forecasting and revenue projections' },
    ]
  },
  {
    id: 'consulting',
    title: 'AI Integration & Consulting',
    icon: Network,
    description: 'A holistic approach to adopting AI. We bridge the gap between technology and infrastructure.',
    details: [
      { title: 'AI strategy consulting' },
      { title: 'Integration with existing systems (CRM, ERP)' },
      { title: 'Custom AI model development and training' },
    ]
  }
];

export const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Services', path: '/services' },
  { label: 'Products', path: '/products' },
  { label: 'Blogs', path: '/blogs' },
  { label: 'Contact Us', path: '/contact' },
];