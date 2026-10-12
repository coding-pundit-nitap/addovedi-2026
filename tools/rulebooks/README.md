# Rule book / Unstop text tools

Scripts used to turn event rule-book PDFs into site data, fixed PDFs and Unstop copy-paste text.
They were written in a throwaway scratch folder, so **paths inside them are hard-coded** (scratchpad, `/tmp`, `~/Library/...`). Edit the paths at the top before reusing.

| File | What it does |
|---|---|
| `extract_pdf_text.mjs` | Pull text out of a rule-book PDF (`node extract_pdf_text.mjs file.pdf`). Needs `npm i pdfjs-dist@3.11.174` in the folder you run it from. |
| `gen_unstop.py` | The Unstop text for every event (description + round-wise, with `**bold**`). Writes one HTML page per event plus `all-events-unstop-text.html` (sticky event bar, **Copy** button per box, copies formatted HTML) and `all-events-unstop-text.txt`. Run it from the output folder (`rulebooks/unstop-texts/`). To add an event, add an `EV['slug'] = dict(...)` block before `def inline`. |
| `edit_fee_in_pdfs.py` | PyMuPDF edits of designed PDFs (swap a fee line, add "Registration is free", etc.). Keeps the original fonts where it can; Arial is used for new text. The rupee sign is not in Arial, so keep the original glyph and only replace what follows. |
| `build_designed_rulebooks.py` | Builds the Robo Soccer / Dune Dominator rule books (Addovedi purple style, WhatsApp QR) as HTML; `html_to_pdf.mjs` prints them to PDF with headless Chrome. |
| `html_to_pdf.mjs` | puppeteer-core + Google Chrome: HTML to A4 PDF. |
| `decode_whatsapp_qr.py` | Decodes the QR on each rule book's last pages (OpenCV) and checks they are unique WhatsApp links. |

Python deps (venv): `pymupdf pymupdf-fonts fonttools pillow opencv-python-headless numpy qrcode`(npm `qrcode` for QR PNGs).
Compressing a huge PDF: `doc.rewrite_images(dpi_threshold=120, dpi_target=110, quality=65, lossy=True, lossless=True)` then `subset_fonts()` then `save(garbage=4, deflate=True, clean=True)`.
