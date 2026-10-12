import re, html
FLOW = "- **Registration:** sign up on the Addovedi website, register for {ev} to get your **Team ID**, then register on Unstop with the **Team ID + the leader's Addovedi ID**."
def desc(name, tag, intro, g, rules, coord):
    return f"""# {name} · ADDOVEDI 2026
*{tag}*
{intro} Held on campus, **28-30 October 2026**.
## Guidelines
""" + "\n".join(g) + "\n## Rules\n" + "\n".join(rules) + f"\n**Coordinator:** {coord}\n"
EV = {}
EV['robo-soccer'] = dict(title='ROBO SOCCER', desc=desc('ROBO SOCCER','Where robotics meets the spirit of football!',
 "**Robo Soccer** is a **two-round robotics competition** of Addovedi 2026 (NIT Arunachal Pradesh). Teams build and **remote-control their own football robots** and play fast-paced matches to score the most goals.",
 ["- **Eligibility:** **college students**, valid **student ID** required.",
  "- **Team size:** **2 to 4 members** (leader included).",
  "- **Inter-college / inter-specialization:** **allowed**. Open to all branches.",
  "- **Problem statement:** **1**. Build a robot that can move, control the ball, defend and score.",
  "- **Rounds:** **2**. Qualifying group stage, then knockout.",
  "- **Match duration:** **5 minutes**. A tie goes to a **2-minute golden goal**, then a shoot-out or rematch.",
  FLOW.format(ev='Robo Soccer'),
  "- **Registration fee:** **Rs. 50 per member** (each team member pays Rs. 50).",
  "- **Prize pool:** **Rs. 22,000.**"],
 ["- Robot must be **remote-controlled** (wired or wireless). **No autonomous robots.**",
  "- Max size **30 x 30 x 30 cm**, max weight **5 kg**, max **12 V**. Sealed, safe batteries only.",
  "- **No hazardous, liquid or pyrotechnic parts.** Bring your own spare battery and tools.",
  "- **One operator** per match. Other members stay outside the arena.",
  "- A goal counts only when the **whole ball crosses the line**. Don't hold the ball for more than **5 seconds**.",
  "- **No damaging, flipping or trapping** the opponent's robot. Repeated fouls lead to **disqualification**.",
  "- **Jammers or signal interference = immediate disqualification.**",
  "- **Referees' and committee's decisions are final.**"],
 "Tapan Boruah, **+91 98590 40208**"),
 rounds="""# ROBO SOCCER · ROUND-WISE
## Round 1: Qualifying (Group Stage)
- **Robot inspection** before the first match.
- **Round-robin** matches within groups.
- If more than **16 teams** register, the **top 16** are shortlisted after inspection.
- **Group winners and top scorers** qualify.
## Round 2: Knockout (Final)
- **Single-elimination:** quarterfinals, then semifinals.
- **Final** decides **1st and 2nd**.
- Each match is **5 minutes**, with golden goal on a tie.
## Quick facts
- **Team:** **2 to 4**. **Fee:** **Rs. 50 per member**. **Prize:** **Rs. 22,000**.
- **Coordinator:** Tapan Boruah, **+91 98590 40208**
""")
EV['dune-dominator'] = dict(title='DUNE DOMINATOR', desc=desc('DUNE DOMINATOR','Conquer the terrain. Command the machine.',
 "**Dune Dominator** is a **two-round off-road robotics challenge** of Addovedi 2026 (NIT Arunachal Pradesh). Build a rugged rover that crosses a rough, obstacle-filled arena while **carrying sand and losing as little as possible**.",
 ["- **Eligibility:** **college students**, valid **student ID** required.",
  "- **Team size:** **2 to 4 members** (leader included).",
  "- **Inter-college / inter-specialization:** **allowed**. Open to all branches.",
  "- **Problem statement:** **1**. Cross the arena with the sand load, clearing all obstacles.",
  "- **Rounds:** **2**. Elimination round, then final round.",
  "- **Arena:** layout and obstacles revealed on the **event day**. Rounds may use **different arenas**.",
  FLOW.format(ev='Dune Dominator'),
  "- **Registration fee:** **Rs. 50 per member** (each team member pays Rs. 50).",
  "- **Prize pool:** **Rs. 20,000.**"],
 ["- **Self-powered rover**, max **24 V**. **Manual wireless control only.** No autonomous operation.",
  "- Max weight **2 kg** (without sand), max size **40 x 30 x 30 cm**.",
  "- **Sand carrier:** **10 x 10 x 5 cm** wooden box (min 3 mm), mounted on top, with a **removable lid**.",
  "- Wheels or tracks only, **non-metallic**. **No spikes, claws or sharp parts.** No active traction or active suspension.",
  "- Structure: **PVC or plywood**. No motor speed limit.",
  "- Max **5 hand touches** if stuck. **Penalty points** for the Penalty Zone or touching boundaries.",
  "- **No changes to the rover** once the competition starts. **No damaging** the arena or other rovers.",
  "- **Judges' decisions are final.**"],
 "Vaibhav Gupta, **+91 95061 77693**"),
 rounds="""# DUNE DOMINATOR · ROUND-WISE
## Round 1: Elimination Round
- Rover carries **500 g of sand**, with the **lid fixed**.
- **Cross the complete arena** and clear every obstacle.
- Performance decides who **qualifies** for Round 2.
## Round 2: Final Round
- **750 g of sand**, **top open** (no lid).
- Cross the arena with **minimum sand loss and time**.
- **Extra obstacles** may be revealed on the spot.
- **Final ranking** comes from this round.
## Judging
- **Sand retention, time, stability and control, rule discipline.** Weights announced on the event day.
## Quick facts
- **Team:** **2 to 4**. **Fee:** **Rs. 50 per member**. **Prize:** **Rs. 20,000**.
- **Coordinator:** Vaibhav Gupta, **+91 95061 77693**
""")
EV['solid-siege'] = dict(title='SOLID SIEGE', desc=desc('SOLID SIEGE','Imagine. Design. Create.',
 "**Solid Siege** is the **SolidWorks CAD competition** of Addovedi 2026 (NIT Arunachal Pradesh), organised by the **Mechanical Engineering Student's Society (MESS)**. Across **three progressively harder rounds** you turn engineering drawings into accurate, clean SolidWorks models against the clock.",
 ["- **Eligibility:** **college students**, valid **student ID** required.",
  "- **Participation:** **individual (solo)**. One registration per person; only the first counts.",
  "- **Inter-college / inter-specialization:** **allowed**. Open to all branches.",
  "- **Problem statements:** **3**, one per round.",
  "- **Rounds:** **3**. 2D sketch, 3D part, assembly.",
  "- **Duration:** a **fixed time limit** announced before each round.",
  "- **Scoring:** **10 points** (2 + 3 + 5). **Recorded time breaks ties.**",
  FLOW.format(ev='Solid Siege'),
  "- **Registration fee:** **FREE.**",
  "- **Prize pool:** **Rs. 10,00,000+.** Position-wise split announced later."],
 ["- Only those who **qualify a round in time** move to the next.",
  "- **Exact dimensions and features** are given at the start of each round. Model **exactly** as specified.",
  "- **No submissions after the time limit** unless the coordinator announces otherwise.",
  "- Submit files in the **format and location** announced.",
  "- **No external help, pre-made models or files.** Violations lead to **disqualification**.",
  "- **Report on schedule.** Don't interfere with others' systems or files.",
  "- **Official recorded times** are final for timing decisions.",
  "- **Judges' decisions are final.**"],
 "Nikhil Raj, **+91 95087 15131**"),
 rounds="""# SOLID SIEGE · ROUND-WISE
## Round 1: 2D Mechanical Bracket (2 points)
- **2D sketching.** Accurate geometry and a **clean, constrained sketch**.
- **Marks:** geometry and dimensions **1.0** + constraints **1.0**.
## Round 2: 3D Stepped Support (3 points)
- **3D part modelling.** Correct features and a **clean model tree**.
- **Marks:** geometry **1.5** + features **1.0** + finish **0.5**.
## Round 3: Wheel-Shaft Assembly (5 points, Final)
- **Assembly modelling.** Correct components and **proper mates**.
- **Marks:** components **1.5** + mates **1.5** + accuracy **1.5** + finish **0.5**.
## Progression and tie-break
- **Qualify each round within its time limit** to advance.
- **Tie-break:** compare **Round 3 time, then Round 2, then Round 1**.
## Quick facts
- **Solo.** **Fee: FREE.** **Prize: Rs. 10,00,000+**.
- **Coordinator:** Nikhil Raj, **+91 95087 15131**
""")
EV['hydraulic-warzone'] = dict(title='HYDRAULIC WARZONE', desc=desc('HYDRAULIC WARZONE','Power. Precision. Control.',
 "**Hydraulic Warzone** is the **hydraulic arm challenge** of Addovedi 2026 (NIT Arunachal Pradesh), organised by the **Mechanical Engineering Student's Society (MESS)**. Teams of three build a **manually controlled hydraulic arm** from syringes and tubing, pass a testing round and complete tasks in the arena.",
 ["- **Eligibility:** **college students**, valid **student ID** required.",
  "- **Team size:** **exactly 3 members.** One team per participant. **No limit** on number of teams.",
  "- **Inter-college / inter-specialization:** **allowed**. Open to all branches.",
  "- **Problem statement:** **1**. Build the arm and complete the announced tasks.",
  "- **Rounds:** **2**. Testing round, then main arena challenge.",
  "- **Duration:** main challenge time limit announced before the competition.",
  "- **Kits:** organiser-provided kit goes to the **first 8 teams** that register **and pay**. Others can still compete without a kit.",
  FLOW.format(ev='Hydraulic Warzone'),
  "- **Registration fee:** **Rs. 50 per member** (each team member pays Rs. 50).",
  "- **Prize pool:** **Rs. 13,000+** (including goodies)."],
 ["- Build **mainly from organiser materials**. **All movement must be hydraulic (syringes + tubing)** and **manually operated**.",
  "- **No motors, batteries, electronics, pneumatics** or anything giving an unfair advantage.",
  "- **No significant leakage.** Syringes securely mounted, tubes properly connected.",
  "- **Don't touch objects directly** or move the arm by hand. Penalties apply.",
  "- **Stop immediately** when time expires. Late tasks aren't counted.",
  "- **Safety first:** hands away from moving joints, no sharp modifications, careful with the paper cutter.",
  "- **Tie-break:** more tasks done, then accuracy, then time efficiency.",
  "- **Judges' and safety officials' decisions are final.**"],
 "Rokkala Nirmal, **+91 90002 61037**"),
 rounds="""# HYDRAULIC WARZONE · ROUND-WISE
## Round 1: Testing / Qualification
- Organisers **test every arm**: movement, lifting, gripping, joints, stability, **leakage**.
- Only **safe, working arms** qualify.
## Round 2: Main Arena Challenge (Final)
- **Tasks:** pick and place, object transfer, stacking, obstacle zone, precision task.
- **Time limit** announced before the competition.
- **Scored out of 100:** task completion **40**, accuracy **25**, arm control **15**, time **10**, stability **10**.
## Quick facts
- **Team:** **exactly 3**. **Fee:** **Rs. 50 per member**. **Prize:** **Rs. 13,000+**.
- **Kits:** first **8 paid teams**.
- **Coordinator:** Rokkala Nirmal, **+91 90002 61037**
""")
EV['sky-forge'] = dict(title='SKY FORGE', desc=desc('SKY FORGE','Design for the sky. Build for height. Launch for glory.',
 "**SKYFORGE** is the **pneumatic rocket challenge** of Addovedi 2026 (NIT Arunachal Pradesh), organised by the **Mechanical Engineering Student's Society (MESS)**. Teams of three design and build a lightweight rocket launched by the **same syringe-based launcher**. The goal: **maximum valid flight height**.",
 ["- **Eligibility:** **college students**, valid **student ID** required.",
  "- **Team size:** **exactly 3 members.** One team per participant. **No limit** on number of teams.",
  "- **Inter-college / inter-specialization:** **allowed**. Open to all branches.",
  "- **Problem statement:** **1**. Design, build and launch for maximum height.",
  "- **Rounds:** **2**. Design and construction (with inspection), then launch.",
  "- **Duration and attempts:** announced before each round.",
  "- **Kits:** organiser-provided kit goes to the **first 8 teams** that register **and pay**. Others can still compete without a kit.",
  FLOW.format(ev='Sky Forge'),
  "- **Registration fee:** **Rs. 50 per member** (each team member pays Rs. 50).",
  "- **Prize pool:** **Rs. 13,000+** (including goodies)."],
 ["- Build **only from permitted materials**. Limits (if any) are announced by organisers.",
  "- **Only the official syringe-based launcher** is allowed. **No fuel, combustion, electric or chemical propulsion, no gas cylinders, no pyrotechnics.**",
  "- Every rocket passes **technical inspection** (size, weight, strength, safety, stability).",
  "- **Launch only on the official signal**, from the designated area. **No unauthorised help.**",
  "- **Stay behind the safety boundary.** Never aim at people or buildings. Only officials operate the launcher.",
  "- **Looks and creativity carry no marks.** Height decides.",
  "- **Tie-break:** stability, then structural integrity, then compliance and safety, then extra launch.",
  "- **Judges' and safety officials' decisions are final.**"],
 "Thirumalai Nathan, **+91 63743 70906**"),
 rounds="""# SKY FORGE · ROUND-WISE
## Round 1: Rocket Design and Construction
- **Build your own rocket** from permitted materials.
- Choose **body, nose cone, fins, weight distribution, centre of gravity**.
- **Technical inspection** before launch: size, weight, strength, **safety**.
- Only rockets that **pass** go to Round 2.
## Round 2: Launch and Maximum Height (Final)
- **Same standard launcher** for every team.
- **Highest valid altitude wins.** Measurement method announced before the round.
- **Scored out of 100:** height **70**, stability and flight **15**, structure **10**, rules and safety **5**.
## Quick facts
- **Team:** **exactly 3**. **Fee:** **Rs. 50 per member**. **Prize:** **Rs. 13,000+**.
- **Kits:** first **8 paid teams**.
- **Coordinator:** Thirumalai Nathan, **+91 63743 70906**
""")
EV['circuit-debugging'] = dict(title='CIRCUIT DEBUGGING', desc=desc('CIRCUIT DEBUGGING','Understand. Simulate. Build. Debug.',
 "**Circuit Debugging** is a **three-round technical event** of Addovedi 2026 (NIT Arunachal Pradesh) that goes from **theory, to simulation, to real hardware debugging**. Observe. Measure. Diagnose. Repair. Verify.",
 ["- **Eligibility:** **college students**, valid **college ID** required.",
  "- **Team size:** **up to 2 members** (solo also fine).",
  "- **Inter-college / inter-specialization:** **allowed**. Open to all branches.",
  "- **Rounds:** **3**. Quiz, LTspice simulation, breadboard debugging.",
  "- **Duration:** Round 1 is **20 minutes**. Rounds 2 and 3 limits announced before the round.",
  "- **Scoring:** **100 marks** (30 + 30 + 40). Final rank is the **combined score**.",
  "- **Bring:** your **own laptop with LTspice installed and tested**. Organisers provide components and instruments.",
  FLOW.format(ev='Circuit Debugging'),
  "- **Registration fee:** **Rs. 50 per member** (each team member pays Rs. 50).",
  "- **Prize pool:** **Rs. 13,000+** (including goodies)."],
 ["- **Report before the reporting time** with a valid ID card.",
  "- **LTspice must be ready beforehand.** Organisers aren't responsible for laptop or software delays.",
  "- In Round 3, **diagnose before replacing**. Random replacement isn't valid debugging.",
  "- Use equipment **carefully**. **No damage or misuse.** Don't interfere with other teams.",
  "- You may be asked to **explain your work**. Organisers may inspect files and circuits.",
  "- **Unfair means or cheating = disqualification.**",
  "- Organisers may change sequence or qualification criteria and will announce it.",
  "- **Judges' and coordinators' decisions are final.**"],
 "Neeraj Bhandari, **+91 76670 58211**"),
 rounds="""# CIRCUIT DEBUGGING · ROUND-WISE
## Round 1: Circuit IQ (30 marks)
- **MCQ screening**, **20 questions**, **20 minutes**, **1.5 marks each**. **No negative marking.**
- Topics: Ohm's and Kirchhoff's laws, resistors, capacitors, diodes, transistors, fault finding.
- **Top teams qualify.** Cut-off announced.
## Round 2: Simulation Challenge (30 marks)
- Build the circuit in **LTspice** from a problem statement.
- Run the simulation and show the **required voltage, current or waveforms**.
- Bring your **own laptop** with LTspice.
## Round 3: Hardware Debugging (40 marks, Final)
- A **pre-built breadboard circuit with hidden faults**.
- **Measure, find the fault, explain, repair, and show it working.**
- Organisers provide the equipment.
## Quick facts
- **Team:** **up to 2**. **Fee:** **Rs. 50 per member**. **Prize:** **Rs. 13,000+**.
- **Coordinator:** Neeraj Bhandari, **+91 76670 58211**
""")
EV['electromind'] = dict(title='ELECTROMIND', desc=desc('ELECTROMIND','Know it. Identify it. Measure it. Build it. Solve it.',
 "**ELECTROMIND** is a **three-round technical competition** of Addovedi 2026 (NIT Arunachal Pradesh) testing **component knowledge, measurement skills and basic circuit design**: a quiz, a hands-on identify-and-measure round, and a build round.",
 ["- **Eligibility:** **undergraduate students** (any field), **all colleges welcome**. Valid **student ID** required.",
  "- **Team size:** **up to 3 members.** One registration per team; only the first counts.",
  "- **Inter-college / inter-specialization:** **allowed**.",
  "- **Rounds:** **3**. Quiz, Identify and Measure, Build the Solution.",
  "- **Round 3 problem statements:** **10**. Each team picks **one**, **first come, first served**.",
  "- **Duration:** time limits announced before each round.",
  FLOW.format(ev='Electromind'),
  "- **Registration fee:** **Rs. 50 per member** (each team member pays Rs. 50).",
  "- **Prize pool:** **Rs. 17,000+** (including goodies)."],
 ["- **No smartphones, calculators, internet or AI.** If found, the **whole team is disqualified without warning.**",
  "- Round 2 is **individual**: members go **one by one**. Team score is the **sum**.",
  "- In Round 3, **collect all components in one go** at the start. **No extra or replacement components.**",
  "- Each team chooses **only one** problem statement.",
  "- Carry a valid **student ID card**.",
  "- **Organisers' and judges' decisions are final.** Rules may be modified and will be communicated."],
 "Saurav Kumar, **+91 97987 27650**"),
 rounds="""# ELECTROMIND · ROUND-WISE
## Round 1: Electromind Quiz
- **MCQs** on electrical and electronics fundamentals.
- **Qualify** by top performance, group participation (max 3) and time.
## Round 2: Identify and Measure
- **Individual practical round** with real components.
- Each member: **identify, state applications, measure**, read values from markings.
- **Judged on** time, accuracy, identification and application.
- **Team score = sum of all members.**
## Round 3: Build the Solution (Final)
- Pick **one of 10 problem statements** (street light, temperature fan, 3-7 V supply, emergency light, water level alarm, timer light, overvoltage protection, battery indicator, motor speed control, rain alarm).
- **Select components, design, calculate, build, measure, demonstrate.**
- **Collect components once.** No extras.
## Quick facts
- **Team:** **up to 3**. **Fee:** **Rs. 50 per member**. **Prize:** **Rs. 17,000+**.
- **Coordinator:** Saurav Kumar, **+91 97987 27650**
""")
EV['energix'] = dict(title='ENERGIX', desc=desc('ENERGIX','Think. Simulate. Debug. Innovate.',
 "**ENERGIX** is a **MATLAB and Simulink competition** of Addovedi 2026 (NIT Arunachal Pradesh) testing **circuit simulation and troubleshooting**. **Three rounds**: a quiz, a simulation round and a debug-and-improve round, for **100 marks**.",
 ["- **Eligibility:** **college students**, valid **student ID** required.",
  "- **Team size:** **2 to 3 members.**",
  "- **Inter-college / inter-specialization:** **allowed**. Open to all branches.",
  "- **Rounds:** **3**. Quiz, Simulation, Debug and Improve.",
  "- **Duration:** time limits announced before each round.",
  "- **Scoring:** **100 marks** (30 + 30 + 40). Final rank is the **combined score**. Ties go to the **lowest time**.",
  "- **Bring:** a **laptop with MATLAB and Simulink installed and tested** (R2025a recommended).",
  FLOW.format(ev='Energix'),
  "- **Registration fee:** **Rs. 50 per member** (each team member pays Rs. 50).",
  "- **Prize pool:** **Rs. 17,000+** (including goodies)."],
 ["- **No unauthorised materials or help**, and **no talking to other teams** during the quiz.",
  "- **No copying or sharing solutions.** Violations are prohibited.",
  "- Make sure **MATLAB and Simulink work** before the event. All Round 2 parameters are in the problem statement.",
  "- In Round 3, **work only on the provided model** and fix faults **independently**.",
  "- **Submit work** in the format specified by organisers.",
  "- **Judges' decisions are final.** Organisers may clarify rules."],
 "Prakash Tamang and Roshni Yadav, **+91 98628 46350**"),
 rounds="""# ENERGIX · ROUND-WISE
## Round 1: Quiz Round (30 marks)
- **MATLAB basics** and an introduction to **Simulink blocks**.
- **No unauthorised help** during the quiz.
## Round 2: Simulation Round (30 marks)
- Build the circuit model in **MATLAB/Simulink** from a problem statement with **input values and a target output**.
- **Submit the model and output waveform.**
- Marks: **process, parameter tuning, output accuracy, waveform check**.
## Round 3: Debug and Improve a Circuit (40 marks, Final)
- A **Simulink model with deliberate faults**.
- **Find and fix the errors**, improve the circuit, hit the **target output**.
- **Explain your debugging** to the judges.
## Quick facts
- **Team:** **2 to 3**. **Fee:** **Rs. 50 per member**. **Prize:** **Rs. 17,000+**.
- **Coordinators:** Prakash Tamang and Roshni Yadav, **+91 98628 46350**
""")

