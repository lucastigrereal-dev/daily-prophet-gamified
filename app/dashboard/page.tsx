'use client';

import { useEffect, useState, useMemo, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { WorkflowCard } from '@/components/dashboard/WorkflowCard';
import { WorkflowStats } from '@/components/dashboard/WorkflowStats';
import { supabase } from '@/lib/supabase/client';
import type { PostpackWorkflowRow, Postpack } from '@/types/workflow';

interface WorkflowWithPostpack extends PostpackWorkflowRow {
  postpacks?: Postpack;
}

type DateFilter = 'todos' | 'hoje' | 'semana' | 'mes' | 'customizado';

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [workflows, setWorkflows] = useState<WorkflowWithPostpack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtros de busca
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [searchInput, setSearchInput] = useState(searchParams.get('q') || '');

  // Filtros multi-select (formatos)
  const formatosParam = searchParams.get('formatos')?.split(',').filter(Boolean) || [];
  const [selectedFormatos, setSelectedFormatos] = useState<string[]>(formatosParam);

  // Filtros multi-select (status)
  const statusParam = searchParams.get('status')?.split(',').filter(Boolean) || [];
  const [selectedStatus, setSelectedStatus] = useState<string[]>(statusParam);

  // Filtros multi-select (procedimentos)
  const procedimentosParam = searchParams.get('procedimentos')?.split(',').filter(Boolean) || [];
  const [selectedProcedimentos, setSelectedProcedimentos] = useState<string[]>(procedimentosParam);

  // Filtros de data
  const [dateFilter, setDateFilter] = useState<DateFilter>((searchParams.get('dateFilter') as DateFilter) || 'todos');
  const [customDateStart, setCustomDateStart] = useState(searchParams.get('dateStart') || '');
  const [customDateEnd, setCustomDateEnd] = useState(searchParams.get('dateEnd') || '');

  // Filtros de performance
  const [minEngajamento, setMinEngajamento] = useState(Number(searchParams.get('minEng') || 0));
  const [minViews, setMinViews] = useState(Number(searchParams.get('minViews') || 0));
  const [onlySuccess, setOnlySuccess] = useState(searchParams.get('success') === 'true');

  // Debounce para busca
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Sincronizar com URL params
  const updateURLParams = useCallback(() => {
    const params = new URLSearchParams();

    if (searchQuery) params.set('q', searchQuery);
    if (selectedFormatos.length > 0) params.set('formatos', selectedFormatos.join(','));
    if (selectedStatus.length > 0) params.set('status', selectedStatus.join(','));
    if (selectedProcedimentos.length > 0) params.set('procedimentos', selectedProcedimentos.join(','));
    if (dateFilter !== 'todos') params.set('dateFilter', dateFilter);
    if (customDateStart) params.set('dateStart', customDateStart);
    if (customDateEnd) params.set('dateEnd', customDateEnd);
    if (minEngajamento > 0) params.set('minEng', minEngajamento.toString());
    if (minViews > 0) params.set('minViews', minViews.toString());
    if (onlySuccess) params.set('success', 'true');

    const queryString = params.toString();
    const newUrl = queryString ? `/dashboard?${queryString}` : '/dashboard';
    router.replace(newUrl, { scroll: false });
  }, [
    searchQuery,
    selectedFormatos,
    selectedStatus,
    selectedProcedimentos,
    dateFilter,
    customDateStart,
    customDateEnd,
    minEngajamento,
    minViews,
    onlySuccess,
    router
  ]);

  useEffect(() => {
    updateURLParams();
  }, [updateURLParams]);

  useEffect(() => {
    loadWorkflows();
  }, []);

  async function loadWorkflows() {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('postpack_workflow')
        .select('*, postpacks(*)')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setWorkflows(data || []);
    } catch (err) {
      console.error('Erro ao carregar workflows:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar workflows');
    } finally {
      setLoading(false);
    }
  }

  // Função auxiliar para filtro de data
  const isInDateRange = (createdAt: string): boolean => {
    const date = new Date(createdAt);
    const now = new Date();

    if (dateFilter === 'todos') return true;

    if (dateFilter === 'hoje') {
      return date.toDateString() === now.toDateString();
    }

    if (dateFilter === 'semana') {
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);
      return date >= weekAgo;
    }

    if (dateFilter === 'mes') {
      const monthAgo = new Date(now);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return date >= monthAgo;
    }

    if (dateFilter === 'customizado') {
      if (customDateStart && customDateEnd) {
        const start = new Date(customDateStart);
        const end = new Date(customDateEnd);
        end.setHours(23, 59, 59, 999);
        return date >= start && date <= end;
      }
      if (customDateStart) {
        const start = new Date(customDateStart);
        return date >= start;
      }
      if (customDateEnd) {
        const end = new Date(customDateEnd);
        end.setHours(23, 59, 59, 999);
        return date <= end;
      }
    }

    return true;
  };

  // Aplicar filtros
  const filteredWorkflows = useMemo(() => {
    return workflows.filter((wf) => {
      // Filtro de busca textual
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const title = wf.postpacks?.title?.toLowerCase() || '';
        const objective = wf.postpacks?.objective?.toLowerCase() || '';
        const procedureText = wf.postpacks?.procedure?.toLowerCase() || '';
        const notes = wf.notas?.toLowerCase() || '';

        if (
          !title.includes(query) &&
          !objective.includes(query) &&
          !procedureText.includes(query) &&
          !notes.includes(query)
        ) {
          return false;
        }
      }

      // Filtro multi-select de formatos
      if (selectedFormatos.length > 0) {
        const format = wf.postpacks?.format?.toLowerCase();
        if (!format || !selectedFormatos.includes(format)) return false;
      }

      // Filtro multi-select de status
      if (selectedStatus.length > 0) {
        if (!wf.status || !selectedStatus.includes(wf.status)) return false;
      }

      // Filtro multi-select de procedimentos
      if (selectedProcedimentos.length > 0) {
        const procedure = wf.postpacks?.procedure?.toLowerCase();
        if (!procedure || !selectedProcedimentos.includes(procedure)) return false;
      }

      // Filtro de data
      if (wf.created_at && !isInDateRange(wf.created_at)) {
        return false;
      }

      // Filtros de performance
      const engajamento = wf.postpacks?.engajamento_rate || 0;
      const views = wf.postpacks?.views || 0;

      if (engajamento < minEngajamento) return false;
      if (views < minViews) return false;

      // Filtro de cases de sucesso
      if (onlySuccess) {
        const isSuccess = engajamento >= 5 && views >= 1000;
        if (!isSuccess) return false;
      }

      return true;
    });
  }, [
    workflows,
    searchQuery,
    selectedFormatos,
    selectedStatus,
    selectedProcedimentos,
    dateFilter,
    customDateStart,
    customDateEnd,
    minEngajamento,
    minViews,
    onlySuccess
  ]);

  // Funções para toggle de checkboxes
  const toggleFormato = (formato: string) => {
    setSelectedFormatos(prev =>
      prev.includes(formato) ? prev.filter(f => f !== formato) : [...prev, formato]
    );
  };

  const toggleStatus = (status: string) => {
    setSelectedStatus(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  const toggleProcedimento = (procedimento: string) => {
    setSelectedProcedimentos(prev =>
      prev.includes(procedimento) ? prev.filter(p => p !== procedimento) : [...prev, procedimento]
    );
  };

  // Limpar todos os filtros
  const clearAllFilters = () => {
    setSearchInput('');
    setSearchQuery('');
    setSelectedFormatos([]);
    setSelectedStatus([]);
    setSelectedProcedimentos([]);
    setDateFilter('todos');
    setCustomDateStart('');
    setCustomDateEnd('');
    setMinEngajamento(0);
    setMinViews(0);
    setOnlySuccess(false);
  };

  // Verificar se há filtros ativos
  const hasActiveFilters =
    searchQuery ||
    selectedFormatos.length > 0 ||
    selectedStatus.length > 0 ||
    selectedProcedimentos.length > 0 ||
    dateFilter !== 'todos' ||
    customDateStart ||
    customDateEnd ||
    minEngajamento > 0 ||
    minViews > 0 ||
    onlySuccess;

  // Renderização de loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white text-xl">Carregando workflows...</div>
        </div>
      </div>
    );
  }

  // Renderização de erro
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-red-900/30 p-8 rounded-xl border border-red-500/50 max-w-md">
          <div className="text-6xl mb-4 text-center">⚠️</div>
          <div className="text-white text-xl mb-2 text-center">Erro ao carregar</div>
          <div className="text-red-300 text-sm mb-4 text-center">{error}</div>
          <button
            onClick={loadWorkflows}
            className="w-full bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
                <span className="text-4xl">📊</span>
                Dashboard de Workflows
              </h1>
              <p className="text-gray-400 mt-2">Visão geral de todos os workflows do sistema</p>
            </div>
            <button
              onClick={() => router.push('/workflow/novo')}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              <span className="text-xl">+</span>
              Novo Workflow
            </button>
          </div>

          {/* Estatísticas */}
          <WorkflowStats workflows={workflows} />
        </div>

        {/* Filtros Avançados */}
        <div className="bg-gray-800 rounded-xl p-4 md:p-6 mb-6 sticky top-4 z-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold flex items-center gap-2">
              <span>🔍</span>
              Filtros Avançados
            </h2>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
              >
                Limpar Todos os Filtros
              </button>
            )}
          </div>

          <div className="space-y-4">
            {/* 1. BUSCA TEXTUAL */}
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Busca Textual</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar por título, objetivo, procedimento, notas..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2.5 pr-10 border border-gray-700 focus:border-purple-500 focus:outline-none transition-colors"
                />
                {searchInput && (
                  <button
                    onClick={() => {
                      setSearchInput('');
                      setSearchQuery('');
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* 2. FILTROS DE DATA */}
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Filtro por Data</label>
              <div className="flex flex-wrap gap-2 mb-3">
                <button
                  onClick={() => setDateFilter('todos')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    dateFilter === 'todos'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setDateFilter('hoje')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    dateFilter === 'hoje'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Hoje
                </button>
                <button
                  onClick={() => setDateFilter('semana')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    dateFilter === 'semana'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Esta Semana
                </button>
                <button
                  onClick={() => setDateFilter('mes')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    dateFilter === 'mes'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Este Mês
                </button>
                <button
                  onClick={() => setDateFilter('customizado')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    dateFilter === 'customizado'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Customizado
                </button>
              </div>

              {dateFilter === 'customizado' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-gray-500 text-xs mb-1 block">Data Inicial</label>
                    <input
                      type="date"
                      value={customDateStart}
                      onChange={(e) => setCustomDateStart(e.target.value)}
                      className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-purple-500 focus:outline-none transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-gray-500 text-xs mb-1 block">Data Final</label>
                    <input
                      type="date"
                      value={customDateEnd}
                      onChange={(e) => setCustomDateEnd(e.target.value)}
                      className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-purple-500 focus:outline-none transition-colors text-sm"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 3. FILTROS DE PERFORMANCE */}
            <div className="border-t border-gray-700 pt-4">
              <label className="text-gray-400 text-sm mb-3 block">Filtros de Performance</label>

              <div className="space-y-4">
                {/* Engajamento */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Engajamento Mínimo</span>
                    <span className="text-purple-400 font-semibold">{minEngajamento}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={minEngajamento}
                    onChange={(e) => setMinEngajamento(Number(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                </div>

                {/* Views */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Views Mínimas</span>
                    <span className="text-purple-400 font-semibold">{minViews.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="100"
                    value={minViews}
                    onChange={(e) => setMinViews(Number(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                </div>

                {/* Cases de Sucesso */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlySuccess}
                    onChange={(e) => setOnlySuccess(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-purple-600 focus:ring-2 focus:ring-purple-500 cursor-pointer"
                  />
                  <span className="text-white text-sm">Apenas Cases de Sucesso (≥5% eng. e ≥1000 views)</span>
                </label>
              </div>
            </div>

            {/* 4. FILTROS MULTI-SELECT - FORMATOS */}
            <div className="border-t border-gray-700 pt-4">
              <label className="text-gray-400 text-sm mb-3 block">Formatos</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                <label className="flex items-center gap-2 cursor-pointer bg-gray-700 hover:bg-gray-600 p-3 rounded-lg transition-colors">
                  <input
                    type="checkbox"
                    checked={selectedFormatos.includes('reel')}
                    onChange={() => toggleFormato('reel')}
                    className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-purple-600 focus:ring-2 focus:ring-purple-500 cursor-pointer"
                  />
                  <span className="text-white text-sm">🎬 Reel</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer bg-gray-700 hover:bg-gray-600 p-3 rounded-lg transition-colors">
                  <input
                    type="checkbox"
                    checked={selectedFormatos.includes('carrossel')}
                    onChange={() => toggleFormato('carrossel')}
                    className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-purple-600 focus:ring-2 focus:ring-purple-500 cursor-pointer"
                  />
                  <span className="text-white text-sm">📸 Carrossel</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer bg-gray-700 hover:bg-gray-600 p-3 rounded-lg transition-colors">
                  <input
                    type="checkbox"
                    checked={selectedFormatos.includes('stories')}
                    onChange={() => toggleFormato('stories')}
                    className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-purple-600 focus:ring-2 focus:ring-purple-500 cursor-pointer"
                  />
                  <span className="text-white text-sm">📱 Stories</span>
                </label>
              </div>
            </div>

            {/* 5. FILTROS MULTI-SELECT - STATUS */}
            <div className="border-t border-gray-700 pt-4">
              <label className="text-gray-400 text-sm mb-3 block">Status</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <label className="flex items-center gap-2 cursor-pointer bg-gray-700 hover:bg-gray-600 p-2 rounded-lg transition-colors">
                  <input
                    type="checkbox"
                    checked={selectedStatus.includes('composicao')}
                    onChange={() => toggleStatus('composicao')}
                    className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-purple-600 focus:ring-2 focus:ring-purple-500 cursor-pointer"
                  />
                  <span className="text-white text-xs">📝 Composição</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer bg-gray-700 hover:bg-gray-600 p-2 rounded-lg transition-colors">
                  <input
                    type="checkbox"
                    checked={selectedStatus.includes('fase_1')}
                    onChange={() => toggleStatus('fase_1')}
                    className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-purple-600 focus:ring-2 focus:ring-purple-500 cursor-pointer"
                  />
                  <span className="text-white text-xs">1️⃣ Fase 1</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer bg-gray-700 hover:bg-gray-600 p-2 rounded-lg transition-colors">
                  <input
                    type="checkbox"
                    checked={selectedStatus.includes('fase_2')}
                    onChange={() => toggleStatus('fase_2')}
                    className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-purple-600 focus:ring-2 focus:ring-purple-500 cursor-pointer"
                  />
                  <span className="text-white text-xs">2️⃣ Fase 2</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer bg-gray-700 hover:bg-gray-600 p-2 rounded-lg transition-colors">
                  <input
                    type="checkbox"
                    checked={selectedStatus.includes('fase_3')}
                    onChange={() => toggleStatus('fase_3')}
                    className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-purple-600 focus:ring-2 focus:ring-purple-500 cursor-pointer"
                  />
                  <span className="text-white text-xs">3️⃣ Fase 3</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer bg-gray-700 hover:bg-gray-600 p-2 rounded-lg transition-colors">
                  <input
                    type="checkbox"
                    checked={selectedStatus.includes('fase_4')}
                    onChange={() => toggleStatus('fase_4')}
                    className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-purple-600 focus:ring-2 focus:ring-purple-500 cursor-pointer"
                  />
                  <span className="text-white text-xs">4️⃣ Fase 4</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer bg-gray-700 hover:bg-gray-600 p-2 rounded-lg transition-colors">
                  <input
                    type="checkbox"
                    checked={selectedStatus.includes('fase_5')}
                    onChange={() => toggleStatus('fase_5')}
                    className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-purple-600 focus:ring-2 focus:ring-purple-500 cursor-pointer"
                  />
                  <span className="text-white text-xs">5️⃣ Fase 5</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer bg-gray-700 hover:bg-gray-600 p-2 rounded-lg transition-colors">
                  <input
                    type="checkbox"
                    checked={selectedStatus.includes('concluido')}
                    onChange={() => toggleStatus('concluido')}
                    className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-purple-600 focus:ring-2 focus:ring-purple-500 cursor-pointer"
                  />
                  <span className="text-white text-xs">✅ Concluído</span>
                </label>
              </div>
            </div>

            {/* 6. FILTROS MULTI-SELECT - PROCEDIMENTOS */}
            <div className="border-t border-gray-700 pt-4">
              <label className="text-gray-400 text-sm mb-3 block">Procedimentos</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <label className="flex items-center gap-2 cursor-pointer bg-gray-700 hover:bg-gray-600 p-3 rounded-lg transition-colors">
                  <input
                    type="checkbox"
                    checked={selectedProcedimentos.includes('procedimento_estetico')}
                    onChange={() => toggleProcedimento('procedimento_estetico')}
                    className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-purple-600 focus:ring-2 focus:ring-purple-500 cursor-pointer"
                  />
                  <span className="text-white text-sm">💉 Procedimento Estético</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer bg-gray-700 hover:bg-gray-600 p-3 rounded-lg transition-colors">
                  <input
                    type="checkbox"
                    checked={selectedProcedimentos.includes('resultado_paciente')}
                    onChange={() => toggleProcedimento('resultado_paciente')}
                    className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-purple-600 focus:ring-2 focus:ring-purple-500 cursor-pointer"
                  />
                  <span className="text-white text-sm">✨ Resultado Paciente</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer bg-gray-700 hover:bg-gray-600 p-3 rounded-lg transition-colors">
                  <input
                    type="checkbox"
                    checked={selectedProcedimentos.includes('educacao_publica')}
                    onChange={() => toggleProcedimento('educacao_publica')}
                    className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-purple-600 focus:ring-2 focus:ring-purple-500 cursor-pointer"
                  />
                  <span className="text-white text-sm">📚 Educação Pública</span>
                </label>
              </div>
            </div>
          </div>

          {/* CONTADOR DE RESULTADOS */}
          <div className="mt-6 pt-4 border-t border-gray-700">
            <div className="flex items-center justify-between">
              <div className="text-gray-400 text-sm">
                <span className="text-purple-400 font-semibold text-lg">{filteredWorkflows.length}</span>
                {' '}workflows encontrados de{' '}
                <span className="text-white font-semibold">{workflows.length}</span> no total
              </div>
              {hasActiveFilters && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="bg-purple-600 text-white px-2 py-1 rounded">
                    {[
                      searchQuery && 'busca',
                      selectedFormatos.length > 0 && `${selectedFormatos.length} formato(s)`,
                      selectedStatus.length > 0 && `${selectedStatus.length} status`,
                      selectedProcedimentos.length > 0 && `${selectedProcedimentos.length} procedimento(s)`,
                      dateFilter !== 'todos' && 'data',
                      minEngajamento > 0 && 'engajamento',
                      minViews > 0 && 'views',
                      onlySuccess && 'sucesso'
                    ].filter(Boolean).length} filtro(s) ativo(s)
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Lista de Workflows */}
        {filteredWorkflows.length === 0 ? (
          <div className="bg-gray-800 rounded-xl p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <div className="text-white text-xl mb-2">Nenhum workflow encontrado</div>
            <div className="text-gray-400 mb-6">
              {workflows.length === 0
                ? 'Crie seu primeiro workflow para começar'
                : 'Tente ajustar os filtros para ver mais resultados'
              }
            </div>
            {workflows.length === 0 && (
              <button
                onClick={() => router.push('/workflow/novo')}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Criar Primeiro Workflow
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredWorkflows.map((workflow) => (
              <WorkflowCard
                key={workflow.id}
                workflow={workflow}
                onUpdate={loadWorkflows}
              />
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/')}
            className="text-purple-400 hover:text-purple-300 transition-colors"
          >
            ← Voltar para Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white text-xl">Carregando dashboard...</div>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
