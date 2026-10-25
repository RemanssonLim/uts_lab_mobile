import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import InfoCard, { type StatusTugas } from './src/components/InfoCard';
import MahasiswaItem from './src/components/MahasiswaItem';
import { DAFTAR_MAHASISWA } from './src/data/mahasiswa';
import { warna } from './src/theme/warna';

export default function App() {
  const { width } = useWindowDimensions();
  const tampilanLebar = width >= 820;

  const [keyword, setKeyword] = useState('');
  const [detail, setDetail] = useState<{ judul: string; status: StatusTugas } | null>(null);
  const [panelPengumpulan, setPanelPengumpulan] = useState(false);
  const [tugasPengumpulan, setTugasPengumpulan] = useState<'Jobsheet 02' | 'Jobsheet 03'>(
    'Jobsheet 03',
  );

  const animasiMasuk = useRef(new Animated.Value(0)).current;
  const animasiDetail = useRef(new Animated.Value(0)).current;
  const animasiPanel = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animasiMasuk, {
      toValue: 1,
      duration: 520,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [animasiMasuk]);

  useEffect(() => {
    if (detail) {
      animasiDetail.setValue(0);
      Animated.spring(animasiDetail, {
        toValue: 1,
        friction: 9,
        tension: 70,
        useNativeDriver: true,
      }).start();
    }
  }, [animasiDetail, detail]);

  useEffect(() => {
    if (panelPengumpulan) {
      animasiPanel.setValue(0);
      Animated.spring(animasiPanel, {
        toValue: 1,
        friction: 9,
        tension: 70,
        useNativeDriver: true,
      }).start();
    }
  }, [animasiPanel, panelPengumpulan]);

  const hasilPencarian = useMemo(() => {
    const kataKunci = keyword.toLowerCase().trim();

    if (!kataKunci) {
      return DAFTAR_MAHASISWA;
    }

    return DAFTAR_MAHASISWA.filter((mahasiswa) =>
      mahasiswa.nama.toLowerCase().includes(kataKunci),
    );
  }, [keyword]);

  const tampilkanDetail = (judul: string, status: StatusTugas) => {
    setDetail({ judul, status });
  };

  const tutupDetail = () => {
    Animated.timing(animasiDetail, {
      toValue: 0,
      duration: 200,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(() => setDetail(null));
  };

  const bukaPanel = () => {
    setTugasPengumpulan('Jobsheet 03');
    setPanelPengumpulan(true);
  };

  const tutupPanel = () => {
    Animated.timing(animasiPanel, {
      toValue: 0,
      duration: 200,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(() => setPanelPengumpulan(false));
  };

  const detailSelesai = detail?.status === 'selesai';
  const warnaDetail = detailSelesai ? warna.hijau : warna.oranye;
  const latarDetail = detailSelesai ? warna.hijauMuda : warna.oranyeMuda;

  const geserMasuk = animasiMasuk.interpolate({
    inputRange: [0, 1],
    outputRange: [14, 0],
  });
  const geserDetail = animasiDetail.interpolate({
    inputRange: [0, 1],
    outputRange: [48, 0],
  });
  const geserPanel = animasiPanel.interpolate({
    inputRange: [0, 1],
    outputRange: [tampilanLebar ? 460 : 560, 0],
  });
  const gayaPanel = tampilanLebar
    ? { transform: [{ translateX: geserPanel }] }
    : { transform: [{ translateY: geserPanel }] };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.areaAman} edges={['top', 'left', 'right']}>
        <StatusBar style="dark" />

        <View style={[styles.wadah, tampilanLebar && styles.wadahLebar]}>
          <Animated.View
            style={[
              styles.animasiKonten,
              { opacity: animasiMasuk, transform: [{ translateY: geserMasuk }] },
            ]}
          >
            <FlatList
              key={tampilanLebar ? 'kisi' : 'daftar'}
              data={hasilPencarian}
              keyExtractor={(item) => item.id}
              numColumns={tampilanLebar ? 2 : 1}
              columnWrapperStyle={tampilanLebar ? styles.kolomKisi : undefined}
              renderItem={({ item }) => (
                <View style={tampilanLebar ? styles.itemKisi : undefined}>
                  <MahasiswaItem mahasiswa={item} />
                </View>
              )}
              ItemSeparatorComponent={() => <View style={styles.pemisah} />}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={[styles.konten, tampilanLebar && styles.kontenLebar]}
              testID="daftar-mahasiswa"
              ListHeaderComponent={
                <View>
                  <View style={styles.bilahAtas}>
                    <View style={styles.merek}>
                      <View style={styles.logo}>
                        <Text style={styles.logoTeks}>RM</Text>
                      </View>
                      <View>
                        <Text style={styles.merekNama}>Ruang Mahasiswa</Text>
                        <Text style={styles.merekSub}>Lab. Pemrograman Mobile</Text>
                      </View>
                    </View>

                    <View style={styles.aksiAtas}>
                      {tampilanLebar && (
                        <TouchableOpacity
                          style={styles.tombolPengumpulan}
                          activeOpacity={0.75}
                          onPress={bukaPanel}
                          accessibilityRole="button"
                          accessibilityLabel="Buka halaman pengumpulan"
                        >
                          <View style={styles.ikonUnggah}>
                            <Text style={styles.ikonUnggahTeks}>↑</Text>
                          </View>
                          <Text style={styles.tombolPengumpulanTeks}>Pengumpulan</Text>
                        </TouchableOpacity>
                      )}

                      <TouchableOpacity
                        style={styles.profil}
                        activeOpacity={0.75}
                        onPress={bukaPanel}
                        accessibilityRole="button"
                        accessibilityLabel="Buka halaman pengumpulan"
                      >
                        <Text style={styles.profilTeks}>R</Text>
                        <View style={styles.profilDot} />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={[styles.hero, tampilanLebar && styles.heroLebar]}>
                    <View style={styles.lingkaranBesar} />
                    {!tampilanLebar && <View style={styles.lingkaranKecil} />}

                    <View style={tampilanLebar ? styles.heroIsiLebar : undefined}>
                      <View style={styles.heroKiri}>
                        <Text style={styles.heroLabel}>SEMESTER III · 2026/2027</Text>
                        <Text
                          style={[styles.heroJudul, tampilanLebar && styles.heroJudulLebar]}
                        >
                          Aktivitas Praktikum
                        </Text>
                        <Text style={[styles.heroTeks, tampilanLebar && styles.heroTeksLebar]}>
                          Pantau tugas dan temukan data mahasiswa dengan cepat.
                        </Text>
                      </View>

                      <View
                        style={[
                          styles.heroStatBaris,
                          tampilanLebar && styles.heroStatBarisLebar,
                        ]}
                      >
                        <View style={styles.heroStat}>
                          <Text style={styles.heroStatAngka}>2</Text>
                          <Text style={styles.heroStatLabel}>Tugas</Text>
                        </View>
                        <View style={styles.heroStatGaris} />
                        <View style={styles.heroStat}>
                          <Text style={styles.heroStatAngka}>{DAFTAR_MAHASISWA.length}</Text>
                          <Text style={styles.heroStatLabel}>Mahasiswa</Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  <View style={styles.seksiHeader}>
                    <View>
                      <Text style={styles.seksiJudul}>Tugas Praktikum</Text>
                      {tampilanLebar && (
                        <Text style={styles.seksiSub}>Dua tugas aktif semester ini.</Text>
                      )}
                    </View>
                    <View style={styles.seksiBadge}>
                      <Text style={styles.seksiBadgeTeks}>2 item</Text>
                    </View>
                  </View>

                  <View
                    style={[styles.daftarKartu, tampilanLebar && styles.daftarKartuLebar]}
                  >
                    <View style={tampilanLebar ? styles.kartuKolom : undefined}>
                      <InfoCard
                        title="Jobsheet 02 — Layout & Styling"
                        status="selesai"
                        onPress={() =>
                          tampilkanDetail('Jobsheet 02 — Layout & Styling', 'selesai')
                        }
                      />
                    </View>
                    <View style={tampilanLebar ? styles.kartuKolom : undefined}>
                      <InfoCard
                        title="Jobsheet 03 — State & Interaksi"
                        status="proses"
                        onPress={() =>
                          tampilkanDetail('Jobsheet 03 — State & Interaksi', 'proses')
                        }
                      />
                    </View>
                  </View>

                  <View style={styles.headerDirektori}>
                    <View style={styles.judulDirektori}>
                      <Text style={styles.seksiJudul}>Direktori Mahasiswa</Text>
                      <Text style={styles.subDirektori}>Cari berdasarkan nama mahasiswa.</Text>
                    </View>
                    <Text style={styles.jumlahData}>{hasilPencarian.length} data</Text>
                  </View>

                  <View
                    style={[
                      styles.kotakPencarian,
                      tampilanLebar && styles.kotakPencarianLebar,
                    ]}
                  >
                    <View style={styles.ikonPencarian}>
                      <View style={styles.lingkaranPencarian} />
                      <View style={styles.gagangPencarian} />
                    </View>

                    <TextInput
                      style={styles.input}
                      value={keyword}
                      onChangeText={setKeyword}
                      placeholder="Cari nama mahasiswa"
                      placeholderTextColor={warna.redup}
                      autoCapitalize="none"
                      autoCorrect={false}
                      returnKeyType="search"
                      selectionColor={warna.biru}
                      accessibilityLabel="Kolom pencarian mahasiswa"
                      testID="input-pencarian"
                    />

                    {keyword.length > 0 && (
                      <TouchableOpacity
                        style={styles.hapus}
                        onPress={() => setKeyword('')}
                        activeOpacity={0.7}
                        accessibilityRole="button"
                        accessibilityLabel="Hapus pencarian"
                      >
                        <Text style={styles.hapusTeks}>×</Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  <View style={styles.jarakDaftar} />
                </View>
              }
              ListEmptyComponent={
                <View style={styles.kosong}>
                  <Text style={styles.kosongJudul}>Data tidak ditemukan!</Text>
                  <Text style={styles.kosongTeks}>Periksa kembali kata kunci pencarian.</Text>
                </View>
              }
              ListFooterComponent={
                <Text style={styles.catatan}>
                  Data mahasiswa ditampilkan dari penyimpanan lokal.
                </Text>
              }
            />
          </Animated.View>
        </View>

        <Modal
          visible={detail !== null}
          transparent
          animationType="none"
          onRequestClose={tutupDetail}
          statusBarTranslucent
        >
          <View style={styles.lapisan}>
            <Animated.View style={[styles.lapisanLatar, { opacity: animasiDetail }]}>
              <TouchableOpacity
                style={StyleSheet.absoluteFill}
                activeOpacity={1}
                onPress={tutupDetail}
                accessibilityRole="button"
                accessibilityLabel="Tutup detail tugas"
              />
            </Animated.View>

            <Animated.View
              style={[
                styles.lembar,
                {
                  opacity: animasiDetail,
                  transform: [{ translateY: geserDetail }],
                },
              ]}
            >
              <View style={styles.pegangan} />

              <View style={styles.lembarAtas}>
                <Text style={styles.lembarLabel}>DETAIL TUGAS</Text>
                <TouchableOpacity
                  style={styles.tutup}
                  activeOpacity={0.7}
                  onPress={tutupDetail}
                  accessibilityRole="button"
                  accessibilityLabel="Tutup"
                >
                  <Text style={styles.tutupTeks}>×</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.lembarJudul}>{detail?.judul}</Text>

              <View style={styles.lembarBaris}>
                <View style={[styles.lembarBadge, { backgroundColor: latarDetail }]}>
                  <View style={[styles.lembarTitik, { backgroundColor: warnaDetail }]} />
                  <Text style={[styles.lembarBadgeTeks, { color: warnaDetail }]}>
                    {detailSelesai ? 'Selesai' : 'Proses'}
                  </Text>
                </View>
                <Text style={styles.lembarMeta}>Lab. Pemrograman Mobile</Text>
              </View>

              <Text style={styles.lembarTeks}>
                {detailSelesai
                  ? 'Tugas ini sudah dikerjakan dan siap untuk dikumpulkan.'
                  : 'Tugas ini masih dalam pengerjaan. Periksa kembali kelengkapan sebelum dikumpulkan.'}
              </Text>

              <TouchableOpacity
                style={styles.lembarTombol}
                activeOpacity={0.8}
                onPress={tutupDetail}
                accessibilityRole="button"
                accessibilityLabel="Tutup detail"
              >
                <Text style={styles.lembarTombolTeks}>Tutup</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Modal>

        <Modal
          visible={panelPengumpulan}
          transparent
          animationType="none"
          onRequestClose={tutupPanel}
          statusBarTranslucent
        >
          <View style={styles.panelLapisan}>
            <Animated.View style={[styles.panelLatar, { opacity: animasiPanel }]}>
              <TouchableOpacity
                style={StyleSheet.absoluteFill}
                activeOpacity={1}
                onPress={tutupPanel}
                accessibilityRole="button"
                accessibilityLabel="Tutup pengumpulan"
              />
            </Animated.View>

            <Animated.View
              style={[
                styles.panel,
                tampilanLebar ? styles.panelLebar : styles.panelPonsel,
                gayaPanel,
              ]}
            >
              {!tampilanLebar && <View style={styles.pegangan} />}

              <View style={styles.panelHeader}>
                <View style={styles.panelHeaderKiri}>
                  <Text style={styles.panelLabel}>PENGUMPULAN TUGAS</Text>
                  <Text style={styles.panelJudul}>Kirim hasil praktikum</Text>
                </View>
                <TouchableOpacity
                  style={styles.tutup}
                  activeOpacity={0.7}
                  onPress={tutupPanel}
                  accessibilityRole="button"
                  accessibilityLabel="Tutup"
                >
                  <Text style={styles.tutupTeks}>×</Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                style={tampilanLebar ? styles.panelScrollLebar : styles.panelScrollPonsel}
                contentContainerStyle={[
                  styles.panelKonten,
                  tampilanLebar && styles.panelKontenLebar,
                ]}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                <Text style={styles.panelTeks}>
                  Lampirkan satu tautan hasil pekerjaan.
                </Text>

                    <Text style={styles.labelField}>Tugas</Text>
                    <View style={styles.pilihanTugas}>
                      <TouchableOpacity
                        style={[
                          styles.pilihan,
                          tugasPengumpulan === 'Jobsheet 02' && styles.pilihanAktif,
                        ]}
                        activeOpacity={0.8}
                        onPress={() => setTugasPengumpulan('Jobsheet 02')}
                        accessibilityRole="button"
                        accessibilityState={{
                          selected: tugasPengumpulan === 'Jobsheet 02',
                        }}
                        accessibilityLabel="Pilih Jobsheet 02"
                      >
                        <View
                          style={
                            tugasPengumpulan === 'Jobsheet 02'
                              ? styles.pilihanTitik
                              : styles.pilihanTitikKosong
                          }
                        />
                        <Text
                          style={
                            tugasPengumpulan === 'Jobsheet 02'
                              ? styles.pilihanTeksAktif
                              : styles.pilihanTeks
                          }
                        >
                          Jobsheet 02
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.pilihan,
                          tugasPengumpulan === 'Jobsheet 03' && styles.pilihanAktif,
                        ]}
                        activeOpacity={0.8}
                        onPress={() => setTugasPengumpulan('Jobsheet 03')}
                        accessibilityRole="button"
                        accessibilityState={{
                          selected: tugasPengumpulan === 'Jobsheet 03',
                        }}
                        accessibilityLabel="Pilih Jobsheet 03"
                      >
                        <View
                          style={
                            tugasPengumpulan === 'Jobsheet 03'
                              ? styles.pilihanTitik
                              : styles.pilihanTitikKosong
                          }
                        />
                        <Text
                          style={
                            tugasPengumpulan === 'Jobsheet 03'
                              ? styles.pilihanTeksAktif
                              : styles.pilihanTeks
                          }
                        >
                          Jobsheet 03
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.barisField}>
                      <View style={styles.fieldSetengah}>
                        <Text style={styles.labelField}>Nama</Text>
                        <TextInput
                          style={styles.inputField}
                          defaultValue="Remansson"
                          selectionColor={warna.biru}
                          accessibilityLabel="Nama mahasiswa"
                        />
                      </View>
                      <View style={styles.fieldSetengah}>
                        <Text style={styles.labelField}>NIM</Text>
                        <TextInput
                          style={styles.inputField}
                          defaultValue="2532001"
                          selectionColor={warna.biru}
                          accessibilityLabel="NIM mahasiswa"
                        />
                      </View>
                    </View>

                    <Text style={styles.labelField}>Tautan pengumpulan</Text>
                    <TextInput
                      style={styles.inputField}
                      placeholder="https://drive.google.com/..."
                      placeholderTextColor={warna.redup}
                      autoCapitalize="none"
                      autoCorrect={false}
                      selectionColor={warna.biru}
                      accessibilityLabel="Tautan pengumpulan"
                    />

                    <View style={styles.panelInfo}>
                      <Text style={styles.panelInfoTeks}>
                        Cukup satu tautan. Tidak perlu mengunggah berkas.
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={styles.panelTombol}
                      activeOpacity={0.8}
                      onPress={tutupPanel}
                      accessibilityRole="button"
                      accessibilityLabel="Kirim pengumpulan"
                    >
                      <Text style={styles.panelTombolTeks}>Kirim Pengumpulan</Text>
                      <Text style={styles.panelTombolPanah}>→</Text>
                    </TouchableOpacity>

                <Text style={styles.panelFooter}>
                  Pastikan tautan dapat diakses oleh dosen.
                </Text>
              </ScrollView>
            </Animated.View>
          </View>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  areaAman: {
    flex: 1,
    backgroundColor: warna.latar,
  },
  wadah: {
    flex: 1,
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
  },
  wadahLebar: {
    maxWidth: 1120,
  },
  animasiKonten: {
    flex: 1,
  },
  konten: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 36,
  },
  kontenLebar: {
    paddingHorizontal: 28,
    paddingTop: 16,
    paddingBottom: 36,
  },
  bilahAtas: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  merek: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: warna.biru,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoTeks: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.4,
    color: warna.permukaan,
  },
  merekNama: {
    fontSize: 14,
    fontWeight: '700',
    color: warna.tinta,
  },
  merekSub: {
    marginTop: 2,
    fontSize: 11,
    color: warna.redup,
  },
  aksiAtas: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tombolPengumpulan: {
    height: 38,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: warna.garis,
    backgroundColor: warna.permukaan,
  },
  ikonUnggah: {
    width: 22,
    height: 22,
    borderRadius: 7,
    backgroundColor: warna.biruMuda,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ikonUnggahTeks: {
    fontSize: 13,
    lineHeight: 15,
    fontWeight: '800',
    color: warna.biru,
  },
  tombolPengumpulanTeks: {
    fontSize: 11.5,
    fontWeight: '700',
    color: warna.tinta,
  },
  profil: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: warna.garis,
    backgroundColor: warna.permukaan,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profilTeks: {
    fontSize: 13,
    fontWeight: '700',
    color: warna.biru,
  },
  profilDot: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 9,
    height: 9,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: warna.permukaan,
    backgroundColor: warna.hijau,
  },
  hero: {
    marginTop: 18,
    borderRadius: 18,
    backgroundColor: warna.biruTua,
    padding: 22,
    overflow: 'hidden',
  },
  heroLebar: {
    padding: 24,
  },
  heroIsiLebar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  heroKiri: {
    flexShrink: 1,
  },
  lingkaranBesar: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: '#173F86',
    top: -70,
    right: -50,
  },
  lingkaranKecil: {
    position: 'absolute',
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#1D4A98',
    bottom: -42,
    right: 54,
  },
  heroLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: '#A9BEE8',
  },
  heroJudul: {
    marginTop: 8,
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.4,
    color: warna.permukaan,
  },
  heroJudulLebar: {
    marginTop: 8,
    fontSize: 28,
    lineHeight: 34,
  },
  heroTeks: {
    marginTop: 6,
    maxWidth: 250,
    fontSize: 12.5,
    lineHeight: 18,
    color: '#C9D6EE',
  },
  heroTeksLebar: {
    maxWidth: 470,
    fontSize: 13.5,
    lineHeight: 19,
  },
  heroStatBaris: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  heroStatBarisLebar: {
    marginTop: 0,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    gap: 20,
  },
  heroStat: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  heroStatAngka: {
    fontSize: 18,
    fontWeight: '700',
    color: warna.permukaan,
  },
  heroStatLabel: {
    fontSize: 11,
    color: '#A9BEE8',
  },
  heroStatGaris: {
    width: 1,
    height: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
  },
  seksiHeader: {
    marginTop: 20,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  seksiJudul: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
    color: warna.tinta,
  },
  seksiSub: {
    marginTop: 3,
    fontSize: 11,
    color: warna.redup,
  },
  seksiBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: '#E9EDF5',
  },
  seksiBadgeTeks: {
    fontSize: 10.5,
    fontWeight: '600',
    color: warna.redup,
  },
  daftarKartu: {
    gap: 12,
  },
  daftarKartuLebar: {
    flexDirection: 'row',
    gap: 14,
  },
  kartuKolom: {
    flex: 1,
  },
  headerDirektori: {
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  judulDirektori: {
    flex: 1,
  },
  subDirektori: {
    marginTop: 4,
    fontSize: 11,
    color: warna.redup,
  },
  jumlahData: {
    marginLeft: 12,
    fontSize: 11,
    fontWeight: '600',
    color: warna.biru,
    paddingBottom: 2,
  },
  kotakPencarian: {
    marginTop: 10,
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: warna.garis,
    backgroundColor: warna.permukaan,
  },
  kotakPencarianLebar: {
    maxWidth: 420,
  },
  ikonPencarian: {
    width: 18,
    height: 18,
    marginRight: 10,
  },
  lingkaranPencarian: {
    position: 'absolute',
    top: 1,
    left: 1,
    width: 11,
    height: 11,
    borderRadius: 6,
    borderWidth: 1.8,
    borderColor: warna.redup,
  },
  gagangPencarian: {
    position: 'absolute',
    right: 1,
    bottom: 1,
    width: 2,
    height: 6,
    borderRadius: 1,
    backgroundColor: warna.redup,
    transform: [{ rotate: '-45deg' }],
  },
  input: {
    flex: 1,
    fontSize: 13,
    color: warna.tinta,
    paddingVertical: 0,
  },
  hapus: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EEF2F8',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  hapusTeks: {
    fontSize: 16,
    lineHeight: 18,
    color: warna.redup,
  },
  jarakDaftar: {
    height: 10,
  },
  kolomKisi: {
    gap: 12,
  },
  itemKisi: {
    flex: 1,
  },
  pemisah: {
    height: 8,
  },
  kosong: {
    marginTop: 4,
    paddingVertical: 34,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#D4DDEA',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    alignItems: 'center',
  },
  kosongJudul: {
    fontSize: 14,
    fontWeight: '700',
    color: warna.tinta,
  },
  kosongTeks: {
    marginTop: 5,
    fontSize: 11.5,
    color: warna.redup,
    textAlign: 'center',
  },
  catatan: {
    marginTop: 20,
    fontSize: 10.5,
    color: warna.redup,
    textAlign: 'center',
  },
  lapisan: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  lapisanLatar: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },
  lembar: {
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
    backgroundColor: warna.permukaan,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 30,
  },
  pegangan: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D8E0EB',
    alignSelf: 'center',
    marginBottom: 18,
  },
  lembarAtas: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lembarLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.1,
    color: warna.redup,
  },
  tutup: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tutupTeks: {
    fontSize: 18,
    lineHeight: 20,
    color: warna.redup,
  },
  lembarJudul: {
    marginTop: 12,
    fontSize: 20,
    lineHeight: 27,
    fontWeight: '700',
    letterSpacing: -0.3,
    color: warna.tinta,
  },
  lembarBaris: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  lembarBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  lembarTitik: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  lembarBadgeTeks: {
    fontSize: 11,
    fontWeight: '700',
  },
  lembarMeta: {
    fontSize: 11.5,
    color: warna.redup,
  },
  lembarTeks: {
    marginTop: 14,
    fontSize: 12.5,
    lineHeight: 19,
    color: warna.teks,
  },
  lembarTombol: {
    marginTop: 22,
    height: 46,
    borderRadius: 12,
    backgroundColor: warna.biru,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lembarTombolTeks: {
    fontSize: 13,
    fontWeight: '700',
    color: warna.permukaan,
  },
  panelLapisan: {
    flex: 1,
  },
  panelLatar: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },
  panel: {
    position: 'absolute',
    backgroundColor: warna.permukaan,
    shadowColor: warna.tinta,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 30,
    elevation: 12,
  },
  panelLebar: {
    top: 0,
    right: 0,
    bottom: 0,
    width: 420,
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
    padding: 24,
  },
  panelPonsel: {
    left: 0,
    right: 0,
    bottom: 0,
    maxHeight: '88%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 16,
  },
  panelHeaderKiri: {
    flex: 1,
  },
  panelLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.1,
    color: warna.redup,
  },
  panelJudul: {
    marginTop: 6,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '700',
    letterSpacing: -0.3,
    color: warna.tinta,
  },
  panelScrollPonsel: {
    flexGrow: 0,
    flexShrink: 1,
  },
  panelScrollLebar: {
    flex: 1,
  },
  panelKonten: {
    flexGrow: 0,
    paddingBottom: 8,
  },
  panelKontenLebar: {
    flexGrow: 1,
  },
  panelTeks: {
    marginTop: 8,
    fontSize: 12,
    lineHeight: 18,
    color: warna.teks,
  },
  labelField: {
    marginTop: 14,
    marginBottom: 6,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.7,
    color: warna.redup,
    textTransform: 'uppercase',
  },
  pilihanTugas: {
    flexDirection: 'row',
    gap: 8,
  },
  pilihan: {
    flex: 1,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: warna.garis,
    backgroundColor: '#FBFCFE',
  },
  pilihanAktif: {
    borderColor: '#B9CCF5',
    backgroundColor: warna.biruMuda,
  },
  pilihanTitik: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: warna.biru,
  },
  pilihanTitikKosong: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#B7C2D2',
  },
  pilihanTeks: {
    fontSize: 11.5,
    fontWeight: '600',
    color: warna.redup,
  },
  pilihanTeksAktif: {
    fontSize: 11.5,
    fontWeight: '700',
    color: warna.biru,
  },
  barisField: {
    flexDirection: 'row',
    gap: 10,
  },
  fieldSetengah: {
    flex: 1,
  },
  inputField: {
    height: 44,
    borderWidth: 1,
    borderColor: warna.garis,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 12.5,
    color: warna.tinta,
    backgroundColor: '#FBFCFE',
  },
  panelInfo: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: warna.biruMuda,
  },
  panelInfoTeks: {
    fontSize: 10.5,
    lineHeight: 15,
    color: warna.biru,
  },
  panelTombol: {
    marginTop: 18,
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 12,
    backgroundColor: warna.biru,
  },
  panelTombolTeks: {
    fontSize: 12.5,
    fontWeight: '700',
    color: warna.permukaan,
  },
  panelTombolPanah: {
    fontSize: 15,
    fontWeight: '700',
    color: warna.permukaan,
  },
  panelFooter: {
    marginTop: 'auto',
    paddingTop: 18,
    fontSize: 10.5,
    lineHeight: 15,
    color: warna.redup,
    textAlign: 'center',
  },
});