EV['verilog'] = dict(title='VERILOG', desc=desc('VERILOG','Design. Simulate. Innovate.',
 "**Verilog** is a **two-round digital design competition** of Addovedi 2026 (NIT Arunachal Pradesh), organised by the **ECE Society**. It tests your digital logic fundamentals and your ability to **model, simulate and verify circuits in Verilog HDL**.",
 ["- **Eligibility:** **undergraduate students** of recognised institutions, **all colleges welcome**. Carry a **valid student ID card**.",
  "- **Participation:** **individual (solo)**. One registration per person; only the first counts.",
  "- **Inter-college / inter-specialization:** **allowed**. Open to all branches.",
  "- **Rounds:** **2**. Round 1 is a **qualifying round**, Round 2 is a **competitive design round**.",
  "- **Problem statements:** announced by the organisers (Round 2 problems are revealed at the time of the round).",
  "- **Duration:** announced by the organisers before each round.",
  "- **Software:** **Icarus Verilog or Vivado**, used offline, on **your own laptop**. Organisers do not provide computers.",
  FLOW.format(ev='Verilog'),
  "- **Registration fee:** **Rs. 50 per person.**",
  "- **Prize pool:** **up to Rs. 8,000 + goodies** (includes 1st and 2nd prize)."],
 ["- **No internet, mobile phones, storage devices or notes** during the rounds unless allowed.",
  "- **No AI tools, code generators or external help.**",
  "- **All work must be your own.** Copying or sharing solutions leads to **disqualification**.",
  "- Only **Icarus Verilog / Vivado** may be used. No other software or extensions.",
  "- Bring a **fully charged laptop and charger**. Organisers are **not responsible** for hardware, software or battery failure.",
  "- **Report on time**. Late entry may be refused.",
  "- Do not interfere with other participants' laptops, files or work. Follow coordinators and judges at all times.",
  "- Ties are decided by **Round 2 performance, then Round 1**. **Judges' decision is final.**"],
 "Krish Prasad, **+91 87309 56612**"),
 rounds="""# VERILOG · ROUND-WISE
## Round 1: Qualifying Round
- **Topic:** Verilog and logic design **fundamentals** (conceptual).
- **Mode:** on your **own laptop**.
- **Duration and format:** announced by the organisers.
- **Result:** **top performers qualify** for Round 2. The cut-off is announced.
## Round 2: Competitive Round (Final)
- **Task:** **advanced Verilog design problems**, revealed at the time of the round.
- **Mode:** on your **own laptop** (Icarus Verilog / Vivado).
- **Judging:** **best time**. **Correct functional simulation + speed** decide the ranking.
- **Tie-break:** Round 2 performance, then Round 1.
## Quick facts
- **Participation:** **individual**. **Fee:** **Rs. 50 per person**. **Prize:** **up to Rs. 8,000 + goodies**.
- **Coordinator:** Krish Prasad, **+91 87309 56612**
""")

