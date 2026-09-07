import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Building2,
  ChevronRight,
  Download,
  FileSpreadsheet,
  GraduationCap,
  Users,
  WalletCards
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  BULAN_KE_LABEL,
  bulanKeFromBulanTahun,
  Santri,
  TagihanKeuangan
} from '../../types/sisantri';
import { exportCsv, exportXlsx, ExportValue } from '../../services/exportService';
import { formatRp } from './shared';

type UnitKind = 'sekolah' | 'madin';
type StatusTagihan = TagihanKeuangan['status'];

interface UnitOption { id: string; kode: string; nama: string; }
interface ClassOption { id: string; nama: string; kode: string; waliKelas: string; }
interface PaymentValue { nominal: number; terbayar: number; status: StatusTagihan; }
interface RekapRow {
  santri: Santri;
  className?: string;
  hierarchy: string;
  months: PaymentValue[];
  additional: Record<string, PaymentValue>;
  totalTagihan: number;
  totalTerbayar: number;
}

const EMPTY_PAYMENT: PaymentValue = { nominal: 0, terbayar: 0, status: 'Belum Lunas' };

const isMonthly = (namaBiaya: string | undefined, jenis: string | undefined, tipeFrekuensi: string | undefined) =>
  tipeFrekuensi === 'Bulanan' || tipeFrekuensi === 'Periodik' || jenis === 'Syahriyah' || namaBiaya?.toLocaleLowerCase('id-ID').includes('syahriyah');

const paymentStatus = (nominal: number, terbayar: number): StatusTagihan => {
  if (nominal > 0 && terbayar >= nominal) return 'Lunas';
  if (terbayar > 0) return 'Sebagian';
  return 'Belum Lunas';
};

const addPayment = (target: PaymentValue, tagihan: TagihanKeuangan) => {
  target.nominal += tagihan.nominalTagihan || 0;
  target.terbayar += tagihan.nominalTerbayar || 0;
  target.status = paymentStatus(target.nominal, target.terbayar);
};

const paymentClass = (payment: PaymentValue) => payment.nominal > 0 && payment.terbayar >= payment.nominal
  ? 'bg-emerald-100 text-emerald-700 border-emerald-300'
  : 'bg-rose-100 text-rose-700 border-rose-300';

const paymentSymbol = (payment: PaymentValue) => payment.nominal > 0 && payment.terbayar >= payment.nominal ? '✓' : '-';
const filenamePart = (value: string) => value.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '');

