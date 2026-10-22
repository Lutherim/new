/**
 * SkillFinder data service, backed by Supabase (real accounts, real database).
 * Same public methods as the old localStorage prototype, so the screens did not need to change.
 * Security lives in the database (see supabase/schema.sql): this file never trusts itself.
 */
import { supabase } from './supabaseClient';
import { User, Artisan, BookingRequest, Review, Message, UserRole } from '../types';

type Row = Record<string, any>;

const AVATAR = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80';
const COVER = 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=800&auto=format&fit=crop&q=80';

// Turns a database error into a short, safe message (no internals leaked)
const fail = (error: { code?: string; message: string } | null, friendly?: string) => {
  if (!error) return;
  if (error.code === '42501') throw new Error(friendly ?? 'You are not allowed to do that.');
  if (error.code === '23505') throw new Error('That has already been recorded.');
  throw new Error(friendly ?? error.message);
};

const mapUser = (p: Row, email: string): User => ({
  id: p.id, name: p.name, email, role: p.role as UserRole, avatar: p.avatar_url || AVATAR,
  location: p.location, phone: p.phone ?? undefined, trade: p.trade ?? undefined, createdAt: p.created_at,
});

const mapArtisan = (r: Row): Artisan => ({
  id: r.id, name: r.profiles?.name ?? '', title: r.title, trade: r.profiles?.trade ?? 'General Trade',
  location: r.profiles?.location ?? '', avatar: r.profiles?.avatar_url || AVATAR, coverImage: r.cover_image || COVER,
  bio: r.bio, rating: Number(r.rating), reviewCount: r.review_count, startingPrice: Number(r.starting_price),
  hourlyRate: Number(r.hourly_rate), currency: 'R', yearsOfExperience: r.years_experience, verified: r.verified,
  online: false, badges: r.badges ?? [], contactEmail: r.contact_email ?? '', contactPhone: r.profiles?.phone ?? '',
  specialties: r.specialties ?? [],
  portfolio: (r.portfolio_works ?? []).map((w: Row) => ({
    id: w.id, title: w.title, category: w.category, description: w.description, imageUrl: w.image_url ?? COVER,
    completedDate: w.completed_date ?? '', duration: w.duration ?? '', clientFeedback: w.client_feedback ?? undefined,
  })),
  educationExperience: (r.credentials ?? []).map((c: Row) => ({
    id: c.id, type: c.type, title: c.title, institutionOrCompany: c.institution_or_company, year: c.year ?? '', description: c.description,
  })),
});

const mapBooking = (b: Row): BookingRequest => ({
  id: b.id, customerId: b.customer_id, customerName: b.customer_name, customerEmail: b.customer_email,
  customerPhone: b.customer_phone, customerLocation: b.customer_location ?? undefined, artisanId: b.artisan_id,
  artisanName: b.artisan_name, trade: b.trade, serviceType: b.service_type, preferredDate: b.preferred_date,
  description: b.description, estimatedPrice: Number(b.estimated_price), status: b.status, createdAt: b.created_at,
});

