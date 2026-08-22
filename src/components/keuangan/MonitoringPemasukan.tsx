import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  AlertTriangle,
  BarChart3,
  Eye,
  Filter,
  ListFilter,
  ScrollText,
  Search,
  ShieldCheck,
  X
} from 'lucide-react';
import {
  KonteksKeuangan,
  KONTEKS_KEUANGAN_ORDER,
  Pemasukan,
  PemasukanStatus,
  AlokasiPemasukan
} from '../../types/sisantri';
import { getConfigNominals } from '../../services/distributionService';

const KONTEKS_LABEL: Record<KonteksKeuangan, string> = {
  YAYASAN: 'Yayasan',
  MADIN: 'Madin',
  SEKOLAH: 'Sekolah',
  PESANTREN: 'Pesantren',
  MAKAN: 'Makan'
};

const KONTEKS_STYLE: Record<KonteksKeuangan, { badge: string; bar: string; text: string }> = {
  YAYASAN: { badge: 'bg-emerald-100 text-emerald-800', bar: 'bg-emerald-500', text: 'text-emerald-700' },
  MADIN: { badge: 'bg-violet-100 text-violet-800', bar: 'bg-violet-500', text: 'text-violet-700' },
  SEKOLAH: { badge: 'bg-sky-100 text-sky-800', bar: 'bg-sky-500', text: 'text-sky-700' },
  PESANTREN: { badge: 'bg-teal-100 text-teal-800', bar: 'bg-[#1ABC9C]', text: 'text-teal-700' },
  MAKAN: { badge: 'bg-amber-100 text-amber-800', bar: 'bg-amber-500', text: 'text-amber-700' }
};

const STATUS_STYLE: Record<PemasukanStatus, string> = {
  PENDING: 'bg-gray-100 text-gray-600',
  PAID: 'bg-sky-100 text-sky-800',
  DISTRIBUTED: 'bg-emerald-100 text-emerald-800',
  FAILED: 'bg-rose-100 text-rose-700'
};

const ACTION_LABEL: Record<string, string> = {
  CREATE_PAYMENT: 'Catat Pembayaran',
  UPDATE_DISTRIBUTION_CONFIG: 'Ubah Konfigurasi',
  ACTIVATE_DISTRIBUTION_CONFIG: 'Aktifkan Konfigurasi',
  DISTRIBUTION_FAILED: 'Distribusi Gagal',
  VIEW_TRANSACTION: 'Lihat Transaksi'
};

const ACTION_COLOR: Record<string, string> = {
  CREATE_PAYMENT: 'bg-emerald-100 text-emerald-800',
  UPDATE_DISTRIBUTION_CONFIG: 'bg-sky-100 text-sky-800',
  ACTIVATE_DISTRIBUTION_CONFIG: 'bg-violet-100 text-violet-800',
  DISTRIBUTION_FAILED: 'bg-rose-100 text-rose-700',
  VIEW_TRANSACTION: 'bg-gray-100 text-gray-600'
};

const JENIS_OPTIONS = ['Syahriyah', 'Uang Gedung', 'Seragam', 'Kitab', 'Ujian', 'Lainnya'];
const UNIT_OPTIONS = ['PONPES', 'SMP', 'MTS', 'MA', 'SMK', 'MADIN'];

const rp = (n: number) => 'Rp ' + n.toLocaleString('id-ID');
const fmtDate = (d: string) =>
  new Date(d + (d.length === 10 ? 'T00:00:00' : '')).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
const fmtDateTime = (iso: string) => new Date(iso).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' });

