export const INITIAL_SERVICES = [
  {
    id: "electrician",
    name: "Electrician",
    description: "Wiring, short circuits, switchboards, MCB, appliance & lighting installations",
    icon: "electrical_services",
    color: "primary",
    bg: "bg-blue-500/10",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80",
    price: "$20/hr",
    startingRate: 20,
    availableWorkers: "24+ Available",
    rating: 4.9,
    badge: "Popular"
  },
  {
    id: "plumber",
    name: "Plumber",
    description: "Pipes, faucet leaks, water tank, motor repair & drainage solutions",
    icon: "plumbing",
    color: "secondary",
    bg: "bg-orange-500/10",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80",
    price: "$22/hr",
    startingRate: 22,
    availableWorkers: "19+ Available",
    rating: 4.8,
    badge: "Fast Dispatch"
  },
  {
    id: "carpenter",
    name: "Carpenter",
    description: "Furniture repair, modular fittings, doors, locks, custom wood crafts",
    icon: "handyman",
    color: "secondary",
    bg: "bg-amber-500/10",
    image: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80",
    price: "$25/hr",
    startingRate: 25,
    availableWorkers: "15+ Available",
    rating: 4.9,
    badge: "Master Craft"
  },
  {
    id: "painter",
    name: "Painter",
    description: "Full interior & exterior wall painting, waterproof coating, touch-ups",
    icon: "format_paint",
    color: "primary",
    bg: "bg-indigo-500/10",
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80",
    price: "$18/hr",
    startingRate: 18,
    availableWorkers: "28+ Available",
    rating: 4.8,
    badge: "Top Rated"
  },
  {
    id: "mason",
    name: "Mason",
    description: "Brickwork, tile setting, concrete repair, plastering, stone paving",
    icon: "architecture",
    color: "tertiary",
    bg: "bg-rose-500/10",
    image: "https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=800&q=80",
    price: "$24/hr",
    startingRate: 24,
    availableWorkers: "12+ Available",
    rating: 4.7,
    badge: "Heavy Duty"
  },
  {
    id: "cleaner",
    name: "Cleaner",
    description: "Deep home cleaning, bathroom disinfection, sofa & floor scrubbing",
    icon: "cleaning_services",
    color: "tertiary",
    bg: "bg-teal-500/10",
    image: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=800&q=80",
    price: "$16/hr",
    startingRate: 16,
    availableWorkers: "35+ Available",
    rating: 4.9,
    badge: "Eco-Friendly"
  },
  {
    id: "welder",
    name: "Welder",
    description: "Iron gates, grill repair, steel fabrication, heavy metal joint welding",
    icon: "hardware",
    color: "primary",
    bg: "bg-blue-500/10",
    image: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80",
    price: "$26/hr",
    startingRate: 26,
    availableWorkers: "8+ Available",
    rating: 4.8,
    badge: "Specialist"
  },
  {
    id: "gardener",
    name: "Gardener",
    description: "Lawn trimming, plant maintenance, landscape design, weed treatment",
    icon: "grass",
    color: "secondary",
    bg: "bg-emerald-500/10",
    image: "https://images.unsplash.com/photo-1592417817098-8f3d69104a47?auto=format&fit=crop&w=800&q=80",
    price: "$17/hr",
    startingRate: 17,
    availableWorkers: "14+ Available",
    rating: 4.9,
    badge: "Green Thumb"
  }
];

