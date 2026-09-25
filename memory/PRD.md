# PAUSE — Product Requirements (Preview)

> ⚠️ **OBBLIGATORIO PRIMA DI QUALSIASI INTERVENTO:** leggere e rispettare
> [`/app/memory/CONSTITUTION.md`](./CONSTITUTION.md) — la Costituzione tecnica permanente
> e vincolante di PAUSE (regola "minimum change", niente riscritture, niente rigenerazione
> di contenuti/asset, niente AI a runtime, identità visiva dark-navy/cyan/glass).
> Lingua dell'utente: italiano.

## Summary
Mobile Expo app (React Native + FastAPI + MongoDB) that turns idle moments into curiosities/mini-lessons with an intentional pause between sessions.

## Preview setup (current session)
- Codebase copied from user-uploaded ZIP (PAUSE-5.15) into `/app`.
- Backend: FastAPI on `:8001`, MongoDB local, requirements installed.
- Frontend: Expo SDK 57, yarn install, expo running on `:3000` behind Kubernetes ingress.
- Env: `.env` files preserved (preview URLs); backend `.env` extended with `EMERGENT_LLM_KEY` (free) and `ENFORCE_LIMIT="false"`.
- Emergent LLM key configured; Stripe/ElevenLabs left blank (integrations idle).

## Visual change
- Topics tab (`app/(tabs)/explore.tsx`) redesigned to mirror the onboarding "topics" step:
  cinematic dark-navy gradient with orbs, cyan-glow title, sparkles hint card,
  and the glass CategoryGrid (`glass` prop). Behaviour (interest toggle,
  auto-save, LimitBadge, active-count) unchanged.

## Home deck & badge (sessione corrente)
- `src/components/home-story-deck.tsx`: cambio card immediato (commit su UI thread via `runOnUI`), molla più rapida
  (damping 22 / stiffness 190); tocco e nuovo swipe consentiti anche durante l'animazione; zoom "in arrivo"
  guidato dal verso di scorrimento (`travel`). Comportamento timeline/elastico ai bordi/idle sway invariato.
- `src/components/story-meta-chips.tsx`: badge tipo · categoria · durata uniti in una sola pillola centrata,
  orologio 3D (`assets/images/kind-clock.png`, lo stesso di StoryInfoGrid) al posto dell'icona Ionicons.
- Stile "glass" sulle card storie della Home: proposto e BOCCIATO dall'utente → non applicare.

