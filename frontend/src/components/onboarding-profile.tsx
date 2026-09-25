// PAUSE — onboarding, passo "Raccontaci qualcosa di te" (dati personali).
// Replica del mockup: sfondo dedicato (lago notturno con pianeta), logo,
// titolo con "te" in gradiente, tre schede in vetro (nome/nickname, genere,
// età) e CTA a gradiente viola→ciano. Palette fissa ONB come il resto
// dell'onboarding (identica in tema chiaro e scuro).
import React, { useMemo, useRef, useState } from "react";
import {
  FlatList, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions,
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@react-native-vector-icons/ionicons";
import Svg, { Defs, LinearGradient as SvgGradient, Stop, Text as SvgText } from "react-native-svg";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useI18n } from "@/src/i18n";
import { Gender } from "@/src/api";
import { radius, spacing, typography, withAlpha } from "@/src/theme";
import { OnboardingBrand } from "./onboarding-brand";
import { PagerDots } from "./pager";
import { ONB } from "./onboarding-palette";

const ARTWORK = require("../../assets/images/onboarding-profile-bg.jpg");
// Stesso gradiente del pulsante della presentazione (riferimento fisso del brand).
const CTA_BORDER = ["#E08CFF", "#7FA0FF", "#7FEBFF"] as const;
const CTA_FILL = ["#8A2BE8", "#5B3BF5", "#3556F2", "#2A8CF0", "#22C4F2"] as const;
const AGES = Array.from({ length: 108 }, (_, i) => 13 + i); // 13 … 120
const AGE_ROW = 52;
export const MIN_NAME = 2;

export type ProfileDraft = { name: string; gender: Gender | null; age: number | null };