EV['circuit-designing'] = dict(title='CIRCUIT DESIGNING', desc=desc('CIRCUIT DESIGNING','Design. Connect. Innovate.',
 "**Circuit Designing** is a **two-round analog electronics and circuit design competition** of Addovedi 2026 (NIT Arunachal Pradesh), organised by the **ECE Society**. It tests your analog electronics fundamentals and your ability to **design, simulate, analyse and defend circuits in LTspice**.",
 ["- **Eligibility:** **undergraduate students** from recognised institutions, **all colleges welcome**. Carry a **valid student ID card**.",
  "- **Team size:** **up to 2 members** (solo also fine). One registration per person; duplicates are ignored.",
  "- **Inter-college / inter-specialization:** **allowed**. Open to all branches.",
  "- **Rounds:** **2**. Round 1 is an **analog electronics quiz**, Round 2 is an **LTspice circuit design round with a viva**.",
  "- **Duration:** Round 1 is **30 minutes**. Round 2 time limit announced before the round.",
  "- **Scoring:** **100 marks** (25 + 75). Final score is the **combined score**.",
  "- **Software:** **LTspice**, on **your own laptop**, installed and tested beforehand. Organisers do not provide computers.",
  FLOW.format(ev='Circuit Designing'),
  "- **Registration fee:** **Rs. 50 per member** (each team member pays Rs. 50).",
  "- **Prize pool:** **Rs. 13,000+** (including goodies)."],
 ["- **No internet, mobile phones, storage devices or notes** during the rounds unless allowed.",
  "- **No AI tools, code generators or external help.**",
  "- **All work must be your own.** Copying or sharing solutions leads to **disqualification**.",
  "- Only **LTspice** may be used. No other software or extensions.",
  "- Bring a **fully charged laptop and charger**. Organisers are **not responsible** for hardware, software or battery failure.",
  "- **Report on time**. Late entry may be refused.",
  "- Do not interfere with other participants' laptops, files or work. Follow coordinators and judges at all times.",
  "- **Judges' and organising committee's decisions are final.** Rules may be modified and will be communicated."],
 "Anirudh Mishra, **+91 91404 63181**"),
 rounds="""# CIRCUIT DESIGNING · ROUND-WISE
## Round 1: Analog Electronics Quiz (25 marks)
- **25 MCQs** (20 regular + **5 star-marked**), **30 minutes**. **No negative marking.**
- Topics: **circuit analysis, semiconductor fundamentals, diode circuits, basic analog electronics**.
- The **5 star-marked questions** are used **only for tie-breaking**.
## Round 2: Circuit Design with Viva (75 marks, Final)
- **LTspice** circuit design problem with **specified requirements**.
- **Design and simulate** within the allotted time, then **demonstrate and explain** your circuit (viva).
- Topics: **RC / RL / RLC, low-pass and high-pass filters, diode circuits, rectifiers, clippers, clampers**.
- Marks split decided by the judges based on the problem.
## Tie-break
- **More correct star-marked answers** in Round 1, then **higher Round 2 score**, then an extra tie-breaker.
## Quick facts
- **Team:** **up to 2**. **Fee:** **Rs. 50 per member**. **Prize:** **Rs. 13,000+**.
- **Coordinator:** Anirudh Mishra, **+91 91404 63181**
""")

