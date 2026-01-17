# 🧪 COMPOSIÇÃO FLOW - COMPREHENSIVE TEST PLAN
**Date**: 2026-01-16
**Status**: Ready for Testing
**Version**: 1.0

---

## 📋 TEST SCENARIOS

### TEST 1: Homepage Loading & Navigation
**Objective**: Verify home page loads and navigation buttons work

**Steps**:
1. Open https://daily-prophet-gamified.vercel.app
2. Verify page loads completely
3. Wait for loading spinner to disappear
4. Check if "Criar Novo PostPack" button is visible
5. Click on "Workflows" button to verify navigation

**Expected Results**:
- ✅ Page loads without errors
- ✅ "Carregando Daily Prophet" message disappears
- ✅ Buttons are clickable
- ✅ Navigation to /workflow page works

**Error Handling**:
- If 404: Vercel deployment not complete
- If blank page: Build failed
- If buttons disabled: Loading state stuck

---

### TEST 2: Workflow Creation (Novo PostPack)
**Objective**: Create a new workflow and verify it initializes correctly

**Steps**:
1. From home, click "Criar Novo PostPack" (or navigate to /workflow/novo)
2. Fill form:
   - **Titulo**: "Test Reels Botox"
   - **Descricao**: "Testing reels composition flow"
   - **Criador**: "Tigrao" (default)
3. Click "Criar PostPack" button
4. Verify redirect to workflow overview

**Expected Results**:
- ✅ Form submits without errors
- ✅ Loading spinner appears
- ✅ Redirects to `/workflow/[id]` page
- ✅ Workflow ID displayed in URL
- ✅ Postpack details visible (title, description, format)

**API Calls Made** (in browser network tab):
- `POST /api/postpacks` - Creates postpack
- `POST /api/workflow` - Creates workflow with status='composicao'

**Success Indicators**:
```javascript
// In browser console, verify response structure:
{
  id: "some-uuid",
  postpack_id: "postpack-uuid",
  status: "composicao", // MUST BE composicao
  composicao: {},
  fase_1: { status: "pendente", checklist: {} },
  ...
}
```

---

### TEST 3: Composition Route Bifurcation
**Objective**: Verify composition page shows correct UI based on format

**Prerequisites**: Must have created workflows with different formats

**Test Case 3A: Reels Format**
1. Create workflow with format = "Reels"
2. Verify redirected to `/workflow/[id]/composicao`
3. Should see:
   - ✅ Header: "✏️ Composição do Conteúdo"
   - ✅ Postpack info with "Reels" badge
   - ✅ **ComposicaoReels component**: "Quer que eu monte o script completo do Reels?"
   - ✅ Two buttons: "✅ SIM, MONTE O SCRIPT" | "❌ NÃO, JÁ TENHO PRONTO"
   - ✅ "← Voltar" button
   - ✅ "Avançar para Fase 1 →" button

**Test Case 3B: Carrossel Format**
1. Create workflow with format = "Carrossel"
2. Verify ComposicaoCarrossel component shows:
   - ✅ Label: "Qual a ideia/tema do carrossel?"
   - ✅ Textarea for theme input
   - ✅ Button: "✨ GERAR OPÇÕES DE TEXTO"
   - ✅ (Currently disabled until theme entered)

**Test Case 3C: Stories Format**
1. Create workflow with format = "Stories"
2. Verify ComposicaoStories component shows:
   - ✅ Label: "Qual estratégia de Stories?"
   - ✅ Dropdown with 6 options:
     - 📝 Caixinha de perguntas
     - 📊 Enquete
     - 🧠 Quiz
     - ⏱️ Contagem regressiva
     - 🔄 Antes e depois
     - 🎬 Bastidores
   - ✅ Selected strategy displays in info box

**Expected Results for All Cases**:
- ✅ Correct component renders based on format
- ✅ NO other format's UI is visible
- ✅ Navigation buttons work (Voltar, Avançar)
- ✅ Data persists when moving between pages

---

### TEST 4: Reels Composition Flow
**Objective**: Test Reels-specific composition logic

**Steps**:
1. In ComposicaoReels, click "✅ SIM, MONTE O SCRIPT"
2. Button should change color to green
3. Info box shows: "✅ Você escolheu montar o script do banco de dados"
4. Click "Avançar para Fase 1 →"
5. Should redirect to `/workflow/[id]/fase-1`

**Network Calls Expected**:
```
PATCH /api/workflow/[id]
{
  "composicao": {
    "reels": {
      "montarScript": true
    }
  },
  "status": "fase_1"
}
```

**Expected Response**:
- ✅ Workflow updated in database
- ✅ Redirect to fase-1 page
- ✅ No errors in console

