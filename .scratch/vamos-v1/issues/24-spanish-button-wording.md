# 24: Spanish wording for Follow-up and Reveal

**What to build:** Change two Spanish button labels that read wrongly when tested on the phone:

- **Talk follow-up button:** "Otra pregunta" → **"Más"**. "Otra pregunta" sounds like it moves on to a different question, but the button adds a follow-up on the same one. The list of follow-ups keeps the accessible label "Más preguntas".
- **Trivia Reveal button:** "Revelar" → **"Respuesta"**. "Revelar" is a literal translation and doesn't sound natural. "Respuesta" fits the round main button.

Only the Spanish strings in `src/ui/strings.ts` change; English stays "Follow-up" and "Reveal". Update the app-level tests that use the old labels.

**Blocked by:** none (06 is done)

**Status:** done

- [x] Talk in Spanish shows "Más" on the follow-up button, and it still reveals follow-ups one at a time
- [x] Trivia in Spanish shows "Respuesta" on the main button before reveal (and "Siguiente" after)
- [x] English labels unchanged
- [x] App-level tests updated to the new labels

## Comments

- Only `es.reveal` and `es.followUp` in `src/ui/strings.ts` changed. The Spanish app-level tests now also check that the follow-ups come one at a time under "Más", and that the main button becomes "Siguiente" after the reveal and after the last follow-up.
- Review note for a human: "Más" alone is a vague name for a screen reader. Kept as the ticket asks.
