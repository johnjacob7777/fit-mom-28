"""
Reusable ReportLab + Pillow visual primitives for the Fit Mom 20
36-page editorial Comeback Handbook PDF.
"""
import io
import os
from PIL import Image, ImageOps
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    Flowable,
)

PAGE_W, PAGE_H = letter  # 612 x 792 pt
CARD_X = 34
CARD_Y = 28
CARD_W = PAGE_W - 2 * CARD_X  # 544 pt
CARD_H = PAGE_H - 2 * CARD_Y  # 736 pt
INNER_W = CARD_W - 44          # 500 pt printable content width

# Palette matching Fit Mom 20 web Tailwind theme
C_PLUM = colors.HexColor("#4A2538")
C_PLUM_MID = colors.HexColor("#6B4758")
C_PLUM_SOFT = colors.HexColor("#8A6173")
C_BODY = colors.HexColor("#573647")
C_CREAM_BG = colors.HexColor("#FFFAF7")
C_CARD_BORDER = colors.HexColor("#F1D8C9")
C_OUTER_BORDER = colors.HexColor("#EDBFA6")
C_PEACH_BG = colors.HexColor("#FFF1E8")
C_PEACH_TH = colors.HexColor("#FBE9DD")
C_PEACH_BORDER = colors.HexColor("#F2C9AE")
C_SAGE_TEXT = colors.HexColor("#2D6A4F")
C_SAGE_DARK = colors.HexColor("#1E5631")
C_SAGE_BG = colors.HexColor("#EEF6EF")
C_SAGE_LIGHT = colors.HexColor("#F3F8F4")
C_SAGE_BORDER = colors.HexColor("#BFDDC5")
C_RED_TEXT = colors.HexColor("#9B2C2C")
C_RED_DARK = colors.HexColor("#7A2E2E")
C_RED_BG = colors.HexColor("#FFF5F5")
C_RED_BORDER = colors.HexColor("#F5C2C7")
C_WARM_WHITE = colors.HexColor("#FFFDFB")
C_WHITE = colors.white
C_DASH = colors.HexColor("#D7B4A2")
C_RULE = colors.HexColor("#F3D9C7")


def register_fonts():
    fonts_dir = r"C:\Windows\Fonts"
    mapping = {
        "SegoeUI": "segoeui.ttf",
        "SegoeUI-Bold": "segoeuib.ttf",
        "SegoeUI-Italic": "segoeuii.ttf",
        "SegoeUI-BoldItalic": "segoeuiz.ttf",
        "Georgia": "georgia.ttf",
        "Georgia-Bold": "georgiab.ttf",
        "Georgia-Italic": "georgiai.ttf",
        "Georgia-BoldItalic": "georgiaz.ttf",
    }
    for name, fname in mapping.items():
        fpath = os.path.join(fonts_dir, fname)
        if os.path.exists(fpath):
            pdfmetrics.registerFont(TTFont(name, fpath))
    registerFontFamily(
        "SegoeUI",
        normal="SegoeUI",
        bold="SegoeUI-Bold",
        italic="SegoeUI-Italic",
        boldItalic="SegoeUI-BoldItalic",
    )
    registerFontFamily(
        "Georgia",
        normal="Georgia",
        bold="Georgia-Bold",
        italic="Georgia-Italic",
        boldItalic="Georgia-BoldItalic",
    )


