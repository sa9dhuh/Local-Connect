/**
 * LOCALCONNECT (INDIA) — CENTRAL DATA & STORAGE MANAGEMENT
 * Seeded Indian dataset with INR (₹) currency, Indian names, locations (Bengaluru, Mumbai, Delhi NCR),
 * realistic service rates, and localStorage synchronization.
 */

const STORAGE_KEYS = {
  VERSION: 'localconnect_version',
  PROVIDERS: 'localconnect_providers',
  BOOKINGS: 'localconnect_bookings',
  FAVORITES: 'localconnect_favorites',
  CURRENT_USER: 'localconnect_user',
  PROVIDER_STATS: 'localconnect_provider_stats'
};

const DATA_VERSION = 'v2_inr_india';

// Seed Indian Providers Dataset
const SEED_PROVIDERS = [
  {
    id: 'p1',
    name: 'Rajesh Verma',
    category: 'Plumbing',
    tagline: 'Master Licensed Plumber with 14+ Years Experience across Bengaluru',
    rating: 4.9,
    reviewCount: 148,
    startingPrice: 299,
    priceUnit: 'visit',
    location: 'Koramangala, HSR Layout & Indiranagar (Bengaluru)',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&q=80',
    cover: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    verified: true,
    availability: 'Available Today',
    badges: ['Top Rated', 'Verified Pro', 'Fast 30-Min Arrival'],
    about: 'Rajesh is an ITI-certified master plumber with over 14 years of experience handling apartment complexes, independent villas, and commercial properties. Known for clean workmanship, genuine CPVC/UPVC fittings, and transparent quotes before starting any work.',
    experience: '14+ Years in Trade • ITI Certified • 1,200+ Verified Jobs Completed',
    servicesOffered: [
      { name: 'Emergency Leak & Pipe Joint Repair', price: 349, duration: '45 mins' },
      { name: 'Bathroom Tap & Mixer Installation', price: 299, duration: '30 mins' },
      { name: 'Kitchen Sink Drain Clearing & Trap Fix', price: 399, duration: '45 mins' },
      { name: 'Geyser (Water Heater) Fitting & Servicing', price: 499, duration: '1 hr' },
      { name: 'Western Toilet Cistern & Flush Valve Repair', price: 449, duration: '1 hr' }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=600&q=80'
    ],
    reviews: [
      {
        id: 'r1',
        author: 'Sneha Rao (Indiranagar)',
        rating: 5,
        date: '2 days ago',
        text: 'Rajesh bhaiya arrived within 40 minutes of booking! Fixed our kitchen sink pipe leak with zero fuss. Cleaned up the area completely after finishing.'
      },
      {
        id: 'r2',
        author: 'Amit Saxena (Koramangala)',
        rating: 5,
        date: '1 week ago',
        text: 'Very reasonable pricing. Replaced our bathroom geyser inlet valve without demanding extra unnecessary parts. Honest and professional.'
      },
      {
        id: 'r3',
        author: 'Preeti Deshmukh (HSR Layout)',
        rating: 4.8,
        date: '3 weeks ago',
        text: 'Polite and knowledgeable. Thoroughly inspected our overhead tank pipeline pressure.'
      }
    ]
  },
  {
    id: 'p2',
    name: 'Priya Kulkarni',
    category: 'Electrical',
    tagline: 'Licensed Electrical Specialist: Residential Wiring, Inverters & EV Home Chargers',
    rating: 4.95,
    reviewCount: 112,
    startingPrice: 349,
    priceUnit: 'visit',
    location: 'Andheri West, Bandra & Powai (Mumbai)',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    cover: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
    verified: true,
    availability: 'Available Today',
    badges: ['Top Rated', 'EV Certified', 'Govt Licensed Wireman'],
    about: 'Priya leads a certified team of electrical technicians specializing in home safety audits, smart home automated switches, inverter battery backup systems, and 4-wheeler EV charger wallbox installations across Mumbai.',
    experience: '11 Years Experience • Govt Wireman License #MH-8291 • Safety First',
    servicesOffered: [
      { name: 'MCB Trip & Short Circuit Diagnostic', price: 399, duration: '45 mins' },
      { name: 'Ceiling Fan Installation & Regulator Setup', price: 299, duration: '30 mins' },
      { name: 'Inverter & Home UPS Installation', price: 699, duration: '1.5 hrs' },
      { name: 'Electric Vehicle (EV) Home Charger Setup', price: 1499, duration: '2.5 hrs' },
      { name: 'Full Apartment Electrical Safety Inspection', price: 799, duration: '1 hr' }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=600&q=80'
    ],
    reviews: [
      {
        id: 'r4',
        author: 'Rohan Mehta (Bandra West)',
        rating: 5,
        date: '3 days ago',
        text: 'Priya installed our Ather 450X home charging station. Clean conduit routing, proper earthing check, and verified voltage levels. Highly recommended!'
      },
      {
        id: 'r5',
        author: 'Divya Nambiar (Andheri)',
        rating: 5,
        date: '2 weeks ago',
        text: 'Found a loose neutral connection in our main distribution board that was causing sparks. Saved us from a major safety hazard.'
      }
    ]
  },
  {
    id: 'p3',
    name: 'Suresh Patel',
    category: 'Cleaning',
    tagline: 'CleanWave Services — Eco-friendly deep cleaning for 1BHK, 2BHK & villas',
    rating: 4.88,
    reviewCount: 184,
    startingPrice: 599,
    priceUnit: 'service',
    location: 'Sector 62, Noida, Indirapuram & South Delhi',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    cover: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
    verified: true,
    availability: 'Available Tomorrow',
    badges: ['Eco Certified', 'Police Verified Staff', 'Hospital Grade Chemicals'],
    about: 'Suresh runs CleanWave Home Care, specializing in deep scrubbing of kitchens, bathrooms, balcony sanitization, sofa shampooing, and post-tenancy move-in cleaning using non-toxic German equipment.',
    experience: '9 Years Experience • 2,400+ Homes Cleaned • Taski Certified Chemicals',
    servicesOffered: [
      { name: 'Intense Bathroom Deep Cleaning (2 Baths)', price: 699, duration: '2 hrs' },
      { name: 'Modular Kitchen Chimney & Degreasing', price: 899, duration: '2.5 hrs' },
      { name: 'Full 2BHK Deep Cleaning Package', price: 2499, duration: '5 hrs' },
      { name: 'Fabric Sofa Shampoo & Dust Mite Extraction', price: 799, duration: '1.5 hrs' }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80'
    ],
    reviews: [
      {
        id: 'r6',
        author: 'Ritu Agarwal (Noida Sector 78)',
        rating: 5,
        date: 'Yesterday',
        text: 'Our kitchen tiles and chimney look sparkling clean! Suresh and team brought all their own vacuum and steamers.'
      },
      {
        id: 'r7',
        author: 'Kunal Kapoor (South Delhi)',
        rating: 4.8,
        date: '1 week ago',
        text: 'Great job on the bathrooms before Diwali guests arrived. Timely arrival and courteous staff.'
      }
    ]
  },
  {
    id: 'p4',
    name: 'Mohammad Imran',
    category: 'Repairs',
    tagline: 'Expert AC, Refrigerator & Washing Machine Technician (All Brands)',
    rating: 4.84,
    reviewCount: 135,
    startingPrice: 399,
    priceUnit: 'visit',
    location: 'Banjara Hills, Jubilee Hills & Madhapur (Hyderabad)',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
    cover: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    verified: true,
    availability: 'Available Today',
    badges: ['Same Day Service', '60-Day Warranty', 'Original Spares'],
    about: 'Imran has 12 years of authorized service center expertise across Voltas, Daikin, LG, Samsung, and IFB. Specializing in split AC jet pump servicing, gas charging, washing machine PCB repairs, and frost-free refrigerators.',
    experience: '12 Years Tech Specialist • 3,000+ Appliance Repairs Completed',
    servicesOffered: [
      { name: 'Split AC Foam & Jet Pump Servicing', price: 499, duration: '45 mins' },
      { name: 'AC Gas Charging (R32 / R410A)', price: 1899, duration: '1 hr' },
      { name: 'Washing Machine Drum & Motor Repair', price: 449, duration: '1-2 hrs' },
      { name: 'Double Door Refrigerator Cooling Diagnostic', price: 399, duration: '1 hr' },
      { name: 'Microwave Oven Heating Repair', price: 349, duration: '45 mins' }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=600&q=80'
    ],
    reviews: [
      {
        id: 'r8',
        author: 'Sandeep Reddy (Madhapur)',
        rating: 5,
        date: '5 days ago',
        text: 'My Voltas AC stopped cooling during peak summer. Imran identified a capacitor failure, replaced it with original part on the spot, and gave 60 days warranty.'
      }
    ]
  },
  {
    id: 'p5',
    name: 'Ananya Sen',
    category: 'Beauty',
    tagline: 'Certified Salon & Spa at Home Specialist (Hair, Facials, Waxing & Bridal)',
    rating: 4.93,
    reviewCount: 96,
    startingPrice: 499,
    priceUnit: 'service',
    location: 'Salt Lake, New Town & Ballygunge (Kolkata)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    cover: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
    verified: true,
    availability: 'Available Today',
    badges: ['Top Rated', '100% Monodose Hygiene Kit', 'L’Oréal Certified'],
    about: 'Ananya brings a luxury parlor experience directly to your doorstep. Using single-use disposable kits, branded L’Oréal, O3+, and Cheryl’s products, offering hair spa, glowing bridal facials, and painless waxing.',
    experience: '8 Years Parlor Specialist • VLCC Certified Esthetician',
    servicesOffered: [
      { name: 'O3+ Diamond Glow Facial & De-Tan', price: 1199, duration: '1 hr' },
      { name: 'Rica Brazilian / White Chocolate Waxing', price: 799, duration: '45 mins' },
      { name: 'L’Oréal Hair Spa & Scalp Massage', price: 899, duration: '1 hr' },
      { name: 'Express Manicure & Pedicure Spa', price: 649, duration: '1 hr' }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80'
    ],
    reviews: [
      {
        id: 'r9',
        author: 'Meera Mukherjee (Salt Lake)',
        rating: 5,
        date: '4 days ago',
        text: 'Such a relaxing facial! Ananya used sealed single-use packs and was very gentle and hygienic. Will book regularly.'
      }
    ]
  },
  {
    id: 'p6',
    name: 'Prof. Arvind Swaminathan',
    category: 'Tutors',
    tagline: 'Senior IIT-JEE & CBSE Math / Physics Faculty (Grades 9–12 & Engineering Prep)',
    rating: 5.0,
    reviewCount: 104,
    startingPrice: 450,
    priceUnit: 'hr',
    location: 'Malleshwaram, Rajajinagar (Bengaluru) & Live Online',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80',
    cover: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
    verified: true,
    availability: 'Available Today',
    badges: ['M.Sc Physics (IISc)', 'Top Rated', '100% Score Boost'],
    about: 'Prof. Arvind has mentored over 500 students for CBSE Board exams and IIT-JEE Mains/Advanced over 12 years. His visual, concept-oriented problem solving eliminates fear of mathematics and builds solid foundations.',
    experience: '12 Years Teaching • Former Allen / FIITJEE Senior Faculty • M.Sc IISc',
    servicesOffered: [
      { name: 'Class 10 CBSE / ICSE Math Crash Course', price: 450, duration: '1 hr' },
      { name: 'Class 11 & 12 Calculus & Trigonometry', price: 550, duration: '1 hr' },
      { name: 'IIT-JEE Physics Mechanics Problem Solving', price: 650, duration: '1.5 hrs' },
      { name: 'Foundation Science for Middle School', price: 400, duration: '1 hr' }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80'
    ],
    reviews: [
      {
        id: 'r10',
        author: 'Dr. Ashok Murthy (Bengaluru)',
        rating: 5,
        date: '1 week ago',
        text: 'My son was struggling with Class 12 Integration. Under Prof. Arvind’s mentorship, his confidence skyrocketed and he scored 94% in CBSE boards!'
      }
    ]
  },
  {
    id: 'p7',
    name: 'Gurpreet Singh',
    category: 'Plumbing',
    tagline: '24/7 Heavy Pipeline, Sump Pump & Sewer Line Specialist',
    rating: 4.8,
    reviewCount: 74,
    startingPrice: 349,
    priceUnit: 'visit',
    location: 'Rohini, Pitampura & West Delhi',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&q=80',
    cover: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    verified: true,
    availability: 'Available Today',
    badges: ['24/7 Emergency', 'High Pressure Jetting'],
    about: 'Gurpreet specializes in underground water tank cleaning, motorized motorized sump pump replacements, and high-pressure drainage blockage clearance for independent houses and builder floors.',
    experience: '11 Years Field Experience • Heavy Drain Machinery Specialist',
    servicesOffered: [
      { name: 'Submersible Sump Pump Repair & Wiring', price: 599, duration: '1.5 hrs' },
      { name: 'Underground Water Tank Pressure Jet Wash', price: 999, duration: '2 hrs' },
      { name: 'Main Sewer Pipe Blockage Clearing', price: 749, duration: '1 hr' }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80'
    ],
    reviews: [
      {
        id: 'r11',
        author: 'Harish Chawla (Rohini)',
        rating: 4.8,
        date: '2 weeks ago',
        text: 'Quick response at 9 PM when our water pump malfunctioned. Solved the problem cleanly.'
      }
    ]
  },
  {
    id: 'p8',
    name: 'Pooja Verma',
    category: 'Cleaning',
    tagline: 'SparkleClean Co. — Dedicated Kitchen, Chimney & Sofa Deep Sanitization',
    rating: 4.92,
    reviewCount: 156,
    startingPrice: 499,
    priceUnit: 'service',
    location: 'Whitefield, Marathahalli & Bellandur (Bengaluru)',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80',
    cover: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
    verified: true,
    availability: 'Available Today',
    badges: ['Gated Society Favorite', 'Pet Safe Chemicals'],
    about: 'Pooja leads a highly reviewed cleaning crew popular in major Bengaluru apartment societies like Prestige, Sobha, and Godrej. Specializing in move-in kitchen cleaning, balcony bird net wash, and steam sofa sanitization.',
    experience: '7 Years Experience • 1,500+ Bengaluru Society Homes Serviced',
    servicesOffered: [
      { name: 'Kitchen Exhaust & Chimney Oil Degreasing', price: 699, duration: '1.5 hrs' },
      { name: 'Balcony Deep Cleaning & Pigeon Net Sanitizing', price: 499, duration: '1 hr' },
      { name: 'Complete 3BHK Pre-Move In Deep Scrub', price: 2999, duration: '6 hrs' }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80'
    ],
    reviews: [
      {
        id: 'r12',
        author: 'Vikram Joshi (Whitefield)',
        rating: 5,
        date: '3 days ago',
        text: 'Pooja and her team transformed our rented flat before we handed keys back to the owner. Very impressed with the kitchen chimney cleaning!'
      }
    ]
  }
];

