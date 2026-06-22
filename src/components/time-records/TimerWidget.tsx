import { useTimer } from '../../context/TimerContext';
import { useState } from 'react';
import { Modal } from '../common/Modal';
import { PlayModal } from './PlayModal';
import { Button } from '../common/ui/Button';
import { useToast } from '../../context/ToastContext';
import { formatMinutes, formatSeconds } from '../../utils/date';

export function TimerWidget() {
  const { timer, stop } = useTimer();
  const { addToast } = useToast();
  const [showPlay, setShowPlay] = useState(false);

  const handleStop = async () => {
    const record = await stop();
    if (record) {
      const hours = formatMinutes(record.duration_minutes);
      addToast(`Registro guardado: ${hours} en ${record.project?.name || 'Proyecto'}`, 'success');
    }
  };

  if (timer.isRunning && timer.activeRecord) {
    const elapsed = formatSeconds(timer.elapsed);
    return (
      <div className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-200/70 rounded-lg pl-3 pr-1.5 py-1.5 shadow-xs">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <span className="text-sm text-emerald-700 font-mono font-bold tabular-nums">{elapsed}</span>
        <span className="text-sm text-emerald-600/80 hidden sm:inline max-w-[160px] truncate">
          {timer.activeRecord.project?.name || 'Proyecto'}
        </span>
        <Button variant="danger" size="sm" onClick={handleStop} className="ml-0.5">
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3">
            <rect x="6" y="6" width="8" height="8" rx="1.5" />
          </svg>
          Stop
        </Button>
      </div>
    );
  }

  return (
    <>
      <Button variant="success" onClick={() => setShowPlay(true)}>
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
          <path d="M6.5 4.5a1 1 0 011.7-.7l8 5.5a1 1 0 010 1.7l-8 5.5a1 1 0 01-1.7-.7V4.5z" />
        </svg>
        Play
      </Button>
      <Modal open={showPlay} onClose={() => setShowPlay(false)} title="Iniciar Registro">
        <PlayModal onClose={() => setShowPlay(false)} />
      </Modal>
    </>
  );
}
