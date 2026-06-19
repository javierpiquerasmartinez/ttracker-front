import { createContext, useContext, useState, useCallback, useRef, useEffect, type ReactNode } from 'react';
import { startTimer, stopTimer, getActiveTimer } from '../services/timeRecords.service';
import type { TimeRecord } from '../types';

interface TimerState {
  activeRecord: TimeRecord | null;
  elapsed: number;
  isRunning: boolean;
}

interface TimerContextType {
  timer: TimerState;
  start: (projectId: string, description?: string) => Promise<void>;
  stop: () => Promise<TimeRecord | null>;
  checkActive: () => Promise<void>;
}

const TimerContext = createContext<TimerContextType | null>(null);

export function TimerProvider({ children }: { children: ReactNode }) {
  const [timer, setTimer] = useState<TimerState>({
    activeRecord: null,
    elapsed: 0,
    isRunning: false,
  });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimerInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startInterval = useCallback((record: TimeRecord) => {
    clearTimerInterval();
    const startDate = new Date(`${record.date}T${record.start_time}Z`);
    intervalRef.current = setInterval(() => {
      const now = new Date();
      const elapsed = Math.floor((now.getTime() - startDate.getTime()) / 1000);
      setTimer((prev) => ({ ...prev, elapsed }));
    }, 1000);
  }, [clearTimerInterval]);

  const checkActive = useCallback(async () => {
    try {
      const active = await getActiveTimer();
      if (active) {
        setTimer({ activeRecord: active, isRunning: true, elapsed: 0 });
        startInterval(active);
      }
    } catch {
      // ignore
    }
  }, [startInterval]);

  const start = useCallback(async (projectId: string, description?: string) => {
    const record = await startTimer({ project_id: projectId, description });
    setTimer({ activeRecord: record, isRunning: true, elapsed: 0 });
    startInterval(record);
  }, [startInterval]);

  const stop = useCallback(async (): Promise<TimeRecord | null> => {
    if (!timer.activeRecord) return null;
    try {
      const record = await stopTimer(timer.activeRecord.id);
      clearTimerInterval();
      setTimer({ activeRecord: null, isRunning: false, elapsed: 0 });
      return record;
    } catch {
      return null;
    }
  }, [timer.activeRecord, clearTimerInterval]);

  useEffect(() => {
    checkActive();
    return () => clearTimerInterval();
  }, [checkActive, clearTimerInterval]);

  return (
    <TimerContext.Provider value={{ timer, start, stop, checkActive }}>
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() {
  const ctx = useContext(TimerContext);
  if (!ctx) throw new Error('useTimer must be inside TimerProvider');
  return ctx;
}
