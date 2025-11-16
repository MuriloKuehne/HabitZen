/**
 * Calcula o nível baseado no XP total
 * Fórmula: floor(sqrt(total_xp / 100)) + 1
 */
export function getLevelFromXP(totalXP: number): number {
  return Math.floor(Math.sqrt(totalXP / 100)) + 1;
}

/**
 * Calcula o XP necessário para alcançar um nível específico
 * Fórmula: (level - 1)^2 * 100
 */
export function getXPForLevel(level: number): number {
  return Math.pow(level - 1, 2) * 100;
}

/**
 * Calcula o XP necessário para o próximo nível
 */
export function getXPForNextLevel(currentLevel: number): number {
  return getXPForLevel(currentLevel + 1);
}

/**
 * Calcula o XP necessário para subir de nível (progresso atual)
 */
export function getXPNeededForNextLevel(
  totalXP: number,
  currentLevel: number
): number {
  const xpForNextLevel = getXPForNextLevel(currentLevel);
  return xpForNextLevel - totalXP;
}

/**
 * Calcula o progresso percentual para o próximo nível
 */
export function getProgressToNextLevel(
  totalXP: number,
  currentLevel: number
): number {
  const xpForCurrentLevel = getXPForLevel(currentLevel);
  const xpForNextLevel = getXPForNextLevel(currentLevel);
  const xpInCurrentLevel = totalXP - xpForCurrentLevel;
  const xpNeededForLevel = xpForNextLevel - xpForCurrentLevel;

  return Math.min(100, Math.max(0, (xpInCurrentLevel / xpNeededForLevel) * 100));
}

