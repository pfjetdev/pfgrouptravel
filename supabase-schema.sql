-- SQL скрипт для создания таблиц в Supabase
-- Выполните этот скрипт в SQL Editor в Supabase Dashboard

-- Таблица для заявок на бронирование рейсов
CREATE TABLE IF NOT EXISTS booking_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Flight info
  trip_type TEXT NOT NULL CHECK (trip_type IN ('roundTrip', 'oneWay', 'multiCity')),
  from_airport TEXT NOT NULL,
  to_airport TEXT NOT NULL,
  departure_date DATE NOT NULL,
  return_date DATE,
  passengers INTEGER NOT NULL CHECK (passengers >= 10),
  cabin_class TEXT NOT NULL CHECK (cabin_class IN ('economy', 'business', 'first')),

  -- Contact info
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,

  -- Status tracking
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'processing', 'completed', 'cancelled'))
);

-- Таблица для контактных заявок
CREATE TABLE IF NOT EXISTS contact_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  inquiry_type TEXT NOT NULL,
  group_size TEXT,
  message TEXT NOT NULL,

  -- Status tracking
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'replied', 'closed'))
);

-- Таблица для мультигородских заявок
CREATE TABLE IF NOT EXISTS multi_city_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Flights stored as JSONB array
  flights JSONB NOT NULL,
  passengers INTEGER NOT NULL CHECK (passengers >= 10),
  cabin_class TEXT NOT NULL CHECK (cabin_class IN ('economy', 'business', 'first')),

  -- Contact info
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,

  -- Status tracking
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'processing', 'completed', 'cancelled'))
);

-- Включаем Row Level Security (RLS)
ALTER TABLE booking_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE multi_city_requests ENABLE ROW LEVEL SECURITY;

-- Политики для вставки данных (анонимные пользователи могут отправлять заявки)
CREATE POLICY "Anyone can insert booking requests" ON booking_requests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can insert contact requests" ON contact_requests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can insert multi city requests" ON multi_city_requests
  FOR INSERT WITH CHECK (true);

-- Политики для чтения (только авторизованные пользователи)
-- Закомментируйте или измените, если нужно другое поведение
CREATE POLICY "Authenticated users can read booking requests" ON booking_requests
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read contact requests" ON contact_requests
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read multi city requests" ON multi_city_requests
  FOR SELECT USING (auth.role() = 'authenticated');

-- Таблица для заявок на дополнительные услуги (отели и трансферы)
CREATE TABLE IF NOT EXISTS service_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  service_type TEXT NOT NULL CHECK (service_type IN ('hotel', 'transfer')),

  -- Hotel specific fields
  destination TEXT,
  check_in_date DATE,
  check_out_date DATE,
  guests INTEGER,

  -- Transfer specific fields
  pickup_location TEXT,
  dropoff_location TEXT,
  transfer_date DATE,
  passengers INTEGER,

  -- Contact info
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,

  -- Status tracking
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'processing', 'completed', 'cancelled'))
);

ALTER TABLE service_requests DISABLE ROW LEVEL SECURITY;

-- Индексы для быстрого поиска
CREATE INDEX idx_booking_requests_status ON booking_requests(status);
CREATE INDEX idx_booking_requests_created_at ON booking_requests(created_at DESC);
CREATE INDEX idx_contact_requests_status ON contact_requests(status);
CREATE INDEX idx_contact_requests_created_at ON contact_requests(created_at DESC);
CREATE INDEX idx_multi_city_requests_status ON multi_city_requests(status);
CREATE INDEX idx_multi_city_requests_created_at ON multi_city_requests(created_at DESC);
CREATE INDEX idx_service_requests_status ON service_requests(status);
CREATE INDEX idx_service_requests_created_at ON service_requests(created_at DESC);
CREATE INDEX idx_service_requests_type ON service_requests(service_type);

-- Таблица для популярных направлений
CREATE TABLE IF NOT EXISTS destinations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  city TEXT NOT NULL,
  country TEXT NOT NULL,
  image_url TEXT NOT NULL,
  price TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

-- RLS отключен для публичного чтения
ALTER TABLE destinations DISABLE ROW LEVEL SECURITY;

