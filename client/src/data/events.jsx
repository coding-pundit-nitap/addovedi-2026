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
// Categories -> Events -> overview, rules, coordinators, and timeline details.
// Source: EVENT DETAILS.docx (Addovedi 2026). Rules, coordinators and schedule are added later
// from Admin. Mirrors server/scripts/data/events2026.json (used by seedEvents.js).
export const CATEGORIES_WITH_EVENTS = [
    {
        "title": "ROBOTICS PROTOCOL",
        "subtitle": "AUTONOMOUS MECHA DYNAMICS",
        "desc": "Design, build and drive your own robots in head-to-head robotics challenges open to every branch.",
        "color": "#00d9ff",
        "iconType": "robot",
        "modelType": "mecha",
        "shortName": "Robotics",
        "iconChar": "🤖",
        "xp": "5,000 XP",
        "difficulty": "MEDIUM",
        "id": "01",
        "events": [
            {
                "title": "ROBO SOCCER",
                "subtitle": "Where Robotics Meets the Spirit of Football!",
                "desc": "Robo Soccer is an exciting robotics competition where teams design, build, and control their own robots to compete in a fast-paced football match. The objective is simple—use your robot's speed, strength, precision, and strategy to outplay the opponent and score the maximum number of goals.",
                "overview": "Robo Soccer is an exciting robotics competition where teams design, build, and control their own robots to compete in a fast-paced football match. The objective is simple—use your robot's speed, strength, precision, and strategy to outplay the opponent and score the maximum number of goals.\n\nParticipants will put their engineering skills to the test by developing a robust and efficient robot capable of maneuvering across the arena, controlling the ball, defending the goal, and attacking the opponent. Every match demands a perfect combination of mechanical design, electronics, control systems, teamwork, and strategy.\n\nGet ready to enter the arena, control your machine, defend your territory, and fight for victory!",
                "xp": "1,500 XP",
                "difficulty": "MEDIUM",
                "iconType": "robot",
                "heads": [],
                "rules": []
            },
            {
                "title": "DUNE DOMINATOR",
                "subtitle": "Conquer the Terrain. Command the Machine",
                "desc": "Dune Dominator is an exciting off-road robotics challenge where teams design and build a powerful rover capable of conquering a challenging sandy terrain with carry sand on it. The competition tests the robot's mechanical strength, mobility, stability, control, and endurance as it navigates through obstacles, slopes, uneven surfaces, and difficult terrain.",
                "overview": "Dune Dominator is an exciting off-road robotics challenge where teams design and build a powerful rover capable of conquering a challenging sandy terrain with carry sand on it. The competition tests the robot's mechanical strength, mobility, stability, control, and endurance as it navigates through obstacles, slopes, uneven surfaces, and difficult terrain.\n\nTeams must engineer their rover to overcome every challenge with speed, precision, and reliability. From wheel and suspension design to motor control and overall stability, every engineering decision can make the difference between getting stuck and conquering the course.\n\nPrepare your machine, take control, and dominate the dunes!",
                "xp": "1,500 XP",
                "difficulty": "MEDIUM",
                "iconType": "robot",
                "heads": [],
                "rules": []
            }
        ]
    },
    {
        "title": "FUN ARENA",
        "subtitle": "COMMON EVENTS",
        "desc": "Puzzles, clues and adventure for everyone who just wants to enjoy the fest.",
        "color": "#ffb800",
        "iconType": "brain",
        "modelType": "clock",
        "shortName": "Fun",
        "iconChar": "🧩",
        "xp": "5,000 XP",
        "difficulty": "MEDIUM",
        "id": "02",
        "events": [
            {
                "title": "TREASURE HUNT",
                "subtitle": "The Hunt Begins. Can You Find What Others Cannot?",
                "desc": "Step into a world of mystery, puzzles, hidden clues, and unexpected challenges. Treasure Hunt is an exciting adventure where teams must race against time to solve a series of clues and uncover the final treasure.",
                "overview": "Step into a world of mystery, puzzles, hidden clues, and unexpected challenges. Treasure Hunt is an exciting adventure where teams must race against time to solve a series of clues and uncover the final treasure.\n\nEach clue will test your logic, observation, creativity, problem-solving skills, and teamwork. Follow the trail carefully—every answer leads to the next challenge, but one wrong move could take you off the path!\n\nThink fast, decode the mystery, and stay ahead of the competition. Only the smartest and most determined teams will reach the final destination.",
                "xp": "1,500 XP",
                "difficulty": "MEDIUM",
                "iconType": "brain",
                "heads": [],
                "rules": []
            }
        ]
    },
    {
        "title": "GAMING NEXUS",
        "subtitle": "ESPORTS SHOWDOWN",
        "desc": "Squad up or go solo in the arena: BGMI, FIFA, Mobile Legends and Tekken.",
        "color": "#9b5cff",
        "iconType": "gamepad",
        "modelType": "controller",
        "shortName": "Gaming",
        "iconChar": "🎮",
        "xp": "5,000 XP",
        "difficulty": "MEDIUM",
        "id": "03",
        "events": [
            {
                "title": "BGMI",
                "subtitle": "DROP IN. GEAR UP. SURVIVE. CONQUER",
                "desc": "Enter the battleground and fight for ultimate glory! Battle Royale brings the thrill and intensity of BGMI to ADDOVEDI, where squads will compete against each other in a high-stakes test of strategy, coordination, skill, and survival.",
                "overview": "Enter the battleground and fight for ultimate glory! Battle Royale brings the thrill and intensity of BGMI to ADDOVEDI, where squads will compete against each other in a high-stakes test of strategy, coordination, skill, and survival.\n\nFrom the moment you drop onto the battlefield, every decision matters. Loot your gear, plan your moves, communicate with your squad, and outplay your opponents as the battleground closes in.\n\nOnly the strongest teams will survive the chaos and rise to claim the title of the ultimate champions.\n\nDrop Together. Fight Hard. Survive the Arena.",
                "xp": "1,500 XP",
                "difficulty": "MEDIUM",
                "iconType": "gamepad",
                "heads": [],
                "rules": []
            },
            {
                "title": "FIFA SHOWDOWN",
                "subtitle": "KICK OFF. COMPETE. CONQUER",
                "desc": "Get ready to experience the thrill of football in the digital arena! FIFA Showdown brings together football fans and gaming enthusiasts for an intense battle of skill, strategy, and precision.",
                "overview": "Get ready to experience the thrill of football in the digital arena! FIFA Showdown brings together football fans and gaming enthusiasts for an intense battle of skill, strategy, and precision.\n\nChoose your team, master your tactics, and go head-to-head against your opponents in high-energy matches. Every pass, tackle, attack, and goal can change the course of the game.\n\nOutplay your rivals, dominate the pitch, and fight your way to the top. Only the best player will emerge as the ultimate champion.\n\nPLAY HARD. SCORE BIG. RULE THE ARENA.",
                "xp": "1,500 XP",
                "difficulty": "MEDIUM",
                "iconType": "gamepad",
                "heads": [],
                "rules": []
            },
            {
                "title": "MOBILE LEGENDS: BANG BANG",
                "subtitle": "CHOOSE YOUR HERO. MASTER YOUR STRATEGY. CONQUER THE ARENA",
                "desc": "Enter the ultimate battlefield in an intense 5v5 multiplayer battle arena where teamwork, strategy, and quick decision-making determine victory. Assemble your squad, choose your heroes, and work together to destroy the enemy base while defending your own.",
                "overview": "Enter the ultimate battlefield in an intense 5v5 multiplayer battle arena where teamwork, strategy, and quick decision-making determine victory. Assemble your squad, choose your heroes, and work together to destroy the enemy base while defending your own.\n\nEvery match demands perfect coordination, tactical gameplay, and mastery of your chosen role. Whether you lead the attack, protect your teammates, or turn the battle around with a game-changing move, every decision can make the difference between defeat and glory.\n\nGather your squad and prepare for battle. The arena is waiting.\n\nTEAM UP. FIGHT SMART. CLAIM VICTORY.",
                "xp": "1,500 XP",
                "difficulty": "MEDIUM",
                "iconType": "gamepad",
                "heads": [],
                "rules": []
            },
            {
                "title": "TEKKEN SHOWDOWN",
                "subtitle": "FIGHT. COMBO. CONQUER",
                "desc": "Step into the arena and unleash your fighting skills in an intense battle of reflexes, timing, and strategy. Tekken Showdown brings players face-to-face in thrilling one-on-one matches where every combo, counter, and perfectly timed move can decide the outcome.",
                "overview": "Step into the arena and unleash your fighting skills in an intense battle of reflexes, timing, and strategy. Tekken Showdown brings players face-to-face in thrilling one-on-one matches where every combo, counter, and perfectly timed move can decide the outcome.\n\nChoose your fighter, master your moves, and outplay your opponent on the road to victory. With no team to depend on, it all comes down to your skills, precision, and ability to perform under pressure.\n\nOnly the strongest fighter will survive the competition and claim the title of the ultimate champion.\n\nCHOOSE YOUR FIGHTER. ENTER THE ARENA. FIGHT FOR GLORY.",
                "xp": "1,500 XP",
                "difficulty": "MEDIUM",
                "iconType": "gamepad",
                "heads": [],
                "rules": []
            }
        ]
    },
    {
        "title": "CYBER CODE",
        "subtitle": "ALGORITHMIC WARFARE",
        "desc": "Hackathons, competitive coding and AI-assisted web design for builders and problem solvers.",
        "color": "#ff1f4f",
        "iconType": "code",
        "modelType": "coding",
        "shortName": "Coding",
        "iconChar": "💻",
        "xp": "5,000 XP",
        "difficulty": "MEDIUM",
        "id": "04",
        "events": [
            {
                "title": "HACKATHON",
                "subtitle": "IDEATE. INNOVATE. BUILD. CONQUER",
                "desc": "Enter the innovation arena and transform your ideas into impactful digital solutions. This Hackathon brings together creative minds, designers, and developers to solve real-world challenges through website development and technology.",
                "overview": "Enter the innovation arena and transform your ideas into impactful digital solutions. This Hackathon brings together creative minds, designers, and developers to solve real-world challenges through website development and technology.\n\nParticipants will brainstorm innovative ideas, design engaging user experiences, and develop functional websites within a limited time. The challenge is to combine creativity, UI/UX design, frontend development, and problem-solving to build a website that delivers a meaningful solution.\n\nTHINK. DESIGN. DEVELOP.",
                "xp": "1,500 XP",
                "difficulty": "MEDIUM",
                "iconType": "web",
                "heads": [],
                "rules": []
            },
            {
                "title": "CODATHON",
                "subtitle": "THINK. CODE. SOLVE. CONQUER",
                "desc": "Step into the coding arena and put your programming skills to the ultimate test! CODATHON is an exciting competitive coding challenge where participants race against time to solve complex problems using logic, algorithms, and creativity.",
                "overview": "Step into the coding arena and put your programming skills to the ultimate test! CODATHON is an exciting competitive coding challenge where participants race against time to solve complex problems using logic, algorithms, and creativity.\n\nFrom debugging tricky code to solving challenging programming problems, every round will test your coding skills, problem-solving ability, speed, and logical thinking. The competition gets tougher with every challenge, demanding accuracy and efficiency under pressure.\n\nThink fast, code smarter, and rise above the competition. Only the sharpest minds will conquer the leaderboard.\n\nCODE HARD. THINK SMART. RULE THE ARENA.",
                "xp": "1,500 XP",
                "difficulty": "MEDIUM",
                "iconType": "code",
                "heads": [],
                "rules": []
            },
            {
                "title": "PROMPT & PIXEL",
                "subtitle": "PROMPT. DESIGN. BUILD",
                "desc": "PROMPT & PIXEL is an AI-assisted Web Design and Landing Page Development Competition that challenges participants to transform creative ideas into visually engaging digital experiences.",
                "overview": "PROMPT & PIXEL is an AI-assisted Web Design and Landing Page Development Competition that challenges participants to transform creative ideas into visually engaging digital experiences.\n\nGiven a theme or problem statement on the spot, participants will use their creativity, UI/UX knowledge, frontend development skills, and AI tools to design and build an innovative responsive landing page within a limited time.\n\nPROMPT SMART. DESIGN BOLD. BUILD THE FUTURE.",
                "xp": "1,500 XP",
                "difficulty": "MEDIUM",
                "iconType": "web",
                "heads": [],
                "rules": []
            }
        ]
    },
    {
        "title": "SILICON SPECTRUM",
        "subtitle": "SIGNAL & MICROELECTRONICS",
        "desc": "Autonomous robots, digital design and circuit challenges from the electronics department.",
        "color": "#a78bfa",
        "iconType": "bolt",
        "modelType": "portal",
        "shortName": "ECE",
        "iconChar": "📡",
        "xp": "5,000 XP",
        "difficulty": "MEDIUM",
        "id": "05",
        "events": [
            {
                "title": "LINE FOLLOWER",
                "subtitle": "SENSE. FOLLOW. RACE. CONQUER",
                "desc": "LINE FOLLOWER is an exciting robotics challenge where teams design and build an autonomous robot capable of accurately detecting and following a predefined track.",
                "overview": "LINE FOLLOWER is an exciting robotics challenge where teams design and build an autonomous robot capable of accurately detecting and following a predefined track.\n\nThe competition tests the robot's speed, sensor accuracy, control, programming, and mechanical design as it navigates through curves, turns, and challenging sections of the track. The fastest and most precise robot to complete the course will rise to the top.\n\nBUILD SMART. FOLLOW FAST. CONQUER THE TRACK.",
                "xp": "1,500 XP",
                "difficulty": "MEDIUM",
                "iconType": "robot",
                "heads": [],
                "rules": []
            },
            {
                "title": "VERILOG",
                "subtitle": "DESIGN. SIMULATE. INNOVATE",
                "desc": "VERILOG is a digital design challenge that puts participants' knowledge of hardware description, logical thinking, and problem-solving skills to the test. Participants will design and implement digital circuits and systems using Verilog based on the given problem statements.",
                "overview": "VERILOG is a digital design challenge that puts participants' knowledge of hardware description, logical thinking, and problem-solving skills to the test. Participants will design and implement digital circuits and systems using Verilog based on the given problem statements.\n\nFrom basic combinational circuits to complex digital logic, the competition challenges participants to think like hardware designers and transform ideas into functional designs.\n\nCODE THE LOGIC. DESIGN THE HARDWARE. BUILD THE FUTURE.",
                "xp": "1,500 XP",
                "difficulty": "MEDIUM",
                "iconType": "code",
                "heads": [],
                "rules": []
            },
            {
                "title": "CIRCUIT DESIGNING",
                "subtitle": "DESIGN . CONNECT . INNOVATE",
                "desc": "Circuit Design Challenge is a technical competition where participants put their electronics knowledge, creativity, and problem-solving skills to the test by designing and implementing functional electronic circuits based on given challenges.",
                "overview": "Circuit Design Challenge is a technical competition where participants put their electronics knowledge, creativity, and problem-solving skills to the test by designing and implementing functional electronic circuits based on given challenges.\n\nParticipants will analyze the problem, design an appropriate circuit, and bring their ideas to life through effective component selection and circuit implementation.\n\nTHINK SMART. DESIGN BETTER. MAKE IT WORK.",
                "xp": "1,500 XP",
                "difficulty": "MEDIUM",
                "iconType": "bolt",
                "heads": [],
                "rules": []
            }
        ]
    },
    {
        "title": "VOLTAGE GRID",
        "subtitle": "POWER & TRANSFORMER SYSTEMS",
        "desc": "Circuit debugging, energy solutions and electronics knowledge put to the test.",
        "color": "#ff9d00",
        "iconType": "bolt",
        "modelType": "electrical",
        "shortName": "Electrical",
        "iconChar": "⚡",
        "xp": "5,000 XP",
        "difficulty": "MEDIUM",
        "id": "06",
        "events": [
            {
                "title": "CIRCUIT DEBUGGING",
                "subtitle": "UNDERSTAND. SIMULATE. BUILD. DEBUG",
                "desc": "Circuit Debugging is a three-round, team-based technical challenge that tests participants' knowledge of electrical and electronic circuits through theory, simulation, practical circuit construction, and fault diagnosis.",
                "overview": "Circuit Debugging is a three-round, team-based technical challenge that tests participants' knowledge of electrical and electronic circuits through theory, simulation, practical circuit construction, and fault diagnosis.\n\nTeams progress from Circuit IQ, where they test their technical knowledge, to a Virtual-to-Physical Circuit Challenge involving LTspice simulation, circuit analysis, and breadboard implementation. The final round puts their troubleshooting skills to the test as they identify, diagnose, and repair faults in a real hardware circuit.\n\nOBSERVE. MEASURE. DIAGNOSE. REPAIR.",
                "xp": "1,500 XP",
                "difficulty": "MEDIUM",
                "iconType": "bug",
                "heads": [],
                "rules": []
            },
            {
                "title": "ENERGIX",
                "subtitle": "POWER IDEAS. ENGINEER SOLUTIONS",
                "desc": "EnergiX is a technical paper presentation and engineering problem-solving competition that challenges participants to explore real-world problems in energy and electrical engineering.",
                "overview": "EnergiX is a technical paper presentation and engineering problem-solving competition that challenges participants to explore real-world problems in energy and electrical engineering.\n\nFrom renewable energy and electric vehicles to energy storage, smart grids, energy efficiency, and sustainability, participants will analyze technical challenges and present practical, innovative, and technically sound solutions.\n\nThe event goes beyond presentations—it encourages participants to apply engineering principles, research, data, and problem-solving skills to develop meaningful solutions for the future.\n\nTHINK ENERGY. ENGINEER THE FUTURE.",
                "xp": "1,500 XP",
                "difficulty": "MEDIUM",
                "iconType": "bolt",
                "heads": [],
                "rules": []
            },
            {
                "title": "ELECTROMIND",
                "subtitle": "KNOW IT. IDENTIFY IT. MEASURE IT. BUILD IT. SOLVE IT",
                "desc": "ELECTROMIND is a multi-round technical competition designed to test participants' knowledge and practical understanding of electronics and electrical engineering.",
                "overview": "ELECTROMIND is a multi-round technical competition designed to test participants' knowledge and practical understanding of electronics and electrical engineering.\n\nThe event challenges participants through different stages involving technical concepts, component identification, measurement, problem-solving, and basic circuit design. It is a test of not only what you know, but also how effectively you can apply that knowledge in practical situations.\n\nTHINK. TEST. BUILD. SOLVE.",
                "xp": "1,500 XP",
                "difficulty": "MEDIUM",
                "iconType": "brain",
                "heads": [],
                "rules": []
            }
        ]
    },
    {
        "title": "MECHANICAL MATRIX",
        "subtitle": "KINETIC THERMODYNAMICS",
        "desc": "CAD design, hydraulics and rocketry for hands-on mechanical minds.",
        "color": "#ffea00",
        "iconType": "gear",
        "modelType": "ai",
        "shortName": "Mechanical",
        "iconChar": "⚙️",
        "xp": "5,000 XP",
        "difficulty": "MEDIUM",
        "id": "07",
        "events": [
            {
                "title": "SOLID SIEGE",
                "subtitle": "IMAGINE. DESIGN. CREATE",
                "desc": "CAD Design Challenge is a technical competition that tests participants' creativity, design skills, and engineering knowledge through computer-aided design.",
                "overview": "CAD Design Challenge is a technical competition that tests participants' creativity, design skills, and engineering knowledge through computer-aided design.\n\nParticipants will be challenged to transform ideas into precise and functional 3D models while applying engineering principles, creativity, and effective design practices. The event tests both technical proficiency and the ability to develop practical solutions within a limited time.\n\nVISUALIZE THE IDEA. DESIGN THE SOLUTION.",
                "xp": "1,500 XP",
                "difficulty": "MEDIUM",
                "iconType": "gear",
                "heads": [],
                "rules": []
            },
            {
                "title": "HYDRAULIC WARZONE",
                "subtitle": "POWER. PRECISION. CONTROL",
                "desc": "Hydraulic Warzone is an exciting engineering challenge where participants design and build a functional hydraulic arm capable of performing specific tasks with strength and precision.",
                "overview": "Hydraulic Warzone is an exciting engineering challenge where participants design and build a functional hydraulic arm capable of performing specific tasks with strength and precision.\n\nUsing the principles of fluid mechanics, hydraulics, mechanical design, and control, teams must operate their hydraulic arm to navigate challenges, lift objects, and complete the given mission efficiently.\n\nThe event tests creativity, engineering skills, teamwork, and precise control under pressure.\n\nBUILD THE ARM. MASTER THE PRESSURE. COMPLETE THE MISSION.",
                "xp": "1,500 XP",
                "difficulty": "MEDIUM",
                "iconType": "gear",
                "heads": [],
                "rules": []
            },
            {
                "title": "SKY FORGE",
                "subtitle": "DESIGN FOR THE SKY. BUILD FOR HEIGHT. LAUNCH FOR GLORY.",
                "desc": "SKYFORGE is a hands-on pneumatic rocket competition that introduces participants to the fundamentals of aerospace engineering through the design, construction, and launch of lightweight model rockets.",
                "overview": "SKYFORGE is a hands-on pneumatic rocket competition that introduces participants to the fundamentals of aerospace engineering through the design, construction, and launch of lightweight model rockets.\n\nUsing the materials and standardized syringe-based propulsion mechanism provided by the organizers, participants will design and build their own rockets to achieve maximum flight height. The challenge tests creativity, design optimization, aerodynamics, and engineering skills.",
                "xp": "1,500 XP",
                "difficulty": "MEDIUM",
                "iconType": "rocket",
                "heads": [],
                "rules": []
            }
        ]
    },
    {
        "title": "URBAN BLUEPRINT",
        "subtitle": "STRUCTURAL ARCHITECTURE",
        "desc": "Problem solving and structural challenges, from bridges to water filtration.",
        "color": "#1fff76",
        "iconType": "bridge",
        "modelType": "civil",
        "shortName": "Civil",
        "iconChar": "🏗️",
        "xp": "5,000 XP",
        "difficulty": "MEDIUM",
        "id": "08",
        "events": [
            {
                "title": "BRAIN FORGE",
                "subtitle": "IDENTIFY. IDEATE. SOLVE",
                "desc": "BRAIN FORGE is a real-world problem-solving competition that challenges participants to turn critical thinking and creativity into practical solutions.",
                "overview": "BRAIN FORGE is a real-world problem-solving competition that challenges participants to turn critical thinking and creativity into practical solutions.\n\nA broad problem area will be revealed after registrations close. Teams must explore the given area, identify a specific real-life problem, and develop an innovative and practical solution. The final idea will be presented before a panel of judges.\n\nTHINK DEEP. SOLVE SMART. FORGE THE FUTURE.",
                "xp": "1,500 XP",
                "difficulty": "MEDIUM",
                "iconType": "brain",
                "heads": [],
                "rules": []
            },
            {
                "title": "EARTHQUAKE RESISTING BUILDING",
                "subtitle": "FILTER. PURIFY. PERFORM",
                "desc": "Water Filter is an on-the-spot engineering challenge where teams design and build an effective water filtration system using materials provided by the organizers.",
                "overview": "Water Filter is an on-the-spot engineering challenge where teams design and build an effective water filtration system using materials provided by the organizers.\n\nParticipants must apply their creativity and understanding of filtration principles to develop a filter capable of improving water quality. The performance of each filter will be evaluated using a microscopic turbidity meter, testing how effectively it reduces turbidity.\n\nBUILD SMART. FILTER BETTER. MAKE A DIFFERENCE.",
                "xp": "1,500 XP",
                "difficulty": "MEDIUM",
                "iconType": "bridge",
                "heads": [],
                "rules": []
            },
            {
                "title": "BRIDGE MAKING",
                "subtitle": "DESIGN. BUILD. BEAR THE LOAD",
                "desc": "Bridge Making is a hands-on engineering competition where teams design and construct a bridge using limited materials provided by the organizers.",
                "overview": "Bridge Making is a hands-on engineering competition where teams design and construct a bridge using limited materials provided by the organizers.\n\nParticipants will use popsicle sticks, Fevicol, and cutters to build a strong and efficient structure. The completed bridges will then undergo load testing to evaluate their strength and load-bearing capacity.\n\nThe challenge tests creativity, structural design, material efficiency, and practical engineering skills.\n\nBUILD SMART. STAND STRONG. CARRY THE LOAD.",
                "xp": "1,500 XP",
                "difficulty": "MEDIUM",
                "iconType": "bridge",
                "heads": [],
                "rules": []
            }
        ]
    }
];

