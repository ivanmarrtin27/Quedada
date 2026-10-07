import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@quedada/impostor-setup';

export type ImpostorSetup = {
  playerCount: number;
  impostorCount: number;
  names: string[];
  category: string;
};

export async function loadImpostorSetup(): Promise<ImpostorSetup | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as Partial<ImpostorSetup>;
    if (
      typeof data.playerCount !== 'number' ||
      typeof data.impostorCount !== 'number' ||
      !Array.isArray(data.names) ||
      typeof data.category !== 'string'
    ) {
      return null;
    }
    return {
      playerCount: data.playerCount,
      impostorCount: data.impostorCount,
      names: data.names.map((n) => (typeof n === 'string' ? n : '')),
      category: data.category,
    };
  } catch {
    return null;
  }
}

export async function saveImpostorSetup(setup: ImpostorSetup): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(setup));
  } catch {
    // Ignore persistence errors; game still works in memory.
  }
}