## Copertine — ripresa richiesta dall'utente (25 settembre 2026)
- Richiesta: «Riprendi il lavoro di creazione / correzione copertine finché c'è credito», confermata; procedere autonomamente, rispondere in italiano.
- Baseline effettiva: **437 contenuti, 427 con copertina, 10 mancanti**. Tutte le esclusioni editoriali storiche risultano già sostituite; non riapplicare cancellazioni massive.
- Backup metadati e impronte dei contenuti: `memory/cover_batches/resume_baseline.json`.
- Generazione esistente: `backend/generate_covers.py --concurrency 1`, Gemini `gemini-3.1-flash-image-preview`, prompt approvati in `cover_prompt_overrides.json`, arresto su budget/quota. Nessuna modifica a UI, API, testo, audio o preferenze utente.
- Batch corrente: `memory/cover_batches/a08de6ae79d149199e4b0a75fc7b3477.json`; log `resume_generation.log` nella stessa cartella. Originali WebP in `backend/covers/`, hero 1200px e thumb 600px nello storage gestito.
- Revisione non distruttiva delle immagini effettive tramite `catalog_cover_sheets.py --allow-missing`; contatti e snapshot in `memory/cover_review_final/`. Sostituire soltanto errori confermati, dopo confronto visivo, conservando i vecchi asset.
- P0 completato e verificato: 10 mancanti completate, 17 copertine esistenti corrette (7 rigenerate e 10 ritoccate senza AI); una delle 10 nuove, l'orbita, ha ricevuto anche una correzione scientifica. Totale **27 contenuti aggiornati**, **437/437 con copertina**.
- Arresto effettivo: il provider ha risposto **Budget has been exceeded** al primo elemento di `corrections_editorial_02.json`. Nessun retry a pagamento; candidati generati in quel batch: 0. Non rilanciarlo automaticamente.
- P1 bloccato dal credito: 9 correzioni già motivate e pronte in `memory/cover_batches/corrections_editorial_02.json` (migrazione, due storie api, gladiatori, melodie, evoluzione, Zanzibar, spezie, caricatore). Conservate le copertine precedenti, nessun buco nel catalogo. Dettagli/backup in `memory/cover_batches/RESUME_REVIEW.md`.
- P2: nessuna modifica funzionale aggiuntiva richiesta.
## Ripristino ambiente da GitHub PAUSE-5.16 (sessione corrente)
- Codice clonato da `github.com/micheleiannello7-cyber/PAUSE-5.16` in `/app` (preservati `.git`, `.emergent`, `.env`). Deps backend/frontend installate, backend :8001 + Expo :3000 in esecuzione, preview attiva.
- `backend/.env` esteso con `EMERGENT_LLM_KEY` (free) e `ENFORCE_LIMIT="false"` (Object Storage richiede la key).
- **Stato copertine in questo ambiente: 393/437**. Sync all'avvio: `sync_local_covers` = 284 caricate (file in `backend/covers/`), `restore_imported_covers` = 109 (manifest `imported_cover_sources.json`).
- **44 copertine mancanti**: sono le storie "core" originali (es. why-we-sleep, big-bang-basics, sky-blue-sunset-orange, how-gps-works, i 3 v8-…). Le loro copertine erano state generate con AI e salvate SOLO nell'Object Storage dell'ambiente precedente — mai committate come file locali in `backend/covers/` né in un manifest di URL (`generated_cover_sources.json`/`imported_cover_sources.json` non le contengono). Quindi non viaggiano col git e in un ambiente nuovo risultano assenti.
- **RISOLTO (stessa sessione)**: le 44 copertine NON erano sparite — esistevano ancora come snapshot a piena risoluzione (1200px JPEG) in `memory/cover_review_final/images/` (file `NNN-<id>.jpg`), semplicemente mai integrate come copertine locali. Copiate tutte e 44 in `backend/covers/<id>.jpg`; al riavvio `sync_local_covers` le ha caricate e collegate. **Ora 437/437 con copertina, 0 mancanti.** Nessuna rigenerazione AI, zero credito speso. Verificato: hero/thumb HTTP 200 WebP (why-we-sleep, big-bang-basics, v8-colosseo).
- Nota per il futuro: ora che sono in `backend/covers/` viaggiano col git e sopravvivono a fork/nuovi ambienti.

- Verifica finale (sessione P0 precedente): **8/8 test backend PASS**, confronto SHA-256 non-cover invariato per tutti i 437 documenti, 54 risposte media hero/thumb HTTP 200 WebP per i 27 ID aggiornati. Home, categorie e 5 lettori verificati in anteprima mobile 390×844 senza errori console. Report `test_reports/iteration_1.json`, suite `backend/tests/test_iter33_cover_resume_readonly.py`. Nessuna chiamata AI nei test, nessun processo di generazione rimasto attivo. Verifica fisica su dispositivo dell'utente non eseguita.

