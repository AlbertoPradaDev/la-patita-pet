#!/usr/bin/env python3
"""La Patita Pet — PDF Manuals Generator"""

import os
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import cm, mm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak,
    Table, TableStyle, HRFlowable, KeepTogether
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT
from reportlab.pdfgen import canvas as cv

W, H = A4
MARGIN = 2.2 * cm
OUT = "/Users/cex/Documents/Proyectos/websites/la-patita-pet/docs"

# ── Colours ──────────────────────────────────────────────────────────────────
LAV       = colors.Color(155/255, 138/255, 203/255)
LAV_L     = colors.Color(237/255, 232/255, 249/255)
MINT      = colors.Color(181/255, 234/255, 215/255)
MINT_D    = colors.Color(90/255,  173/255, 138/255)
MINT_L    = colors.Color(232/255, 248/255, 242/255)
PEACH     = colors.Color(255/255, 218/255, 193/255)
BLUSH     = colors.Color(255/255, 215/255, 233/255)
CREAM     = colors.Color(255/255, 249/255, 245/255)
DARK      = colors.Color(45/255,  45/255,  45/255)
MGRAY     = colors.Color(110/255, 110/255, 120/255)
LGRAY     = colors.Color(245/255, 244/255, 250/255)
CODE_BG   = colors.Color(248/255, 246/255, 255/255)
W_WHITE   = colors.white
W_BLACK   = colors.black
ORANGE_L  = colors.Color(255/255, 244/255, 232/255)
ORANGE_D  = colors.Color(224/255, 144/255,  80/255)