// Helper mapping for Category SVG Icons in Lobby Console Cards
export function getSvgIcon(type, color) {
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
        icon: (color) => getSvgIcon(cat.iconType, color),
        modelType: cat.modelType || 'coding',
        shortName: cat.shortName || cat.title,
        iconChar: cat.iconChar || '⚙️',
        id: cat.id || '01'
    }));

export const getCategoryMeta = (title) => {
    const matched = CATEGORIES_WITH_EVENTS.find(cat => cat.title === title);
    if (matched) {
        return {
            shortName: matched.shortName || title,
            iconChar: matched.iconChar || '⚙️',
            id: matched.id || '01'
        };
    }
    // Dynamic generation if unknown category
    return {
        shortName: title.replace(/(QUEST|GUILD|ARENA|LAB|& RC|& DESIGN|& DATA SCIENCE)/g, '').trim(),
        iconChar: '⚙️',
        id: '01'
    };
};

export const CATEGORY_ICONS = {};
CATEGORIES_WITH_EVENTS.forEach(cat => {
    const key = cat.shortName || cat.title.replace(/(QUEST|GUILD|ARENA|LAB|& RC|& DESIGN|& DATA SCIENCE)/g, '').trim();
    CATEGORY_ICONS[key] = {
        icon: cat.iconChar || '⚙️',
        color: cat.color || '#00E5FF'
    };
    if (cat.events) {
        cat.events.forEach(ev => {
            if (ev.category) {
                CATEGORY_ICONS[ev.category] = {
                    icon: ev.iconChar || cat.iconChar || '⚙️',
                    color: ev.color || cat.color || '#00E5FF'
                };
            }
        });
    }
});