EV['line-follower'] = dict(title='LINE FOLLOWER', desc=desc('LINE FOLLOWER','Sense. Follow. Race. Conquer.',
 "**Line Follower** is a **two-round Robotics and Embedded Systems competition** of Addovedi 2026 (NIT Arunachal Pradesh), organised by the **ECE Society**. Teams build an **autonomous line-following robot** from a **fixed set of provided components**, so it's a fair test of skill, not budget.",
 ["- **Eligibility:** **college students**, valid **student ID** required.",
  "- **Team size:** **1 to 3 members.**",
  "- **Inter-college / inter-specialization:** **allowed**. Open to all branches.",
  "- **Problem statement:** **1**. Build a robot that follows a printed line track on its own.",
  "- **Rounds:** **2**. Qualifying round, then a best-of-two competitive round.",
  "- **Track:** printed **black line, 20 mm wide, on a white background**. Round 2 track is **more challenging**.",
  "- **Hardware:** **only components provided by the ECE Society**.",
  FLOW.format(ev='Line Follower'),
  "- **Registration fee:** **Rs. 50 per member** (each team member pays Rs. 50).",
  "- **Prize pool:** **Rs. 20,000** (including goodies)."],
 ["- **Only ECE Society components.** **No extra or more powerful motors, sensors, controllers or batteries.**",
  "- **No touching, moving or guiding** the robot once the run starts.",
  "- In Round 2, if the robot **loses the line**, it **restarts from the last checkpoint**.",
  "- A **re-run** is possible only for **track or timing system faults**, not for robot problems.",
  "- **Cheating or interference = immediate disqualification.**",
  "- **Judges' and organising committee's decisions are final.**",
  "- Rules may be modified for fair conduct and will be announced before implementation."],
 "Bishal Barman, **+91 81019 10731**"),
 rounds="""# LINE FOLLOWER · ROUND-WISE
## Round 1: Qualifying Round
- A **simple printed track**.
- **Complete the track** according to the guidelines.
- **No time limit.** **Successful completion** is the only qualifying criterion.
## Round 2: Best of Two (Competitive Round, Final)
- A **more challenging track**.
- **Two attempts.** The **better timing** counts.
- If the robot **loses the line**, it **restarts from the last checkpoint**.
## Final ranking
- **Round 1 = qualification.** **Round 2 = ranking by best timing.**
## Quick facts
- **Team:** **1 to 3**. **Fee:** **Rs. 50 per member**. **Prize:** **Rs. 20,000** (incl. goodies).
- **Coordinator:** Bishal Barman, **+91 81019 10731**
""")

EV['hackathon'] = dict(title='HACKATHON', desc=desc('HACKATHON','Ideate. Innovate. Build. Conquer.',
 "The **ADDOVEDI 2026 Hackathon** is a **24-hour continuous software development and innovation competition** (NIT Arunachal Pradesh), organised by **Coding Pundit, Dept. of CSE**. Build a **working MVP** for the problem statement, then pitch and demo it to the judges.",
 ["- **Eligibility:** to be announced by the organisers. Carry a **valid student ID**.",
  "- **Team size:** **2 to 4 members.** One team per participant.",
  "- **Seats:** only the **top 25 teams**, **first come, first served** by registration time.",
  "- **Format:** **24-hour continuous** hackathon, three stages: **Idea Pitch, Prototype Development, Final Demo**.",
  "- **Problem statement:** released by the organisers. A **focused, working MVP** beats a large unfinished one.",
  "- **Duration:** **24 hours.** Date, venue and clock times announced by the organisers.",
  "- **Judging:** **100 points**: problem and solution 25, UI/UX and product 25, technical implementation 25, presentation and Q&A 25.",
  FLOW.format(ev='Hackathon'),
  "- **Registration fee:** **Rs. 50 per member** (each team member pays Rs. 50).",
  "- **Prize pool:** **Rs. 30,000+** (including goodies)."],
 ["- **Any language, framework, database or API** is allowed. Deployment is optional.",
  "- **AI tools are allowed but earn no extra marks.** You must be able to **explain every important part of your code**.",
  "- Keep a **public GitHub repository** from the start. **Commit regularly.** The **repository freeze time is strict**.",
  "- **Plagiarism, collusion, faking Git history or functionality** = **disqualification**.",
  "- **Do not attack or access other teams' or organisers' systems.** Report any vulnerability you find.",
  "- **No secrets or API keys in the repo.** Credit major external resources in the README.",
  "- **Arrive on time.** Late arrivals may lose build time. Follow organisers, volunteers and judges.",
  "- **Organisers' decisions are final.** Material changes are announced to all participants."],
 "Divyanshu Gupta, **+91 96954 31255**"),
 rounds="""# HACKATHON · ROUND-WISE
## Round 1: Innovation and Idea Pitch
- **Only if more than 20 teams register.** **Top 15 teams qualify.**
- Pitch a **real problem, a feasible solution, tech stack and impact**. Answer judges' questions.
- With **20 or fewer teams**, the event **starts directly at Round 2**.
## Round 2: Prototype Development
- **Build a working MVP** for the problem statement. **Periodic progress checks** by judges and mentors.
- **Repository freeze** at a strict announced time.
- **Screening:** **5-minute presentation + 3-minute demo and Q&A.** **Top 8 teams** become finalists.
## Round 3: Final Demonstration (Final)
- **Finalists demo the submitted product**, **5-minute presentation + Q&A with faculty** (architecture, database, APIs, security).
- **Time limits are strict.**
## Judging (100 points)
- **Problem and Solution 25 · UI/UX and Product 25 · Technical Implementation 25 · Presentation and Q&A 25.**
- **Tie-break:** Problem and Solution, then Technical, then UI/UX, then Presentation.
## Quick facts
- **Team:** **2 to 4**. **Fee:** **Rs. 50 per member**. **Prize:** **Rs. 30,000+** (incl. goodies).
- **Coordinator:** Divyanshu Gupta, **+91 96954 31255**
""")

EV['mobile-legends-bang-bang'] = dict(title='MLBB TOURNAMENT', desc=desc('MLBB TOURNAMENT','Choose your hero. Master your strategy. Conquer the arena.',
 "The **MLBB Tournament** is the **Mobile Legends: Bang Bang** competition of Addovedi 2026 (NIT Arunachal Pradesh). **5-player teams** compete through **gameplay skill, teamwork and tactics**. The early matches are **online**, and the **final is played on campus**.",
 ["- **Eligibility:** **college students**, valid **student ID** required.",
  "- **Team size:** **5 members.** One registration per team; only the first counts.",
  "- **Inter-college / inter-specialization:** **allowed**. Open to all branches.",
  "- **Seats:** if more than **40 teams** register, only the **top 40** are shortlisted.",
  "- **Rounds:** **4**. Group stage, knockout, semifinals, final.",
  "- **Format:** early stage **online**, scheduled by the event committee. The **final is physical at the Institute campus**.",
  "- **Duration:** match schedule announced by the event committee.",
  FLOW.format(ev='Mobile Legends: Bang Bang'),
  "- **Registration fee:** **Rs. 100 per team.**",
  "- **Prize pool:** **Rs. 10,000 cash prize + exclusive hoodies.**"],
 ["- **A Player ID cannot be reused by another player.** Breaking this = **disqualification**. Use your **registered Player ID** all through.",
  "- Follow the **official match schedule** and the event committee's instructions.",
  "- **Qualified players must report at the Institute campus** for the physical final.",
  "- Carry a valid **student ID card**. Bring your own materials; organisers don't provide any.",
  "- **Plagiarism in submitted documents = whole team disqualified.**",
  "- **No damaging other teams, devices or equipment.** Keep proper, respectful behaviour, especially at the final.",
  "- Faculty coordinators and student volunteers **supervise and referee every match**.",
  "- **Organisers' and judges' decisions are final.** Rules may be modified and will be communicated."],
 "Nabam Rana, **+91 81319 03629**"),
 rounds="""# MLBB TOURNAMENT · ROUND-WISE
## Round 1: League / Group Stage
- **40 teams** in **4 groups of 10**.
- **Round-robin** matches inside each group.
- **Group winners advance.**
## Round 2: Knockout / Quarterfinals
- **Elimination matches** decide the **semifinalists**.
## Round 3: Semifinals
- The **4 qualified teams** compete. **Winners go to the final**, losers are out.
## Round 4: Final
- The **two semifinal winners** play the final **physically at the Institute campus**.
- Decides **1st and 2nd place.**
## Quick facts
- **Team:** **5 players.** **Fee:** **Rs. 100 per team.** **Prize:** **Rs. 10,000 cash + exclusive hoodies.**
- **Early stage online**, **final on campus.**
- **Coordinator:** Nabam Rana, **+91 81319 03629**
""")