def styles():
    return {
        "kicker": ParagraphStyle(
            "kicker", fontName="SegoeUI-Bold", fontSize=8.5, leading=11, textColor=C_SAGE_TEXT, spaceAfter=2
        ),
        "h1": ParagraphStyle(
            "h1", fontName="Georgia-Bold", fontSize=18.5, leading=22, textColor=C_PLUM, spaceAfter=5
        ),
        "h3": ParagraphStyle(
            "h3", fontName="SegoeUI-Bold", fontSize=11.2, leading=14, textColor=C_PLUM, spaceAfter=4
        ),
        "h4": ParagraphStyle(
            "h4", fontName="SegoeUI-Bold", fontSize=10, leading=13, textColor=C_PLUM, spaceAfter=3
        ),
        "h4_red": ParagraphStyle(
            "h4_red", fontName="SegoeUI-Bold", fontSize=10, leading=13, textColor=C_RED_TEXT, spaceAfter=3
        ),
        "h4_sage": ParagraphStyle(
            "h4_sage", fontName="SegoeUI-Bold", fontSize=10, leading=13, textColor=C_SAGE_DARK, spaceAfter=3
        ),
        "lead": ParagraphStyle(
            "lead", fontName="SegoeUI", fontSize=10, leading=14, textColor=C_PLUM_MID, spaceAfter=7
        ),
        "small": ParagraphStyle(
            "small", fontName="SegoeUI", fontSize=9.2, leading=13, textColor=C_BODY, spaceAfter=3
        ),
        "tiny": ParagraphStyle(
            "tiny", fontName="SegoeUI", fontSize=8.4, leading=11.5, textColor=C_BODY, spaceAfter=2
        ),
        "th": ParagraphStyle(
            "th", fontName="SegoeUI-Bold", fontSize=8.2, leading=10.5, textColor=C_PLUM
        ),
        "td": ParagraphStyle(
            "td", fontName="SegoeUI", fontSize=8.7, leading=11.8, textColor=C_BODY
        ),
        "td_tight": ParagraphStyle(
            "td_tight", fontName="SegoeUI", fontSize=8.1, leading=10.8, textColor=C_BODY
        ),
        "cover_eyebrow": ParagraphStyle(
            "cover_eyebrow", fontName="SegoeUI-Bold", fontSize=9, leading=12, textColor=C_PLUM_SOFT, alignment=1
        ),
        "cover_title": ParagraphStyle(
            "cover_title", fontName="Georgia-Bold", fontSize=28.5, leading=33, textColor=C_PLUM, alignment=1
        ),
        "cover_sub": ParagraphStyle(
            "cover_sub", fontName="SegoeUI", fontSize=11.2, leading=16, textColor=C_PLUM_MID, alignment=1
        ),
        "cover_quote": ParagraphStyle(
            "cover_quote", fontName="SegoeUI-Italic", fontSize=10, leading=14.5, textColor=C_SAGE_DARK, alignment=1
        ),
        "cover_disc": ParagraphStyle(
            "cover_disc", fontName="SegoeUI", fontSize=8.3, leading=11.5, textColor=C_PLUM_MID, alignment=1
        ),
        "cover_url": ParagraphStyle(
            "cover_url", fontName="SegoeUI", fontSize=9.5, leading=13, textColor=C_PLUM, alignment=1
        ),
    }


def esc(txt):
    return (
        str(txt)
        .replace("->", "→")
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
    )


def xml_safe(txt):
    import re
    return re.sub(
        r"&(?!amp;|lt;|gt;|quot;|apos;|ldquo;|rdquo;|lsquo;|rsquo;)",
        "&amp;",
        str(txt).replace("->", "→"),
    )


class CardBox(Flowable):
    """Rounded pastel container wrapping arbitrary vertical flowables."""

    def __init__(
        self,
        items,
        width=INNER_W,
        bg=C_WHITE,
        border=C_CARD_BORDER,
        pad_x=11,
        pad_y=9,
        radius=10,
        fixed_height=None,
        dashed=False,
        border_width=0.9,
        valign="top",
    ):
        super().__init__()
        self.items = items
        self.box_width = width
        self.bg = bg
        self.border = border
        self.pad_x = pad_x
        self.pad_y = pad_y
        self.radius = radius
        self.fixed_height = fixed_height
        self.dashed = dashed
        self.border_width = border_width
        self.valign = valign
        self._wrapped = []
        self._content_h = 0

    def wrap(self, availWidth, availHeight):
        inner_w = self.box_width - 2 * self.pad_x
        self._wrapped = []
        h = 0
        for item in self.items:
            w_i, h_i = item.wrap(inner_w, availHeight)
            self._wrapped.append((item, w_i, h_i))
            h += h_i
        self._content_h = h
        self.width = self.box_width
        self.height = self.fixed_height if self.fixed_height else (h + 2 * self.pad_y)
        return self.width, self.height

    def draw(self):
        c = self.canv
        c.saveState()
        if self.bg is not None:
            c.setFillColor(self.bg)
        if self.border is not None:
            c.setStrokeColor(self.border)
            c.setLineWidth(self.border_width)
            if self.dashed:
                c.setDash(4, 3)
        c.roundRect(
            0,
            0,
            self.width,
            self.height,
            self.radius,
            fill=1 if self.bg is not None else 0,
            stroke=1 if self.border is not None else 0,
        )
        c.setDash()
        c.restoreState()

        if self.valign == "center" and self.fixed_height:
            y = self.height - ((self.height - self._content_h) / 2.0)
        else:
            y = self.height - self.pad_y

        for item, _w, h_i in self._wrapped:
            y -= h_i
            item.drawOn(c, self.pad_x, y)


