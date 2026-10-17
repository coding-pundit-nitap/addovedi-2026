import re, html, base64, sys
logo = base64.b64encode(open('client/src/assets/images/addovedi-logo-white.png','rb').read()).decode()
CF = lambda t: f'[CONFIRM: {t}]'

EVENTS = {
 'robo-soccer': dict(
  title='ROBO SOCCER', tagline='Where Robotics Meets the Spirit of Football!', art='soccer',
  intro=["Robo Soccer is a two-round robotics competition where teams design, build and control their own robots to play a fast-paced football match. Use your robot's speed, strength, precision and strategy to outplay the opponent and score the maximum number of goals.",
         "Teams of two to four members each design, assemble and tune a remote-controlled football robot, so the contest tests mechanical design, electronics, control and teamwork."],
  desc=["Participants must build a robust robot that can move across the arena, control the ball, defend its goal and attack the opponent. Every match demands a perfect combination of mechanical design, electronics, control systems, teamwork and strategy.",
        "The qualifiers and the final matches will be played physically on the Institute campus."],
  format=[('ROUND 1 — QUALIFYING ROUND',[
            "Each team will consist of 2 to 4 members (team leader included).",
            "Every robot goes through technical inspection before its first match.",
            f"Teams are divided into groups and play round-robin matches within the group. If more than {CF('16')} teams register, only the top {CF('16')} teams will be shortlisted after robot inspection.",
            "Winners and top-scoring teams of each group qualify for Round 2."]),
          ('ROUND 2 — KNOCKOUT ROUND',[
            "Qualified teams play single-elimination matches: quarterfinals, then semifinals.",
            "The two semifinal winners play the final match to decide the 1st and 2nd positions.",
            f"Each match is played for {CF('5 minutes')}. If the score is tied, a {CF('2 minutes')} golden-goal period is played, then a penalty shoot-out or a rematch."]),
          ('REGISTRATION FEE',["₹50 per member."])],
  spec_title='ARENA AND ROBOT SPECIFICATION',
  spec=[('ARENA SPECIFICATION',[
            "The matches are played in a marked football arena with two goals and a ball, shown to the teams before the event."]),
        ('ROBOT SPECIFICATION RULE',[
            "The robot must be wired or wireless remote-controlled by the team. Autonomous robots are not allowed unless announced.",
            f"Maximum robot size: {CF('30 cm x 30 cm x 30 cm')} and maximum weight: {CF('5 kg')}.",
            f"Maximum operating voltage: {CF('12 V')}. Batteries must be sealed and safe.",
            "Pyrotechnic, liquid-based or otherwise hazardous parts are strictly prohibited.",
            "Each team must bring a spare battery and basic tools. The organisers will not provide components."])],
  rules=["Only one team member may operate the robot during a match. Other members must stay outside the arena.",
         "A goal is counted only when the whole ball crosses the goal line.",
         f"Robots must not hold, lift or trap the ball for more than {CF('5 seconds')}.",
         "Intentionally damaging, flipping or trapping the opponent's robot is a foul. Repeated fouls lead to a warning, a goal penalty and then disqualification.",
         f"A robot that is immobilised for more than {CF('10 seconds')} is declared out of play and the referee may restart the match.",
         f"A team that is not ready within {CF('3 minutes')} of being called forfeits the match.",
         "Jammers, signal interference or any unfair electronic or mechanical method lead to immediate disqualification.",
         "The decision of the referees and the organizing committee regarding scoring, penalties and disqualification is final and binding. The organizers may modify or clarify the rules for fair conduct, and any change will be announced before implementation."],
  ranking="Round 1 determines qualification through the group matches. Round 2 determines the final ranking through the knockout matches and the final.",
  prize='₹22,000',
  coordinator=('Tapan Boruah','+91 98590 40208','tapanboruah2008@gmail.com')),
 'dune-dominator': dict(
  title='DUNE DOMINATOR', tagline='Conquer the Terrain. Command the Machine.', art='dune',
  intro=["Dune Dominator is a two-round off-road robotics challenge. Teams build a rugged, load-carrying rover that must cross a rough, obstacle-filled arena while keeping as much of its sand load as possible.",
         "It is not a race of speed alone. It tests traction, balance, control and engineering judgement under pressure, and every bump, slope and boundary punishes weak design choices."],
  desc=["Teams of two to four members design a rover that hauls sand across uneven, mechanically demanding terrain while losing as little material and time as possible. From wheel and suspension design to motor control and overall stability, every engineering decision can decide between getting stuck and conquering the dunes.",
        "The event will be conducted physically on the Institute campus."],
  pages=[
   [('h2','Event Format'),
    ('h3','ROUND 1 — ELIMINATION ROUND'),
    ('ul',["Each team consists of 2 to 4 members (team leader included).",
           "The rover carries 500 g of sand inside the sand carrier, with the lid properly fixed.",
           "The rover must cross the complete arena and clear every obstacle on the way.",
           "Standard gameplay and technical rules apply. Performance in this round decides qualification for Round 2."]),
    ('h3','ROUND 2 — FINAL ROUND'),
    ('ul',["Only the teams qualified from Round 1 take part.",
           "750 g of sand is placed in the sand carrier, with the top left open (no lid).",
           "The rover must cross the entire arena while losing as little sand and taking as little time as possible.",
           "Extra obstacles or changes to the arena may be introduced and revealed on the spot.",
           "The final rankings are decided on the final score of this round."]),
    ('h3','REGISTRATION FEE'),
    ('ul',["₹50 per member."]),
    ('h2','Arena Specification'),
    ('ul',["The arena layout, obstacle set-up and detailed specifications will be revealed on the event day.",
           "Round 1 and Round 2 may use different arenas, with different layouts, obstacle types and difficulty.",
           "The arena imitates uneven off-road terrain and tests the rover's stability, traction and load retention.",
           "It includes tunnels, bridges and banked sections, along with surprise obstacles revealed during the event.",
           "The terrain is uneven and mechanically demanding, so build a robust, stable and adaptable rover."])],
   [('h2','Rover Specification'),
    ('ul',["Only self-powered rovers are allowed, with a maximum battery voltage of 24 V.",
           "The rover must be controlled manually at all times through a wireless control system. Autonomous or pre-programmed operation is strictly prohibited.",
           "Maximum rover weight: 2 kg (excluding the sand).",
           "Maximum dimensions: 40 cm x 30 cm x 30 cm (L x B x H).",
           "Motors: there is no speed restriction.",
           "Structural material: PVC or plywood is permitted."]),
    ('h3','SAND CARRIER'),
    ('ul',["A cuboidal box of 10 cm x 10 cm x 5 cm (L x B x H).",
           "Made of wood sheet with a minimum thickness of 3 mm.",
           "Mounted on the upper side of the rover.",
           "A separate, removable lid must be provided to cover the top of the carrier."]),
    ('h3','WHEELS AND TRACKS'),
    ('ul',["The rover must use wheels or continuous tracks to move. There is no limit on their number.",
           "Spikes, claws, screws, sharp protrusions or any feature that can damage the arena are prohibited.",
           "Active traction mechanisms that change the wheel or track geometry during a run are not permitted.",
           "Wheels or tracks must be non-metallic."]),
    ('h3','SUSPENSION'),
    ('ul',["Passive suspension systems are permitted.",
           "Active or electronically controlled suspension is not allowed.",
           "Suspension parts must be mechanically stable and must not change the rover's geometry during a run."])],
   [('h2','Gameplay Rules'),
    ('ul',["The rover must start from the designated start point when the timer begins.",
           "The rover must cover the complete track and cross all the obstacles.",
           "A maximum of 5 hand touches are allowed if the rover gets stuck or goes off track.",
           "Penalty points are deducted if the rover enters the designated Penalty Zone or touches the arena boundaries.",
           "The rover should keep sand loss and completion time to a minimum."]),
    ('h2','Judging Criteria'),
    ('ul',["Sand Retention: the amount of sand left in the carrier at the end of the run.",
           "Time Efficiency: the time taken to reach the designated end point.",
           "Stability and Control: stability of the rover on the course, including body roll, pitching and control on uneven terrain.",
           "Operational Discipline: following the gameplay rules, including hand touches, boundary violations and entry into Penalty Zones.",
           "The detailed scoring method, the weightage of each factor and the penalty values will be revealed on the event day and applied equally to all teams."]),
    ('h2','Fair-Play and Rover Rules'),
    ('ol',["Inter-college teams are permitted.",
           "The rover must not intentionally damage the arena or other teams' rovers.",
           "Once the competition starts, no changes, disassembly or modifications to the rover are allowed until the results are declared.",
           "Any form of cheating, tampering with the arena or intentional interference leads to disqualification.",
           "The organizers may modify the rules, arena specifications or judging criteria for a smooth and fair competition, and any change will be announced.",
           "The decisions of the judges and event managers are final and binding in case of any dispute."]),
    ('h2','Final Ranking'),
    ('p',"Round 1 determines qualification by completing the arena. Round 2 determines the final ranking using the final score of that round.")]],
  prize='₹20,000',
  coordinator=('Vaibhav Gupta','+91 95061 77693','vaibhav-vgz317981@gmail.com')),
}

