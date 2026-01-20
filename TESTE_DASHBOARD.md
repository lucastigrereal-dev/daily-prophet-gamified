# Teste Rápido do Dashboard

## Como Testar

### 1. Iniciar o Servidor de Desenvolvimento

```bash
cd "C:\Users\lucas\Desktop\daily-prophet-gamified\09_DAILY_PROPHET\daily-prophet-gamified"
npm run dev
```

### 2. Acessar o Dashboard

Abra o navegador em:
```
http://localhost:3000/dashboard
```

### 3. Checklist de Funcionalidades

#### Visualização Geral
- [ ] Dashboard carrega sem erros
- [ ] Estatísticas aparecem no topo
- [ ] Cards de workflows são exibidos
- [ ] Design dark theme (bg-gray-900)

#### Estatísticas
- [ ] Total de workflows está correto
- [ ] Workflows em andamento calculado corretamente
- [ ] Workflows concluídos calculado corretamente
- [ ] Engajamento médio exibido
- [ ] Distribuição por status com barras
- [ ] Distribuição por formato
- [ ] Distribuição por procedimento

#### Filtros
- [ ] Campo de busca funciona
- [ ] Filtro de formato funciona
- [ ] Filtro de status funciona
- [ ] Filtro de procedimento funciona
- [ ] Contador de resultados atualiza
- [ ] Botão "Limpar Filtros" reseta tudo

#### Cards de Workflow
- [ ] Badge de formato com cor correta
- [ ] Badge de status com cor correta
- [ ] Título e objetivo exibidos
- [ ] Procedimento exibido
- [ ] Barra de progresso visual
- [ ] Métricas 24h (se existir)
- [ ] Data de criação formatada
- [ ] Notas exibidas (se existir)

#### Interações
- [ ] Hover effect no card (scale-105)
- [ ] Botão "Continuar Workflow" funciona
- [ ] Menu de ações abre/fecha
- [ ] Ação "Continuar" navega corretamente
- [ ] Ação "Ver Relatório" navega corretamente
- [ ] Ação "Duplicar" mostra alerta
- [ ] Ação "Arquivar" pede confirmação

#### Navegação
- [ ] Botão "Novo Workflow" navega para /workflow/novo
- [ ] Botão "Voltar para Home" navega para /
- [ ] Clicar no card abre o workflow

#### Responsividade
- [ ] Layout mobile (1 coluna)
- [ ] Layout tablet (2 colunas)
- [ ] Layout desktop (3 colunas)
- [ ] Filtros adaptam-se ao tamanho

### 4. Testar Filtros Combinados

#### Teste 1: Busca + Formato
```
1. Digite algo no campo de busca
2. Selecione um formato (ex: Reels)
3. Verifique se mostra apenas workflows que atendem ambos critérios
```

#### Teste 2: Status + Procedimento
```
1. Selecione um status (ex: Fase 1)
2. Selecione um procedimento (ex: Procedimento Estético)
3. Verifique se mostra apenas workflows que atendem ambos critérios
```

#### Teste 3: Todos os Filtros
```
1. Busca: "teste"
2. Formato: Reels
3. Status: Fase 2
4. Procedimento: Resultado Paciente
5. Verifique se mostra apenas workflows que atendem TODOS critérios
6. Clique em "Limpar Filtros"
7. Verifique se todos os workflows voltam a aparecer
```

### 5. Testar Casos Extremos

#### Sem Workflows
```
1. Se banco estiver vazio, deve mostrar:
   - Mensagem "Nenhum workflow encontrado"
   - Botão "Criar Primeiro Workflow"
```

#### Sem Métricas
```
1. Workflows sem metricas_24h devem:
   - Não mostrar seção de métricas
   - Ainda funcionar normalmente
```

#### Sem Notas
```
1. Workflows sem notas devem:
   - Não mostrar seção de notas
   - Ainda funcionar normalmente
```

### 6. Testar Performance

#### Tempo de Carregamento
- [ ] Dashboard carrega em < 1 segundo
- [ ] Filtros aplicam instantaneamente
- [ ] Navegação é suave (sem delays)

#### Console do Navegador
- [ ] Nenhum erro no console
- [ ] Nenhum warning crítico
- [ ] Queries Supabase executadas corretamente

### 7. Testar Navegação Entre Páginas

```
1. Home (/) → Dashboard (/dashboard)
   - Clicar no botão "Dashboard" no header

2. Dashboard → Workflow Individual
   - Clicar em "Continuar Workflow"
   - URL deve ser /workflow/[id]

3. Dashboard → Novo Workflow
   - Clicar em "Novo Workflow"
   - URL deve ser /workflow/novo

4. Dashboard → Home
   - Clicar em "Voltar para Home"
   - URL deve ser /
```

### 8. Verificar Integração com Supabase

#### No Console do Navegador (F12)
```javascript
// Verificar query executada
// Deve aparecer algo como:
fetch('https://[seu-projeto].supabase.co/rest/v1/postpack_workflow?select=*%2Cpostpacks%28*%29&order=created_at.desc', ...)
```

#### No Supabase Dashboard
```
1. Vá para Table Editor
2. Abra a tabela "postpack_workflow"
3. Verifique se os dados aparecem no dashboard
```

### 9. Resultados Esperados

#### ✅ Sucesso Total
- Todos os itens do checklist marcados
- Nenhum erro no console
- Navegação fluida
- Design consistente
- Performance rápida

#### ⚠️ Sucesso Parcial
- Maioria dos itens funcionando
- Alguns warnings no console (não críticos)
- Pequenos ajustes de design necessários

#### ❌ Falha
- Erros críticos no console
- Dashboard não carrega
- Dados não aparecem
- Navegação quebrada

---

## Troubleshooting Comum

### Problema: Dashboard vazio
**Solução:**
1. Verificar se há workflows no banco
2. Verificar variáveis de ambiente (.env.local)
3. Verificar permissões RLS no Supabase

### Problema: Erro ao carregar
**Solução:**
1. Verificar console do navegador
2. Verificar se Supabase está acessível
3. Verificar se credenciais estão corretas

### Problema: Filtros não funcionam
**Solução:**
1. Limpar cache do navegador
2. Verificar se dados têm os campos esperados
3. Verificar console para erros JavaScript

### Problema: Cards não aparecem
**Solução:**
1. Verificar query Supabase no Network tab
2. Verificar formato dos dados retornados
3. Verificar mapeamento de tipos TypeScript

---

## Teste de Aceitação Final

### Critérios Mínimos
- [ ] Dashboard abre sem erros
- [ ] Mostra pelo menos 1 workflow
- [ ] Filtros funcionam
- [ ] Navegação funciona
- [ ] Design está correto

### Critérios Ideais
- [ ] Todas as funcionalidades implementadas
- [ ] Performance excelente (< 1s)
- [ ] Responsivo em todos os devices
- [ ] Sem erros ou warnings
- [ ] Código limpo e tipado

---

## Próximos Passos Após Teste

### Se Teste Passou
1. ✅ Marcar dashboard como Production Ready
2. ✅ Documentar em changelog
3. ✅ Notificar time
4. ✅ Deploy para produção

### Se Teste Falhou
1. 🔧 Corrigir bugs encontrados
2. 🔧 Re-testar funcionalidades
3. 🔧 Atualizar documentação
4. 🔧 Re-executar testes

---

**Data do Teste:** _____________
**Testador:** _____________
**Resultado:** [ ] ✅ Passou  [ ] ⚠️ Parcial  [ ] ❌ Falhou
**Observações:** _____________________________________________
