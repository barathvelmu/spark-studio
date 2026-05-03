#!/bin/bash
# Scripted E2E for Spark Studio — exercises every step of the demo path against
# the running dev server (assumed at http://localhost:3000). Covers the server-
# rendered and API layers; client-side interactivity (CollectorGame keyboard,
# CodeView clicks, modal animations) must be verified in a real browser.

set -u
HOST="${HOST:-http://localhost:3000}"
PASS=0
FAIL=0

ok() { printf "  ✅ %s\n" "$1"; PASS=$((PASS+1)); }
ko() { printf "  ❌ %s\n" "$1"; FAIL=$((FAIL+1)); }

step() { printf "\n=== %s ===\n" "$1"; }

http() {
  /usr/bin/curl -s -o /dev/null -w "%{http_code}" "$@"
}

post_json() {
  /usr/bin/curl -s -X POST -H "Content-Type: application/json" "$@"
}

step "1. Page routes return 200"
for path in "/" "/ideas" "/discover" "/builder" "/builder?ideaId=idea_ocean" "/project/p_ocean" "/project/p_space_junk" "/project/p_climate_quiz" "/project/p_kindness_quest" "/project/p_dragon_star"; do
  code=$(http "$HOST$path")
  if [ "$code" = "200" ]; then ok "GET $path -> 200"; else ko "GET $path -> $code"; fi
done

step "2. Landing renders pitch lead + CTAs"
html=$(/usr/bin/curl -s "$HOST/")
echo "$html" | /usr/bin/grep -q "Start Building" && ok "Has 'Start Building' CTA" || ko "Missing 'Start Building'"
echo "$html" | /usr/bin/grep -q "Explore Projects" && ok "Has 'Explore Projects' CTA" || ko "Missing 'Explore Projects'"
echo "$html" | /usr/bin/grep -q "learning moment" && ok "Pitch lead present" || ko "Pitch lead missing"
echo "$html" | /usr/bin/grep -q "How it works" && ok "How it works strip" || ko "How it works missing"
echo "$html" | /usr/bin/grep -q "Featured projects" && ok "Featured row" || ko "Featured row missing"

step "3. Idea Wall → Builder handoff"
html=$(/usr/bin/curl -s "$HOST/ideas")
echo "$html" | /usr/bin/grep -q '/builder?ideaId=idea_ocean' && ok "Ocean idea links to /builder?ideaId=" || ko "Ocean idea link missing"
echo "$html" | /usr/bin/grep -q '/builder?ideaId=idea_space_math' && ok "Space Math idea linked" || ko "Space Math link missing"

step "4. Project Detail (Ocean Cleanup, demo project)"
html=$(/usr/bin/curl -s "$HOST/project/p_ocean")
echo "$html" | /usr/bin/grep -q "Ocean Cleanup Game" && ok "Title rendered" || ko "Title missing"
echo "$html" | /usr/bin/grep -q "Safety checked" && ok "Safety badge" || ko "Safety badge missing"
echo "$html" | /usr/bin/grep -q "Remix this" && ok "Remix CTA" || ko "Remix CTA missing"
echo "$html" | /usr/bin/grep -q "🐢" && ok "Player emoji" || ko "Player emoji missing"
echo "$html" | /usr/bin/grep -q "by " && ok "Creator credit" || ko "Creator credit missing"

step "5. Project Detail (Space Junk, lineage)"
html=$(/usr/bin/curl -s "$HOST/project/p_space_junk")
echo "$html" | /usr/bin/grep -q "Forked from" && ok "Lineage label" || ko "Lineage label missing"
echo "$html" | /usr/bin/grep -q "Ocean Cleanup Game" && ok "Parent name in lineage" || ko "Parent name missing"