ART = {
'soccer': '''<svg viewBox="0 0 600 240" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b0f4a"/><stop offset="1" stop-color="#0a2a3f"/></linearGradient></defs>
<rect width="600" height="240" fill="url(#g)"/>
<g stroke="#00d9ff" stroke-width="2" fill="none" opacity=".85"><rect x="40" y="60" width="520" height="150"/><line x1="300" y1="60" x2="300" y2="210"/><circle cx="300" cy="135" r="32"/><rect x="40" y="95" width="46" height="80"/><rect x="514" y="95" width="46" height="80"/></g>
<g><rect x="150" y="120" width="58" height="34" rx="6" fill="#b784ff"/><circle cx="160" cy="158" r="11" fill="#ffd54a"/><circle cx="198" cy="158" r="11" fill="#ffd54a"/><rect x="170" y="108" width="20" height="14" fill="#00d9ff"/></g>
<g><rect x="390" y="108" width="58" height="34" rx="6" fill="#ff4f7b"/><circle cx="400" cy="146" r="11" fill="#ffd54a"/><circle cx="438" cy="146" r="11" fill="#ffd54a"/><rect x="410" y="96" width="20" height="14" fill="#00d9ff"/></g>
<circle cx="300" cy="135" r="12" fill="#fff"/><circle cx="300" cy="135" r="12" fill="none" stroke="#111" stroke-width="2" stroke-dasharray="6 4"/></svg>''',
'dune': '''<svg viewBox="0 0 600 240" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a1466"/><stop offset=".6" stop-color="#d4693a"/><stop offset="1" stop-color="#f0a652"/></linearGradient></defs>
<rect width="600" height="240" fill="url(#s)"/><circle cx="470" cy="80" r="38" fill="#ffd9a0" opacity=".9"/>
<path d="M0 190 Q110 120 220 175 T440 160 T600 150 V240 H0Z" fill="#c9792f"/><path d="M0 215 Q150 165 300 205 T600 190 V240 H0Z" fill="#a85f22"/>
<g><rect x="250" y="138" width="86" height="34" rx="8" fill="#1b1442"/><rect x="268" y="124" width="46" height="18" rx="4" fill="#00d9ff"/><circle cx="268" cy="178" r="17" fill="#111"/><circle cx="268" cy="178" r="8" fill="#ffd54a"/><circle cx="320" cy="178" r="17" fill="#111"/><circle cx="320" cy="178" r="8" fill="#ffd54a"/></g></svg>''',
}

