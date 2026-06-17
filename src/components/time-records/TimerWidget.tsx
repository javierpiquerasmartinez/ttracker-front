import { useTimer } from '../../context/TimerContext';
import { useState } from 'react';
import { Modal } from '../common/Modal';
import { PlayModal } from './PlayModal';
import { useToast } from '../../context/ToastContext';
import { formatMinutes } from '../../utils/date';

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
    const elapsed = formatMinutes(Math.floor(timer.elapsed / 60));
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm text-green-700 font-mono font-bold">{elapsed}</span>
        </div>
        <span className="text-sm text-green-600">
          {timer.activeRecord.project?.name || 'Proyecto'}
        </span>
        <button
          onClick={handleStop}
          className="ml-auto px-3 py-1 bg-red-600 text-white text-sm rounded-md font-medium hover:bg-red-700"
        >
          Stop
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowPlay(true)}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
      >
        <span className="text-lg">▶</span> Play
      </button>
      <Modal open={showPlay} onClose={() => setShowPlay(false)} title="Iniciar Registro">
        <PlayModal onClose={() => setShowPlay(false)} />
      </Modal>
    </>
  );
}
