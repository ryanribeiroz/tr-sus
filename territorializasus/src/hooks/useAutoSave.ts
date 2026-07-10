// src/hooks/useAutoSave.ts
import { useRef, useCallback, useEffect } from 'react';
import { AUTO_SAVE_DEBOUNCE_MS } from '@/constants';

/**
 * Hook para salvamento automático de rascunhos.
 * Implementa debounce de 800ms conforme AGENTS.md §9.
 */
export function useAutoSave(saveFn: () => Promise<void>) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const triggerAutoSave = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      if (isMountedRef.current) {
        try {
          await saveFn();
        } catch (err) {
          console.warn('[AutoSave] Erro ao salvar rascunho:', err);
        }
      }
    }, AUTO_SAVE_DEBOUNCE_MS);
  }, [saveFn]);

  const forceFlush = useCallback(async () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    try {
      await saveFn();
    } catch (err) {
      console.warn('[AutoSave] Erro ao salvar ao sair:', err);
    }
  }, [saveFn]);

  return { triggerAutoSave, forceFlush };
}