CSS = """
@page { size: A4; margin: 0 }
*{box-sizing:border-box}html,body{margin:0;padding:0}
body{font-family:'Helvetica Neue',Arial,sans-serif;color:#e9e6ff;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{width:210mm;height:297mm;position:relative;padding:13mm 13mm 14mm;overflow:hidden;page-break-after:always;
  background:radial-gradient(circle at 85% 8%,rgba(160,60,255,.55),transparent 38%),radial-gradient(circle at 10% 92%,rgba(0,200,255,.30),transparent 40%),radial-gradient(circle at 90% 70%,rgba(120,40,220,.35),transparent 35%),linear-gradient(160deg,#14072f 0%,#0a0a2a 45%,#1a0a3f 100%)}
.page:last-child{page-break-after:auto}
.grid{position:absolute;inset:0;background-image:linear-gradient(rgba(150,120,255,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(150,120,255,.07) 1px,transparent 1px);background-size:9mm 9mm}
.frame{position:absolute;inset:6mm;border:1px solid rgba(190,150,255,.55)}
.logo{display:block;margin:2mm auto 5mm;height:15mm;position:relative}
.cover-title{position:relative;text-align:center;font-weight:800;font-size:34pt;letter-spacing:.14em;color:#fff;margin:10mm 0 2mm;text-shadow:0 0 18px rgba(0,217,255,.9),0 0 40px rgba(160,60,255,.8)}
.tagline{position:relative;text-align:center;color:#7fe7ff;font-style:italic;letter-spacing:.1em;font-size:10.5pt;margin-bottom:6mm}
.panel{position:relative;background:rgba(8,6,30,.8);border:1px solid rgba(120,100,255,.35);border-radius:3mm;padding:6mm 8mm}
.hero{border-radius:2mm;overflow:hidden;margin-bottom:5mm;border:1px solid rgba(0,217,255,.35)}
.hero svg{display:block;width:100%;height:auto}
h2{font-size:13.5pt;color:#fff;margin:5mm 0 2mm;letter-spacing:.04em}
h2:first-child{margin-top:0}
h3{font-size:10pt;color:#7fe7ff;letter-spacing:.06em;margin:4mm 0 1.2mm}
p{font-size:9.8pt;line-height:1.55;margin:0 0 2.4mm}
ul{margin:0 0 2mm;padding:0;list-style:none}
li{font-size:9.8pt;line-height:1.5;padding-left:5mm;position:relative;margin-bottom:1.2mm}
li:before{content:'\\25B8';position:absolute;left:0;color:#b784ff}
ol{margin:0;padding-left:6mm}ol li{padding-left:1mm;margin-bottom:2mm}ol li:before{content:none}
.contact{font-size:10.5pt;line-height:1.7}
.contact b{color:#fff}
.cf{background:rgba(255,214,0,.2);color:#ffe45e;border-radius:1mm;padding:0 1mm;font-weight:600}
.foot{position:absolute;left:0;right:0;bottom:9mm;text-align:center;font-size:8pt;color:rgba(190,170,255,.75);letter-spacing:.1em}
"""
def esc(t):
    t = html.escape(t)
    return re.sub(r'\[CONFIRM: (.*?)\]', r'\1', t)