// Merges categories fetched from the DB (via GET /api/events) into the shape
// the UI expects (adds the non-persisted icon renderer + shortName/iconChar/id
// display metadata). Falls back to the static CARD_DATA when the DB has none
// yet. This is what makes admin-created/edited categories actually show up on
// the public site instead of being silently discarded.
export function mergeCategoriesFromDb(dbCategories) {
    if (!Array.isArray(dbCategories) || dbCategories.length === 0) return CARD_DATA;
    return dbCategories.map(cat => {
        const meta = getCategoryMeta(cat.title);
        return {
            title: cat.title,
            subtitle: cat.subtitle,
            desc: cat.desc,
            color: cat.color,
            xp: cat.xp,
            difficulty: cat.difficulty,
            icon: (color) => getSvgIcon(cat.iconType, color),
            modelType: cat.modelType || 'coding',
            shortName: meta.shortName,
            iconChar: meta.iconChar,
            id: meta.id
        };
    });
}

// Buckets DB sub-events under the (DB-aware) category list, carrying through
// iconType/modelType which earlier sync logic dropped.
export function mergeSubEventsFromDb(categoriesList, dbSubEvents) {
    const mapped = {};
    categoriesList.forEach(c => { mapped[c.title] = []; });

    (dbSubEvents || []).forEach(s => {
        const matchedCat = categoriesList.find(c =>
            c.title.toLowerCase() === (s.categoryTitle || '').toLowerCase() ||
            slugify(c.title) === slugify(s.categoryTitle || '')
        );
        const catKey = matchedCat ? matchedCat.title : s.categoryTitle;
        if (!mapped[catKey]) mapped[catKey] = [];
        mapped[catKey].push({
            title: s.title,
            subtitle: s.subtitle,
            desc: s.desc,
            overview: s.overview || '',
            categoryTitle: matchedCat ? matchedCat.title : s.categoryTitle,
            color: s.color,
            xp: s.xp,
            difficulty: s.difficulty,
            heads: s.heads || [],
            icon: (color) => getSvgIcon(s.iconType, color),
            modelType: s.modelType || (matchedCat ? matchedCat.modelType : 'coding'),
            unstopUrl: s.unstopUrl || 'https://unstop.com',
            timeline: s.timeline || null
        });
    });

    return mapped;
}

