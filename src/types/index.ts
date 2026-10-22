/**
 * Data models and types for SkillFinder
 */

export type UserRole = 'customer' | 'artisan';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  location: string;
  phone?: string;
  trade?: string; // If artisan
  createdAt: string;
}

export interface PortfolioWork {
  id: string;
  title: string;
  category: 'past' | 'new'; // Past Work vs New Work
  description: string;
  imageUrl: string;
  completedDate: string;
  duration: string;
  clientFeedback?: string;
}

export interface EducationExperience {
  id: string;
  type: 'education' | 'experience' | 'certification';
  title: string;
  institutionOrCompany: string;
  year: string;
  description: string;
}

export interface Review {
  id: string;
  artisanId: string;
  customerId: string;
  customerName: string;
  customerAvatar: string;
  rating: number; // 1 to 5
  date: string;
  projectType: string;
  comment: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
}

export interface Artisan {
  id: string;
  name: string;
  title: string;
  trade: string;
  location: string;
  avatar: string;
  coverImage: string;
  bio: string;
  rating: number;
  reviewCount: number;
  startingPrice: number; // e.g. R350
  hourlyRate: number;    // e.g. R450/hr
  currency: string;      // "R" or "ZAR"
  yearsOfExperience: number;
  verified: boolean;
  online: boolean;
  badges: string[];
  contactEmail: string;
  contactPhone: string;
  specialties: string[];
  portfolio: PortfolioWork[];
  educationExperience: EducationExperience[];
}

export interface BookingRequest {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerLocation?: string; // Location of the customer (e.g. "Johannesburg", "Cape Town")
  artisanId: string;
  artisanName: string;
  trade: string;
  serviceType: string;
  preferredDate: string;
  description: string;
  estimatedPrice: number;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  recipientId: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface TradeCategory {
  id: string;
  name: string;
  iconName: string;
  artisanCount: number;
  popularServices: string[];
}