# ══════════════════════════════════════════════════════════════════════════════
# MANUAL 1 — ADMIN DASHBOARD (Branded)
# ══════════════════════════════════════════════════════════════════════════════
def make_admin_manual():
    PATH = os.path.join(OUT, "manual-admin-dashboard.pdf")

    def cover(c, doc):
        # cream background
        c.setFillColor(CREAM)
        c.rect(0, 0, W, H, fill=1, stroke=0)
        # lavender top band
        c.setFillColor(LAV)
        c.rect(0, H - 5*cm, W, 5*cm, fill=1, stroke=0)
        # mint bottom band
        c.setFillColor(MINT)
        c.rect(0, 0, W, 2.5*cm, fill=1, stroke=0)
        # paw
        c.setFont("Helvetica-Bold", 72)
        c.setFillColor(W_WHITE)
        c.drawCentredString(W/2, H - 3.5*cm, "Pata Pet")
        # title
        c.setFillColor(LAV)
        c.setFont("Helvetica-Bold", 28)
        c.drawCentredString(W/2, H/2 + 2*cm, "MANUAL DE ADMINISTRACAO")
        c.setFont("Helvetica", 16)
        c.setFillColor(MGRAY)
        c.drawCentredString(W/2, H/2 + 0.8*cm, "Dashboard — Guia Completo")
        # divider line
        c.setStrokeColor(LAV)
        c.setLineWidth(2)
        c.line(MARGIN, H/2 + 0.2*cm, W-MARGIN, H/2 + 0.2*cm)
        # bottom text
        c.setFont("Helvetica", 11)
        c.setFillColor(DARK)
        c.drawCentredString(W/2, 3.5*cm, "La Patita Pet | Salao de Beleza para Animais")
        c.drawCentredString(W/2, 2.8*cm, "admin.lapatitapet.com")

    def header_footer(c, doc):
        c.saveState()
        # header bar
        c.setFillColor(LAV_L)
        c.rect(0, H - 1.4*cm, W, 1.4*cm, fill=1, stroke=0)
        c.setFont("Helvetica-Bold", 8)
        c.setFillColor(LAV)
        c.drawString(MARGIN, H - 0.9*cm, "La Patita Pet")
        c.setFont("Helvetica", 8)
        c.setFillColor(MGRAY)
        c.drawRightString(W - MARGIN, H - 0.9*cm, "Manual de Administracao — Dashboard")
        # footer
        c.setFillColor(MINT)
        c.rect(0, 0, W, 0.8*cm, fill=1, stroke=0)
        c.setFont("Helvetica", 8)
        c.setFillColor(DARK)
        c.drawCentredString(W/2, 0.25*cm, f"Pagina {doc.page}")
        c.restoreState()

    doc = SimpleDocTemplate(
        PATH, pagesize=A4,
        leftMargin=MARGIN, rightMargin=MARGIN,
        topMargin=2*cm, bottomMargin=1.8*cm,
        title="Manual de Administracao — La Patita Pet",
        author="La Patita Pet"
    )

    def build_doc(story, on_first, on_later):
        from reportlab.platypus import BaseDocTemplate, PageTemplate, Frame
        bdoc = BaseDocTemplate(
            PATH, pagesize=A4,
            leftMargin=MARGIN, rightMargin=MARGIN,
            topMargin=2*cm, bottomMargin=1.8*cm,
        )
        frame = Frame(MARGIN, 1.8*cm, W - 2*MARGIN, H - 3.8*cm)
        bdoc.addPageTemplates([
            PageTemplate(id="cover",   frames=[frame], onPage=on_first),
            PageTemplate(id="content", frames=[frame], onPage=on_later),
        ])
        story.insert(0, PageBreak())  # triggers cover template
        # switch to content after page 1 handled via NextPageTemplate — simpler: use onPage everywhere
        bdoc.build(story, onFirstPage=on_first, onLaterPages=on_later)

    s = getSampleStyleSheet()
    def sty(name, **kw):
        return ParagraphStyle(name, **kw)

    H1 = sty("H1", fontName="Helvetica-Bold", fontSize=20, textColor=LAV,
              spaceAfter=10, spaceBefore=18)
    H2 = sty("H2", fontName="Helvetica-Bold", fontSize=14, textColor=MINT_D,
              spaceAfter=6, spaceBefore=14,
              borderPad=4, borderColor=MINT, borderWidth=0, leading=18)
    H3 = sty("H3", fontName="Helvetica-Bold", fontSize=11, textColor=DARK,
              spaceAfter=4, spaceBefore=10)
    BODY = sty("BODY", fontName="Helvetica", fontSize=10, textColor=DARK,
               leading=15, spaceAfter=6)
    NOTE = sty("NOTE", fontName="Helvetica-Oblique", fontSize=9, textColor=MGRAY,
               leading=13, spaceAfter=6)
    BADGE = sty("BADGE", fontName="Helvetica-Bold", fontSize=9, textColor=W_WHITE,
                backColor=LAV, borderPad=3)
    TOC = sty("TOC", fontName="Helvetica", fontSize=10, textColor=DARK,
              leading=18, leftIndent=10)
    TOC_H = sty("TOC_H", fontName="Helvetica-Bold", fontSize=11, textColor=LAV,
                leading=20, spaceAfter=2)

    def colored_card(title, body_paras, bg=LAV_L, accent=LAV):
        """Return a KeepTogether block that looks like a branded card."""
        title_para = Paragraph(title, sty("ct", fontName="Helvetica-Bold",
                               fontSize=11, textColor=accent, spaceAfter=4))
        tdata = [[title_para]] + [[p] for p in body_paras]
        ts = TableStyle([
            ("BACKGROUND", (0,0), (-1,0), bg),
            ("BACKGROUND", (0,1), (-1,-1), W_WHITE),
            ("BOX",        (0,0), (-1,-1), 1, accent),
            ("LINEBELOW",  (0,0), (-1,0), 0.5, accent),
            ("LEFTPADDING", (0,0), (-1,-1), 10),
            ("RIGHTPADDING",(0,0), (-1,-1), 10),
            ("TOPPADDING",  (0,0), (-1,-1), 7),
            ("BOTTOMPADDING",(0,0),(-1,-1), 7),
            ("ROUNDEDCORNERS",[4]),
        ])
        t = Table([[r[0]] for r in tdata], colWidths=[W - 2*MARGIN - 0.2*cm])
        t.setStyle(ts)
        return KeepTogether([t, Spacer(1, 8)])

    def step_table(steps):
        """Numbered steps in a mint-themed table."""
        rows = []
        for i, (num, txt) in enumerate(steps):
            n_para = Paragraph(f"<b>{num}</b>", sty("sn", fontName="Helvetica-Bold",
                               fontSize=12, textColor=W_WHITE, alignment=TA_CENTER))
            t_para = Paragraph(txt, BODY)
            rows.append([n_para, t_para])
        ts = TableStyle([
            ("BACKGROUND", (0,0), (0,-1), MINT_D),
            ("BACKGROUND", (1,0), (1,-1), MINT_L),
            ("VALIGN",     (0,0), (-1,-1), "MIDDLE"),
            ("LEFTPADDING",(0,0), (-1,-1), 8),
            ("RIGHTPADDING",(0,0),(-1,-1), 8),
            ("TOPPADDING", (0,0), (-1,-1), 8),
            ("BOTTOMPADDING",(0,0),(-1,-1), 8),
            ("ROWBACKGROUNDS",(1,0),(1,-1),[MINT_L, W_WHITE]),
            ("BOX",        (0,0), (-1,-1), 0.5, MINT_D),
            ("INNERGRID",  (0,0), (-1,-1), 0.3, MINT),
        ])
        t = Table(rows, colWidths=[1*cm, W - 2*MARGIN - 1*cm - 0.2*cm])
        t.setStyle(ts)
        return KeepTogether([t, Spacer(1, 8)])

    def tab_section(emoji, title, accent, bg, content_paras):
        header = Paragraph(f"{emoji}  {title}", sty("th",
            fontName="Helvetica-Bold", fontSize=15, textColor=accent,
            spaceAfter=8, spaceBefore=14))
        bar = Table([[""]], colWidths=[W - 2*MARGIN],
                    rowHeights=[0.3*cm])
        bar.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,-1), accent)]))
        items = [header, bar, Spacer(1,6)] + content_paras
        return items

    # ── Story ──────────────────────────────────────────────────────────────────
    story = []

    # ----- COVER (page 1 handled by onFirstPage, we just need a page break) ----
    story.append(PageBreak())

    # ----- INDEX ---------------------------------------------------------------
    story.append(Paragraph("INDICE", H1))
    story.append(HRFlowable(width="100%", thickness=1, color=LAV, spaceAfter=12))
    index_items = [
        ("1.", "Accesso ao Dashboard"),
        ("2.", "Primeira Configuracao (Setup)"),
        ("3.", "Login"),
        ("4.", "Marcacoes — Gerir reservas"),
        ("5.", "Funcionarios — Gerir especialistas"),
        ("6.", "Servicos — Gerir servicos"),
        ("7.", "Horarios — Horario semanal"),
        ("8.", "Pausas — Intervalos"),
        ("9.", "Dias Bloqueados — Ferias e feriados"),
        ("10.", "Definicoes — Conta e senha"),
        ("11.", "Dicas para Producao"),
    ]
    for num, label in index_items:
        story.append(Paragraph(f"<b>{num}</b>  {label}", TOC))
    story.append(PageBreak())

    # ----- 1. ACCESS -----------------------------------------------------------
    story.append(Paragraph("1. Accesso ao Dashboard", H1))
    story.append(HRFlowable(width="100%", thickness=1, color=LAV, spaceAfter=8))
    story.append(Paragraph(
        "O painel de administracao esta disponivel atraves dos seguintes enderecos:", BODY))
    url_data = [
        ["Ambiente", "URL"],
        ["Desenvolvimento", "http://localhost:3000/admin"],
        ["Producao",        "https://seudominio.com/admin"],
        ["Setup inicial",   "https://seudominio.com/admin/setup"],
        ["Dashboard",       "https://seudominio.com/admin/dashboard"],
    ]
    url_t = Table(url_data, colWidths=[5*cm, W-2*MARGIN-5*cm-0.2*cm])
    url_t.setStyle(TableStyle([
        ("BACKGROUND",(0,0),(-1,0), LAV),
        ("TEXTCOLOR", (0,0),(-1,0), W_WHITE),
        ("FONTNAME",  (0,0),(-1,0), "Helvetica-Bold"),
        ("FONTSIZE",  (0,0),(-1,-1), 9),
        ("ROWBACKGROUNDS",(0,1),(-1,-1),[LAV_L, W_WHITE]),
        ("BOX",       (0,0),(-1,-1), 0.5, LAV),
        ("INNERGRID", (0,0),(-1,-1), 0.3, LAV_L),
        ("LEFTPADDING",(0,0),(-1,-1), 8),
        ("TOPPADDING", (0,0),(-1,-1), 6),
        ("BOTTOMPADDING",(0,0),(-1,-1), 6),
    ]))
    story.append(url_t)
    story.append(Spacer(1, 12))
    story.append(PageBreak())

    # ----- 2. SETUP -----------------------------------------------------------
    story.append(Paragraph("2. Primeira Configuracao (Setup)", H1))
    story.append(HRFlowable(width="100%", thickness=1, color=LAV, spaceAfter=8))
    story.append(Paragraph(
        "A pagina <b>/admin/setup</b> so e necessaria uma vez — na primeira vez que acedes "
        "ao sistema. Se o admin ja estiver configurado, redireciona automaticamente para o login.", BODY))
    story.append(Spacer(1, 6))
    story.append(step_table([
        ("1", "Acede a <b>https://seudominio.com/admin/setup</b>"),
        ("2", "Introduz uma senha com <b>minimo 8 caracteres</b>"),
        ("3", "Confirma a senha no segundo campo"),
        ("4", "Clica em <b>Definir senha</b>"),
        ("5", "Seras redirecionado para o login automaticamente"),
    ]))
    story.append(Paragraph(
        "IMPORTANTE: Guarda a senha num gestor de passwords. Nao ha recuperacao automatica — "
        "teras de contactar o administrador da base de dados.", NOTE))
    story.append(PageBreak())

    # ----- 3. LOGIN -----------------------------------------------------------
    story.append(Paragraph("3. Login", H1))
    story.append(HRFlowable(width="100%", thickness=1, color=LAV, spaceAfter=8))
    story.append(Paragraph(
        "Acede a <b>/admin</b> e introduz a senha configurada no setup. "
        "O sistema verifica automaticamente se o admin esta configurado — "
        "se nao estiver, redireciona para <b>/admin/setup</b>.", BODY))
    story.append(Spacer(1, 6))
    story.append(step_table([
        ("1", "Acede a /admin"),
        ("2", "Introduz a <b>Senha de administrador</b>"),
        ("3", "Clica em <b>Entrar</b>"),
        ("4", "Seras redirecionado para o Dashboard"),
    ]))
    story.append(Paragraph(
        "A sessao e guardada no browser (localStorage). Fecha o browser ou "
        "clica em <b>Sair</b> para terminar a sessao.", NOTE))
    story.append(PageBreak())

    # ----- 4. MARCACOES -------------------------------------------------------
    for block in tab_section("📅", "4. Marcacoes", LAV, LAV_L, [
        Paragraph("A aba <b>Marcacoes</b> mostra todas as reservas do negocio. "
                  "Podes filtrar por data e por especialista, e cancelar reservas.", BODY),
        Spacer(1, 8),
        Paragraph("<b>Calendario mini</b>", H3),
        Paragraph(
            "Clica num dia para ver so as reservas desse dia. "
            "O dia hoje aparece com contorno lavanda. "
            "O dia selecionado fica com fundo gradiente. "
            "Clica novamente para deselecionar e ver todas as reservas. "
            "Navega os meses com os botoes <b>Anterior (‹)</b> e <b>Proximo (›)</b>.", BODY),
        Spacer(1, 6),
        Paragraph("<b>Filtros disponiveis</b>", H3),
        Table([
            ["Filtro", "Funcao"],
            ["Funcionario", "Ver so as marcacoes de um especialista especifico"],
            ["Registos por pagina", "Mostrar 10, 20, 50 ou 100 marcacoes de cada vez"],
            ["Botao Atualizar", "Recarregar a lista com os filtros atuais"],
        ], colWidths=[5.5*cm, W-2*MARGIN-5.5*cm-0.2*cm],
        style=TableStyle([
            ("BACKGROUND",(0,0),(-1,0), LAV), ("TEXTCOLOR",(0,0),(-1,0), W_WHITE),
            ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"), ("FONTSIZE",(0,0),(-1,-1),9),
            ("ROWBACKGROUNDS",(0,1),(-1,-1),[LAV_L, W_WHITE]),
            ("BOX",(0,0),(-1,-1),0.5,LAV), ("INNERGRID",(0,0),(-1,-1),0.3,LAV_L),
            ("LEFTPADDING",(0,0),(-1,-1),8), ("TOPPADDING",(0,0),(-1,-1),5),
            ("BOTTOMPADDING",(0,0),(-1,-1),5),
        ])),
        Spacer(1, 8),
        Paragraph("<b>Cada marcacao mostra</b>", H3),
        Paragraph(
            "Nome do cliente (maiusculas) · Email · Servico + Especialista + Data e hora · "
            "<b>Badge de estado</b> (Pendente em laranja, Confirmada em verde, "
            "Cancelada em cinzento) · <b>Botao Cancelar</b> (so visivel se nao estiver cancelada)", BODY),
        Spacer(1, 6),
        Paragraph("<b>Paginacao</b>", H3),
        Paragraph(
            "Os botoes <b>Anterior</b> e <b>Proxima</b> permitem navegar entre paginas. "
            "O indicador X/Total mostra a pagina atual e o total de paginas.", BODY),
    ]):
        story.append(block)
    story.append(PageBreak())

    # ----- 5. FUNCIONARIOS ---------------------------------------------------
    for block in tab_section("👤", "5. Funcionarios", MINT_D, MINT_L, [
        Paragraph(
            "Gere os especialistas do salao. Cada funcionario tem os seus proprios servicos, "
            "horarios e pausas associados.", BODY),
        Spacer(1, 8),
        Paragraph("<b>Lista de funcionarios</b>", H3),
        Paragraph("Cada card mostra o nome, email e telefone (se preenchidos).", BODY),
        Spacer(1, 6),
        Paragraph("<b>Editar inline</b>", H3),
        step_table([
            ("1", "Clica em <b>Editar</b> no card do funcionario"),
            ("2", "Os campos Nome, Email e Telefone ficam editaveis"),
            ("3", "Edita os valores necessarios"),
            ("4", "Clica em <b>Guardar</b> para confirmar ou <b>Cancelar</b> para descartar"),
        ]),
        Paragraph("<b>Eliminar funcionario</b>", H3),
        Paragraph(
            "Clica em <b>Eliminar</b>. ATENCAO: esta acao e permanente e elimina "
            "tambem todos os servicos, horarios, pausas e dias bloqueados associados.", BODY),
        Spacer(1, 6),
        Paragraph("<b>Adicionar novo funcionario</b>", H3),
        Paragraph(
            "Preenche o formulario no final da pagina. O campo <b>Nome</b> e obrigatorio. "
            "Email e Telefone sao opcionais. Clica em <b>Adicionar funcionario</b>.", BODY),
    ]):
        story.append(block)
    story.append(PageBreak())

    # ----- 6. SERVICOS -------------------------------------------------------
    for block in tab_section("✂", "6. Servicos", LAV, LAV_L, [
        Paragraph(
            "Cada especialista tem os seus proprios servicos. "
            "Seleciona primeiro o funcionario para ver e gerir os seus servicos.", BODY),
        Spacer(1, 8),
        Paragraph("<b>Selecionar funcionario</b>", H3),
        Paragraph(
            "Clica no botao com o nome do funcionario. O botao ativo fica com fundo gradiente. "
            "A lista de servicos carrega automaticamente.", BODY),
        Spacer(1, 6),
        Paragraph("<b>Lista de servicos</b>", H3),
        Paragraph(
            "Cada servico mostra o nome (maiusculas), a duracao em minutos e o preco em euros "
            "(ou 'Sem preco' se nao definido). O botao <b>Eliminar</b> remove o servico.", BODY),
        Spacer(1, 4),
        Paragraph(
            "ATENCAO: Nao e possivel eliminar um servico que ja tenha marcacoes associadas. "
            "O sistema mostrara uma mensagem de erro.", NOTE),
        Spacer(1, 6),
        Paragraph("<b>Adicionar servico</b>", H3),
        step_table([
            ("1", "Seleciona o funcionario"),
            ("2", "Preenche o <b>Nome</b> do servico (ex: Banho & Brilho)"),
            ("3", "Define a <b>Duracao em minutos</b> (obrigatorio)"),
            ("4", "Define o <b>Preco em euros</b> (opcional)"),
            ("5", "Clica em <b>Adicionar servico</b>"),
        ]),
    ]):
        story.append(block)
    story.append(PageBreak())

    # ----- 7. HORARIOS -------------------------------------------------------
    for block in tab_section("🕐", "7. Horarios", MINT_D, MINT_L, [
        Paragraph(
            "Define o horario de trabalho semanal de cada especialista. "
            "Sem horario definido, o especialista nao aparece com disponibilidade no wizard de reservas.", BODY),
        Spacer(1, 8),
        Paragraph("<b>Lista de horarios</b>", H3),
        Paragraph(
            "Cada registo mostra o dia da semana (em portugues) e o intervalo de horas (HH:MM - HH:MM).", BODY),
        Spacer(1, 6),
        Paragraph("<b>Adicionar horario</b>", H3),
        step_table([
            ("1", "Seleciona o funcionario"),
            ("2", "Seleciona o <b>Dia da semana</b> no dropdown"),
            ("3", "Define a hora de <b>Inicio</b> (ex: 09:00)"),
            ("4", "Define a hora de <b>Fim</b> (ex: 18:00)"),
            ("5", "Clica em <b>Adicionar horario</b>"),
        ]),
        Paragraph(
            "Podes ter horarios diferentes para cada dia. Por exemplo, "
            "Segunda das 09:00-18:00 e Sabado das 10:00-14:00.", BODY),
    ]):
        story.append(block)
    story.append(PageBreak())

    # ----- 8. PAUSAS ---------------------------------------------------------
    for block in tab_section("☕", "8. Pausas", LAV, LAV_L, [
        Paragraph(
            "As pausas definem intervalos dentro do horario de trabalho onde o especialista "
            "nao esta disponivel para marcacoes (ex: hora de almoco, descanso).", BODY),
        Spacer(1, 8),
        Paragraph("<b>Regra importante</b>", H3),
        Paragraph(
            "A pausa deve estar <b>dentro do horario de trabalho</b> definido para esse dia. "
            "Por exemplo, se o horario e 09:00-18:00, uma pausa valida seria 13:00-14:00.", BODY),
        Spacer(1, 6),
        Paragraph("<b>Adicionar pausa</b>", H3),
        step_table([
            ("1", "Seleciona o funcionario"),
            ("2", "Seleciona o <b>Dia da semana</b>"),
            ("3", "Define a hora de <b>Inicio</b> da pausa"),
            ("4", "Define a hora de <b>Fim</b> da pausa"),
            ("5", "Clica em <b>Adicionar pausa</b>"),
        ]),
    ]):
        story.append(block)
    story.append(PageBreak())

    # ----- 9. DIAS BLOQUEADOS ------------------------------------------------
    for block in tab_section("🔒", "9. Dias Bloqueados", MINT_D, MINT_L, [
        Paragraph(
            "Bloqueia dias especificos onde o especialista nao estara disponivel "
            "(ferias, feriados, formacoes, etc.). Os dias bloqueados nao aparecem "
            "como opcao no wizard de reservas.", BODY),
        Spacer(1, 8),
        Paragraph("<b>Lista de dias bloqueados</b>", H3),
        Paragraph(
            "Mostra apenas os dias futuros. Cada registo tem a data (por extenso) "
            "e o motivo (se definido).", BODY),
        Spacer(1, 6),
        Paragraph("<b>Bloquear um dia</b>", H3),
        step_table([
            ("1", "Seleciona o funcionario"),
            ("2", "Escolhe a <b>Data</b> no campo de data (minimo: hoje)"),
            ("3", "Escreve um <b>Motivo</b> opcional (ex: Natal, Ferias)"),
            ("4", "Clica em <b>Bloquear dia</b>"),
        ]),
        Spacer(1, 6),
        Paragraph("<b>Desbloquear um dia</b>", H3),
        Paragraph(
            "Clica em <b>Desbloquear</b> no card do dia que queres libertar.", BODY),
    ]):
        story.append(block)
    story.append(PageBreak())

    # ----- 10. DEFINICOES ----------------------------------------------------
    for block in tab_section("⚙", "10. Definicoes", LAV, LAV_L, [
        Paragraph(
            "A aba Definicoes tem tres seccoes: informacao da conta, "
            "alteracao de senha e gestao de sessao.", BODY),
        Spacer(1, 8),
        Paragraph("<b>Informacao da conta</b>", H3),
        Paragraph(
            "Mostra o nome e email do negocio tal como foram registados na API. "
            "Estes campos sao apenas de leitura.", BODY),
        Spacer(1, 6),
        Paragraph("<b>Alterar senha</b>", H3),
        step_table([
            ("1", "Introduz a <b>Senha atual</b>"),
            ("2", "Introduz a <b>Nova senha</b> (minimo 8 caracteres)"),
            ("3", "Confirma a nova senha no terceiro campo"),
            ("4", "Clica em <b>Alterar palavra-passe</b>"),
        ]),
        Paragraph(
            "Se as senhas nao coincidirem, o sistema mostrara uma mensagem de erro "
            "sem enviar nada para o servidor.", NOTE),
        Spacer(1, 6),
        Paragraph("<b>Terminar sessao</b>", H3),
        Paragraph(
            "Clica em <b>Sair</b> no botao vermelho. "
            "Isto limpa o token de sessao do browser e redireciona para o login. "
            "Tambem podes clicar em <b>Sair</b> na barra superior em qualquer aba.", BODY),
    ]):
        story.append(block)
    story.append(PageBreak())

    # ----- 11. PRODUCAO -------------------------------------------------------
    story.append(Paragraph("11. Dicas para Producao", H1))
    story.append(HRFlowable(width="100%", thickness=1, color=LAV, spaceAfter=8))
    prod_data = [
        ["Tema", "Recomendacao"],
        ["Variaveis de ambiente", "Adiciona NEXT_PUBLIC_API_URL e NEXT_PUBLIC_API_KEY em Settings > Environment Variables no Vercel"],
        ["Seguranca da senha", "Usa uma senha forte e guarda-a num gestor de passwords (Bitwarden, 1Password, etc.)"],
        ["Sessao expirada", "Se vires a pagina de login inesperadamente, a sessao expirou (24h). Volta a fazer login."],
        ["Configuracao inicial", "Faz o setup (/admin/setup) logo apos o deploy, antes de partilhar o link com alguem"],
        ["Emails de confirmacao", "Cada reserva confirmada envia um email automatico ao cliente via Resend"],
        ["Dias bloqueados", "Bloqueia dias de ferias e feriados com antecedencia para evitar reservas indesejadas"],
        ["Horarios primeiro", "Define sempre os Horarios e Pausas antes de partilhar o link de reservas"],
    ]
    prod_t = Table(prod_data, colWidths=[4.5*cm, W-2*MARGIN-4.5*cm-0.2*cm])
    prod_t.setStyle(TableStyle([
        ("BACKGROUND",(0,0),(-1,0), LAV), ("TEXTCOLOR",(0,0),(-1,0), W_WHITE),
        ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"), ("FONTSIZE",(0,0),(-1,-1),9),
        ("ROWBACKGROUNDS",(0,1),(-1,-1),[LAV_L, W_WHITE]),
        ("BOX",(0,0),(-1,-1),0.5,LAV), ("INNERGRID",(0,0),(-1,-1),0.3,LAV_L),
        ("LEFTPADDING",(0,0),(-1,-1),8), ("TOPPADDING",(0,0),(-1,-1),6),
        ("BOTTOMPADDING",(0,0),(-1,-1),6), ("FONTNAME",(0,1),(0,-1),"Helvetica-Bold"),
        ("VALIGN",(0,0),(-1,-1),"TOP"),
    ]))
    story.append(prod_t)

    # Build
    doc2 = SimpleDocTemplate(
        PATH, pagesize=A4,
        leftMargin=MARGIN, rightMargin=MARGIN,
        topMargin=2.2*cm, bottomMargin=1.6*cm,
        title="Manual de Administracao — La Patita Pet",
    )
    doc2.build(story, onFirstPage=cover, onLaterPages=header_footer)
    print(f"  Created: {PATH}")