class GridRow(Flowable):
    """Equal-height multi-column layout row."""

    def __init__(self, col_items_list, col_configs=None, width=INNER_W, gap=9, pad_y=9, pad_x=10):
        super().__init__()
        self.n = len(col_items_list)
        self.col_w = (width - gap * (self.n - 1)) / self.n
        self.gap = gap
        self.width = width
        self.cards = []
        for idx, items in enumerate(col_items_list):
            cfg = (col_configs or [{}] * self.n)[idx] if col_configs else {}
            if isinstance(items, Flowable):
                self.cards.append(items)
            else:
                self.cards.append(
                    CardBox(
                        items,
                        width=self.col_w,
                        bg=cfg.get("bg", C_WHITE),
                        border=cfg.get("border", C_CARD_BORDER),
                        pad_x=cfg.get("pad_x", pad_x),
                        pad_y=cfg.get("pad_y", pad_y),
                        radius=cfg.get("radius", 10),
                        valign=cfg.get("valign", "top"),
                    )
                )

    def wrap(self, availWidth, availHeight):
        max_h = 0
        for card in self.cards:
            _, h = card.wrap(self.col_w, availHeight)
            if h > max_h:
                max_h = h
        # Re-wrap fixed-height equal cards so columns align bottom-flush
        for card in self.cards:
            if isinstance(card, CardBox):
                card.fixed_height = max_h
                card.wrap(self.col_w, availHeight)
        self.height = max_h
        return self.width, self.height

    def draw(self):
        x = 0
        for card in self.cards:
            card.drawOn(self.canv, x, 0)
            x += self.col_w + self.gap


def load_cropped_image_reader(img_path, target_w_pt, target_h_pt, crop_y=0.25):
    px_w = max(200, int(target_w_pt * 2.5))
    px_h = max(120, int(target_h_pt * 2.5))
    with Image.open(img_path) as im:
        rgb = im.convert("RGB")
        fitted = ImageOps.fit(
            rgb,
            (px_w, px_h),
            method=Image.Resampling.LANCZOS,
            centering=(0.5, crop_y),
        )
        buf = io.BytesIO()
        fitted.save(buf, format="JPEG", quality=88, optimize=True)
        buf.seek(0)
        return ImageReader(buf)


class RoundedPhoto(Flowable):
    """Crisp cropped photograph with rounded border frame."""

    def __init__(self, img_path, width, height, radius=11, border=C_OUTER_BORDER, crop_y=0.25):
        super().__init__()
        self.width = width
        self.height = height
        self.radius = radius
        self.border = border
        self.reader = load_cropped_image_reader(img_path, width, height, crop_y=crop_y)

    def wrap(self, availWidth, availHeight):
        return self.width, self.height

    def draw(self):
        c = self.canv
        c.saveState()
        p = c.beginPath()
        p.roundRect(0, 0, self.width, self.height, self.radius)
        c.clipPath(p, stroke=0, fill=0)
        c.drawImage(self.reader, 0, 0, width=self.width, height=self.height)
        c.restoreState()

        if self.border is not None:
            c.saveState()
            c.setStrokeColor(self.border)
            c.setLineWidth(1.1)
            c.roundRect(0, 0, self.width, self.height, self.radius, stroke=1, fill=0)
            c.restoreState()


class PhotoSplit(Flowable):
    """Side-by-side editorial photo + instruction card."""

    def __init__(self, img_path, right_items, width=INNER_W, height=136, img_ratio=0.55, crop_y=0.25):
        super().__init__()
        self.width = width
        self.height = height
        self.gap = 10
        img_w = (width - self.gap) * img_ratio
        right_w = (width - self.gap) - img_w
        self.photo = RoundedPhoto(img_path, img_w, height, radius=11, crop_y=crop_y)
        self.right_card = CardBox(
            right_items,
            width=right_w,
            fixed_height=height,
            pad_x=10,
            pad_y=8,
            radius=11,
            valign="center",
        )
        self.img_w = img_w

    def wrap(self, availWidth, availHeight):
        self.photo.wrap(self.img_w, self.height)
        self.right_card.wrap(self.width - self.img_w - self.gap, self.height)
        return self.width, self.height

    def draw(self):
        self.photo.drawOn(self.canv, 0, 0)
        self.right_card.drawOn(self.canv, self.img_w + self.gap, 0)