// Seed Indian Bookings
const SEED_BOOKINGS = [
  {
    id: 'LC-84920',
    providerId: 'p1',
    providerName: 'Rajesh Verma',
    providerCategory: 'Plumbing',
    providerAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&q=80',
    customerName: 'Rohan Mehta',
    customerEmail: 'rohan.mehta@example.com',
    customerPhone: '+91 98765 43210',
    customerAddress: 'Flat 402, Green Glen Layout, Bellandur, Bengaluru',
    serviceName: 'Emergency Leak & Pipe Joint Repair',
    date: '2026-09-14',
    timeSlot: '10:00 AM - 12:00 PM',
    status: 'Pending',
    notes: 'Kitchen sink pipe is dripping continuously into cabinet.',
    totalPrice: 349,
    createdAt: '2026-09-10T09:15:00Z'
  },
  {
    id: 'LC-79104',
    providerId: 'p2',
    providerName: 'Priya Kulkarni',
    providerCategory: 'Electrical',
    providerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    customerName: 'Rohan Mehta',
    customerEmail: 'rohan.mehta@example.com',
    customerPhone: '+91 98765 43210',
    customerAddress: 'Flat 402, Green Glen Layout, Bellandur, Bengaluru',
    serviceName: 'Ceiling Fan Installation & Regulator Setup',
    date: '2026-09-16',
    timeSlot: '02:00 PM - 04:00 PM',
    status: 'Accepted',
    notes: 'Need new BLDC ceiling fan mounted and wired in guest bedroom.',
    totalPrice: 299,
    createdAt: '2026-09-08T14:30:00Z'
  },
  {
    id: 'LC-62381',
    providerId: 'p3',
    providerName: 'Suresh Patel',
    providerCategory: 'Cleaning',
    providerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    customerName: 'Rohan Mehta',
    customerEmail: 'rohan.mehta@example.com',
    customerPhone: '+91 98765 43210',
    customerAddress: 'Flat 402, Green Glen Layout, Bellandur, Bengaluru',
    serviceName: 'Intense Bathroom Deep Cleaning (2 Baths)',
    date: '2026-09-01',
    timeSlot: '09:00 AM - 12:00 PM',
    status: 'Completed',
    notes: 'Two attached bathrooms tile scaling removal.',
    totalPrice: 699,
    createdAt: '2026-08-30T10:00:00Z'
  }
];