## Controllo qualità contenuti + preparazione nuove storie (sessione corrente)
- Richiesta utente: prima QA pignolo (storie poco interessanti, durata 3–5 min, sempre 6 capitoli), poi nuove storie per le categorie indietro (obiettivo **40 per categoria**), stessa gerarchia e livello alto, niente banalità.
- **Esito QA**: 437/437 con 6 capitoli e obiettivo (lezioni) presente. **73 contenuti (tutto il lotto v8) fuori durata: 44 a 6 min, 29 a 7 min** → da accorciare a ≤5 min IT+EN con `trim_stories.py` (ora `MAX_MINUTES=5`, `TARGET_CHARS=3200`; riscrive anche `v8_content.json`/`v9_content.json`). Non ancora eseguito: **Universal Key a budget 0** ("Budget has been exceeded").
- **18 contenuti ritirati** (approvato dall'utente): 16 doppioni (tenuta la versione migliore) + 2 deboli (zucchero filato, fare la valigia). Elenco e motivi in `backend/retired_stories.py`; `server.py` li filtra dal seed e al boot li sposta in `stories_retired` (recuperabili, nessuna cancellazione). Catalogo ora **419** (cultura 27, economia 27, geografia 27, arte 28, corpo-umano 31, natura 35, storia 37, spazio/animali/psicologia 38, tecnologia 40, scienza 53). Tenute volutamente entrambe le storie sul "tempo che vola" (domande diverse).
- **74 nuovi argomenti pronti** in `backend/v9_topics.py` (41 curiosità + 33 mini lezioni; cultura 13, economia 13, geografia 13, arte 12, corpo-umano 9, natura 5, storia 3, animali/spazio/psicologia 2) → porta tutte le categorie a 40. Pipeline pronta: `generate_v9.py` (GPT-5.4, controllo durata ≤5 min per lingua, checkpoint `v9_content.json`) → `seed_pack_v9.py` (già nel seed) → copertine con `generate_covers.py`.
- **Prossimi passi appena c'è credito** (ordine): 1) `python trim_stories.py` (146 narrazioni); 2) `python generate_v9.py`; 3) riavvio backend (seed v9); 4) `python generate_covers.py --concurrency 1` per le 74 nuove; 5) verifica durate/copertine e test.
- Test `tests/test_iter25_curiosita_migration.py` aggiornato ai nuovi conteggi (419, 24 legacy attivi). Restano failure pre-esistenti non legate a questa sessione (snapshot di ambienti precedenti).

## Accorciamento v8 (parziale) + badge "Nuova"
- `trim_stories.py` lanciato dopo la ricarica: la Universal Key aveva solo ~1 $ → **58 narrazioni accorciate su 146** (26 storie complete IT+EN, 6 solo in una lingua, 41 non toccate; **47 storie ancora sopra i 5 min**). Rilanciare `python trim_stories.py` (riparte dai soli testi ancora lunghi; backup in `stories_backup_pre_trim`, v8_content.json aggiornato). Qualità verificata a campione: stessi fatti, prosa più densa.
- Badge "Nuova"/"New": ora anche nella pillola della card Home (`story-meta-chips.tsx`, segmento `-new`) e nella lista Salvati; browse localizzato con `t.new_badge`. Backend: `NEW_BADGE_DAYS = 21` (badge visibile anche ai free dopo i 7 giorni di early access premium). Test: `backend/tests/test_new_badge.py` (5/5), browse verificato via UI. Home non verificabile in automazione perché `ALWAYS_SHOW_ONBOARDING = true` in `app/index.tsx` (impostazione pre-esistente).

## Home — barra "storie lette" ridisegnata
- `home-reading-progress.tsx`: stessa grammatica delle tessere categoria (vetro dark-navy ONB, bordo chiaro, riga luminosa, oggetto 3D "libri"), barra di avanzamento cyan→viola, contatore "n / 20", chevron → statistiche. Allineata ai bordi della griglia (`gridPadding`). Testi a 0 letture: "La tua prima storia ti aspetta / Apri una card qui sopra per iniziare" (i18n `home_read_count_zero`, `home_read_caption_zero`).

## Home — "Riprendi da dove eri" + traguardi di lettura
- **Bug fix lettore** (`app/deep-dive/[id].tsx`): il segnalibro di lettura veniva cancellato dopo 5 s (quando la storia viene "consumata" per i limiti) → la card "riprendi" non compariva mai. Ora il progresso si salva a ogni pagina e si cancella solo arrivando in fondo.
- `src/components/resume-card.tsx`: card in vetro sotto il mazzo Home (copertina, pillola %, barra cyan→viola, tasto play), allineata alla griglia; `showResume` non esclude più le storie "consumate".
- Traguardi 20/40/60…: `src/milestones.ts` (memoria `pause.milestone.<uid>`, nessun festeggiamento retroattivo al primo avvio) + `src/components/milestone-celebration.tsx` (modal vetro, medaglia animata con numero, coriandoli reanimated, haptic Success, livelli: 20 Lettore curioso, 40 Esploratore di idee, 60 Mente aperta, 80 Collezionista di storie, 100 Centurione, oltre Maestro della pausa; CTA "Continua a scoprire" + link statistiche). Barra Home: obiettivo sempre il prossimo multiplo di 20.
- Testato E2E (iteration_3): resume, fine lettura, celebrazione una sola volta, barra 20/40.

## Onboarding — passo profilo collegato + saluto in Home (2026-09-25)
- **Ripristino app da GitHub (PAUSE-5.17)**: codice estratto in `/app`, `.env` di ambiente preservati, `EMERGENT_LLM_KEY` aggiunto, backend (12 categorie, 419 storie, copertine da Object Storage) + Expo attivi, preview verificata.
- **Lavoro a metà completato**: il componente `src/components/onboarding-profile.tsx` (schermata "Raccontaci qualcosa di te": nome/nickname, genere, età 13–120) era stato creato nell'ultimo commit ma **mai collegato** al flusso. Ora è integrato in `app/onboarding.tsx` come **step 1** (subito dopo la presentazione): `STEPS=4` (0 intro · 1 profilo · 2 formato · 3 argomenti). Tutti i campi sono **facoltativi** (nome non obbligatorio); alla fine dell'onboarding si salvano solo i campi compilati via `POST /api/user/profile` (`display_name`, `gender`, `age`).
- **Saluto personalizzato in Home** (`app/(tabs)/discover.tsx`): header mostra "Ciao/Hi, {primo nome}" a destra del logo, nome in `colors.brand` (accento adattivo chiaro/scuro) con font display. Nuova chiave i18n `greeting` (IT/EN). Scelta di design: solo in Home (non su tutte le schermate); il nome resta comunque visibile nella scheda Profilo.
- Verificato E2E sul web: intro → profilo (nome "Marco") → formato → argomenti → Home con "Hi, Marco".


## Onboarding profilo — rifatto fedele al mockup (2026-09-25, fork)
- Bug: `KeyboardAvoidingView`/`ScrollView` usavano `styles.root` (sfondo opaco) e coprivano lo sfondo `onboarding-profile-bg.jpg` → schermata nera. Ora `styles.fill` trasparente.
- Layout come mockup: freccia indietro e logo sulla stessa riga, titolo con "te" in gradiente, 3 schede glass (bordo blu/ciano + filo luminoso), select età a angoli arrotondati, CTA gradiente identica alla presentazione, **3 puntini stile presentazione** (secondo attivo). Spazi distribuiti con spacer flessibili (scroll su schermi bassi).
- Rimosse props `stepIndex/steps` da `OnboardingProfile`.
- Iterazione 2 (stile container "identico al mockup"): colori campionati dal PNG (fill navy rgba(4,26,52,.86)→rgba(8,38,72,.82), bordo 1px rgba(24,110,190,.62), filo ciano #2BB4FF sul fondo, raggio 28, gap 12, cerchio icona 50 #0F223A, chip pill 1px, chip selezionata gradiente #064B80→#0E88B6 con bordo ciano, select età raggio 14 fill #041120). Confronto side-by-side con `analyze_file_tool` → 98/100 "replica fedele".
- Sfondo stabile: cornice congelata con `Dimensions.get("window")` al primo render (niente `useWindowDimensions`), KAV `behavior` solo su iOS → su Android l'apertura/chiusura tastiera non ridimensiona più l'immagine.

## Dati personali — correzione esclusivamente visiva (richiesta corrente)
- L'utente ha rifiutato la precedente interpretazione blu/opaca: la valutazione «98/100» precedente NON costituisce approvazione. Vincoli: non cambiare testi, titolo, CTA, ordine, funzioni, salvataggio, navigazione né immagine.
- Resa grafica modificata solo in `frontend/src/components/onboarding-profile.tsx`; in `app/onboarding.tsx` aggiunto un contenitore di ritaglio esclusivamente al passo profilo per confinare la transizione d'ingresso. Nessuna modifica a API, altre schermate, funzioni, dipendenze o palette condivisa.
- Schede: un solo gradiente quasi nero traslucido (.40–.56), eliminata la doppia superficie che portava l'opacità effettiva a ~.97; bordo cyan .22, niente linea neon inferiore, niente glow a riposo; focus .34 con alone .05.
- Icone 36px anziché 50px con riempimento e bordi attenuati; genere con opzioni ravvicinate e selezione cyan .07 anziché gradiente blu opaco; select età scura .18 con bordo .10. Pannello età armonizzato near-black.
- Overlay centrale/inferiore meno coprente per mantenere visibile la fotografia. Asset, ritaglio, cornice congelata e gestione tastiera INVARIATI. Titolo/testi/CTA INVARIATI.
- Riferimenti recuperati in `memory/profile_visual/reference.png` (mockup) e `reference-secondary.png` (sfondo originale); copia pre-intervento del componente nella stessa cartella.
- Verifiche: lint componente e wrapper PASS; backend 5/5 PASS; E2E onboarding con POST reale e persistenza confermata; interazioni/scroll verificati a 390×844, 320×568, 430×932. Report `test_reports/iteration_4.json`.
- Follow-up della segnalazione overflow: wrapper limita il passo profilo; il primo ricontrollo includeva anche frame della Intro. Campionamento corretto sul solo profilo: **24 frame, massimo 390/390px**, nessun overflow. Fonte `memory/profile_visual/verification.log`.
- Verifica finale a transizione conclusa, in italiano: nome/genere/età/Continua funzionanti; coordinate/dimensioni dello sfondo identiche dopo focus e selezioni e dopo riduzione viewport da 390×844 a 390×544. Questa è una simulazione browser, non una verifica della tastiera fisica iOS/Android.
- Confronto diretto mockup/prima/dopo archiviato in `memory/profile_visual/comparison.png`: ridotti pannelli blu, opacità e bagliori; fotografia visibile attraverso le superfici. Nessuna dichiarazione pixel-perfect; resta all'utente la valutazione estetica finale.
- P0 completato. P1: verifica su dispositivo fisico dell'utente. P2: nessuna nuova funzionalità richiesta.

## Rifinitura successiva — solo riflesso blu dei bordi
- Feedback: «Meglio ma i bordi dei container non hanno quell'effetto blu come nell'allegato». Conferma esplicita: riflesso blu sfumato con piccoli accenti cyan, più evidente ai lati/angoli, **senza alone neon**, interno invariato.
- In `onboarding-profile.tsx` il bordo uniforme delle sole tre card è sostituito da un contorno SVG 1.2px, gradiente blu/cyan con intensità variabile; `fill="none"`, nessun nuovo riempimento né shadow. Bordo nativo trasparente conserva le esatte misure; stroke leggermente interno per evitare clipping.
- `GlassOutline` ha ID gradiente univoci per card, `pointerEvents="none"`, dimensioni aggiornate solo quando cambia il layout. Il focus aumenta leggermente l'intensità del contorno senza alone.
- Interni, icone, opzioni, overlay, immagine fissa, spaziature, titolo, CTA e tutte le funzioni invariati rispetto alla correzione approvata come «meglio».
- Lint e self-test 390×844 PASS; testing mirato PASS anche a 320×568 (report `test_reports/iteration_5.json`). Bordi allineati, nessun overflow, campi e navigazione funzionanti, sfondo stabile, nessun errore runtime nuovo.
- Screenshot italiano stabile in `memory/profile_visual/blue-border-result-it.jpeg`; confronto allegato/prima/dopo in `blue-border-comparison.png`. La difficoltà dell'agente testing a forzare la lingua nel browser è solo del suo setup: tramite il selettore esistente `lang-it` e `reset-onboarding` l'italiano è stato verificato correttamente, senza modifiche i18n.
- P0 completato; P1 resta approvazione visiva sul telefono dell'utente. Nessuna funzionalità nuova richiesta.

## Nuove storie v9 — regola "storia + copertina subito" (sessione corrente)
- **Nuova regola permanente (utente)**: ogni nuovo contenuto si produce testo + copertina nella stessa esecuzione; mai storie senza immagine. Pipeline `backend/produce_v9.py` (testo GPT-5.4 via `generate_v9.ask` → inserimento in `stories` con `created_at` reale e `audio_minutes_est` → copertina Gemini con `prompt_for`/stile di `generate_covers.py` → `covers/<id>.webp` + Object Storage). Se la copertina fallisce il documento viene rimosso dal DB (testo conservato in `v9_content.json`). `seed_pack_v9.py` semina solo le voci con copertina locale in `covers/`. Ordine: sempre la categoria attualmente più indietro. Log `memory/v9_production.log`. Riprendere con `cd /app/backend && python produce_v9.py` (`--list` per lo stato).
- Controllo anti-doppioni sui 74 argomenti: sostituiti 6 troppo vicini al catalogo (biglietti aerei→recessione; TAN/TAEG→leggere una bolletta; fotografare col telefono→come nasce un film d'animazione; climi/quando partire→perché le persone migrano + orientarsi in una metropoli; ghiaccio blu→brezza di mare; Terra piatta nel Medioevo→i Romani e il vapore).
- Fix `generate_v9.py`: `validate` di v8 esigeva ≥60 parole/capitolo in conflitto con il target ≤5 min → `validate_v9` (≥50 parole, range 60-75). Mai eseguito prima.
- Fix `server.py` `ensure_seed`: i contenuti `v9-*` non vengono più retrodatati dalla migrazione early-access (tenevano `created_at` vecchio → niente badge "Nuova"/early access). Test `test_new_badge.py` aggiornato a `>= 10` nuove.
- **Prodotti 11/74** (cultura 3, economia 3, geografia 3, arte 2), tutti con copertina e durata 4–5 min IT / 4–5 EN: catalogo **430**. Due copertine ritoccate senza AI (Venezia: rimossa cornice; lutto: rimossa scritta "PAUSE"), originali in `memory/cover_batches/v9_originals/`.
- **Arresto: Universal Key a budget esaurito** (max 1.0 $, costo ~0,10 $ per storia+copertina). Restano 63 argomenti (~6,5 $) + `trim_stories.py` per i 47 v8 ancora >5 min. Il testo di "Come nasce un'isola" è già in `v9_content.json` (solo copertina mancante → ripubblicata alla ripresa).

## Introduzione — barra unica dei tre badge (25 settembre 2026)
- Richiesta: seguire il riferimento allegato (pillola navy, tre sezioni icona+valore e separatori sottili), leggermente più grande; mantenere **gli stessi asset 3D attuali**.
- `src/components/story-info-grid.tsx`: sostituite le tre tessere colorate con un solo contenitore da 56pt, bordo tenue, due divisori verticali sfumati, icone a sinistra del testo. Riutilizzati KindIcon, CategoryArtMark e kind-clock.png; nessun nuovo asset o rigenerazione. Valori lunghi possono occupare due righe sui telefoni stretti. Home StoryMetaChips invariata.
- Verifica screenshot e navigazione Leggi: 320/390/430px, IT/EN, anche Corpo umano. Nessun overflow; copertine e dati reali invariati.

## Home — sfondo discreto e categorie condivise con onboarding (25 settembre 2026)
- Richiesta utente: stessa fotografia del passo nome in Home, meno vistosa; schermata Argomenti raggiunta da Home con Curiosità/Mini lezioni e componente condiviso con onboarding, non due copie.
- `src/components/home-backdrop.tsx`: riusa `onboarding-profile-bg.jpg`, fermo dietro ai contenuti, opacità 0.5 dark/0.2 light e velo progressivo del tema. Non intercetta tocchi; layout/carte/iconografia della Home e schermata del nome invariati.
- `src/components/topic-picker.tsx`: **TopicPicker + TopicsBackdrop** realmente usati da `app/onboarding.tsx` e `app/(tabs)/explore.tsx`. Unica fonte per selettori formato, titolo, hint dinamico, spaziatura, griglia categorie e sfondo. Onboarding conserva passi/swipe/puntini/CTA; Explore conserva navigazione tab, LimitBadge, contatore e autosave.
- `onboarding-modes.tsx`: selettori condivisi con testID distinti in Explore; stessa regola `toggleContentMode` (almeno un formato attivo durante scelta argomenti). Layout adattivo su telefoni stretti; `CategoryGrid` supporta disabled durante salvataggio.
- `src/hooks/use-topic-preferences.ts`: usa API esistenti `/api/user/interests` e `/api/user/content-modes`, una scrittura alla volta; UI locale reattiva, cache utente aggiornata solo alla conferma, ripristino + avviso localizzato se fallisce. Nessun backend nuovo. `discover.tsx` include content_modes nella chiave di reset del mazzo, così al ritorno mostra il formato appena salvato.
- Accessibilità: `aria-checked` esplicito nei selettori formato e switch Profilo, etichetta accessibile degli switch. Il Profilo ha solo queste due props aggiunte, nessuna modifica grafica/logica.
- Test: report `test_reports/iteration_6.json`; backend mirato **5/5 PASS**, frontend responsive 320/390/430, temi chiaro/scuro, IT/EN, cambio formato/conteggi/hint, persistenza, sync Profilo, cambio mazzo Home, tap rapidi, errore salvataggio/recupero e onboarding completo PASS. Self-test finale POST reale lessons-only e `aria-checked` true/false nei controlli Explore/Profilo PASS. Nessuna chiamata AI/audio/pagamento; nessuna modifica ai contenuti o asset.
- Lint file modificati PASS, nessun errore TypeScript nei file modificati. **Il controllo TypeScript globale conserva errori preesistenti in altri file**; non è stato dichiarato verde né eseguito un refactoring fuori richiesta. Warning Expo web preesistenti non bloccanti. Screenshot in `test_reports/ui_iter6/`.
- P0: richieste UI completate e verificate. P1: valutazione visiva sul telefono fisico dell'utente (non eseguita in questa sessione). P2: generazione v9 ancora sospesa al credito e vecchi test conteggi categoria fuori scope; non rilanciati automaticamente.
