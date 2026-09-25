// Unica interfaccia per argomenti e formati: onboarding e tab Categorie.
// La persistenza resta al chiamante (conferma onboarding / autosave Categorie).
import { ReactNode } from "react";
import { StyleSheet, View, Text } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@react-native-vector-icons/ionicons";
import { Category } from "@/src/api";
import { spacing, radius, typography, withAlpha } from "@/src/theme";
import { useI18n } from "@/src/i18n";
import { CategoryGrid } from "./category-grid";
import { ModeChips } from "./onboarding-modes";
import { StoryKind } from "./kind-icon";
import { ONB } from "./onboarding-palette";

type Props = {
  categories: Category[]; selected: Set<string>; modes: Set<StoryKind>;
  onToggleCategory: (id: string) => void; onToggleMode: (mode: StoryKind) => void;
  testID: string; modeIdPrefix?: string; disabled?: boolean; staggerIn?: boolean;
  titleAccessory?: ReactNode; status?: ReactNode;
};

export function TopicPicker({ categories, selected, modes, onToggleCategory, onToggleMode,
  testID, modeIdPrefix = "onboarding", disabled = false, staggerIn = false, titleAccessory, status }: Props) {
  const { t } = useI18n();
  const formats = modes.size === 2 ? t.onb_formats_both : modes.has("lessons") ? t.onb_formats_lessons : t.onb_formats_stories;
  return (
    <View style={styles.content} testID={`${testID}-picker`}>
      <ModeChips modes={modes} onToggle={onToggleMode} disabled={disabled} idPrefix={modeIdPrefix} />
      <View style={styles.titleRow}>
        <Text style={styles.title} testID={`${testID}-title`}>{t.onb_title}</Text>
        {titleAccessory}
      </View>
      <Animated.View entering={FadeIn.delay(120).duration(360)} style={styles.hintCard} testID={`${testID}-hint`}>
        <Ionicons name="sparkles-outline" size={16} color={ONB.cyan} style={styles.hintIcon} />
        <Text style={styles.hintText} testID={`${testID}-hint-text`}>{t.onb_topics_hint.replace("{formats}", formats)}</Text>
      </Animated.View>
      {status}
      <CategoryGrid compact glass staggerIn={staggerIn} disabled={disabled} categories={categories}
        selected={selected} modes={Array.from(modes)} onToggle={onToggleCategory} />
    </View>
  );
}

export function TopicsBackdrop() {
  return (
    <View pointerEvents="none" style={styles.backdrop}>
      <LinearGradient colors={[ONB.bgTop, ONB.bgMid, ONB.bgBottom]} locations={[0, 0.45, 1]} style={StyleSheet.absoluteFill} />
      <View style={styles.orb} />
      <View style={styles.orbViolet} />
    </View>
  );
}

// Palette ONB intenzionalmente fissa nei due temi; preserva lo stile approvato.
const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.xl, paddingTop: spacing.lg, paddingBottom: spacing.lg },
  titleRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.lg },
  title: { flex: 1, color: ONB.text, fontFamily: typography.displayBold, fontSize: 28, lineHeight: 34,
    textShadowColor: withAlpha(ONB.cyan, 0.25), textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 18 },
  hintCard: { flexDirection: "row", alignItems: "flex-start", gap: spacing.sm, padding: spacing.md,
    marginBottom: spacing.lg, borderRadius: radius.lg, backgroundColor: "rgba(12,26,58,0.65)",
    borderWidth: 1, borderColor: withAlpha(ONB.cyan, 0.32), boxShadow: `0px 0px 24px ${withAlpha(ONB.cyan, 0.08)}` },
  hintIcon: { marginTop: 2 },
  hintText: { flex: 1, color: ONB.textSecondary, fontFamily: typography.body, fontSize: 13, lineHeight: 19 },
  backdrop: { position: "absolute", top: 0, right: 0, bottom: 0, left: 0, overflow: "hidden" },
  orb: { position: "absolute", top: -140, right: -110, width: 340, height: 340, borderRadius: 170,
    backgroundColor: ONB.orb, boxShadow: "0px 0px 150px 70px rgba(31,75,255,0.16)" },
  orbViolet: { position: "absolute", bottom: 120, left: -160, width: 300, height: 300, borderRadius: 150,
    backgroundColor: "rgba(120,60,255,0.06)", boxShadow: "0px 0px 140px 60px rgba(120,60,255,0.08)" },
});