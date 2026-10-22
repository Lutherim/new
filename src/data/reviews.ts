import { Review } from '../types';

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    artisanId: 'artisan-thabo',
    customerId: 'cust-1',
    customerName: 'Sarah Jenkins',
    customerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    rating: 5,
    date: '12 Oct 2026',
    projectType: 'Bespoke Solid Oak Kitchen Island',
    comment: 'Thabo is a true master artisan. He spent time discussing grain direction, soft-closing European hinges, and delivered three days ahead of schedule. Flawless dovetail joints!',
    verifiedPurchase: true,
    helpfulCount: 14
  },
  {
    id: 'rev-2',
    artisanId: 'artisan-thabo',
    customerId: 'cust-2',
    customerName: 'David Van Der Merwe',
    customerAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
    rating: 5,
    date: '28 Sep 2026',
    projectType: 'Custom Floor-to-Ceiling Library Shelving',
    comment: 'Outstanding craftsmanship and attention to detail. Every mitre joint lined up perfectly with our uneven period walls. Cleaned up every afternoon before leaving.',
    verifiedPurchase: true,
    helpfulCount: 9
  },
  {
    id: 'rev-3',
    artisanId: 'artisan-sipho',
    customerId: 'cust-3',
    customerName: 'Brenda Ndlovu',
    customerAvatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=120&auto=format&fit=crop&q=80',
    rating: 5,
    date: '04 Oct 2026',
    projectType: 'High-Pressure Geyser & Copper Piping Overhaul',
    comment: 'Sipho resolved a persistent water hammer and replaced our cracked solar geyser manifold in under 4 hours. Clear quote with zero hidden charges. Highly recommended!',
    verifiedPurchase: true,
    helpfulCount: 21
  },
  {
    id: 'rev-4',
    artisanId: 'artisan-elena',
    customerId: 'cust-4',
    customerName: 'Marcus Thorne',
    customerAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
    rating: 5,
    date: '15 Oct 2026',
    projectType: 'Hybrid Inverter & DB Board Certificate of Compliance',
    comment: 'Elena provided the most thorough electrical assessment we have ever seen. Labelled all breakers, optimized load shedding channels, and issued COC on the spot.',
    verifiedPurchase: true,
    helpfulCount: 18
  },
  {
    id: 'rev-5',
    artisanId: 'artisan-lerato',
    customerId: 'cust-5',
    customerName: 'Fatima Patel',
    customerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    rating: 5,
    date: '18 Sep 2026',
    projectType: 'Large Format Porcelain Floor Tiling (120m²)',
    comment: 'Lerato has laser-level precision. Completely level flooring across three connected living spaces. Her grout sealing advice saved us months of maintenance.',
    verifiedPurchase: true,
    helpfulCount: 11
  },
  {
    id: 'rev-6',
    artisanId: 'artisan-kabelo',
    customerId: 'cust-6',
    customerName: 'Pieter Du Plessis',
    customerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
    rating: 4,
    date: '02 Oct 2026',
    projectType: 'Historic Face-Brick Tuck-Pointing & Structural Arch',
    comment: 'Kabelo restored our 1940s garden retaining wall with matching lime mortar. Very dependable, skilled masonry team.',
    verifiedPurchase: true,
    helpfulCount: 7
  }
];
