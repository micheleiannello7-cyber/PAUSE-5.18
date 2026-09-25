#====================================================================================================
# START - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================

# THIS SECTION CONTAINS CRITICAL TESTING INSTRUCTIONS FOR BOTH AGENTS
# BOTH MAIN_AGENT AND TESTING_AGENT MUST PRESERVE THIS ENTIRE BLOCK

# Communication Protocol:
# If the `testing_agent` is available, main agent should delegate all testing tasks to it.
#
# You have access to a file called `test_result.md`. This file contains the complete testing state
# and history, and is the primary means of communication between main and the testing agent.
#
# Main and testing agents must follow this exact format to maintain testing data. 
# The testing data must be entered in yaml format Below is the data structure:
# 
## user_problem_statement: {problem_statement}
## backend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.py"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## frontend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.js"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## metadata:
##   created_by: "main_agent"
##   version: "1.0"
##   test_sequence: 0
##   run_ui: false
##
## test_plan:
##   current_focus:
##     - "Task name 1"
##     - "Task name 2"
##   stuck_tasks:
##     - "Task name with persistent issues"
##   test_all: false
##   test_priority: "high_first"  # or "sequential" or "stuck_first"
##
## agent_communication:
##     -agent: "main"  # or "testing" or "user"
##     -message: "Communication message between agents"

# Protocol Guidelines for Main agent
#
# 1. Update Test Result File Before Testing:
#    - Main agent must always update the `test_result.md` file before calling the testing agent
#    - Add implementation details to the status_history
#    - Set `needs_retesting` to true for tasks that need testing
#    - Update the `test_plan` section to guide testing priorities
#    - Add a message to `agent_communication` explaining what you've done
#
# 2. Incorporate User Feedback:
#    - When a user provides feedback that something is or isn't working, add this information to the relevant task's status_history
#    - Update the working status based on user feedback
#    - If a user reports an issue with a task that was marked as working, increment the stuck_count
#    - Whenever user reports issue in the app, if we have testing agent and task_result.md file so find the appropriate task for that and append in status_history of that task to contain the user concern and problem as well 
#
# 3. Track Stuck Tasks:
#    - Monitor which tasks have high stuck_count values or where you are fixing same issue again and again, analyze that when you read task_result.md
#    - For persistent issues, use websearch tool to find solutions
#    - Pay special attention to tasks in the stuck_tasks list
#    - When you fix an issue with a stuck task, don't reset the stuck_count until the testing agent confirms it's working
#
# 4. Provide Context to Testing Agent:
#    - When calling the testing agent, provide clear instructions about:
#      - Which tasks need testing (reference the test_plan)
#      - Any authentication details or configuration needed
#      - Specific test scenarios to focus on
#      - Any known issues or edge cases to verify
#
# 5. Call the testing agent with specific instructions referring to test_result.md
#
# IMPORTANT: Main agent must ALWAYS update test_result.md BEFORE calling the testing agent, as it relies on this file to understand what to test next.

#====================================================================================================
# END - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================



#====================================================================================================
# Testing Data - Main Agent and testing sub agent both should log testing data below this section
#====================================================================================================
# ⚠️ PAUSE: prima di modificare/testare leggere /app/memory/CONSTITUTION.md (Costituzione tecnica vincolante: minimum change, niente rigenerazione asset, niente AI a runtime, identità visiva dark-navy/cyan/glass). Rispondere in italiano.

user_problem_statement: "Correggere SOLO il design visivo della schermata Dati personali: superfici glass quasi nere più trasparenti, bordi/glow attenuati, icone piccole e controlli integrati. Invariati testi/titolo/CTA/campi/funzioni/navigazione/salvataggio/immagine. Confrontare il mockup allegato."
frontend:
  - task: "Correzione materiale glass Dati personali e regressione delle interazioni"
    implemented: true
    working: true
    file: "frontend/src/components/onboarding-profile.tsx"
    stuck_count: 1
    priority: "high"
    needs_retesting: false
    status_history:
      - working: false
        agent: "user"
        comment: "Precedente risultato rifiutato: container troppo blu/opachi, glow e bordi eccessivi, box dentro box."
      - working: "NA"
        agent: "main"
        comment: "Una superficie traslucida .40-.56, bordo .22, nessun glow a riposo né filo neon; icone 36px, selezione cyan .07, età .18; overlay più leggero. Cornice background fissa e funzioni invariate. Lint PASS. Screenshot mostra correzione, ma la routine screenshot ha avuto un timeout sull'attesa font prima dei test interattivi: eseguire test completi."
      - working: true
        agent: "testing"
        comment: "Report iteration_4: interazioni, responsive e persistenza PASS. Segnalato overflow transitorio durante ingresso."
      - working: true
        agent: "main"
        comment: "Aggiunto ritaglio solo al passo profilo. Ricontrollo con campionamento esclusivo profilo: 24 frame, massimo 390/390px, nessun overflow. Focus/selezione/modal e viewport ridotto non cambiano sfondo. Screenshot italiani a transizione conclusa e confronto mockup archiviati in memory/profile_visual. Nessun errore render. Tastiera nativa non testata."
backend:
  - task: "Regressione salvataggio profilo esistente a fine onboarding"
    implemented: true
    working: true
    file: "frontend/app/onboarding.tsx (non modificato)"
    priority: "high"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Nessuna modifica backend o persistenza: verificare E2E con utente anonimo creato solo dal browser di test, senza toccare utenti esistenti."
      - working: true
        agent: "testing"
        comment: "Backend 5/5 PASS; POST /api/user/profile reale intercettato e GET /api/user/{uid} con display_name/gender/age persistiti. Nessuna regressione."
metadata:
  created_by: "main_agent"
  version: "1.0"
  test_sequence: 1
  run_ui: true
test_plan:
  current_focus:
    - "Screenshot in italiano 390×844 e 320×568/360×800: superfici, leggibilità, nessun overflow"
    - "Nome, tre scelte genere, apertura/selezione/chiusura età, focus e sfondo fisso"
    - "Indietro/presentazione, avanti/formati/argomenti, salvataggio profilo al termine"
  stuck_tasks: []
  test_all: false
  test_priority: "high_first"
agent_communication:
  - agent: "main"
    message: "Riferimenti /app/memory/profile_visual/reference.png e reference-secondary.png. Prima versione in onboarding-profile.before.tsx. Screenshot corretto /root/.emergent/automation_output/20260925_131427/final_20260925_131427.jpeg. Nessun login/credenziali richiesti. Non modificare codice applicativo né chiamare generazione AI/TTS/pagamenti. Usare locale it-IT nel browser e URL esterno .env. Distinguere test browser da tastiera nativa non testabile."
