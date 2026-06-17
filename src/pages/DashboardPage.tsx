import { useState, useEffect, useCallback } from 'react';
import { getDashboard } from '../services/timeRecords.service';
import { SummaryCards } from '../components/dashboard/SummaryCards';
import { PeriodFilter } from '../components/dashboard/PeriodFilter';
import { ProjectTable } from '../components/dashboard/ProjectTable';
import { TimerWidget } from '../components/time-records/TimerWidget';
import { Modal } from '../components/common/Modal';
import { TimeRecordForm } from '../components/time-records/TimeRecordForm';
import { Loading } from '../components/common/Loading';
import { getPeriodDates, getTodayStr } from '../utils/date';
import type { DashboardSummary, Period } from '../types';

export function DashboardPage() {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<Period>('month');
  const [customFrom, setCustomFrom] = useState(getTodayStr());
  const [customTo, setCustomTo] = useState(getTodayStr());
  const [showManualForm, setShowManualForm] = useState(false);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const { from, to } = period === 'custom'
        ? { from: customFrom, to: customTo }
        : getPeriodDates(period);
      const summary = await getDashboard(from, to);
      setData(summary);
    } finally {
      setLoading(false);
    }
  }, [period, customFrom, customTo]);

  useEffect(() => { loadDashboard(); }, [loadDashboard]);

  const activeFrom = period === 'custom' ? customFrom : getPeriodDates(period).from;
  const activeTo = period === 'custom' ? customTo : getPeriodDates(period).to;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowManualForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 cursor-pointer"
          >
            + Registro Manual
          </button>
          <TimerWidget />
        </div>
      </div>

      <PeriodFilter
        period={period}
        onPeriodChange={setPeriod}
        customFrom={customFrom}
        customTo={customTo}
        onCustomFromChange={setCustomFrom}
        onCustomToChange={setCustomTo}
      />

      {loading ? (
        <Loading />
      ) : data ? (
        <>
          <SummaryCards
            totalHours={data.totalHours}
            avgHoursPerDay={data.avgHoursPerDay}
            daysWorked={data.daysWorked}
          />
          <ProjectTable projects={data.projects} fromDate={activeFrom} toDate={activeTo} />
        </>
      ) : null}

      <Modal open={showManualForm} onClose={() => setShowManualForm(false)} title="Registrar Horas Trabajadas">
        <TimeRecordForm onSaved={loadDashboard} onClose={() => setShowManualForm(false)} />
      </Modal>
    </div>
  );
}