export const RekapTagihanKelas: React.FC = () => {
  const {
    santriList,
    tagihanList,
    biayaMasterList,
    unitSekolahList,
    kelasSekolahList,
    kelasMadinList,
    getTahunAjaranAktif
  } = useApp();

  const [unitKind, setUnitKind] = useState<UnitKind>('sekolah');
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

  const activeYear = getTahunAjaranAktif();
  const activeSantri = useMemo(() => santriList.filter(santri => santri.status === 'Aktif'), [santriList]);
  const activePayments = useMemo(() => biayaMasterList.filter(item => item.aktif !== false), [biayaMasterList]);
  const monthlyPayments = useMemo(
    () => new Set(activePayments.filter(item => isMonthly(item.namaBiaya, item.jenis, item.tipeFrekuensi)).map(item => item.id)),
    [activePayments]
  );
  const additionalPayments = useMemo(
    () => activePayments.filter(item => !monthlyPayments.has(item.id)),
    [activePayments, monthlyPayments]
  );

  const units: UnitOption[] = useMemo(() => unitKind === 'sekolah'
    ? unitSekolahList.map(unit => ({ id: unit.id, kode: unit.kodeSekolah, nama: unit.namaSekolah }))
    : [{ id: 'madin', kode: 'MADIN', nama: 'Madrasah Diniyah' }], [unitKind, unitSekolahList]);

  const classes: ClassOption[] = useMemo(() => {
    if (unitKind === 'sekolah') {
      return kelasSekolahList
        .filter(kelas => kelas.sekolahId === selectedUnitId)
        .map(kelas => ({ id: kelas.id, kode: kelas.kodeKelas, nama: kelas.namaKelas, waliKelas: kelas.waliKelas }));
    }
    return kelasMadinList.map(kelas => ({ id: kelas.id, kode: kelas.id.toUpperCase(), nama: kelas.namaKelas, waliKelas: kelas.waliKelas }));
  }, [kelasMadinList, kelasSekolahList, selectedUnitId, unitKind]);

  const getClassSantri = (classId: string, kind = unitKind) => activeSantri.filter(santri =>
    kind === 'sekolah' ? santri.kelasSekolahId === classId : santri.kelasMadinId === classId
  );

  const selectedUnit = units.find(unit => unit.id === selectedUnitId);
  const selectedClass = classes.find(kelas => kelas.id === selectedClassId);
  const allowedTagihan = useMemo(() => tagihanList.filter(tagihan =>
    !activeYear || !tagihan.tahunAjaranId || tagihan.tahunAjaranId === activeYear.id
  ), [activeYear, tagihanList]);
  const buildRows = (students: Santri[], className?: string): RekapRow[] => students.map(santri => {
    const studentTagihan = allowedTagihan.filter(tagihan => tagihan.santriId === santri.id);
    const months = BULAN_KE_LABEL.map((_, index) => {
      const payment = { ...EMPTY_PAYMENT };
      studentTagihan.forEach(tagihan => {
        const master = activePayments.find(item => item.id === tagihan.biayaMasterId);
        const month = tagihan.bulanKe ?? bulanKeFromBulanTahun(tagihan.bulanTahun ?? '');
        if (monthlyPayments.has(tagihan.biayaMasterId) && month === index + 1 && master) addPayment(payment, tagihan);
      });
      return payment;
    });

    const additional: Record<string, PaymentValue> = {};
    additionalPayments.forEach(master => {
      const payment = { ...EMPTY_PAYMENT };
      studentTagihan.filter(tagihan => tagihan.biayaMasterId === master.id).forEach(tagihan => addPayment(payment, tagihan));
      additional[master.id] = payment;
    });

    const hierarchy = [santri.kategoriUtama, santri.tipeAsuh, santri.golonganAsuh, santri.program].filter(Boolean).join(' > ');
    const totalTagihan = months.reduce((sum, payment) => sum + payment.nominal, 0) + Object.values(additional).reduce((sum, payment) => sum + payment.nominal, 0);
    const totalTerbayar = months.reduce((sum, payment) => sum + payment.terbayar, 0) + Object.values(additional).reduce((sum, payment) => sum + payment.terbayar, 0);
    return { santri, className, hierarchy, months, additional, totalTagihan, totalTerbayar };
  });

  const selectedRows = useMemo(
    () => selectedClassId ? buildRows(getClassSantri(selectedClassId), selectedClass?.nama) : [],
    [selectedClassId, classes, activeSantri, allowedTagihan, activePayments, monthlyPayments, additionalPayments, unitKind]
  );

  const makeExportRows = (rows: RekapRow[], includeClass: boolean): ExportValue[][] => {
    const headers = [
      ...(includeClass ? ['Kelas'] : []), 'NIS', 'Nama Santri', 'Hierarki Status Santri',
      ...BULAN_KE_LABEL,
      ...additionalPayments.map(payment => payment.namaBiaya),
      'Total Tagihan', 'Total Kekurangan'
    ];
    const data = rows.map(row => [
      ...(includeClass ? [row.className || '-'] : []),
      row.santri.nis,
      row.santri.namaLengkap,
      row.hierarchy,
      ...row.months.map(paymentSymbol),
      ...additionalPayments.map(payment => paymentSymbol(row.additional[payment.id] || EMPTY_PAYMENT)),
      formatRp(row.totalTagihan),
      formatRp(Math.max(0, row.totalTagihan - row.totalTerbayar))
    ]);
    return [headers, ...data];
  };

  const exportRows = (rows: RekapRow[], name: string, includeClass: boolean) => {
    const data = makeExportRows(rows, includeClass);
    const base = `Rekap-Tagihan-${filenamePart(name)}-${filenamePart(activeYear?.kodeTahunAjaran || 'Tahun-Ajaran')}`;
    exportCsv(base, data);
    exportXlsx(base, data, 'Rekap Tagihan');
  };

  const exportUnit = (unit: UnitOption) => {
    const unitClasses = unitKind === 'sekolah'
      ? kelasSekolahList.filter(kelas => kelas.sekolahId === unit.id)
      : kelasMadinList;
    const rows = unitClasses.flatMap(kelas => buildRows(getClassSantri(kelas.id), kelas.namaKelas));
    exportRows(rows, unit.nama, true);
  };

  const resetToUnits = () => { setSelectedUnitId(null); setSelectedClassId(null); };
  const selectKind = (kind: UnitKind) => { setUnitKind(kind); resetToUnits(); };
  const selectUnit = (unitId: string) => { setSelectedUnitId(unitId); setSelectedClassId(null); };
  const renderSummary = (rows: RekapRow[]) => {
    const total = rows.reduce((sum, row) => sum + row.totalTagihan, 0);
    const paid = rows.reduce((sum, row) => sum + row.totalTerbayar, 0);
    return { students: rows.length, total, paid, remaining: Math.max(0, total - paid) };
  };
  const unitSummary = (unit: UnitOption) => renderSummary(buildRows(activeSantri.filter(santri =>
    unitKind === 'sekolah' ? santri.unitSekolahId === unit.id : Boolean(santri.kelasMadinId)
  )));
  const classSummary = (kelas: ClassOption) => renderSummary(buildRows(getClassSantri(kelas.id)));

  return (
    <div className="space-y-5">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h3 className="font-extrabold text-lg text-[#1A5276] flex items-center gap-2"><WalletCards className="w-6 h-6 text-[#1ABC9C]" /> Rekap Tagihan per Kelas</h3>
            <p className="text-sm text-gray-500 mt-1">Pilih unit lalu kelas untuk melihat tanda pembayaran santri.</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500"><span>Tahun ajaran:</span><span className="rounded-lg bg-sky-50 text-sky-700 px-3 py-2">{activeYear?.kodeTahunAjaran || 'Belum dipilih'}</span></div>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <button type="button" onClick={() => selectKind('sekolah')} className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 ${unitKind === 'sekolah' ? 'bg-[#1A5276] text-white' : 'bg-gray-100 text-gray-600'}`}><Building2 className="w-4 h-4" /> Unit Sekolah</button>
          <button type="button" onClick={() => selectKind('madin')} className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 ${unitKind === 'madin' ? 'bg-[#1A5276] text-white' : 'bg-gray-100 text-gray-600'}`}><GraduationCap className="w-4 h-4" /> Madin</button>
        </div>
      </div>

      {(selectedUnitId || selectedClassId) && <div className="flex flex-wrap items-center gap-2 text-sm font-bold"><button type="button" onClick={resetToUnits} className="text-[#1A5276] hover:underline">Semua Unit</button>{selectedUnit && <><ChevronRight className="w-4 h-4 text-gray-400" /><button type="button" onClick={() => setSelectedClassId(null)} className="text-[#1A5276] hover:underline">{selectedUnit.nama}</button></>}{selectedClass && <><ChevronRight className="w-4 h-4 text-gray-400" /><span className="text-gray-500">{selectedClass.nama}</span></>}</div>}

      {!selectedUnitId && <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">{units.map(unit => {
        const summary = unitSummary(unit);
        const classCount = unitKind === 'sekolah' ? kelasSekolahList.filter(kelas => kelas.sekolahId === unit.id).length : kelasMadinList.length;
        return <div key={unit.id} className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5"><div className="flex justify-between gap-3"><div><span className="text-[10px] font-black uppercase tracking-wider text-[#1ABC9C]">{unit.kode}</span><h4 className="font-extrabold text-[#1A5276] mt-1">{unit.nama}</h4></div><Building2 className="w-6 h-6 text-gray-300" /></div><div className="grid grid-cols-2 gap-2 mt-4 text-xs"><div className="rounded-lg bg-gray-50 p-2"><span className="text-gray-500">Kelas</span><strong className="block text-gray-800">{classCount}</strong></div><div className="rounded-lg bg-gray-50 p-2"><span className="text-gray-500">Santri aktif</span><strong className="block text-gray-800">{summary.students}</strong></div><div className="rounded-lg bg-sky-50 p-2"><span className="text-gray-500">Total tagihan</span><strong className="block text-sky-700">{formatRp(summary.total)}</strong></div><div className="rounded-lg bg-rose-50 p-2"><span className="text-gray-500">Total kekurangan</span><strong className="block text-rose-700">{formatRp(summary.remaining)}</strong></div></div><div className="mt-4 flex gap-2"><button type="button" onClick={() => selectUnit(unit.id)} className="flex-1 px-3 py-2 rounded-lg bg-[#1A5276] text-white text-xs font-bold flex items-center justify-center gap-1">Lihat Kelas <ChevronRight className="w-4 h-4" /></button><button type="button" onClick={() => exportUnit(unit)} title="Ekspor unit ke CSV dan Excel" className="px-3 py-2 rounded-lg border border-gray-200 text-[#1A5276] hover:bg-gray-50"><Download className="w-4 h-4" /></button></div></div>;
      })}</div>}

      {selectedUnitId && !selectedClassId && <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden"><div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3"><div><h3 className="font-extrabold text-[#1A5276]">Daftar Kelas {selectedUnit?.nama}</h3><p className="text-xs text-gray-500 mt-1">Klik lihat detail untuk membuka rekap santri.</p></div><button type="button" onClick={() => selectedUnit && exportUnit(selectedUnit)} className="px-3 py-2 rounded-lg border border-gray-200 text-xs font-bold text-[#1A5276] flex items-center gap-2"><FileSpreadsheet className="w-4 h-4" /> Ekspor Unit</button></div><div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-[#1A5276] text-white"><tr><th className="text-left px-5 py-3">Kelas</th><th className="text-left px-5 py-3">Wali Kelas</th><th className="text-right px-5 py-3">Santri</th><th className="text-right px-5 py-3">Total Tagihan</th><th className="text-right px-5 py-3">Total Kekurangan</th><th className="px-5 py-3"></th></tr></thead><tbody>{classes.map(kelas => { const summary = classSummary(kelas); return <tr key={kelas.id} className="border-b border-gray-100 hover:bg-gray-50"><td className="px-5 py-3 font-bold text-gray-800">{kelas.nama}<span className="block text-[11px] text-gray-400">{kelas.kode}</span></td><td className="px-5 py-3 text-gray-600">{kelas.waliKelas}</td><td className="px-5 py-3 text-right">{summary.students}</td><td className="px-5 py-3 text-right font-semibold">{formatRp(summary.total)}</td><td className="px-5 py-3 text-right text-rose-700 font-semibold">{formatRp(summary.remaining)}</td><td className="px-5 py-3 text-right"><button type="button" onClick={() => setSelectedClassId(kelas.id)} className="px-3 py-1.5 rounded-lg bg-sky-50 text-sky-700 text-xs font-bold">Lihat Detail</button></td></tr>; })}</tbody></table></div></div>}

      {selectedClassId && <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden"><div className="p-5 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-3"><div><h3 className="font-extrabold text-[#1A5276]">Rekap {selectedClass?.nama}</h3><p className="text-xs text-gray-500 mt-1">`✓` berarti lunas. `-` berarti belum lunas atau masih memiliki kekurangan.</p></div><div className="flex gap-2"><button type="button" onClick={() => setSelectedClassId(null)} className="px-3 py-2 rounded-lg bg-gray-100 text-gray-700 text-xs font-bold flex items-center gap-2"><ArrowLeft className="w-4 h-4" /> Kembali</button><button type="button" onClick={() => exportRows(selectedRows, selectedClass?.nama || 'Kelas', false)} className="px-3 py-2 rounded-lg bg-[#1A5276] text-white text-xs font-bold flex items-center gap-2"><Download className="w-4 h-4" /> Ekspor CSV + Excel</button></div></div>{selectedRows.length === 0 ? <div className="p-8 text-center text-sm text-gray-500"><Users className="w-8 h-8 mx-auto mb-2 text-gray-300" />Belum ada santri aktif pada kelas ini.</div> : <div className="overflow-x-auto"><table className="min-w-[1550px] w-full text-xs"><thead><tr className="bg-[#1A5276] text-white"><th className="sticky left-0 z-10 bg-[#1A5276] text-left px-4 py-3 min-w-[210px]">Nama Santri</th><th className="text-left px-3 py-3 min-w-[190px]">Hierarki Status</th>{BULAN_KE_LABEL.map(bulan => <th key={bulan} className="text-center px-3 py-3 min-w-[80px]">{bulan}</th>)}{additionalPayments.map(payment => <th key={payment.id} className="text-center px-3 py-3 min-w-[100px]">{payment.namaBiaya}</th>)}<th className="text-right px-3 py-3 min-w-[140px]">Total Tagihan</th><th className="text-right px-3 py-3 min-w-[140px]">Total Kekurangan</th></tr></thead><tbody>{selectedRows.map(row => <tr key={row.santri.id} className="border-b border-gray-100 align-top"><td className="sticky left-0 z-[1] bg-white px-4 py-3"><strong className="block text-gray-800">{row.santri.namaLengkap}</strong><span className="text-gray-400">NIS: {row.santri.nis}</span></td><td className="px-3 py-3 text-gray-600">{row.hierarchy || '-'}</td>{row.months.map((payment, index) => <td key={BULAN_KE_LABEL[index]} className="px-2 py-3"><span className={`block rounded-lg border px-2 py-2 text-center text-base font-black ${paymentClass(payment)}`}>{paymentSymbol(payment)}</span></td>)}{additionalPayments.map(payment => { const value = row.additional[payment.id] || EMPTY_PAYMENT; return <td key={payment.id} className="px-2 py-3"><span className={`block rounded-lg border px-2 py-2 text-center text-base font-black ${paymentClass(value)}`}>{paymentSymbol(value)}</span></td>; })}<td className="px-3 py-3 text-right font-bold text-gray-800">{formatRp(row.totalTagihan)}</td><td className="px-3 py-3 text-right font-bold text-rose-700">{formatRp(Math.max(0, row.totalTagihan - row.totalTerbayar))}</td></tr>)}<tr className="bg-gray-50 font-extrabold"><td colSpan={2} className="sticky left-0 bg-gray-50 px-4 py-3">TOTAL KELAS</td>{BULAN_KE_LABEL.map(bulan => <td key={bulan} className="px-2 py-3 text-center text-gray-400">-</td>)}{additionalPayments.map(payment => <td key={payment.id} className="px-2 py-3 text-center text-gray-400">-</td>)}<td className="px-3 py-3 text-right">{formatRp(selectedRows.reduce((sum, row) => sum + row.totalTagihan, 0))}</td><td className="px-3 py-3 text-right text-rose-700">{formatRp(selectedRows.reduce((sum, row) => sum + Math.max(0, row.totalTagihan - row.totalTerbayar), 0))}</td></tr></tbody></table></div>}</div>}
    </div>
  );
};
