/**
 * Map user level to backend filiere
 * Levels like "L1", "L2", "L3" -> TC1/TC2
 * "Master" -> GLSI/ASR depending on specialty
 */
export function levelToFiliere(level?: string): string | undefined {
  if (!level) return undefined;

  const lower = level.toLowerCase();

  // TC1 levels
  if (["6eme", "5eme", "4eme", "3eme", "l1", "licence 1"].includes(lower)) {
    return "TC1";
  }

  // TC2 levels
  if (["seconde", "premiere", "terminale", "l2", "licence 2"].includes(lower)) {
    return "TC2";
  }

  // GLSI levels
  if (["l3", "licence 3", "master", "master 1", "master 2"].includes(lower)) {
    return "GLSI";
  }

  // Default to TC1 if unknown
  return "TC1";
}
