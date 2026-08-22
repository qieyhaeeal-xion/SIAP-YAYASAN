import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Plus,
  Wallet,
  Receipt,
  ChevronDown,
  X,
  AlertCircle,
  PieChart,
  CheckCircle
} from 'lucide-react';
import {
  KonteksKeuangan,
  KONTEKS_KEUANGAN_ORDER,
  Pemasukan,
  AlokasiPemasukan
} from '../../types/sisantri';
import { getConfigNominals, sumNominal } from '../../services/distributionService';

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

const JENIS_OPTIONS = ['Syahriyah', 'Uang Gedung', 'Seragam', 'Kitab', 'Ujian', 'Lainnya'];
const METODE_OPTIONS = ['Tunai', 'Transfer Bank', 'E-Wallet (QRIS)', 'Giro'];

const rp = (n: number) => 'Rp ' + n.toLocaleString('id-ID');

const STATUS_STYLE: Record<Pemasukan['status'], string> = {
  PENDING: 'bg-gray-100 text-gray-600',
  PAID: 'bg-sky-100 text-sky-800',
  DISTRIBUTED: 'bg-emerald-100 text-emerald-800',
  FAILED: 'bg-rose-100 text-rose-700'
};

export const PemasukanDistribusi: React.FC = () => {
  const {
    pemasukanList,
    alokasiList,
    santriList,
    getSantriNameById,
    createPemasukan,
    getAktifDistribusiConfig,
    currentUser
  } = useApp();

  const [showForm, setShowForm] = useState(false);
  const [result, setResult] = useState<{ pemasukan: Pemasukan; alokasi: AlokasiPemasukan[] } | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [santriId, setSantriId] = useState('');
  const [tanggal, setTanggal] = useState(new Date().toISOString().slice(0, 10));
  const [nominal, setNominal] = useState(0);
  const [jenis, setJenis] = useState('Syahriyah');
  const [metode, setMetode] = useState('Tunai');
  const [periode, setPeriode] = useState('Agustus 2026');
  const [catatan, setCatatan] = useState('');

  const aktifConfig = getAktifDistribusiConfig();
  const activeNominals = aktifConfig ? getConfigNominals(aktifConfig) : undefined;
  const totalSyahriyah = activeNominals ? sumNominal(activeNominals) : 0;
  const activeSantris = santriList.filter(s => s.status === 'Aktif');

  const alokasiByPemasukan = useMemo(() => {
    const map: Record<string, AlokasiPemasukan[]> = {};
    for (const a of alokasiList) {
      if (!map[a.pemasukanId]) map[a.pemasukanId] = [];
      map[a.pemasukanId].push(a);
    }
    return map;
  }, [alokasiList]);

  const konteksTotals = useMemo(() => {
    const totals: Record<KonteksKeuangan, number> = { YAYASAN: 0, MADIN: 0, SEKOLAH: 0, PESANTREN: 0, MAKAN: 0 };
    for (const a of alokasiList) totals[a.konteks] += a.nominal;
    return totals;
  }, [alokasiList]);

  const totalPemasukan = useMemo(() => pemasukanList.reduce((a, p) => a + p.nominal, 0), [pemasukanList]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!aktifConfig) {
      setError('Tidak ada konfigurasi nominal yang aktif. Buat di tab "Konfigurasi Pemasukan" terlebih dahulu.');
      return;
    }
    if (!santriId) { setError('Pilih santri terlebih dahulu.'); return; }
    if (!nominal || nominal <= 0) { setError('Nominal harus lebih dari 0.'); return; }
    if (jenis === 'Syahriyah' && nominal !== totalSyahriyah) {
      setError(`Nominal Syahriyah harus sama dengan total akhir ${rp(totalSyahriyah)}.`);
      return;
    }

    const res = createPemasukan({
      santriId,
      tanggal,
      nominal,
      jenisPembayaran: jenis,
      metodePembayaran: metode,
      periode,
      catatan: catatan || undefined,
      createdBy: currentUser.nama
    });
    if (!res.ok) { setError(res.error || 'Gagal mencatat pemasukan.'); return; }
    setResult({ pemasukan: res.pemasukan!, alokasi: res.alokasi! });
    setShowForm(false);
    setSantriId(''); setNominal(0); setJenis('Syahriyah'); setMetode('Tunai'); setPeriode('Agustus 2026'); setCatatan('');
  };

  const sortedPemasukan = useMemo(
    () => [...pemasukanList].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [pemasukanList]
  );

  return (
    <div className="space-y-6">
      {/* Ringkasan distribusi per konteks */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {KONTEKS_KEUANGAN_ORDER.map(k => {
          const configuredNominal = activeNominals?.[k] ?? 0;
          const total = konteksTotals[k];
          const maxTotal = Math.max(1, ...KONTEKS_KEUANGAN_ORDER.map(x => konteksTotals[x]));
          const width = Math.max(4, (total / maxTotal) * 100);
          return (
            <div key={k} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <div className={`inline-flex px-2 py-0.5 rounded text-[10px] font-extrabold ${KONTEKS_STYLE[k].badge}`}>
                {KONTEKS_LABEL[k]}
              </div>
              <div className={`mt-2 text-lg font-black ${KONTEKS_STYLE[k].text}`}>{rp(total)}</div>
              <div className="text-[11px] text-gray-500 font-bold">Konfigurasi aktif {rp(configuredNominal)}</div>
              <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${KONTEKS_STYLE[k].bar}`} style={{ width: `${width}%` }} />
              </div>
            </div>
          );
        })}
        <div className="bg-[#1A5276] rounded-xl border border-[#1A5276] shadow-sm p-4 text-white">
          <div className="inline-flex px-2 py-0.5 rounded text-[10px] font-extrabold bg-white/20">TOTAL PEMASUKAN</div>
          <div className="mt-2 text-lg font-black text-white">{rp(totalPemasukan)}</div>
          <div className="text-[11px] text-white/70 font-bold">{pemasukanList.length} transaksi tercatat</div>
        </div>
      </div>

      {/* Header aksi */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-extrabold text-lg text-[#1A5276] flex items-center gap-2.5">
            <PieChart className="w-6 h-6 text-[#1ABC9C]" />
            Pemasukan & Distribusi
          </h3>
          <p className="text-sm text-[#566573] mt-1">
            Catat pembayaran santri sebagai satu Pemasukan — otomatis dibagi ke 5 keuangan utama sesuai konfigurasi aktif & disimpan sebagai snapshot.
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(v => !v);
            setError(null);
            if (!showForm && jenis === 'Syahriyah' && totalSyahriyah > 0) setNominal(totalSyahriyah);
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1ABC9C] hover:bg-[#16a085] text-white font-bold rounded-lg shadow transition-all"
        >
          <Plus className="w-4 h-4" /> {showForm ? 'Tutup Form' : 'Catat Pemasukan'}
        </button>
      </div>

      {!aktifConfig && (
        <div className="flex items-start gap-3 p-4 rounded-xl border border-amber-200 bg-amber-50 text-amber-800">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-sm">
            <span className="font-extrabold">Belum ada konfigurasi pembagian aktif.</span>{' '}
            Buka tab <span className="font-extrabold">"Konfigurasi Pemasukan"</span> untuk membuat & mengaktifkan nominal Syahriyah sebelum mencatat pemasukan.
          </div>
        </div>
      )}

      {/* Form catat pemasukan */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <Wallet className="w-5 h-5 text-[#1A5276]" />
            <h4 className="font-extrabold text-base text-[#1A5276]">Catat Pemasukan Santri</h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Santri *</label>
              <select
                value={santriId}
                onChange={e => setSantriId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-bold text-[#1A5276] focus:outline-none focus:ring-2 focus:ring-[#1ABC9C]"
              >
                <option value="">— Pilih Santri —</option>
                {activeSantris.map(s => (
                  <option key={s.id} value={s.id}>{s.namaLengkap} ({s.nis})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Tanggal *</label>
              <input type="date" value={tanggal} onChange={e => setTanggal(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-bold text-[#1A5276] focus:outline-none focus:ring-2 focus:ring-[#1ABC9C]" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Nominal *</label>
              <input type="number" min={0} value={nominal || ''} onChange={e => setNominal(Number(e.target.value))}
                placeholder="cth. 775000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-bold text-[#1A5276] focus:outline-none focus:ring-2 focus:ring-[#1ABC9C]" />
              {jenis === 'Syahriyah' && aktifConfig && (
                <p className="mt-1 text-[11px] font-bold text-emerald-700">Total akhir Syahriyah: {rp(totalSyahriyah)}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Jenis Pembayaran *</label>
              <select value={jenis} onChange={e => {
                const value = e.target.value;
                setJenis(value);
                if (value === 'Syahriyah' && totalSyahriyah > 0) setNominal(totalSyahriyah);
              }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-bold text-[#1A5276] focus:outline-none focus:ring-2 focus:ring-[#1ABC9C]">
                {JENIS_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Metode Pembayaran *</label>
              <select value={metode} onChange={e => setMetode(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-bold text-[#1A5276] focus:outline-none focus:ring-2 focus:ring-[#1ABC9C]">
                {METODE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Periode *</label>
              <input type="text" value={periode} onChange={e => setPeriode(e.target.value)}
                placeholder="cth. Agustus 2026"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-bold text-[#1A5276] focus:outline-none focus:ring-2 focus:ring-[#1ABC9C]" />
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-xs font-bold text-gray-600 mb-1">Catatan (opsional)</label>
              <input type="text" value={catatan} onChange={e => setCatatan(e.target.value)}
                placeholder="cth. Transfer BSI a.n. Bendahara"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-bold text-[#1A5276] focus:outline-none focus:ring-2 focus:ring-[#1ABC9C]" />
            </div>
          </div>

          {error && (
            <div className="mt-4 flex items-center gap-2 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm font-bold">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          <div className="mt-5 flex items-center justify-end gap-3">
            <button type="button" onClick={() => setShowForm(false)}
              className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg">
              Batal
            </button>
            <button type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1A5276] hover:bg-[#154360] text-white font-bold rounded-lg shadow transition-all">
              <CheckCircle className="w-4 h-4" /> Simpan & Distribusikan
            </button>
          </div>
        </form>
      )}

      {/* Modal hasil distribusi */}
      {result && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="font-extrabold text-lg text-[#1A5276] flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500" /> Pemasukan Tercatat
                </h4>
                <p className="text-xs text-gray-500 font-bold mt-0.5">No. {result.pemasukan.noPemasukan}</p>
              </div>
              <button onClick={() => setResult(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm space-y-1.5 mb-4">
              <div className="flex justify-between"><span className="text-gray-500 font-bold">Santri</span><span className="font-extrabold text-[#1A5276]">{getSantriNameById(result.pemasukan.santriId)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500 font-bold">Tanggal</span><span>{result.pemasukan.tanggal}</span></div>
              <div className="flex justify-between"><span className="text-gray-500 font-bold">Jenis</span><span>{result.pemasukan.jenisPembayaran} · {result.pemasukan.metodePembayaran}</span></div>
              <div className="flex justify-between"><span className="text-gray-500 font-bold">Total</span><span className="font-black text-emerald-600">{rp(result.pemasukan.nominal)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500 font-bold">Konfigurasi</span><span className="text-[11px]">{result.pemasukan.configSnapshot.name}</span></div>
            </div>

            <p className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-2">Distribusi otomatis</p>
            <div className="space-y-2">
              {result.alokasi.map(a => (
                <div key={a.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                  <div>
                    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-extrabold ${KONTEKS_STYLE[a.konteks].badge}`}>
                      {KONTEKS_LABEL[a.konteks]}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-[#1A5276]">{rp(a.nominal)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 flex justify-end">
              <button onClick={() => setResult(null)} className="px-5 py-2.5 bg-[#1A5276] text-white font-bold rounded-lg">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Riwayat pemasukan */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <Receipt className="w-5 h-5 text-[#1A5276]" />
          <h4 className="font-extrabold text-base text-[#1A5276]">Riwayat Pemasukan</h4>
          <span className="ml-auto text-xs font-extrabold text-gray-400">{sortedPemasukan.length} transaksi</span>
        </div>
        <div className="space-y-3">
          {sortedPemasukan.map(p => {
            const alokasi = alokasiByPemasukan[p.id] ?? [];
            const open = expandedId === p.id;
            return (
              <div key={p.id} className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpandedId(open ? null : p.id)}
                  className="w-full flex items-center gap-4 p-4 hover:bg-sky-50 transition-colors text-left"
                >
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-[#1A5276]/10 flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-[#1A5276]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-[#1A5276] truncate">{getSantriNameById(p.santriId)}</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold ${STATUS_STYLE[p.status]}`}>{p.status}</span>
                    </div>
                    <div className="text-xs text-gray-500 font-bold">
                      {p.noPemasukan} · {p.tanggal} · {p.jenisPembayaran}
                    </div>
                  </div>
                  <div className="hidden sm:flex flex-wrap gap-1 max-w-[180px]">
                    {alokasi.slice(0, 3).map(a => (
                      <span key={a.id} className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold ${KONTEKS_STYLE[a.konteks].badge}`}>
                         {KONTEKS_LABEL[a.konteks]} {rp(a.nominal)}
                      </span>
                    ))}
                    {alokasi.length > 3 && <span className="text-[9px] font-extrabold text-gray-400">+{alokasi.length - 3}</span>}
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-black text-[#1A5276]">{rp(p.nominal)}</div>
                    <div className="text-[10px] text-gray-400 font-bold">snapshot: {p.configSnapshot.name} ({p.configVersion})</div>
                  </div>
                  {p.status === 'FAILED' && p.distribusiError && (
                    <div className="shrink-0 hidden md:flex items-center gap-1 text-[10px] font-extrabold text-rose-600">
                      <AlertCircle className="w-4 h-4" />
                    </div>
                  )}
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform shrink-0 ${open ? 'rotate-180' : ''}`} />
                </button>
                {open && (
                  <div className="border-t border-gray-100 p-4 bg-gray-50/50">
                    <p className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-2">Rincian distribusi (snapshot transaksi)</p>
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                      {alokasi.map(a => (
                        <div key={a.id} className="p-3 bg-white rounded-lg border border-gray-200">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-extrabold ${KONTEKS_STYLE[a.konteks].badge}`}>
                            {KONTEKS_LABEL[a.konteks]}
                          </span>
                          <div className={`mt-1.5 text-sm font-black ${KONTEKS_STYLE[a.konteks].text}`}>{rp(a.nominal)}</div>
                           <div className="text-[10px] text-gray-400 font-bold">Nominal konfigurasi</div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs font-bold text-gray-500">
                      <span>Metode: {p.metodePembayaran} · Periode: {p.periode}{p.unitId ? ` · Unit: ${p.unitId}` : ''}</span>
                      <span>Dicatat oleh {p.createdBy}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[11px] font-bold text-gray-400">
                      <span>Dibayar: {new Date(p.paidAt).toLocaleString('id-ID')}{p.distributedAt ? ` · Didistribusi: ${new Date(p.distributedAt).toLocaleString('id-ID')}` : ''}</span>
                      <span>Konfigurasi: {p.configSnapshot.name} ({p.configVersion})</span>
                    </div>
                    {p.status === 'FAILED' && p.distribusiError && (
                      <div className="mt-3 flex items-start gap-2 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /> {p.distribusiError}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          {sortedPemasukan.length === 0 && (
            <div className="text-center py-10 text-gray-400 font-bold text-sm">
              Belum ada pemasukan tercatat. Klik "Catat Pemasukan" untuk memulai.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