// Day Zero starts the evening of Oct 28 (from 5PM); Day 1 and Day 2 are the
// full following days. Single source of truth for both the ISO dates (status
// computation) and the display labels (DAYS below) so they can't drift apart.
const DAY_META = [
    { slot: 'SLOT 00', label: 'DAY ZERO', date: 'Oct 28', isoDate: '2026-10-28', color: '#00E5FF' },
    { slot: 'SLOT 01', label: 'DAY 1', date: 'Oct 29', isoDate: '2026-10-29', color: '#7A5CFF' },
    { slot: 'SLOT 02', label: 'DAY 2', date: 'Oct 30', isoDate: '2026-10-30', color: '#FF2CFB' }
];
const TIMELINE_DAY_DATES = DAY_META.map(d => d.isoDate);

function computeEventStatus(day, time, end) {
    if (!day || !time) return 'UPCOMING';
    const dateStr = TIMELINE_DAY_DATES[day - 1];
    const start = new Date(`${dateStr}T${time}:00`);
    if (Number.isNaN(start.getTime())) return 'UPCOMING';
    const now = new Date();
    if (end) {
        const finish = new Date(`${dateStr}T${end}:00`);
        if (!Number.isNaN(finish.getTime()) && now > finish) return 'COMPLETED';
    }
    return now >= start ? 'LIVE' : 'UPCOMING';
}