EV['bgmi'] = dict(title='BGMI TOURNAMENT', desc=desc('BGMI TOURNAMENT','Drop in. Gear up. Survive. Conquer.',
 "The **BGMI Tournament** is the **Battlegrounds Mobile India** competition of Addovedi 2026 (NIT Arunachal Pradesh). Teams compete through **survival skill, coordination and tactics**. The early matches are **online**, and the **finals are played on campus**.",
 ["- **Eligibility:** **college students**, valid **student ID** required.",
  "- **Team size:** **up to 5 members** (a squad of 5 players). One registration per team; only the first counts.",
  "- **Inter-college / inter-specialization:** **allowed**. Open to all branches.",
  "- **Seats:** if more than **60 teams** register, only the **top 60** are shortlisted.",
  "- **Rounds:** **3**. Qualifiers, semifinals, finals.",
  "- **Format:** early stages **online**, scheduled by the event committee. The **finals are physical at the Institute campus**.",
  "- **Duration:** each round runs **3 days**. Match schedule announced by the event committee.",
  FLOW.format(ev='BGMI'),
  "- **Registration fee:** **FREE** (no entry fee).",
  "- **Prize pool:** **Rs. 22,000 + goodies**, shared among the **16 finalist teams**."],
 ["- **A Player ID cannot be reused by another player.** Breaking this = **disqualification**. Use your **registered Player ID** all through.",
  "- **Minimum 3 players present in the qualifiers and 4 in the finals**, or the team is **disqualified**.",
  "- Follow the **official match schedule** and the event committee's instructions.",
  "- **Qualified players must report at the Institute campus** for the physical finals.",
  "- **Plagiarism in submitted documents = whole team disqualified.**",
  "- **No damaging other teams, devices or equipment.** Keep proper, respectful behaviour, especially at the finals.",
  "- The event runs under **serious supervision**. Misconduct can lead to **disqualification**.",
  "- **Organisers' and judges' decisions are final.** Rules may be modified and will be communicated."],
 "Nandu Giba Tamin, **+91 76300 64979**, and Harsh Sharma, **+91 77620 67934**"),
 rounds="""# BGMI TOURNAMENT · ROUND-WISE
## Round 1: Qualifiers
- **60 teams**, **3 days**, **3 matches a day** (**9 matches**).
- The **top 24 teams** qualify for the semifinals. The rest are eliminated.
## Round 2: Semifinals
- **24 teams**, **3 days**, **4 matches a day** (**12 matches**).
- The **top 16 teams** qualify for the finals.
## Round 3: Finals
- **16 teams**, **3 days**, **4 matches a day** (**12 matches**), **physically at the Institute campus**.
- **Final standings after all matches** decide the winners and **prize positions**.
## Quick facts
- **Team:** **up to 5.** **Fee:** **FREE.** **Prize:** **Rs. 22,000 + goodies** (shared among 16 finalists).
- **Early stages online**, **finals on campus.**
- **Coordinators:** Nandu Giba Tamin, **+91 76300 64979**, and Harsh Sharma, **+91 77620 67934**
""")

EV['fifa-showdown'] = dict(title='FC 26 TOURNAMENT', desc=desc('FC 26 TOURNAMENT','Kick off. Compete. Conquer.',
 "The **FC 26 Tournament** is a **competitive 1v1 gaming event** of Addovedi 2026 (NIT Arunachal Pradesh), played on **EA SPORTS FC 26 on PlayStation 5**. A **pure knockout**: win and advance, lose and you're out. Played **on campus**.",
 ["- **Eligibility:** **college students**, valid **student ID** required.",
  "- **Participation:** **individual (1v1).** Each player represents themselves. **No substitutions.** One registration per player.",
  "- **Inter-college / inter-specialization:** **allowed**. Open to all branches.",
  "- **Game / platform:** **EA SPORTS FC 26**, **PlayStation 5**, latest official patch.",
  "- **Format:** **single-elimination knockout**, one match per round. No group stage. Byes may be given.",
  "- **Match duration:** **10 minutes per half.** **Extra time** if level, then a **penalty shootout**.",
  "- **Venue:** **National Institute of Technology, Jote.**",
  FLOW.format(ev='FC 26 Tournament'),
  "- **Registration fee:** **Rs. 100 per player.**",
  "- **Prize pool:** **Rs. 15,000** including goodies, for the **top finishers**."],
 ["- **Standard, unmodified controllers only.** **No turbo, macro or modded controllers.**",
  "- **Check settings before kick-off.** They **cannot change** once the match starts.",
  "- **No pausing** without the organiser's permission. **Quitting a match = a loss.**",
  "- **Report disconnects or technical issues to the organiser immediately.** They decide to resume or replay.",
  "- **Be ready when called.** **No-show = walkover loss.**",
  "- **Confirm the result with the organiser** before leaving the station.",
  "- **No cheating or glitch exploitation.** **No outside help or playing for someone else.**",
  "- **Respect everyone.** **No abusive, toxic or threatening behaviour.** **No damage to equipment.**",
  "- **Organisers' decisions are final.** Schedules may change for technical reasons."],
 "Tage Jarbo, **+91 87876 90625**"),
 rounds="""# FC 26 TOURNAMENT · ROUND-WISE
## Format
- **Single-elimination knockout.** **No group stage or points table.**
- Rounds, depending on player count: **Round of 32, Round of 16, Quarterfinals, Semifinals, Final.**
- **Byes** may be given if the bracket isn't full (random draw or seeding).
## Each match
- **1v1**, **10 minutes per half.**
- **Level after full time = extra time.** **Still level = penalty shootout.**
- **Winner advances**, loser is eliminated. **Both players confirm the result** with the organiser.
## Final
- The **last two players** meet in the **Final.** The winner is the **Champion.**
## Quick facts
- **Solo (1v1).** **Fee:** **Rs. 100 per player.** **Prize:** **Rs. 15,000** including goodies.
- **Venue:** NIT, Jote. **Coordinator:** Tage Jarbo, **+91 87876 90625**
""")

EV['prompt-pixel'] = dict(title='PROMPT & PIXEL', desc=desc('PROMPT & PIXEL','Prompt. Design. Build.',
 "**PROMPT & PIXEL** is an **AI-assisted web design and landing page competition** of Addovedi 2026 (NIT Arunachal Pradesh), organised by **Coding Pundit**. Design and build a **responsive landing page** for a **common theme** using **AI tools**. **Offline, individual.**",
 ["- **Eligibility:** **college students**, valid **student ID** required.",
  "- **Participation:** **individual (solo).** **Team participation is not allowed.**",
  "- **Inter-college / inter-specialization:** **allowed**. Open to all branches.",
  "- **Mode:** **offline** at the designated venue, on **your own laptop**.",
  "- **Stages:** **3**. Theme and planning, landing page development, final submission and judging.",
  "- **Problem statement:** a **common theme** announced at the **start** of the competition.",
  "- **Duration:** the **allotted competition time** is announced by the organisers.",
  "- **Judging:** **100 marks**, **no presentation round**. Submissions are evaluated directly.",
  FLOW.format(ev='Prompt and Pixel'),
  "- **Registration fee:** **Rs. 50 per participant.**",
  "- **Prize pool:** **Rs. 8,000 + goodies.**"],
 ["- **AI tools are allowed and encouraged**, within the **AI tool and model rules announced at the start**.",
  "- **Build during the competition.** **No previously completed or pre-built websites.**",
  "- **Late submissions are not considered.** Make sure your submission is **functional**.",
  "- **Copying another participant's work = disqualification.**",
  "- You may need to submit **project files, source code, AI tools used, 1-2 key prompts and a short description**.",
  "- **Bring your own laptop and accessories.** Set up your tools beforehand.",
  "- **Follow all organiser instructions** during the event. Join the **official WhatsApp group** after registering.",
  "- **Judges' decisions are final and binding.**"],
 "Anshu Kumar Gupta, **+91 98629 58644**"),
 rounds="""# PROMPT & PIXEL · ROUND-WISE
## Stage 1: Theme Announcement and Planning
- A **common theme or problem statement** is announced to everyone.
- **Understand the audience, plan the layout and UX, pick the visual style, and plan your AI usage.**
## Stage 2: Landing Page Development
- **Design and build a responsive landing page** within the allotted time.
- Use **AI chatbots, UI generation tools, frameworks, animation libraries and design tools.**
- Aim for **responsive layout, strong visuals, clear hierarchy, smooth animations and good navigation.**
## Stage 3: Final Submission and Judging (Final)
- **Submit your project** as announced. **No presentation or pitching round.**
- Judges check **functionality, desktop and mobile views, AI usage and your prompts.**
## Judging criteria (100 marks)
- **Creativity and Originality 25 · UI/UX and Visual Design 25 · Functionality and Frontend 20 · AI Usage and Prompt Engineering 15 · Responsiveness 15.**
## Quick facts
- **Solo.** **Offline.** **Fee:** **Rs. 50 per participant.** **Prize:** **Rs. 8,000 + goodies.**
- **Coordinator:** Anshu Kumar Gupta, **+91 98629 58644**
""")