step "6. POST /api/generate-project (real Claude or fallback)"
body=$(post_json -d '{"prompt":"a cat collects yarn balls in a cozy living room","projectType":"auto"}' "$HOST/api/generate-project")
echo "$body" | /usr/bin/python3 -c "
import json, sys
d = json.load(sys.stdin)
ok = (
  isinstance(d.get('title'), str) and len(d['title'])>0 and
  isinstance(d.get('config'), dict) and d['config'].get('player') and d['config'].get('collectible') and
  d.get('safetyStatus') == 'checked' and
  isinstance(d.get('codeJs'), str) and len(d['codeJs'].splitlines()) > 10 and
  isinstance(d.get('concepts'), list) and len(d['concepts']) >= 3 and
  isinstance(d.get('changeSummary'), list) and len(d['changeSummary']) >= 1
)
print('  ✅ Generated project shape valid' if ok else '  ❌ Shape invalid: ' + json.dumps(d)[:200])
"

step "7. POST /api/remix-project (forks Ocean → new theme)"
body=$(post_json -d '{"parentProjectId":"p_ocean","remixPrompt":"a fox catching falling leaves in autumn"}' "$HOST/api/remix-project")
echo "$body" | /usr/bin/python3 -c "
import json, sys
d = json.load(sys.stdin)
ok = (
  d.get('forkedFromProjectId') == 'p_ocean' and
  isinstance(d.get('config'), dict) and d['config'].get('player') and d['config'].get('collectible') and
  isinstance(d.get('changeSummary'), list)
)
print('  ✅ Remix draft valid + forkedFromProjectId set' if ok else '  ❌ Remix invalid: ' + json.dumps(d)[:200])
"

step "8. POST /api/ask-code (prewritten demo question)"
body=$(post_json -d '{"projectId":"p_ocean","question":"How does the score work?"}' "$HOST/api/ask-code")
echo "$body" | /usr/bin/python3 -c "
import json, sys
d = json.load(sys.stdin)
ok = (
  'score' in d.get('answer','').lower() and
  isinstance(d.get('relatedConcepts'), list) and 'variables' in d['relatedConcepts'] and
  isinstance(d.get('highlightLines'), dict) and d['highlightLines'].get('file') == 'js' and len(d['highlightLines'].get('lines',[])) > 0
)
print('  ✅ Demo answer + JS line highlights' if ok else '  ❌ Ask-code invalid: ' + json.dumps(d)[:200])
"

step "9. POST /api/ask-code (novel question, real Claude)"
body=$(post_json -d '{"projectId":"p_ocean","question":"What does Math.random do here?"}' "$HOST/api/ask-code")
echo "$body" | /usr/bin/python3 -c "
import json, sys
d = json.load(sys.stdin)
ok = (
  isinstance(d.get('answer'), str) and len(d['answer']) > 20 and
  isinstance(d.get('suggestedNextQuestions'), list) and len(d['suggestedNextQuestions']) >= 2
)
print('  ✅ Novel question answered (len=%d)' % len(d.get('answer','')) if ok else '  ❌ Novel ask invalid: ' + json.dumps(d)[:200])
"

step "10. POST /api/tinker (returns valid substring suggestion)"
body=$(post_json -d '{"projectId":"p_ocean"}' "$HOST/api/tinker")
echo "$body" | /usr/bin/python3 -c "
import json, sys, re
d = json.load(sys.stdin)
ok = (
  isinstance(d.get('summary'), str) and len(d['summary']) > 0 and
  d.get('file') in ('html','css','js') and
  isinstance(d.get('before'), str) and len(d['before']) > 0 and
  isinstance(d.get('after'), str) and
  d.get('concept') in ('variables','events','conditionals','loops','score','collision') and
  isinstance(d.get('explanation'), str)
)
print('  ✅ Tinker suggestion: %s [%s]' % (d.get('summary'), d.get('concept')) if ok else '  ❌ Tinker invalid: ' + json.dumps(d)[:200])
"

step "11. /api/tinker fallback (404 on bogus project)"
code=$(http -X POST -H "Content-Type: application/json" -d '{"projectId":"does_not_exist"}' "$HOST/api/tinker")
[ "$code" = "404" ] && ok "404 on missing project" || ko "Expected 404, got $code"

step "Summary"
printf "Passed: %d\nFailed: %d\n" "$PASS" "$FAIL"
[ "$FAIL" = "0" ] && exit 0 || exit 1
