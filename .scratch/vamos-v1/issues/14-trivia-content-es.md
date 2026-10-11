# 14: Trivia content (Uruguayan Spanish)

**What to build:** A separate translation pass adding Uruguayan Spanish (voseo, local vocabulary) to every Trivia item: question, answer, options and fun fact. Adapt rather than translate literally where needed (e.g. a wordplay question that doesn't work in Spanish gets a note in the PR, not a broken translation). Names and places use their usual Spanish forms.

**Blocked by:** 13 (Trivia content (English), batch 2)

**Status:** done

- [x] Every Trivia item has a complete `es` block
- [x] Voseo and Uruguayan vocabulary used consistently
- [x] Answers still correct and options still unambiguous in Spanish
- [x] Items that don't translate well are listed in the PR
- [x] Content check passes with zero items pending translation

## Comments

- Added `es` blocks to the 84 items from tickets 12 and 13. All 98 Trivia items now have Spanish; the content check reports zero pending.
- Voseo where the question speaks to the player ("Si contás…", "Si sumás…"); local vocabulary such as palta, arvejas, porotos, alargue, juez, computadora, chico.
- Names use their Spanish forms (Ciudad Gótica, Metrópolis, El rey león, La noche estrellada, Cien años de soledad, El cantor de jazz).
- Items that don't translate cleanly, kept by adapting rather than breaking them:
  - `trv-spo-00003` (tennis "love"): the Spanish asks for the English word, since Spanish has no equivalent.
  - `trv-lan-00005` (palindrome): example swapped to «reconocer» and «Anita lava la tina».
  - `trv-sci-00005` (gold symbol): the wrong option "Go" became "Or" to match Spanish "oro".
  - `trv-art-00007` (Moby-Dick): quoted as «Llámenme Ismael», the Latin American rendering.
  - `trv-gen-00006` (cards): asks about a «mazo de póker», since in Uruguay the default deck is the Spanish one with 48 or 40 cards.
  - `trv-fdr-00006` (choux): the fact adds that locally it's called masa bomba.