---

### TEST 5: Carrossel "GERAR OPÇÕES" Button
**Objective**: Test dynamic text generation

**Prerequisites**: ComposicaoCarrossel page open

**Steps**:
1. Enter tema: "5 mitos sobre botox"
2. Button "✨ GERAR OPÇÕES DE TEXTO" becomes enabled
3. Click button
4. Observe loading state: "Processando..."
5. Wait for response

**Expected Behavior**:
- ✅ Loading spinner/state appears
- ✅ API call to `POST /api/generate/carrossel-opcoes`
  ```javascript
  {
    "tema": "5 mitos sobre botox",
    "tipo": "educativo",  // if selected
    "procedimento": "botox",  // if selected
    "quantidade": 3
  }
  ```

**Expected Response**:
```javascript
{
  "tema": "5 mitos sobre botox",
  "quantidade_gerada": 3,
  "opcoes": [
    {
      "id": "post_001",
      "titulo": "Opção 1",
      "tipo": "exemplo",
      "conteudo": "..."
    },
    ...
  ],
  "mensagem": "3 opções geradas para o tema 'mitos sobre botox'"
}
```

**Success Indicators**:
- ✅ Options display (or UI for selection)
- ✅ Options are selectable
- ✅ Selected option is saved

**Error Scenarios**:
- ❌ 400 Bad Request: tema field was empty
- ❌ 500 Server Error: Database connection failed
- ❌ 0 options generated: No matching content in database

---

### TEST 6: Stories Strategy Selection
**Objective**: Verify story strategy dropdown works

**Steps**:
1. In ComposicaoStories, click strategy dropdown
2. Select "🧠 Quiz"
3. Dropdown updates to show selected value
4. Info box displays: "Estratégia selecionada: 🧠 Quiz"
5. Verify data persists

**Expected Results**:
- ✅ Dropdown opens
- ✅ All 6 options visible
- ✅ Selection updates state
- ✅ Info box shows selected strategy
- ✅ PATCH `/api/workflow/[id]` called on change
  ```javascript
  {
    "composicao": {
      "stories": {
        "estrategia": "quiz"
      }
    }
  }
  ```

---

### TEST 7: Composição to Fase-1 Transition
**Objective**: Verify successful advancement to phase 1

**Prerequisites**: Composition data complete

**Steps**:
1. Complete composition (select option in any format)
2. Click "Avançar para Fase 1 →"
3. Verify redirect to `/workflow/[id]/fase-1`
4. Check workflow status changed

**Expected Results**:
- ✅ Redirect works
- ✅ URL shows `/fase-1`
- ✅ Fase-1 checklist visible
- ✅ Status in database = "fase_1"

**API Calls**:
```
PATCH /api/workflow/[id]
{
  "status": "fase_1"
}
```

---

### TEST 8: Fase-1 Content Loading (FUTURE - When Implemented)
**Objective**: Test content fetching from database

**Note**: This test is for FUTURE implementation when Fase-1 components are wired to database

**Expected API Calls**:
```
GET /api/content/ganchos?limit=20
GET /api/content/legendas?limit=20
GET /api/content/ctas?limit=20
GET /api/content/hashtags?limit=20
```

**Expected Data**:
- ✅ Ganchos: ~948 available (from legendas table)
- ✅ Legendas: ~948 available
- ✅ CTAs: ~537 available
- ✅ Hashtags: ~170 available

---

## 🔍 TESTING CHECKLIST

### Frontend Tests
- [ ] Homepage loads without errors
- [ ] "Criar Novo PostPack" button works
- [ ] Workflow creation form submits
- [ ] Redirects to composition page
- [ ] Reels composition UI renders correctly
- [ ] Carrossel composition UI renders correctly
- [ ] Stories composition UI renders correctly
- [ ] Format-specific buttons/dropdowns work
- [ ] Data persists (check DB via Supabase)
- [ ] Navigation to Fase-1 works
- [ ] "Voltar" button returns to previous page

### API Tests
- [ ] `POST /api/postpacks` returns 201
- [ ] `POST /api/workflow` returns 201 with composicao status
- [ ] `GET /api/workflow/[id]` returns workflow object
- [ ] `PATCH /api/workflow/[id]` updates successfully
- [ ] `POST /api/generate/carrossel-opcoes` generates options
- [ ] `GET /api/content/*` endpoints return data (when implemented)

### Database Tests
- [ ] New postpack created in `postpacks` table
- [ ] New workflow created in `postpack_workflow` table
- [ ] Workflow status = "composicao" initially
- [ ] Composicao data saved correctly
- [ ] Status updates to "fase_1" on advancement

