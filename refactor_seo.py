import glob, re

files = glob.glob('*.html')

for fname in files:
    with open(fname, 'r', encoding='utf-8') as f:
        c = f.read()

    # Get title
    title_match = re.search(r'<title>(.*?)</title>', c)
    title = title_match.group(1) if title_match else "Tolosa CF Eskubaloia"
    
    # 1. Insert Meta Tags and CSP into head if not exists
    if '<meta name="description"' not in c:
        meta_tags = f"""
  <meta name="description" content="Página oficial del {title}. Noticias, plantillas, resultados y toda la actualidad del club.">
  <meta property="og:title" content="{title}">
  <meta property="og:description" content="Página oficial del Tolosa CF Eskubaloia.">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary_large_image">
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://unpkg.com https://www.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://firestore.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com;">
"""
        c = c.replace('</title>', '</title>\n' + meta_tags)

    # 2. Basic JSON-LD Schema
    if 'application/ld+json' not in c:
        schema = """
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "SportsOrganization",
    "name": "Tolosa CF Eskubaloia",
    "url": "https://[TU_DOMINIO].com",
    "logo": "https://[TU_DOMINIO].com/escudo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "[TU_EMAIL]",
      "contactType": "customer service"
    }
  }
  </script>
"""
        c = c.replace('</head>', schema + '</head>')
        
    with open(fname, 'w', encoding='utf-8') as f:
        f.write(c)

print("SEO & CSP refactor completed")
