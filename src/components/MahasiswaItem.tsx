import { StyleSheet, Text, View } from 'react-native';
import type { Mahasiswa } from '../data/mahasiswa';
import { warna } from '../theme/warna';

type MahasiswaItemProps = {
  mahasiswa: Mahasiswa;
};

function ambilInisial(nama: string) {
  return nama
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((kata) => kata[0])
    .join('')
    .toUpperCase();
}

export default function MahasiswaItem({ mahasiswa }: MahasiswaItemProps) {
  return (
    <View style={styles.item}>
      <View style={styles.avatar}>
        <Text style={styles.inisial}>{ambilInisial(mahasiswa.nama)}</Text>
      </View>

      <View style={styles.identitas}>
        <Text style={styles.nama} numberOfLines={1}>
          {mahasiswa.nama}
        </Text>
        <Text style={styles.prodi} numberOfLines={1}>
          {mahasiswa.prodi}
        </Text>
      </View>

      <View style={styles.nim}>
        <Text style={styles.nimLabel}>NIM</Text>
        <Text style={styles.nimNilai}>{mahasiswa.nim}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: warna.permukaan,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: warna.garis,
    paddingVertical: 11,
    paddingHorizontal: 13,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: warna.biruMuda,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },
  inisial: {
    fontSize: 12.5,
    fontWeight: '700',
    color: warna.biru,
  },
  identitas: {
    flex: 1,
  },
  nama: {
    fontSize: 13.5,
    fontWeight: '600',
    color: warna.tinta,
  },
  prodi: {
    marginTop: 3,
    fontSize: 11,
    color: warna.redup,
  },
  nim: {
    alignItems: 'flex-end',
    marginLeft: 8,
  },
  nimLabel: {
    fontSize: 8.5,
    fontWeight: '600',
    letterSpacing: 0.8,
    color: warna.redup,
  },
  nimNilai: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: '600',
    color: warna.teks,
  },
});
