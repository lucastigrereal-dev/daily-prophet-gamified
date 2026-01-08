'use client';
import { useState, useEffect, useCallback } from 'react';
import { PostpackWorkflow, WorkflowFilters } from '@/types/workflow';
import { workflowService } from '@/lib/workflow-service';

export function useWorkflowList(filters?: WorkflowFilters) {
  const [workflows, setWorkflows] = useState<PostpackWorkflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { setWorkflows(await workflowService.list(filters)); }
    catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }, [filters]);

  useEffect(() => { load(); }, [load]);

  return { workflows, loading, error, refresh: load };
}
