// PAUSE — barra "storie lette" in fondo alla Home: stessa grammatica visiva
// delle tessere categoria (vetro dark-navy, bordo chiaro, oggetto 3D) con una
// sottile barra di avanzamento verso il prossimo traguardo. Tocco → statistiche.
import { Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useRouter } from "expo-router";
import { makeStyles, radius, typography, useTheme, withAlpha } from "@/src/theme";
import { useI18n } from "@/src/i18n";
import { KindIcon } from "./kind-icon";
import { ONB } from "./onboarding-palette";

export function HomeReadingProgress({ count }: { count: number }) {
  const { t } = useI18n();
  const { colors } = useTheme();
  const styles = useStyles();
  const router = useRouter();
  // A reading milestone, not a session limit: always the next multiple of 20.
  const goal = (Math.floor(count / 20) + 1) * 20;
  const label = count === 0 ? t.home_read_count_zero : count === 1 ? t.home_read_count_one : t.home_read_count.replace("{count}", String(count));
  const caption = count === 0 ? t.home_read_caption_zero : t.home_read_caption;
  return (
    <Pressable testID="home-reading-progress" accessibilityRole="button" accessibilityLabel={`${label}. ${count} / ${goal}. ${t.stats_row}`} onPress={() => router.push("/stats")} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <LinearGradient colors={[ONB.glassTop, ONB.glassBottom]} style={StyleSheet.absoluteFill} pointerEvents="none" />
      <View pointerEvents="none" style={styles.highlight} />
      <View style={styles.row}>
        <View style={styles.art}>
          <KindIcon kind="lessons" size={40} glow={false} testID="home-reading-icon" />
        </View>
        <View style={styles.copy}>
          <Text testID="home-reading-count" style={styles.title} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>{label}</Text>
          <View style={styles.progressRow}>
            <View testID="home-reading-track" style={styles.track} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: goal, now: count }}>
              <LinearGradient colors={[ONB.cyan, ONB.violet]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.fill, { width: `${Math.max(count / goal, 0.02) * 100}%` }]} />
            </View>
            <Text testID="home-reading-goal" style={styles.counter}>{count} / {goal}</Text>
          </View>
          <Text testID="home-reading-caption" style={styles.subtitle} numberOfLines={1}>{caption}</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={withAlpha(colors.onGradient, 0.55)} />
      </View>
    </Pressable>
  );
}

const useStyles = makeStyles((colors) => ({
  card: { height: 66, overflow: "hidden", borderRadius: radius.md, borderWidth: 1, borderColor: ONB.glassBorder, backgroundColor: colors.artworkSurface },
  highlight: { position: "absolute", top: 0, left: 14, right: 14, height: 1, backgroundColor: ONB.glassBorderStrong },
  row: { flex: 1, flexDirection: "row", alignItems: "center", paddingLeft: 8, paddingRight: 12, gap: 10 },
  art: { width: 48, height: 48, borderRadius: radius.sm, alignItems: "center", justifyContent: "center", backgroundColor: ONB.orb, borderWidth: 1, borderColor: ONB.glassBorder },
  copy: { flex: 1, gap: 3, minWidth: 0 },
  title: { color: colors.onGradient, fontFamily: typography.bodyBold, fontSize: 12.5, lineHeight: 15 },
  progressRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  track: { flex: 1, height: 5, borderRadius: 4, overflow: "hidden", backgroundColor: withAlpha(ONB.cyanSoft, 0.14) },
  fill: { height: "100%", borderRadius: 4 },
  counter: { color: ONB.textSecondary, fontFamily: typography.bodyMedium, fontSize: 10, letterSpacing: 0.3 },
  subtitle: { color: ONB.muted, fontFamily: typography.body, fontSize: 10, lineHeight: 12 },
  pressed: { opacity: 0.83 },
}));
