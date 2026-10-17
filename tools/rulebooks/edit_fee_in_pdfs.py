import pymupdf, re, sys, os
S=sys.argv[1]; SRC=f'{S}/pdf_orig'; DST='/Users/vivekgupta/Addovedi/addovedi-2026/client/public/rulebooks'
ARIAL=pymupdf.Font(fontfile='/System/Library/Fonts/Supplemental/Arial.ttf')
ARIALB=pymupdf.Font(fontfile='/System/Library/Fonts/Supplemental/Arial Bold.ttf')
RUPEE=pymupdf.Font('figbo')   # only used for the big centred stat-box rupee sign
def col(c): return ((c>>16)&255)/255, ((c>>8)&255)/255, (c&255)/255
def spans(page):
    out=[]
    for b in page.get_text('dict')['blocks']:
        for l in b.get('lines',[]):
            for s in l['spans']: out.append(s)
    return out
def find(page, pred): return [s for s in spans(page) if pred(s)]
def write(page, x, y, text, font, size, color, fname):
    page.insert_font(fontname=fname, fontbuffer=font.buffer)
    page.insert_text((x,y), text, fontname=fname, fontsize=size, color=col(color))
def tl(font,text,size): return font.text_length(text,size)
def redact(page, rects):
    for r in rects:
        r=pymupdf.Rect(r); r=pymupdf.Rect(r.x0+0.4,r.y0+0.8,r.x1-0.4,r.y1-0.8)
        page.add_redact_annot(r, fill=False)
    page.apply_redactions(images=pymupdf.PDF_REDACT_IMAGE_NONE, graphics=pymupdf.PDF_REDACT_LINE_ART_NONE)

def team_pdf(name):   # hydraulic warzone / sky forge
    d=pymupdf.open(f'{SRC}/{name}')
    p=d[1]
    # stat box: Rs sign + '100'  ->  Rs 50 (centred), 'T E A M' -> 'M E M B E R'
    big=find(p, lambda s: s['text'].strip()=='100' and s['size']>20)[0]
    rup=[s for s in find(p, lambda s: s['text'].strip()=='₹' and s['size']>20)][0]
    lab=find(p, lambda s: s['text'].strip()=='T E A M')[0]
    cx=(rup['bbox'][0]+big['bbox'][2])/2
    lab_cx=(lab['bbox'][0]+lab['bbox'][2])/2
    # rule 2.3 line
    rule_rs=[s for s in find(p, lambda s: s['text'].strip()=='₹' and s['size']<12)][0]
    rule_txt=find(p, lambda s: s['text'].strip()=='100 per team')[0]
    line_y=rule_txt['origin'][1]
    trail=[s for s in find(p, lambda s: abs(s['origin'][1]-line_y)<1 and s['bbox'][0]>=rule_txt['bbox'][2]-1)]
    rects=[rup['bbox'],big['bbox'],lab['bbox'],rule_txt['bbox']]+[s['bbox'] for s in trail]
    redact(p, rects)
    sz=big['size']; w_r=tl(RUPEE,'₹',sz); w_n=tl(ARIALB,'50',sz); x0=cx-(w_r+w_n)/2
    write(p,x0,big['origin'][1],'₹',RUPEE,sz,big['color'],'FRupee'); write(p,x0+w_r,big['origin'][1],'50',ARIALB,sz,big['color'],'ArialB')
    txt='M E M B E R'; w=tl(ARIALB,txt,lab['size']); write(p,lab_cx-w/2,lab['origin'][1],txt,ARIALB,lab['size'],lab['color'],'ArialB')
    # rule line: keep the original rupee glyph, write '50 per member' then the full stop
    x=rule_txt['origin'][0]; write(p,x,line_y,'50 per member',ARIALB,rule_txt['size'],rule_txt['color'],'ArialB')
    if trail: write(p,x+tl(ARIALB,'50 per member',rule_txt['size']),line_y,'.',ARIAL,trail[0]['size'],trail[0]['color'],'Arial')
    # hydraulic only: stage table on page 7
    for pi in range(len(d)):
        q=d[pi]
        a=find(q, lambda s: s['text'].startswith('100 registration'))
        if a:
            a=a[0]; f2=find(q, lambda s: s['text'].startswith('fee. Registration is open'))[0]
            redact(q,[a['bbox'],f2['bbox']])
            write(q,a['origin'][0],a['origin'][1],'50 registration',ARIAL,a['size'],a['color'],'Arial')
            write(q,f2['origin'][0],f2['origin'][1],'fee per member. Registration is open to any number of teams.',ARIAL,f2['size'],f2['color'],'Arial')
    return d

def line_pdf(name, page_no, old, new):   # electromind / energix / circuit debugging: one price line
    d=pymupdf.open(f'{SRC}/{name}'); p=d[page_no-1]
    s=find(p, lambda s: s['text']==old)[0]
    redact(p,[s['bbox']])
    f=ARIALB if 'Bold' in s['font'] else ARIAL
    write(p,s['origin'][0],s['origin'][1],new,f,s['size'],s['color'],'ArialX')
    return d

def solid_siege(name):
    d=pymupdf.open(f'{SRC}/{name}'); p=d[1]
    lab=find(p, lambda s: s['text']=='2.4')[0]; txt=find(p, lambda s: s['text'].startswith('Participants must report'))[0]
    y=txt['origin'][1]+19.6
    write(p,lab['origin'][0],y,'2.5',ARIALB,lab['size'],lab['color'],'ArialB')
    write(p,txt['origin'][0],y,'Registration for this event is free.',ARIAL,txt['size'],txt['color'],'Arial')
    return d

jobs={
 'Addovedi-2026-hydraulic-warzone-rulebook.pdf': lambda n: team_pdf(n),
 'Addovedi-2026-sky-forge-rulebook.pdf': lambda n: team_pdf(n),
 'Addovedi-2026-electromind-rulebook.pdf': lambda n: line_pdf(n,4,' 100 per team',' 50 per member'),
 'Addovedi-2026-energix-rulebook.pdf': lambda n: line_pdf(n,4,' 100 per team',' 50 per member'),
 'Addovedi-2026-circuit-debugging-rulebook.pdf': lambda n: line_pdf(n,5,' 50 per person',' 50 per member'),
 'Addovedi-2026-solid-siege-rulebook.pdf': lambda n: solid_siege(n),
}
only=sys.argv[2:] 
for n,fn in jobs.items():
    if only and not any(o in n for o in only): continue
    d=fn(n); out=f'{S}/pdf_new/{n}'; os.makedirs(f'{S}/pdf_new',exist_ok=True)
    try: d.subset_fonts()
    except Exception as e: print('subset skipped', str(e)[:60])
    d.save(out, garbage=3, deflate=True)
    print('ok',n, round(os.path.getsize(out)/1048576,2),'MB')