EV['codathon'] = dict(title='CODATHON', desc=desc('CODATHON','Think. Code. Solve. Conquer.',
 "**CODATHON** is the **programming and Computer Science competition** of Addovedi 2026 (NIT Arunachal Pradesh), organised by **Coding Pundit**. One continuous session in **two stages**: a **20-question CS fundamentals MCQ**, then a **coding challenge**. Ranked on the **combined score**.",
 ["- **Eligibility:** to be announced by the organisers. Carry a **valid ID card**.",
  "- **Participation:** **individual (solo).** One registration per person; only the first counts.",
  "- **Inter-college / inter-specialization:** **allowed**. Open to all branches.",
  "- **Stages:** **2**. CS Fundamentals Assessment (**20 MCQs**), then Coding Challenge.",
  "- **Format:** **one continuous session**, **no break** between stages. Held **offline** on campus.",
  "- **Duration:** a **fixed limit for each stage**, announced before it begins.",
  "- **Bring:** your **own laptop with a charger.** Organisers do not provide laptops.",
  "- **Scoring:** **combined score** of both stages. Coding solutions are **auto-evaluated against test cases**.",
  FLOW.format(ev='Codathon'),
  "- **Registration fee:** **Rs. 50 per participant.**",
  "- **Prize pool:** **Rs. 13,000+** (including goodies)."],
 ["- **Work on your own laptop.** **Do not discuss questions or solutions** with anyone.",
  "- **No mobile phones, smartwatches, notes, books or unauthorised devices.**",
  "- **No AI tools, code generators or online solution sources** unless the organisers explicitly allow them.",
  "- **Do not interfere with the evaluation system, other laptops, files, accounts or the network.**",
  "- **Submissions after the time limit are not evaluated.** Report technical problems to a coordinator **immediately**.",
  "- **Plagiarism, sharing code or answers, or exploiting platform errors = disqualification.**",
  "- **Follow the coordinators' instructions.** Report on time.",
  "- **Judges' and organising committee's decisions are final.**"],
 "Riya Yadav, **+91 89575 08842**"),
 rounds="""# CODATHON · ROUND-WISE
## Stage 1: CS Fundamentals Assessment
- **20 MCQs** in the examination hall.
- Topics: **programming, DSA, OS, DBMS, networks, OOP, software engineering, aptitude and logical reasoning.**
- Tests **concepts, logic and analytical thinking.**
## Stage 2: Coding Challenge (Final)
- **Starts immediately after Stage 1**, no break.
- **Problems of increasing difficulty** within the allotted time.
- Topics: **arrays, strings, searching and sorting, recursion, hashing, stacks and queues, trees and graphs, DP, greedy.**
- **Auto-evaluated against test cases.** Checks **correctness, approach, time and space complexity.**
## Final ranking
- **Combined score** of both stages.
- **Tie-break:** **Stage 2 score, then Stage 1 score, then earlier Stage 2 finish.**
## Quick facts
- **Solo.** **Bring your own laptop.** **Fee:** **Rs. 50 per participant.** **Prize:** **Rs. 13,000+** (incl. goodies).
- **Coordinator:** Riya Yadav, **+91 89575 08842**
""")

EV['tekken-showdown'] = dict(title='TEKKEN 7 TOURNAMENT', desc=desc('TEKKEN 7 TOURNAMENT','Fight. Combo. Conquer.',
 "The **Tekken 7 Tournament** is the **1v1 fighting game competition** of Addovedi 2026 (NIT Arunachal Pradesh). Every game is a **head-to-head test of skill**: execution, reads, match-up knowledge and composure. Played **offline at the Institute campus** over **2 days**.",
 ["- **Eligibility:** **college students**, valid **student ID** required.",
  "- **Participation:** **individual (1v1).** Each player represents themselves. **No substitutions.** One registration per player.",
  "- **Inter-college / inter-specialization:** **allowed**. Open to all branches.",
  "- **Players:** about **10 to 15**. If more than **15** register, only the **top 15** are shortlisted.",
  "- **Format:** **2 days**, offline. **Day 1** qualifiers, **Day 2** final.",
  "- **Matches:** qualifiers **best-of-3**, final **best-of-5** (first to win 3 games). Each game is **3 rounds** (first to 2), **60-second round timer**.",
  "- **Game:** **Tekken 7**, latest official patch. **All characters allowed** (including DLC). **Random Select is not allowed.**",
  "- **Bring:** your **own controller and headphones**.",
  FLOW.format(ev='Tekken 7'),
  "- **Registration fee:** **FREE** (no entry fee).",
  "- **Prize pool:** **Rs. 7,000+** including goodies, for the **1st and 2nd place winners**."],
 ["- **Standard play only.** **No collusion, throwing games, playing for someone else, or outside coaching.** = **disqualification**.",
  "- **Be ready when called.** **No-show for 10 minutes = lose the set 2-0.** **Missing two scheduled matches = disqualified.**",
  "- **No pausing** without a judge's permission (**loses the game**). **Quitting or disconnecting = forfeit.**",
  "- **Report technical problems to the judge immediately**, before the next game starts.",
  "- **Confirm the result with the judge or coordinator** after every set.",
  "- **The winner keeps the same character** for the next game of the set. The loser may switch.",
  "- **No abusive language, excessive taunting or disrespect.** Warning, then possible disqualification.",
  "- **Organisers' and judges' decisions are final.** Rules may be modified and will be communicated."],
 "Harsh Sharma, **+91 77620 67934**"),
 rounds="""# TEKKEN 7 TOURNAMENT · ROUND-WISE
## Day 1: Qualifiers (offline)
- **All registered players** (about **10 to 15**) compete.
- **Pool round-robin or bracket**, decided by the organisers.
- Every match is a **best-of-3 set** (first to win 2 games).
- **Only 2 players qualify** for the final. The rest are eliminated.
## Day 2: Final (offline)
- The **2 qualified players** meet in a **best-of-5 set** (**first to win 3 games**).
- Decides the **winner, runner-up and prize positions.**
## Game settings
- **3 rounds per game** (first to 2), **60-second timer**, **random stage**, **handicap and items off**, **Rage Arts and Rage Drives allowed**.
- **All characters allowed**, **no Random Select.**
## Quick facts
- **Solo (1v1).** **Fee:** **FREE.** **Prize:** **Rs. 7,000+** including goodies (1st and 2nd).
- **Coordinator:** Harsh Sharma, **+91 77620 67934**
""")

EV['treasure-hunt'] = dict(title='TREASURE HUNT', desc=desc('TREASURE HUNT','The Hunt Begins. Can You Find What Others Cannot?',
 "**Treasure Hunt** is the **campus-wide clue-solving adventure** of Addovedi 2026 (NIT Arunachal Pradesh). Teams **decode riddles and puzzles**, reach **hidden checkpoints** and follow the trail to the **final treasure**. Fastest correct trail wins.",
 ["- **Eligibility:** **college students**, valid **student ID** required.",
  "- **Team size:** exactly **3 members** (any branch, year or institution). One member is the **team leader**. One team per participant.",
  "- **Inter-college / inter-specialization:** **allowed**.",
  "- **Format:** a **trail of clues**: solve a clue, reach the checkpoint, get the next clue, finish at the treasure. Number of rounds announced by the organisers; an **elimination round** may come first.",
  "- **Tests:** logic, observation, teamwork, navigation, technical knowledge and speed.",
  FLOW.format(ev='Treasure Hunt'),
  "- **Registration fee:** **FREE** (no entry fee).",
  "- **Prize pool:** **exciting prizes** for the winners."],
 ["- **Clues in order.** **No skipping checkpoints.** **All 3 members together** at every checkpoint.",
  "- **Do not remove, hide, damage or move clues.** **No sharing clues or answers** with other teams.",
  "- **Hints** (if offered) go only to the **team leader** and may carry a **time or point penalty**.",
  "- **Safety first:** **no running** in crowded areas, **no climbing**, **no vehicles**, stay inside the **announced boundaries**.",
  "- **Fair play:** **no following other teams**, **no outside help**. Internet/apps only if the organisers allow it for a clue.",
  "- **Ranking:** most **checkpoints** completed, then **least total time**, then **fewer hints**.",
  "- **Disqualification** for tampering with clues, unfair means, skipping checkpoints, unsafe behaviour or misconduct.",
  "- **Coordinators' decisions are final.** Rules may be modified and will be communicated."],
 "Tapan Boruah, **+91 98590 40208**"),
 rounds="""# TREASURE HUNT · ROUND-WISE
## Briefing
- **All 3 members must be present.** Hunt area, boundaries, out-of-bounds places and the **time limit** are explained.
- Each team gets its **starting clue** and any team card.
## Round 1: Qualifier (if held)
- The organisers **may hold an elimination round** first. Format announced before it begins.
## Main Hunt
- **Solve a clue, reach the checkpoint, report to the volunteer, get the next clue.**
- Clues are riddles, ciphers, pictures, puzzles, technical questions or physical tasks.
- Teams may get clues in a **different order**.
- Trail ends at the **final treasure**.
## Scoring
- Ranked by **checkpoints completed**, then **total time (with penalties)**, then **fewer hints**.
- Ties: fewer hints, fewer penalties, earlier last checkpoint, then a short tie-breaker.
## Quick facts
- **Teams of 3.** **Fee:** **FREE.** **Prize:** **exciting prizes.**
- **Coordinator:** Tapan Boruah, **+91 98590 40208**
""")