# ══════════════════════════════════════════════════════════════════════════════
# MANUAL 2 — AI INTEGRATION (Minimalist)
# ══════════════════════════════════════════════════════════════════════════════
def make_ia_manual():
    PATH = os.path.join(OUT, "manual-integracion-ia.pdf")

    BG    = colors.white
    DARK2 = colors.Color(20/255, 20/255, 30/255)
    GRAY2 = colors.Color(100/255, 100/255, 110/255)
    CODE  = colors.Color(242/255, 242/255, 248/255)
    ACCENT= colors.Color(60/255, 60/255, 80/255)
    HLINE = colors.Color(200/255, 200/255, 210/255)

    def header_footer(c, doc):
        c.saveState()
        c.setStrokeColor(HLINE)
        c.setLineWidth(0.5)
        c.line(MARGIN, H - 1.2*cm, W - MARGIN, H - 1.2*cm)
        c.setFont("Helvetica", 8)
        c.setFillColor(GRAY2)
        c.drawString(MARGIN, H - 1.0*cm, "La Patita Pet — Manual de Integracao com IA")
        c.drawRightString(W-MARGIN, H - 1.0*cm, f"Pagina {doc.page}")
        c.line(MARGIN, 1.2*cm, W-MARGIN, 1.2*cm)
        c.drawCentredString(W/2, 0.6*cm, "appointments-api-five.vercel.app")
        c.restoreState()

    s = getSampleStyleSheet()
    BH1  = ParagraphStyle("BH1",  fontName="Helvetica-Bold", fontSize=18, textColor=DARK2, spaceAfter=8, spaceBefore=16)
    BH2  = ParagraphStyle("BH2",  fontName="Helvetica-Bold", fontSize=13, textColor=DARK2, spaceAfter=6, spaceBefore=12)
    BH3  = ParagraphStyle("BH3",  fontName="Helvetica-Bold", fontSize=10, textColor=ACCENT, spaceAfter=4, spaceBefore=8)
    BB   = ParagraphStyle("BB",   fontName="Helvetica",       fontSize=9.5, textColor=DARK2, leading=14, spaceAfter=5)
    BNOTE= ParagraphStyle("BNOTE",fontName="Helvetica-Oblique",fontSize=9, textColor=GRAY2, leading=13, spaceAfter=5)
    BNUM = ParagraphStyle("BNUM", fontName="Helvetica-Bold",  fontSize=9.5, textColor=DARK2, leading=14, spaceAfter=4, leftIndent=14, bulletIndent=0)

    CODE_W = W - 2*MARGIN - 0.4*cm

    def code_block(lines):
        text = "<br/>".join(lines)
        p = Paragraph(text, ParagraphStyle("code",
            fontName="Courier", fontSize=8, textColor=DARK2,
            leading=12, leftIndent=8, rightIndent=8,
            backColor=CODE, borderPad=8))
        t = Table([[p]], colWidths=[CODE_W])
        t.setStyle(TableStyle([
            ("BACKGROUND",(0,0),(-1,-1), CODE),
            ("BOX",(0,0),(-1,-1),0.5, HLINE),
            ("LEFTPADDING",(0,0),(-1,-1),0),
            ("RIGHTPADDING",(0,0),(-1,-1),0),
            ("TOPPADDING",(0,0),(-1,-1),0),
            ("BOTTOMPADDING",(0,0),(-1,-1),0),
        ]))
        return KeepTogether([t, Spacer(1,6)])

    def label_box(text, bg=CODE, tc=DARK2):
        p = Paragraph(text, ParagraphStyle("lb", fontName="Helvetica-Bold",
            fontSize=9, textColor=tc, backColor=bg))
        t = Table([[p]], colWidths=[CODE_W])
        t.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,-1),bg),
            ("BOX",(0,0),(-1,-1),0.5,HLINE),
            ("TOPPADDING",(0,0),(-1,-1),5),("BOTTOMPADDING",(0,0),(-1,-1),5),
            ("LEFTPADDING",(0,0),(-1,-1),10)]))
        return KeepTogether([t, Spacer(1,4)])

    def step_table(steps):
        rows = []
        for num, txt in steps:
            n_p = Paragraph(f"<b>{num}</b>", ParagraphStyle("sn2",
                fontName="Helvetica-Bold", fontSize=11, textColor=DARK2,
                alignment=TA_CENTER))
            t_p = Paragraph(txt, BB)
            rows.append([n_p, t_p])
        ts = TableStyle([
            ("BACKGROUND",(0,0),(0,-1), CODE),
            ("BACKGROUND",(1,0),(1,-1), W_WHITE),
            ("VALIGN",(0,0),(-1,-1),"MIDDLE"),
            ("LEFTPADDING",(0,0),(-1,-1),8),("RIGHTPADDING",(0,0),(-1,-1),8),
            ("TOPPADDING",(0,0),(-1,-1),8),("BOTTOMPADDING",(0,0),(-1,-1),8),
            ("BOX",(0,0),(-1,-1),0.5,HLINE),("INNERGRID",(0,0),(-1,-1),0.3,HLINE),
        ])
        t = Table(rows, colWidths=[1*cm, W-2*MARGIN-1*cm-0.2*cm])
        t.setStyle(ts)
        return KeepTogether([t, Spacer(1,8)])

    story = []

    # Cover
    def cover(c, doc):
        c.setFillColor(DARK2)
        c.rect(0, 0, W, H, fill=1, stroke=0)
        c.setFillColor(W_WHITE)
        c.setFont("Helvetica-Bold", 30)
        c.drawCentredString(W/2, H/2 + 3*cm, "MANUAL DE INTEGRACAO")
        c.setFont("Helvetica-Bold", 22)
        c.drawCentredString(W/2, H/2 + 1.8*cm, "COM INTELIGENCIA ARTIFICIAL")
        c.setStrokeColor(W_WHITE)
        c.setLineWidth(1)
        c.line(MARGIN*2, H/2 + 1.2*cm, W-MARGIN*2, H/2 + 1.2*cm)
        c.setFont("Helvetica", 13)
        c.setFillColor(colors.Color(200/255,200/255,210/255))
        c.drawCentredString(W/2, H/2 + 0.5*cm, "Appointments API — Prompt + Guia Passo a Passo")
        c.drawCentredString(W/2, H/2 - 0.3*cm, "appointments-api-five.vercel.app")
        c.setFont("Helvetica", 10)
        c.drawCentredString(W/2, 2*cm, "La Patita Pet")

    story.append(PageBreak())

    # Index
    story.append(Paragraph("INDICE", BH1))
    story.append(HRFlowable(width="100%", thickness=0.5, color=HLINE, spaceAfter=10))
    for n, t in [
        ("1.", "Prompt completo para IA (copiar e colar)"),
        ("2.", "Passo 1 — Criar um novo negocio na API"),
        ("3.", "Passo 2 — Configurar variaveis de ambiente"),
        ("4.", "Passo 3 — Setup de admin (primeira vez)"),
        ("5.", "Passo 4 — Configurar funcionarios, servicos e horarios"),
        ("6.", "Passo 5 — Deploy em producao (Vercel)"),
        ("7.", "Resolucao de problemas frequentes"),
    ]:
        story.append(Paragraph(f"<b>{n}</b>  {t}",
            ParagraphStyle("toc2", fontName="Helvetica", fontSize=10,
                           textColor=DARK2, leading=18, leftIndent=8)))
    story.append(PageBreak())

    # Section 1 — THE PROMPT
    story.append(Paragraph("1. Prompt completo para IA", BH1))
    story.append(HRFlowable(width="100%", thickness=0.5, color=HLINE, spaceAfter=8))
    story.append(Paragraph(
        "Copia e cola o prompt abaixo diretamente na IA logo apos criar o website. "
        "Substitui os valores entre [COLCHETES] pelos teus dados reais antes de colar.", BB))
    story.append(Spacer(1, 6))

    story.append(code_block([
        "Integra a Appointments API (https://appointments-api-five.vercel.app) neste projeto.",
        "Ja tenho um negocio registado. A minha API key e: [MINHA_API_KEY]",
        "",
        "== VARIAVEIS DE AMBIENTE ==",
        "Next.js:  NEXT_PUBLIC_API_URL=https://appointments-api-five.vercel.app",
        "          NEXT_PUBLIC_API_KEY=[MINHA_API_KEY]",
        "Vite/React: VITE_API_URL=https://appointments-api-five.vercel.app",
        "            VITE_API_KEY=[MINHA_API_KEY]",
        "",
        "== HELPER DE FETCH (TypeScript) ==",
        "async function apiFetch(endpoint, options = {}) {",
        "  const res = await fetch(`${API_URL}${endpoint}`, {",
        "    ...options,",
        "    headers: { 'Content-Type': 'application/json',",
        "               'x-api-key': API_KEY, ...options.headers }",
        "  });",
        "  return res.json();",
        "}",
        "// Admin: adiciona header 'Authorization': `Bearer ${localStorage.getItem('admin_token')}`",
    ]))
    story.append(code_block([
        "== ENDPOINTS PUBLICOS (x-api-key obrigatorio) ==",
        "GET  /api/empleados",
        "  -> { empleados: [{ id, nombre, email, telefono }] }",
        "",
        "GET  /api/servicios?empleadoId={id}",
        "  -> { servicios: [{ id, nombre, duracion, precio }] }",
        "",
        "POST /api/disponibilidad-multiple",
        "  body: { fechas: string[], servicioId: number, empleadoId: number }",
        "  -> { resultados: [{ fecha, disponible, huecos: string[], horasOcupadas }] }",
        "",
        "POST /api/citas",
        "  body: { nombreCliente, emailCliente, fecha: 'YYYY-MM-DDTHH:MM:00',",
        "          servicioId, empleadoId }",
        "  -> { cita } | { error: string }   [envia email automatico ao cliente]",
    ]))
    story.append(code_block([
        "== WIZARD DE RESERVAS (5 passos) ==",
        "Passo 1: GET /api/empleados -> lista, utilizador seleciona um",
        "Passo 2: GET /api/servicios?empleadoId=X -> servicos do especialista",
        "Passo 3: POST /api/disponibilidad-multiple com proximos 14 dias",
        "         -> filtrar disponivel=true -> mostrar dias",
        "Passo 4: Mostrar huecos[] como botoes, horasOcupadas[] tachados/desativados",
        "Passo 5: Formulario nome+email -> POST /api/citas -> sucesso ou mensagem de erro",
        "",
        "Utilitarios:",
        "  formatarFecha(date: Date) -> 'YYYY-MM-DD'",
        "  getProximasDosSemanas()   -> array de 14 datas a partir de amanha",
        "  DIAS_PT  = ['Domingo','Segunda','Terca','Quarta','Quinta','Sexta','Sabado']",
        "  MESES_PT = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']",
    ]))
    story.append(code_block([
        "== SISTEMA ADMIN ==",
        "Rotas a criar: /admin/setup  /admin (login)  /admin/dashboard",
        "",
        "Fluxo de autenticacao:",
        "  GET /api/admin/check?apiKey={KEY} -> { configurado: boolean }",
        "  POST /api/admin/setup  body: { apiKey, password (min 8 chars) }",
        "  POST /api/admin/login  body: { apiKey, password } -> { token, negocio }",
        "  localStorage.setItem('admin_token', token)",
        "  Cada pedido admin: header 'Authorization': 'Bearer ' + token",
        "",
        "Tab Marcacoes:",
        "  GET /api/admin/citas?skip=0&take=10&fecha=YYYY-MM-DD&empleadoId=X",
        "  PATCH /api/admin/citas?id=X  body: { estado: 'confirmada'|'cancelada' }",
        "  Implementar: calendario mini, filtro por funcionario, paginacao",
        "",
        "Tab Funcionarios:",
        "  GET/POST/PATCH/DELETE /api/admin/empleados  body:{nombre,email?,telefono?}",
        "  Implementar: lista com edicao inline, formulario de adicionar",
        "",
        "Tab Servicos:",
        "  GET/POST/DELETE /api/admin/servicios  body:{nombre,duracion,precio?,empleadoId}",
        "  Nao eliminar se tiver marcacoes associadas — mostrar mensagem de erro",
        "",
        "Tab Horarios:",
        "  GET/POST/DELETE /api/admin/horarios",
        "  body:{diaSemana:'lunes'|'martes'|'miercoles'|'jueves'|'viernes'|'sabado'|'domingo',",
        "        horaInicio:'HH:MM', horaFin:'HH:MM', empleadoId}",
        "  ATENCAO: diaSemana em ESPANHOL ('lunes'...'domingo')",
        "",
        "Tab Pausas:",
        "  GET/POST/DELETE /api/admin/pausas  (mesma estrutura de horarios)",
        "  A pausa deve estar dentro do horario do dia selecionado",
        "",
        "Tab Dias Bloqueados:",
        "  GET/POST/DELETE /api/admin/dias-bloqueados  body:{fecha,motivo?,empleadoId}",
        "",
        "Tab Definicoes:",
        "  PATCH /api/admin/password  body:{passwordActual, passwordNueva}",
        "  Mostrar negocio.nombre e negocio.email (lidos de localStorage)",
    ]))
    story.append(code_block([
        "== UX / UI ==",
        "- Todos os textos em PORTUGUES DE PORTUGAL",
        "- Mensagens de sucesso/erro desaparecem apos 3-4 segundos automaticamente",
        "- Loading states e skeletons em todos os pedidos a API",
        "- Formularios limpam os seus campos apos submissao com sucesso",
        "- Todos os botoes 'Reservar' da landing page devem navegar para /reservas",
        "- Instalar: npm install framer-motion",
        "- Usar Framer Motion: AnimatePresence (transicoes), whileInView (scroll), whileHover",
        "",
        "== FICHEIROS A CRIAR ==",
        "src/lib/api.ts                   -> apiFetch, tipos, formatarFecha, getProximasDosSemanas",
        "src/lib/adminAuth.ts             -> adminFetch, getToken, setToken, clearToken, tipos admin",
        "src/app/reservas/page.tsx        -> pagina de reservas com metadata SEO",
        "src/components/Booking/          -> BookingWizard.tsx ('use client', wizard 5 passos)",
        "src/app/admin/setup/page.tsx     -> ('use client') primeira configuracao da senha",
        "src/app/admin/page.tsx           -> ('use client') login do administrador",
        "src/app/admin/dashboard/page.tsx -> ('use client') dashboard completo com 7 abas",
    ]))
    story.append(PageBreak())

    # Section 2 — CREATE NEGOCIO
    story.append(Paragraph("2. Passo 1 — Criar um novo negocio na API", BH1))
    story.append(HRFlowable(width="100%", thickness=0.5, color=HLINE, spaceAfter=8))
    story.append(Paragraph(
        "Antes de integrar a API num novo website, precisas de criar um negocio "
        "e obter a sua API key unica. Executa este comando no terminal:", BB))
    story.append(code_block([
        "curl -X POST https://appointments-api-five.vercel.app/api/negocios \\",
        "  -H \"Content-Type: application/json\" \\",
        '  -d \'{"nombre": "Nome do Teu Negocio", "email": "teu@email.com"}\'',
    ]))
    story.append(Paragraph("Resposta esperada:", BH3))
    story.append(code_block([
        "{",
        '  "mensaje": "Negocio criado com sucesso",',
        '  "negocio": {',
        '    "id": 2,',
        '    "nombre": "Nome do Teu Negocio",',
        '    "email": "teu@email.com",',
        '    "apiKey": "GUARDA_ESTA_KEY"',
        "  }",
        "}",
    ]))
    story.append(Paragraph(
        "Guarda a apiKey — e o identificador unico do teu negocio. "
        "Nao a partilhes publicamente.", BNOTE))
    story.append(Spacer(1, 6))
    story.append(Paragraph("Erros possiveis:", BH3))
    err_data = [
        ["Codigo", "Mensagem", "Solucao"],
        ["400", "Nome e email sao obrigatorios", "Verifica que o JSON tem os dois campos"],
        ["409", "Ja existe um negocio com esse email", "Usa um email diferente"],
    ]
    err_t = Table(err_data, colWidths=[1.8*cm, 6*cm, W-2*MARGIN-7.8*cm-0.2*cm])
    err_t.setStyle(TableStyle([
        ("BACKGROUND",(0,0),(-1,0), DARK2), ("TEXTCOLOR",(0,0),(-1,0), W_WHITE),
        ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"), ("FONTSIZE",(0,0),(-1,-1),8.5),
        ("ROWBACKGROUNDS",(0,1),(-1,-1),[CODE,W_WHITE]),
        ("BOX",(0,0),(-1,-1),0.5,HLINE), ("INNERGRID",(0,0),(-1,-1),0.3,HLINE),
        ("LEFTPADDING",(0,0),(-1,-1),6), ("TOPPADDING",(0,0),(-1,-1),5),
        ("BOTTOMPADDING",(0,0),(-1,-1),5),
    ]))
    story.append(err_t)
    story.append(PageBreak())

    # Section 3 — ENV VARS
    story.append(Paragraph("3. Passo 2 — Configurar variaveis de ambiente", BH1))
    story.append(HRFlowable(width="100%", thickness=0.5, color=HLINE, spaceAfter=8))
    story.append(Paragraph("Cria o ficheiro <b>.env.local</b> na raiz do projeto:", BB))
    story.append(code_block([
        "# .env.local (Next.js)",
        "NEXT_PUBLIC_API_URL=https://appointments-api-five.vercel.app",
        "NEXT_PUBLIC_API_KEY=a_tua_api_key_aqui",
    ]))
    story.append(Paragraph("Ou para projetos Vite/React:", BB))
    story.append(code_block([
        "# .env (Vite)",
        "VITE_API_URL=https://appointments-api-five.vercel.app",
        "VITE_API_KEY=a_tua_api_key_aqui",
    ]))
    story.append(Paragraph(
        "Reinicia o servidor de desenvolvimento apos criar o ficheiro "
        "(Ctrl+C e npm run dev) para que as variaveis sejam carregadas.", BNOTE))
    story.append(PageBreak())

    # Section 4 — ADMIN SETUP
    story.append(Paragraph("4. Passo 3 — Setup de admin (primeira vez)", BH1))
    story.append(HRFlowable(width="100%", thickness=0.5, color=HLINE, spaceAfter=8))
    story.append(Paragraph(
        "Apos o servidor estar a correr, acede a <b>/admin/setup</b> para definir a senha de administrador:", BB))
    story.append(code_block([
        "# URL de desenvolvimento",
        "http://localhost:3000/admin/setup",
        "",
        "# URL de producao",
        "https://seudominio.com/admin/setup",
    ]))
    story.append(Paragraph("Ou via API diretamente:", BB))
    story.append(code_block([
        "curl -X POST https://appointments-api-five.vercel.app/api/admin/setup \\",
        "  -H \"Content-Type: application/json\" \\",
        '  -d \'{"apiKey": "a_tua_api_key", "password": "senha_min_8_chars"}\'',
    ]))
    story.append(PageBreak())

    # Section 5 — CONFIGURE
    story.append(Paragraph("5. Passo 4 — Configurar funcionarios, servicos e horarios", BH1))
    story.append(HRFlowable(width="100%", thickness=0.5, color=HLINE, spaceAfter=8))
    story.append(Paragraph(
        "Apos o login em /admin/dashboard, configura o sistema nesta ordem:", BB))
    cfg_data = [
        ["Ordem", "Aba", "O que fazer"],
        ["1o", "Funcionarios", "Adicionar os especialistas com nome, email e telefone"],
        ["2o", "Servicos",     "Para cada funcionario, adicionar os servicos com nome, duracao e preco"],
        ["3o", "Horarios",     "Definir os dias e horas de trabalho de cada especialista"],
        ["4o", "Pausas",       "Opcional: definir intervalos de descanso dentro do horario"],
        ["5o", "Dias Bloqueados", "Opcional: bloquear ferias, feriados ou dias sem disponibilidade"],
    ]
    cfg_t = Table(cfg_data, colWidths=[1.5*cm, 4*cm, W-2*MARGIN-5.5*cm-0.2*cm])
    cfg_t.setStyle(TableStyle([
        ("BACKGROUND",(0,0),(-1,0), DARK2), ("TEXTCOLOR",(0,0),(-1,0), W_WHITE),
        ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"), ("FONTSIZE",(0,0),(-1,-1),9),
        ("ROWBACKGROUNDS",(0,1),(-1,-1),[CODE,W_WHITE]),
        ("BOX",(0,0),(-1,-1),0.5,HLINE), ("INNERGRID",(0,0),(-1,-1),0.3,HLINE),
        ("LEFTPADDING",(0,0),(-1,-1),6), ("TOPPADDING",(0,0),(-1,-1),6),
        ("BOTTOMPADDING",(0,0),(-1,-1),6), ("VALIGN",(0,0),(-1,-1),"MIDDLE"),
    ]))
    story.append(cfg_t)
    story.append(PageBreak())

    # Section 6 — PRODUCTION
    story.append(Paragraph("6. Passo 5 — Deploy em producao (Vercel)", BH1))
    story.append(HRFlowable(width="100%", thickness=0.5, color=HLINE, spaceAfter=8))
    story.append(Paragraph(
        "No Vercel, as variaveis de ambiente do ficheiro .env.local <b>nao sao enviadas "
        "para o servidor automaticamente</b>. Tens de as adicionar manualmente.", BB))
    story.append(step_table([
        ("1", "Abre o projeto no Vercel Dashboard"),
        ("2", "Vai a Settings > Environment Variables"),
        ("3", "Adiciona NEXT_PUBLIC_API_URL com o valor https://appointments-api-five.vercel.app"),
        ("4", "Adiciona NEXT_PUBLIC_API_KEY com a tua API key"),
        ("5", "Seleciona os ambientes: Production, Preview e Development"),
        ("6", "Clica em Save e faz um novo deploy (Deployments > Redeploy)"),
        ("7", "Acede a https://seudominio.com/admin/setup e configura a senha"),
    ]))
    story.append(Paragraph(
        "O ficheiro .env.local deve estar no .gitignore (por defeito ja esta). "
        "Nunca commits as variaveis de ambiente para o repositorio.", BNOTE))
    story.append(PageBreak())

    # Section 7 — TROUBLESHOOTING
    story.append(Paragraph("7. Resolucao de problemas frequentes", BH1))
    story.append(HRFlowable(width="100%", thickness=0.5, color=HLINE, spaceAfter=8))
    prob_data = [
        ["Problema", "Causa provavel", "Solucao"],
        ["API key invalida (401)", "Key errada ou nao carregada", "Reinicia o servidor; verifica .env.local"],
        ["Sem especialistas na lista", "Negocio novo sem funcionarios", "Adiciona funcionarios no dashboard"],
        ["Sem dias disponiveis", "Sem horarios ou todos bloqueados", "Define horarios no dashboard"],
        ["Login falha sempre", "Senha errada ou admin nao configurado", "Acede a /admin/setup"],
        ["Variaveis undefined em producao", "Nao adicionadas no Vercel", "Vai a Settings > Environment Variables"],
        ["Email nao chega ao cliente", "Problema na API Resend", "Verifica o email do cliente; pode estar em spam"],
        ["Sessao expira sozinha", "JWT dura 24 horas", "Faz login novamente"],
    ]
    prob_t = Table(prob_data, colWidths=[4*cm, 4.5*cm, W-2*MARGIN-8.5*cm-0.2*cm])
    prob_t.setStyle(TableStyle([
        ("BACKGROUND",(0,0),(-1,0), DARK2), ("TEXTCOLOR",(0,0),(-1,0), W_WHITE),
        ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"), ("FONTSIZE",(0,0),(-1,-1),8.5),
        ("ROWBACKGROUNDS",(0,1),(-1,-1),[CODE,W_WHITE]),
        ("BOX",(0,0),(-1,-1),0.5,HLINE), ("INNERGRID",(0,0),(-1,-1),0.3,HLINE),
        ("LEFTPADDING",(0,0),(-1,-1),6), ("TOPPADDING",(0,0),(-1,-1),5),
        ("BOTTOMPADDING",(0,0),(-1,-1),5), ("VALIGN",(0,0),(-1,-1),"TOP"),
        ("FONTNAME",(0,1),(0,-1),"Helvetica-Bold"),
    ]))
    story.append(prob_t)

    doc2 = SimpleDocTemplate(
        PATH, pagesize=A4,
        leftMargin=MARGIN, rightMargin=MARGIN,
        topMargin=2*cm, bottomMargin=1.8*cm,
        title="Manual de Integracao IA — La Patita Pet",
    )
    doc2.build(story, onFirstPage=cover, onLaterPages=header_footer)
    print(f"  Created: {PATH}")