// Builds the Timeline page's day-by-day schedule from live (DB-merged)
// categories/sub-events, mirroring the static DAYS below but recomputed
// from whatever an admin has actually scheduled. A sub-event with no
// timeline.day set is left off the schedule entirely — that's the
// "timing not decided yet" state, not an error.
export function buildTimelineDays(categoriesList, subEventsMap) {
    const days = DAY_META.map(d => ({ ...d, events: [] }));

    (categoriesList || []).forEach(cat => {
        const events = (subEventsMap && subEventsMap[cat.title]) || [];
        events.forEach(ev => {
            const t = ev.timeline;
            if (!t || !(t.day >= 1 && t.day <= 3) || !t.time) return;
            days[t.day - 1].events.push({
                id: slugify(ev.title),
                title: ev.title,
                subtitle: ev.subtitle,
                category: cat.shortName || cat.title,
                categorySlug: slugify(cat.title),
                time: t.time,
                end: t.end || '',
                venue: t.venue || 'Main Arena',
                mode: t.mode || 'Solo',
                registered: 0,
                prize: t.prize || 'Trophies',
                status: computeEventStatus(t.day, t.time, t.end),
                desc: ev.desc,
                heads: ev.heads || []
            });
        });
    });

    days.forEach(day => day.events.sort((a, b) => a.time.localeCompare(b.time)));
    return days;
}

