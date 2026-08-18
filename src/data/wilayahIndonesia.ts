// Data Wilayah Indonesia - Provinsi, Kabupaten/Kota, Kecamatan
// Sumber: Kemendagri / BPS Indonesia

export interface Kecamatan {
  id: string;
  nama: string;
}

export interface KabupatenKota {
  id: string;
  nama: string;
  tipe: 'Kabupaten' | 'Kota';
  kecamatan: Kecamatan[];
}

export interface Provinsi {
  id: string;
  nama: string;
  kabupatenKota: KabupatenKota[];
}

export const dataWilayahIndonesia: Provinsi[] = [
  {
    id: '11',
    nama: 'Aceh',
    kabupatenKota: [
      {
        id: '11.01', nama: 'Aceh Selatan', tipe: 'Kabupaten',
        kecamatan: [
          { id: '11.01.01', nama: 'Bakongan' },
          { id: '11.01.02', nama: 'Kluet Utara' },
          { id: '11.01.03', nama: 'Kluet Selatan' },
          { id: '11.01.04', nama: 'Tapaktuan' },
          { id: '11.01.05', nama: 'Meukek' },
          { id: '11.01.06', nama: 'Labuhanhaji' },
          { id: '11.01.07', nama: 'Trumon' },
        ]
      },
      {
        id: '11.71', nama: 'Banda Aceh', tipe: 'Kota',
        kecamatan: [
          { id: '11.71.01', nama: 'Baiturrahman' },
          { id: '11.71.02', nama: 'Lueng Bata' },
          { id: '11.71.03', nama: 'Kuta Alam' },
          { id: '11.71.04', nama: 'Syiah Kuala' },
          { id: '11.71.05', nama: 'Ulee Kareng' },
          { id: '11.71.06', nama: 'Banda Raya' },
          { id: '11.71.07', nama: 'Jaya Baru' },
          { id: '11.71.08', nama: 'Meuraxa' },
          { id: '11.71.09', nama: 'Kutaraja' },
        ]
      },
    ]
  },
  {
    id: '12',
    nama: 'Sumatera Utara',
    kabupatenKota: [
      {
        id: '12.71', nama: 'Medan', tipe: 'Kota',
        kecamatan: [
          { id: '12.71.01', nama: 'Medan Kota' },
          { id: '12.71.02', nama: 'Medan Baru' },
          { id: '12.71.03', nama: 'Medan Belawan' },
          { id: '12.71.04', nama: 'Medan Deli' },
          { id: '12.71.05', nama: 'Medan Helvetia' },
          { id: '12.71.06', nama: 'Medan Johor' },
          { id: '12.71.07', nama: 'Medan Maimun' },
          { id: '12.71.08', nama: 'Medan Petisah' },
          { id: '12.71.09', nama: 'Medan Polonia' },
          { id: '12.71.10', nama: 'Medan Selayang' },
          { id: '12.71.11', nama: 'Medan Sunggal' },
          { id: '12.71.12', nama: 'Medan Tembung' },
          { id: '12.71.13', nama: 'Medan Timur' },
          { id: '12.71.14', nama: 'Medan Tuntungan' },
          { id: '12.71.15', nama: 'Medan Perjuangan' },
          { id: '12.71.16', nama: 'Medan Denai' },
          { id: '12.71.17', nama: 'Medan Area' },
          { id: '12.71.18', nama: 'Medan Amplas' },
          { id: '12.71.19', nama: 'Medan Labuhan' },
          { id: '12.71.20', nama: 'Medan Marelan' },
          { id: '12.71.21', nama: 'Medan Barat' },
        ]
      },
      {
        id: '12.07', nama: 'Deli Serdang', tipe: 'Kabupaten',
        kecamatan: [
          { id: '12.07.01', nama: 'Hamparan Perak' },
          { id: '12.07.02', nama: 'Labuhan Deli' },
          { id: '12.07.03', nama: 'Sunggal' },
          { id: '12.07.04', nama: 'Pancur Batu' },
          { id: '12.07.05', nama: 'Namo Rambe' },
          { id: '12.07.06', nama: 'Kutalimbaru' },
          { id: '12.07.07', nama: 'Sibolangit' },
          { id: '12.07.08', nama: 'Biru-biru' },
          { id: '12.07.09', nama: 'Pantai Labu' },
          { id: '12.07.10', nama: 'Batang Kuis' },
          { id: '12.07.11', nama: 'Percut Sei Tuan' },
          { id: '12.07.12', nama: 'Lubuk Pakam' },
          { id: '12.07.13', nama: 'Pagar Merbau' },
        ]
      },
    ]
  },
  {
    id: '13',
    nama: 'Sumatera Barat',
    kabupatenKota: [
      {
        id: '13.71', nama: 'Padang', tipe: 'Kota',
        kecamatan: [
          { id: '13.71.01', nama: 'Padang Barat' },
          { id: '13.71.02', nama: 'Padang Utara' },
          { id: '13.71.03', nama: 'Padang Timur' },
          { id: '13.71.04', nama: 'Padang Selatan' },
          { id: '13.71.05', nama: 'Nanggalo' },
          { id: '13.71.06', nama: 'Kuranji' },
          { id: '13.71.07', nama: 'Pauh' },
          { id: '13.71.08', nama: 'Lubuk Begalung' },
          { id: '13.71.09', nama: 'Lubuk Kilangan' },
          { id: '13.71.10', nama: 'Bungus Teluk Kabung' },
          { id: '13.71.11', nama: 'Koto Tangah' },
        ]
      },
    ]
  },
  {
    id: '14',
    nama: 'Riau',
    kabupatenKota: [
      {
        id: '14.71', nama: 'Pekanbaru', tipe: 'Kota',
        kecamatan: [
          { id: '14.71.01', nama: 'Bukit Raya' },
          { id: '14.71.02', nama: 'Lima Puluh' },
          { id: '14.71.03', nama: 'Marpoyan Damai' },
          { id: '14.71.04', nama: 'Payung Sekaki' },
          { id: '14.71.05', nama: 'Pekanbaru Kota' },
          { id: '14.71.06', nama: 'Sail' },
          { id: '14.71.07', nama: 'Senapelan' },
          { id: '14.71.08', nama: 'Sukajadi' },
          { id: '14.71.09', nama: 'Tampan' },
          { id: '14.71.10', nama: 'Tenayan Raya' },
          { id: '14.71.11', nama: 'Rumbai' },
          { id: '14.71.12', nama: 'Rumbai Pesisir' },
        ]
      },
    ]
  },
  {
    id: '15',
    nama: 'Jambi',
    kabupatenKota: [
      {
        id: '15.71', nama: 'Jambi', tipe: 'Kota',
        kecamatan: [
          { id: '15.71.01', nama: 'Telanaipura' },
          { id: '15.71.02', nama: 'Jambi Selatan' },
          { id: '15.71.03', nama: 'Jambi Timur' },
          { id: '15.71.04', nama: 'Pasar Jambi' },
          { id: '15.71.05', nama: 'Pelayangan' },
          { id: '15.71.06', nama: 'Danau Sipin' },
          { id: '15.71.07', nama: 'Kota Baru' },
          { id: '15.71.08', nama: 'Alam Barajo' },
          { id: '15.71.09', nama: 'Danau Teluk' },
          { id: '15.71.10', nama: 'Paal Merah' },
        ]
      },
    ]
  },
  {
    id: '16',
    nama: 'Sumatera Selatan',
    kabupatenKota: [
      {
        id: '16.71', nama: 'Palembang', tipe: 'Kota',
        kecamatan: [
          { id: '16.71.01', nama: 'Alang-alang Lebar' },
          { id: '16.71.02', nama: 'Bukit Kecil' },
          { id: '16.71.03', nama: 'Gandus' },
          { id: '16.71.04', nama: 'Ilir Barat I' },
          { id: '16.71.05', nama: 'Ilir Barat II' },
          { id: '16.71.06', nama: 'Ilir Timur I' },
          { id: '16.71.07', nama: 'Ilir Timur II' },
          { id: '16.71.08', nama: 'Kalidoni' },
          { id: '16.71.09', nama: 'Kemuning' },
          { id: '16.71.10', nama: 'Kertapati' },
          { id: '16.71.11', nama: 'Plaju' },
          { id: '16.71.12', nama: 'Sako' },
          { id: '16.71.13', nama: 'Seberang Ulu I' },
          { id: '16.71.14', nama: 'Seberang Ulu II' },
          { id: '16.71.15', nama: 'Sematang Borang' },
          { id: '16.71.16', nama: 'Sukarami' },
        ]
      },
    ]
  },
  {
    id: '18',
    nama: 'Lampung',
    kabupatenKota: [
      {
        id: '18.71', nama: 'Bandar Lampung', tipe: 'Kota',
        kecamatan: [
          { id: '18.71.01', nama: 'Bumi Waras' },
          { id: '18.71.02', nama: 'Enggal' },
          { id: '18.71.03', nama: 'Kedamaian' },
          { id: '18.71.04', nama: 'Kedaton' },
          { id: '18.71.05', nama: 'Kemiling' },
          { id: '18.71.06', nama: 'Labuhan Ratu' },
          { id: '18.71.07', nama: 'Panjang' },
          { id: '18.71.08', nama: 'Rajabasa' },
          { id: '18.71.09', nama: 'Sukabumi' },
          { id: '18.71.10', nama: 'Sukarame' },
          { id: '18.71.11', nama: 'Tanjung Karang Barat' },
          { id: '18.71.12', nama: 'Tanjung Karang Pusat' },
          { id: '18.71.13', nama: 'Tanjung Karang Timur' },
          { id: '18.71.14', nama: 'Tanjung Senang' },
          { id: '18.71.15', nama: 'Telukbetung Barat' },
          { id: '18.71.16', nama: 'Telukbetung Selatan' },
          { id: '18.71.17', nama: 'Telukbetung Timur' },
          { id: '18.71.18', nama: 'Telukbetung Utara' },
          { id: '18.71.19', nama: 'Way Halim' },
        ]
      },
    ]
  },
  {
    id: '31',
    nama: 'DKI Jakarta',
    kabupatenKota: [
      {
        id: '31.71', nama: 'Jakarta Pusat', tipe: 'Kota',
        kecamatan: [
          { id: '31.71.01', nama: 'Cempaka Putih' },
          { id: '31.71.02', nama: 'Gambir' },
          { id: '31.71.03', nama: 'Johar Baru' },
          { id: '31.71.04', nama: 'Kemayoran' },
          { id: '31.71.05', nama: 'Menteng' },
          { id: '31.71.06', nama: 'Sawah Besar' },
          { id: '31.71.07', nama: 'Senen' },
          { id: '31.71.08', nama: 'Tanah Abang' },
        ]
      },
      {
        id: '31.72', nama: 'Jakarta Utara', tipe: 'Kota',
        kecamatan: [
          { id: '31.72.01', nama: 'Cilincing' },
          { id: '31.72.02', nama: 'Kelapa Gading' },
          { id: '31.72.03', nama: 'Koja' },
          { id: '31.72.04', nama: 'Pademangan' },
          { id: '31.72.05', nama: 'Penjaringan' },
          { id: '31.72.06', nama: 'Tanjung Priok' },
        ]
      },
      {
        id: '31.73', nama: 'Jakarta Barat', tipe: 'Kota',
        kecamatan: [
          { id: '31.73.01', nama: 'Cengkareng' },
          { id: '31.73.02', nama: 'Grogol Petamburan' },
          { id: '31.73.03', nama: 'Kalideres' },
          { id: '31.73.04', nama: 'Kebon Jeruk' },
          { id: '31.73.05', nama: 'Kembangan' },
          { id: '31.73.06', nama: 'Palmerah' },
          { id: '31.73.07', nama: 'Taman Sari' },
          { id: '31.73.08', nama: 'Tambora' },
        ]
      },
      {
        id: '31.74', nama: 'Jakarta Selatan', tipe: 'Kota',
        kecamatan: [
          { id: '31.74.01', nama: 'Cilandak' },
          { id: '31.74.02', nama: 'Jagakarsa' },
          { id: '31.74.03', nama: 'Kebayoran Baru' },
          { id: '31.74.04', nama: 'Kebayoran Lama' },
          { id: '31.74.05', nama: 'Mampang Prapatan' },
          { id: '31.74.06', nama: 'Pancoran' },
          { id: '31.74.07', nama: 'Pasar Minggu' },
          { id: '31.74.08', nama: 'Pesanggrahan' },
          { id: '31.74.09', nama: 'Setia Budi' },
          { id: '31.74.10', nama: 'Tebet' },
        ]
      },
      {
        id: '31.75', nama: 'Jakarta Timur', tipe: 'Kota',
        kecamatan: [
          { id: '31.75.01', nama: 'Cakung' },
          { id: '31.75.02', nama: 'Cipayung' },
          { id: '31.75.03', nama: 'Ciracas' },
          { id: '31.75.04', nama: 'Duren Sawit' },
          { id: '31.75.05', nama: 'Jatinegara' },
          { id: '31.75.06', nama: 'Kramat Jati' },
          { id: '31.75.07', nama: 'Makasar' },
          { id: '31.75.08', nama: 'Matraman' },
          { id: '31.75.09', nama: 'Pasar Rebo' },
          { id: '31.75.10', nama: 'Pulo Gadung' },
        ]
      },
    ]
  },
  {
    id: '32',
    nama: 'Jawa Barat',
    kabupatenKota: [
      {
        id: '32.71', nama: 'Bogor', tipe: 'Kota',
        kecamatan: [
          { id: '32.71.01', nama: 'Bogor Barat' },
          { id: '32.71.02', nama: 'Bogor Selatan' },
          { id: '32.71.03', nama: 'Bogor Tengah' },
          { id: '32.71.04', nama: 'Bogor Timur' },
          { id: '32.71.05', nama: 'Bogor Utara' },
          { id: '32.71.06', nama: 'Tanah Sareal' },
        ]
      },
      {
        id: '32.73', nama: 'Bandung', tipe: 'Kota',
        kecamatan: [
          { id: '32.73.01', nama: 'Andir' },
          { id: '32.73.02', nama: 'Antapani' },
          { id: '32.73.03', nama: 'Arcamanik' },
          { id: '32.73.04', nama: 'Babakan Ciparay' },
          { id: '32.73.05', nama: 'Bandung Kidul' },
          { id: '32.73.06', nama: 'Bandung Kulon' },
          { id: '32.73.07', nama: 'Bandung Wetan' },
          { id: '32.73.08', nama: 'Batununggal' },
          { id: '32.73.09', nama: 'Bojongloa Kaler' },
          { id: '32.73.10', nama: 'Cibeunying Kaler' },
          { id: '32.73.11', nama: 'Cibeunying Kidul' },
          { id: '32.73.12', nama: 'Cibiru' },
          { id: '32.73.13', nama: 'Cicendo' },
          { id: '32.73.14', nama: 'Coblong' },
          { id: '32.73.15', nama: 'Kiaracondong' },
          { id: '32.73.16', nama: 'Lengkong' },
          { id: '32.73.17', nama: 'Regol' },
          { id: '32.73.18', nama: 'Sukajadi' },
          { id: '32.73.19', nama: 'Ujungberung' },
        ]
      },
      {
        id: '32.02', nama: 'Kabupaten Bogor', tipe: 'Kabupaten',
        kecamatan: [
          { id: '32.02.01', nama: 'Babakan Madang' },
          { id: '32.02.02', nama: 'Bojonggede' },
          { id: '32.02.03', nama: 'Cariu' },
          { id: '32.02.04', nama: 'Ciampea' },
          { id: '32.02.05', nama: 'Cibinong' },
          { id: '32.02.06', nama: 'Cileungsi' },
          { id: '32.02.07', nama: 'Citeureup' },
          { id: '32.02.08', nama: 'Dramaga' },
          { id: '32.02.09', nama: 'Gunung Putri' },
          { id: '32.02.10', nama: 'Jonggol' },
          { id: '32.02.11', nama: 'Kemang' },
          { id: '32.02.12', nama: 'Leuwiliang' },
          { id: '32.02.13', nama: 'Parung' },
          { id: '32.02.14', nama: 'Rumpin' },
          { id: '32.02.15', nama: 'Tajurhalang' },
          { id: '32.02.16', nama: 'Tenjo' },
        ]
      },
    ]
  },
  {
    id: '33',
    nama: 'Jawa Tengah',
    kabupatenKota: [
      {
        id: '33.74', nama: 'Semarang', tipe: 'Kota',
        kecamatan: [
          { id: '33.74.01', nama: 'Banyumanik' },
          { id: '33.74.02', nama: 'Candisari' },
          { id: '33.74.03', nama: 'Gajah Mungkur' },
          { id: '33.74.04', nama: 'Genuk' },
          { id: '33.74.05', nama: 'Gunungpati' },
          { id: '33.74.06', nama: 'Mijen' },
          { id: '33.74.07', nama: 'Ngaliyan' },
          { id: '33.74.08', nama: 'Pedurungan' },
          { id: '33.74.09', nama: 'Semarang Barat' },
          { id: '33.74.10', nama: 'Semarang Selatan' },
          { id: '33.74.11', nama: 'Semarang Tengah' },
          { id: '33.74.12', nama: 'Semarang Timur' },
          { id: '33.74.13', nama: 'Semarang Utara' },
          { id: '33.74.14', nama: 'Tembalang' },
          { id: '33.74.15', nama: 'Tugu' },
          { id: '33.74.16', nama: 'Gayamsari' },
        ]
      },
      {
        id: '33.09', nama: 'Kebumen', tipe: 'Kabupaten',
        kecamatan: [
          { id: '33.09.01', nama: 'Ayah' },
          { id: '33.09.02', nama: 'Buayan' },
          { id: '33.09.03', nama: 'Puring' },
          { id: '33.09.04', nama: 'Petanahan' },
          { id: '33.09.05', nama: 'Klirong' },
          { id: '33.09.06', nama: 'Buluspesantren' },
          { id: '33.09.07', nama: 'Ambal' },
          { id: '33.09.08', nama: 'Mirit' },
          { id: '33.09.09', nama: 'Bonorowo' },
          { id: '33.09.10', nama: 'Prembun' },
          { id: '33.09.11', nama: 'Kutowinangun' },
          { id: '33.09.12', nama: 'Alian' },
          { id: '33.09.13', nama: 'Kebumen' },
          { id: '33.09.14', nama: 'Pejagoan' },
          { id: '33.09.15', nama: 'Sruweng' },
          { id: '33.09.16', nama: 'Karanggayam' },
          { id: '33.09.17', nama: 'Sadang' },
          { id: '33.09.18', nama: 'Karangsambung' },
          { id: '33.09.19', nama: 'Padureso' },
        ]
      },
    ]
  },
  {
    id: '34',
    nama: 'DI Yogyakarta',
    kabupatenKota: [
      {
        id: '34.71', nama: 'Yogyakarta', tipe: 'Kota',
        kecamatan: [
          { id: '34.71.01', nama: 'Danurejan' },
          { id: '34.71.02', nama: 'Gedongtengen' },
          { id: '34.71.03', nama: 'Gondokusuman' },
          { id: '34.71.04', nama: 'Gondomanan' },
          { id: '34.71.05', nama: 'Jetis' },
          { id: '34.71.06', nama: 'Kotagede' },
          { id: '34.71.07', nama: 'Kraton' },
          { id: '34.71.08', nama: 'Mantrijeron' },
          { id: '34.71.09', nama: 'Mergangsan' },
          { id: '34.71.10', nama: 'Ngampilan' },
          { id: '34.71.11', nama: 'Pakualaman' },
          { id: '34.71.12', nama: 'Tegalrejo' },
          { id: '34.71.13', nama: 'Umbulharjo' },
          { id: '34.71.14', nama: 'Wirobrajan' },
        ]
      },
      {
        id: '34.02', nama: 'Bantul', tipe: 'Kabupaten',
        kecamatan: [
          { id: '34.02.01', nama: 'Bambanglipuro' },
          { id: '34.02.02', nama: 'Banguntapan' },
          { id: '34.02.03', nama: 'Bantul' },
          { id: '34.02.04', nama: 'Dlingo' },
          { id: '34.02.05', nama: 'Imogiri' },
          { id: '34.02.06', nama: 'Jetis' },
          { id: '34.02.07', nama: 'Kasihan' },
          { id: '34.02.08', nama: 'Kretek' },
          { id: '34.02.09', nama: 'Pajangan' },
          { id: '34.02.10', nama: 'Pandak' },
          { id: '34.02.11', nama: 'Piyungan' },
          { id: '34.02.12', nama: 'Pleret' },
          { id: '34.02.13', nama: 'Pundong' },
          { id: '34.02.14', nama: 'Sanden' },
          { id: '34.02.15', nama: 'Sedayu' },
          { id: '34.02.16', nama: 'Sewon' },
          { id: '34.02.17', nama: 'Srandakan' },
        ]
      },
      {
        id: '34.04', nama: 'Sleman', tipe: 'Kabupaten',
        kecamatan: [
          { id: '34.04.01', nama: 'Berbah' },
          { id: '34.04.02', nama: 'Cangkringan' },
          { id: '34.04.03', nama: 'Depok' },
          { id: '34.04.04', nama: 'Gamping' },
          { id: '34.04.05', nama: 'Godean' },
          { id: '34.04.06', nama: 'Kalasan' },
          { id: '34.04.07', nama: 'Minggir' },
          { id: '34.04.08', nama: 'Mlati' },
          { id: '34.04.09', nama: 'Moyudan' },
          { id: '34.04.10', nama: 'Ngaglik' },
          { id: '34.04.11', nama: 'Ngemplak' },
          { id: '34.04.12', nama: 'Pakem' },
          { id: '34.04.13', nama: 'Prambanan' },
          { id: '34.04.14', nama: 'Seyegan' },
          { id: '34.04.15', nama: 'Sleman' },
          { id: '34.04.16', nama: 'Tempel' },
          { id: '34.04.17', nama: 'Turi' },
        ]
      },
    ]
  },
  {
    id: '35',
    nama: 'Jawa Timur',
    kabupatenKota: [
      {
        id: '35.01', nama: 'Pacitan', tipe: 'Kabupaten',
        kecamatan: [
          { id: '35.01.01', nama: 'Pacitan' },
          { id: '35.01.02', nama: 'Arjosari' },
          { id: '35.01.03', nama: 'Nawangan' },
          { id: '35.01.04', nama: 'Bandar' },
          { id: '35.01.05', nama: 'Tegalombo' },
          { id: '35.01.06', nama: 'Tulakan' },
          { id: '35.01.07', nama: 'Ngadirojo' },
          { id: '35.01.08', nama: 'Sudimoro' },
          { id: '35.01.09', nama: 'Pringkuku' },
          { id: '35.01.10', nama: 'Punung' },
          { id: '35.01.11', nama: 'Donorojo' },
          { id: '35.01.12', nama: 'Kebonagung' },
        ]
      },
      {
        id: '35.02', nama: 'Ponorogo', tipe: 'Kabupaten',
        kecamatan: [
          { id: '35.02.01', nama: 'Ponorogo' },
          { id: '35.02.02', nama: 'Babadan' },
          { id: '35.02.03', nama: 'Jenangan' },
          { id: '35.02.04', nama: 'Ngebel' },
          { id: '35.02.05', nama: 'Pudak' },
          { id: '35.02.06', nama: 'Pulung' },
          { id: '35.02.07', nama: 'Sooko' },
          { id: '35.02.08', nama: 'Ngrayun' },
          { id: '35.02.09', nama: 'Slahung' },
          { id: '35.02.10', nama: 'Bungkal' },
          { id: '35.02.11', nama: 'Sambit' },
          { id: '35.02.12', nama: 'Sawoo' },
          { id: '35.02.13', nama: 'Jetis' },
          { id: '35.02.14', nama: 'Badegan' },
          { id: '35.02.15', nama: 'Kauman' },
          { id: '35.02.16', nama: 'Sukorejo' },
          { id: '35.02.17', nama: 'Jambon' },
          { id: '35.02.18', nama: 'Balong' },
          { id: '35.02.19', nama: 'Mlarak' },
          { id: '35.02.20', nama: 'Siman' },
          { id: '35.02.21', nama: 'Sampung' },
        ]
      },
      {
        id: '35.09', nama: 'Jember', tipe: 'Kabupaten',
        kecamatan: [
          { id: '35.09.01', nama: 'Sumbersari' },
          { id: '35.09.02', nama: 'Patrang' },
          { id: '35.09.03', nama: 'Kaliwates' },
          { id: '35.09.04', nama: 'Ajung' },
          { id: '35.09.05', nama: 'Rambipuji' },
          { id: '35.09.06', nama: 'Balung' },
          { id: '35.09.07', nama: 'Umbulsari' },
          { id: '35.09.08', nama: 'Semboro' },
          { id: '35.09.09', nama: 'Jombang' },
          { id: '35.09.10', nama: 'Silo' },
          { id: '35.09.11', nama: 'Mayang' },
          { id: '35.09.12', nama: 'Mumbulsari' },
          { id: '35.09.13', nama: 'Jenggawah' },
          { id: '35.09.14', nama: 'Kencong' },
          { id: '35.09.15', nama: 'Gumukmas' },
          { id: '35.09.16', nama: 'Puger' },
          { id: '35.09.17', nama: 'Puger' },
          { id: '35.09.18', nama: 'Wuluhan' },
          { id: '35.09.19', nama: 'Ambulu' },
          { id: '35.09.20', nama: 'Tempurejo' },
          { id: '35.09.21', nama: 'Tanggul' },
        ]
      },
      {
        id: '35.10', nama: 'Banyuwangi', tipe: 'Kabupaten',
        kecamatan: [
          { id: '35.10.01', nama: 'Pesanggaran' },
          { id: '35.10.02', nama: 'Siliragung' },
          { id: '35.10.03', nama: 'Bangorejo' },
          { id: '35.10.04', nama: 'Purwoharjo' },
          { id: '35.10.05', nama: 'Tegaldlimo' },
          { id: '35.10.06', nama: 'Muncar' },
          { id: '35.10.07', nama: 'Cluring' },
          { id: '35.10.08', nama: 'Gambiran' },
          { id: '35.10.09', nama: 'Srono' },
          { id: '35.10.10', nama: 'Genteng' },
          { id: '35.10.11', nama: 'Glenmore' },
          { id: '35.10.12', nama: 'Kalibaru' },
          { id: '35.10.13', nama: 'Singojuruh' },
          { id: '35.10.14', nama: 'Rogojampi' },
          { id: '35.10.15', nama: 'Kabat' },
          { id: '35.10.16', nama: 'Glagah' },
          { id: '35.10.17', nama: 'Banyuwangi' },
          { id: '35.10.18', nama: 'Giri' },
          { id: '35.10.19', nama: 'Kalipuro' },
          { id: '35.10.20', nama: 'Wongsorejo' },
          { id: '35.10.21', nama: 'Songgon' },
          { id: '35.10.22', nama: 'Sempu' },
          { id: '35.10.23', nama: 'Tegalsari' },
          { id: '35.10.24', nama: 'Blimbingsari' },
          { id: '35.10.25', nama: 'Licin' },
        ]
      },
      {
        id: '35.11', nama: 'Bondowoso', tipe: 'Kabupaten',
        kecamatan: [
          { id: '35.11.01', nama: 'Bondowoso' },
          { id: '35.11.02', nama: 'Curahdami' },
          { id: '35.11.03', nama: 'Binakal' },
          { id: '35.11.04', nama: 'Pakem' },
          { id: '35.11.05', nama: 'Wonosari' },
          { id: '35.11.06', nama: 'Tapen' },
          { id: '35.11.07', nama: 'Wringin' },
          { id: '35.11.08', nama: 'Tegalampel' },
          { id: '35.11.09', nama: 'Tenggarang' },
          { id: '35.11.10', nama: 'Sukosari' },
          { id: '35.11.11', nama: 'Ijen' },
          { id: '35.11.12', nama: 'Sempol' },
          { id: '35.11.13', nama: 'Maesan' },
          { id: '35.11.14', nama: 'Tamanan' },
          { id: '35.11.15', nama: 'Pujer' },
          { id: '35.11.16', nama: 'Tlogosari' },
          { id: '35.11.17', nama: 'Klabang' },
          { id: '35.11.18', nama: 'Prajekan' },
          { id: '35.11.19', nama: 'Cermee' },
          { id: '35.11.20', nama: 'Botolinggo' },
          { id: '35.11.21', nama: 'Grujugan' },
        ]
      },
      {
        id: '35.12', nama: 'Situbondo', tipe: 'Kabupaten',
        kecamatan: [
          { id: '35.12.01', nama: 'Situbondo' },
          { id: '35.12.02', nama: 'Panji' },
          { id: '35.12.03', nama: 'Mangaran' },
          { id: '35.12.04', nama: 'Kapongan' },
          { id: '35.12.05', nama: 'Arjasa' },
          { id: '35.12.06', nama: 'Kendit' },
          { id: '35.12.07', nama: 'Suboh' },
          { id: '35.12.08', nama: 'Mlandingan' },
          { id: '35.12.09', nama: 'Bungatan' },
          { id: '35.12.10', nama: 'Asembagus' },
          { id: '35.12.11', nama: 'Jangkar' },
          { id: '35.12.12', nama: 'Besuki' },
          { id: '35.12.13', nama: 'Banyuglugur' },
          { id: '35.12.14', nama: 'Sumbermalang' },
          { id: '35.12.15', nama: 'Jatibanteng' },
          { id: '35.12.16', nama: 'Banyuputih' },
          { id: '35.12.17', nama: 'Panarukan' },
        ]
      },
      {
        id: '35.13', nama: 'Probolinggo', tipe: 'Kabupaten',
        kecamatan: [
          { id: '35.13.01', nama: 'Tiris' },
          { id: '35.13.02', nama: 'Krucil' },
          { id: '35.13.03', nama: 'Gading' },
          { id: '35.13.04', nama: 'Pakuniran' },
          { id: '35.13.05', nama: 'Paiton' },
          { id: '35.13.06', nama: 'Besuk' },
          { id: '35.13.07', nama: 'Kraksaan' },
          { id: '35.13.08', nama: 'Krejengan' },
          { id: '35.13.09', nama: 'Pajarakan' },
          { id: '35.13.10', nama: 'Maron' },
          { id: '35.13.11', nama: 'Gending' },
          { id: '35.13.12', nama: 'Dringu' },
          { id: '35.13.13', nama: 'Leces' },
          { id: '35.13.14', nama: 'Banyuanyar' },
          { id: '35.13.15', nama: 'Sumberasih' },
          { id: '35.13.16', nama: 'Tongas' },
          { id: '35.13.17', nama: 'Sukapura' },
          { id: '35.13.18', nama: 'Sumber' },
          { id: '35.13.19', nama: 'Lumbang' },
        ]
      },
      {
        id: '35.15', nama: 'Sidoarjo', tipe: 'Kabupaten',
        kecamatan: [
          { id: '35.15.01', nama: 'Sidoarjo' },
          { id: '35.15.02', nama: 'Buduran' },
          { id: '35.15.03', nama: 'Candi' },
          { id: '35.15.04', nama: 'Porong' },
          { id: '35.15.05', nama: 'Krembung' },
          { id: '35.15.06', nama: 'Tulangan' },
          { id: '35.15.07', nama: 'Tanggulangin' },
          { id: '35.15.08', nama: 'Jabon' },
          { id: '35.15.09', nama: 'Krian' },
          { id: '35.15.10', nama: 'Balongbendo' },
          { id: '35.15.11', nama: 'Wonoayu' },
          { id: '35.15.12', nama: 'Tarik' },
          { id: '35.15.13', nama: 'Prambon' },
          { id: '35.15.14', nama: 'Taman' },
          { id: '35.15.15', nama: 'Waru' },
          { id: '35.15.16', nama: 'Gedangan' },
          { id: '35.15.17', nama: 'Sedati' },
          { id: '35.15.18', nama: 'Sukodono' },
        ]
      },
      {
        id: '35.17', nama: 'Jombang', tipe: 'Kabupaten',
        kecamatan: [
          { id: '35.17.01', nama: 'Bandar Kedungmulyo' },
          { id: '35.17.02', nama: 'Perak' },
          { id: '35.17.03', nama: 'Gudo' },
          { id: '35.17.04', nama: 'Diwek' },
          { id: '35.17.05', nama: 'Ngoro' },
          { id: '35.17.06', nama: 'Mojowarno' },
          { id: '35.17.07', nama: 'Bareng' },
          { id: '35.17.08', nama: 'Wonosalam' },
          { id: '35.17.09', nama: 'Mojoagung' },
          { id: '35.17.10', nama: 'Sumobito' },
          { id: '35.17.11', nama: 'Jogoroto' },
          { id: '35.17.12', nama: 'Peterongan' },
          { id: '35.17.13', nama: 'Jombang' },
          { id: '35.17.14', nama: 'Megaluh' },
          { id: '35.17.15', nama: 'Tembelang' },
          { id: '35.17.16', nama: 'Kesamben' },
          { id: '35.17.17', nama: 'Kudu' },
          { id: '35.17.18', nama: 'Ngusikan' },
          { id: '35.17.19', nama: 'Ploso' },
          { id: '35.17.20', nama: 'Kabuh' },
          { id: '35.17.21', nama: 'Plandaan' },
        ]
      },
      {
        id: '35.22', nama: 'Bojonegoro', tipe: 'Kabupaten',
        kecamatan: [
          { id: '35.22.01', nama: 'Margomulyo' },
          { id: '35.22.02', nama: 'Ngraho' },
          { id: '35.22.03', nama: 'Tambakrejo' },
          { id: '35.22.04', nama: 'Ngasem' },
          { id: '35.22.05', nama: 'Gondang' },
          { id: '35.22.06', nama: 'Temayang' },
          { id: '35.22.07', nama: 'Sugihwaras' },
          { id: '35.22.09', nama: 'Kedungadem' },
          { id: '35.22.10', nama: 'Kepohbaru' },
          { id: '35.22.11', nama: 'Baureno' },
          { id: '35.22.12', nama: 'Kanor' },
          { id: '35.22.13', nama: 'Sumberrejo' },
          { id: '35.22.14', nama: 'Balen' },
          { id: '35.22.15', nama: 'Kapas' },
          { id: '35.22.16', nama: 'Bojonegoro' },
          { id: '35.22.17', nama: 'Trucuk' },
          { id: '35.22.18', nama: 'Dander' },
          { id: '35.22.19', nama: 'Kalitidu' },
          { id: '35.22.20', nama: 'Malo' },
          { id: '35.22.21', nama: 'Purwosari' },
          { id: '35.22.22', nama: 'Padangan' },
          { id: '35.22.23', nama: 'Kasiman' },
          { id: '35.22.24', nama: 'Kedewan' },
        ]
      },
      {
        id: '35.25', nama: 'Gresik', tipe: 'Kabupaten',
        kecamatan: [
          { id: '35.25.01', nama: 'Wringinanom' },
          { id: '35.25.02', nama: 'Driyorejo' },
          { id: '35.25.03', nama: 'Kedamean' },
          { id: '35.25.04', nama: 'Menganti' },
          { id: '35.25.05', nama: 'Cerme' },
          { id: '35.25.06', nama: 'Benjeng' },
          { id: '35.25.07', nama: 'Balongpanggang' },
          { id: '35.25.08', nama: 'Duduksampeyan' },
          { id: '35.25.09', nama: 'Kebomas' },
          { id: '35.25.10', nama: 'Gresik' },
          { id: '35.25.11', nama: 'Manyar' },
          { id: '35.25.12', nama: 'Bungah' },
          { id: '35.25.13', nama: 'Sidayu' },
          { id: '35.25.14', nama: 'Dukun' },
          { id: '35.25.15', nama: 'Panceng' },
          { id: '35.25.16', nama: 'Ujungpangkah' },
          { id: '35.25.17', nama: 'Sangkapura' },
          { id: '35.25.18', nama: 'Tambak' },
        ]
      },
      {
        id: '35.71', nama: 'Surabaya', tipe: 'Kota',
        kecamatan: [
          { id: '35.71.01', nama: 'Asemrowo' },
          { id: '35.71.02', nama: 'Benowo' },
          { id: '35.71.03', nama: 'Bubutan' },
          { id: '35.71.04', nama: 'Bulak' },
          { id: '35.71.05', nama: 'Dukuh Pakis' },
          { id: '35.71.06', nama: 'Gayungan' },
          { id: '35.71.07', nama: 'Genteng' },
          { id: '35.71.08', nama: 'Gubeng' },
          { id: '35.71.09', nama: 'Gunung Anyar' },
          { id: '35.71.10', nama: 'Jambangan' },
          { id: '35.71.11', nama: 'Karang Pilang' },
          { id: '35.71.12', nama: 'Kenjeran' },
          { id: '35.71.13', nama: 'Krembangan' },
          { id: '35.71.14', nama: 'Lakarsantri' },
          { id: '35.71.15', nama: 'Mulyorejo' },
          { id: '35.71.16', nama: 'Pabean Cantikan' },
          { id: '35.71.17', nama: 'Pakal' },
          { id: '35.71.18', nama: 'Rungkut' },
          { id: '35.71.19', nama: 'Sambikerep' },
          { id: '35.71.20', nama: 'Sawahan' },
          { id: '35.71.21', nama: 'Semampir' },
          { id: '35.71.22', nama: 'Simokerto' },
          { id: '35.71.23', nama: 'Sukolilo' },
          { id: '35.71.24', nama: 'Sukomanunggal' },
          { id: '35.71.25', nama: 'Tambaksari' },
          { id: '35.71.26', nama: 'Tandes' },
          { id: '35.71.27', nama: 'Tegalsari' },
          { id: '35.71.28', nama: 'Tenggilis Mejoyo' },
          { id: '35.71.29', nama: 'Wiyung' },
          { id: '35.71.30', nama: 'Wonocolo' },
          { id: '35.71.31', nama: 'Wonokromo' },
        ]
      },
      {
        id: '35.72', nama: 'Malang', tipe: 'Kota',
        kecamatan: [
          { id: '35.72.01', nama: 'Kedungkandang' },
          { id: '35.72.02', nama: 'Sukun' },
          { id: '35.72.03', nama: 'Klojen' },
          { id: '35.72.04', nama: 'Blimbing' },
          { id: '35.72.05', nama: 'Lowokwaru' },
        ]
      },
    ]
  },
  {
    id: '36',
    nama: 'Banten',
    kabupatenKota: [
      {
        id: '36.71', nama: 'Tangerang', tipe: 'Kota',
        kecamatan: [
          { id: '36.71.01', nama: 'Batuceper' },
          { id: '36.71.02', nama: 'Benda' },
          { id: '36.71.03', nama: 'Cibodas' },
          { id: '36.71.04', nama: 'Ciledug' },
          { id: '36.71.05', nama: 'Cipondoh' },
          { id: '36.71.06', nama: 'Jatiuwung' },
          { id: '36.71.07', nama: 'Karang Tengah' },
          { id: '36.71.08', nama: 'Karawaci' },
          { id: '36.71.09', nama: 'Larangan' },
          { id: '36.71.10', nama: 'Neglasari' },
          { id: '36.71.11', nama: 'Periuk' },
          { id: '36.71.12', nama: 'Pinang' },
          { id: '36.71.13', nama: 'Tangerang' },
        ]
      },
    ]
  },
  {
    id: '51',
    nama: 'Bali',
    kabupatenKota: [
      {
        id: '51.71', nama: 'Denpasar', tipe: 'Kota',
        kecamatan: [
          { id: '51.71.01', nama: 'Denpasar Barat' },
          { id: '51.71.02', nama: 'Denpasar Selatan' },
          { id: '51.71.03', nama: 'Denpasar Timur' },
          { id: '51.71.04', nama: 'Denpasar Utara' },
        ]
      },
      {
        id: '51.02', nama: 'Badung', tipe: 'Kabupaten',
        kecamatan: [
          { id: '51.02.01', nama: 'Kuta Selatan' },
          { id: '51.02.02', nama: 'Kuta' },
          { id: '51.02.03', nama: 'Kuta Utara' },
          { id: '51.02.04', nama: 'Mengwi' },
          { id: '51.02.05', nama: 'Abiansemal' },
          { id: '51.02.06', nama: 'Petang' },
        ]
      },
    ]
  },
  {
    id: '52',
    nama: 'Nusa Tenggara Barat',
    kabupatenKota: [
      {
        id: '52.71', nama: 'Mataram', tipe: 'Kota',
        kecamatan: [
          { id: '52.71.01', nama: 'Ampenan' },
          { id: '52.71.02', nama: 'Cakranegara' },
          { id: '52.71.03', nama: 'Mataram' },
          { id: '52.71.04', nama: 'Sandubaya' },
          { id: '52.71.05', nama: 'Sekarbela' },
          { id: '52.71.06', nama: 'Selaparang' },
        ]
      },
    ]
  },
  {
    id: '53',
    nama: 'Nusa Tenggara Timur',
    kabupatenKota: [
      {
        id: '53.71', nama: 'Kupang', tipe: 'Kota',
        kecamatan: [
          { id: '53.71.01', nama: 'Alak' },
          { id: '53.71.02', nama: 'Kelapa Lima' },
          { id: '53.71.03', nama: 'Kota Lama' },
          { id: '53.71.04', nama: 'Kota Raja' },
          { id: '53.71.05', nama: 'Maulafa' },
          { id: '53.71.06', nama: 'Oebobo' },
        ]
      },
    ]
  },
  {
    id: '61',
    nama: 'Kalimantan Barat',
    kabupatenKota: [
      {
        id: '61.71', nama: 'Pontianak', tipe: 'Kota',
        kecamatan: [
          { id: '61.71.01', nama: 'Pontianak Barat' },
          { id: '61.71.02', nama: 'Pontianak Kota' },
          { id: '61.71.03', nama: 'Pontianak Selatan' },
          { id: '61.71.04', nama: 'Pontianak Tenggara' },
          { id: '61.71.05', nama: 'Pontianak Timur' },
          { id: '61.71.06', nama: 'Pontianak Utara' },
        ]
      },
    ]
  },
  {
    id: '63',
    nama: 'Kalimantan Selatan',
    kabupatenKota: [
      {
        id: '63.71', nama: 'Banjarmasin', tipe: 'Kota',
        kecamatan: [
          { id: '63.71.01', nama: 'Banjarmasin Barat' },
          { id: '63.71.02', nama: 'Banjarmasin Selatan' },
          { id: '63.71.03', nama: 'Banjarmasin Tengah' },
          { id: '63.71.04', nama: 'Banjarmasin Timur' },
          { id: '63.71.05', nama: 'Banjarmasin Utara' },
        ]
      },
    ]
  },
  {
    id: '64',
    nama: 'Kalimantan Timur',
    kabupatenKota: [
      {
        id: '64.72', nama: 'Samarinda', tipe: 'Kota',
        kecamatan: [
          { id: '64.72.01', nama: 'Palaran' },
          { id: '64.72.02', nama: 'Samarinda Ilir' },
          { id: '64.72.03', nama: 'Samarinda Kota' },
          { id: '64.72.04', nama: 'Samarinda Seberang' },
          { id: '64.72.05', nama: 'Samarinda Ulu' },
          { id: '64.72.06', nama: 'Samarinda Utara' },
          { id: '64.72.07', nama: 'Sambutan' },
          { id: '64.72.08', nama: 'Sungai Kunjang' },
          { id: '64.72.09', nama: 'Loa Janan Ilir' },
          { id: '64.72.10', nama: 'Sungai Pinang' },
        ]
      },
    ]
  },
  {
    id: '71',
    nama: 'Sulawesi Utara',
    kabupatenKota: [
      {
        id: '71.71', nama: 'Manado', tipe: 'Kota',
        kecamatan: [
          { id: '71.71.01', nama: 'Bunaken' },
          { id: '71.71.02', nama: 'Malalayang' },
          { id: '71.71.03', nama: 'Mapanget' },
          { id: '71.71.04', nama: 'Paal Dua' },
          { id: '71.71.05', nama: 'Singkil' },
          { id: '71.71.06', nama: 'Sario' },
          { id: '71.71.07', nama: 'Tikala' },
          { id: '71.71.08', nama: 'Tuminting' },
          { id: '71.71.09', nama: 'Wanea' },
          { id: '71.71.10', nama: 'Wenang' },
        ]
      },
    ]
  },
  {
    id: '73',
    nama: 'Sulawesi Selatan',
    kabupatenKota: [
      {
        id: '73.71', nama: 'Makassar', tipe: 'Kota',
        kecamatan: [
          { id: '73.71.01', nama: 'Biringkanaya' },
          { id: '73.71.02', nama: 'Bontoala' },
          { id: '73.71.03', nama: 'Makassar' },
          { id: '73.71.04', nama: 'Mamajang' },
          { id: '73.71.05', nama: 'Manggala' },
          { id: '73.71.06', nama: 'Mariso' },
          { id: '73.71.07', nama: 'Panakkukang' },
          { id: '73.71.08', nama: 'Rappocini' },
          { id: '73.71.09', nama: 'Tallo' },
          { id: '73.71.10', nama: 'Tamalanrea' },
          { id: '73.71.11', nama: 'Tamalate' },
          { id: '73.71.12', nama: 'Ujung Pandang' },
          { id: '73.71.13', nama: 'Ujung Tanah' },
          { id: '73.71.14', nama: 'Wajo' },
        ]
      },
    ]
  },
  {
    id: '91',
    nama: 'Papua Barat',
    kabupatenKota: [
      {
        id: '91.71', nama: 'Sorong', tipe: 'Kota',
        kecamatan: [
          { id: '91.71.01', nama: 'Sorong Barat' },
          { id: '91.71.02', nama: 'Sorong Kepulauan' },
          { id: '91.71.03', nama: 'Sorong Kota' },
          { id: '91.71.04', nama: 'Sorong Manoi' },
          { id: '91.71.05', nama: 'Sorong Timur' },
          { id: '91.71.06', nama: 'Sorong Utara' },
        ]
      },
    ]
  },
  {
    id: '94',
    nama: 'Papua',
    kabupatenKota: [
      {
        id: '94.71', nama: 'Jayapura', tipe: 'Kota',
        kecamatan: [
          { id: '94.71.01', nama: 'Abepura' },
          { id: '94.71.02', nama: 'Heram' },
          { id: '94.71.03', nama: 'Jayapura Selatan' },
          { id: '94.71.04', nama: 'Jayapura Utara' },
          { id: '94.71.05', nama: 'Muara Tami' },
        ]
      },
    ]
  },
];

