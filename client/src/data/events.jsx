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
                "minTeam": 2,
                "maxTeam": 4,
                "fee": "₹200 per team",
                "unstopUrl": "https://unstop.com/o/iHveMJo?utm_medium=Share&utm_source=addovtec18719&utm_campaign=Competitions",
                "timeline": { "prize": "₹22,000" },
                "heads": [{"name": "Tapan Boruah", "phone": "+91 98590 40208"}],
                "rules": [
                "Team size is 2 to 4 members (team leader included). Teams may be inter-college and inter-branch.",
                "Registration fee is ₹200 per team. Prizes worth ₹22,000.",
                "The robot must be wired or wireless remote-controlled by the team. Autonomous robots are not allowed unless announced.",
                "Maximum robot size 30 cm x 30 cm x 30 cm and maximum weight 5 kg.",
                "Maximum operating voltage 12 V. Batteries must be sealed and safe. Pyrotechnic, liquid-based or hazardous parts are strictly prohibited.",
                "Every robot goes through technical inspection before its first match. Each team must bring a spare battery and basic tools; components are not provided.",
                "Round 1 is a qualifying group stage with round-robin matches. Round 2 is knockout, then semifinals and the final.",
                "Each match is 5 minutes. A tie goes to a 2-minute golden-goal period, then a penalty shoot-out or a rematch.",
                "Only one team member may operate the robot during a match. Other members must stay outside the arena.",
                "A goal counts only when the whole ball crosses the goal line. A robot must not hold, lift or trap the ball for more than 5 seconds.",
                "Intentionally damaging, flipping or trapping the opponent's robot is a foul. Repeated fouls lead to a warning, a goal penalty and then disqualification.",
                "A robot immobilised for more than 10 seconds is out of play and the referee may restart the match. A team not ready within 3 minutes of being called forfeits.",
                "Jammers, signal interference or any unfair electronic or mechanical method lead to immediate disqualification.",
                "The decisions of the referees and the organizing committee are final and binding. The organizers may modify or clarify the rules, and any change will be announced."
]
            },
            {
                "title": "DUNE DOMINATOR",
                "subtitle": "Conquer the Terrain. Command the Machine",
                "desc": "Dune Dominator is an exciting off-road robotics challenge where teams design and build a powerful rover capable of conquering a challenging sandy terrain with carry sand on it. The competition tests the robot's mechanical strength, mobility, stability, control, and endurance as it navigates through obstacles, slopes, uneven surfaces, and difficult terrain.",
                "overview": "Dune Dominator is an exciting off-road robotics challenge where teams design and build a powerful rover capable of conquering a challenging sandy terrain with carry sand on it. The competition tests the robot's mechanical strength, mobility, stability, control, and endurance as it navigates through obstacles, slopes, uneven surfaces, and difficult terrain.\n\nTeams must engineer their rover to overcome every challenge with speed, precision, and reliability. From wheel and suspension design to motor control and overall stability, every engineering decision can make the difference between getting stuck and conquering the course.\n\nPrepare your machine, take control, and dominate the dunes!",
                "xp": "1,500 XP",
                "difficulty": "MEDIUM",
                "iconType": "robot",
                "minTeam": 2,
                "maxTeam": 4,
                "fee": "₹200 per team",
                "unstopUrl": "https://unstop.com/o/sf0WoXF?lb=9FweNlVe&utm_medium=Share&utm_source=addovtec18719&utm_campaign=Competitions",
                "timeline": { "prize": "₹20,000" },
                "heads": [{"name": "Vaibhav Gupta", "phone": "+91 95061 77693"}],
                "rules": [
                "Team size is 2 to 4 members (team leader included). Teams may be inter-college and inter-branch.",
                "Registration fee is ₹200 per team. Prizes worth ₹20,000.",
                "Round 1 (Elimination): carry 500 g of sand in the sand carrier with the lid fixed, cross the complete arena and clear every obstacle. Performance decides qualification for Round 2.",
                "Round 2 (Final): carry 750 g of sand with the top open and cross the entire arena, losing as little sand and time as possible. Extra obstacles may be revealed on the spot. Final ranking comes from this round.",
                "The arena layout and obstacles are revealed on the event day. The two rounds may use different arenas, with tunnels, bridges, banked sections and surprise obstacles.",
                "Only self-powered rovers with a maximum battery voltage of 24 V are allowed. The rover must be controlled manually at all times through a wireless system. Autonomous or pre-programmed operation is strictly prohibited.",
                "Maximum rover weight 2 kg (excluding sand). Maximum dimensions 40 cm x 30 cm x 30 cm (L x B x H). No motor speed restriction. PVC or plywood may be used for the structure.",
                "Sand carrier: a 10 cm x 10 cm x 5 cm box of wood sheet at least 3 mm thick, mounted on the upper side of the rover, with a separate removable lid.",
                "Wheels or continuous tracks, any number. No spikes, claws, screws, sharp protrusions or arena-damaging features. No active traction mechanisms that change geometry during a run. Wheels or tracks must be non-metallic.",
                "Passive suspension is permitted. Active or electronically controlled suspension is not allowed, and suspension must not change the rover's geometry during a run.",
                "The rover starts from the designated start point when the timer begins and must cross all obstacles. A maximum of 5 hand touches are allowed if it gets stuck or goes off track.",
                "Penalty points are deducted for entering the Penalty Zone or touching the arena boundaries.",
                "Judging: sand retention, time efficiency, stability and control, and operational discipline. Scoring weights and penalty values are announced on the event day and apply equally to all teams.",
                "No changes, disassembly or modifications to the rover after the competition starts until results are declared. Intentional damage to the arena or other rovers, cheating or tampering leads to disqualification.",
                "The decisions of the judges and event managers are final and binding. The organizers may modify the rules, arena specifications or judging criteria, and any change will be announced."
]
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
                "minTeam": 1,
                "maxTeam": 5,
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
                "minTeam": 4,
                "maxTeam": 4,
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
                "minTeam": 1,
                "maxTeam": 5,
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
                "minTeam": 1,
                "maxTeam": 5,
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
                "minTeam": 1,
                "maxTeam": 5,
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
                "minTeam": 1,
                "maxTeam": 5,
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
                "minTeam": 1,
                "maxTeam": 5,
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
                "minTeam": 1,
                "maxTeam": 5,
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
                "minTeam": 1,
                "maxTeam": 5,
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
                "minTeam": 1,
                "maxTeam": 5,
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
                "minTeam": 1,
                "maxTeam": 5,
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
                "overview": "Circuit Debugging is a three-round technical event of Addovedi 2026 that tests participants' knowledge, analytical ability, simulation skills, circuit construction, measurement and practical troubleshooting. Observe. Measure. Diagnose. Repair. Verify.\n\nThe event follows a progressive structure: Round 1 is Understand, Round 2 is Simulate and Analyse, and Round 3 is Debug and Repair. Participants move from theoretical circuit analysis to computer-based simulation and finally to real-world hardware debugging.\n\nRound 1 — Circuit IQ (30 marks): a 20-question MCQ screening round of 20 minutes on circuit theory, Ohm's and Kirchhoff's laws, resistors, capacitors, diodes, transistors and basic fault identification.\nRound 2 — Simulation Challenge (30 marks): qualified teams read a problem statement, build the circuit in LTspice, run the simulation and show the required voltage, current or waveform results.\nRound 3 — Hardware Debugging (40 marks): the final round gives teams a pre-assembled breadboard circuit with intentionally introduced faults. Teams must measure, find the faulty component or connection, explain the cause, repair it and show the circuit working.\n\nThe final ranking is the combined score across all three rounds, out of 100.",
                "xp": "1,500 XP",
                "difficulty": "MEDIUM",
                "iconType": "bug",
                "minTeam": 1,
                "maxTeam": 2,
                "fee": "₹50 per person",
                "heads": [{"name": "Neeraj Bhandari", "phone": "+91 76670 58211"}],
                "timeline": { "prize": "₹13,000+ (including goodies)" },
                "rules": [
                "Each team can have a maximum of 2 participants, and both are expected to take part actively throughout. No team member may be replaced after the event begins unless the organisers permit it in exceptional circumstances.",
                "Registration fee is ₹50 per person. Prizes worth ₹13,000+ (including goodies).",
                "The event has three rounds: Round 1 Circuit IQ (MCQ, 30 marks), Round 2 Simulation Challenge (LTspice, 30 marks) and Round 3 Hardware Debugging (breadboard, 40 marks). The total is 100 marks, and the final ranking is the combined score across all rounds, subject to the qualification criteria.",
                "Round 1: 20 MCQs in 20 minutes, 1.5 marks each (30 marks). There is no negative marking unless the organisers announce otherwise. Topics include circuit theory, Ohm's and Kirchhoff's laws, series and parallel circuits, resistors, capacitors, diodes, transistors, symbols, basic fault identification and numerical questions.",
                "The number of teams qualifying for Round 2 depends on how many teams take part. The qualification criteria are announced before the event begins.",
                "Round 2: each qualified team gets a problem statement. Read it, construct the circuit in LTspice, run the right simulation, obtain the required voltage, current or waveforms and submit or demonstrate the results to the coordinators within the time limit.",
                "Every team must bring its own laptop with LTspice installed and tested beforehand. The organisers are not responsible for delays caused by software installation, downloads, updates or laptop issues during the round.",
                "Round 3: teams get a pre-assembled breadboard circuit with one or more intentionally introduced faults. Understand the expected behaviour, analyse the symptoms given by the organisers, troubleshoot systematically with the permitted instruments, find the faulty component or connection, explain the cause, correct it and show the circuit working again.",
                "Diagnose the fault before replacing components. Random replacement of components may not be treated as a valid debugging approach.",
                "The organisers provide the components, breadboards, measuring instruments and other equipment for the physical rounds. Use them carefully and responsibly, and do not intentionally damage or misuse any equipment.",
                "Report to the venue before the prescribed reporting time and carry a valid college or institute ID card.",
                "Do not interfere with another team's circuit, equipment or workstation. Follow the instructions of the coordinators and volunteers, and stop working immediately when time expires.",
                "Teams may be asked to explain their calculations, circuit design, simulation or troubleshooting procedure. The organisers may inspect LTspice files, calculations, circuit connections and simulation results.",
                "Any attempt to gain an unfair advantage or unauthorised help may lead to disqualification. Deliberate misconduct, cheating, equipment damage or interference with another team may lead to immediate disqualification.",
                "The organisers may change the sequence, timing or qualification criteria if operations require it, and will tell participants before the concerned round. The decisions of the judging panel and event coordinators on evaluation, scoring and qualification are final."
]
            },
            {
                "title": "ENERGIX",
                "subtitle": "POWER IDEAS. ENGINEER SOLUTIONS",
                "desc": "EnergiX is a technical paper presentation and engineering problem-solving competition that challenges participants to explore real-world problems in energy and electrical engineering.",
                "overview": "EnergiX is a technical paper presentation and engineering problem-solving competition that challenges participants to explore real-world problems in energy and electrical engineering.\n\nFrom renewable energy and electric vehicles to energy storage, smart grids, energy efficiency, and sustainability, participants will analyze technical challenges and present practical, innovative, and technically sound solutions.\n\nThe event goes beyond presentations—it encourages participants to apply engineering principles, research, data, and problem-solving skills to develop meaningful solutions for the future.\n\nTHINK ENERGY. ENGINEER THE FUTURE.",
                "xp": "1,500 XP",
                "difficulty": "MEDIUM",
                "iconType": "bolt",
                "minTeam": 1,
                "maxTeam": 5,
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
                "minTeam": 1,
                "maxTeam": 5,
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
                "overview": "Solid Siege is the SolidWorks CAD competition of Addovedi 2026. Across three progressively harder rounds — 2D sketching, 3D part modelling and assembly design — participants race the clock to turn engineering drawings into accurate, clean SolidWorks models.\n\nA design problem with exact dimensions and required features is released at the start of each round. Model it exactly as specified within the time limit to qualify for the next round.\n\nRound 1 — 2D Mechanical Bracket (2 points): dimensional accuracy, correct geometry and a clean, well-constrained sketch.\nRound 2 — 3D Stepped Support (3 points): dimensional accuracy, correct features and a clean model tree.\nRound 3 — Wheel–Shaft Assembly (5 points): correct components, proper mates and overall assembly accuracy.\n\nRound scores build from 2 to 3 to 5 points, for a maximum of 10. Recorded time decides any tie.",
                "xp": "1,500 XP",
                "difficulty": "MEDIUM",
                "iconType": "gear",
                "minTeam": 1,
                "maxTeam": 1,
                "fee": "₹50 per participant",
                "unstopUrl": "https://unstop.com/o/Xsm2yk6?lb=9FweNlVe&utm_medium=Share&utm_source=addovtec18719&utm_campaign=Competitions",
                "heads": [{"name": "Nikhil Raj", "phone": "+91 95087 15131"}],
                "timeline": { "prize": "₹10,00,000+" },
                "rules": [
                "Solid Siege is a progressive, three-round SolidWorks challenge. All participants begin with Round 1, and only those who qualify a round within its allotted time advance to the next.",
                "Round 1 is 2D Mechanical Bracket (2 points), Round 2 is 3D Stepped Support (3 points) and Round 3 is Wheel–Shaft Assembly (5 points). The maximum score is 10.",
                "Exact dimensions and required features are provided at the start of each round. Model exactly as specified.",
                "Each round has a fixed time limit announced before the round begins. Submissions after the time limit are not accepted unless the coordinator announces otherwise.",
                "Submit files in the format and location announced by the coordinators.",
                "Evaluation may consider dimensional accuracy, feature correctness, constraints, modelling quality and completion. The judges may finalise the detailed checklist before the event.",
                "Marks: Round 1 is geometry and dimensions (1.0) plus constraints and a clean sketch (1.0). Round 2 is geometry and dimensions (1.5), features and model tree (1.0) and finish (0.5). Round 3 is components (1.5), mates (1.5), assembly accuracy (1.5) and finish (0.5).",
                "Final ranking is based on total score. Ties are broken by recorded time, comparing the Round 3 time first, then Round 2, then Round 1. The faster participant gets priority at the first round where the times differ.",
                "Unauthorised external help, pre-made models or any other unfair means lead to disqualification.",
                "Participants must carry a valid student ID card from their institution.",
                "A participant may register only once. In case of multiple registrations, only the first is considered.",
                "Official start and submission times recorded by the coordinators are used for all timing decisions.",
                "Participants must maintain proper conduct and must not interfere with other participants, their systems or their files.",
                "The decision of the judges and organising committee on qualification, scoring and disqualification is final and binding. The organisers may modify or clarify the rules, and any change will be announced before implementation.",
                "Registration fee: ₹50 per participant. Prize pool: ₹10,00,000+. The position-wise distribution will be announced by the organisers."
]
            },
            {
                "title": "HYDRAULIC WARZONE",
                "subtitle": "POWER. PRECISION. CONTROL",
                "desc": "Hydraulic Warzone is an exciting engineering challenge where participants design and build a functional hydraulic arm capable of performing specific tasks with strength and precision.",
                "overview": "Hydraulic Warzone is the hydraulic arm challenge of Addovedi 2026, organised by the Mechanical Engineering Student's Society (MESS), NIT Arunachal Pradesh. It is a hands-on mechanical engineering competition in which teams of three design, build and operate a manually controlled hydraulic robotic arm.\n\nTeams build the arm from the permitted materials (plywood, thermocol, syringes, tubing and adhesives) and operate it to complete practical challenges in the arena. Every movement comes from pairs of fluid-filled syringes connected by tubing, so the event tests hydraulic systems, mechanical linkages, structural design, precision, stability, problem-solving and teamwork.\n\nEvery arm first goes through a testing round. Qualified teams then take on the main challenge: tasks such as pick and place, object transfer, stacking, an obstacle or restricted-zone challenge and a precision task. The exact arena layout and tasks are announced by the organisers before the competition.\n\nScoring is out of 100: successful task completion (40), accuracy and precision (25), hydraulic arm control (15), time efficiency (10) and stability and structural performance (10).",
                "xp": "1,500 XP",
                "difficulty": "MEDIUM",
                "iconType": "gear",
                "minTeam": 3,
                "maxTeam": 3,
                "fee": "₹100 per team",
                "unstopUrl": "https://unstop.com/o/yd4xOlN?lb=9FweNlVe&utm_medium=Share&utm_source=addovtec18719&utm_campaign=Competitions",
                "heads": [{"name": "Rokkala Nirmal", "phone": "+91 90002 61037"}],
                "timeline": { "prize": "₹13,000+ (including goodies)" },
                "rules": [
                "Each team must have exactly 3 members, and each participant may be in only one team. There is no limit on the number of teams. Team composition cannot be changed after registration without the organisers' permission.",
                "Registration fee is ₹100 per team. Prizes worth ₹13,000+ (including goodies). All team members must complete registration with valid and accurate details.",
                "Component kits are given to the first 8 teams that complete both registration and payment, on a first come, first served basis. Later teams may still take part but without an organiser-provided kit. The organisers will announce when all 8 kits are allotted.",
                "The kit contains plywood, large thermocol, 10 mL and 20 mL syringes, hydraulic tubing, Fevicol, super glue and a paper cutter. It is meant only for building the hydraulic arm.",
                "Build the arm primarily from the materials provided. All arm movement must come from the syringe-based hydraulic mechanism, and the arm must be operated manually.",
                "Syringes must be securely mounted, tubes properly connected and the system must not have significant leakage. You may design the base, structure, linkages and gripper freely within the permitted materials.",
                "Prohibited unless the organisers explicitly permit: electric or servo motors, batteries, electronic controllers, automated control systems, external powered actuators, pneumatic systems, high-pressure hydraulic systems, any motorised mechanism, or anything that gives an unfair advantage.",
                "Every arm goes through a testing round that checks hydraulic movement, lifting, gripping, joint movement, structural stability and leakage. Unsafe or non-functional arms may be rejected or stopped until fixed. Only teams that pass proceed to the main challenge.",
                "Main challenge tasks may include pick and place, object transfer, stacking, an obstacle or restricted-zone challenge and a precision task. The arena layout, objects, task order and task-specific scoring are announced before the competition.",
                "The time limit is announced before the competition. The timer starts on the judges' signal. Stop immediately when time expires. Tasks completed after the limit are not counted. Judges may stop an attempt at any time for safety.",
                "Scoring is out of 100: successful task completion 40, accuracy and precision 25, hydraulic arm control 15, time efficiency 10, and stability and structural performance 10.",
                "Penalties (severity decided by the judges): touching objects directly or moving the arm manually instead of hydraulically leads to task cancellation or score deduction. Moving or modifying the arena, using unauthorised help, continuing after time or misconduct lead to deductions, stoppage or disqualification.",
                "Safety: follow the safety officials, keep hands away from moving joints, check tubes and syringes before operating, report leaks or damage at once, apply no excessive force, no sharp modifications, and handle the paper cutter with care. Unsafe attempts will be stopped.",
                "Tie-break: more tasks completed, then higher accuracy and precision score, then better time efficiency, then an additional tie-breaking task if the organisers decide.",
                "Disqualification applies for prohibited components, motorised or electronic assistance, damaging the arena or equipment, interfering with or tampering with another team, cheating, repeated safety violations, misconduct, or anything that compromises fairness or safety.",
                "Report on schedule and attend any mandatory briefing. Keep the area clean, stay out of restricted areas and do not interfere with other teams' builds or testing. Organisers may inspect any arm at any stage.",
                "The organisers may modify the arena or task set-up and will announce changes before the relevant round. Decisions of the judges and safety officials on task validity, penalties, safety and rankings are final and binding."
]
            },
            {
                "title": "SKY FORGE",
                "subtitle": "DESIGN FOR THE SKY. BUILD FOR HEIGHT. LAUNCH FOR GLORY.",
                "desc": "SKYFORGE is a hands-on pneumatic rocket competition that introduces participants to the fundamentals of aerospace engineering through the design, construction, and launch of lightweight model rockets.",
                "overview": "SKYFORGE is the pneumatic rocket aviation challenge of Addovedi 2026, organised by the Mechanical Engineering Student's Society (MESS), NIT Arunachal Pradesh. In this two-round, hands-on competition, teams of three learn the fundamentals of aerospace engineering by designing, building and launching a lightweight model rocket.\n\nEvery rocket is launched with the same standardised syringe-based pneumatic propulsion system provided by the organisers. The goal is the maximum valid flight height, reached within all safety, dimensional, structural and competition requirements.\n\nRound 1 is rocket design and construction, followed by a technical inspection. Round 2 is the launch and maximum height challenge. Teams decide the body shape, nose cone, fin number, shape and placement, weight distribution and centre of gravity, so success depends on stability, low drag, structural strength and lightweight construction.\n\nScoring is out of 100: maximum valid flight height (70), rocket stability and flight performance (15), structural integrity (10) and rule compliance and safety (5).",
                "xp": "1,500 XP",
                "difficulty": "MEDIUM",
                "iconType": "rocket",
                "minTeam": 3,
                "maxTeam": 3,
                "fee": "₹100 per team",
                "unstopUrl": "https://unstop.com/o/UWex250?lb=9FweNlVe&utm_medium=Share&utm_source=addovtec18719&utm_campaign=Competitions",
                "heads": [{"name": "Thirumalai Nathan", "phone": "+91 63743 70906"}],
                "timeline": { "prize": "₹13,000+ (including goodies)" },
                "rules": [
                "Each team must have exactly 3 members, and each participant may be in only one team. There is no limit on the number of teams. Any change in team composition needs the organisers' approval.",
                "Registration fee is ₹100 per team. Prizes worth ₹13,000+ (including goodies). All team members must complete registration with accurate details.",
                "Construction kits are given to the first 8 teams that complete both registration and payment, on a first come, first served basis. Later teams may still take part but without a kit. The organisers will announce when all 8 kits are allocated.",
                "The kit contains small thermocol, MDF board, 10 mL and 20 mL syringes, Fevicol, super glue, saline tubing, nails, wire and basic construction materials. The organisers also provide the standard syringe-based pneumatic launcher used by every team.",
                "Round 1 is design and construction. Build the rocket only from the permitted materials. You decide the body shape, nose cone, number, shape and placement of fins, weight distribution, centre of gravity and overall geometry within the limits announced by the organisers.",
                "Dimensional and weight limits, if any, are announced by the organisers. No numerical limits apply unless officially announced. Organisers may inspect rockets at any stage of construction.",
                "Every rocket goes through technical inspection: dimensions, weight, structural integrity, attachment to the launcher, rule compliance, design safety, stability and absence of prohibited mechanisms. Only rockets that pass qualify for Round 2.",
                "Round 2 is the launch and maximum height challenge. Every team launches from the designated area with the same standard pneumatic launcher, under the coordinators' supervision. The highest valid altitude wins.",
                "The altitude measurement method is announced before the launch round, and the official measurement result is final. The number of attempts per team is announced before Round 2. If several are allowed, the best valid altitude counts.",
                "A launch is valid when the rocket is properly attached to the launcher, launched only on the official signal, from the designated area, with no unauthorised help, no prohibited propulsion and no interference, and the rocket meets all dimension, weight and safety requirements.",
                "Scoring is out of 100: maximum valid flight height 70, rocket stability and flight performance 15, structural integrity 10, rule compliance and safety 5. Appearance and creativity carry no marks.",
                "Prohibited: combustion engines, fuel, fire-based propulsion, explosives, chemical propellants, compressed gas cylinders, motorised or electric propulsion, pyrotechnics, any pressurised system other than the official launcher, and anything that gives an unfair launch advantage.",
                "Safety: follow the organisers, stay behind the safety boundary during launch, do not approach the launch area until it is declared safe, and only officials may operate the launcher. No dangerous, sharp, explosive or burning payloads. Never aim a rocket at people, buildings or restricted areas.",
                "A damaged rocket must be inspected before another attempt. Unsafe rockets may be rejected, and the organisers may stop any unsafe activity immediately. Decisions of the safety officials are final.",
                "Penalties (severity decided by the judges): unauthorised propulsion or prohibited materials lead to an invalid attempt or disqualification. Launching before the signal makes the attempt invalid with no re-launch. Entering restricted areas, interfering with another team, manipulating measurement, unauthorised help or breaking safety rules lead to deductions, invalid attempts or disqualification.",
                "Tie-break on equal altitude: higher stability score, then higher structural integrity score, then better compliance and safety score, then an additional launch if the organisers decide.",
                "Disqualification applies for prohibited propulsion or dangerous materials, deliberately breaking safety rules, tampering with the launcher or the measurement, cheating, interfering with another team, deliberate damage to equipment, repeated disobedience or anything that compromises safety or fairness.",
                "Report on schedule and attend any briefing. Keep construction and launch areas clean, do not enter restricted areas and do not interfere with other teams' rockets. The organisers may modify the launch area or procedure for safety and will announce changes before the relevant round.",
                "The decisions of the judges and organisers on validity, penalties, measurement and final rankings are final and binding. Any situation not covered is decided by the organising committee and judging panel, and any rule change is announced before it takes effect."
]
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
                "minTeam": 1,
                "maxTeam": 5,
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
                "minTeam": 1,
                "maxTeam": 5,
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
                "minTeam": 1,
                "maxTeam": 5,
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
            minTeam: s.minTeam ?? 1,
            maxTeam: s.maxTeam ?? 5,
            fee: s.fee || '',
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
            minTeam: ev.minTeam ?? 1,
            maxTeam: ev.maxTeam ?? 5,
            fee: ev.fee || '',
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

// Hosted rule-book PDFs (client/public/rulebooks), keyed by event slug
export const RULEBOOK_PDFS = {
    'robo-soccer': '/rulebooks/Addovedi-2026-robo-soccer-rulebook.pdf',
    'dune-dominator': '/rulebooks/Addovedi-2026-dune-dominator-rulebook.pdf',
    'solid-siege': '/rulebooks/Addovedi-2026-solid-siege-rulebook.pdf',
    'hydraulic-warzone': '/rulebooks/Addovedi-2026-hydraulic-warzone-rulebook.pdf',
    'sky-forge': '/rulebooks/Addovedi-2026-sky-forge-rulebook.pdf',
    'circuit-debugging': '/rulebooks/Addovedi-2026-circuit-debugging-rulebook.pdf',
};

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