export const SUB_EVENTS = {};
CATEGORIES_WITH_EVENTS.forEach(cat => {
    if (!cat.timelineOnly) {
        SUB_EVENTS[cat.title] = cat.events.map(ev => ({
            title: ev.title,
            subtitle: ev.subtitle,
            desc: ev.desc,
            overview: ev.overview || '',
            categoryTitle: cat.title,
            color: ev.color || cat.color,
            xp: ev.xp,
            difficulty: ev.difficulty,
            heads: ev.heads,
            icon: (color) => getSvgIcon(ev.iconType || cat.iconType, color),
            unstopUrl: ev.unstopUrl || `https://unstop.com/o/addovedi-2026-${slugify(ev.title)}`,
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

export const DAYS = DAY_META.map(d => ({ ...d, events: [] }));

CATEGORIES_WITH_EVENTS.forEach(cat => {
    cat.events.forEach(ev => {
        if (ev.timeline && ev.timeline.day >= 1 && ev.timeline.day <= 3) {
            DAYS[ev.timeline.day - 1].events.push({
                id: slugify(ev.title),
                title: ev.title,
                subtitle: ev.subtitle,
                category: ev.category || cat.shortName || cat.title.replace(' & RC', '').replace(' & CS', '').replace('QUEST', '').replace('GUILD', '').replace('ARENA', '').replace(' & DESIGN', '').replace(' & DATA SCIENCE', '').trim(),
                categorySlug: slugify(cat.title),
                time: ev.timeline.time,
                end: ev.timeline.end,
                venue: ev.timeline.venue || 'Main Arena',
                mode: ev.timeline.mode || 'Solo',
                registered: ev.timeline.registered || 0,
                prize: ev.timeline.prize || 'Trophies',
                status: ev.timeline.status || 'UPCOMING',
                desc: ev.desc
            });
        }
    });
});

// Sort events chronologically on each day
DAYS.forEach(day => {
    day.events.sort((a, b) => a.time.localeCompare(b.time));
});
