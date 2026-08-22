import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings2,
  History,
  Save,
  Lock,
  Power,
  ShieldCheck,
  CalendarRange,
  CheckCircle,
  XCircle
} from 'lucide-react';
import {
  KonteksKeuangan,
  KONTEKS_KEUANGAN_ORDER,
  NominalMap,
  DEFAULT_SYAHRIAH_NOMINALS
} from '../../types/sisantri';
import { getConfigNominals, sumNominal, validateDistribution } from '../../services/distributionService';

const KONTEKS_LABEL: Record<KonteksKeuangan, string> = {
  YAYASAN: 'Yayasan',
  MADIN: 'Madin',
  SEKOLAH: 'Sekolah',
  PESANTREN: 'Pesantren',
  MAKAN: 'Makan'
};

const KONTEKS_COLOR: Record<KonteksKeuangan, string> = {
  YAYASAN: 'text-emerald-600',
  MADIN: 'text-violet-600',
  SEKOLAH: 'text-sky-600',
  PESANTREN: 'text-[#1ABC9C]',
  MAKAN: 'text-amber-600'
};

const formatRp = (value: number) => `Rp ${value.toLocaleString('id-ID')}`;

const statusBadge: Record<string, string> = {
  Aktif: 'bg-emerald-100 text-emerald-800',
  Draft: 'bg-gray-100 text-gray-600',
  Arsip: 'bg-slate-100 text-slate-500'
};