# ══════════════════════════════════════════════════════════════════════════════
# MANUAL 3 — DATABASE (Minimalist)
# ══════════════════════════════════════════════════════════════════════════════
def make_db_manual():
    PATH = os.path.join(OUT, "manual-base-de-datos.pdf")

    BG2   = colors.white
    DARK3 = colors.Color(20/255, 20/255, 30/255)
    GRAY3 = colors.Color(100/255, 100/255, 110/255)
    CODE3 = colors.Color(242/255, 242/255, 248/255)
    HLINE3= colors.Color(200/255, 200/255, 210/255)
    GREEN = colors.Color(40/255, 140/255, 90/255)
    BLUE  = colors.Color(50/255, 80/255, 180/255)
    RED2  = colors.Color(180/255, 40/255, 40/255)
    ORNG  = colors.Color(180/255, 100/255, 20/255)

    def header_footer(c, doc):
        c.saveState()
        c.setStrokeColor(HLINE3)
        c.setLineWidth(0.5)
        c.line(MARGIN, H-1.2*cm, W-MARGIN, H-1.2*cm)
        c.setFont("Helvetica", 8)
        c.setFillColor(GRAY3)
        c.drawString(MARGIN, H-1.0*cm, "La Patita Pet — Manual de Base de Dados")
        c.drawRightString(W-MARGIN, H-1.0*cm, f"Pagina {doc.page}")
        c.line(MARGIN, 1.2*cm, W-MARGIN, 1.2*cm)
        c.drawCentredString(W/2, 0.6*cm, "PostgreSQL (Neon) via Prisma ORM")
        c.restoreState()

    DH1  = ParagraphStyle("DH1",  fontName="Helvetica-Bold", fontSize=18, textColor=DARK3, spaceAfter=8, spaceBefore=14)
    DH2  = ParagraphStyle("DH2",  fontName="Helvetica-Bold", fontSize=13, textColor=DARK3, spaceAfter=6, spaceBefore=12)
    DH3  = ParagraphStyle("DH3",  fontName="Helvetica-Bold", fontSize=10, textColor=BLUE, spaceAfter=4, spaceBefore=8)
    DB   = ParagraphStyle("DB",   fontName="Helvetica",       fontSize=9.5, textColor=DARK3, leading=14, spaceAfter=5)
    DNOTE= ParagraphStyle("DNOTE",fontName="Helvetica-Oblique",fontSize=9, textColor=GRAY3, leading=13, spaceAfter=5)
    DTOC = ParagraphStyle("DTOC", fontName="Helvetica", fontSize=10, textColor=DARK3, leading=18, leftIndent=8)

    CODE_W2 = W - 2*MARGIN - 0.4*cm

    def code_block(lines, lang_color=DARK3):
        text = "<br/>".join(lines)
        p = Paragraph(text, ParagraphStyle("dcode",
            fontName="Courier", fontSize=8, textColor=lang_color,
            leading=12, leftIndent=6, rightIndent=6))
        t = Table([[p]], colWidths=[CODE_W2])
        t.setStyle(TableStyle([
            ("BACKGROUND",(0,0),(-1,-1), CODE3),
            ("BOX",(0,0),(-1,-1),0.5,HLINE3),
            ("TOPPADDING",(0,0),(-1,-1),6),("BOTTOMPADDING",(0,0),(-1,-1),6),
            ("LEFTPADDING",(0,0),(-1,-1),4),("RIGHTPADDING",(0,0),(-1,-1),4),
        ]))
        return KeepTogether([t, Spacer(1,6)])

    def op_label(op):
        colors_map = {"CREATE": GREEN, "READ": BLUE, "UPDATE": ORNG, "DELETE": RED2}
        c2 = colors_map.get(op, DARK3)
        p = Paragraph(f"<b>-- {op}</b>", ParagraphStyle("ol",
            fontName="Courier", fontSize=8, textColor=c2))
        return p

    def section_header(table_name, emoji=""):
        return [
            Paragraph(f"{emoji}  {table_name}", DH2),
            HRFlowable(width="100%", thickness=0.5, color=HLINE3, spaceAfter=6),
        ]

    story = []

    def cover(c, doc):
        c.setFillColor(DARK3)
        c.rect(0, 0, W, H, fill=1, stroke=0)
        c.setFillColor(colors.white)
        c.setFont("Helvetica-Bold", 30)
        c.drawCentredString(W/2, H/2 + 3*cm, "MANUAL DE BASE DE DADOS")
        c.setFont("Helvetica", 16)
        c.setFillColor(colors.Color(200/255,200/255,210/255))
        c.drawCentredString(W/2, H/2 + 1.8*cm, "SQL Queries e Terminal (Prisma)")
        c.setStrokeColor(colors.white)
        c.setLineWidth(1)
        c.line(MARGIN*2, H/2+1.2*cm, W-MARGIN*2, H/2+1.2*cm)
        c.setFont("Helvetica", 11)
        c.drawCentredString(W/2, H/2 + 0.5*cm, "PostgreSQL via Neon — ORM: Prisma 7")
        c.setFont("Helvetica", 10)
        c.drawCentredString(W/2, 2*cm, "La Patita Pet | appointments-api-five.vercel.app")

    story.append(PageBreak())

    # Index
    story.append(Paragraph("INDICE", DH1))
    story.append(HRFlowable(width="100%", thickness=0.5, color=HLINE3, spaceAfter=10))
    toc_items = [
        ("1.", "Comandos de Terminal (Prisma CLI)"),
        ("2.", "Tabela Negocio"),
        ("3.", "Tabela Empleado (Funcionario)"),
        ("4.", "Tabela Servicio (Servico)"),
        ("5.", "Tabela Horario"),
        ("6.", "Tabela Pausa"),
        ("7.", "Tabela DiaBloqueado"),
        ("8.", "Tabela Cita (Marcacao)"),
        ("9.", "Queries Avancados"),
        ("10.", "Estrutura completa do esquema"),
    ]
    for n, t in toc_items:
        story.append(Paragraph(f"<b>{n}</b>  {t}", DTOC))
    story.append(PageBreak())

    # 1. Terminal
    for h in section_header("1. Comandos de Terminal (Prisma CLI)", "💻"):
        story.append(h)
    story.append(Paragraph("Comandos uteis para gerir a base de dados localmente:", DB))
    story.append(code_block([
        "# Ver e editar dados visualmente no browser",
        "npx prisma studio",
        "",
        "# Sincronizar o schema com a base de dados (sem migrations)",
        "npx prisma db push",
        "",
        "# Criar uma migration e aplicar",
        "npx prisma migrate dev --name nome_da_migracao",
        "",
        "# Aplicar migrations em producao",
        "npx prisma migrate deploy",
        "",
        "# Regenerar o cliente Prisma apos mudar o schema",
        "npx prisma generate",
        "",
        "# Ver estado das migrations",
        "npx prisma migrate status",
        "",
        "# Reset completo (APAGA TODOS OS DADOS)",
        "npx prisma migrate reset",
        "",
        "# Introspect — importar schema duma BD existente",
        "npx prisma db pull",
        "",
        "# Formatar o schema.prisma",
        "npx prisma format",
    ]))
    story.append(PageBreak())

    # 2. NEGOCIO
    for h in section_header("2. Tabela Negocio", "🏢"):
        story.append(h)
    story.append(Paragraph(
        "Cada negocio e um tenant independente com a sua propria API key. "
        "Todas as outras entidades pertencem a um negocio.", DB))
    story.append(code_block([
        "-- SCHEMA",
        "id         Int      @id @default(autoincrement())",
        "nombre     String",
        "email      String   @unique",
        "apiKey     String   @unique @default(cuid())",
        "adminPassword String?",
        "creadoEn   DateTime @default(now())",
    ]))
    story.append(Paragraph("Queries SQL:", DH3))
    story.append(code_block([
        "-- CREATE",
        "INSERT INTO \"Negocio\" (nombre, email)",
        "VALUES ('La Patita Pet', 'email@example.com');",
        "-- Nota: apiKey e gerado automaticamente (cuid)",
        "",
        "-- READ — todos",
        "SELECT id, nombre, email, \"apiKey\", \"creadoEn\" FROM \"Negocio\";",
        "",
        "-- READ — por ID",
        "SELECT * FROM \"Negocio\" WHERE id = 1;",
        "",
        "-- READ — por email",
        "SELECT * FROM \"Negocio\" WHERE email = 'email@example.com';",
        "",
        "-- READ — por apiKey",
        "SELECT * FROM \"Negocio\" WHERE \"apiKey\" = 'cmpymk127000004ju..';",
        "",
        "-- UPDATE — nome",
        "UPDATE \"Negocio\" SET nombre = 'Novo Nome' WHERE id = 1;",
        "",
        "-- UPDATE — email",
        "UPDATE \"Negocio\" SET email = 'novo@email.com' WHERE id = 1;",
        "",
        "-- DELETE (cuidado: elimina tudo em cascata)",
        "DELETE FROM \"Negocio\" WHERE id = 1;",
    ]))
    story.append(PageBreak())

    # 3. EMPLEADO
    for h in section_header("3. Tabela Empleado (Funcionario)", "👤"):
        story.append(h)
    story.append(code_block([
        "-- SCHEMA",
        "id         Int      @id @default(autoincrement())",
        "negocioId  Int      (FK -> Negocio)",
        "nombre     String",
        "email      String?",
        "telefono   String?",
        "creadoEn   DateTime @default(now())",
    ]))
    story.append(code_block([
        "-- CREATE",
        "INSERT INTO \"Empleado\" (\"negocioId\", nombre, email, telefono)",
        "VALUES (1, 'Maria Garcia', 'maria@email.com', '+351 912 345 678');",
        "",
        "-- READ — todos do negocio",
        "SELECT * FROM \"Empleado\" WHERE \"negocioId\" = 1 ORDER BY nombre;",
        "",
        "-- READ — por ID",
        "SELECT * FROM \"Empleado\" WHERE id = 5;",
        "",
        "-- UPDATE",
        "UPDATE \"Empleado\"",
        "SET nombre = 'Maria Silva', email = 'silva@email.com'",
        "WHERE id = 5;",
        "",
        "-- DELETE",
        "DELETE FROM \"Empleado\" WHERE id = 5;",
        "",
        "-- COUNT por negocio",
        "SELECT COUNT(*) FROM \"Empleado\" WHERE \"negocioId\" = 1;",
    ]))
    story.append(PageBreak())

    # 4. SERVICIO
    for h in section_header("4. Tabela Servicio (Servico)", "✂"):
        story.append(h)
    story.append(code_block([
        "-- SCHEMA",
        "id          Int      @id @default(autoincrement())",
        "empleadoId  Int      (FK -> Empleado)",
        "nombre      String",
        "duracion    Int      (minutos)",
        "precio      Float?",
    ]))
    story.append(code_block([
        "-- CREATE",
        "INSERT INTO \"Servicio\" (\"empleadoId\", nombre, duracion, precio)",
        "VALUES (5, 'Banho & Brilho', 60, 25.00);",
        "",
        "-- READ — todos do funcionario",
        "SELECT * FROM \"Servicio\" WHERE \"empleadoId\" = 5;",
        "",
        "-- READ — por ID",
        "SELECT * FROM \"Servicio\" WHERE id = 10;",
        "",
        "-- READ — servicos com preco",
        "SELECT * FROM \"Servicio\" WHERE \"empleadoId\" = 5 AND precio IS NOT NULL;",
        "",
        "-- UPDATE",
        "UPDATE \"Servicio\"",
        "SET nombre = 'Banho Completo', duracion = 90, precio = 30.00",
        "WHERE id = 10;",
        "",
        "-- DELETE",
        "DELETE FROM \"Servicio\" WHERE id = 10;",
        "",
        "-- Verificar se tem marcacoes (antes de eliminar)",
        "SELECT COUNT(*) FROM \"Cita\" WHERE \"servicioId\" = 10;",
    ]))
    story.append(PageBreak())

    # 5. HORARIO
    for h in section_header("5. Tabela Horario", "🕐"):
        story.append(h)
    story.append(code_block([
        "-- SCHEMA",
        "id          Int    @id @default(autoincrement())",
        "empleadoId  Int    (FK -> Empleado)",
        "diaSemana   String ('lunes','martes','miercoles','jueves',",
        "                    'viernes','sabado','domingo')",
        "horaInicio  String ('HH:MM')",
        "horaFin     String ('HH:MM')",
    ]))
    story.append(code_block([
        "-- CREATE",
        "INSERT INTO \"Horario\" (\"empleadoId\", \"diaSemana\", \"horaInicio\", \"horaFin\")",
        "VALUES (5, 'lunes', '09:00', '18:00');",
        "",
        "-- READ — todos do funcionario",
        "SELECT * FROM \"Horario\" WHERE \"empleadoId\" = 5;",
        "",
        "-- READ — horario de um dia especifico",
        "SELECT * FROM \"Horario\"",
        "WHERE \"empleadoId\" = 5 AND \"diaSemana\" = 'lunes';",
        "",
        "-- READ — todos os funcionarios com horario a segunda",
        "SELECT e.nombre, h.\"horaInicio\", h.\"horaFin\"",
        "FROM \"Horario\" h JOIN \"Empleado\" e ON h.\"empleadoId\" = e.id",
        "WHERE h.\"diaSemana\" = 'lunes' AND e.\"negocioId\" = 1;",
        "",
        "-- UPDATE",
        "UPDATE \"Horario\"",
        "SET \"horaInicio\" = '08:00', \"horaFin\" = '17:00'",
        "WHERE id = 15;",
        "",
        "-- DELETE — por ID",
        "DELETE FROM \"Horario\" WHERE id = 15;",
        "",
        "-- DELETE — dia especifico de um funcionario",
        "DELETE FROM \"Horario\"",
        "WHERE \"empleadoId\" = 5 AND \"diaSemana\" = 'lunes';",
    ]))
    story.append(PageBreak())

    # 6. PAUSA
    for h in section_header("6. Tabela Pausa", "☕"):
        story.append(h)
    story.append(code_block([
        "-- SCHEMA",
        "id          Int    @id @default(autoincrement())",
        "empleadoId  Int    (FK -> Empleado)",
        "diaSemana   String (mesmo formato que Horario)",
        "horaInicio  String ('HH:MM')",
        "horaFin     String ('HH:MM')",
    ]))
    story.append(code_block([
        "-- CREATE",
        "INSERT INTO \"Pausa\" (\"empleadoId\", \"diaSemana\", \"horaInicio\", \"horaFin\")",
        "VALUES (5, 'lunes', '13:00', '14:00');",
        "",
        "-- READ — todas as pausas do funcionario",
        "SELECT * FROM \"Pausa\" WHERE \"empleadoId\" = 5;",
        "",
        "-- READ — pausas de um dia especifico",
        "SELECT * FROM \"Pausa\"",
        "WHERE \"empleadoId\" = 5 AND \"diaSemana\" = 'lunes';",
        "",
        "-- DELETE",
        "DELETE FROM \"Pausa\" WHERE id = 20;",
        "",
        "-- DELETE — todas as pausas de um dia",
        "DELETE FROM \"Pausa\"",
        "WHERE \"empleadoId\" = 5 AND \"diaSemana\" = 'sabado';",
    ]))
    story.append(PageBreak())

    # 7. DIA BLOQUEADO
    for h in section_header("7. Tabela DiaBloqueado", "🔒"):
        story.append(h)
    story.append(code_block([
        "-- SCHEMA",
        "id          Int      @id @default(autoincrement())",
        "empleadoId  Int      (FK -> Empleado)",
        "fecha       DateTime",
        "motivo      String?",
    ]))
    story.append(code_block([
        "-- CREATE",
        "INSERT INTO \"DiaBloqueado\" (\"empleadoId\", fecha, motivo)",
        "VALUES (5, '2025-12-25', 'Natal');",
        "",
        "-- READ — todos (futuros)",
        "SELECT * FROM \"DiaBloqueado\"",
        "WHERE \"empleadoId\" = 5 AND fecha > NOW()",
        "ORDER BY fecha ASC;",
        "",
        "-- READ — verificar se uma data esta bloqueada",
        "SELECT * FROM \"DiaBloqueado\"",
        "WHERE \"empleadoId\" = 5",
        "AND DATE(fecha) = '2025-12-25';",
        "",
        "-- DELETE — desbloquear",
        "DELETE FROM \"DiaBloqueado\" WHERE id = 25;",
        "",
        "-- DELETE — limpar dias passados",
        "DELETE FROM \"DiaBloqueado\" WHERE fecha < NOW();",
        "",
        "-- DELETE — bloquear um intervalo e depois apagar",
        "DELETE FROM \"DiaBloqueado\"",
        "WHERE \"empleadoId\" = 5",
        "AND fecha BETWEEN '2025-08-01' AND '2025-08-15';",
    ]))
    story.append(PageBreak())

    # 8. CITA
    for h in section_header("8. Tabela Cita (Marcacao)", "📅"):
        story.append(h)
    story.append(code_block([
        "-- SCHEMA",
        "id             Int      @id @default(autoincrement())",
        "negocioId      Int      (FK -> Negocio)",
        "empleadoId     Int      (FK -> Empleado)",
        "servicioId     Int      (FK -> Servicio)",
        "nombreCliente  String",
        "emailCliente   String",
        "fecha          DateTime ('YYYY-MM-DDTHH:MM')",
        "estado         String   @default('pendiente')",
        "               -- valores: 'pendiente'|'confirmada'|'cancelada'",
        "creadoEn       DateTime @default(now())",
    ]))
    story.append(code_block([
        "-- CREATE",
        "INSERT INTO \"Cita\"",
        "  (\"negocioId\",\"empleadoId\",\"servicioId\",\"nombreCliente\",\"emailCliente\",fecha)",
        "VALUES (1, 5, 10, 'Ana Costa', 'ana@email.com', '2025-06-20T10:00');",
        "",
        "-- READ — todas com joins",
        "SELECT c.id, c.\"nombreCliente\", c.\"emailCliente\", c.fecha, c.estado,",
        "       s.nombre AS servico, s.duracion, e.nombre AS especialista",
        "FROM \"Cita\" c",
        "JOIN \"Servicio\" s ON c.\"servicioId\" = s.id",
        "JOIN \"Empleado\" e ON c.\"empleadoId\" = e.id",
        "WHERE c.\"negocioId\" = 1",
        "ORDER BY c.fecha DESC;",
        "",
        "-- READ — por data especifica",
        "SELECT * FROM \"Cita\"",
        "WHERE \"negocioId\" = 1 AND DATE(fecha) = '2025-06-20';",
        "",
        "-- READ — pendentes",
        "SELECT * FROM \"Cita\"",
        "WHERE \"negocioId\" = 1 AND estado = 'pendiente'",
        "ORDER BY fecha ASC;",
        "",
        "-- READ — de hoje",
        "SELECT * FROM \"Cita\"",
        "WHERE \"negocioId\" = 1 AND DATE(fecha) = CURRENT_DATE;",
        "",
        "-- READ — de um funcionario especifico",
        "SELECT * FROM \"Cita\"",
        "WHERE \"empleadoId\" = 5 AND \"negocioId\" = 1",
        "ORDER BY fecha DESC;",
        "",
        "-- UPDATE — mudar estado",
        "UPDATE \"Cita\" SET estado = 'confirmada' WHERE id = 30;",
        "UPDATE \"Cita\" SET estado = 'cancelada'  WHERE id = 30;",
        "",
        "-- DELETE",
        "DELETE FROM \"Cita\" WHERE id = 30;",
        "",
        "-- DELETE — canceladas mais antigas de 30 dias",
        "DELETE FROM \"Cita\"",
        "WHERE estado = 'cancelada'",
        "AND fecha < NOW() - INTERVAL '30 days';",
    ]))
    story.append(PageBreak())

    # 9. ADVANCED
    for h in section_header("9. Queries Avancados", "🔍"):
        story.append(h)
    story.append(code_block([
        "-- ESTATISTICAS: contagem por estado",
        "SELECT estado, COUNT(*) AS total",
        "FROM \"Cita\" WHERE \"negocioId\" = 1",
        "GROUP BY estado;",
        "",
        "-- ESTATISTICAS: marcacoes por dia (ultimos 30 dias)",
        "SELECT DATE(fecha) AS dia, COUNT(*) AS total",
        "FROM \"Cita\" WHERE \"negocioId\" = 1",
        "AND fecha >= NOW() - INTERVAL '30 days'",
        "GROUP BY DATE(fecha) ORDER BY dia;",
        "",
        "-- ESTATISTICAS: servicos mais reservados",
        "SELECT s.nombre, COUNT(*) AS total",
        "FROM \"Cita\" c JOIN \"Servicio\" s ON c.\"servicioId\" = s.id",
        "WHERE c.\"negocioId\" = 1",
        "GROUP BY s.nombre ORDER BY total DESC;",
        "",
        "-- DISPONIBILIDADE: horas ocupadas num dia/funcionario",
        "SELECT fecha FROM \"Cita\"",
        "WHERE \"empleadoId\" = 5",
        "AND DATE(fecha) = '2025-06-20'",
        "AND estado != 'cancelada';",
        "",
        "-- MARCACOES desta semana de um funcionario",
        "SELECT c.*, s.nombre AS servico",
        "FROM \"Cita\" c JOIN \"Servicio\" s ON c.\"servicioId\" = s.id",
        "WHERE c.\"empleadoId\" = 5",
        "AND c.fecha >= date_trunc('week', NOW())",
        "AND c.fecha <  date_trunc('week', NOW()) + INTERVAL '7 days';",
        "",
        "-- TODOS OS NEGOCIOS com contagem de citas",
        "SELECT n.nombre, n.email, COUNT(c.id) AS total_citas",
        "FROM \"Negocio\" n",
        "LEFT JOIN \"Cita\" c ON c.\"negocioId\" = n.id",
        "GROUP BY n.id, n.nombre, n.email;",
        "",
        "-- VERIFICAR CONFLITO de horario (sobreposicao)",
        "SELECT * FROM \"Cita\"",
        "WHERE \"empleadoId\" = 5",
        "AND DATE(fecha) = '2025-06-20'",
        "AND fecha BETWEEN '2025-06-20T10:00' AND '2025-06-20T11:00'",
        "AND estado != 'cancelada';",
    ]))
    story.append(PageBreak())

    # 10. SCHEMA
    for h in section_header("10. Estrutura completa do esquema", "📐"):
        story.append(h)
    story.append(code_block([
        "model Negocio {",
        "  id            Int        @id @default(autoincrement())",
        "  nombre        String",
        "  email         String     @unique",
        "  apiKey        String     @unique @default(cuid())",
        "  adminPassword String?",
        "  creadoEn      DateTime   @default(now())",
        "  empleados     Empleado[]",
        "  citas         Cita[]",
        "}",
        "",
        "model Empleado {",
        "  id             Int             @id @default(autoincrement())",
        "  negocioId      Int",
        "  nombre         String",
        "  email          String?",
        "  telefono       String?",
        "  creadoEn       DateTime        @default(now())",
        "  negocio        Negocio         @relation(fields:[negocioId], references:[id])",
        "  servicios      Servicio[]",
        "  horarios       Horario[]",
        "  pausas         Pausa[]",
        "  diasBloqueados DiaBloqueado[]",
        "  citas          Cita[]",
        "}",
        "",
        "model Servicio {",
        "  id         Int      @id @default(autoincrement())",
        "  empleadoId Int",
        "  nombre     String",
        "  duracion   Int",
        "  precio     Float?",
        "  empleado   Empleado @relation(fields:[empleadoId], references:[id])",
        "  citas      Cita[]",
        "}",
    ]))
    story.append(code_block([
        "model Horario {",
        "  id         Int      @id @default(autoincrement())",
        "  empleadoId Int",
        "  diaSemana  String",
        "  horaInicio String",
        "  horaFin    String",
        "  empleado   Empleado @relation(fields:[empleadoId], references:[id])",
        "}",
        "",
        "model Pausa {",
        "  id         Int      @id @default(autoincrement())",
        "  empleadoId Int",
        "  diaSemana  String",
        "  horaInicio String",
        "  horaFin    String",
        "  empleado   Empleado @relation(fields:[empleadoId], references:[id])",
        "}",
        "",
        "model DiaBloqueado {",
        "  id         Int      @id @default(autoincrement())",
        "  empleadoId Int",
        "  fecha      DateTime",
        "  motivo     String?",
        "  empleado   Empleado @relation(fields:[empleadoId], references:[id])",
        "}",
        "",
        "model Cita {",
        "  id            Int      @id @default(autoincrement())",
        "  negocioId     Int",
        "  empleadoId    Int",
        "  servicioId    Int",
        "  nombreCliente String",
        "  emailCliente  String",
        "  fecha         DateTime",
        "  estado        String   @default('pendiente')",
        "  creadoEn      DateTime @default(now())",
        "  negocio       Negocio  @relation(fields:[negocioId], references:[id])",
        "  empleado      Empleado @relation(fields:[empleadoId], references:[id])",
        "  servicio      Servicio @relation(fields:[servicioId], references:[id])",
        "}",
    ]))

    doc3 = SimpleDocTemplate(
        PATH, pagesize=A4,
        leftMargin=MARGIN, rightMargin=MARGIN,
        topMargin=2*cm, bottomMargin=1.8*cm,
        title="Manual de Base de Dados — La Patita Pet",
    )
    doc3.build(story, onFirstPage=cover, onLaterPages=header_footer)
    print(f"  Created: {PATH}")


# ══════════════════════════════════════════════════════════════════════════════
# MAIN
# ══════════════════════════════════════════════════════════════════════════════
if __name__ == "__main__":
    print("Generating La Patita Pet manuals...")
    make_admin_manual()
    make_ia_manual()
    make_db_manual()
    print("Done! All PDFs saved to:", OUT)