export const INITIAL_WORKERS = [
  {
    id: "marcus-johnson",
    name: "Marcus Johnson",
    skill: "Carpenter",
    skillTitle: "Master Carpenter",
    experience: 8,
    rating: 4.9,
    rate: 28,
    availability: "Available",
    avatar: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=400&q=80",
    verified: true,
    reviews: [
      { id: 1, user: "Elena P.", rating: 5, date: "2 days ago", comment: "Marcus did an excellent job building our bookshelf. Fast, neat, and highly professional!" },
      { id: 2, user: "Robert S.", rating: 4.8, date: "1 week ago", comment: "Very precise woodworking. Arrived on time and worked cleanly." }
    ],
    description: "Marcus is an experienced master carpenter specializing in solid wood furniture, custom shelving, cabinet installation, and repair work. He holds a craftsmanship license and has worked with residential clients for over 8 years."
  },
  {
    id: "sarah-davis",
    name: "Sarah Davis",
    skill: "Plumber",
    skillTitle: "Licensed Plumber",
    experience: 12,
    rating: 4.8,
    rate: 32,
    availability: "Available",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    verified: true,
    reviews: [
      { id: 1, user: "David K.", rating: 5, date: "3 days ago", comment: "Resolved a complex bathroom leak that others couldn't diagnose. Worth every penny." },
      { id: 2, user: "Maria G.", rating: 4.6, date: "2 weeks ago", comment: "Highly efficient. Changed the kitchen sink fixtures quickly." }
    ],
    description: "Sarah is a certified master plumber with 12 years of hands-on experience in residential drainage, emergency pipe repairs, water heater maintenance, and fixture installations. Reliable, swift, and highly skilled."
  },
  {
    id: "elena-rodriguez",
    name: "Elena Rodriguez",
    skill: "Electrician",
    skillTitle: "Certified Electrician",
    experience: 5,
    rating: 4.7,
    rate: 25,
    availability: "Offline",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAaZxGhoyoXOE3BFe-KVneP0ehPXoJqnYUb0X8tpOETpLqHCX2TSWaGBZpBwYrWx7MQNnP8M_d-yiJejLrIfzAAjkHwGJz38auU8Z5ngqwC7KyFHRNzpkwoumHbWhn7IwGZsCp_u1JKfVg08IE1674eZdj3Gce2Q4NF04FxWnXmDLl6sPz1HFjDdlpSywF3mLAlyxwx4Nzj54bGYkmTQeH6KRpMMs14XT_0b_WF8a2LMVlPgALT6fy-cAe6b8b-ZLMnsx6eBIDYjOhz",
    verified: true,
    reviews: [
      { id: 1, user: "Thomas L.", rating: 4.5, date: "1 month ago", comment: "Rewired our kitchen safely. Very professional approach." }
    ],
    description: "Elena has spent 5 years dealing with domestic electrical frameworks. Her services cover circuit breakers, smart lighting layouts, generator setups, and socket repairs, matching state safety regulations."
  },
  {
    id: "john-doe",
    name: "John Doe",
    skill: "Electrician",
    skillTitle: "Master Electrician",
    experience: 5,
    rating: 4.9,
    rate: 25,
    availability: "Available",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAyn73H76ZJdgf-yj3fNGxZfN8Yv-MwnQvLCa_Wp1YS1iT6I-vuqHzLgIw2dyq32whs2h6T8P3wzoMOjSPPcf7jYKwIeXjPDf_cvSokBpfXJ-nQGdRVgJmzahT_J3heHCJoxOMGYaXEcEIjxNp_nzXe8e3zc0SVtywWlde9Ijuq0rD8FVXHAYfugHJslXgLdZ5-Wh8rLBG0LNa0bgwIX5M8uuf84AKZEuuMUMmpOPu-L6l1874CjJLCrKFDPApeC-bCOYPAD6KFLT5B",
    verified: true,
    reviews: [
      { id: 1, user: "Jane W.", rating: 5, date: "5 days ago", comment: "Outstanding service. John fixed our short circuit issue in less than an hour!" }
    ],
    description: "John is a highly requested electrical specialist in residential and commercial wiring, panels upgrades, lighting layouts, and diagnostic testing. Known for fast and clean service."
  },
  {
    id: "sarah-smith",
    name: "Sarah Smith",
    skill: "Cleaner",
    skillTitle: "Professional Cleaner",
    experience: 3,
    rating: 4.8,
    rate: 18,
    availability: "Available",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuB5pLhzRNr-IsNCpifIhzKh9hoLcfNP2f2W1M3N6YwZNEPlDfuegsAqgUDjqlTJZA30vHABl9E-icKEy1ST-wcWQZERN9Bc0H5Lmt4U7nIwUyFHpmZhCZK8ieoooH9QV_XJYJYch-w4zHuTn1aAYWV6mFHgIA38KTCnV0qwbzM04OHJ4G23MnF14Z-XSJZ67PF0l7A8Qb_ARXZG8OCUQjlYAi4RRNWgQQtUdSreHEyzdxSDgIJW6yZc5C2g0pMueMJRIRvBBX1kxrtl",
    verified: true,
    reviews: [
      { id: 1, user: "Arthur M.", rating: 4.8, date: "2 weeks ago", comment: "Very thorough deep cleaning. The apartment was spotless." }
    ],
    description: "Sarah provides residential and commercial sanitization, window washing, and post-renovation cleanup. She uses eco-friendly agents and works with extreme attention to detail."
  },
  {
    id: "mike-johnson",
    name: "Mike Johnson",
    skill: "Mason",
    skillTitle: "Expert Mason",
    experience: 10,
    rating: 5.0,
    rate: 30,
    availability: "Available",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBZEYKUl9uuIAKpxiR691eEOWU9TzPKfxs5sx9vwlkdw7jazKOeHHSuF3soFZSkN8twHfxzGqy2vt7v7dnX9pKQ62Va5oOwn-l-yb0Aocne2H6mwc3PvMFcn4PydkdcbEi7kh1XbWFjNGrtNmY7TlYQ8Lev5Ro6s9GwPxDpxKtamXMeFAc8Bc2mEOqmvfegYLwy2WJ_g2hsq2ayNEVNreZpHLHm8ssyVuJ4uxL2yKJp_nintMIkUiuh12mRpZSvO0Ctn3KNwZqMG3qz",
    verified: true,
    reviews: [
      { id: 1, user: "Gary T.", rating: 5, date: "4 days ago", comment: "Flawless paving of our front driveway. Strong structural build!" }
    ],
    description: "Mike is a structural brickwork and stone professional. With 10 years in masonry, he builds retaining walls, block layouts, outdoor fireplaces, and performs stucco restorations."
  },
  {
    id: "kevin-turner",
    name: "Kevin Turner",
    skill: "Gardener",
    skillTitle: "Gen. Laborer & Gardener",
    experience: 2,
    rating: 4.5,
    rate: 15,
    availability: "Available",
    textAvatar: "KT",
    verified: false,
    reviews: [
      { id: 1, user: "Liza B.", rating: 4.5, date: "3 weeks ago", comment: "Very helpful in clearing the backyard weeds. Good energy." }
    ],
    description: "Kevin offers general property maintenance, weeding, basic landscaping, lawn mowing, and support with bulk lifting. High energy, friendly, and hardworking."
  }
];

