// client/src/data/crew.js — Centralized Personnel Database

export const FACULTY_CREW = [
    {
        id: 'FC01',
        name: 'Dr. Amit Rawat',
        role: 'CONVENER',
        avatarSeed: 'Amit',
        color: '#00E5FF',
        glow: 'rgba(0,229,255,0.4)',
        phone: '+91 98765 43201',
        email: 'amit.rawat@addovedi.org',
        linkedin: 'https://linkedin.com/',
        insta: 'https://instagram.com/',
        missions: ['Techfest Strategic Blueprinting', 'Department Integration Oversight']
    },
    {
        id: 'FC02',
        name: 'Dr. Shalini Vyas',
        role: 'CO-CONVENER',
        avatarSeed: 'Shalini',
        color: '#00E5FF',
        glow: 'rgba(0,229,255,0.4)',
        phone: '+91 98765 43202',
        email: 'shalini.vyas@addovedi.org',
        linkedin: 'https://linkedin.com/',
        insta: 'https://instagram.com/',
        missions: ['Academic & Technical Advisory', 'Curriculum Matching Oversight']
    },
    {
        id: 'FC03',
        name: 'Prof. Rajesh K. Patel',
        role: 'FACULTY ADVISOR',
        avatarSeed: 'Rajesh',
        color: '#9b5cff',
        glow: 'rgba(155,92,255,0.4)',
        phone: '+91 98765 43203',
        email: 'rajesh.patel@addovedi.org',
        linkedin: 'https://linkedin.com/',
        insta: 'https://instagram.com/',
        missions: ['Student Squad Guidance', 'Event Protocol Supervision']
    },
    {
        id: 'FC04',
        name: 'Dr. Neha Chaturvedi',
        role: 'FACULTY COORDINATOR',
        avatarSeed: 'NehaC',
        color: '#ff2cfb',
        glow: 'rgba(255,44,251,0.4)',
        phone: '+91 98765 43204',
        email: 'neha.chaturvedi@addovedi.org',
        linkedin: 'https://linkedin.com/',
        insta: 'https://instagram.com/',
        missions: ['Logistics & Venue Operations Coordination', 'Cross-Divisional Synchronization']
    }
];

