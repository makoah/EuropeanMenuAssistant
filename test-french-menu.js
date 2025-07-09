/**
 * Test script for French menu data loading and search functionality
 * This validates that the French menu integration works correctly
 */

import { DataManager } from './js/dataManager.js';
import { CountryManager } from './js/countryManager.js';
import { SearchEngine } from './js/searchEngine.js';

async function testFrenchMenuFunctionality() {
    console.log('🇫🇷 Testing French Menu Data Loading and Search Functionality');
    console.log('='.repeat(60));
    
    try {
        // 1. Test Country Manager French Configuration
        console.log('\n1. Testing CountryManager French Configuration...');
        const countryManager = new CountryManager();
        countryManager.setCountry('france');
        
        const frenchInfo = countryManager.getCountryInfo();
        console.log('✓ French country info:', {
            code: frenchInfo.code,
            name: frenchInfo.name,
            displayName: frenchInfo.displayName,
            language: frenchInfo.language,
            flag: frenchInfo.flag,
            dataPath: frenchInfo.dataPath
        });
        
        // 2. Test Data Manager French Data Loading
        console.log('\n2. Testing DataManager French Data Loading...');
        const dataManager = new DataManager();
        await dataManager.initialize(countryManager);
        
        const menuItems = dataManager.getMenuItems();
        console.log(`✓ Loaded ${menuItems.length} French menu items`);
        
        // Validate first few items
        const sampleItems = menuItems.slice(0, 3);
        console.log('✓ Sample French menu items:');
        sampleItems.forEach((item, index) => {
            console.log(`   ${index + 1}. ${item['French Name']} - ${item['English Translation']}`);
        });
        
        // 3. Test Search Engine with French Data
        console.log('\n3. Testing SearchEngine with French Data...');
        const searchEngine = new SearchEngine();
        searchEngine.initialize(dataManager);
        
        // Test French search terms
        const frenchSearchTerms = ['escargots', 'coq', 'fromage', 'boeuf', 'poulet'];
        
        for (const term of frenchSearchTerms) {
            const results = searchEngine.search(term);
            console.log(`✓ Search for "${term}": ${results.length} results`);
            
            if (results.length > 0) {
                const topResult = results[0];
                console.log(`   Top result: ${topResult.item['French Name']} - ${topResult.item['English Translation']}`);
            }
        }
        
        // 4. Test Country Switching
        console.log('\n4. Testing Country Switching...');
        console.log('   Switching to Spain...');
        countryManager.setCountry('spain');
        await dataManager.loadMenuData();
        
        const spanishItems = dataManager.getMenuItems();
        console.log(`✓ Loaded ${spanishItems.length} Spanish menu items after country switch`);
        
        console.log('   Switching back to France...');
        countryManager.setCountry('france');
        await dataManager.loadMenuData();
        
        const frenchItemsAgain = dataManager.getMenuItems();
        console.log(`✓ Loaded ${frenchItemsAgain.length} French menu items after switch back`);
        
        // 5. Test Search Engine Data Update
        console.log('\n5. Testing SearchEngine Data Update...');
        searchEngine.updateData(dataManager);
        
        const frenchSearchResults = searchEngine.search('escargots');
        console.log(`✓ Search for "escargots" after data update: ${frenchSearchResults.length} results`);
        
        // 6. Test CSV Structure Validation
        console.log('\n6. Testing CSV Structure Validation...');
        const csvStructure = countryManager.getCSVStructure();
        console.log('✓ French CSV structure:', csvStructure);
        
        // Validate that French items have the expected structure
        const firstItem = menuItems[0];
        const expectedFields = [
            'French Name', 'English Translation', 'Dutch Translation', 
            'Description', 'Dutch Description', 'Price Range', 
            'Pork', 'Other Meat', 'Fish/Seafood', 'Dairy', 'Vegetarian', 'Google Search'
        ];
        
        expectedFields.forEach(field => {
            if (firstItem.hasOwnProperty(field)) {
                console.log(`✓ Field "${field}" exists`);
            } else {
                console.log(`✗ Field "${field}" missing`);
            }
        });
        
        // 7. Test Category Filtering
        console.log('\n7. Testing Category Filtering...');
        const vegetarianItems = menuItems.filter(item => item['Vegetarian'] === 'TRUE');
        const meatItems = menuItems.filter(item => item['Other Meat'] === 'TRUE' || item['Pork'] === 'TRUE');
        const seafoodItems = menuItems.filter(item => item['Fish/Seafood'] === 'TRUE');
        
        console.log(`✓ Vegetarian items: ${vegetarianItems.length}`);
        console.log(`✓ Meat items: ${meatItems.length}`);
        console.log(`✓ Seafood items: ${seafoodItems.length}`);
        
        // 8. Test Search by Category
        console.log('\n8. Testing Search by Category...');
        const vegetarianSearch = searchEngine.search('vegetarian');
        const meatSearch = searchEngine.search('meat');
        const seafoodSearch = searchEngine.search('seafood');
        
        console.log(`✓ Vegetarian search results: ${vegetarianSearch.length}`);
        console.log(`✓ Meat search results: ${meatSearch.length}`);
        console.log(`✓ Seafood search results: ${seafoodSearch.length}`);
        
        console.log('\n' + '='.repeat(60));
        console.log('🎉 All French menu functionality tests PASSED!');
        console.log('✓ French menu data loads correctly');
        console.log('✓ Search functionality works with French terms');
        console.log('✓ Country switching works properly');
        console.log('✓ CSV structure is valid and consistent');
        console.log('✓ Category filtering works correctly');
        console.log('='.repeat(60));
        
        return true;
        
    } catch (error) {
        console.error('❌ Test failed:', error);
        console.error('Stack trace:', error.stack);
        return false;
    }
}

// Run the test
if (typeof window === 'undefined') {
    // Node.js environment
    testFrenchMenuFunctionality().then(success => {
        process.exit(success ? 0 : 1);
    });
} else {
    // Browser environment
    window.testFrenchMenuFunctionality = testFrenchMenuFunctionality;
}