### Error Handling
- [ ] Form validation (empty fields)
- [ ] API error responses handled gracefully
- [ ] Network errors show user-friendly messages
- [ ] Invalid workflow ID shows 404 error
- [ ] Unauthorized access handled

### Browser Console
- [ ] No JavaScript errors
- [ ] No TypeScript type errors
- [ ] All fetch calls show 2xx/3xx status codes
- [ ] Network tab shows proper headers (Content-Type: application/json)

---

## 🧩 DEPENDENCY MATRIX

```
✅ Composition Routes DEPEND ON:
  ├─ API: POST /api/workflow
  ├─ API: PATCH /api/workflow/[id]
  ├─ API: POST /api/postpacks
  ├─ Supabase: postpacks table
  ├─ Supabase: postpack_workflow table
  └─ Frontend: useWorkflow hook

✅ "GERAR OPÇÕES" DEPENDS ON:
  ├─ API: POST /api/generate/carrossel-opcoes
  ├─ Supabase: posts_exemplo table
  ├─ Supabase: legendas table
  └─ 50+ example posts in database

✅ Fase-1 Content Selection DEPENDS ON:
  ├─ API: GET /api/content/ganchos
  ├─ API: GET /api/content/legendas
  ├─ API: GET /api/content/ctas
  ├─ API: GET /api/content/hashtags
  ├─ Supabase: 948 legendas
  ├─ Supabase: 537 ctas
  └─ Supabase: 170 hashtags
```

---

## 📊 SUCCESS METRICS

| Metric | Target | Pass |
|--------|--------|------|
| Homepage load time | < 2s | - |
| Workflow creation | < 1s | - |
| Composition page render | < 1s | - |
| API response time | < 500ms | - |
| No console errors | 0 | - |
| All buttons functional | 100% | - |
| Format detection accuracy | 100% | - |
| Data persistence | 100% | - |

---

## 🔗 REFERENCE ENDPOINTS

### Production URLs
```
Homepage:     https://daily-prophet-gamified.vercel.app
Create Flow:  https://daily-prophet-gamified.vercel.app/workflow/novo
Workflows:    https://daily-prophet-gamified.vercel.app/workflow
Composition:  https://daily-prophet-gamified.vercel.app/workflow/[id]/composicao
```

### API Endpoints (Check in Network Tab)
```
POST   https://daily-prophet-gamified.vercel.app/api/postpacks
POST   https://daily-prophet-gamified.vercel.app/api/workflow
GET    https://daily-prophet-gamified.vercel.app/api/workflow/[id]
PATCH  https://daily-prophet-gamified.vercel.app/api/workflow/[id]
POST   https://daily-prophet-gamified.vercel.app/api/generate/carrossel-opcoes
GET    https://daily-prophet-gamified.vercel.app/api/content/ganchos
GET    https://daily-prophet-gamified.vercel.app/api/content/legendas
GET    https://daily-prophet-gamified.vercel.app/api/content/ctas
GET    https://daily-prophet-gamified.vercel.app/api/content/hashtags
```

---

## 📝 TEST RESULT LOGGING

### Test 1: Homepage Loading
- Start time: ___
- End time: ___
- Status: ✅ / ❌
- Notes: ___

### Test 2: Workflow Creation
- Start time: ___
- End time: ___
- Status: ✅ / ❌
- Workflow ID: ___
- Notes: ___

### Test 3: Composition Bifurcation
- Start time: ___
- End time: ___
- Status: ✅ / ❌
- Format tested: ___
- Notes: ___

### Test 4-8: (Continue pattern)
...

---

## 🚨 KNOWN ISSUES & WORKAROUNDS

### Issue: Build fails locally with Turbopack
**Workaround**: Use webpack instead
```bash
NEXT_EXPERIMENTAL_TURBOPACK=false npm run build
```

### Issue: Vercel deployment delayed
**Workaround**: Manual redeploy from Vercel dashboard
```
https://vercel.com/dashboard/project/daily-prophet-gamified
```

### Issue: API returns 404
**Possible Causes**:
- Vercel deployment not yet complete (wait 2-5 min)
- Routes not built in latest deployment
- Supabase connection issue

**Check**:
- GitHub shows commit pushed ✅
- Vercel dashboard shows "READY" status
- No errors in Vercel build logs

---

## 📞 SUPPORT CONTACTS

- **Vercel Status**: https://vercel.com/dashboard
- **Supabase Status**: https://app.supabase.com
- **GitHub Commits**: https://github.com/lucastigrereal-dev/daily-prophet-gamified/commits

---

**Report Date**: 2026-01-16
**Test Status**: Ready to Execute
**Estimated Test Duration**: 30-45 minutes (full flow)