EV['real-cricket-24'] = dict(title='REAL CRICKET 24', desc=desc('REAL CRICKET 24','Play the Game. Own the Pitch.',
 "**Real Cricket 24** is the **cricket gaming event** of Addovedi 2026 (NIT Arunachal Pradesh). A **1v1 knockout tournament** where **timing, strategy, reflexes and sportsmanship** decide the champion. Played **offline at the Institute campus** on the equipment provided.",
 ["- **Eligibility:** **college students**, valid **student ID** required.",
  "- **Participation:** **individual (1v1).** One registration per player (only the first counts).",
  "- **Inter-college / inter-specialization:** **allowed**. Open to all branches.",
  "- **Format:** **knockout**: Qualifiers, Knockouts, Semi-final, Final. Only winners advance. Match length and best-of format are announced by the organisers.",
  "- **Equipment:** systems and accounts provided by the organisers. **Own controller or headset only if allowed.**",
  FLOW.format(ev='Real Cricket 24'),
  "- **Registration fee:** **FREE** (no entry fee).",
  "- **Prize pool:** **exciting prizes** for the winners."],
 ["- **No cheating:** **no hacks, mods, scripts, macros or bug exploits.**",
  "- **No match-fixing, collusion or playing under another name.** = **disqualification**.",
  "- **Be ready when called.** A player not present may get a **walkover or be disqualified.**",
  "- **Report technical problems to the referee before the match begins.**",
  "- **Confirm the result with the referee** after every match.",
  "- **Ties:** extra round, then sudden death, then referee decision.",
  "- **No abusive or offensive behaviour.** Warning, then possible disqualification.",
  "- **Referees' and organisers' decisions are final.** Rules may be modified and will be communicated."],
 "Vaibhav Gupta, **+91 95061 77693**"),
 rounds="""# REAL CRICKET 24 · ROUND-WISE
## Stage 1: Qualifiers
- **All registered players** are matched in the bracket (random or seeded).
## Stage 2: Knockouts
- **Only winners advance.** Match length and best-of format announced by the organisers.
## Stage 3: Semi-final
- The **last 4 players** play for a place in the final.
## Stage 4: Final
- The **2 finalists** play for the **champion title.**
## Ties and results
- **Extra round, then sudden death, then referee decision.**
- Both players **confirm the result with the referee.**
## Quick facts
- **Solo (1v1).** **Fee:** **FREE.** **Prize:** **exciting prizes.**
- **Coordinator:** Vaibhav Gupta, **+91 95061 77693**
""")

EV['edge-of-collapse'] = dict(title='EDGE OF COLLAPSE', desc=desc('EDGE OF COLLAPSE','Design Light. Build Strong. Hold the Load.',
 "**Edge of Collapse** is the **bridge model engineering** competition of Addovedi 2026 (NIT Arunachal Pradesh). Teams build a **lightweight three-hinged bridge** that must carry the **maximum load**. The winner has the **highest load-to-self-weight ratio.**",
 ["- **Eligibility:** **college students**, valid **student ID** required.",
  "- **Team size:** **3 to 4 members.** One bridge per team.",
  "- **Inter-college / inter-specialization:** **allowed**. Open to all branches.",
  "- **Materials:** **popsicle sticks** and **water-based white glue (PVA)** only. **No metal, plastic, cardboard, bamboo or pre-made parts.**",
  "- **Size:** **50 cm** long, **45 cm clear span**, deck at least **5 cm wide**, **three-hinged**, no anchoring.",
  "- **Rounds:** **Design and Inspection**, **Knowledge of the Bridge**, **Load Test.**",
  FLOW.format(ev='Edge of Collapse'),
  "- **Registration fee:** **Rs. 50 per member** (**Rs. 150** for 3, **Rs. 200** for 4).",
  "- **Prize pool:** **Rs. 8,000 cash** (total worth **Rs. 17,000** including hoodies)."],
 ["- **Build in advance** and bring the finished bridge. **No changes after weighing and submission.** Glue must be **fully cured.**",
  "- **Prohibited materials or exceeding size or weight limits = immediate disqualification** and no prizes.",
  "- **5 minutes** per team at the testing station. **Stay behind the safety line.**",
  "- **Ranking:** efficiency ratio (**max load / self-weight**). Tie: **lighter bridge**, then **lower deflection**.",
  "- **Do not damage other teams' models or equipment.** Misconduct = disqualification.",
  "- **Judges' and organisers' decisions are final.** Rules may be modified and will be communicated."],
 "Dikenno Pul, **+91 69091 25886** · Mission Doley (**phone number to be announced**)"),
 rounds="""# EDGE OF COLLAPSE · ROUND-WISE
## Round 1: Design and Inspection
- Every bridge is **measured by the judges.**
- Judges assess **neatness, joint quality and originality** of the design.
- A bridge that **does not meet the specifications is disqualified.**
## Round 2: Knowledge of the Bridge
- Teams are **questioned on the bridge they built.**
- Judges assess the team's **practical knowledge** of their own bridge.
## Round 3: Load Test
- **One official test.** Bridge on two supports, **load added in equal steps** at mid-span.
- Ends when the bridge **fractures, a joint separates or deflection exceeds the limit.**
- **Maximum load held** is recorded. **Efficiency ratio = max load / self-weight.**
## Quick facts
- **Teams of 3 to 4.** **Fee:** **Rs. 50 per member.** **Prize:** **Rs. 8,000 cash** (worth **Rs. 17,000** with hoodies).
- **Coordinators:** Dikenno Pul, **+91 69091 25886** · Mission Doley (phone to be announced)
""")

EV['the-seismic-arena'] = dict(title='THE SEISMIC ARENA', desc=desc('THE SEISMIC ARENA','Build Tall. Build Smart. Survive the Shake.',
 "**The Seismic Arena** is the **tower model engineering** challenge of Addovedi 2026 (NIT Arunachal Pradesh). Build a **tower** that survives a **looks test**, a **shake-and-water stability test** and a **strength test**. Tests **stability, bracing, damping and centre of mass.**",
 ["- **Eligibility:** **undergraduate and graduate students** of recognized institutions, valid **student ID** required.",
  "- **Team size:** **up to 3 members** (1 to 3). One entry per team.",
  "- **Inter-college / inter-specialization:** **allowed**. Open to all branches.",
  "- **Materials:** **popsicle sticks, toothpicks, Fevicol, Fevi Quick and thermocol** only. Frame in **sticks and toothpicks**, **thermocol for the base only.**",
  "- **Size:** tower at least **30 cm** tall, with a top platform for the payload.",
  "- **Rounds:** **Looks Test**, **Stability Test (water on top)**, **Strength Test (load).**",
  "- **Bring:** your **own materials and tools.** The organisers provide none.",
  FLOW.format(ev='The Seismic Arena'),
  "- **Registration fee:** **Rs. 50 per member** (**Rs. 50** for 1, **Rs. 100** for 2, **Rs. 150** for 3).",
  "- **Prize pool:** **Rs. 8,000 cash** (total worth **Rs. 17,000** including hoodies)."],
 ["- **Only the 5 permitted materials.** Thermocol for the **base plate only.**",
  "- **Submit before the deadline** at the registration desk. Models are tagged with a **team ID.**",
  "- **5 minutes** per team at the testing station.",
  "- **Originality is checked.** **Plagiarism or fraudulent methods = immediate disqualification.**",
  "- **Never touch or tamper with another team's structure or equipment.**",
  "- **Arrive on time.** Late arrivals may lose build or round time.",
  "- **Judges' and organisers' decisions are final.** Rules may be modified and will be communicated."],
 "Chochong Tsering, **+91 92336 02960** · Kaling Yapi, **+91 93628 13564**"),
 rounds="""# THE SEISMIC ARENA · ROUND-WISE
## Round 1: Design and Presentation (Looks Test)
- Judges inspect every structure.
- Marks for **structural concept, construction quality, bracing, joint neatness and presentation.**
## Round 2: Stability Test (Water on Top)
- A **water-filled container** is placed on top and the tower is **subjected to motion.**
- Judges evaluate **balance, damping and how much water is dispersed.**
## Round 3: Strength Test (External Load)
- **Incremental load** is applied at the top platform.
- Assesses **load-bearing capacity** and the **ultimate failure limit.**
## Quick facts
- **Teams of up to 3.** **Fee:** **Rs. 50 per member.** **Prize:** **Rs. 8,000 cash** (worth **Rs. 17,000** with hoodies).
- **Coordinators:** Chochong Tsering, **+91 92336 02960** · Kaling Yapi, **+91 93628 13564**
""")

