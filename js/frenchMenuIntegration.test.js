/**
 * Tests for French Menu Integration
 * Validates French menu data loading, search functionality, and country switching
 */

import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { DataManager } from './dataManager.js';
import { CountryManager } from './countryManager.js';
import { SearchEngine } from './searchEngine.js';

// Mock fetch for CSV data loading
global.fetch = jest.fn();

describe('French Menu Integration', () => {
    let dataManager;
    let countryManager;
    let searchEngine;

    // Mock French CSV data
    const mockFrenchCSV = `French Name,English Translation,Dutch Translation,Description,Dutch Description,Price Range,Pork,Other Meat,Fish/Seafood,Dairy,Vegetarian,Google Search
Escargots,Snails,Slakken,Snails cooked in garlic and parsley butter,Slakken gekookt in knoflook en peterselie boter,€8-12,FALSE,FALSE,FALSE,TRUE,FALSE,https://www.google.com/search?q=french%20escargots&tbm=isch
Coq au Vin,Chicken in Wine,Kip in Wijn,Chicken braised in wine with mushrooms,Kip gestooft in wijn met champignons,€14-18,FALSE,TRUE,FALSE,FALSE,FALSE,https://www.google.com/search?q=coq%20au%20vin&tbm=isch
Fromage,Cheese,Kaas,Selection of French cheeses,Selectie van Franse kazen,€8-15,FALSE,FALSE,FALSE,TRUE,TRUE,https://www.google.com/search?q=french%20cheese&tbm=isch
Boeuf Bourguignon,Beef Burgundy,Rundvlees Bourgogne,Beef braised in red wine,Rundvlees gestooft in rode wijn,€16-22,FALSE,TRUE,FALSE,FALSE,FALSE,https://www.google.com/search?q=boeuf%20bourguignon&tbm=isch
Ratatouille,Ratatouille,Ratatouille,Vegetable stew from Provence,Groentestoofpot uit de Provence,€10-14,FALSE,FALSE,FALSE,FALSE,TRUE,https://www.google.com/search?q=ratatouille%20french&tbm=isch`;

    // Mock Spanish CSV data for comparison
    const mockSpanishCSV = `Spanish Name,English Translation,Dutch Translation,Description,Dutch Description,Price Range,Pork,Other Meat,Fish/Seafood,Dairy,Vegetarian,Google Search
Paella,Paella,Paella,Rice dish with seafood and meat,Rijstgerecht met zeevruchten en vlees,€12-18,FALSE,TRUE,TRUE,FALSE,FALSE,https://www.google.com/search?q=paella%20spanish&tbm=isch
Jamón,Ham,Ham,Cured Spanish ham,Gedroogde Spaanse ham,€8-15,TRUE,FALSE,FALSE,FALSE,FALSE,https://www.google.com/search?q=jamon%20spanish&tbm=isch`;

    beforeEach(() => {
        // Reset all mocks
        jest.clearAllMocks();
        
        // Mock fetch to return appropriate CSV data
        fetch.mockImplementation((url) => {
            if (url.includes('france/menu-items.csv')) {
                return Promise.resolve({
                    ok: true,
                    text: () => Promise.resolve(mockFrenchCSV)
                });
            } else if (url.includes('spain/menu-items.csv')) {
                return Promise.resolve({
                    ok: true,
                    text: () => Promise.resolve(mockSpanishCSV)
                });
            }
            return Promise.reject(new Error('Not found'));
        });

        // Initialize managers
        countryManager = new CountryManager();
        dataManager = new DataManager();
        searchEngine = new SearchEngine();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('French Country Configuration', () => {
        test('should configure France correctly', () => {
            countryManager.setCountry('france');
            const frenchInfo = countryManager.getCountryInfo();
            
            expect(frenchInfo.code).toBe('france');
            expect(frenchInfo.name).toBe('France');
            expect(frenchInfo.displayName).toBe('French Menu Assistant');
            expect(frenchInfo.language).toBe('French');
            expect(frenchInfo.flag).toBe('🇫🇷');
            expect(frenchInfo.dataPath).toBe('data/countries/france/menu-items.csv');
        });

        test('should have correct French CSV structure', () => {
            countryManager.setCountry('france');
            const csvStructure = countryManager.getCSVStructure();
            
            expect(csvStructure.localLanguage).toBe('French Name');
            expect(csvStructure.english).toBe('English Translation');
            expect(csvStructure.dutch).toBe('Dutch Translation');
            expect(csvStructure.description).toBe('Description');
            expect(csvStructure.dutchDescription).toBe('Dutch Description');
            expect(csvStructure.priceRange).toBe('Price Range');
            expect(csvStructure.pork).toBe('Pork');
            expect(csvStructure.otherMeat).toBe('Other Meat');
            expect(csvStructure.seafood).toBe('Fish/Seafood');
            expect(csvStructure.dairy).toBe('Dairy');
            expect(csvStructure.vegetarian).toBe('Vegetarian');
            expect(csvStructure.googleSearch).toBe('Google Search');
        });

        test('should return French theme colors', () => {
            countryManager.setCountry('france');
            const theme = countryManager.getTheme();
            
            expect(theme.primary).toBe('#0055A4'); // French blue
            expect(theme.secondary).toBe('#FFFFFF'); // White
            expect(theme.accent).toBe('#EF4135'); // French red
        });
    });

    describe('French Data Loading', () => {
        test('should load French menu data', async () => {
            countryManager.setCountry('france');
            await dataManager.initialize(countryManager);
            
            const menuItems = dataManager.getMenuItems();
            
            expect(menuItems).toHaveLength(5); // 5 items in mock data
            expect(fetch).toHaveBeenCalledWith('data/countries/france/menu-items.csv');
        });

        test('should parse French CSV data correctly', async () => {
            countryManager.setCountry('france');
            await dataManager.initialize(countryManager);
            
            const menuItems = dataManager.getMenuItems();
            const firstItem = menuItems[0];
            
            expect(firstItem['French Name']).toBe('Escargots');
            expect(firstItem['English Translation']).toBe('Snails');
            expect(firstItem['Dutch Translation']).toBe('Slakken');
            expect(firstItem['Description']).toBe('Snails cooked in garlic and parsley butter');
            expect(firstItem['Vegetarian']).toBe('FALSE');
            expect(firstItem['Dairy']).toBe('TRUE');
        });

        test('should validate French data structure', async () => {
            countryManager.setCountry('france');
            await dataManager.initialize(countryManager);
            
            const menuItems = dataManager.getMenuItems();
            const expectedFields = [
                'French Name', 'English Translation', 'Dutch Translation', 
                'Description', 'Dutch Description', 'Price Range', 
                'Pork', 'Other Meat', 'Fish/Seafood', 'Dairy', 'Vegetarian', 'Google Search'
            ];
            
            menuItems.forEach(item => {
                expectedFields.forEach(field => {
                    expect(item).toHaveProperty(field);
                });
            });
        });

        test('should handle French data loading errors', async () => {
            fetch.mockRejectedValueOnce(new Error('Network error'));
            
            countryManager.setCountry('france');
            await dataManager.initialize(countryManager);
            
            const menuItems = dataManager.getMenuItems();
            expect(menuItems).toHaveLength(0);
        });
    });

    describe('French Search Functionality', () => {
        beforeEach(async () => {
            countryManager.setCountry('france');
            await dataManager.initialize(countryManager);
            searchEngine.initialize(dataManager);
        });

        test('should search French menu items by French name', () => {
            const results = searchEngine.search('escargots');
            
            expect(results.length).toBeGreaterThan(0);
            expect(results[0].item['French Name']).toBe('Escargots');
        });

        test('should search French menu items by English translation', () => {
            const results = searchEngine.search('chicken');
            
            expect(results.length).toBeGreaterThan(0);
            expect(results[0].item['English Translation']).toBe('Chicken in Wine');
        });

        test('should search French menu items by description', () => {
            const results = searchEngine.search('wine');
            
            expect(results.length).toBeGreaterThan(0);
            const wineResults = results.filter(r => 
                r.item['Description'].toLowerCase().includes('wine') ||
                r.item['French Name'].toLowerCase().includes('vin')
            );
            expect(wineResults.length).toBeGreaterThan(0);
        });

        test('should handle case-insensitive French search', () => {
            const upperResults = searchEngine.search('ESCARGOTS');
            const lowerResults = searchEngine.search('escargots');
            
            expect(upperResults.length).toBe(lowerResults.length);
            expect(upperResults.length).toBeGreaterThan(0);
        });

        test('should search with partial French terms', () => {
            const results = searchEngine.search('coq');
            
            expect(results.length).toBeGreaterThan(0);
            expect(results[0].item['French Name']).toBe('Coq au Vin');
        });

        test('should return empty results for non-existent French terms', () => {
            const results = searchEngine.search('nonexistent');
            
            expect(results).toHaveLength(0);
        });
    });

    describe('Country Switching with French Data', () => {
        test('should switch from Spain to France', async () => {
            // Start with Spain
            countryManager.setCountry('spain');
            await dataManager.initialize(countryManager);
            
            let menuItems = dataManager.getMenuItems();
            expect(menuItems).toHaveLength(2); // 2 Spanish items in mock
            expect(menuItems[0]['Spanish Name']).toBe('Paella');
            
            // Switch to France
            countryManager.setCountry('france');
            await dataManager.loadMenuData();
            
            menuItems = dataManager.getMenuItems();
            expect(menuItems).toHaveLength(5); // 5 French items in mock
            expect(menuItems[0]['French Name']).toBe('Escargots');
        });

        test('should switch from France to Spain', async () => {
            // Start with France
            countryManager.setCountry('france');
            await dataManager.initialize(countryManager);
            
            let menuItems = dataManager.getMenuItems();
            expect(menuItems).toHaveLength(5); // 5 French items in mock
            expect(menuItems[0]['French Name']).toBe('Escargots');
            
            // Switch to Spain
            countryManager.setCountry('spain');
            await dataManager.loadMenuData();
            
            menuItems = dataManager.getMenuItems();
            expect(menuItems).toHaveLength(2); // 2 Spanish items in mock
            expect(menuItems[0]['Spanish Name']).toBe('Paella');
        });

        test('should update search engine after country switch', async () => {
            // Start with Spain
            countryManager.setCountry('spain');
            await dataManager.initialize(countryManager);
            searchEngine.initialize(dataManager);
            
            let results = searchEngine.search('paella');
            expect(results.length).toBeGreaterThan(0);
            
            // Switch to France
            countryManager.setCountry('france');
            await dataManager.loadMenuData();
            searchEngine.updateData(dataManager);
            
            results = searchEngine.search('paella');
            expect(results).toHaveLength(0); // No Spanish items in French data
            
            results = searchEngine.search('escargots');
            expect(results.length).toBeGreaterThan(0); // French items available
        });
    });

    describe('French Category Filtering', () => {
        beforeEach(async () => {
            countryManager.setCountry('france');
            await dataManager.initialize(countryManager);
        });

        test('should filter French vegetarian items', () => {
            const menuItems = dataManager.getMenuItems();
            const vegetarianItems = menuItems.filter(item => item['Vegetarian'] === 'TRUE');
            
            expect(vegetarianItems.length).toBe(2); // Fromage and Ratatouille
            expect(vegetarianItems.map(item => item['French Name'])).toContain('Fromage');
            expect(vegetarianItems.map(item => item['French Name'])).toContain('Ratatouille');
        });

        test('should filter French meat items', () => {
            const menuItems = dataManager.getMenuItems();
            const meatItems = menuItems.filter(item => 
                item['Other Meat'] === 'TRUE' || item['Pork'] === 'TRUE'
            );
            
            expect(meatItems.length).toBe(2); // Coq au Vin and Boeuf Bourguignon
            expect(meatItems.map(item => item['French Name'])).toContain('Coq au Vin');
            expect(meatItems.map(item => item['French Name'])).toContain('Boeuf Bourguignon');
        });

        test('should filter French dairy items', () => {
            const menuItems = dataManager.getMenuItems();
            const dairyItems = menuItems.filter(item => item['Dairy'] === 'TRUE');
            
            expect(dairyItems.length).toBe(2); // Escargots and Fromage
            expect(dairyItems.map(item => item['French Name'])).toContain('Escargots');
            expect(dairyItems.map(item => item['French Name'])).toContain('Fromage');
        });

        test('should filter French seafood items', () => {
            const menuItems = dataManager.getMenuItems();
            const seafoodItems = menuItems.filter(item => item['Fish/Seafood'] === 'TRUE');
            
            expect(seafoodItems.length).toBe(0); // No seafood items in mock French data
        });
    });

    describe('French Data Validation', () => {
        test('should validate French price ranges', async () => {
            countryManager.setCountry('france');
            await dataManager.initialize(countryManager);
            
            const menuItems = dataManager.getMenuItems();
            
            menuItems.forEach(item => {
                expect(item['Price Range']).toMatch(/€\d+-\d+/);
            });
        });

        test('should validate French Google Search URLs', async () => {
            countryManager.setCountry('france');
            await dataManager.initialize(countryManager);
            
            const menuItems = dataManager.getMenuItems();
            
            menuItems.forEach(item => {
                expect(item['Google Search']).toMatch(/^https:\/\/www\.google\.com\/search/);
            });
        });

        test('should validate French boolean fields', async () => {
            countryManager.setCountry('france');
            await dataManager.initialize(countryManager);
            
            const menuItems = dataManager.getMenuItems();
            const booleanFields = ['Pork', 'Other Meat', 'Fish/Seafood', 'Dairy', 'Vegetarian'];
            
            menuItems.forEach(item => {
                booleanFields.forEach(field => {
                    expect(['TRUE', 'FALSE']).toContain(item[field]);
                });
            });
        });
    });
});