-- Индекс для сортировки
CREATE INDEX idx_destinations_sort_order ON destinations(sort_order);
CREATE INDEX idx_destinations_active ON destinations(is_active);

-- Начальные данные
INSERT INTO destinations (city, country, image_url, price, sort_order) VALUES
  ('New York', 'USA', 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&h=400&fit=crop', 'from $299', 1),
  ('London', 'United Kingdom', 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&h=400&fit=crop', 'from $349', 2),
  ('Paris', 'France', 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&h=400&fit=crop', 'from $329', 3),
  ('Dubai', 'UAE', 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&h=400&fit=crop', 'from $399', 4),
  ('Tokyo', 'Japan', 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&h=400&fit=crop', 'from $549', 5),
  ('Barcelona', 'Spain', 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600&h=400&fit=crop', 'from $289', 6),
  ('Rome', 'Italy', 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&h=400&fit=crop', 'from $319', 7),
  ('Singapore', 'Singapore', 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&h=400&fit=crop', 'from $499', 8);

-- Таблица для новостей и статей
CREATE TABLE IF NOT EXISTS news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL,
  read_time TEXT NOT NULL,

  -- Author info
  author_name TEXT NOT NULL,
  author_role TEXT NOT NULL,
  author_avatar TEXT,

  -- Publishing
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0
);

-- RLS отключен для публичного чтения
ALTER TABLE news DISABLE ROW LEVEL SECURITY;

-- Индексы для новостей
CREATE INDEX idx_news_published_at ON news(published_at DESC);
CREATE INDEX idx_news_category ON news(category);
CREATE INDEX idx_news_active ON news(is_active);
CREATE INDEX idx_news_featured ON news(is_featured);
CREATE INDEX idx_news_slug ON news(slug);

-- Начальные данные для новостей
INSERT INTO news (title, slug, excerpt, content, image_url, category, read_time, author_name, author_role, author_avatar, is_featured, sort_order) VALUES
(
  'The Complete Guide to Planning Group Travel in 2025',
  'complete-guide-group-travel-2025',
  'Everything you need to know about organizing successful group trips, from corporate retreats to family reunions. Learn insider tips from our travel experts.',
  '<p>Planning group travel can be both exciting and challenging. Whether you''re organizing a corporate retreat, a family reunion, or a destination wedding, the key to success lies in careful preparation and strategic booking.</p>

<h2>Understanding Group Travel Dynamics</h2>
<p>When traveling with a group, coordination becomes essential. Each member has different preferences, schedules, and requirements. The first step is to establish clear communication channels and designate a point person for all travel-related decisions.</p>

<h2>Booking Strategies for Maximum Savings</h2>
<p>Group bookings often come with significant discounts, but timing is crucial. Airlines typically offer group rates for parties of 10 or more passengers. Here are some key strategies:</p>
<ul>
  <li><strong>Book Early:</strong> The earlier you book, the better rates you''ll secure. Aim for at least 6-8 months in advance for large groups.</li>
  <li><strong>Be Flexible:</strong> If your dates are flexible, you can often find better deals on off-peak travel days.</li>
  <li><strong>Consider Split Bookings:</strong> Sometimes booking smaller groups on different flights can be more cost-effective.</li>
  <li><strong>Work with Specialists:</strong> Group travel specialists like Priority Flyers have access to exclusive rates and can handle complex logistics.</li>
</ul>

<h2>Managing Different Traveler Needs</h2>
<p>Every group includes travelers with different needs. Some may require special meals, wheelchair assistance, or specific seating arrangements. Documenting these requirements early ensures nothing falls through the cracks.</p>

<h2>Coordinating Ground Transportation</h2>
<p>Don''t forget about what happens once you land. Coordinating airport transfers for a large group requires advance planning. Consider chartered buses or multiple vehicles depending on your group size and destination.</p>

<h2>Communication is Key</h2>
<p>Create a shared document or group chat where all travel details are accessible. Include flight times, meeting points, emergency contacts, and important deadlines. Regular updates keep everyone informed and reduce last-minute confusion.</p>

<h2>Final Thoughts</h2>
<p>Successful group travel comes down to preparation, communication, and working with experienced partners. With the right approach, you can create memorable experiences while staying within budget. Ready to start planning? Contact our team for personalized group travel solutions.</p>',
  'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1200&h=600&fit=crop',
  'Tips & Tricks',
  '8 min read',
  'Sarah Mitchell',
  'Travel Expert',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
  true,
  1
),
(
  'Top 10 Destinations for Corporate Retreats in 2025',
  'top-10-destinations-corporate-retreats-2025',
  'Discover the best locations for your next team building event, from tropical paradises to cultural capitals.',
  '<p>Corporate retreats have evolved from simple getaways to strategic investments in team building and company culture. The right destination can inspire creativity, strengthen bonds, and boost productivity.</p>

<h2>1. Bali, Indonesia</h2>
<p>With its stunning landscapes, affordable luxury resorts, and rich culture, Bali offers the perfect backdrop for corporate retreats. Many resorts offer dedicated team-building programs and meeting facilities.</p>

<h2>2. Barcelona, Spain</h2>
<p>A vibrant city that combines business with pleasure. World-class conference venues, incredible cuisine, and rich architectural heritage make it ideal for international teams.</p>

<h2>3. Costa Rica</h2>
<p>For adventure-focused retreats, Costa Rica delivers with zip-lining, surfing, and eco-tours. It''s also increasingly popular for sustainability-minded companies.</p>

<h2>4. Lisbon, Portugal</h2>
<p>Europe''s rising star offers excellent value, beautiful weather, and a thriving startup scene that inspires innovation.</p>

<h2>5. Cape Town, South Africa</h2>
<p>Dramatic scenery, world-class wineries, and exceptional hospitality make Cape Town unforgettable for corporate groups.</p>

<h2>6. Tokyo, Japan</h2>
<p>Perfect for companies seeking inspiration from efficiency and innovation. Traditional ryokans offer unique team bonding experiences.</p>

<h2>7. Iceland</h2>
<p>For truly unique retreats, Iceland''s otherworldly landscapes provide an unforgettable setting for team building.</p>

<h2>8. Dubai, UAE</h2>
<p>Luxury meets efficiency in Dubai, with state-of-the-art conference facilities and incredible entertainment options.</p>

<h2>9. Mexico City, Mexico</h2>
<p>Rich culture, amazing food, and increasingly sophisticated business infrastructure at great value.</p>

<h2>10. New Zealand</h2>
<p>Adventure activities combined with stunning natural beauty create memorable experiences for teams.</p>

<h2>Planning Your Retreat</h2>
<p>When choosing a destination, consider your team''s interests, budget, travel logistics, and the activities that will best serve your goals. Contact Priority Flyers for customized group packages to any of these destinations.</p>',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
  'Corporate Travel',
  '5 min read',
  'Michael Chen',
  'Corporate Travel Specialist',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
  false,
  2
),
(
  'How to Save Up to 40% on Group Flight Bookings',
  'save-40-percent-group-flight-bookings',
  'Expert tips and strategies to maximize your savings when booking flights for large groups.',
  '<p>Group travel doesn''t have to break the bank. With the right strategies and timing, you can save significantly on airfare for groups of any size.</p>

<h2>Understanding Group Fares</h2>
<p>Airlines offer special group fares for parties typically starting at 10 passengers. These fares often include benefits like:</p>
<ul>
  <li>Reduced deposits</li>
  <li>Extended payment deadlines</li>
  <li>Name change flexibility</li>
  <li>Consolidated ticketing</li>
</ul>

<h2>Timing Your Booking</h2>
<p>The sweet spot for group bookings is typically 4-6 months before departure for domestic flights and 6-9 months for international travel. This gives you access to the best rates while maintaining flexibility.</p>

<h2>Leverage Multiple Airlines</h2>
<p>Don''t commit to one airline without exploring options. Different carriers may offer better rates depending on your route and dates. A group travel specialist can compare options across multiple airlines simultaneously.</p>

<h2>Consider Alternative Airports</h2>
<p>Flying into secondary airports can yield significant savings. For example, flying into Oakland instead of San Francisco, or Gatwick instead of Heathrow, can reduce costs by 20-30%.</p>

<h2>Negotiate Add-Ons</h2>
<p>Group bookings give you leverage to negotiate extras like free bags, seat selection, or lounge access. Airlines are often willing to include perks to secure large bookings.</p>

<h2>Use a Group Travel Specialist</h2>
<p>Companies like Priority Flyers have established relationships with airlines and access to unpublished fares. Our expertise typically saves groups 15-40% compared to booking individually.</p>',
  'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&h=400&fit=crop',
  'Tips & Tricks',
  '6 min read',
  'Sarah Mitchell',
  'Travel Expert',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
  false,
  3
),
(
  'New Routes: Direct Flights to Bali for Groups',
  'new-routes-direct-flights-bali-groups',
  'Exciting news for group travelers! New direct routes make Bali more accessible than ever.',
  '<p>Great news for group travel organizers! Several major airlines have announced new direct routes to Bali, making this popular destination more accessible than ever for large groups.</p>

<h2>New Route Announcements</h2>
<p>Starting in 2025, travelers will enjoy direct flights from more cities than ever before. These new routes significantly reduce travel time and simplify logistics for group organizers.</p>

<h2>Impact on Group Travel</h2>
<p>Direct flights are game-changers for group travel. Fewer connections mean:</p>
<ul>
  <li>Less chance of separated travelers</li>
  <li>Reduced risk of lost luggage</li>
  <li>Simpler coordination</li>
  <li>More relaxed arrival experiences</li>
</ul>

<h2>Booking Early is Essential</h2>
<p>These new routes are already seeing strong demand. Groups planning Bali trips for 2025 should lock in their seats now to secure availability and the best rates.</p>

<h2>Contact Us</h2>
<p>Ready to plan your group trip to Bali? Our team can help you take advantage of these new routes and create an unforgettable experience for your group.</p>',
  'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&h=400&fit=crop',
  'News',
  '3 min read',
  'James Wilson',
  'Industry Analyst',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
  false,
  4
),
(
  'Managing Large Sports Team Travel: A Complete Guide',
  'managing-large-sports-team-travel',
  'From equipment logistics to coordinated arrivals, learn how to handle sports team travel like a pro.',
  '<p>Sports team travel presents unique challenges that go beyond typical group bookings. Equipment, scheduling, dietary requirements, and competition logistics all demand careful planning.</p>

<h2>Equipment Considerations</h2>
<p>Sporting equipment often requires special handling. Work with airlines early to arrange oversized baggage, understand weight limits, and ensure proper handling for delicate items.</p>

<h2>Timing Around Events</h2>
<p>Athletes need time to recover from travel before competing. Plan arrivals with enough buffer time for rest, acclimatization, and practice sessions.</p>

<h2>Nutrition and Special Meals</h2>
<p>Athletes often have strict dietary requirements. Coordinate special meals for flights and research food options at your destination well in advance.</p>

<h2>Medical and Recovery Needs</h2>
<p>Ensure you know the location of medical facilities at your destination. Consider booking accommodations with recovery amenities like pools or spa facilities.</p>

<h2>Group Cohesion</h2>
<p>Keep the team together as much as possible. Block bookings for adjacent seating and coordinated ground transportation maintain team unity and simplify logistics.</p>',
  'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600&h=400&fit=crop',
  'Corporate Travel',
  '7 min read',
  'Michael Chen',
  'Corporate Travel Specialist',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
  false,
  5
),
(
  'Best Airlines for Group Bookings in Europe',
  'best-airlines-group-bookings-europe',
  'We compare the top European carriers for group travel, analyzing prices, flexibility, and service quality.',
  '<p>Choosing the right airline for your European group travel can significantly impact both your budget and experience. Here''s our comprehensive comparison of top carriers.</p>

<h2>Lufthansa Group</h2>
<p>Excellent group policies with dedicated teams for large bookings. Strong punctuality and comprehensive European network. Higher prices offset by reliability and service.</p>

<h2>Air France-KLM</h2>
<p>Competitive group rates and flexible rebooking policies. Particularly strong for transatlantic group travel with smooth connections through Paris and Amsterdam.</p>

<h2>British Airways</h2>
<p>Premium service and extensive route network. Group desk offers tailored solutions for corporate travel. London hub provides excellent connectivity.</p>

<h2>Low-Cost Alternatives</h2>
<p>For budget-conscious groups, carriers like easyJet and Ryanair offer group booking options, though with fewer amenities and less flexibility.</p>

<h2>Our Recommendation</h2>
<p>The best airline depends on your specific needs. Contact Priority Flyers for personalized recommendations based on your route, group size, and requirements.</p>',
  'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=600&h=400&fit=crop',
  'Tips & Tricks',
  '5 min read',
  'Sarah Mitchell',
  'Travel Expert',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
  false,
  6
),
(
  'Wedding Destination: Flying Your Guests to Paradise',
  'wedding-destination-flying-guests-paradise',
  'Planning a destination wedding? Here''s how to coordinate flights for all your guests seamlessly.',
  '<p>Destination weddings create unforgettable memories, but coordinating travel for dozens of guests requires careful planning. Here''s how to make it smooth for everyone.</p>

<h2>Start Early</h2>
<p>Begin coordinating flights at least 9-12 months before your wedding. This gives guests time to budget and ensures better availability.</p>

<h2>Create a Travel Portal</h2>
<p>Set up a dedicated page where guests can view recommended flights, accommodations, and local information. This centralizes information and reduces repetitive questions.</p>

<h2>Consider Group Blocks</h2>
<p>Working with Priority Flyers, you can create group booking blocks that guests can join. This often secures better rates and ensures everyone arrives together.</p>

<h2>Accommodate Different Budgets</h2>
<p>Not all guests have the same budget. Offer multiple flight options at different price points so everyone can participate.</p>

<h2>Plan Welcome Activities</h2>
<p>With coordinated arrivals, you can plan welcome events that bring everyone together before the big day.</p>',
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop',
  'Destinations',
  '6 min read',
  'Emily Rodriguez',
  'Destination Specialist',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
  false,
  7
),
(
  'Holiday Travel 2025: Book Early for Best Group Rates',
  'holiday-travel-2025-book-early-group-rates',
  'The holiday season is approaching fast. Learn why early booking is crucial for group travel.',
  '<p>Holiday travel demand is at an all-time high, and groups face unique challenges during peak periods. Here''s why early booking is more important than ever.</p>

<h2>Increased Competition</h2>
<p>Holiday periods see the highest travel demand of the year. Groups compete not just with other groups, but with millions of individual travelers.</p>

<h2>Limited Group Availability</h2>
<p>Airlines cap the number of group bookings per flight. During peak periods, these allocations fill quickly, sometimes months in advance.</p>

<h2>Price Increases</h2>
<p>Airfares rise dramatically as holidays approach. Early bookers can save 30-50% compared to last-minute prices.</p>

<h2>Seating Challenges</h2>
<p>Keeping groups seated together becomes nearly impossible on full flights. Early booking secures adjacent seating.</p>

<h2>Action Steps</h2>
<p>Contact Priority Flyers now to lock in your holiday group travel. Our team monitors inventory and can alert you to the best booking windows.</p>',
  'https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=600&h=400&fit=crop',
  'News',
  '4 min read',
  'James Wilson',
  'Industry Analyst',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
  false,
  8
),
(
  'School Trip Planning: Safety and Savings Combined',
  'school-trip-planning-safety-savings',
  'Essential tips for educators organizing school trips, balancing budget constraints with student safety.',
  '<p>School trips enrich education but come with significant responsibility. Here''s how to plan trips that are safe, educational, and budget-friendly.</p>

<h2>Safety First</h2>
<p>Student safety is paramount. Work with airlines experienced in youth travel who understand supervision requirements and emergency protocols.</p>

<h2>Budget Planning</h2>
<p>School budgets are tight. Start fundraising early and explore group discounts through educational travel programs.</p>

<h2>Documentation Requirements</h2>
<p>Ensure all necessary permissions, medical information, and travel documents are collected well in advance.</p>

<h2>Chaperone Ratios</h2>
<p>Maintain appropriate adult-to-student ratios. Many group booking programs offer free or discounted chaperone seats.</p>

<h2>Educational Value</h2>
<p>The best trips combine fun with learning. Plan activities that connect to curriculum and create lasting educational impact.</p>

<h2>Partner with Specialists</h2>
<p>Priority Flyers has extensive experience with school groups. Our team understands the unique requirements of educational travel.</p>',
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=400&fit=crop',
  'Corporate Travel',
  '5 min read',
  'Emily Rodriguez',
  'Destination Specialist',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
  false,
  9
);
