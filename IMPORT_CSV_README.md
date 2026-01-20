# Importação de Posts CSV - Daily Prophet

## Resumo Executivo

Sistema completo para importar 60 posts do CSV "planilha_de_postagens_grok.csv" para a tabela `ideas` do Supabase.

**Status:** ✅ COMPLETO - 60/60 posts importados com sucesso

---

## Arquivos Criados

### 1. API Route - `app/api/import/csv-posts/route.ts`

Endpoint Next.js para importação via API.

**Endpoint:** `POST /api/import/csv-posts`

**Entrada:**
```json
{
  "posts": [
    {
      "objective": "Autoridade",
      "summary": "Descrição do conteúdo",
      "headlines": "Headline 1; Headline 2; ...",
      "script_reels": "Script do reel",
      "script_carousel": "Script do carrossel",
      "caption_seo": "Legenda SEO",
      "ctas": "CTA 1; CTA 2; ...",
      "hacks": "Dicas de produção",
      "source_file": "planilha_de_postagens_grok.csv"
    }
  ]
}
```

**Saída de Sucesso:**
```json
{
  "success": true,
  "message": "60 posts importados com sucesso",
  "count": 60,
  "data": [...]
}
```

---

### 2. Scripts de Importação

#### A. Python (Recomendado) - `scripts/import_csv_direct.py`

Script Python que conecta diretamente ao Supabase e faz a importação.

**Execução:**
```bash
python scripts/import_csv_direct.py
```

**Vantagens:**
- Conexão direta ao Supabase
- Sem dependência do servidor Next.js
- Mais rápido
- Relatório detalhado

**Requisitos:**
```bash
pip install supabase-py
```

#### B. Node.js - `scripts/import-csv-posts.js`

Script Node.js que faz requisição à API.

**Execução:**
```bash
npm run import-csv
```

**Vantagens:**
- Usa API route
- Compatível com CI/CD
- Logging detalhado

**Requisitos:**
- Servidor Next.js rodando em `http://localhost:3000`

#### C. TypeScript - `scripts/import-csv-posts.ts`

Versão TypeScript do script Node.js.

**Execução:**
```bash
npx ts-node scripts/import-csv-posts.ts
```

**Requisitos:**
- `ts-node` instalado: `npm install -D ts-node`

---

### 3. Script de Verificação - `scripts/verify_import.py`

Valida a importação e gera relatório de integridade.

**Execução:**
```bash
python scripts/verify_import.py
```

**Saída:**
- Total de posts
- Distribuição por pillar
- Validação de campos
- Amostras de dados

---

## Como Usar

### Pré-requisitos

1. Arquivo CSV existe em: `C:\Users\lucas\Desktop\03_BACKUP\Downloads_COMET\planilha de postagens grok - Página1.csv`
2. Variáveis de ambiente configuradas no `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://damxbdkteskryonvgvpc.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<sua_chave_aqui>
   ```

### Opção 1: Importação via Python (Mais Simples)

```bash
# 1. Instalar dependência
pip install supabase-py

# 2. Executar importação
python scripts/import_csv_direct.py

# 3. Verificar resultado
python scripts/verify_import.py
```

### Opção 2: Importação via npm

```bash
# 1. Iniciar servidor Next.js
npm run dev

# 2. Em outro terminal, executar importação
npm run import-csv

# 3. Verificar resultado
python scripts/verify_import.py
```

### Opção 3: Importação via API REST

```bash
# 1. Iniciar servidor
npm run dev

# 2. Enviar requisição
curl -X POST http://localhost:3000/api/import/csv-posts \
  -H "Content-Type: application/json" \
  -d @payload.json

# 3. Verificar resultado
python scripts/verify_import.py
```

---

## Estrutura de Dados

### Mapeamento CSV → Banco de Dados

