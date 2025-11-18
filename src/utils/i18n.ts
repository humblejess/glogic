export type Language = 'en' | 'zh-CN' | 'zh-TW' | 'fr' | 'es';

export const supportedLanguages: Language[] = ['en', 'zh-CN', 'zh-TW', 'fr', 'es'];

export const languageNames: Record<Language, string> = {
  'en': 'English',
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文',
  'fr': 'Français',
  'es': 'Español',
};

export function getLanguageFromPath(pathname: string): Language {
  const path = pathname.split('/')[1];
  if (supportedLanguages.includes(path as Language)) {
    return path as Language;
  }
  return 'en';
}

export function getLocalizedPath(path: string, lang: Language): string {
  if (path === '/') {
    return `/${lang}`;
  }
  return `/${lang}${path}`;
}