class PillBadge(Flowable):
    """Centered or left-aligned pill badge."""

    def __init__(self, text, bg=C_PLUM, fg=C_WHITE, border=None, align="center", font_size=8.2, pad_x=12, pad_y=4):
        super().__init__()
        self.text = text
        self.bg = bg
        self.fg = fg
        self.border = border
        self.align = align
        self.font_size = font_size
        self.pad_x = pad_x
        self.pad_y = pad_y
        self.pill_w = pdfmetrics.stringWidth(text, "SegoeUI-Bold", font_size) + 2 * pad_x
        self.height = font_size + 2 * pad_y + 2

    def wrap(self, availWidth, availHeight):
        self.width = availWidth
        return self.width, self.height

    def draw(self):
        c = self.canv
        x = (self.width - self.pill_w) / 2.0 if self.align == "center" else 0
        c.saveState()
        c.setFillColor(self.bg)
        if self.border is not None:
            c.setStrokeColor(self.border)
            c.setLineWidth(0.8)
        c.roundRect(x, 1, self.pill_w, self.height - 2, (self.height - 2) / 2.0, fill=1, stroke=1 if self.border else 0)
        c.setFillColor(self.fg)
        c.setFont("SegoeUI-Bold", self.font_size)
        c.drawString(x + self.pad_x, 1 + self.pad_y + 1.2, self.text)
        c.restoreState()


class CheckRow(Flowable):
    """Checklist row with clean vector square checkbox."""

    def __init__(self, html_text, style, width):
        super().__init__()
        self.para = Paragraph(html_text, style)
        self.width = width
        self.box_sz = 7.5
        self.indent = 13

    def wrap(self, availWidth, availHeight):
        w = self.width or availWidth
        _, ph = self.para.wrap(w - self.indent, availHeight)
        self.width = w
        self.height = max(12, ph + 2)
        return self.width, self.height

    def draw(self):
        c = self.canv
        c.saveState()
        c.setStrokeColor(C_PLUM_MID)
        c.setLineWidth(0.9)
        y_box = self.height - 9.5
        c.roundRect(0, y_box, self.box_sz, self.box_sz, 1.5, stroke=1, fill=0)
        c.restoreState()
        self.para.drawOn(c, self.indent, 2)


class BlankLines(Flowable):
    """Dashed writing lines for workbook & shopping notes."""

    def __init__(self, count=4, width=200, spacing=18):
        super().__init__()
        self.count = count
        self.width = width
        self.spacing = spacing
        self.height = count * spacing + 4

    def wrap(self, availWidth, availHeight):
        return self.width, self.height

    def draw(self):
        c = self.canv
        c.saveState()
        c.setStrokeColor(C_DASH)
        c.setLineWidth(0.8)
        c.setDash(3, 2.5)
        for i in range(self.count):
            y = self.height - (i + 1) * self.spacing + 3
            c.line(0, y, self.width, y)
        c.setDash()
        c.restoreState()


class WaterTrackerCircles(Flowable):
    """11 crisp vector hollow circles grouped 4-4-3 for water tracking."""

    def __init__(self, count=11):
        super().__init__()
        self.count = count
        self.width = 115
        self.height = 14

    def wrap(self, availWidth, availHeight):
        return self.width, self.height

    def draw(self):
        c = self.canv
        c.saveState()
        c.setStrokeColor(C_PLUM_SOFT)
        c.setLineWidth(0.9)
        x = 5
        for i in range(self.count):
            c.circle(x, 7, 3.8, stroke=1, fill=0)
            x += 9.5 if (i + 1) % 4 else 13
        c.restoreState()


class ModeCheckboxes(Flowable):
    """Compact inline 4-option checkbox strip: 20m | Awake | 5m | Rest."""

    def __init__(self):
        super().__init__()
        self.width = 152
        self.height = 14

    def wrap(self, availWidth, availHeight):
        return self.width, self.height

    def draw(self):
        c = self.canv
        c.saveState()
        c.setFont("SegoeUI", 8.2)
        x = 0
        for label in ["20m", "Awake", "5m", "Rest"]:
            c.setStrokeColor(C_PLUM_MID)
            c.setLineWidth(0.85)
            c.roundRect(x, 3, 7, 7, 1.2, stroke=1, fill=0)
            c.setFillColor(C_BODY)
            c.drawString(x + 9.5, 3.5, label)
            x += pdfmetrics.stringWidth(label, "SegoeUI", 8.2) + 16
        c.restoreState()