// Helper functions
export const getKabupatenByProvinsi = (provinsiId: string): KabupatenKota[] => {
  const provinsi = dataWilayahIndonesia.find(p => p.id === provinsiId);
  return provinsi ? provinsi.kabupatenKota : [];
};

export const getKecamatanByKabupaten = (provinsiId: string, kabupatenId: string): Kecamatan[] => {
  const provinsi = dataWilayahIndonesia.find(p => p.id === provinsiId);
  if (!provinsi) return [];
  const kabupaten = provinsi.kabupatenKota.find(k => k.id === kabupatenId);
  return kabupaten ? kabupaten.kecamatan : [];
};

export const getNamaProvinsi = (provinsiId: string): string => {
  const provinsi = dataWilayahIndonesia.find(p => p.id === provinsiId);
  return provinsi ? provinsi.nama : '';
};

export const getNamaKabupaten = (provinsiId: string, kabupatenId: string): string => {
  const provinsi = dataWilayahIndonesia.find(p => p.id === provinsiId);
  if (!provinsi) return '';
  const kabupaten = provinsi.kabupatenKota.find(k => k.id === kabupatenId);
  return kabupaten ? `${kabupaten.tipe} ${kabupaten.nama}` : '';
};

export const getNamaKecamatan = (provinsiId: string, kabupatenId: string, kecamatanId: string): string => {
  const kecamatanList = getKecamatanByKabupaten(provinsiId, kabupatenId);
  const kecamatan = kecamatanList.find(k => k.id === kecamatanId);
  return kecamatan ? kecamatan.nama : '';
};
