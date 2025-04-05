import { useState, useEffect } from 'react';
import { db } from '../lib/db';
import { userSettings } from '../db/schema';
import { eq } from 'drizzle-orm';

interface Settings {
  language: string;
  currency: string;
  theme: 'light' | 'dark';
  name?: string;
}

const defaultSettings: Settings = {
  language: 'en',
  currency: 'USD',
  theme: 'light',
};

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    const result = await db.query.userSettings.findFirst({
      where: eq(userSettings.userId, userId),
    });

    if (result) {
      setSettings({
        language: result.language,
        currency: result.currency,
        theme: result.theme as 'light' | 'dark',
        name: result.name || undefined,
      });
    }
    setLoading(false);
  }

  async function updateSettings(newSettings: Partial<Settings>) {
    const userId = localStorage.getItem('userId');
    if (!userId) return false;

    const updatedSettings = { ...settings, ...newSettings };
    
    await db
      .insert(userSettings)
      .values({
        userId,
        ...updatedSettings,
      })
      .onConflictDoUpdate({
        target: userSettings.userId,
        set: updatedSettings,
      });

    setSettings(updatedSettings);
    return true;
  }

  return { settings, loading, updateSettings };
}