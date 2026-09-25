import { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Animated, { FadeIn } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@react-native-vector-icons/ionicons";

import { api } from "@/src/api";
import { makeStyles, spacing, typography, radius } from "@/src/theme";
import { useUserId } from "@/src/session";
import { CategoryGrid, toggleInterest, ALL_ID } from "@/src/components/category-grid";
import { LimitBadge } from "@/src/components/limit-badge";
import { ONB } from "@/src/components/onboarding-palette";
import { useI18n } from "@/src/i18n";
import { CoachTip } from "@/src/coach-tips";

// Topics: pick / change interests any time. Saves immediately.
// Il layout replica identico lo step "argomenti" dell'onboarding: fondo dark
// navy cinematico con orbi, titolo con bagliore ciano, hint card e griglia
// glass. Le funzionalità (salvataggio interessi, LimitBadge, contatore) restano.
export default function Explore() {
  const insets = useSafeAreaInsets();
  const qc = useQueryClient();
  const userId = useUserId();
  const { t } = useI18n();
  const styles = useStyles();

  const { data: categories, isLoading } = useQuery({ queryKey: ["categories"], queryFn: api.categories });
  const { data: user } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => api.user(userId!),
    enabled: !!userId,
  });

  const [selected, setSelected] = useState<Set<string>>(new Set());
  useEffect(() => {
    if (user) setSelected(new Set(user.interests));
  }, [user]);

  const save = useMutation({
    mutationFn: (interests: string[]) => api.setInterests(userId!, interests),
    onSuccess: (state) => {
      qc.setQueryData(["user", userId], state);
      qc.invalidateQueries({ queryKey: ["discover-next"] });
    },
  });

  const onToggle = (id: string) => {
    const next = toggleInterest(selected, id);
    setSelected(next);
    if (userId) save.mutate(Array.from(next));
  };

  const count = selected.has(ALL_ID) ? categories?.length ?? 0 : selected.size;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Fondo dark navy cinematografico + orbi, identico all'onboarding. */}
      <LinearGradient
        colors={[ONB.bgTop, ONB.bgMid, ONB.bgBottom]}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <View style={styles.orb} pointerEvents="none" />
      <View style={styles.orbViolet} pointerEvents="none" />

      <CoachTip id="topics" text={t.tip_topics} icon="grid-outline" style={{ bottom: insets.bottom + spacing.md }} />

      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title} testID="explore-title">{t.explore_title}</Text>
          <LimitBadge testID="explore-limit-badge" />
        </View>
      </View>

      {isLoading || !categories ? (
        <ActivityIndicator color={ONB.cyan} style={{ marginTop: spacing.xxl }} />
      ) : (
        <View style={styles.content}>
          <Animated.View entering={FadeIn.delay(80).duration(360)} style={styles.hintCard} testID="explore-hint">
            <Ionicons name="sparkles-outline" size={16} color={ONB.cyan} style={styles.hintIcon} />
            <Text style={styles.hintText}>{t.explore_sub}</Text>
          </Animated.View>

          <View style={styles.statusRow}>
            <Text style={styles.status} testID="interests-count">
              {count === 0 ? t.no_interests : `${count} ${count === 1 ? t.interest_1 : t.interests}`}
            </Text>
            {save.isPending ? <ActivityIndicator size="small" color={ONB.cyan} /> : null}
          </View>

          {/* Compact 3-column grid — glass style identico all'onboarding. */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            bounces={false}
            contentContainerStyle={{ paddingBottom: insets.bottom + spacing.md }}
          >
            <CategoryGrid
              compact
              glass
              categories={categories}
              selected={selected}
              modes={user?.content_modes}
              onToggle={onToggle}
            />
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const useStyles = makeStyles((colors) => ({
  container: { flex: 1, backgroundColor: ONB.bgTop },
  orb: {
    position: "absolute", top: -140, right: -110, width: 340, height: 340, borderRadius: 170,
    backgroundColor: ONB.orb, boxShadow: "0px 0px 150px 70px rgba(31,75,255,0.16)" as any,
  },
  orbViolet: {
    position: "absolute", bottom: 120, left: -160, width: 300, height: 300, borderRadius: 150,
    backgroundColor: "rgba(120,60,255,0.06)", boxShadow: "0px 0px 140px 60px rgba(120,60,255,0.08)" as any,
  },
  header: { paddingHorizontal: spacing.xl, paddingTop: spacing.md, paddingBottom: spacing.sm },
  headerTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  title: {
    color: ONB.text, fontFamily: typography.displayBold, fontSize: 28, lineHeight: 34,
    textShadowColor: "rgba(55,211,255,0.25)", textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 18,
  },
  hintCard: {
    flexDirection: "row", alignItems: "flex-start", gap: spacing.sm,
    padding: spacing.md, marginTop: spacing.xs, marginBottom: spacing.md, borderRadius: radius.lg,
    backgroundColor: "rgba(12,26,58,0.65)", borderWidth: 1, borderColor: "rgba(55,211,255,0.32)",
    boxShadow: "0px 0px 24px rgba(55,211,255,0.08)" as any,
  },
  hintIcon: { marginTop: 2 },
  hintText: { flex: 1, color: ONB.textSecondary, fontFamily: typography.body, fontSize: 13, lineHeight: 19 },
  content: { flex: 1, paddingHorizontal: spacing.xl },
  statusRow: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    marginBottom: spacing.sm, minHeight: 20,
  },
  status: {
    color: ONB.cyan, fontFamily: typography.bodyBold, fontSize: 11,
    letterSpacing: 1.5, textTransform: "uppercase",
  },
}));