export const KonfigurasiPemasukan: React.FC = () => {
  const { distribusiConfigList, saveDistribusiConfig, activateDistribusiConfig, currentUser } = useApp();

  const isAdmin = currentUser.role === 'admin_yayasan' || currentUser.role === 'admin_sistem';
  const activeConfig = distribusiConfigList.find(c => c.status === 'Aktif');

  const [name, setName] = useState(activeConfig?.name ?? '');
  const [effectiveFrom, setEffectiveFrom] = useState(activeConfig?.effectiveFrom ?? '2026-01-01');
  const [effectiveUntil, setEffectiveUntil] = useState(activeConfig?.effectiveUntil ?? '');
  const [nominals, setNominals] = useState<NominalMap>(getConfigNominals(activeConfig ?? { nominals: DEFAULT_SYAHRIAH_NOMINALS }));
  const [feedback, setFeedback] = useState<{ ok: boolean; message: string } | null>(null);

  const validation = useMemo(() => validateDistribution(nominals), [nominals]);
  const isDirty = activeConfig
    ? activeConfig.name !== name ||
      activeConfig.effectiveFrom !== effectiveFrom ||
      (activeConfig.effectiveUntil ?? '') !== effectiveUntil ||
      KONTEKS_KEUANGAN_ORDER.some(k => getConfigNominals(activeConfig)[k] !== nominals[k])
    : true;

  const setNominal = (konteks: KonteksKeuangan, value: number) => {
    setNominals(prev => ({ ...prev, [konteks]: value }));
  };

  const handleSave = () => {
    if (!isAdmin) return;
    if (!name.trim()) {
      setFeedback({ ok: false, message: 'Nama konfigurasi wajib diisi.' });
      return;
    }
    if (!validation.valid) {
      setFeedback({ ok: false, message: validation.errors.join(' ') });
      return;
    }
    const result = saveDistribusiConfig({
      id: activeConfig?.id,
      name: name.trim(),
      effectiveFrom: effectiveFrom || new Date().toISOString().slice(0, 10),
      effectiveUntil: effectiveUntil || undefined,
      nominals,
      status: 'Aktif'
    });
    setFeedback(
      result.ok
        ? { ok: true, message: 'Konfigurasi pembagian disimpan & diaktifkan.' }
        : { ok: false, message: result.error || 'Gagal menyimpan konfigurasi.' }
    );
  };

  const handleActivate = (id: string) => {
    if (!isAdmin) return;
    activateDistribusiConfig(id);
    setFeedback({ ok: true, message: 'Konfigurasi diaktifkan. Transaksi baru memakai aturan ini.' });
  };

  const sortedConfigs = useMemo(
    () =>
      [...distribusiConfigList].sort((a, b) =>
        a.status === 'Aktif' ? -1 : b.status === 'Aktif' ? 1 : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [distribusiConfigList]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-extrabold text-lg text-[#1A5276] flex items-center gap-2.5">
            <Settings2 className="w-6 h-6 text-[#1ABC9C]" />
            Konfigurasi Pembagian Pemasukan
          </h3>
          <p className="text-sm text-[#566573] mt-1">
            Atur nominal pembagian Syahriyah santri ke 5 keuangan utama (YAYASAN · MADIN · SEKOLAH · PESANTREN · MAKAN). Total nominal menjadi total akhir Syahriyah santri.
          </p>
        </div>
        {isAdmin ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 text-[#1A5276] text-xs font-bold rounded-lg border border-sky-200">
            <ShieldCheck className="w-4 h-4" /> Yayasan Admin — dapat mengubah konfigurasi
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-500 text-xs font-bold rounded-lg">
            <Lock className="w-4 h-4" /> Hanya dapat melihat — hubungi Admin Yayasan untuk mengubah
          </span>
        )}
      </div>

      {/* Form Konfigurasi */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-5">
          <CalendarRange className="w-5 h-5 text-[#1A5276]" />
          <h4 className="font-extrabold text-base text-[#1A5276]">Form Konfigurasi</h4>
          {activeConfig && (
            <span className={`ml-auto text-[11px] font-extrabold px-2.5 py-1 rounded-full ${statusBadge[activeConfig.status]}`}>
              {activeConfig.status.toUpperCase()} — {activeConfig.version} · {activeConfig.name}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Nama Konfigurasi *</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              disabled={!isAdmin}
              placeholder="cth. Periode C — Syahriyah 2026/2027"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-bold text-[#1A5276] focus:outline-none focus:ring-2 focus:ring-[#1ABC9C] disabled:bg-gray-50 disabled:text-gray-400"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Berlaku Mulai *</label>
            <input
              type="date"
              value={effectiveFrom}
              onChange={e => setEffectiveFrom(e.target.value)}
              disabled={!isAdmin}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-bold text-[#1A5276] focus:outline-none focus:ring-2 focus:ring-[#1ABC9C] disabled:bg-gray-50 disabled:text-gray-400"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Berlaku Sampai (opsional)</label>
            <input
              type="date"
              value={effectiveUntil}
              onChange={e => setEffectiveUntil(e.target.value)}
              disabled={!isAdmin}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-bold text-[#1A5276] focus:outline-none focus:ring-2 focus:ring-[#1ABC9C] disabled:bg-gray-50 disabled:text-gray-400"
            />
          </div>
        </div>

        {/* Input nominal */}
        <div className="space-y-3">
          {KONTEKS_KEUANGAN_ORDER.map(k => (
            <div key={k} className="flex items-center gap-3">
              <div className="w-40 sm:w-48 shrink-0">
                <label className={`text-sm font-extrabold ${KONTEKS_COLOR[k]}`}>{KONTEKS_LABEL[k]}</label>
              </div>
              <div className="relative flex-1 max-w-xs">
                <input
                  type="number"
                  min={0}
                  step={1000}
                  value={nominals[k] ?? 0}
                  onChange={e => setNominal(k, Number(e.target.value))}
                  disabled={!isAdmin}
                  className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg text-sm font-black text-[#1A5276] focus:outline-none focus:ring-2 focus:ring-[#1ABC9C] disabled:bg-gray-50 disabled:text-gray-400"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-extrabold text-gray-400">Rp</span>
              </div>
              <div className="hidden sm:block w-40 text-right text-sm font-bold text-gray-500">
                {formatRp(nominals[k] ?? 0)}
              </div>
            </div>
          ))}
        </div>

        {/* Total & validasi */}
        <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <span className="text-sm font-extrabold text-gray-600">TOTAL AKHIR SYAHRIYAH SANTRI</span>
            <span className={`text-xl font-black ${validation.valid ? 'text-emerald-600' : 'text-rose-600'}`}>
              {formatRp(validation.total)}
            </span>
            {validation.valid ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                <CheckCircle className="w-4 h-4" /> Valid
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600">
                <XCircle className="w-4 h-4" /> {validation.errors[0]}
              </span>
            )}
          </div>
          <button
            onClick={handleSave}
            disabled={!isAdmin || !validation.valid || !isDirty}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1ABC9C] hover:bg-[#16a085] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-lg shadow transition-all"
          >
            <Save className="w-4 h-4" /> Simpan Konfigurasi
          </button>
        </div>

        {feedback && (
          <div className={`mt-4 p-3 rounded-lg text-sm font-bold ${feedback.ok ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
            {feedback.message}
          </div>
        )}
      </div>

      {/* Histori Konfigurasi */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <History className="w-5 h-5 text-[#1A5276]" />
          <h4 className="font-extrabold text-base text-[#1A5276]">Histori Konfigurasi</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-[#1A5276] text-white font-bold uppercase tracking-wider text-xs">
                <th className="p-3">Versi</th>
                <th className="p-3">Nama</th>
                <th className="p-3">Periode Berlaku</th>
                <th className="p-3 text-center">YYS</th>
                <th className="p-3 text-center">MDN</th>
                <th className="p-3 text-center">SKL</th>
                <th className="p-3 text-center">PST</th>
                <th className="p-3 text-center">MKN</th>
                <th className="p-3 text-center">Total</th>
                <th className="p-3">Diubah oleh</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedConfigs.map(c => {
                const configNominals = getConfigNominals(c);
                const total = sumNominal(configNominals);
                const valid = total > 0;
                return (
                  <tr key={c.id} className="hover:bg-sky-50 transition-colors">
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-[#1A5276]/10 text-[#1A5276] font-black text-xs">{c.version}</span>
                    </td>
                    <td className="p-3 font-extrabold text-gray-800">{c.name}</td>
                    <td className="p-3 text-gray-600">
                      {c.effectiveFrom} {c.effectiveUntil ? `→ ${c.effectiveUntil}` : '→ seterusnya'}
                    </td>
                    {KONTEKS_KEUANGAN_ORDER.map(k => (
                      <td key={k} className="p-3 text-center font-bold text-gray-700">
                        {formatRp(configNominals[k] ?? 0)}
                      </td>
                    ))}
                    <td className={`p-3 text-center font-black ${valid ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {formatRp(total)}
                    </td>
                    <td className="p-3 text-gray-500 text-xs">{c.createdBy}</td>
                    <td className="p-3 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${statusBadge[c.status]}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      {c.status !== 'Aktif' ? (
                        <button
                          onClick={() => handleActivate(c.id)}
                          disabled={!isAdmin}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-sky-100 hover:bg-sky-200 text-[#1A5276] text-xs font-bold rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <Power className="w-3.5 h-3.5" /> Aktifkan
                        </button>
                      ) : (
                        <span className="text-xs font-extrabold text-emerald-600">Sedang Aktif</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {sortedConfigs.length === 0 && (
                <tr>
                  <td colSpan={11} className="p-6 text-center text-gray-500">Belum ada konfigurasi.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