export function OnboardingProfile({ value, onChange, onBack, onContinue, canContinue, saving, stepIndex, steps }: {
  value: ProfileDraft;
  onChange: (next: ProfileDraft) => void;
  onBack: () => void;
  onContinue: () => void;
  canContinue: boolean;
  saving: boolean;
  stepIndex: number;
  steps: number;
}) {
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const [focused, setFocused] = useState(false);
  const [agePickerOpen, setAgePickerOpen] = useState(false);
  const brandUnit = Math.min(width, 430) / 984 * 0.62;
  const brandHeight = 300 * brandUnit + 60 * brandUnit;
  const titleSize = Math.min(34, Math.max(26, width * 0.082));
  const [titleLine1, titleLine2] = t.onb_profile_title_a.split("\n");

  const setGender = (g: Gender) => {
    Haptics.selectionAsync().catch(() => {});
    onChange({ ...value, gender: g });
  };

  return (
    <View style={styles.root} testID="onboarding-profile">
      <Image source={ARTWORK} contentFit="cover" contentPosition="center" cachePolicy="memory-disk" accessible={false} testID="onboarding-profile-artwork" style={StyleSheet.absoluteFill} />
      {/* Veli: cielo leggibile in alto, scena visibile al centro, fondo scuro per le schede e la CTA. */}
      <LinearGradient pointerEvents="none" colors={[withAlpha(ONB.bgTop, 0.55), withAlpha(ONB.bgTop, 0.15), withAlpha(ONB.bgTop, 0.55), withAlpha(ONB.bgTop, 0.88), withAlpha(ONB.bgTop, 0.96)]} locations={[0, 0.2, 0.42, 0.7, 1]} style={StyleSheet.absoluteFill} />

      <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={0}>
        <ScrollView
          style={styles.root}
          contentContainerStyle={[styles.content, { paddingTop: insets.top + 8, paddingBottom: insets.bottom + spacing.lg, minHeight: height }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
          testID="onboarding-profile-scroll"
        >
          <Pressable onPress={onBack} hitSlop={8} accessibilityRole="button" accessibilityLabel={t.onb_profile_back} testID="onboarding-profile-back" style={({ pressed }) => [styles.back, pressed && styles.pressed]}>
            <Ionicons name="arrow-back" size={22} color={ONB.text} />
          </Pressable>

          <View style={{ height: brandHeight }}>
            <OnboardingBrand unit={brandUnit} top={-16 * brandUnit} />
          </View>

          <View style={styles.titleWrap}>
            <Text style={[styles.title, { fontSize: titleSize, lineHeight: titleSize * 1.16 }]} testID="onboarding-profile-title">{titleLine1}</Text>
            <View style={styles.titleRow}>
              <Text style={[styles.title, { fontSize: titleSize, lineHeight: titleSize * 1.16 }]}>{titleLine2}</Text>
              <GradientWord word={t.onb_profile_title_b} fontSize={titleSize} />
            </View>
            <Text style={styles.subtitle} testID="onboarding-profile-subtitle">{t.onb_profile_sub}</Text>
          </View>

          {/* Nome o nickname */}
          <GlassField icon="person-outline" glow={focused} testID="onboarding-profile-name-card">
            <Text style={styles.label}>{t.onb_profile_name}</Text>
            <TextInput
              value={value.name}
              onChangeText={(name) => onChange({ ...value, name: name.slice(0, 40) })}
              placeholder={t.onb_profile_name_ph}
              placeholderTextColor={ONB.muted}
              style={styles.input}
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="done"
              maxLength={40}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              testID="onboarding-profile-name"
              accessibilityLabel={t.onb_profile_name}
            />
          </GlassField>

          {/* Genere */}
          <GlassField icon="male-female-outline" testID="onboarding-profile-gender-card">
            <Text style={styles.label}>{t.onb_profile_gender}</Text>
            <View style={styles.chips}>
              {([["man", t.onb_profile_man], ["woman", t.onb_profile_woman], ["other", t.onb_profile_other]] as [Gender, string][]).map(([g, label]) => {
                const on = value.gender === g;
                return (
                  <Pressable key={g} onPress={() => setGender(g)} accessibilityRole="radio" accessibilityState={{ selected: on }} testID={`onboarding-profile-gender-${g}`} style={({ pressed }) => [styles.chip, on && styles.chipOn, pressed && styles.pressed]}>
                    {on ? <LinearGradient colors={["#0B6E9C", "#12A8D6", ONB.cyan]} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} /> : null}
                    <Text style={[styles.chipText, on && styles.chipTextOn]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>{label}</Text>
                  </Pressable>
                );
              })}
            </View>
          </GlassField>

          {/* Età */}
          <GlassField icon="calendar-outline" testID="onboarding-profile-age-card">
            <Text style={styles.label}>{t.onb_profile_age}</Text>
            <Pressable onPress={() => setAgePickerOpen(true)} accessibilityRole="button" accessibilityLabel={t.onb_profile_age_ph} testID="onboarding-profile-age" style={({ pressed }) => [styles.select, pressed && styles.pressed]}>
              <Text style={[styles.selectText, value.age === null && styles.selectPlaceholder]} testID="onboarding-profile-age-value">
                {value.age === null ? t.onb_profile_age_ph : `${value.age} ${t.onb_profile_age_years}`}
              </Text>
              <Ionicons name="chevron-down" size={18} color={ONB.textSecondary} />
            </Pressable>
          </GlassField>

          <View style={styles.footer}>
            <Pressable
              onPress={onContinue}
              disabled={saving}
              accessibilityRole="button"
              accessibilityState={{ disabled: !canContinue }}
              testID="onboarding-profile-continue"
              style={({ pressed }) => [styles.cta, { opacity: canContinue ? 1 : 0.55 }, pressed && styles.ctaPressed]}
            >
              <LinearGradient colors={[...CTA_BORDER]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.ctaBorder}>
                <LinearGradient colors={[...CTA_FILL]} locations={[0, 0.3, 0.55, 0.8, 1]} start={{ x: 0, y: 0.7 }} end={{ x: 1, y: 0.3 }} style={styles.ctaFill}>
                  <LinearGradient colors={["#FFFFFF38", "#FFFFFF0E", "#FFFFFF00", "#12063A2A"]} locations={[0, 0.28, 0.55, 1]} style={StyleSheet.absoluteFill} />
                  <Text style={styles.ctaText} testID="onboarding-profile-continue-label">{t.onb_modes_next}</Text>
                  <Ionicons name="arrow-forward" size={20} color={ONB.text} />
                </LinearGradient>
              </LinearGradient>
            </Pressable>
            <PagerDots count={steps} index={stepIndex} color={ONB.cyan} style={styles.dots} testID="onboarding-profile-dots" />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <AgePicker
        visible={agePickerOpen}
        value={value.age}
        onClose={() => setAgePickerOpen(false)}
        onPick={(age) => { Haptics.selectionAsync().catch(() => {}); onChange({ ...value, age }); setAgePickerOpen(false); }}
      />
    </View>
  );
}

// Parola finale del titolo con riempimento ciano→viola (come nel mockup).
function GradientWord({ word, fontSize }: { word: string; fontSize: number }) {
  const w = Math.ceil(fontSize * 0.62 * word.length) + 4;
  const h = Math.ceil(fontSize * 1.16);
  return (
    <Svg width={w} height={h} testID="onboarding-profile-title-accent">
      <Defs>
        <SvgGradient id="onbWord" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor={ONB.cyan} />
          <Stop offset="1" stopColor={ONB.violet} />
        </SvgGradient>
      </Defs>
      <SvgText x={0} y={fontSize * 0.98} fontSize={fontSize} fontFamily={typography.displayBold} fontWeight="700" fill="url(#onbWord)">{word}</SvgText>
    </Svg>
  );
}

function GlassField({ icon, glow, testID, children }: { icon: string; glow?: boolean; testID: string; children: React.ReactNode }) {
  return (
    <View style={[styles.card, glow && styles.cardGlow]} testID={testID}>
      <LinearGradient colors={[withAlpha(ONB.glassTop, 0.78), withAlpha(ONB.glassBottom, 0.9)]} style={StyleSheet.absoluteFill} pointerEvents="none" />
      {/* Filo luminoso ciano sul bordo inferiore, come nel mockup. */}
      <LinearGradient pointerEvents="none" colors={[withAlpha(ONB.cyan, 0), withAlpha(ONB.cyan, 0.55), withAlpha(ONB.cyan, 0)]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.cardEdge} />
      <View style={styles.cardRow}>
        <View style={styles.iconWrap}>
          <Ionicons name={icon as any} size={24} color={ONB.text} />
        </View>
        <View style={styles.cardBody}>{children}</View>
      </View>
    </View>
  );
}

function AgePicker({ visible, value, onClose, onPick }: { visible: boolean; value: number | null; onClose: () => void; onPick: (age: number) => void }) {
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList<number>>(null);
  const initialIndex = useMemo(() => Math.max(0, AGES.indexOf(value ?? 25) - 2), [value]);
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.sheetBackdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel={t.onb_profile_back} testID="onboarding-profile-age-backdrop" />
        <View style={[styles.sheet, { paddingBottom: insets.bottom + spacing.md }]} testID="onboarding-profile-age-sheet">
          <LinearGradient colors={[ONB.glassTop, ONB.glassBottom]} style={StyleSheet.absoluteFill} pointerEvents="none" />
          <View style={styles.sheetHandle} />
          <Text style={styles.sheetTitle}>{t.onb_profile_age_ph}</Text>
          <FlatList
            ref={listRef}
            data={AGES}
            keyExtractor={(a) => String(a)}
            initialScrollIndex={initialIndex}
            getItemLayout={(_, i) => ({ length: AGE_ROW, offset: AGE_ROW * i, index: i })}
            style={styles.sheetList}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const on = item === value;
              return (
                <Pressable onPress={() => onPick(item)} accessibilityRole="button" accessibilityState={{ selected: on }} testID={`onboarding-profile-age-${item}`} style={({ pressed }) => [styles.ageRow, on && styles.ageRowOn, pressed && styles.pressed]}>
                  <Text style={[styles.ageText, on && styles.ageTextOn]}>{item} {t.onb_profile_age_years}</Text>
                  {on ? <Ionicons name="checkmark" size={18} color={ONB.cyan} /> : null}
                </Pressable>
              );
            }}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: ONB.bgTop },
  content: { paddingHorizontal: 28 },
  back: {
    position: "absolute", left: 28, top: 0, zIndex: 2, width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center",
    backgroundColor: withAlpha(ONB.glassTop, 0.55), borderWidth: 1, borderColor: ONB.glassBorder,
  },
  pressed: { opacity: 0.8 },
  titleWrap: { alignItems: "center", marginTop: 6, marginBottom: 22 },
  titleRow: { flexDirection: "row", alignItems: "flex-end", justifyContent: "center" },
  title: {
    color: ONB.text, fontFamily: typography.displayBold, textAlign: "center", letterSpacing: -0.6, includeFontPadding: false,
    textShadowColor: withAlpha(ONB.cyan, 0.25), textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 18,
  },
  subtitle: { color: ONB.textSecondary, fontFamily: typography.body, fontSize: 14.5, lineHeight: 21, textAlign: "center", marginTop: 14, paddingHorizontal: 8 },
  card: {
    borderRadius: 30, overflow: "hidden", borderWidth: 1, borderColor: ONB.glassBorder, marginBottom: 16,
    backgroundColor: withAlpha(ONB.glassBottom, 0.7), boxShadow: `0px 8px 28px ${withAlpha(ONB.bgTop, 0.55)}` as any,
  },
  cardGlow: { borderColor: withAlpha(ONB.cyan, 0.55), boxShadow: `0px 0px 22px ${withAlpha(ONB.cyan, 0.22)}` as any },
  cardEdge: { position: "absolute", left: 24, right: 24, bottom: 0, height: 1.5 },
  cardRow: { flexDirection: "row", alignItems: "center", gap: 14, paddingVertical: 16, paddingLeft: 14, paddingRight: 18 },
  iconWrap: {
    width: 56, height: 56, borderRadius: 28, alignItems: "center", justifyContent: "center",
    backgroundColor: withAlpha(ONB.glassTop, 0.9), borderWidth: 1, borderColor: ONB.glassBorderStrong,
  },
  cardBody: { flex: 1, minWidth: 0, gap: 8 },
  label: { color: ONB.text, fontFamily: typography.bodyBold, fontSize: 15.5, lineHeight: 19 },
  input: { color: ONB.text, fontFamily: typography.body, fontSize: 15, lineHeight: 20, paddingVertical: 2, paddingHorizontal: 0, minHeight: 24, ...(Platform.OS === "web" ? ({ outlineStyle: "none" } as any) : null) },
  chips: { flexDirection: "row", gap: 10 },
  chip: {
    flex: 1, minHeight: 46, borderRadius: radius.pill, overflow: "hidden", alignItems: "center", justifyContent: "center", paddingHorizontal: 6,
    backgroundColor: withAlpha(ONB.glassTop, 0.55), borderWidth: 1, borderColor: ONB.glassBorder,
  },
  chipOn: { borderColor: withAlpha(ONB.cyan, 0.9), boxShadow: `0px 0px 16px ${withAlpha(ONB.cyan, 0.45)}` as any },
  chipText: { color: ONB.textSecondary, fontFamily: typography.bodyMedium, fontSize: 15 },
  chipTextOn: { color: ONB.text, fontFamily: typography.bodyBold },
  select: {
    minHeight: 48, borderRadius: radius.pill, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 18,
    backgroundColor: withAlpha(ONB.bgTop, 0.6), borderWidth: 1, borderColor: ONB.glassBorder,
  },
  selectText: { color: ONB.text, fontFamily: typography.bodyMedium, fontSize: 15 },
  selectPlaceholder: { color: ONB.textSecondary, fontFamily: typography.body },
  footer: { marginTop: "auto", paddingTop: 8 },
  cta: { height: 60, borderRadius: 30, overflow: "hidden", boxShadow: `0px 0px 26px ${withAlpha(ONB.cyan, 0.28)}, 0px 10px 30px ${withAlpha("#5B3BF5", 0.35)}` as any },
  ctaPressed: { opacity: 0.9, transform: [{ scale: 0.99 }] },
  ctaBorder: { flex: 1, padding: 1.4, borderRadius: 30, overflow: "hidden" },
  ctaFill: { flex: 1, borderRadius: 30, overflow: "hidden", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 12 },
  ctaText: { color: ONB.text, fontFamily: typography.displayBold, fontSize: 19, letterSpacing: -0.3, includeFontPadding: false },
  dots: { alignSelf: "center", marginTop: 22 },
  sheetBackdrop: { flex: 1, justifyContent: "flex-end", backgroundColor: withAlpha(ONB.bgTop, 0.7) },
  sheet: { maxHeight: "60%", borderTopLeftRadius: 28, borderTopRightRadius: 28, overflow: "hidden", borderWidth: 1, borderColor: ONB.glassBorderStrong, paddingTop: 10, paddingHorizontal: spacing.lg },
  sheetHandle: { alignSelf: "center", width: 40, height: 4, borderRadius: 2, backgroundColor: ONB.glassBorderStrong, marginBottom: 12 },
  sheetTitle: { color: ONB.text, fontFamily: typography.displayBold, fontSize: 18, marginBottom: 8, textAlign: "center" },
  sheetList: { flexGrow: 0 },
  ageRow: { height: AGE_ROW, borderRadius: radius.md, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16 },
  ageRowOn: { backgroundColor: withAlpha(ONB.cyan, 0.12) },
  ageText: { color: ONB.textSecondary, fontFamily: typography.bodyMedium, fontSize: 17 },
  ageTextOn: { color: ONB.text, fontFamily: typography.bodyBold },
});
