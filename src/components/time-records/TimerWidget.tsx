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
      <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg pl-3 pr-1.5 py-1.5">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
        </span>
        <span className="text-sm text-green-700 font-mono font-bold tabular-nums">{elapsed}</span>
        <span className="text-sm text-green-600 hidden sm:inline">
          {timer.activeRecord.project?.name || 'Proyecto'}
        </span>
        <Button variant="danger" size="sm" onClick={handleStop} className="ml-1">
          Stop
        </Button>
      </div>
    );
  }

  return (
    <>
      <Button variant="success" onClick={() => setShowPlay(true)}>
        <span className="text-xs">▶</span> Play
      </Button>
      <Modal open={showPlay} onClose={() => setShowPlay(false)} title="Iniciar Registro">
        <PlayModal onClose={() => setShowPlay(false)} />
      </Modal>
    </>
  );
}