EV['brainwave-bonanza'] = dict(title='BRAINWAVE BONANZA', desc=desc('BRAINWAVE BONANZA','Think Fast. Think Sharp. Forge the Answer.',
 "**Brainwave Bonanza** is the **logic and aptitude competition** of Addovedi 2026 (NIT Arunachal Pradesh). Teams solve **logic, aptitude and technical problems** under **strict time limits** across **3 rounds worth 100 points**. Ranked on **accuracy, speed and quality of reasoning.**",
 ["- **Eligibility:** **undergraduate and graduate students** from any field, valid **student ID** required.",
  "- **Team size:** **up to 3 members** (1 to 3). One entry per team. **Same members in every round**, no substitution.",
  "- **Inter-college / inter-specialization:** **allowed**. Open to all branches.",
  "- **Rounds:** **Screening Quiz (20)**, **Puzzle Gauntlet (50)**, **Rapid Forge (30)**, buzzer-style final.",
  "- **Not allowed:** **phones, smartwatches, calculators (unless allowed), internet, notes and AI tools.**",
  FLOW.format(ev='Brainwave Bonanza'),
  "- **Registration fee:** **Rs. 50 per member** (**Rs. 50** for 1, **Rs. 100** for 2, **Rs. 150** for 3).",
  "- **Prize pool:** **Rs. 8,000 cash** (total worth **Rs. 25,000** including hoodies)."],
 ["- **No cheating or prohibited devices.** = **immediate disqualification** and no prizes.",
  "- **No talking to other teams** or taking outside help during a round.",
  "- **Report 15 minutes early.** Late teams may get **no extra time.**",
  "- **Submit answer sheets the moment time is called.**",
  "- **The organisers' answer key is final.** Challenges only **in writing, right after the round.**",
  "- **Wrong answers in the final may carry negative marking.**",
  "- **Plagiarism disqualifies the whole team.**",
  "- **Judges' and organisers' decisions are final.** Rules may be modified and will be communicated."],
 "Saloni Nand, **+91 70858 33096**"),
 rounds="""# BRAINWAVE BONANZA · ROUND-WISE
## Round 1: Screening Quiz (20 points)
- **Written or online quiz** of aptitude, logical reasoning and basic technical questions.
- Ties broken by **time taken to submit.**
- Only the **top teams qualify** for Round 2.
## Round 2: Puzzle Gauntlet (50 points)
- **Puzzles and problems of increasing difficulty** within the time limit.
- Each problem has **pre-announced marks.** **Partial marks** for partially correct reasoning.
- **Show your working** where asked.
## Final Round: Rapid Forge (30 points)
- **Live buzzer-style round** among the finalist teams.
- Correct answers earn points, wrong answers **may carry negative marking.**
- **Highest total score wins.** Ties: **tie-breaker question.**
## Quick facts
- **Teams of up to 3.** **Fee:** **Rs. 50 per member.** **Prize:** **Rs. 8,000 cash** (worth **Rs. 25,000** with hoodies).
- **Coordinator:** Saloni Nand, **+91 70858 33096**
""")

def inline(t):
    t = html.escape(t)
    t = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', t)
    t = re.sub(r'(?<!\*)\*([^*]+)\*(?!\*)', r'<i>\1</i>', t)
    return t
def to_html(src):
    out=[]; ul=False
    for ln in src.strip().split('\n'):
        if ln.startswith('- '):
            if not ul: out.append('<ul>'); ul=True
            out.append(f'<li>{inline(ln[2:])}</li>'); continue
        if ul: out.append('</ul>'); ul=False
        if ln.startswith('## '): out.append(f'<h3>{inline(ln[3:])}</h3>')
        elif ln.startswith('# '): out.append(f'<h2>{inline(ln[2:])}</h2>')
        else: out.append(f'<p>{inline(ln)}</p>')
    if ul: out.append('</ul>')
    return '\n'.join(out)
def to_txt(src):
    out=[]
    for ln in src.strip().split('\n'):
        if ln.startswith('# '): out.append(ln[2:])
        elif ln.startswith('## '): out.append('\n'+ln[3:]+':')
        elif ln.startswith('- '): out.append('* '+ln[2:])
        else: out.append(re.sub(r'^\*([^*]+)\*$', r'\1', ln))
    return '\n'.join(out)+'\n'
STYLE="body{font-family:Arial,sans-serif;max-width:760px;margin:30px auto;line-height:1.5;color:#111;padding:0 16px}h2{margin:28px 0 6px}h3{margin:18px 0 4px}li{margin:4px 0}hr{margin:40px 0;border:0;border-top:2px dashed #999}.note{background:#fff7d6;padding:10px 14px;border-radius:6px;font-size:14px}"
allt=[]
words={}
for k,e in EV.items():
    page=f"""<!doctype html><html><head><meta charset="utf-8"><title>{e['title']} · Unstop text</title><style>{STYLE}</style></head><body>
<p class="note">Select a section below, copy it, and paste it into Unstop's description box. The <b>bold</b> formatting carries over.</p>
<h1 style="margin-top:24px">1. Description</h1>
{to_html(e['desc'])}
<hr>
<h1>2. Round-wise breakdown</h1>
{to_html(e['rounds'])}
</body></html>"""
    open(f'{k}-unstop-text.html','w').write(page)
    allt.append(f"{'='*60}\n{e['title']}\n{'='*60}\n\nDESCRIPTION\n\n{to_txt(e['desc'])}\n\nROUND-WISE\n\n{to_txt(e['rounds'])}")
    words[k]=(len(e['desc'].split()),len(e['rounds'].split()))
open('all-events-unstop-text.txt','w').write('\n\n\n'.join(allt))
print(words)

# ---- single page with every event + copy buttons ----
nav=''.join(f'<a href="#{k}">{e["title"].title()}</a>' for k,e in EV.items())
secs=[]
for k,e in EV.items():
    secs.append(f'''<section id="{k}">
<h1>{e["title"]}</h1>
<div class="card"><div class="bar"><b>Description</b><button onclick="cp('{k}-d',this)">Copy description</button></div><div id="{k}-d" class="body">{to_html(e["desc"])}</div></div>
<div class="card"><div class="bar"><b>Round-wise breakdown</b><button onclick="cp('{k}-r',this)">Copy round-wise</button></div><div id="{k}-r" class="body">{to_html(e["rounds"])}</div></div>
</section>''')
CSS2="""body{font-family:Arial,sans-serif;max-width:860px;margin:0 auto;padding:0 16px 60px;line-height:1.5;color:#111;background:#f6f7fb}
header{position:sticky;top:0;background:#fff;border-bottom:1px solid #ddd;padding:10px 0;z-index:5}
header a{display:inline-block;margin:3px 8px 3px 0;padding:4px 10px;border:1px solid #bbb;border-radius:14px;font-size:13px;color:#222;text-decoration:none;background:#fafafa}
header a:hover{background:#e9eefc}
h1{margin:36px 0 10px;font-size:26px}
.card{background:#fff;border:1px solid #ddd;border-radius:8px;margin:14px 0}
.bar{display:flex;justify-content:space-between;align-items:center;padding:10px 14px;border-bottom:1px solid #eee;background:#fafbff;border-radius:8px 8px 0 0}
.bar button{background:#2f5bea;color:#fff;border:0;padding:8px 14px;border-radius:6px;cursor:pointer;font-size:14px}
.bar button.done{background:#1e9e5a}
.body{padding:6px 18px 14px}
.body h2{font-size:18px;margin:12px 0 4px}.body h3{font-size:15px;margin:14px 0 4px}.body li{margin:4px 0}.body p{margin:6px 0}
.tip{background:#fff7d6;padding:10px 14px;border-radius:6px;font-size:14px;margin:16px 0}"""
JS="""function cp(id,btn){const el=document.getElementById(id);const html=el.innerHTML,txt=el.innerText;
const ok=()=>{const t=btn.textContent;btn.textContent='Copied!';btn.classList.add('done');setTimeout(()=>{btn.textContent=t;btn.classList.remove('done')},1600)};
if(navigator.clipboard&&window.ClipboardItem){navigator.clipboard.write([new ClipboardItem({'text/html':new Blob([html],{type:'text/html'}),'text/plain':new Blob([txt],{type:'text/plain'})})]).then(ok).catch(fb)}else fb();
function fb(){const r=document.createRange();r.selectNodeContents(el);const s=getSelection();s.removeAllRanges();s.addRange(r);try{document.execCommand('copy');ok()}catch(e){alert('Select the text and copy it manually.')}s.removeAllRanges()}}"""
open('all-events-unstop-text.html','w').write(f"""<!doctype html><html><head><meta charset="utf-8"><title>Addovedi 2026 · Unstop texts</title><style>{CSS2}</style></head><body>
<header>{nav}</header>
<p class="tip">Click <b>Copy</b> on a section, then paste into Unstop's description box. The <b>bold</b> formatting is kept.</p>
{''.join(secs)}
<script>{JS}</script></body></html>""")
print('combined page written')
