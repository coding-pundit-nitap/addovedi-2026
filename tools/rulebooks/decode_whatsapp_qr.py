import pymupdf, cv2, numpy as np, glob, os, re
D='/Users/vivekgupta/Addovedi/addovedi-2026/client/public/rulebooks'
det=cv2.QRCodeDetector(); res={}
for f in sorted(glob.glob(f'{D}/*.pdf')):
    n=os.path.basename(f).replace('Addovedi-2026-','').replace('-rulebook.pdf','')
    d=pymupdf.open(f); found=''; page=None
    for pi in range(len(d)-1,max(-1,len(d)-3),-1):
        for dpi in (150,220,320):
            pix=d[pi].get_pixmap(dpi=dpi); img=np.frombuffer(pix.samples,dtype=np.uint8).reshape(pix.h,pix.w,pix.n)[:,:,:3]
            img=cv2.cvtColor(img,cv2.COLOR_RGB2BGR)
            v,_,_=det.detectAndDecode(img)
            if not v:
                try:
                    ok,vs,_,_=det.detectAndDecodeMulti(img); v=next((x for x in vs if x),'') if ok else ''
                except Exception: pass
            if v: found=v; page=pi+1; break
        if found: break
    res[n]=(page,found); print(f"{n:26} p{page}  {found.split('?')[0] or 'NO QR DECODED'}", flush=True)
vals=[v for _,v in res.values() if v]
print('\nunique links:',len(set(vals)),'of',len(vals),'decoded; rule books:',len(res), flush=True)
