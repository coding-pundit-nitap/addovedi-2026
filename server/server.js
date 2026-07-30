import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import apiRouter from './routes/index.js';

// Models for Seeding
import Admin from './models/Admin.js';
import Category from './models/Category.js';
import SubEvent from './models/SubEvent.js';
import Crew from './models/Crew.js';
import Sponsor from './models/Sponsor.js';
import { hashPassword } from './utils/hash.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Mount API router
app.use('/api', apiRouter);

// Basic health check route
app.get('/api/status', (req, res) => {
    res.json({ status: 'ok', message: 'Addovedi Techfest Command Server is active' });
});

// Database seeding function
const seedDatabase = async () => {
    try {
        // 1. Seed Admin Account if empty
        const adminCount = await Admin.countDocuments();
        if (adminCount === 0) {
            const hashed = hashPassword('admin123');
            const admin = new Admin({ username: 'admin', password: hashed });
            await admin.save();
            console.log(`[SEED] Admin account auto-created: admin / admin123`);
        }

        // 2. Seed default categories if empty
        const catCount = await Category.countDocuments();
        if (catCount < 7) {
            await Category.deleteMany({});
            const defaultCats = [
                { title: 'ROBOTICS & RC', subtitle: 'AUTONOMOUS MOTORS', desc: 'Race high-speed RC cars and program precise line followers.', color: '#00d9ff', xp: '8,000 XP', difficulty: 'ELITE', iconType: 'robot', modelType: 'mecha' },
                { title: 'CODING QUEST', subtitle: 'ALGORITHMIC WARFARE', desc: 'Join high-speed hackathons and optimize code structures.', color: '#ff1f4f', xp: '5,000 XP', difficulty: 'HARD', iconType: 'code', modelType: 'coding' },
                { title: 'ELECTRICAL GUILD', subtitle: 'CIRCUIT DEBUGGING', desc: 'Master breadboard wiring, logic gates, and analog designs.', color: '#ff9d00', xp: '6,500 XP', difficulty: 'MEDIUM', iconType: 'bolt', modelType: 'electrical' },
                { title: 'GAMING ARENA', subtitle: 'ESPORTS SHOWDOWN', desc: 'Compete in Valorant, BGMI, and FIFA college tournaments.', color: '#9b5cff', xp: '6,000 XP', difficulty: 'HARD', iconType: 'gamepad', modelType: 'controller' },
                { title: 'CREATIVE & DESIGN', subtitle: 'STRUCTURE & CLAY', desc: 'Build structural bridges, throw pottery, and exhibit fine arts.', color: '#1fff76', xp: '4,500 XP', difficulty: 'EASY', iconType: 'brush', modelType: 'civil' },
                { title: 'AI & DATA SCIENCE', subtitle: 'NEURAL CONSTRUCTS', desc: 'Train reinforcement agents and design deep learning models.', color: '#2b5cff', xp: '7,000 XP', difficulty: 'HARD', iconType: 'cpu', modelType: 'ai' },
                { title: 'WORKSHOP LAB', subtitle: 'KINETIC HARDWARE', desc: 'Operate industrial metalworks and build hardware machinery.', color: '#ffea00', xp: '5,500 XP', difficulty: 'MEDIUM', iconType: 'tool', modelType: 'coding' }
            ];
            await Category.insertMany(defaultCats);
            console.log(`[SEED] Seeded 7 default categories`);
        }

        // 3. Seed default sub-events if empty
        const subCount = await SubEvent.countDocuments();
        const uniqueCategories = await SubEvent.distinct('categoryTitle');
        if (subCount === 0 || uniqueCategories.length < 7) {
            await SubEvent.deleteMany({});
            const defaultSubs = [
                // 1. CODING QUEST
                {
                    categoryTitle: 'CODING QUEST',
                    title: 'BUG HUNT',
                    subtitle: 'DIAGNOSTICS & DEBUGGING',
                    desc: 'Scan code segments and patch hidden compiler bugs under pressure.',
                    color: '#ff1f4f',
                    xp: '1,500 XP',
                    difficulty: 'MEDIUM',
                    iconType: 'code',
                    heads: [
                        { name: 'Vaibhav Singh', phone: '+91 98765 43210' },
                        { name: 'Karan Patel', phone: '+91 87654 32109' }
                    ]
                },
                {
                    categoryTitle: 'CODING QUEST',
                    title: 'BYTE CODE',
                    subtitle: 'ALGORITHMS & SPEED',
                    desc: 'Crack algorithmic constraints and design time-optimal data models.',
                    color: '#ff1f4f',
                    xp: '2,500 XP',
                    difficulty: 'HARD',
                    iconType: 'code',
                    heads: [
                        { name: 'Priya Nair', phone: '+91 76543 21098' },
                        { name: 'Siddharth Roy', phone: '+91 65432 10987' }
                    ]
                },
                {
                    categoryTitle: 'CODING QUEST',
                    title: 'WEB CRAFT',
                    subtitle: 'DASHBOARD INTERFACES',
                    desc: 'Design beautiful, responsive game visual overlay terminals.',
                    color: '#ff1f4f',
                    xp: '3,000 XP',
                    difficulty: 'ELITE',
                    iconType: 'code',
                    heads: [
                        { name: 'Vaibhav Singh', phone: '+91 98765 43210' },
                        { name: 'Neha Gupta', phone: '+91 54321 09876' }
                    ]
                },
                // 2. ELECTRICAL GUILD
                {
                    categoryTitle: 'ELECTRICAL GUILD',
                    title: 'LOGIC QUEST',
                    subtitle: 'TRUTH TABLES & CIRCUITS',
                    desc: 'Build gate systems and resolve high-frequency signals.',
                    color: '#ff9d00',
                    xp: '2,000 XP',
                    difficulty: 'MEDIUM',
                    iconType: 'bolt',
                    heads: [
                        { name: 'Karan Patel', phone: '+91 87654 32109' },
                        { name: 'Arjun Kumar', phone: '+91 91234 56789' }
                    ]
                },
                {
                    categoryTitle: 'ELECTRICAL GUILD',
                    title: 'MAZE RUNNER',
                    subtitle: 'AUTONOMOUS PCB BOARDS',
                    desc: 'Program microcontrollers to solve breadboard electrical mazes.',
                    color: '#ff9d00',
                    xp: '3,000 XP',
                    difficulty: 'HARD',
                    iconType: 'bolt',
                    heads: [
                        { name: 'Simran Kaur', phone: '+91 92345 67890' },
                        { name: 'Gaurav Sharma', phone: '+91 93456 78901' }
                    ]
                },
                // 3. ROBOTICS & RC
                {
                    categoryTitle: 'ROBOTICS & RC',
                    title: 'ROBO WARS',
                    subtitle: 'COMBAT ARENA',
                    desc: 'Destroy opponents in a steel-caged combat arena showdown.',
                    color: '#00d9ff',
                    xp: '4,000 XP',
                    difficulty: 'ELITE',
                    iconType: 'robot',
                    heads: [
                        { name: 'Akash Yadav', phone: '+91 94567 89012' },
                        { name: 'Mohit Jain', phone: '+91 95678 90123' }
                    ]
                },
                {
                    categoryTitle: 'ROBOTICS & RC',
                    title: 'LINE RUNNER',
                    subtitle: 'INFRARED ACCELERATION',
                    desc: 'Design line followers that lock onto grid courses in record time.',
                    color: '#00d9ff',
                    xp: '2,500 XP',
                    difficulty: 'MEDIUM',
                    iconType: 'robot',
                    heads: [
                        { name: 'Simran Kaur', phone: '+91 92345 67890' },
                        { name: 'Shreya Nair', phone: '+91 96789 01234' }
                    ]
                },
                {
                    categoryTitle: 'ROBOTICS & RC',
                    title: 'DRONE PILOT',
                    subtitle: 'AERIAL ACCELERATOR',
                    desc: 'Fly precision micro drones through complex vertical ring gates.',
                    color: '#00d9ff',
                    xp: '3,500 XP',
                    difficulty: 'HARD',
                    iconType: 'robot',
                    heads: [
                        { name: 'Akash Yadav', phone: '+91 94567 89012' },
                        { name: 'Gaurav Sharma', phone: '+91 93456 78901' }
                    ]
                },
                // 4. CREATIVE & DESIGN
                {
                    categoryTitle: 'CREATIVE & DESIGN',
                    title: 'PROPEL',
                    subtitle: 'PNEUMATIC PROPULSION',
                    desc: 'Assemble model rockets and launch them high using air-pressure pumps.',
                    color: '#1fff76',
                    xp: '1,200 XP',
                    difficulty: 'EASY',
                    iconType: 'brush',
                    heads: [
                        { name: 'Harsh Kapoor', phone: '+91 97890 12345' },
                        { name: 'Kiran Verma', phone: '+91 98901 23456' }
                    ]
                },
                {
                    categoryTitle: 'CREATIVE & DESIGN',
                    title: 'TRUSS BUILD',
                    subtitle: 'BALSA WOOD BRIDGES',
                    desc: 'Glue together truss bridges and load test them to the absolute break limit.',
                    color: '#1fff76',
                    xp: '1,800 XP',
                    difficulty: 'MEDIUM',
                    iconType: 'brush',
                    heads: [
                        { name: 'Harsh Kapoor', phone: '+91 97890 12345' },
                        { name: 'Ritika Sharma', phone: '+91 99012 34567' }
                    ]
                },
                {
                    categoryTitle: 'CREATIVE & DESIGN',
                    title: 'POTTERY ART',
                    subtitle: 'CLAY VISIONS',
                    desc: 'Sculpt customized pots on motorized spinning potter wheels.',
                    color: '#1fff76',
                    xp: '1,000 XP',
                    difficulty: 'EASY',
                    iconType: 'brush',
                    heads: [
                        { name: 'Shruti Agarwal', phone: '+91 88901 23456' },
                        { name: 'Meera Patel', phone: '+91 77890 12345' }
                    ]
                },
                // 5. GAMING ARENA
                {
                    categoryTitle: 'GAMING ARENA',
                    title: 'VALORANT',
                    subtitle: '5V5 SEARCH & DESTROY',
                    desc: 'Coordinate agent tactics on stage screens for gaming domination.',
                    color: '#9b5cff',
                    xp: '3,000 XP',
                    difficulty: 'HARD',
                    iconType: 'gamepad',
                    heads: [
                        { name: 'Aman Verma', phone: '+91 99999 88888' },
                        { name: 'Rahul Das', phone: '+91 88888 77777' }
                    ]
                },
                {
                    categoryTitle: 'GAMING ARENA',
                    title: 'BGMI CRUCIBLE',
                    subtitle: 'SURVIVAL BR',
                    desc: 'Drop in teams, clear hostile drops, and survive the gaming circle.',
                    color: '#9b5cff',
                    xp: '2,500 XP',
                    difficulty: 'MEDIUM',
                    iconType: 'gamepad',
                    heads: [
                        { name: 'Sneha Raj', phone: '+91 77777 66666' },
                        { name: 'Pooja Sharma', phone: '+91 66666 55555' }
                    ]
                },
                {
                    categoryTitle: 'GAMING ARENA',
                    title: 'FIFA PRO',
                    subtitle: '1V1 ESPORTS',
                    desc: 'Compete in high-frequency bracket matches on console screens.',
                    color: '#9b5cff',
                    xp: '2,000 XP',
                    difficulty: 'MEDIUM',
                    iconType: 'gamepad',
                    heads: [
                        { name: 'Amit Joshi', phone: '+91 55555 44444' },
                        { name: 'Rohit Verma', phone: '+91 44444 33333' }
                    ]
                },
                // 6. AI & DATA SCIENCE
                {
                    categoryTitle: 'AI & DATA SCIENCE',
                    title: 'MACHINE INTELLIGENCE',
                    subtitle: 'NEURAL NETWORKS & TELEMETRY',
                    desc: 'Solve deep learning model matrices and run predictive simulations.',
                    color: '#2b5cff',
                    xp: '3,500 XP',
                    difficulty: 'HARD',
                    iconType: 'cpu',
                    heads: [
                        { name: 'Priya Nair', phone: '+91 76543 21098' },
                        { name: 'Arjun Kumar', phone: '+91 91234 56789' }
                    ]
                },
                {
                    categoryTitle: 'AI & DATA SCIENCE',
                    title: 'NEURAL HACK',
                    subtitle: 'TRANSFORMER TUNING',
                    desc: 'Optimize custom transformers and train computer vision parameters.',
                    color: '#2b5cff',
                    xp: '2,800 XP',
                    difficulty: 'MEDIUM',
                    iconType: 'cpu',
                    heads: [
                        { name: 'Siddharth Roy', phone: '+91 65432 10987' },
                        { name: 'Neha Gupta', phone: '+91 54321 09876' }
                    ]
                },
                // 7. WORKSHOP LAB
                {
                    categoryTitle: 'WORKSHOP LAB',
                    title: 'KINETIC METALWORKS',
                    subtitle: 'HARDWARE MACHINERY',
                    desc: 'Cut and construct architectural rigs using industrial lathe tools.',
                    color: '#ffea00',
                    xp: '2,600 XP',
                    difficulty: 'HARD',
                    iconType: 'tool',
                    heads: [
                        { name: 'Rohan Mehta', phone: '+91 99887 76655' },
                        { name: 'Aisha Khan', phone: '+91 88776 65544' }
                    ]
                },
                {
                    categoryTitle: 'WORKSHOP LAB',
                    title: 'CAD BLUEPRINTS',
                    subtitle: 'SOLID MODELLING',
                    desc: 'Render complex 3D hardware schematics and mechanical parts.',
                    color: '#ffea00',
                    xp: '2,200 XP',
                    difficulty: 'MEDIUM',
                    iconType: 'tool',
                    heads: [
                        { name: 'Neha Gupta', phone: '+91 54321 09876' },
                        { name: 'Amit Joshi', phone: '+91 55555 44444' }
                    ]
                }
            ];
            await SubEvent.insertMany(defaultSubs);
            console.log(`[SEED] Seeded default sub-events (${defaultSubs.length} items across 7 categories)`);
        }

        // 4. Seed default crew members if empty or outdated
        const crewCount = await Crew.countDocuments();
        if (crewCount < 10) {
            await Crew.deleteMany({});
            const defaultCrew = [
                // EXECUTIVE
                { name: 'AMAN VERMA', role: 'PRESIDENT', category: 'CORE', statText: 'LEADERSHIP', statVal: 96, featured: true, featuredHeading: 'TECHFEST PRESIDENT', bio: 'Coordinated 3-day Techfest, Led 46-member team, Secured 12+ sponsors', links: [] },
                { name: 'SNEHA RAJ', role: 'VICE PRESIDENT', category: 'CORE', statText: 'OPERATIONS', statVal: 92, featured: false, bio: 'Managed event logistics, Budget allocation, Team coordination', links: [] },
                { name: 'ROHAN MEHTA', role: 'GENERAL SECRETARY', category: 'CORE', statText: 'DOCUMENTATION', statVal: 87, featured: false, bio: 'Handled official letters, Managed registrations, MoU documentation', links: [] },
                { name: 'AISHA KHAN', role: 'TREASURER', category: 'CORE', statText: 'FINANCE', statVal: 94, featured: false, bio: 'Managed ₹5L+ budget, Vendor payments, Cost optimization', links: [] },
                { name: 'DEV SHARMA', role: 'PUBLIC RELATIONS', category: 'CORE', statText: 'PR OUTREACH', statVal: 91, featured: true, featuredHeading: 'PR EXECUTIVE', bio: 'Media outreach campaign, Press releases, College partnerships', links: [] },

                // TECH
                { name: 'VAIBHAV SINGH', role: 'TECH LEAD', category: 'TECHNICAL', statText: 'REACT / 3D', statVal: 95, featured: true, featuredHeading: 'INTERFACE LEAD', bio: 'Built festival website, 3D interactive UI, Real-time event portal', links: [] },
                { name: 'KARAN PATEL', role: 'BACKEND DEVELOPER', category: 'TECHNICAL', statText: 'NODE / REST', statVal: 90, featured: false, bio: 'API architecture, Database design, Auth systems', links: [] },
                { name: 'PRIYA NAIR', role: 'FULL STACK DEV', category: 'TECHNICAL', statText: 'PORTALS BUILT', statVal: 85, featured: false, bio: 'Registration portal, Admin dashboard, Email automation', links: [] },
                { name: 'ARJUN KUMAR', role: 'DEVOPS ENGINEER', category: 'TECHNICAL', statText: 'INFRASTRUCTURE', statVal: 87, featured: false, bio: 'Cloud deployment, Zero-downtime pipeline, Security hardening', links: [] },
                { name: 'NEHA GUPTA', role: 'UI/UX DESIGNER', category: 'TECHNICAL', statText: 'DESIGN SYSTEMS', statVal: 94, featured: true, featuredHeading: 'DESIGN LEAD', bio: 'Design system, User journey mapping, Brand identity', links: [] },
                { name: 'SIDDHARTH ROY', role: 'DATABASE ARCHITECT', category: 'TECHNICAL', statText: 'POSTGRES / REDIS', statVal: 89, featured: false, bio: 'Schema design, Query optimization, Data pipelines', links: [] },

                // EVENTS
                { name: 'RAHUL DAS', role: 'EVENTS HEAD', category: 'EVENTS', statText: 'COORDINATION', statVal: 93, featured: true, featuredHeading: 'EVENTS OVERSEER', bio: 'Planned 25+ events, Venue coordination, Day-of execution', links: [] },
                { name: 'POOJA SHARMA', role: 'SENIOR COORDINATOR', category: 'EVENTS', statText: 'SCHEDULING', statVal: 90, featured: false, bio: 'Speaker invitations, Timeline management, Backup planning', links: [] },
                { name: 'AMIT JOSHI', role: 'LOGISTICS MANAGER', category: 'EVENTS', statText: 'PROCUREMENT', statVal: 87, featured: false, bio: 'Equipment procurement, Venue setup, Transport logistics', links: [] },
                { name: 'DIVYA MENON', role: 'STAGE MANAGER', category: 'EVENTS', statText: 'STAGE OPERATIONS', statVal: 91, featured: false, bio: 'Stage setup stage management stage lighting & audio control', links: [] },
                { name: 'TANYA SINGH', role: 'HOSPITALITY HEAD', category: 'EVENTS', statText: 'GUEST RELATIONS', statVal: 92, featured: true, featuredHeading: 'HOSPITALITY LEAD', bio: 'VIP guest management, Accommodation, Welcome protocol', links: [] },

                // MEDIA
                { name: 'NIKHIL BOSE', role: 'MEDIA HEAD', category: 'MEDIA', statText: 'DIRECTION', statVal: 92, featured: true, featuredHeading: 'MEDIA & DESIGN LEAD', bio: 'Social media strategy, Brand consistency, Content calendar', links: [] },
                { name: 'SHRUTI AGARWAL', role: 'PHOTOGRAPHER', category: 'MEDIA', statText: 'PHOTOGRAPHY', statVal: 95, featured: false, bio: 'Event photography, Portfolio creation, Press kit images', links: [] },
                { name: 'ROHIT VERMA', role: 'VIDEOGRAPHER', category: 'MEDIA', statText: 'VIDEO PRODUCTION', statVal: 91, featured: false, bio: 'Teaser trailer, Live streams, After-movie production', links: [] },
                { name: 'MEERA PATEL', role: 'GRAPHIC DESIGNER', category: 'MEDIA', statText: 'ILLUSTRATION', statVal: 93, featured: false, bio: 'Poster series, Event banners, Social media templates', links: [] },
                { name: 'VIVEK MISHRA', role: 'SOCIAL MEDIA LEAD', category: 'MEDIA', statText: 'CAMPAIGNS', statVal: 89, featured: true, featuredHeading: 'SOCIAL OUTREACH LEAD', bio: '10K+ impressions campaign, Reel strategy, Influencer outreach', links: [] },

                // ROBOTICS
                { name: 'AKASH YADAV', role: 'ROBOTICS HEAD', category: 'ROBOTICS', statText: 'EMBEDDED C', statVal: 92, featured: true, featuredHeading: 'ROBO COMMAND LEAD', bio: 'Bot design oversight, Workshop facilitation, Competition judging', links: [] },
                { name: 'SIMRAN KAUR', role: 'HARDWARE ENGINEER', category: 'ROBOTICS', statText: 'PCB DESIGNS', statVal: 90, featured: false, bio: 'Prototype fabrication, Sensor integration, Hardware testing', links: [] },
                { name: 'GAURAV SHARMA', role: 'FIRMWARE DEV', category: 'ROBOTICS', statText: 'RTOS / C++', statVal: 87, featured: false, bio: 'Motor control firmware, Sensor fusion, Real-time systems', links: [] },
                { name: 'SHREYA NAIR', role: 'CAD DESIGNER', category: 'ROBOTICS', statText: 'SOLIDWORKS', statVal: 91, featured: false, bio: 'Chassis design, 3D printed components, Structural analysis', links: [] },
                { name: 'MOHIT JAIN', role: 'TEST ENGINEER', category: 'ROBOTICS', statText: 'UNIT TESTING', statVal: 89, featured: true, featuredHeading: 'ROBO TEST LEAD', bio: 'System integration tests, Failure analysis, Test protocols', links: [] },
                { name: 'ANIKA ROY', role: 'DOCUMENTATION LEAD', category: 'ROBOTICS', statText: 'TECHNICAL WRITES', statVal: 93, featured: false, bio: 'Technical reports, Workshop materials, Knowledge base', links: [] },

                // SPONSORS
                { name: 'CAP. HARSH', role: 'SPONSORSHIP HEAD', category: 'SPONSORS', statText: 'NEGOTIATION', statVal: 93, featured: true, featuredHeading: 'ALLIANCES HEAD', bio: 'Secured 12+ sponsors, ₹5L+ in sponsorships, Corporate decks', links: [] },
                { name: 'RITIKA SHARMA', role: 'CORPORATE RELATIONS', category: 'SPONSORS', statText: 'CRM MANAGEMENT', statVal: 91, featured: false, bio: 'MNC partnerships, Cold outreach campaigns, CRM management', links: [] },
                { name: 'KIRAN VERMA', role: 'OUTREACH LEAD', category: 'SPONSORS', statText: 'EMAIL OUTREACH', statVal: 88, featured: false, bio: 'Email outreach (500+ contacts), Response rate optimization', links: [] },
                { name: 'SUMIT PATEL', role: 'MARKETING ANALYST', category: 'SPONSORS', statText: 'MARKET RESEARCH', statVal: 89, featured: false, bio: 'Sponsor ROI reports, Industry research, Pricing strategy', links: [] }
            ];
            await Crew.insertMany(defaultCrew);
            console.log(`[SEED] Seeded default crew members`);
        }

        // 5. Seed default sponsors if empty or outdated
        const sponsorCount = await Sponsor.countDocuments();
        if (sponsorCount < 10) {
            await Sponsor.deleteMany({});
            const defaultSponsors = [
                { name: 'NVIDIA', category: 'TITLE', sub: 'Technology Partner', logo: 'NV', desc: 'Accelerating AI and real-time graphics pipelines.', support: ['AI Arena', 'Rendering Server', 'GPU Workshops'], url: '#' },
                { name: 'AMD', category: 'TITLE', sub: 'Hardware Sponsor', logo: 'AMD', desc: 'Powering high-frequency compute processors in coding grids.', support: ['Coding Arena', 'Host Servers', 'Hackathons'], url: '#' },
                { name: 'ASUS ROG', category: 'GOLD', sub: 'Gaming Partner', logo: 'ROG', desc: 'Equipping gaming arenas with high-refresh display monitors.', support: ['Valorant Tournament', 'Console Arenas', 'Fifa 1v1'], url: '#' },
                { name: 'MSI', category: 'GOLD', sub: 'Gear Sponsor', logo: 'MSI', desc: 'Sponsoring gaming peripherals and mechanical rigs.', support: ['Esports Showdown', 'Robotics Race', 'Workshop Lab'], url: '#' },
                { name: 'BOAT', category: 'MEDIA', sub: 'Audio Partner', logo: 'BOAT', desc: 'Providing elite wireless audio gear for stage streams.', support: ['Closing Gala', 'Music Night', 'Cultural Stages'], url: '#' },
                { name: 'MICROSOFT', category: 'GOLD', sub: 'Cloud Partner', logo: 'MS', desc: 'Providing Azure credits and cloud telemetry nodes.', support: ['Database Sync', 'Web Hosting', 'PR Systems'], url: '#' },
                { name: 'INTEL', category: 'SILVER', sub: 'Chipset Sponsor', logo: 'INTC', desc: 'Empowering logic design labs and breadboard gates.', support: ['Logic Quest', 'Circuit Debugging', 'Robo Soccer'], url: '#' },
                { name: 'GIGABYTE', category: 'SILVER', sub: 'Motherboard Partner', logo: 'GIGA', desc: 'Supplying robust mainboards for drone simulation systems.', support: ['Drone Pilot', 'Drone Wars', 'Embedded Rigs'], url: '#' },
                { name: 'RAZER', category: 'MEDIA', sub: 'Peripherals Partner', logo: 'RAZ', desc: 'Premium mechanical keybeds and tournament audio links.', support: ['Valorant Finals', 'Coding Hackathons'], url: '#' },
                { name: 'GITHUB', category: 'MEDIA', sub: 'Platform Partner', logo: 'GIT', desc: 'Providing secure code collaboration repositories.', support: ['Web Craft', 'Hackathon Repos', 'Student Developer Packs'], url: '#' },
                { name: 'RED BULL', category: 'BEVERAGE', sub: 'Energy Sponsor', logo: 'RB', desc: 'Fueling coding sprints and drone pilots during 24h runs.', support: ['Hackathon', 'Drone Wars', 'Robo Wars'], url: '#' },
                { name: 'SONY', category: 'GOLD', sub: 'Console Sponsor', logo: 'SONY', desc: 'Providing PlayStation 5 stations for soccer showdowns.', support: ['FIFA Pro', 'FIFA 1v1', 'Cultural Stages'], url: '#' },
                { name: 'CADENCE', category: 'SILVER', sub: 'EDA Software Partner', logo: 'CAD', desc: 'Sponsoring advanced circuit simulator licenses.', support: ['Logic Quest', 'Circuit Final'], url: '#' },
                { name: 'SOLIDWORKS', category: 'SILVER', sub: 'CAD Software Partner', logo: 'SW', desc: 'Providing mechanical blueprint design licenses.', support: ['CAD Blueprints', 'Robotics Race'], url: '#' },
                { name: 'DELL', category: 'SILVER', sub: 'Workstation Sponsor', logo: 'DELL', desc: 'Supplying high-performance CAD workstation displays.', support: ['CAD Blueprints', 'AI Showcase'], url: '#' },
                { name: 'LOGITECH', category: 'SILVER', sub: 'Input Devices Sponsor', logo: 'LOGI', desc: 'Sponsoring keyboards and mice for arena gaming setups.', support: ['Gaming Arena', 'FIFA 1V1'], url: '#' },
                { name: 'COCA COLA', category: 'BEVERAGE', sub: 'Refreshment Partner', logo: 'KO', desc: 'Official food and beverage zone refreshment sponsor.', support: ['Food Courts', 'Closing Gala'], url: '#' },
                { name: 'SPOTIFY', category: 'MEDIA', sub: 'Streaming Partner', logo: 'SPOT', desc: 'Curating soundtracks and music telemetry lists.', support: ['Music Night', 'Closing Awards Gala'], url: '#' }
            ];
            await Sponsor.insertMany(defaultSponsors);
            console.log(`[SEED] Seeded default alliances`);
        }
    } catch (err) {
        console.error(`[SEED ERROR] Failed to seed database: ${err.message}`);
    }
};

// Initialize server connection
const startServer = async () => {
    await connectDB();
    await seedDatabase();

    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
        console.log(`[SERVER] Addovedi API Server listening on port ${PORT}`);
    });
};

startServer();