export const MonitoringPemasukan: React.FC = () => {
  const {
    pemasukanList,
    alokasiList,
    auditLogList,
    getSantriNameById,
    getUnitKeyFromSantri,
    currentUser
  } = useApp();

  // Filters
  const today = new Date().toISOString().slice(0, 10);
  const [rangePreset, setRangePreset] = useState<'semua' | 'hariIni' | '7hari' | 'bulanIni'>('semua');
  const [tanggalDari, setTanggalDari] = useState('');
  const [tanggalSampai, setTanggalSampai] = useState('');
  const [unitFilter, setUnitFilter] = useState('ALL');
  const [jenisFilter, setJenisFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | PemasukanStatus>('ALL');
  const [konteksFilter, setKonteksFilter] = useState<'ALL' | KonteksKeuangan>('ALL');
  const [operatorFilter, setOperatorFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Detail & state
  const [detailId, setDetailId] = useState<string | null>(null);
  const [showErrors, setShowErrors] = useState(true);
  const [showAudit, setShowAudit] = useState(false);

  const alokasiByPemasukan = useMemo(() => {
    const map: Record<string, AlokasiPemasukan[]> = {};
    for (const a of alokasiList) {
      if (!map[a.pemasukanId]) map[a.pemasukanId] = [];
      map[a.pemasukanId].push(a);
    }
    return map;
  }, [alokasiList]);

  const operators = useMemo(
    () => Array.from(new Set(pemasukanList.map(p => p.createdBy))).sort(),
    [pemasukanList]
  );

  const detail = detailId ? pemasukanList.find(p => p.id === detailId) : undefined;
  const detailNominals = detail ? getConfigNominals(detail.configSnapshot) : undefined;

  const effectiveRange = useMemo(() => {
    const now = new Date();
    switch (rangePreset) {
      case 'hariIni':
        return { dari: today, sampai: today };
      case '7hari': {
        const dari = new Date(now.getTime() - 6 * 86400000).toISOString().slice(0, 10);
        return { dari, sampai: today };
      }
      case 'bulanIni': {
        const dari = now.toISOString().slice(0, 7) + '-01';
        return { dari, sampai: today };
      }
      default:
        return { dari: tanggalDari || '2000-01-01', sampai: tanggalSampai || '2100-12-31' };
    }
  }, [rangePreset, tanggalDari, tanggalSampai, today]);

  const filtered = useMemo(() => {
    return [...pemasukanList]
      .filter(p => {
        if (p.tanggal < effectiveRange.dari || p.tanggal > effectiveRange.sampai) return false;
        if (unitFilter !== 'ALL' && p.unitId !== unitFilter) return false;
        if (jenisFilter !== 'ALL' && p.jenisPembayaran !== jenisFilter) return false;
        if (statusFilter !== 'ALL' && p.status !== statusFilter) return false;
        if (operatorFilter !== 'ALL' && p.createdBy !== operatorFilter) return false;
        if (konteksFilter !== 'ALL') {
          const alok = alokasiByPemasukan[p.id] ?? [];
          if (!alok.some(a => a.konteks === konteksFilter)) return false;
        }
        const q = searchQuery.trim().toLowerCase();
        if (q) {
          const name = getSantriNameById(p.santriId).toLowerCase();
          if (!name.includes(q) && !p.noPemasukan.toLowerCase().includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => b.tanggal.localeCompare(a.tanggal) || b.createdAt.localeCompare(a.createdAt));
  }, [pemasukanList, effectiveRange, unitFilter, jenisFilter, statusFilter, konteksFilter, operatorFilter, searchQuery, alokasiByPemasukan, getSantriNameById]);

  const summary = useMemo(() => {
    const konteks: Record<KonteksKeuangan, number> = { YAYASAN: 0, MADIN: 0, SEKOLAH: 0, PESANTREN: 0, MAKAN: 0 };
    let total = 0;
    let okCount = 0;
    let failedCount = 0;
    for (const p of filtered) {
      total += p.nominal;
      if (p.status === 'DISTRIBUTED') okCount++;
      else if (p.status === 'FAILED') failedCount++;
      for (const a of alokasiByPemasukan[p.id] ?? []) konteks[a.konteks] += a.nominal;
    }
    return { konteks, total, okCount, failedCount };
  }, [filtered, alokasiByPemasukan]);

  const failedTransactions = useMemo(() => pemasukanList.filter(p => p.status === 'FAILED'), [pemasukanList]);

  const sortedAudit = useMemo(
    () => [...auditLogList].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [auditLogList]
  );

  const canManage = currentUser.role === 'admin_yayasan' || currentUser.role === 'admin_sistem';

  return (
    <div className="space-y-6">
      {/* Ringkasan — "Apa yang masuk?" */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-[#1A5276] rounded-xl shadow-sm p-4 text-white col-span-1">
          <div className="inline-flex px-2 py-0.5 rounded text-[10px] font-extrabold bg-white/20">TOTAL PEMASUKAN</div>
          <div className="mt-2 text-lg font-black">{rp(summary.total)}</div>
          <div className="text-[11px] text-white/70 font-bold">{filtered.length} transaksi (range aktif)</div>
        </div>
        {KONTEKS_KEUANGAN_ORDER.map(k => (
          <div key={k} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <div className={`inline-flex px-2 py-0.5 rounded text-[10px] font-extrabold ${KONTEKS_STYLE[k].badge}`}>
              {KONTEKS_LABEL[k]}
            </div>
            <div className={`mt-2 text-lg font-black ${KONTEKS_STYLE[k].text}`}>{rp(summary.konteks[k])}</div>
            <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${KONTEKS_STYLE[k].bar}`}
                style={{ width: `${summary.total > 0 ? Math.max(4, (summary.konteks[k] / summary.total) * 100) : 0}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Baris status + aksi */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <CheckDot icon={<BarChart3 className="w-5 h-5 text-emerald-600" />} />
          <div>
            <div className="text-lg font-black text-emerald-700">{summary.okCount}</div>
            <div className="text-[11px] font-extrabold text-emerald-600 uppercase tracking-wider">Terdistribusi</div>
          </div>
        </div>
        <div className={`flex items-center gap-3 rounded-xl p-4 border ${failedTransactions.length ? 'bg-rose-50 border-rose-200' : 'bg-white border-gray-200'}`}>
          <CheckDot icon={<AlertTriangle className={`w-5 h-5 ${failedTransactions.length ? 'text-rose-600' : 'text-gray-300'}`} />} />
          <div>
            <div className={`text-lg font-black ${failedTransactions.length ? 'text-rose-700' : 'text-gray-400'}`}>{failedTransactions.length}</div>
            <div className="text-[11px] font-extrabold text-rose-600 uppercase tracking-wider">Butuh Tinjauan (Error)</div>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-4">
          <CheckDot icon={<ShieldCheck className={`w-5 h-5 ${canManage ? 'text-sky-600' : 'text-gray-400'}`} />} />
          <div>
            <div className="text-sm font-black text-gray-700">{canManage ? 'Admin Yayasan — akses penuh' : 'Pengurus — mode lihat'}</div>
            <div className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">RBAC keuangan</div>
          </div>
        </div>
      </div>

      {/* Error monitoring */}
      {failedTransactions.length > 0 && showErrors && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-extrabold text-sm text-rose-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> DISTRIBUSI GAGAL — transaksi tidak hilang, perlu ditinjau
            </h4>
            <button onClick={() => setShowErrors(false)} className="text-rose-400 hover:text-rose-600"><X className="w-4 h-4" /></button>
          </div>
          <div className="space-y-2">
            {failedTransactions.map(p => (
              <button
                key={p.id}
                onClick={() => setDetailId(p.id)}
                className="w-full flex items-center justify-between gap-3 p-3 rounded-lg bg-white border border-rose-200 hover:border-rose-400 text-left transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="shrink-0 w-9 h-9 rounded-lg bg-rose-100 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-black text-rose-700">{p.noPemasukan} — {getSantriNameById(p.santriId)}</div>
                    <div className="text-[11px] font-bold text-rose-500 truncate">{p.distribusiError}</div>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-sm font-black text-rose-700">{rp(p.nominal)}</div>
                  <div className="text-[10px] text-rose-400 font-bold">{fmtDate(p.tanggal)}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filter + riwayat */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <ListFilter className="w-5 h-5 text-[#1A5276]" />
          <h4 className="font-extrabold text-base text-[#1A5276]">Riwayat Pemasukan & Monitoring</h4>
          <span className="ml-auto text-xs font-extrabold text-gray-400">{filtered.length} transaksi</span>
        </div>

        {/* Filter bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
          <div>
            <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-1">Rentang Cepat</label>
            <select
              value={rangePreset}
              onChange={e => setRangePreset(e.target.value as typeof rangePreset)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-bold text-[#1A5276] bg-white focus:outline-none focus:ring-2 focus:ring-[#1ABC9C]"
            >
              <option value="semua">Semua Periode</option>
              <option value="hariIni">Hari Ini</option>
              <option value="7hari">7 Hari Terakhir</option>
              <option value="bulanIni">Bulan Ini</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-1">Dari Tanggal</label>
            <input
              type="date"
              value={rangePreset === 'semua' ? tanggalDari : effectiveRange.dari}
              onChange={e => { setRangePreset('semua'); setTanggalDari(e.target.value); }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-bold text-[#1A5276] focus:outline-none focus:ring-2 focus:ring-[#1ABC9C]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-1">Sampai Tanggal</label>
            <input
              type="date"
              value={rangePreset === 'semua' ? tanggalSampai : effectiveRange.sampai}
              onChange={e => { setRangePreset('semua'); setTanggalSampai(e.target.value); }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-bold text-[#1A5276] focus:outline-none focus:ring-2 focus:ring-[#1ABC9C]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-1">Cari</label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Nama / No. Transaksi"
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm font-bold text-[#1A5276] focus:outline-none focus:ring-2 focus:ring-[#1ABC9C]"
              />
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-1">Unit Santri</label>
            <select value={unitFilter} onChange={e => setUnitFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-bold text-[#1A5276] bg-white focus:outline-none focus:ring-2 focus:ring-[#1ABC9C]">
              <option value="ALL">Semua Unit</option>
              {UNIT_OPTIONS.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-1">Jenis Pembayaran</label>
            <select value={jenisFilter} onChange={e => setJenisFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-bold text-[#1A5276] bg-white focus:outline-none focus:ring-2 focus:ring-[#1ABC9C]">
              <option value="ALL">Semua Jenis</option>
              {JENIS_OPTIONS.map(j => <option key={j} value={j}>{j}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-1">Status Transaksi</label>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as typeof statusFilter)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-bold text-[#1A5276] bg-white focus:outline-none focus:ring-2 focus:ring-[#1ABC9C]">
              <option value="ALL">Semua Status</option>
              {(['PENDING', 'PAID', 'DISTRIBUTED', 'FAILED'] as PemasukanStatus[]).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-1">Konteks Keuangan</label>
            <select value={konteksFilter} onChange={e => setKonteksFilter(e.target.value as typeof konteksFilter)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-bold text-[#1A5276] bg-white focus:outline-none focus:ring-2 focus:ring-[#1ABC9C]">
              <option value="ALL">Semua Konteks</option>
              {KONTEKS_KEUANGAN_ORDER.map(k => <option key={k} value={k}>{KONTEKS_LABEL[k]}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-1">Operator / Pencatat</label>
            <select value={operatorFilter} onChange={e => setOperatorFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-bold text-[#1A5276] bg-white focus:outline-none focus:ring-2 focus:ring-[#1ABC9C]">
              <option value="ALL">Semua Operator</option>
              {operators.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => { setRangePreset('semua'); setTanggalDari(''); setTanggalSampai(''); setUnitFilter('ALL'); setJenisFilter('ALL'); setStatusFilter('ALL'); setKonteksFilter('ALL'); setOperatorFilter('ALL'); setSearchQuery(''); }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold rounded-lg"
            >
              <Filter className="w-4 h-4" /> Reset Filter
            </button>
          </div>
        </div>

        {/* Tabel riwayat */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-[#1A5276] text-white font-bold uppercase tracking-wider text-xs">
                <th className="p-3">Tanggal</th>
                <th className="p-3">No. Transaksi</th>
                <th className="p-3">Santri</th>
                <th className="p-3 text-center">Unit</th>
                <th className="p-3">Jenis</th>
                <th className="p-3 text-right">Nominal</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3">Pencatat</th>
                <th className="p-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-sky-50 transition-colors">
                  <td className="p-3 font-mono text-gray-600 text-xs">{p.tanggal}</td>
                  <td className="p-3 font-mono font-bold text-[#1A5276] text-xs">{p.noPemasukan}</td>
                  <td className="p-3 font-extrabold text-gray-800">{getSantriNameById(p.santriId)}</td>
                  <td className="p-3 text-center">
                    {p.unitId ? (
                      <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-extrabold bg-sky-100 text-[#1A5276]">{p.unitId}</span>
                    ) : (
                      <span className="text-gray-300">-</span>
                    )}
                  </td>
                  <td className="p-3 text-gray-600">{p.jenisPembayaran}</td>
                  <td className="p-3 text-right font-black text-[#1A5276]">{rp(p.nominal)}</td>
                  <td className="p-3 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold whitespace-nowrap ${STATUS_STYLE[p.status]}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="p-3 text-gray-500 text-xs">{p.createdBy}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => setDetailId(p.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-100 hover:bg-sky-200 text-[#1A5276] text-xs font-bold rounded-lg"
                    >
                      <Eye className="w-3.5 h-3.5" /> Detail
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-gray-400 font-bold text-sm">Tidak ada transaksi yang cocok dengan filter.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Trail */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <button onClick={() => setShowAudit(v => !v)} className="w-full flex items-center gap-2">
          <ScrollText className="w-5 h-5 text-[#1A5276]" />
          <h4 className="font-extrabold text-base text-[#1A5276]">Audit Trail Pemasukan & Konfigurasi</h4>
          <span className="ml-auto inline-flex items-center gap-1 text-xs font-extrabold text-gray-400">
            {auditLogList.length} aktivitas tercatat
          </span>
        </button>
        {showAudit && (
          <div className="mt-4 space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {sortedAudit.map(log => (
              <div key={log.id} className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${ACTION_COLOR[log.action]}`}>
                    {ACTION_LABEL[log.action] ?? log.action}
                  </span>
                  <span className="text-[11px] font-bold text-gray-400">{fmtDateTime(log.createdAt)}</span>
                </div>
                <p className="text-sm font-bold text-gray-700">{log.detail}</p>
                <div className="mt-2 flex items-center gap-2 flex-wrap text-[11px] font-bold text-gray-400">
                  <span className="inline-flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-sky-500" /> {log.actorName}</span>
                  <span>· {log.entityType}: {log.entityLabel}</span>
                </div>
                {log.before && log.after && (
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="p-2 rounded-lg bg-gray-50 border border-gray-200">
                      <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1">Sebelum</p>
                      <pre className="text-[11px] text-gray-600 font-mono whitespace-pre-wrap">{JSON.stringify(log.before, null, 2)}</pre>
                    </div>
                    <div className="p-2 rounded-lg bg-sky-50 border border-sky-200">
                      <p className="text-[10px] font-extrabold text-sky-500 uppercase tracking-wider mb-1">Sesudah</p>
                      <pre className="text-[11px] text-sky-800 font-mono whitespace-pre-wrap">{JSON.stringify(log.after, null, 2)}</pre>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Detail Satu Transaksi */}
      {detail && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-extrabold text-lg text-[#1A5276]">Detail Pemasukan</h4>
                  <p className="text-xs text-gray-500 font-bold mt-0.5">{detail.noPemasukan}</p>
                </div>
                <button onClick={() => setDetailId(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
              </div>

              {/* Identitas transaksi */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><p className="text-[11px] font-extrabold text-gray-400 uppercase">Santri</p><p className="font-extrabold text-gray-800 mt-0.5">{getSantriNameById(detail.santriId)}</p></div>
                  <div><p className="text-[11px] font-extrabold text-gray-400 uppercase">Unit</p><p className="font-extrabold text-gray-800 mt-0.5">{detail.unitId ?? getUnitKeyFromSantri(detail.santriId) ?? '-'}</p></div>
                  <div><p className="text-[11px] font-extrabold text-gray-400 uppercase">Tanggal</p><p className="font-bold text-gray-800 mt-0.5">{fmtDate(detail.tanggal)}</p></div>
                  <div><p className="text-[11px] font-extrabold text-gray-400 uppercase">Status</p><p className="mt-0.5"><span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${STATUS_STYLE[detail.status]}`}>{detail.status}</span></p></div>
                  <div><p className="text-[11px] font-extrabold text-gray-400 uppercase">Nominal</p><p className="font-black text-[#1A5276] mt-0.5">{rp(detail.nominal)}</p></div>
                  <div><p className="text-[11px] font-extrabold text-gray-400 uppercase">Jenis</p><p className="font-bold text-gray-800 mt-0.5">{detail.jenisPembayaran}</p></div>
                  <div><p className="text-[11px] font-extrabold text-gray-400 uppercase">Metode</p><p className="font-bold text-gray-800 mt-0.5">{detail.metodePembayaran}</p></div>
                  <div><p className="text-[11px] font-extrabold text-gray-400 uppercase">Periode</p><p className="font-bold text-gray-800 mt-0.5">{detail.periode}</p></div>
                  <div><p className="text-[11px] font-extrabold text-gray-400 uppercase">Pencatat</p><p className="font-bold text-gray-800 mt-0.5">{detail.createdBy}</p></div>
                  <div><p className="text-[11px] font-extrabold text-gray-400 uppercase">Waktu Bayar</p><p className="font-bold text-gray-800 mt-0.5">{fmtDateTime(detail.paidAt)}</p></div>
                </div>
                {detail.catatan && <p className="mt-3 text-xs text-gray-500 font-bold">Catatan: {detail.catatan}</p>}
              </div>

              {/* Integritas */}
              <div className={`mt-4 p-3 rounded-lg text-sm font-bold ${detail.status === 'DISTRIBUTED' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                {detail.status === 'DISTRIBUTED'
                  ? `✓ Terverifikasi: total distribusi = total pembayaran (${rp(detail.nominal)})`
                  : `⚠ ${detail.distribusiError ?? 'Distribusi belum selesai / gagal.'}`}
              </div>

              {/* Distribusi transaksi */}
              <p className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mt-5 mb-2">Distribusi Transaksi</p>
              <div className="space-y-2">
                {(alokasiByPemasukan[detail.id] ?? []).map(a => (
                  <div key={a.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-extrabold ${KONTEKS_STYLE[a.konteks].badge}`}>
                        {KONTEKS_LABEL[a.konteks]}
                      </span>
                    </div>
                    <span className="text-sm font-black text-[#1A5276]">{rp(a.nominal)}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between p-3 rounded-lg bg-[#1A5276] text-white">
                  <span className="text-xs font-extrabold uppercase tracking-wider">Total Distribusi</span>
                  <span className="font-black">{rp((alokasiByPemasukan[detail.id] ?? []).reduce((a, x) => a + x.nominal, 0))}</span>
                </div>
              </div>

              {/* Snapshot konfigurasi */}
              <div className="mt-4 p-4 rounded-xl border border-gray-200 bg-gray-50">
                <p className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-1">Snapshot Konfigurasi yang Digunakan</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded bg-[#1A5276]/10 text-[#1A5276] font-black text-xs">{detail.configVersion}</span>
                  <span className="text-sm font-extrabold text-gray-800">{detail.configSnapshot.name}</span>
                  <span className="text-xs text-gray-400 font-bold">berlaku {detail.configSnapshot.effectiveFrom}{detail.configSnapshot.effectiveUntil ? ` → ${detail.configSnapshot.effectiveUntil}` : ' → seterusnya'}</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {KONTEKS_KEUANGAN_ORDER.map(k => (
                    <span key={k} className="text-[10px] font-extrabold text-gray-500 bg-white border border-gray-200 px-2 py-0.5 rounded">
                      {KONTEKS_LABEL[k]} Rp {(detailNominals?.[k] ?? 0).toLocaleString('id-ID')}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 flex justify-end">
                <button onClick={() => setDetailId(null)} className="px-5 py-2.5 bg-[#1A5276] text-white font-bold rounded-lg">
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CheckDot: React.FC<{ icon: React.ReactNode }> = ({ icon }) => (
  <div className="shrink-0">{icon}</div>
);