def make_table(headers, rows, col_widths, st, tight=False):
    td_style = st["td_tight"] if tight else st["td"]
    pad_v = 4.5 if tight else 6.0
    data = [[Paragraph(esc(h).upper(), st["th"]) for h in headers]]
    for row in rows:
        data.append([c if isinstance(c, Flowable) else Paragraph(c, td_style) for c in row])

    tbl = Table(data, colWidths=col_widths)
    tbl.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), C_PEACH_TH),
                ("BACKGROUND", (0, 1), (-1, -1), C_WHITE),
                ("BOX", (0, 0), (-1, -1), 0.85, C_CARD_BORDER),
                ("LINEBELOW", (0, 0), (-1, 0), 1.1, C_OUTER_BORDER),
                ("LINEBELOW", (0, 1), (-1, -2), 0.5, colors.HexColor("#F7E8DE")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 6.5),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6.5),
                ("TOPPADDING", (0, 0), (-1, -1), pad_v),
                ("BOTTOMPADDING", (0, 0), (-1, -1), pad_v),
            ]
        )
    )
    return tbl


class HandbookDoc(BaseDocTemplate):
    """36-page template drawing consistent pastel outer card & running chrome."""

    def __init__(self, filename, page_labels):
        super().__init__(
            filename,
            pagesize=letter,
            leftMargin=CARD_X + 22,
            rightMargin=CARD_X + 22,
            topMargin=CARD_Y + 38,
            bottomMargin=CARD_Y + 34,
        )
        self.page_labels = page_labels
        frame = Frame(
            self.leftMargin,
            self.bottomMargin,
            INNER_W,
            PAGE_H - self.topMargin - self.bottomMargin,
            leftPadding=0,
            rightPadding=0,
            topPadding=0,
            bottomPadding=0,
            id="main",
        )
        self.addPageTemplates([PageTemplate(id="handbook", frames=[frame], onPage=self._draw_chrome)])

    def _draw_chrome(self, c, doc):
        c.saveState()
        pnum = doc.page
        if pnum == 1:
            c.setFillColor(C_PEACH_BG)
            c.setStrokeColor(C_OUTER_BORDER)
            c.setLineWidth(1.6)
            c.roundRect(CARD_X, CARD_Y, CARD_W, CARD_H, 14, stroke=1, fill=1)
        else:
            c.setFillColor(C_CREAM_BG)
            c.setStrokeColor(C_CARD_BORDER)
            c.setLineWidth(1.0)
            c.roundRect(CARD_X, CARD_Y, CARD_W, CARD_H, 14, stroke=1, fill=1)

            # Top header strip
            top_y = CARD_Y + CARD_H - 22
            c.setFont("SegoeUI-Bold", 7.8)
            c.setFillColor(C_PLUM_SOFT)
            c.drawString(CARD_X + 22, top_y, "FIT MOM 20  •  THE EXHAUSTED MOM'S COMEBACK HANDBOOK")
            label = self.page_labels[pnum - 1] if pnum - 1 < len(self.page_labels) else ""
            c.drawRightString(CARD_X + CARD_W - 22, top_y, label.upper())
            c.setStrokeColor(C_RULE)
            c.setLineWidth(0.9)
            c.line(CARD_X + 22, top_y - 6, CARD_X + CARD_W - 22, top_y - 6)

            # Bottom footer strip
            bot_y = CARD_Y + 14
            c.setStrokeColor(C_RULE)
            c.setLineWidth(0.75)
            c.line(CARD_X + 22, bot_y + 11, CARD_X + CARD_W - 22, bot_y + 11)
            c.setFont("SegoeUI", 7.8)
            c.setFillColor(C_PLUM_SOFT)
            c.drawString(
                CARD_X + 22,
                bot_y,
                "Educational wellness guide only  •  Confirm postpartum clearance with your physician",
            )
            c.setFont("SegoeUI-Bold", 8.0)
            c.setFillColor(C_PLUM)
            c.drawRightString(CARD_X + CARD_W - 22, bot_y, f"Page {pnum} of {len(self.page_labels)}")
        c.restoreState()
