/**
 * Tests for CountryManager - Multi-Country Configuration and Theme Management
 */

import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { CountryManager } from './countryManager.js';

describe('CountryManager', () => {
    let countryManager;
    let mockConsole;

    beforeEach(() => {
        countryManager = new CountryManager();
        
        // Mock console methods
        mockConsole = {
            log: jest.fn(),
            warn: jest.fn(),
            error: jest.fn()
        };
        
        global.console = mockConsole;
        
        // Clear localStorage and mocks
        localStorage.clear();
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('Initialization', () => {
        test('should initialize with default country (Spain)', () => {
            expect(countryManager.currentCountry).toBe('spain');
            expect(countryManager.defaultCountry).toBe('spain');
        });

        test('should load country configuration', () => {
            const countries = countryManager.getAvailableCountries();
            expect(countries).toHaveLength(4);
            expect(countries.map(c => c.code)).toContain('spain');
            expect(countries.map(c => c.code)).toContain('france');
            expect(countries.map(c => c.code)).toContain('germany');
            expect(countries.map(c => c.code)).toContain('italy');
        });

        test('should set up storage key', () => {
            expect(countryManager.storageKey).toBe('european-menu-selected-country');
        });

        test('should load saved country preference on init', () => {
            localStorage.getItem = jest.fn().mockReturnValue('france');
            
            const newManager = new CountryManager();
            
            expect(newManager.currentCountry).toBe('france');
            expect(localStorage.getItem).toHaveBeenCalledWith('european-menu-selected-country');
        });

        test('should use default country when no preference saved', () => {
            localStorage.getItem = jest.fn().mockReturnValue(null);
            
            const newManager = new CountryManager();
            
            expect(newManager.currentCountry).toBe('spain');
        });
    });

    describe('Country Configuration', () => {
        test('should return valid country configuration', () => {
            const config = countryManager.getCountryConfiguration();
            
            expect(config.spain).toBeDefined();
            expect(config.spain.code).toBe('spain');
            expect(config.spain.name).toBe('Spain');
            expect(config.spain.displayName).toBe('Spanish Menu Assistant');
            expect(config.spain.language).toBe('Spanish');
            expect(config.spain.flag).toBe('🇪🇸');
            expect(config.spain.theme).toBeDefined();
            expect(config.spain.csvStructure).toBeDefined();
        });

        test('should have consistent structure for all countries', () => {
            const config = countryManager.getCountryConfiguration();
            const countries = Object.keys(config);
            
            countries.forEach(countryCode => {
                const country = config[countryCode];
                expect(country.code).toBe(countryCode);
                expect(country.name).toBeDefined();
                expect(country.displayName).toBeDefined();
                expect(country.language).toBeDefined();
                expect(country.dataPath).toBeDefined();
                expect(country.flag).toBeDefined();
                expect(country.theme).toBeDefined();
                expect(country.csvStructure).toBeDefined();
            });
        });

        test('should have proper theme colors for each country', () => {
            const config = countryManager.getCountryConfiguration();
            
            Object.keys(config).forEach(countryCode => {
                const theme = config[countryCode].theme;
                expect(theme.primary).toMatch(/^#[0-9A-F]{6}$/i);
                expect(theme.secondary).toMatch(/^#[0-9A-F]{6}$/i);
                expect(theme.accent).toMatch(/^#[0-9A-F]{6}$/i);
                expect(theme.background).toMatch(/^#[0-9A-F]{6}$/i);
                expect(theme.text).toMatch(/^#[0-9A-F]{6}$/i);
            });
        });
    });

    describe('Country Selection', () => {
        test('should set valid country', () => {
            countryManager.setCountry('france');
            
            expect(countryManager.currentCountry).toBe('france');
            expect(countryManager.getCountryInfo().code).toBe('france');
        });

        test('should default to Spain for invalid country', () => {
            countryManager.setCountry('invalid');
            
            expect(countryManager.currentCountry).toBe('spain');
            expect(mockConsole.warn).toHaveBeenCalledWith('Country invalid not found, defaulting to spain');
        });

        test('should dispatch country change event', () => {
            window.dispatchEvent = jest.fn();
            window.CustomEvent = jest.fn().mockImplementation((type, options) => ({
                type,
                detail: options?.detail
            }));
            
            countryManager.setCountry('germany');
            
            expect(window.dispatchEvent).toHaveBeenCalled();
            expect(window.CustomEvent).toHaveBeenCalledWith('countryChanged', {
                detail: {
                    country: 'germany',
                    countryInfo: expect.objectContaining({
                        code: 'germany',
                        name: 'Germany'
                    })
                }
            });
        });

        test('should save country preference when set', () => {
            localStorage.setItem = jest.fn();
            
            countryManager.setCountry('italy');
            
            expect(localStorage.setItem).toHaveBeenCalledWith('european-menu-selected-country', 'italy');
        });
    });

    describe('Country Information', () => {
        test('should return current country info', () => {
            countryManager.setCountry('france');
            const info = countryManager.getCountryInfo();
            
            expect(info.code).toBe('france');
            expect(info.name).toBe('France');
            expect(info.displayName).toBe('French Menu Assistant');
            expect(info.language).toBe('French');
            expect(info.flag).toBe('🇫🇷');
        });

        test('should return available countries list', () => {
            const countries = countryManager.getAvailableCountries();
            
            expect(countries).toHaveLength(4);
            expect(countries[0]).toHaveProperty('code');
            expect(countries[0]).toHaveProperty('name');
            expect(countries[0]).toHaveProperty('displayName');
            expect(countries[0]).toHaveProperty('language');
            expect(countries[0]).toHaveProperty('flag');
        });

        test('should check if country is available', () => {
            expect(countryManager.isCountryAvailable('spain')).toBe(true);
            expect(countryManager.isCountryAvailable('france')).toBe(true);
            expect(countryManager.isCountryAvailable('invalid')).toBe(false);
        });

        test('should return app name for current country', () => {
            countryManager.setCountry('germany');
            expect(countryManager.getAppName()).toBe('German Menu Assistant');
        });

        test('should return flag for current country', () => {
            countryManager.setCountry('italy');
            expect(countryManager.getFlag()).toBe('🇮🇹');
        });

        test('should return theme for current country', () => {
            countryManager.setCountry('spain');
            const theme = countryManager.getTheme();
            
            expect(theme.primary).toBe('#C41E3A');
            expect(theme.secondary).toBe('#FFD700');
        });

        test('should return language for current country', () => {
            countryManager.setCountry('france');
            expect(countryManager.getLanguage()).toBe('French');
        });

        test('should return country display info', () => {
            countryManager.setCountry('germany');
            const displayInfo = countryManager.getCountryDisplayInfo();
            
            expect(displayInfo.name).toBe('Germany');
            expect(displayInfo.displayName).toBe('German Menu Assistant');
            expect(displayInfo.flag).toBe('🇩🇪');
            expect(displayInfo.language).toBe('German');
            expect(displayInfo.code).toBe('germany');
        });
    });

    describe('CSV Structure', () => {
        test('should return CSV structure for current country', () => {
            countryManager.setCountry('spain');
            const structure = countryManager.getCSVStructure();
            
            expect(structure.localLanguage).toBe('Spanish Name');
            expect(structure.english).toBe('English Translation');
            expect(structure.dutch).toBe('Dutch Translation');
            expect(structure.description).toBe('Description');
            expect(structure.pork).toBe('Pork');
            expect(structure.vegetarian).toBe('Vegetarian');
        });

        test('should return localized field names', () => {
            countryManager.setCountry('france');
            
            expect(countryManager.getLocalizedFieldName('localLanguage')).toBe('French Name');
            expect(countryManager.getLocalizedFieldName('english')).toBe('English Translation');
            expect(countryManager.getLocalizedFieldName('nonexistent')).toBe('nonexistent');
        });
    });

    describe('Theme Application', () => {
        test('should apply theme with document available', () => {
            const mockTitle = createMockElement('title');
            const mockHeaderTitle = createMockElement('h1');
            const mockFlagElement = createMockElement('span');
            
            documentMock.querySelector.mockImplementation((selector) => {
                if (selector === 'title') return mockTitle;
                if (selector === '.app-title') return mockHeaderTitle;
                if (selector === '.country-flag:not(.app-title .country-flag)') return mockFlagElement;
                return null;
            });

            countryManager.applyTheme('germany');
            
            expect(documentMock.documentElement.setAttribute).toHaveBeenCalledWith('data-country', 'germany');
            expect(documentMock.documentElement.classList.add).toHaveBeenCalledWith('theme-transition');
        });

        test('should skip theme application when document unavailable', () => {
            const originalDocument = global.document;
            global.document = undefined;
            
            countryManager.applyTheme('france');
            
            expect(mockConsole.log).toHaveBeenCalledWith('🌍 Document not available, skipping theme application');
            
            global.document = originalDocument;
        });

        test('should update country UI elements', () => {
            const mockHeaderTitle = {
                innerHTML: '',
                querySelector: jest.fn().mockReturnValue(null)
            };
            const mockFlagElement = { textContent: '' };
            const mockCountrySelectors = [{
                querySelectorAll: jest.fn().mockReturnValue([{ value: 'italy', selected: false }])
            }];
            
            document.querySelector = jest.fn().mockImplementation((selector) => {
                if (selector === '.app-title') return mockHeaderTitle;
                if (selector === '.country-flag:not(.app-title .country-flag)') return mockFlagElement;
                return null;
            });
            
            document.querySelectorAll = jest.fn().mockImplementation((selector) => {
                if (selector === '.country-selector') return mockCountrySelectors;
                return [];
            });
            
            countryManager.setCountry('italy');
            
            expect(mockHeaderTitle.innerHTML).toContain('Italian Menu Assistant');
            expect(mockHeaderTitle.innerHTML).toContain('🇮🇹');
            expect(mockFlagElement.textContent).toBe('🇮🇹');
        });
    });

    describe('Country Persistence', () => {
        test('should save country preference to localStorage', () => {
            localStorage.setItem = jest.fn();
            
            countryManager.saveCountryPreference('france');
            
            expect(localStorage.setItem).toHaveBeenCalledWith('european-menu-selected-country', 'france');
        });

        test('should load country preference from localStorage', () => {
            localStorage.getItem = jest.fn().mockReturnValue('germany');
            
            const preference = countryManager.loadCountryPreference();
            
            expect(preference).toBe('germany');
            expect(localStorage.getItem).toHaveBeenCalledWith('european-menu-selected-country');
        });

        test('should handle localStorage errors gracefully', () => {
            localStorage.setItem = jest.fn().mockImplementation(() => {
                throw new Error('Storage quota exceeded');
            });
            
            countryManager.saveCountryPreference('spain');
            
            expect(mockConsole.warn).toHaveBeenCalledWith('Failed to save country preference:', expect.any(Error));
        });

        test('should handle localStorage unavailable', () => {
            const originalLocalStorage = global.localStorage;
            global.localStorage = undefined;
            
            countryManager.saveCountryPreference('spain');
            const preference = countryManager.loadCountryPreference();
            
            expect(mockConsole.warn).toHaveBeenCalledWith('localStorage not available, cannot save country preference');
            expect(mockConsole.warn).toHaveBeenCalledWith('localStorage not available, using default country');
            expect(preference).toBeNull();
            
            global.localStorage = originalLocalStorage;
        });
    });

    describe('Country Navigation', () => {
        test('should switch to next country', () => {
            countryManager.setCountry('spain');
            countryManager.switchToNextCountry();
            
            expect(countryManager.currentCountry).not.toBe('spain');
            expect(['france', 'germany', 'italy']).toContain(countryManager.currentCountry);
        });

        test('should cycle through all countries', () => {
            const countries = ['spain', 'france', 'germany', 'italy'];
            countryManager.setCountry('spain');
            
            const visitedCountries = [];
            for (let i = 0; i < countries.length; i++) {
                visitedCountries.push(countryManager.currentCountry);
                countryManager.switchToNextCountry();
            }
            
            expect(visitedCountries).toEqual(countries);
            expect(countryManager.currentCountry).toBe('spain'); // Should cycle back
        });

        test('should reset to default country', () => {
            countryManager.setCountry('italy');
            countryManager.resetToDefault();
            
            expect(countryManager.currentCountry).toBe('spain');
        });
    });

    describe('Configuration Export', () => {
        test('should export current configuration', () => {
            countryManager.setCountry('france');
            const config = countryManager.exportConfiguration();
            
            expect(config.currentCountry).toBe('france');
            expect(config.defaultCountry).toBe('spain');
            expect(config.countryInfo).toBeDefined();
            expect(config.countryInfo.code).toBe('france');
            expect(config.availableCountries).toHaveLength(4);
        });

        test('should export valid configuration structure', () => {
            const config = countryManager.exportConfiguration();
            
            expect(config).toHaveProperty('currentCountry');
            expect(config).toHaveProperty('defaultCountry');
            expect(config).toHaveProperty('countryInfo');
            expect(config).toHaveProperty('availableCountries');
            expect(Array.isArray(config.availableCountries)).toBe(true);
        });
    });

    describe('Error Handling', () => {
        test('should handle missing country gracefully', () => {
            countryManager.setCountry('nonexistent');
            
            expect(countryManager.currentCountry).toBe('spain');
            expect(mockConsole.warn).toHaveBeenCalledWith('Country nonexistent not found, defaulting to spain');
        });

        test('should handle null country code', () => {
            countryManager.setCountry(null);
            
            expect(countryManager.currentCountry).toBe('spain');
            expect(mockConsole.warn).toHaveBeenCalledWith('Country null not found, defaulting to spain');
        });

        test('should handle undefined country code', () => {
            countryManager.setCountry(undefined);
            
            expect(countryManager.currentCountry).toBe('spain');
            expect(mockConsole.warn).toHaveBeenCalledWith('Country undefined not found, defaulting to spain');
        });
    });

    describe('Browser Environment', () => {
        test('should expose CountryManager to window when available', () => {
            // Test that the export works (already tested by import working)
            expect(typeof CountryManager).toBe('function');
        });
    });
});