// Agency marketing offerings shown on landing + /services.
// These are STATIC (config file), separate from backend LMS `Service`.
export interface AgencyService {
  id: string;
  slug: string;
  title: string;
  shortDesc: string;
  fullDesc?: string;
  image?: string;
  icon: string; // lucide icon name
  fallbackGradient: string;
  isFlagship?: boolean;
  isTraining?: boolean; // only the Training service drills into LMS
  features?: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  quote: string;
  image?: string;
}