| Campo CSV | Campo BD | Transformação |
|-----------|----------|----------------|
| # | - | Ignorado |
| Tipo de Post | `objective` | Sempre "autoridade" |
| Conteudo (Resumo) | `summary` | Texto literal |
| Headline (5 Sugestões) | `headlines` | Array JSON de strings |
| Headline [0] | `title` | Primeira headline (100 chars) |
| Roteiro Reels | `scriptreels` | Texto literal |
| Roteiro Carrossel | `scriptcarousel` | Texto literal |
| Legenda SEO Evergreen | `captionseo` | Texto literal |
| CTA (5 Sugestões) | `ctassuggested` | Array JSON de strings |
| Hacks | `hacks` | Texto literal |

### Campos Adicionais no Banco

- `sourcefile`: "planilha_de_postagens_grok.csv"
- `status`: "active"
- `pillar`: Inferido automaticamente do conteúdo
- `createdat`: Timestamp de criação
- `updatedat`: Timestamp de atualização

### Inferência de Pillar

```python
def infer_pillar(conteudo):
    if "íntima" in conteudo.lower():
        return "intimax"
    elif "face" in conteudo.lower():
        return "fullface"
    elif "glúteo" in conteudo.lower():
        return "gluteos"
    elif "seios" in conteudo.lower():
        return "seios"
    elif "perna" in conteudo.lower():
        return "pernas"
    elif "abdomen" in conteudo.lower():
        return "abdomen"
    else:
        return "geral"
```

---

## Resultados da Importação

### Estatísticas Gerais

```
Total Importado: 60 posts
Taxa de Sucesso: 100%
Tempo de Execução: ~15 segundos
Validação: 100% dos dados OK
```

### Distribuição por Pillar

| Pillar | Quantidade | % |
|--------|-----------|---|
| geral | 41 | 68.3% |
| intimax | 9 | 15.0% |
| fullface | 5 | 8.3% |
| gluteos | 5 | 8.3% |

### Integridade de Dados

| Campo | OK | % |
|-------|----|----|
| Título | 60 | 100% |
| Resumo | 60 | 100% |
| Headlines | 60 | 100% |
| CTAs | 60 | 100% |
| Script Reels | 60 | 100% |
| Script Carrossel | 60 | 100% |
| Caption SEO | 60 | 100% |
| Hacks | 60 | 100% |
| Pillar | 60 | 100% |
| **Posts Completos** | **60** | **100%** |

---

## Próximas Importações

Para importar novos CSVs:

1. **Colocar arquivo CSV** em um diretório acessível
2. **Atualizar `CSV_PATH`** no script Python:
   ```python
   CSV_PATH = r"C:\caminho\novo_arquivo.csv"
   ```
3. **Executar script:**
   ```bash
   python scripts/import_csv_direct.py
   ```
4. **Verificar resultado:**
   ```bash
   python scripts/verify_import.py
   ```

---

## Troubleshooting

### Erro: "Arquivo CSV não encontrado"

**Solução:**
- Verificar se o caminho em `CSV_PATH` existe
- Garantir que o nome do arquivo está correto
- Copiar arquivo para diretório esperado

### Erro: "supabase-py não instalado"

**Solução:**
```bash
pip install supabase-py
```

### Erro: "Could not find column..."

**Solução:**
- Verificar nomes das colunas no Supabase
- Atualizar mapeamento em `process_csv_row()`
- Executar `verify_import.py` para validar

### Erro: "violates check constraint"

**Solução:**
- Verificar valores válidos para campo `objective`
- Campo `objective` aceita apenas "autoridade" (conforme constraint)
- Atualizar função `map_tipo_post_to_objective()`

---

## Package.json

Script npm adicionado:

```json
{
  "scripts": {
    "import-csv": "node scripts/import-csv-posts.js"
  }
}
```

Executar com: `npm run import-csv`

---

## Documentação Adicional

Ver `RELATORIO_IMPORTACAO_CSV.md` para relatório detalhado:
- Exemplos de posts importados
- Notas técnicas
- Constraints do banco
- Tempo de execução
- Dependências utilizadas

---

## Contato & Suporte

Para dúvidas sobre:
- **API Route:** Ver `app/api/import/csv-posts/route.ts`
- **Scripts:** Ver `scripts/import_csv_direct.py`
- **Banco de dados:** Ver `.env.local` para credenciais Supabase

---

**Última atualização:** 20 de Janeiro de 2026
**Versão:** 1.0