def ul(items): return '<ul>'+''.join(f'<li>{esc(i)}</li>' for i in items)+'</ul>'
def head(): return f'<div class="grid"></div><div class="frame"></div><img class="logo" src="data:image/png;base64,{logo}">'
def pg(n, inner, note=False):
    foot = ('* Final value to be confirmed by the organising team &nbsp;·&nbsp; ' if note else '') + f'Page {n} of 4'
    return f'<div class="page">{inner}<div class="foot">{foot}</div></div>'

def build(key, e):
    qr_file = {'robo-soccer':'qr-soccer.png','dune-dominator':'qr-dune.png'}[key]
    qr_b64 = base64.b64encode(open(f'{sys.argv[1]}/{qr_file}','rb').read()).decode()
    qr_block = f'<div style="margin-top:12mm;display:flex;align-items:center;gap:8mm"><img src="data:image/png;base64,{qr_b64}" style="width:42mm;height:42mm;border-radius:2mm;border:2mm solid #fff"><div><h2 style="margin:0 0 2mm">JOIN THE WHATSAPP GROUP</h2><p style="margin:0">Scan the QR code to join the official group for updates and announcements.</p></div></div>'
    t, c = e['title'], e['coordinator']
    p1 = head()+f'''<div class="cover-title">{t}</div><div class="tagline">{html.escape(e['tagline'])}</div>
<div class="panel"><div class="hero">{ART[e['art']]}</div>
<h2>Introduction</h2>{''.join(f'<p>{esc(x)}</p>' for x in e['intro'])}
<h2>Event Description</h2>{''.join(f'<p>{esc(x)}</p>' for x in e['desc'])}</div>'''
    def blk(x):
        k,v = x
        if k=='h2': return f'<h2 style="margin-top:6mm">{esc(v)}</h2>'
        if k=='h3': return f'<h3>{esc(v)}</h3>'
        if k=='p': return f'<p>{esc(v)}</p>'
        if k=='ul': return ul(v)
        if k=='ol': return '<ol>'+''.join(f'<li>{esc(r)}</li>' for r in v)+'</ol>'
    if 'pages' in e:
        mids = [head()+'<div class="panel">'+''.join(blk(x) for x in pg_) .replace('<h2 style="margin-top:6mm">','<h2 style="margin-top:0">',1)+'</div>' for pg_ in e['pages']]
        n = len(mids)+2
        c = e['coordinator']
        p4 = head()+f'''<div class="panel" style="min-height:120mm"><h2>*PRIZEPOOL</h2><p>Prizes worth {e['prize']} to be won.</p>
<h2 style="margin-top:14mm">CONTACTS</h2><div class="contact"><b>Coordinator :</b><br><b>{html.escape(c[0].upper())}</b><br>[{html.escape(c[1])}]<br>{html.escape(c[2])}</div>{qr_block}</div>'''
        body = pg(1,p1,False).replace('Page 1 of 4',f'Page 1 of {n}')
        for k,m in enumerate(mids): body += pg(k+2,m,False).replace('of 4',f'of {n}')
        body += pg(n,p4,False).replace('of 4',f'of {n}')
        open(f'{sys.argv[1]}/{key}.html','w').write(f'<!doctype html><html><head><meta charset="utf-8"><style>{CSS}</style></head><body>{body}</body></html>')
        return
    if 'pages' in e: fmt=spec=''
    else: fmt = ''.join(f'<h3>{esc(h)}</h3>{ul(b)}' for h,b in e['format'])
    if 'pages' not in e: spec = ''.join(f'<h3>{esc(h)}</h3>{ul(b)}' for h,b in e['spec'])
    p2 = head()+f'<div class="panel"><h2>Event Format</h2>{fmt}<h2 style="margin-top:8mm">{esc(e["spec_title"])}</h2>{spec}</div>'
    rules = '<ol>'+''.join(f'<li>{esc(r)}</li>' for r in e['rules'])+'</ol>'
    kind = 'ROBOT' if key=='robo-soccer' else 'ROVER'
    p3 = head()+f'<div class="panel"><h2>FAIR-PLAY AND {kind} RULES</h2>{rules}<h2 style="margin-top:8mm">FINAL RANKING</h2><p>{esc(e["ranking"])}</p></div>'
    p4 = head()+f'''<div class="panel" style="min-height:120mm"><h2>*PRIZEPOOL</h2><p>Prizes worth {e['prize']} to be won.</p>
<h2 style="margin-top:14mm">CONTACTS</h2><div class="contact"><b>Coordinator :</b><br><b>{html.escape(c[0].upper())}</b><br>[{html.escape(c[1])}]<br>{html.escape(c[2])}</div>{qr_block}</div>'''
    doc = f'<!doctype html><html><head><meta charset="utf-8"><style>{CSS}</style></head><body>{pg(1,p1)}{pg(2,p2,False)}{pg(3,p3,False)}{pg(4,p4)}</body></html>'
    open(f'{sys.argv[1]}/{key}.html','w').write(doc)
for k,e in EVENTS.items(): build(k,e); print(k)