export const STUDENT_SECTIONS = [
    {
        title: 'CHIEF HEAD',
        color: '#00E5FF',
        members: [
            {
                id: 'SC01',
                name: 'Aman Verma',
                role: 'CHIEF HEAD',
                avatarSeed: 'Aman',
                color: '#00E5FF',
                glow: 'rgba(0,229,255,0.4)',
                phone: '+91 91111 22201',
                email: 'aman.verma@addovedi.org',
                linkedin: 'https://linkedin.com/',
                insta: 'https://instagram.com/',
                missions: ['Overall Techfest Command', 'Led 46-member squadron', 'Strategic sponsor acquisition']
            }
        ]
    },
    {
        title: 'ASST. HEAD',
        color: '#00E5FF',
        members: [
            {
                id: 'SC02',
                name: 'Sneha Raj',
                role: 'ASST. HEAD',
                avatarSeed: 'Sneha',
                color: '#00E5FF',
                glow: 'rgba(0,229,255,0.4)',
                phone: '+91 91111 22202',
                email: 'sneha.raj@addovedi.org',
                linkedin: 'https://linkedin.com/',
                insta: 'https://instagram.com/',
                missions: ['Operations & Logistics supervision', 'Budget allocation & control', 'Direct wing coordination']
            }
        ]
    },
    {
        title: 'EVENT HEAD',
        color: '#9b5cff',
        members: [
            {
                id: 'SC03',
                name: 'Rahul Das',
                role: 'EVENT HEAD',
                avatarSeed: 'Rahul',
                color: '#9b5cff',
                glow: 'rgba(155,92,255,0.4)',
                phone: '+91 91111 22203',
                email: 'rahul.das@addovedi.org',
                linkedin: 'https://linkedin.com/',
                insta: 'https://instagram.com/',
                missions: ['Planned 25+ events', 'Strategic timeline management', 'Day-of execution overseer']
            }
        ]
    },
    {
        title: 'WEB HEAD',
        color: '#ff2cfb',
        members: [
            {
                id: 'SC04',
                name: 'Vaibhav Singh',
                role: 'WEB HEAD',
                avatarSeed: 'Vaibhav',
                color: '#ff2cfb',
                glow: 'rgba(255,44,251,0.4)',
                phone: '+91 91111 22204',
                email: 'vaibhav.singh@addovedi.org',
                linkedin: 'https://linkedin.com/',
                insta: 'https://instagram.com/',
                missions: ['Interactive 3D portal architect', 'UI System lead dev', 'Production build pipeline deployment']
            }
        ]
    },
    {
        title: 'DESIGN HEAD',
        color: '#ff2cfb',
        members: [
            {
                id: 'SC05',
                name: 'Neha Gupta',
                role: 'DESIGN HEAD',
                avatarSeed: 'NehaG',
                color: '#ff2cfb',
                glow: 'rgba(255,44,251,0.4)',
                phone: '+91 91111 22205',
                email: 'neha.gupta@addovedi.org',
                linkedin: 'https://linkedin.com/',
                insta: 'https://instagram.com/',
                missions: ['Techfest brand architecture', 'Hologram lobby styling asset designs', 'User experience system layout']
            }
        ]
    },
    {
        title: 'SPONSORS HEAD',
        color: '#ffd700',
        members: [
            {
                id: 'SC06',
                name: 'Harsh Vardhan',
                role: 'SPONSORS HEAD',
                avatarSeed: 'Harsh',
                color: '#ffd700',
                glow: 'rgba(255,215,0,0.4)',
                phone: '+91 91111 22206',
                email: 'harsh.v@addovedi.org',
                linkedin: 'https://linkedin.com/',
                insta: 'https://instagram.com/',
                missions: ['Corporate sponsor networking', 'Outreach deck presentation', 'MNC partnerships development']
            },
            {
                id: 'SC07',
                name: 'Ritika Sharma',
                role: 'SPONSORS HEAD',
                avatarSeed: 'Ritika',
                color: '#ffd700',
                glow: 'rgba(255,215,0,0.4)',
                phone: '+91 91111 22207',
                email: 'ritika.s@addovedi.org',
                linkedin: 'https://linkedin.com/',
                insta: 'https://instagram.com/',
                missions: ['Corporate sponsorship pipeline management', 'Cold call campaign management', 'Sponsor ROI reporting']
            },
            {
                id: 'SC08',
                name: 'Kiran Verma',
                role: 'SPONSORS HEAD',
                avatarSeed: 'Kiran',
                color: '#ffd700',
                glow: 'rgba(255,215,0,0.4)',
                phone: '+91 91111 22208',
                email: 'kiran.v@addovedi.org',
                linkedin: 'https://linkedin.com/',
                insta: 'https://instagram.com/',
                missions: ['Email outreach strategy execution', 'Brand partnership development', 'Budget negotiation control']
            }
        ]
    },
    {
        title: 'PR HEAD',
        color: '#ff9d00',
        members: [
            {
                id: 'SC09',
                name: 'Dev Sharma',
                role: 'PR HEAD',
                avatarSeed: 'Dev',
                color: '#ff9d00',
                glow: 'rgba(255,157,0,0.4)',
                phone: '+91 91111 22209',
                email: 'dev.sharma@addovedi.org',
                linkedin: 'https://linkedin.com/',
                insta: 'https://instagram.com/',
                missions: ['Outreach and media distribution', 'College collaborations', 'Press release dissemination']
            },
            {
                id: 'SC10',
                name: 'Tanya Singh',
                role: 'PR HEAD',
                avatarSeed: 'Tanya',
                color: '#ff9d00',
                glow: 'rgba(255,157,0,0.4)',
                phone: '+91 91111 22210',
                email: 'tanya.singh@addovedi.org',
                linkedin: 'https://linkedin.com/',
                insta: 'https://instagram.com/',
                missions: ['Influencer outreach campaigns', 'Social media platform coordination', 'Visitor response tracking']
            }
        ]
    },
    {
        title: 'DOCUMENTATION HEAD',
        color: '#2b5cff',
        members: [
            {
                id: 'SC11',
                name: 'Anika Roy',
                role: 'DOCUMENTATION HEAD',
                avatarSeed: 'Anika',
                color: '#2b5cff',
                glow: 'rgba(43,92,255,0.4)',
                phone: '+91 91111 22211',
                email: 'anika.roy@addovedi.org',
                linkedin: 'https://linkedin.com/',
                insta: 'https://instagram.com/',
                missions: ['Rulebook drafting and formatting', 'Participant data records management', 'Techfest archives collation']
            }
        ]
    },
    {
        title: 'FINANCE HEAD',
        color: '#1fff76',
        members: [
            {
                id: 'SC12',
                name: 'Aisha Khan',
                role: 'FINANCE HEAD',
                avatarSeed: 'Aisha',
                color: '#1fff76',
                glow: 'rgba(31,255,118,0.4)',
                phone: '+91 91111 22212',
                email: 'aisha.khan@addovedi.org',
                linkedin: 'https://linkedin.com/',
                insta: 'https://instagram.com/',
                missions: ['Managed ₹5L+ accounts', 'Audited vendor invoices', 'Cost optimization strategizer']
            }
        ]
    },
    {
        title: 'MERCHANDISE HEAD',
        color: '#ffd700',
        members: [
            {
                id: 'SC13',
                name: 'Rohan Mehta',
                role: 'MERCHANDISE HEAD',
                avatarSeed: 'Rohan',
                color: '#ffd700',
                glow: 'rgba(255,215,0,0.4)',
                phone: '+91 91111 22213',
                email: 'rohan.mehta@addovedi.org',
                linkedin: 'https://linkedin.com/',
                insta: 'https://instagram.com/',
                missions: ['Designed squadron hoodies & badges', 'Vendor negotiation & dispatch pipeline', 'Inventory logs management']
            },
            {
                id: 'SC14',
                name: 'Shruti Agarwal',
                role: 'MERCHANDISE HEAD',
                avatarSeed: 'Shruti',
                color: '#ffd700',
                glow: 'rgba(255,215,0,0.4)',
                phone: '+91 91111 22214',
                email: 'shruti.a@addovedi.org',
                linkedin: 'https://linkedin.com/',
                insta: 'https://instagram.com/',
                missions: ['Visual identity printing logistics', 'Stock distribution across divisions', 'Accounting of merch transactions']
            }
        ]
    },
    {
        title: 'DECORATION HEAD',
        color: '#9b5cff',
        members: [
            {
                id: 'SC15',
                name: 'Priya Nair',
                role: 'DECORATION HEAD',
                avatarSeed: 'Priya',
                color: '#9b5cff',
                glow: 'rgba(155,92,255,0.4)',
                phone: '+91 91111 22215',
                email: 'priya.nair@addovedi.org',
                linkedin: 'https://linkedin.com/',
                insta: 'https://instagram.com/',
                missions: ['Lobby physical setup layout design', 'Futuristic cyberpunk neon prop designs', 'Main arena visual decoration']
            },
            {
                id: 'SC16',
                name: 'Amit Joshi',
                role: 'DECORATION HEAD',
                avatarSeed: 'AmitJ',
                color: '#9b5cff',
                glow: 'rgba(155,92,255,0.4)',
                phone: '+91 91111 22216',
                email: 'amit.joshi@addovedi.org',
                linkedin: 'https://linkedin.com/',
                insta: 'https://instagram.com/',
                missions: ['Decoration supply chain manager', 'Setup coordinator on campus grounds', 'Neon illumination assembly']
            }
        ]
    },
    {
        title: 'VOLUNTEERS HEAD',
        color: '#1fff76',
        members: [
            {
                id: 'SC17',
                name: 'Akash Yadav',
                role: 'VOLUNTEERS HEAD',
                avatarSeed: 'Akash',
                color: '#1fff76',
                glow: 'rgba(31,255,118,0.4)',
                phone: '+91 91111 22217',
                email: 'akash.yadav@addovedi.org',
                linkedin: 'https://linkedin.com/',
                insta: 'https://instagram.com/',
                missions: ['Enlisted 100+ volunteers', 'Strategic sector delegation mapping', 'Live briefing & crowd control']
            }
        ]
    },
    {
        title: 'MANAGEMENT HEAD',
        color: '#ff9d00',
        members: [
            {
                id: 'SC18',
                name: 'Siddharth Roy',
                role: 'MANAGEMENT HEAD',
                avatarSeed: 'Siddharth',
                color: '#ff9d00',
                glow: 'rgba(255,157,0,0.4)',
                phone: '+91 91111 22218',
                email: 'siddharth.roy@addovedi.org',
                linkedin: 'https://linkedin.com/',
                insta: 'https://instagram.com/',
                missions: ['Overarching event administration', 'Inter-departmental pipeline sync', 'Grievance redressal logs']
            },
            {
                id: 'SC19',
                name: 'Pooja Sharma',
                role: 'MANAGEMENT HEAD',
                avatarSeed: 'Pooja',
                color: '#ff9d00',
                glow: 'rgba(255,157,0,0.4)',
                phone: '+91 91111 22219',
                email: 'pooja.sharma@addovedi.org',
                linkedin: 'https://linkedin.com/',
                insta: 'https://instagram.com/',
                missions: ['Hospitality scheduling supervision', 'Registration assistance coordination', 'Feedback survey reporting']
            }
        ]
    }
];
