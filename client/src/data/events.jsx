// client/src/data/events.jsx — Centralized Event Database & Rulebook

export const slugify = (text) => {
    if (!text) return '';
    return text
        .toLowerCase()
        .replace(/&/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
};

export const GENERAL_RULES = [
    'Participants must bring valid university identity credentials.',
    'Strict adherence to schedule timelines is mandatory.',
    'Decision of the judges and coordinators is final.',
    'Certificates will be distributed to verified teams only.'
];

// NESTED MASTER DATA HIERARCHY
// Categories -> Events -> rules, coordinators, and timeline details.
export const CATEGORIES_WITH_EVENTS = [
    {
        title: 'ROBOTICS & RC',
        subtitle: 'AUTONOMOUS MOTORS',
        desc: 'Race high-speed RC cars and program precise line followers.',
        color: '#00d9ff',
        xp: '8,000 XP',
        difficulty: 'ELITE',
        iconType: 'robot',
        events: [
            {
                title: 'LINE RUNNER',
                subtitle: 'INFRARED ACCELERATION',
                desc: 'Design line followers that lock onto grid courses in record time.',
                xp: '2,500 XP',
                difficulty: 'MEDIUM',
                heads: [
                    { name: 'Simran Kaur', phone: '+91 92345 67890' },
                    { name: 'Shreya Nair', phone: '+91 96789 01234' }
                ],
                rules: [
                    'Bot must trace the line strictly on arena floor.',
                    'Calibration time is limited to 5 minutes prior to run.',
                    'Bonus checkpoints award additional scores.',
                    'Leaving the trace line triggers a restart penalty.',
                    'Bots must be fully autonomous; wireless transceivers must be disabled.',
                    'The track width will be exactly 30mm black line on white surface.',
                    'Maximum bot size is limited to 15x15 cm.',
                    'No sticky materials or adhesives allowed on the wheels.',
                    'The track will feature sharp turns, acute angles, and a grid intersection.',
                    'Each bot gets a maximum of 2 official timed attempts.',
                    'Fastest complete loop run determines the winner.'
                ],
                iconType: 'line',
                timeline: {
                    day: 1,
                    time: '13:00',
                    end: '15:00',
                    venue: 'Lab Alpha',
                    mode: 'Team (2)',
                    registered: 60,
                    prize: '₹10,000'
                }
            },
            {
                title: 'DRONE PILOT',
                subtitle: 'AERIAL ACCELERATOR',
                desc: 'Fly precision micro drones through complex vertical ring gates.',
                xp: '3,500 XP',
                difficulty: 'HARD',
                heads: [
                    { name: 'Akash Yadav', phone: '+91 94567 89012' },
                    { name: 'Gaurav Sharma', phone: '+91 93456 78901' }
                ],
                rules: [
                    'Fly drone through 3D obstacle ring course.',
                    'Manual piloting strictly required, no GPS lock.',
                    'Time begins on takeoff and ends on landing pad touch.',
                    'Crashing or ring skips add penalty seconds.',
                    'Drones must fit within a 250mm diagonal wheel-base class.',
                    'First-person view (FPV) goggles or line-of-sight flying is allowed.',
                    'All prop guards must be securely mounted and inspected.',
                    'Battery size limit is capped at 4S LiPo batteries.',
                    'Skips on consecutive obstacle gates will lead to disqualification.',
                    'Pilots must use standard analog or digital video links on authorized bands.',
                    'In case of tie, pilot with fewer crash restarts wins.'
                ],
                iconType: 'drone',
                timeline: {
                    day: 2,
                    time: '08:00',
                    end: '10:00',
                    venue: 'Rooftop A',
                    mode: 'Team (2)',
                    registered: 44,
                    prize: '₹20,000'
                }
            },
            {
                title: 'ROBO WARS',
                subtitle: 'COMBAT ARENA',
                desc: 'Destroy opponents in a steel-caged combat arena showdown.',
                xp: '4,000 XP',
                difficulty: 'ELITE',
                heads: [
                    { name: 'Akash Yadav', phone: '+91 94567 89012' },
                    { name: 'Mohit Jain', phone: '+91 95678 90123' }
                ],
                rules: [
                    'Robots must fit within standard 30x30x30 cm boundaries.',
                    'Weight class: strictly under 5.0 kg.',
                    'Combat duration: 3 minutes per round.',
                    'No projectile or liquid weapons allowed.',
                    'Pneumatic and hydraulic systems are capped at 10 Bar pressure.',
                    'Remote control must operate on standard 2.4GHz interference-free bands.',
                    'All robots must have an accessible master kill switch.',
                    'Arena walls must not be intentionally damaged by weapon systems.',
                    'Decisions are based on aggression, damage, and control if time expires.',
                    'Battery packs must be securely shielded from direct kinetic impacts.',
                    'Violation of safety checks during inspection leads to immediate disqualification.'
                ],
                iconType: 'robot',
                timeline: {
                    day: 3,
                    time: '09:00',
                    end: '11:00',
                    venue: 'Lab Alpha',
                    mode: 'Team (4)',
                    registered: 32,
                    prize: '₹15,000'
                }
            }
        ]
    },
    {
        title: 'CODING QUEST',
        subtitle: 'ALGORITHMIC WARFARE',
        desc: 'Join high-speed hackathons and optimize code structures.',
        color: '#ff1f4f',
        xp: '5,000 XP',
        difficulty: 'HARD',
        iconType: 'code',
        events: [
            {
                title: 'BUG HUNT',
                subtitle: 'DIAGNOSTICS & DEBUGGING',
                desc: 'Scan code segments and patch hidden compiler bugs under pressure.',
                xp: '1,500 XP',
                difficulty: 'MEDIUM',
                heads: [
                    { name: 'Vaibhav Singh', phone: '+91 98765 43210' },
                    { name: 'Karan Patel', phone: '+91 87654 32109' }
                ],
                rules: [
                    'Each team will get 10 bugged code segments to patch.',
                    'Languages supported: C, C++, Java, and Python.',
                    'Time limit: 60 minutes.',
                    'Patched codes must pass all hidden unit test cases.',
                    'No external compilers or IDEs are permitted; must use the sandbox terminal.',
                    'Internet access is restricted to official documentation pages.',
                    'Submission can be done multiple times, but only the last one counts.',
                    'Sharing solutions or collaboration between different teams will result in instant disqualification.',
                    'Pre-written code snippets or external libraries cannot be imported.',
                    'Final scores will be compiled automatically based on execution speed and memory limits.',
                    'Decisions of the evaluation panel are absolute and final.'
                ],
                iconType: 'bug',
                timeline: {
                    day: 1,
                    time: '09:30',
                    end: '11:00',
                    venue: 'Lab Beta',
                    mode: 'Solo',
                    registered: 96,
                    prize: '₹10,000'
                }
            },
            {
                title: 'BYTE CODE',
                subtitle: 'ALGORITHMS & SPEED',
                desc: 'Crack algorithmic constraints and design time-optimal data models.',
                xp: '2,500 XP',
                difficulty: 'HARD',
                heads: [
                    { name: 'Priya Nair', phone: '+91 76543 21098' },
                    { name: 'Siddharth Roy', phone: '+91 65432 10987' }
                ],
                rules: [
                    'Standard algorithmic competitive programming contest.',
                    'Individual participation only.',
                    'Penalties apply for incorrect submissions.',
                    'Rankings determined by score and completion speed.',
                    'The platform supports Python 3.x, C++17, and Java 17.',
                    'Plagiarism checks will be conducted post-event on all submissions.',
                    'In case of identical submission times, the participant with fewer penalties ranks higher.',
                    'No external communication devices or messaging platforms are allowed during the run.',
                    'System resources are capped at 512MB RAM per sandbox compiler execution.',
                    'All challenges will have subtask scoring enabled.',
                    'Unusual network patterns will trigger automated session lockout.'
                ],
                iconType: 'code',
                timeline: {
                    day: 1,
                    time: '12:00',
                    end: '14:00',
                    venue: 'Lab Beta',
                    mode: 'Solo',
                    registered: 112,
                    prize: '₹12,000'
                }
            },
            {
                title: 'WEB CRAFT',
                subtitle: 'DASHBOARD INTERFACES',
                desc: 'Design beautiful, responsive game visual overlay terminals.',
                xp: '3,000 XP',
                difficulty: 'ELITE',
                heads: [
                    { name: 'Vaibhav Singh', phone: '+91 98765 43210' },
                    { name: 'Neha Gupta', phone: '+91 54321 09876' }
                ],
                rules: [
                    'Develop a responsive front-end landing page from wireframes.',
                    'Allowed stacks: Vanilla React, TailwindCSS, or plain HTML/CSS.',
                    'Design components must be clean and responsive.',
                    'Submit the repository link before time-limit.',
                    'External assets must be hosted on public CDNs or included locally.',
                    'Layouts will be tested across Chrome, Firefox, and Safari viewports.',
                    'Use of UI component libraries like shadcn or Material UI is prohibited.',
                    'Codebase must be documented with brief component-level instructions.',
                    'Vite should be used as the build tool for React submissions.',
                    'Design fidelity to the provided Figma wireframe counts for 40% of marks.',
                    'No AI code generation tools are permitted during active building phases.'
                ],
                iconType: 'web',
                timeline: {
                    day: 2,
                    time: '09:00',
                    end: '13:00',
                    venue: 'Lab Beta',
                    mode: 'Team (4)',
                    registered: 80,
                    prize: '₹25,000'
                }
            }
        ]
    },
    {
        title: 'ELECTRICAL GUILD',
        subtitle: 'CIRCUIT DEBUGGING',
        desc: 'Master breadboard wiring, logic gates, and analog designs.',
        color: '#ff9d00',
        xp: '6,500 XP',
        difficulty: 'MEDIUM',
        iconType: 'bolt',
        events: [
            {
                title: 'LOGIC QUEST',
                subtitle: 'TRUTH TABLES & CIRCUITS',
                desc: 'Build gate systems and resolve high-frequency signals.',
                xp: '2,000 XP',
                difficulty: 'MEDIUM',
                heads: [
                    { name: 'Karan Patel', phone: '+91 87654 32109' },
                    { name: 'Arjun Kumar', phone: '+91 91234 56789' }
                ],
                rules: [
                    'Solve 15 core digital logic design problems.',
                    'Use of simulators is allowed for validation.',
                    'Submit schematic diagrams alongside truth tables.',
                    'Ties broken by overall logic minimization efficiency.',
                    'Allowed simulators: Logisim-evolution, Digital, or Multisim.',
                    'All truth tables must be completed in standard SOP form.',
                    'Gates must conform to standard IEEE schematic symbols.',
                    'Late submissions face a penalty of 10% score reduction per 5 minutes.',
                    'Group discussions are strictly disallowed during problem solving.',
                    'Hardware description language (Verilog/VHDL) code must compile without warnings.',
                    'Only standard library components can be used in schematic designs.'
                ],
                iconType: 'bolt',
                timeline: {
                    day: 1,
                    time: '10:30',
                    end: '12:00',
                    venue: 'Sigma Hall',
                    mode: 'Solo',
                    registered: 80,
                    prize: '₹8,000'
                }
            },
            {
                title: 'MAZE RUNNER',
                subtitle: 'AUTONOMOUS PCB BOARDS',
                desc: 'Program microcontrollers to solve breadboard electrical mazes.',
                xp: '3,000 XP',
                difficulty: 'HARD',
                heads: [
                    { name: 'Simran Kaur', phone: '+91 92345 67890' },
                    { name: 'Gaurav Sharma', phone: '+91 93456 78901' }
                ],
                rules: [
                    'Configure microcontrollers to navigate a dynamic physical grid.',
                    'Sensors must detect wall proximity within 2cm tolerances.',
                    'Max 3 trial runs allowed per robot build.',
                    'Fastest escape time secures the win.',
                    'Microcontroller must be programmed on-board, no wireless control allowed.',
                    'Chassis size must not exceed 20x20 cm footprint.',
                    'Power source is limited to a maximum of 12V DC.',
                    'The maze configuration will be altered slightly before each official run.',
                    'Manual intervention during an active run results in run cancellation.',
                    'Infrared or Ultrasonic sensor calibration must be done in the designated pit area.',
                    'Ties will be broken by the robot weight (lighter robot wins).'
                ],
                iconType: 'bolt',
                timeline: {
                    day: 2,
                    time: '13:00',
                    end: '15:00',
                    venue: 'Sigma Hall',
                    mode: 'Solo',
                    registered: 45,
                    prize: '₹12,000'
                }
            }
        ]
    },
    {
        title: 'GAMING ARENA',
        subtitle: 'ESPORTS SHOWDOWN',
        desc: 'Compete in Valorant, BGMI, and FIFA college tournaments.',
        color: '#9b5cff',
        xp: '6,000 XP',
        difficulty: 'HARD',
        iconType: 'gamepad',
        events: [
            {
                title: 'BGMI CRUCIBLE',
                subtitle: 'SURVIVAL BR',
                desc: 'Drop in teams, clear hostile drops, and survive the gaming circle.',
                xp: '2,500 XP',
                difficulty: 'MEDIUM',
                heads: [
                    { name: 'Sneha Raj', phone: '+91 77777 66666' },
                    { name: 'Pooja Sharma', phone: '+91 66666 55555' }
                ],
                rules: [
                    'Standard squad-based battle royale matches.',
                    'Points calculated by placing position and kill points.',
                    'Tablet/phone controllers only, no emulators.',
                    'Device logs may be audited post-match.',
                    'Matches will be hosted on Erangel, Miramar, and Sanhok maps.',
                    'Use of triggers, trigger buttons, or custom cooling attachments is prohibited.',
                    'Any disconnects due to personal internet issues will not trigger a match restart.',
                    'Stream sniping or screen sharing is strictly forbidden.',
                    'Teams must consist of exactly 4 players plus 1 optional sub.',
                    'Tie-breakers will favor the team with higher total placement points.',
                    'Decisions of the match marshals are final and non-negotiable.'
                ],
                iconType: 'gamepad',
                timeline: {
                    day: 1,
                    time: '10:00',
                    end: '12:00',
                    venue: 'Arena Omega',
                    mode: 'Squad (4)',
                    registered: 64,
                    prize: '₹20,000'
                }
            },
            {
                title: 'FIFA PRO',
                subtitle: '1V1 ESPORTS',
                desc: 'Compete in high-frequency bracket matches on console screens.',
                xp: '2,000 XP',
                difficulty: 'MEDIUM',
                heads: [
                    { name: 'Amit Joshi', phone: '+91 55555 44444' },
                    { name: 'Rohit Verma', phone: '+91 44444 33333' }
                ],
                rules: [
                    'Standard 1v1 console matches (PlayStation 5).',
                    'Match duration: 6 minutes per half.',
                    'Custom tactical formations are allowed.',
                    'In case of draw, matches go to extra time and penalties.',
                    'All matches will be played in Kick-Off mode using standard teams.',
                    'Wireless controller configurations must be checked before kickoff.',
                    'Pausing is only allowed when the ball is out of play.',
                    'Intentional time-wasting in defense will lead to warnings.',
                    'Peripherals must be connected via USB cable to prevent sync lag.',
                    'Tactical defending mode must be turned ON.',
                    'Legacy defending settings are strictly disallowed.'
                ],
                iconType: 'gamepad',
                timeline: {
                    day: 1,
                    time: '16:00',
                    end: '18:00',
                    venue: 'Arena Omega',
                    mode: 'Solo',
                    registered: 88,
                    prize: '₹15,000'
                }
            },
            {
                title: 'VALORANT',
                subtitle: '5V5 SEARCH & DESTROY',
                desc: 'Coordinate agent tactics on stage screens for gaming domination.',
                xp: '3,000 XP',
                difficulty: 'HARD',
                heads: [
                    { name: 'Aman Verma', phone: '+91 99999 88888' },
                    { name: 'Rahul Das', phone: '+91 88888 77777' }
                ],
                rules: [
                    'Standard 5v5 Tactical Shooter double-elimination tournament.',
                    'Tournament rules: strictly competitive settings.',
                    'No external macros, exploits, or cheating allowed.',
                    'Map pools will be decided prior to matches.',
                    'All matches will be played on Mumbai servers.',
                    'Teams must check-in at least 15 minutes before scheduled match.',
                    'Tactical timeouts are limited to two 60-second pauses per map.',
                    'Use of in-game chat for toxic behavior will lead to warnings or match loss.',
                    'Players must bring their own gaming peripherals (mouse/keyboard/headset).',
                    'Coaches are only allowed to talk during tactical timeouts.',
                    'Substitute players must be registered before the tournament begins.'
                ],
                iconType: 'gamepad',
                timeline: {
                    day: 2,
                    time: '10:00',
                    end: '13:00',
                    venue: 'Arena Omega',
                    mode: 'Squad (5)',
                    registered: 50,
                    prize: '₹25,000'
                }
            }
        ]
    },
    {
        title: 'CREATIVE & DESIGN',
        subtitle: 'STRUCTURE & CLAY',
        desc: 'Build structural bridges, throw pottery, and exhibit fine arts.',
        color: '#1fff76',
        xp: '4,500 XP',
        difficulty: 'EASY',
        iconType: 'clay',
        events: [
            {
                title: 'POTTERY ART',
                subtitle: 'CLAY VISIONS',
                desc: 'Sculpt customized pots on motorized spinning potter wheels.',
                xp: '1,000 XP',
                difficulty: 'EASY',
                heads: [
                    { name: 'Shruti Agarwal', phone: '+91 88901 23456' },
                    { name: 'Meera Patel', phone: '+91 77890 12345' }
                ],
                rules: [
                    'Create clay pottery models based on theme given.',
                    'Time allocated: 90 minutes.',
                    'Clays and wheels provided at workstation.',
                    'Judged on aesthetics, symmetry, and finish.',
                    'Maximum height of the model must be under 30 cm.',
                    'Only tools provided by the coordinators are allowed.',
                    'Participants can choose between hand-building or wheel-throwing.',
                    'Cracked structures during drying will lose points on structural integrity.',
                    'No external paints or coloring agents can be used.',
                    'Originality and interpretation of the theme carries 40% weight.',
                    'Coordinators will bake the pieces for final inspection.'
                ],
                iconType: 'clay',
                timeline: {
                    day: 1,
                    time: '15:00',
                    end: '17:00',
                    venue: 'Studio Gamma',
                    mode: 'Solo',
                    registered: 40,
                    prize: '₹5,000'
                }
            },
            {
                title: 'TRUSS BUILD',
                subtitle: 'BALSA WOOD BRIDGES',
                desc: 'Glue together truss bridges and load test them to the absolute break limit.',
                xp: '1,800 XP',
                difficulty: 'MEDIUM',
                heads: [
                    { name: 'Harsh Kapoor', phone: '+91 97890 12345' },
                    { name: 'Ritika Sharma', phone: '+91 99012 34567' }
                ],
                rules: [
                    'Design bridge structures using wood sticks and glues.',
                    'Dimensions must conform to blueprints.',
                    'Bridge is loaded weights until structural failure occurs.',
                    'Winner chosen by highest load-to-weight ratio.',
                    'Materials provided: 100 popsicle sticks and standard wood glue.',
                    'Span of the bridge must be exactly 400mm.',
                    'Bridges must allow a load hanger to be attached at the center.',
                    'Glue can only be used at joints, coating sticks is not allowed.',
                    'Maximum weight of the completed structure must not exceed 150g.',
                    'Bridges will dry in a designated curing chamber for 12 hours.',
                    'All dimensions will be verified using go/no-go gauges prior to loading.'
                ],
                iconType: 'bridge',
                timeline: {
                    day: 2,
                    time: '11:00',
                    end: '13:00',
                    venue: 'Open Court',
                    mode: 'Team (3)',
                    registered: 36,
                    prize: '₹8,000'
                }
            },
            {
                title: 'PROPEL',
                subtitle: 'PNEUMATIC PROPULSION',
                desc: 'Assemble model rockets and launch them high using air-pressure pumps.',
                xp: '1,200 XP',
                difficulty: 'EASY',
                heads: [
                    { name: 'Harsh Kapoor', phone: '+91 97890 12345' },
                    { name: 'Kiran Verma', phone: '+91 91111 22208' }
                ],
                rules: [
                    'Build model aircraft using balsa wood / composite material.',
                    'Maximum wingspan: 1.2 meters.',
                    'Evaluation based on flight duration and glider ratio.',
                    'Structural integrity inspection prior to takeoff.',
                    'Aircraft must be unpowered (pure glider) or rubber-band powered.',
                    'Use of ready-made foam planes or commercial kits is prohibited.',
                    'Launch must be done manually from the designated platform.',
                    'Maximum takeoff weight must be under 800 grams.',
                    'Aircraft must demonstrate stable flight for at least 5 seconds to score.',
                    'Repairing models between rounds is allowed within 10 minutes.',
                    'Judges base extra points on structural innovation and aerodynamic efficiency.'
                ],
                iconType: 'rocket',
                timeline: {
                    day: 3,
                    time: '13:00',
                    end: '15:00',
                    venue: 'Open Court',
                    mode: 'Solo',
                    registered: 50,
                    prize: '₹6,000'
                }
            }
        ]
    },
    {
        title: 'AI & DATA SCIENCE',
        subtitle: 'NEURAL CONSTRUCTS',
        desc: 'Train reinforcement agents and design deep learning models.',
        color: '#2b5cff',
        xp: '7,000 XP',
        difficulty: 'HARD',
        iconType: 'brain',
        events: [
            {
                title: 'MACHINE INTELLIGENCE',
                subtitle: 'NEURAL NETWORKS & TELEMETRY',
                desc: 'Solve deep learning model matrices and run predictive simulations.',
                xp: '3,500 XP',
                difficulty: 'HARD',
                heads: [
                    { name: 'Priya Nair', phone: '+91 91111 22215' },
                    { name: 'Arjun Kumar', phone: '+91 91234 56789' }
                ],
                rules: [
                    'Train and deploy machine learning models to solve real-world datasets.',
                    'Execution outputs must use optimized algorithms.'
                ],
                iconType: 'brain',
                timeline: {
                    day: 1,
                    time: '14:00',
                    end: '16:00',
                    venue: 'Hub Delta',
                    mode: 'Team (3)',
                    registered: 72,
                    prize: '₹18,000'
                }
            },
            {
                title: 'NEURAL HACK',
                subtitle: 'TRANSFORMER TUNING',
                desc: 'Optimize custom transformers and train computer vision parameters.',
                xp: '2,800 XP',
                difficulty: 'MEDIUM',
                heads: [
                    { name: 'Siddharth Roy', phone: '+91 91111 22218' },
                    { name: 'Neha Gupta', phone: '+91 91111 22205' }
                ],
                rules: [
                    'Transformer tuning configurations must run locally in provided test kernels.',
                    'Only standard libraries are preloaded.'
                ],
                iconType: 'brain',
                timeline: {
                    day: 2,
                    time: '10:30',
                    end: '12:30',
                    venue: 'Hub Delta',
                    mode: 'Solo',
                    registered: 60,
                    prize: 'Certificate'
                }
            }
        ]
    },
    {
        title: 'WORKSHOP LAB',
        subtitle: 'KINETIC HARDWARE',
        desc: 'Operate industrial metalworks and build hardware machinery.',
        color: '#ffea00',
        xp: '5,500 XP',
        difficulty: 'MEDIUM',
        iconType: 'gear',
        events: [
            {
                title: 'KINETIC METALWORKS',
                subtitle: 'HARDWARE MACHINERY',
                desc: 'Cut and construct architectural rigs using industrial lathe tools.',
                xp: '2,600 XP',
                difficulty: 'HARD',
                heads: [
                    { name: 'Rohan Mehta', phone: '+91 91111 22213' },
                    { name: 'Aisha Khan', phone: '+91 91111 22212' }
                ],
                rules: [
                    'Industrial metalworks and hardware assembly under time limits.',
                    'Safety protocols must be worn at all times.'
                ],
                iconType: 'gear',
                timeline: {
                    day: 2,
                    time: '13:00',
                    end: '15:00',
                    venue: 'Workshop Bay',
                    mode: 'Team (2)',
                    registered: 28,
                    prize: '₹10,000'
                }
            },
            {
                title: 'CAD BLUEPRINTS',
                subtitle: 'SOLID MODELLING',
                desc: 'Render complex 3D hardware schematics and mechanical parts.',
                xp: '2,200 XP',
                difficulty: 'MEDIUM',
                heads: [
                    { name: 'Divya Menon', phone: '+91 77665 54433' },
                    { name: 'Tanya Singh', phone: '+91 91111 22210' }
                ],
                rules: [
                    'Render complex 3D hardware schematics and mechanical parts.',
                    'Use standard constraint constraints.'
                ],
                iconType: 'gear',
                timeline: {
                    day: 3,
                    time: '11:00',
                    end: '13:00',
                    venue: 'Workshop Bay',
                    mode: 'Solo',
                    registered: 40,
                    prize: '₹8,000'
                }
            }
        ]
    },
    // Special timeline-only category to represent extra system-wide events
    {
        title: 'CULTURAL & OTHER',
        timelineOnly: true,
        events: [
            {
                title: 'MUSIC NIGHT',
                subtitle: 'CULTURAL SHOW',
                desc: 'Open-stage music performances — any genre, any instrument, any vibe.',
                category: 'Cultural',
                color: '#ff2cfb',
                xp: '0 XP',
                difficulty: 'EASY',
                heads: [
                    { name: 'Nikhil Bose', phone: '+91 92345 67890' },
                    { name: 'Rohit Verma', phone: '+91 44444 33333' }
                ],
                iconType: 'music',
                timeline: {
                    day: 2,
                    time: '17:00',
                    end: '20:00',
                    venue: 'Main Stage',
                    mode: 'Solo',
                    registered: 55,
                    prize: '₹12,000'
                }
            },
            {
                title: 'CLOSING GALA',
                subtitle: 'AWARDS NIGHT',
                desc: 'Prize distribution, performances, and the grand finale of Addovedi 2026.',
                category: 'Cultural',
                color: '#ff2cfb',
                xp: '0 XP',
                difficulty: 'EASY',
                heads: [
                    { name: 'Aman Verma', phone: '+91 99999 88888' },
                    { name: 'Sneha Raj', phone: '+91 77777 66666' }
                ],
                iconType: 'music',
                timeline: {
                    day: 3,
                    time: '18:00',
                    end: '21:00',
                    venue: 'Main Stage',
                    mode: 'Open',
                    registered: 500,
                    prize: 'Trophies'
                }
            }
        ]
    }
];

// Helper mapping for Category SVG Icons in Lobby Console Cards
function getSvgIcon(type, color) {
    switch (type) {
        case 'robot':
            return (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="10" rx="2"></rect>
                    <circle cx="12" cy="5" r="2"></circle>
                    <path d="M12 7v4M8 15h.01M16 15h.01"></path>
                </svg>
            );
        case 'bolt':
            return (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                </svg>
            );
        case 'gamepad':
            return (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="6" width="20" height="12" rx="2"></rect>
                    <path d="M12 12h.01M16 10h.01M16 14h.01M6 12h4M8 10v4"></path>
                </svg>
            );
        case 'bug':
            return (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="10" rx="2"></rect>
                    <path d="M12 2v2M5 5l1.5 1.5M19 5l-1.5 1.5M6 14h12M6 17h12"></path>
                </svg>
            );
        case 'code':
            return (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 18 22 12 16 6"></polyline>
                    <polyline points="8 6 2 12 8 18"></polyline>
                    <line x1="14" y1="4" x2="10" y2="20"></line>
                </svg>
            );
        case 'web':
            return (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                    <polyline points="2 17 12 22 22 17"></polyline>
                    <polyline points="2 12 12 17 22 12"></polyline>
                </svg>
            );
        case 'brain':
            return (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                    <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                </svg>
            );
        case 'clay':
            return (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
            );
        case 'bridge':
            return (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="20" x2="18" y2="10"></line>
                    <line x1="12" y1="20" x2="12" y2="4"></line>
                    <line x1="6" y1="20" x2="6" y2="14"></line>
                </svg>
            );
        case 'rocket':
            return (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4.5 16.5c-1.5 1.25-2.5 3.5-2.5 3.5s2.25-1 3.5-2.5L17.5 5.5a2.12 2.12 0 1 0-3-3L4.5 16.5z"></path>
                </svg>
            );
        case 'gear':
        default:
            return (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6"></path>
                </svg>
            );
    }
}

// PROGRAMMATIC EXPORTS MAPPING
// Generate the flat arrays and dictionary shapes required by external templates.

export const CARD_DATA = CATEGORIES_WITH_EVENTS
    .filter(cat => !cat.timelineOnly)
    .map(cat => ({
        title: cat.title,
        subtitle: cat.subtitle,
        desc: cat.desc,
        color: cat.color,
        xp: cat.xp,
        difficulty: cat.difficulty,
        icon: (color) => getSvgIcon(cat.iconType, color)
    }));

export const SUB_EVENTS = {};
CATEGORIES_WITH_EVENTS.forEach(cat => {
    if (!cat.timelineOnly) {
        SUB_EVENTS[cat.title] = cat.events.map(ev => ({
            title: ev.title,
            subtitle: ev.subtitle,
            desc: ev.desc,
            color: ev.color || cat.color,
            xp: ev.xp,
            difficulty: ev.difficulty,
            heads: ev.heads,
            icon: (color) => getSvgIcon(ev.iconType || cat.iconType, color),
            venue: ev.timeline?.venue || 'Main Arena',
            mode: ev.timeline?.mode || 'Solo',
            registered: ev.timeline?.registered || 0,
            prize: ev.timeline?.prize || 'Trophies',
            time: ev.timeline?.time || null,
            end: ev.timeline?.end || null
        }));
    }
});

export const EVENT_COORDINATORS = {};
CATEGORIES_WITH_EVENTS.forEach(cat => {
    cat.events.forEach(ev => {
        EVENT_COORDINATORS[ev.title.toUpperCase()] = ev.heads;
    });
});

export const EVENT_RULES = {};
CATEGORIES_WITH_EVENTS.forEach(cat => {
    cat.events.forEach(ev => {
        if (ev.rules && ev.rules.length > 0) {
            EVENT_RULES[slugify(ev.title)] = ev.rules;
        }
    });
});

export const DAYS = [
    { slot: 'SLOT 01', label: 'DAY 1', date: 'Sep 12', color: '#00E5FF', events: [] },
    { slot: 'SLOT 02', label: 'DAY 2', date: 'Sep 13', color: '#7A5CFF', events: [] },
    { slot: 'SLOT 03', label: 'DAY 3', date: 'Sep 14', color: '#FF2CFB', events: [] }
];

CATEGORIES_WITH_EVENTS.forEach(cat => {
    cat.events.forEach(ev => {
        if (ev.timeline && ev.timeline.day >= 1 && ev.timeline.day <= 3) {
            DAYS[ev.timeline.day - 1].events.push({
                id: slugify(ev.title),
                title: ev.title,
                subtitle: ev.subtitle,
                category: ev.category || cat.title.replace(' & RC', '').replace(' & CS', '').replace('QUEST', '').replace('GUILD', '').replace('ARENA', '').replace(' & DESIGN', '').replace(' & DATA SCIENCE', '').trim(),
                time: ev.timeline.time,
                end: ev.timeline.end,
                venue: ev.timeline.venue || 'Main Arena',
                mode: ev.timeline.mode || 'Solo',
                registered: ev.timeline.registered || 0,
                prize: ev.timeline.prize || 'Trophies',
                desc: ev.desc
            });
        }
    });
});

// Sort events chronologically on each day
DAYS.forEach(day => {
    day.events.sort((a, b) => a.time.localeCompare(b.time));
});
