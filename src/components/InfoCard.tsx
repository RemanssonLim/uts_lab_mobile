import { StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { warna } from '../theme/warna';

export type StatusTugas = 'selesai' | 'proses';

type InfoCardProps = {
  title: string;
  status: StatusTugas;
  onPress: () => void;
};

const labelStatus: Record<StatusTugas, string> = {
  selesai: 'Selesai',
  proses: 'Proses',
};

export default function InfoCard({ title, status, onPress }: InfoCardProps) {
  const { width } = useWindowDimensions();
  const lebar = width >= 820;
  const selesai = status === 'selesai';
  const warnaAksen = selesai ? warna.hijau : warna.oranye;
  const warnaBadge = selesai ? warna.hijauMuda : warna.oranyeMuda;

  return (
    <View
      style={[styles.kartu, lebar && styles.kartuLebar, { borderLeftColor: warnaAksen }]}
    >
      <View style={[styles.isi, lebar && styles.isiLebar]}>
        <View style={styles.barisAtas}>
          <Text style={styles.label}>TUGAS PRAKTIKUM</Text>
          <View style={[styles.badge, { backgroundColor: warnaBadge }]}>
            <View style={[styles.titik, { backgroundColor: warnaAksen }]} />
            <Text style={[styles.badgeTeks, { color: warnaAksen }]}>{labelStatus[status]}</Text>
          </View>
        </View>

        <Text style={[styles.judul, lebar && styles.judulLebar]}>{title}</Text>
        <Text style={styles.keterangan}>Lab. Pemrograman Mobile · Semester III</Text>
      </View>

      <TouchableOpacity
        style={[styles.tombol, lebar && styles.tombolLebar]}
        activeOpacity={0.75}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`Lihat detail ${title}`}
      >
        <Text style={styles.tombolTeks}>Lihat Detail</Text>
        <Text style={styles.tombolPanah}>→</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  kartu: {
    backgroundColor: warna.permukaan,
    borderRadius: 15,
    borderWidth: 1,
    borderLeftWidth: 4,
    borderColor: warna.garis,
    padding: 16,
    shadowColor: warna.tinta,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 2,
  },
  kartuLebar: {
    minHeight: 118,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  isi: {
    flexShrink: 1,
  },
  isiLebar: {
    flex: 1,
    paddingRight: 16,
  },
  barisAtas: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 9.5,
    fontWeight: '700',
    letterSpacing: 1.1,
    color: warna.redup,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  titik: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  badgeTeks: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  judul: {
    marginTop: 9,
    fontSize: 17,
    lineHeight: 23,
    fontWeight: '700',
    letterSpacing: -0.2,
    color: warna.tinta,
  },
  judulLebar: {
    marginTop: 7,
    fontSize: 16,
    lineHeight: 22,
  },
  keterangan: {
    marginTop: 4,
    fontSize: 11.5,
    color: warna.redup,
  },
  tombol: {
    marginTop: 13,
    height: 38,
    borderRadius: 9,
    backgroundColor: warna.biruMuda,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  tombolLebar: {
    marginTop: 0,
    width: 146,
    flexShrink: 0,
  },
  tombolTeks: {
    fontSize: 12,
    fontWeight: '700',
    color: warna.biru,
  },
  tombolPanah: {
    fontSize: 14,
    fontWeight: '700',
    color: warna.biru,
  },
});