const mapReview = (r: Row): Review => ({
  id: r.id, artisanId: r.artisan_id, customerId: r.customer_id, customerName: r.customer_name,
  customerAvatar: r.customer_avatar || AVATAR, rating: r.rating, projectType: r.project_type, comment: r.comment,
  date: new Date(r.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
  verifiedPurchase: r.verified_purchase, helpfulCount: r.helpful_count,
});

const mapMessage = (m: Row): Message => ({
  id: m.id, conversationId: m.conversation_id, senderId: m.sender_id, senderName: m.sender_name,
  senderRole: m.sender_role as UserRole, recipientId: m.recipient_id, text: m.text, read: m.read,
  timestamp: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
});

const ARTISAN_SELECT = '*, profiles(name, avatar_url, location, phone, trade), portfolio_works(*), credentials(*)';

export class SkillFinderService {
  private static instance: SkillFinderService;
  public static getInstance(): SkillFinderService {
    return (SkillFinderService.instance ??= new SkillFinderService());
  }

  // --- Auth: one real sign-in path (email + password) and one-way registration ---
  public async getCurrentUser(): Promise<User | null> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;
    const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle();
    return data ? mapUser(data, session.user.email ?? '') : null;
  }

  public async login(email: string, password: string): Promise<User> {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error('Incorrect email or password.'); // same message for every failure
    const user = await this.getCurrentUser();
    if (!user) throw new Error('Could not load your profile. Please try again.');
    return user;
  }

  // Returns null when Supabase requires the email to be confirmed first
  public async registerOneWay(user: Omit<User, 'id' | 'createdAt'> & { password: string }): Promise<User | null> {
    const { data, error } = await supabase.auth.signUp({
      email: user.email, password: user.password,
      options: { data: { name: user.name, role: user.role, location: user.location, phone: user.phone, trade: user.trade, avatar_url: user.avatar } },
    });
    if (error) throw new Error(error.message);
    return data.session ? this.getCurrentUser() : null;
  }

  public async logout(): Promise<void> {
    await supabase.auth.signOut();
  }

  // --- Artisans (public) ---
  public async getArtisans(tradeFilter = 'all', locationFilter = 'All Locations', query = ''): Promise<Artisan[]> {
    const { data, error } = await supabase.from('artisan_profiles').select(ARTISAN_SELECT)
      .order('rating', { ascending: false }).order('review_count', { ascending: false });
    fail(error);
    const q = query.trim().toLowerCase();
    const t = tradeFilter.toLowerCase();
    return (data ?? []).map(mapArtisan).filter((a) =>
      (tradeFilter === 'all' || a.trade.toLowerCase().includes(t) || a.specialties.some((s) => s.toLowerCase().includes(t))) &&
      (locationFilter === 'All Locations' || a.location.toLowerCase() === locationFilter.toLowerCase()) &&
      (!q || [a.name, a.trade, a.bio, a.location, ...a.specialties].some((x) => x.toLowerCase().includes(q))));
  }

  public async getArtisanById(id: string): Promise<Artisan | null> {
    const { data, error } = await supabase.from('artisan_profiles').select(ARTISAN_SELECT).eq('id', id).maybeSingle();
    fail(error);
    return data ? mapArtisan(data) : null;
  }

  // --- Bookings (the database only returns rows the signed-in user is part of) ---
  public async getCustomerBookings(customerId: string): Promise<BookingRequest[]> {
    const { data, error } = await supabase.from('bookings').select('*').eq('customer_id', customerId).order('created_at', { ascending: false });
    fail(error);
    return (data ?? []).map(mapBooking);
  }

  public async getArtisanBookings(artisanId: string): Promise<BookingRequest[]> {
    const { data, error } = await supabase.from('bookings').select('*').eq('artisan_id', artisanId).order('created_at', { ascending: false });
    fail(error);
    return (data ?? []).map(mapBooking);
  }

  // Privacy: artisans only ever see requests addressed to THEM, never other artisans' customers
  public async getLocationBookings(location: string): Promise<BookingRequest[]> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return [];
    const loc = location.toLowerCase().trim();
    return (await this.getArtisanBookings(session.user.id)).filter((b) => (b.customerLocation ?? '').toLowerCase().trim() === loc);
  }

  public async getCustomersInLocation(location: string) {
    const map = new Map<string, { name: string; email: string; phone: string; location: string; requestCount: number; recentTrade: string }>();
    for (const b of await this.getLocationBookings(location)) {
      const c = map.get(b.customerEmail);
      if (c) c.requestCount += 1;
      else map.set(b.customerEmail, { name: b.customerName, email: b.customerEmail, phone: b.customerPhone, location: b.customerLocation || location, requestCount: 1, recentTrade: b.trade });
    }
    return Array.from(map.values());
  }

  // Only the fields the customer may choose are sent. Identity fields are filled in by the database.
  public async createBooking(b: Omit<BookingRequest, 'id' | 'createdAt' | 'status'>): Promise<BookingRequest> {
    const { data, error } = await supabase.from('bookings').insert({
      artisan_id: b.artisanId, service_type: b.serviceType, preferred_date: b.preferredDate, description: b.description,
      estimated_price: b.estimatedPrice, customer_phone: b.customerPhone,
    }).select().single();
    fail(error, 'Only signed-in customers can request a quote.');
    return mapBooking(data as Row);
  }

  public async updateBookingStatus(bookingId: string, status: BookingRequest['status']): Promise<void> {
    const { data, error } = await supabase.from('bookings').update({ status }).eq('id', bookingId).select('id');
    fail(error);
    if (!data?.length) throw new Error('You can only update requests sent to you.');
  }

  // --- Reviews: the database only accepts them from customers with an accepted booking ---
  public async getArtisanReviews(artisanId: string): Promise<Review[]> {
    const { data, error } = await supabase.from('reviews').select('*').eq('artisan_id', artisanId).order('created_at', { ascending: false });
    fail(error);
    return (data ?? []).map(mapReview);
  }

  public async addReview(r: Omit<Review, 'id' | 'date' | 'helpfulCount'>): Promise<Review> {
    const { data, error } = await supabase.from('reviews')
      .insert({ artisan_id: r.artisanId, rating: r.rating, project_type: r.projectType, comment: r.comment }).select().single();
    if (error?.code === '23505') throw new Error('You have already reviewed this artisan.');
    fail(error, 'You can review an artisan after they accept one of your bookings.');
    return mapReview(data as Row);
  }

  // --- Messages: only the two people in a conversation can read it ---
  public async getConversation(conversationId: string): Promise<Message[]> {
    const { data, error } = await supabase.from('messages').select('*').eq('conversation_id', conversationId).order('created_at', { ascending: true });
    fail(error);
    return (data ?? []).map(mapMessage);
  }

  public async sendMessage(m: Omit<Message, 'id' | 'timestamp' | 'read'>): Promise<Message> {
    const { data, error } = await supabase.from('messages').insert({ recipient_id: m.recipientId, text: m.text }).select().single();
    fail(error, 'You cannot message this person yet.');
    return mapMessage(data as Row);
  }
}

export const skillFinderService = SkillFinderService.getInstance();