export const INITIAL_JOBS_TIMELINE = [
  { step: 1, label: "Job Accepted", description: "Today, 08:30 AM", completed: true },
  { step: 2, label: "Heading to Customer", description: "Estimated arrival: 09:15 AM", completed: true },
  { step: 3, label: "Start Service", description: "Pending arrival", completed: false },
  { step: 4, label: "Job Completed", description: "Pending service completion", completed: false }
];

export const INITIAL_EARNINGS_TREND = [
  { day: "Mon", jobs: 85, tips: 15, completed: 45, trend: 35 },
  { day: "Tue", jobs: 120, tips: 25, completed: 52, trend: 45 },
  { day: "Wed", jobs: 90, tips: 20, completed: 38, trend: 30 },
  { day: "Thu", jobs: 110, tips: 30, completed: 65, trend: 55 },
  { day: "Fri", jobs: 150, tips: 45, completed: 59, trend: 50 },
  { day: "Sat", jobs: 210, tips: 60, completed: 80, trend: 70 },
  { day: "Sun", jobs: 80, tips: 10, completed: 72, trend: 65 }
];

export const INITIAL_PENDING_APPROVALS = [
  { id: "mike-k", name: "Mike K.", skill: "Carpentry", time: "1 day ago", avatarInitials: "MK" }
];

export const INITIAL_ASSIGNMENTS = [
  { id: "job-1", title: "Emergency Pipe Repair", worker: "John D.", type: "Plumbing", status: "Active", icon: "build" },
  { id: "job-2", title: "Wiring Installation", worker: "Sarah M.", type: "Electrical", status: "Pending", icon: "electrical_services" },
  { id: "job-3", title: "Deep Cleaning", worker: "Lisa R.", type: "Cleaning", status: "Completed", icon: "cleaning_services" }
];

export const TESTIMONIALS = [
  {
    id: 1,
    name: "Pooja Sharma",
    location: "Green Park, Delhi",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    service: "Master Electrician",
    rating: 5,
    date: "Yesterday",
    review: "Had an emergency short circuit in the evening. Booked through Workkar and the electrician arrived in 18 minutes with professional testing equipment. Zero hassle and transparent billing!"
  },
  {
    id: 2,
    name: "Vikram Malhotra",
    location: "Indiranagar, Bengaluru",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    service: "Emergency Plumbing",
    rating: 5,
    date: "3 days ago",
    review: "Best platform for daily wage and trade hires. No bargaining headaches, the plumber was Aadhaar verified, and payment was released only after I verified the repair was 100% complete."
  },
  {
    id: 3,
    name: "Aman Gupta",
    location: "Bandra West, Mumbai",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    service: "Custom Carpentry",
    rating: 5,
    date: "1 week ago",
    review: "Marcus repaired our modular kitchen racks and built a custom bookshelf. Flawless finishing. The live tracking on the map gave complete peace of mind."
  }
];

export const TRUST_METRICS = [
  {
    id: "dispatch",
    icon: "bolt",
    value: "15 Mins",
    label: "Average Arrival Time",
    description: "Instant dispatch from verified workers nearest to your doorstep."
  },
  {
    id: "verified",
    icon: "verified_user",
    value: "5,000+",
    label: "Background Verified",
    description: "Strict Aadhaar, PAN and criminal background checks for safety."
  },
  {
    id: "rating",
    icon: "star",
    value: "4.9 / 5.0",
    label: "Customer Rating",
    description: "Rated highly across 10,000+ completed daily wage requests."
  },
  {
    id: "escrow",
    icon: "shield",
    value: "100%",
    label: "Escrow Payment Safe",
    description: "Payment is held securely and only released when you approve."
  }
];