// Seed Indian User
const SEED_USER = {
  id: 'u1',
  name: 'Rohan Mehta',
  email: 'rohan.mehta@example.com',
  phone: '+91 98765 43210',
  address: 'Flat 402, Green Glen Layout, Bellandur',
  city: 'Bengaluru, Karnataka'
};

// Seed Indian Provider Business Stats
const SEED_PROVIDER_STATS = {
  providerId: 'p1',
  isAvailable: true,
  baseHourlyRate: 299,
  newRequestsCount: 1,
  completedJobsCount: 148,
  profileViewsMonth: 1850,
  monthlyEarnings: 48500,
  proMember: false
};

// Data Store Manager
const LocalConnectStore = {
  init() {
    // If version is not updated to India/INR, re-seed storage
    const currentVer = localStorage.getItem(STORAGE_KEYS.VERSION);
    if (currentVer !== DATA_VERSION) {
      localStorage.setItem(STORAGE_KEYS.VERSION, DATA_VERSION);
      localStorage.setItem(STORAGE_KEYS.PROVIDERS, JSON.stringify(SEED_PROVIDERS));
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(SEED_BOOKINGS));
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(['p1', 'p2']));
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(SEED_USER));
      localStorage.setItem(STORAGE_KEYS.PROVIDER_STATS, JSON.stringify(SEED_PROVIDER_STATS));
      return;
    }

    if (!localStorage.getItem(STORAGE_KEYS.PROVIDERS)) {
      localStorage.setItem(STORAGE_KEYS.PROVIDERS, JSON.stringify(SEED_PROVIDERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(SEED_BOOKINGS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.FAVORITES)) {
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(['p1', 'p2']));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(SEED_USER));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PROVIDER_STATS)) {
      localStorage.setItem(STORAGE_KEYS.PROVIDER_STATS, JSON.stringify(SEED_PROVIDER_STATS));
    }
  },

  getProviders() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.PROVIDERS)) || SEED_PROVIDERS;
    } catch (e) {
      return SEED_PROVIDERS;
    }
  },

  getProviderById(id) {
    const providers = this.getProviders();
    return providers.find(p => p.id === id) || providers[0];
  },

  saveProviders(providers) {
    localStorage.setItem(STORAGE_KEYS.PROVIDERS, JSON.stringify(providers));
  },

  getBookings() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS)) || SEED_BOOKINGS;
    } catch (e) {
      return SEED_BOOKINGS;
    }
  },

  addBooking(bookingData) {
    const bookings = this.getBookings();
    const newBooking = {
      id: 'LC-' + Math.floor(10000 + Math.random() * 90000),
      createdAt: new Date().toISOString(),
      status: 'Pending',
      ...bookingData
    };
    bookings.unshift(newBooking);
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));

    // Update provider requests count
    const stats = this.getProviderStats();
    stats.newRequestsCount = (stats.newRequestsCount || 0) + 1;
    this.saveProviderStats(stats);

    return newBooking;
  },

  updateBookingStatus(bookingId, status) {
    const bookings = this.getBookings();
    const index = bookings.findIndex(b => b.id === bookingId);
    if (index !== -1) {
      bookings[index].status = status;
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
      return bookings[index];
    }
    return null;
  },

  getFavorites() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVORITES)) || [];
    } catch (e) {
      return [];
    }
  },

  isFavorite(providerId) {
    const favs = this.getFavorites();
    return favs.includes(providerId);
  },

  toggleFavorite(providerId) {
    let favs = this.getFavorites();
    let isNowFav = false;
    if (favs.includes(providerId)) {
      favs = favs.filter(id => id !== providerId);
      isNowFav = false;
    } else {
      favs.push(providerId);
      isNowFav = true;
    }
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favs));
    return isNowFav;
  },

  addReview(providerId, reviewData) {
    const providers = this.getProviders();
    const provider = providers.find(p => p.id === providerId);
    if (!provider) return false;

    const newReview = {
      id: 'r' + Date.now(),
      author: reviewData.author || 'Verified Customer',
      rating: parseFloat(reviewData.rating) || 5,
      date: 'Just now',
      text: reviewData.text
    };

    provider.reviews.unshift(newReview);
    provider.reviewCount = (provider.reviewCount || 0) + 1;
    
    // Recalculate average rating
    const totalScore = provider.reviews.reduce((sum, r) => sum + r.rating, 0);
    provider.rating = parseFloat((totalScore / provider.reviews.length).toFixed(1));

    this.saveProviders(providers);
    return true;
  },

  getCurrentUser() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) || SEED_USER;
    } catch (e) {
      return SEED_USER;
    }
  },

  getProviderStats() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.PROVIDER_STATS)) || SEED_PROVIDER_STATS;
    } catch (e) {
      return SEED_PROVIDER_STATS;
    }
  },

  saveProviderStats(stats) {
    localStorage.setItem(STORAGE_KEYS.PROVIDER_STATS, JSON.stringify(stats));
  },

  // Smart Service Finder rule-based NLP parser
  smartDetectCategory(text) {
    if (!text || !text.trim()) return null;
    const lower = text.toLowerCase();

    const rules = [
      {
        category: 'Plumbing',
        keywords: ['plumb', 'leak', 'tap', 'sink', 'pipe', 'drain', 'toilet', 'flush', 'water heater', 'geyser', 'faucet', 'clog', 'drip', 'sewer', 'tank', 'motor', 'sump']
      },
      {
        category: 'Electrical',
        keywords: ['electric', 'wire', 'switch', 'spark', 'light', 'fan', 'fuse', 'breaker', 'power', 'socket', 'outlet', 'charger', 'short circuit', 'mcb', 'inverter', 'ups', 'meter']
      },
      {
        category: 'Cleaning',
        keywords: ['clean', 'dust', 'mop', 'maid', 'deep clean', 'sofa', 'carpet', 'housekeeping', 'apartment clean', 'vacuum', 'scrub', 'stain', 'hygiene', 'move in', 'balcony', 'chimney', 'kitchen']
      },
      {
        category: 'Repairs',
        keywords: ['repair', 'fix', 'broken', 'fridge', 'refrigerator', 'washer', 'washing machine', 'dryer', 'appliance', 'ac unit', 'air conditioner', 'oven', 'microwave', 'service', 'cooling']
      },
      {
        category: 'Beauty',
        keywords: ['beauty', 'hair', 'salon', 'makeup', 'facial', 'massage', 'manicure', 'pedicure', 'styling', 'skin', 'blowout', 'bride', 'waxing', 'parlour', 'threading', 'spa']
      },
      {
        category: 'Tutors',
        keywords: ['tutor', 'teach', 'math', 'calculus', 'algebra', 'physics', 'science', 'chemistry', 'jee', 'iit', 'cbse', 'icse', 'exam', 'teacher', 'lesson', 'class', 'tuition']
      }
    ];

    for (const rule of rules) {
      for (const keyword of rule.keywords) {
        if (lower.includes(keyword)) {
          return rule.category;
        }
      }
    }
    return null;
  }
};

// Auto-initialize store
LocalConnectStore.init();
