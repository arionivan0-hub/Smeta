import json, subprocess, sys, urllib.request, urllib.parse, ssl, re, os

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

queries = [
    'presupuestosya.com reforma integral apartamento precio m2 España',
    'reforma integral apartamento 70m2 precio presupuesto España 2025',
    'presupuestos reformas integrales apartamentos precio cuadrado metro',
    'site:presupuestosya.com reforma integral precio',
    'reforma integral apartamento precio medio por metro cuadrado 2025',
    'presupuestos reformas integrales pisos desglose partidas'
]

all_results = {}
for q in queries:
    try:
        url = 'https://html.duckduckgo.com/html/?q=' + urllib.parse.quote(q)
        req = urllib.request.Request(url, headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        })
        resp = urllib.request.urlopen(req, context=ctx, timeout=15)
        html = resp.read().decode('utf-8', errors='ignore')

        results = []
        # Find result blocks
        blocks = re.findall(r'<div class="links_main links_deep result__body">(.*?)</div>', html, re.DOTALL)
        if not blocks:
            # Alternative: find all result links
            link_blocks = re.findall(r'<a class="result__a" href="(.*?)">(.*?)</a>.*?<a class="result__snippet".*?>(.*?)</a>', html, re.DOTALL)
            for href, title, snippet in link_blocks[:8]:
                title = re.sub(r'<[^>]+>', '', title).strip()
                snippet = re.sub(r'<[^>]+>', '', snippet).strip()
                results.append({'url': href, 'title': title, 'snippet': snippet[:300]})
        else:
            for block in blocks[:8]:
                href_m = re.search(r'<a class="result__a" href="(.*?)"', block)
                title_m = re.search(r'<a class="result__a"[^>]*>(.*?)</a>', block, re.DOTALL)
                snip_m = re.search(r'<a class="result__snippet".*?>(.*?)</a>', block, re.DOTALL)
                if href_m:
                    href = href_m.group(1)
                    title = re.sub(r'<[^>]+>', '', title_m.group(1)).strip() if title_m else ''
                    snippet = re.sub(r'<[^>]+>', '', snip_m.group(1)).strip() if snip_m else ''
                    results.append({'url': href, 'title': title, 'snippet': snippet[:300]})

        all_results[q] = results[:6]
    except Exception as e:
        all_results[q] = [{'error': str(e)}]

print(json.dumps(all_results, indent=2, ensure_ascii=False))
