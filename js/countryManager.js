/**
 * Country Manager Module
 * Handles multi-country configuration, themes, and data paths in a generic way
 * Adding new countries requires only configuration changes, no code changes
 */

export class CountryManager {
    constructor() {
        this.currentCountry = null;
        this.countries = this.getCountryConfiguration();
        this.defaultCountry = 'spain'; // Maintain backward compatibility
        this.storageKey = 'european-menu-selected-country';
        
        this.init();
    }
    
    /**
     * Initialize country manager
     */
    init() {
        // Load saved country preference or default to Spain
        const savedCountry = this.loadCountryPreference();
        this.setCountry(savedCountry || this.defaultCountry);
    }
    
    /**
     * Country configuration - adding new countries only requires updates here
     */
    getCountryConfiguration() {
        return {
            spain: {
                code: 'spain',
                name: 'Spain',
                displayName: 'Spanish Menu Assistant',
                language: 'Spanish',
                dataPath: 'data/countries/spain/menu-items.csv',
                flag: '🇪🇸',
                welcome: {
                    title: '¡Bienvenido!',
                    subtitle: 'Your Spanish menu translator',
                    description: 'Discover what\'s on your plate! Type any Spanish dish to see its translation, ingredients, and dietary information.'
                },
                theme: {
                    primary: '#C41E3A',      // Spanish red
                    secondary: '#FFD700',    // Spanish gold
                    accent: '#FF6B35',       // Warm orange
                    background: '#FFF8F0',   // Warm white
                    text: '#2C1810'          // Dark brown
                },
                csvStructure: {
                    localLanguage: 'Spanish Name',
                    english: 'English Translation',
                    dutch: 'Dutch Translation',
                    description: 'Description',
                    dutchDescription: 'Dutch Description',
                    priceRange: 'Price Range',
                    pork: 'Pork',
                    otherMeat: 'Other Meat',
                    seafood: 'Fish/Seafood',
                    dairy: 'Dairy',
                    vegetarian: 'Vegetarian',
                    googleSearch: 'Google Search'
                }
            },
            france: {
                code: 'france',
                name: 'France',
                displayName: 'French Menu Assistant',
                language: 'French',
                dataPath: 'data/countries/france/menu-items.csv',
                flag: '🇫🇷',
                welcome: {
                    title: 'Bienvenue!',
                    subtitle: 'Your French menu translator',
                    description: 'Découvrez la cuisine française! Type any French dish to see its translation, ingredients, and dietary information.'
                },
                theme: {
                    primary: '#0055A4',      // French blue
                    secondary: '#FFFFFF',    // White
                    accent: '#EF4135',       // French red
                    background: '#F8F9FF',   // Light blue-white
                    text: '#1A1A2E'          // Dark blue
                },
                csvStructure: {
                    localLanguage: 'French Name',
                    english: 'English Translation',
                    dutch: 'Dutch Translation',
                    description: 'Description',
                    dutchDescription: 'Dutch Description',
                    priceRange: 'Price Range',
                    pork: 'Pork',
                    otherMeat: 'Other Meat',
                    seafood: 'Fish/Seafood',
                    dairy: 'Dairy',
                    vegetarian: 'Vegetarian',
                    googleSearch: 'Google Search'
                }
            },
            germany: {
                code: 'germany',
                name: 'Germany',
                displayName: 'German Menu Assistant',
                language: 'German',
                dataPath: 'data/countries/germany/menu-items.csv',
                flag: '🇩🇪',
                welcome: {
                    title: 'Willkommen!',
                    subtitle: 'Your German menu translator',
                    description: 'Entdecken Sie deutsche Küche! Type any German dish to see its translation, ingredients, and dietary information.'
                },
                theme: {
                    primary: '#000000',      // German black
                    secondary: '#DD0000',    // German red
                    accent: '#FFCE00',       // German gold
                    background: '#FFF9F0',   // Warm white
                    text: '#2C2C2C'          // Dark gray
                },
                csvStructure: {
                    localLanguage: 'German Name',
                    english: 'English Translation',
                    dutch: 'Dutch Translation',
                    description: 'Description',
                    dutchDescription: 'Dutch Description',
                    priceRange: 'Price Range',
                    pork: 'Pork',
                    otherMeat: 'Other Meat',
                    seafood: 'Fish/Seafood',
                    dairy: 'Dairy',
                    vegetarian: 'Vegetarian',
                    googleSearch: 'Google Search'
                }
            },
            italy: {
                code: 'italy',
                name: 'Italy',
                displayName: 'Italian Menu Assistant',
                language: 'Italian',
                dataPath: 'data/countries/italy/menu-items.csv',
                flag: '🇮🇹',
                welcome: {
                    title: 'Benvenuti!',
                    subtitle: 'Your Italian menu translator',
                    description: 'Scoprite la cucina italiana! Type any Italian dish to see its translation, ingredients, and dietary information.'
                },
                theme: {
                    primary: '#009246',      // Italian green
                    secondary: '#FFFFFF',    // White
                    accent: '#CE2B37',       // Italian red
                    background: '#F8FFF8',   // Light green-white
                    text: '#1A4A1A'          // Dark green
                },
                csvStructure: {
                    localLanguage: 'Italian Name',
                    english: 'English Translation',
                    dutch: 'Dutch Translation',
                    description: 'Description',
                    dutchDescription: 'Dutch Description',
                    priceRange: 'Price Range',
                    pork: 'Pork',
                    otherMeat: 'Other Meat',
                    seafood: 'Fish/Seafood',
                    dairy: 'Dairy',
                    vegetarian: 'Vegetarian',
                    googleSearch: 'Google Search'
                }
            }
        };
    }
    
    /**
     * Set current country and apply theme
     */
    setCountry(countryCode) {
        if (!this.countries[countryCode]) {
            console.warn(`Country ${countryCode} not found, defaulting to ${this.defaultCountry}`);
            countryCode = this.defaultCountry;
        }
        
        this.currentCountry = countryCode;
        this.applyTheme(countryCode);
        this.saveCountryPreference(countryCode);
        
        console.log(`🌍 Country set to: ${this.getCountryInfo().displayName}`);
        
        // Dispatch country change event
        window.dispatchEvent(new CustomEvent('countryChanged', {
            detail: {
                country: countryCode,
                countryInfo: this.getCountryInfo()
            }
        }));
    }
    
    /**
     * Get current country information
     */
    getCountryInfo() {
        return this.countries[this.currentCountry] || this.countries[this.defaultCountry];
    }
    
    /**
     * Get data path for current country
     */
    getDataPath() {
        return this.getCountryInfo().dataPath;
    }
    
    /**
     * Get all available countries
     */
    getAvailableCountries() {
        return Object.keys(this.countries).map(code => ({
            code,
            ...this.countries[code]
        }));
    }
    
    /**
     * Apply theme for current country using CSS custom properties
     */
    applyTheme(countryCode) {
        const country = this.countries[countryCode];
        if (!country) return;
        
        // Skip if document is not available (e.g., in tests)
        if (typeof document === 'undefined') {
            console.log('🌍 Document not available, skipping theme application');
            return;
        }
        
        const root = document.documentElement;
        
        // Set data-country attribute for CSS theme selector
        root.setAttribute('data-country', countryCode);
        
        // Add theme transition class for smooth animations
        root.classList.add('theme-transition');
        
        // Update app title
        const titleElement = document.querySelector('title');
        if (titleElement) {
            titleElement.textContent = country.displayName;
        }
        
        // Update any country-specific UI elements
        this.updateCountryUI(country);
        
        // Remove transition class after animation completes
        setTimeout(() => {
            root.classList.remove('theme-transition');
        }, 500);
        
        console.log(`🎨 Theme applied for ${country.name} (${countryCode})`);
    }
    
    /**
     * Update UI elements with country-specific information
     */
    updateCountryUI(country) {
        // Update header title if it exists
        const headerTitle = document.querySelector('.app-title');
        if (headerTitle) {
            // Remove existing flag
            const existingFlag = headerTitle.querySelector('.country-flag');
            if (existingFlag) {
                existingFlag.remove();
            }
            
            // Update title text
            headerTitle.innerHTML = `${country.displayName} <span class="country-flag">${country.flag}</span>`;
        }
        
        // Update standalone flag display if it exists
        const flagElement = document.querySelector('.country-flag:not(.app-title .country-flag)');
        if (flagElement) {
            flagElement.textContent = country.flag;
        }
        
        // Update welcome message
        const welcomeIcon = document.querySelector('.welcome-icon');
        const welcomeTitle = document.querySelector('.welcome-title');
        const welcomeSubtitle = document.querySelector('.welcome-subtitle');
        const welcomeDescription = document.querySelector('.welcome-description p');
        
        if (welcomeIcon) {
            welcomeIcon.textContent = country.flag;
        }
        if (welcomeTitle) {
            welcomeTitle.textContent = country.welcome.title;
        }
        if (welcomeSubtitle) {
            welcomeSubtitle.textContent = country.welcome.subtitle;
        }
        if (welcomeDescription) {
            welcomeDescription.textContent = country.welcome.description;
        }
        
        // Update search placeholder
        const searchInput = document.querySelector('#search-input');
        if (searchInput) {
            searchInput.placeholder = `Type a ${country.language} menu item...`;
        }
        
        // Update any error messages to be generic
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(msg => {
            if (msg.textContent.includes('Spanish Menu Cheater')) {
                msg.textContent = msg.textContent.replace('Spanish Menu Cheater', country.displayName);
            }
        });
        
        // Update page meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', `Discover and translate authentic ${country.language} cuisine with the ${country.displayName}`);
        }
        
        // Update any country selector dropdowns
        const countrySelectors = document.querySelectorAll('.country-selector');
        countrySelectors.forEach(selector => {
            const options = selector.querySelectorAll('option');
            options.forEach(option => {
                if (option.value === country.code) {
                    option.selected = true;
                }
            });
        });
    }
    
    /**
     * Save country preference to localStorage
     */
    saveCountryPreference(countryCode) {
        try {
            if (typeof localStorage === 'undefined') {
                console.warn('localStorage not available, cannot save country preference');
                return;
            }
            localStorage.setItem(this.storageKey, countryCode);
        } catch (error) {
            console.warn('Failed to save country preference:', error);
        }
    }
    
    /**
     * Load country preference from localStorage
     */
    loadCountryPreference() {
        try {
            if (typeof localStorage === 'undefined') {
                console.warn('localStorage not available, using default country');
                return null;
            }
            return localStorage.getItem(this.storageKey);
        } catch (error) {
            console.warn('Failed to load country preference:', error);
            return null;
        }
    }
    
    /**
     * Get CSV structure mapping for current country
     */
    getCSVStructure() {
        return this.getCountryInfo().csvStructure;
    }
    
    /**
     * Generic method to get localized field name
     */
    getLocalizedFieldName(field) {
        const structure = this.getCSVStructure();
        return structure[field] || field;
    }
    
    /**
     * Check if a country is available (has data)
     */
    isCountryAvailable(countryCode) {
        return !!this.countries[countryCode];
    }
    
    /**
     * Get country-specific application name
     */
    getAppName() {
        return this.getCountryInfo().displayName;
    }
    
    /**
     * Get country flag emoji
     */
    getFlag() {
        return this.getCountryInfo().flag;
    }
    
    /**
     * Get country theme colors
     */
    getTheme() {
        return this.getCountryInfo().theme;
    }
    
    /**
     * Switch to next available country (for demo purposes)
     */
    switchToNextCountry() {
        const countries = Object.keys(this.countries);
        const currentIndex = countries.indexOf(this.currentCountry);
        const nextIndex = (currentIndex + 1) % countries.length;
        this.setCountry(countries[nextIndex]);
    }
    
    /**
     * Get country display info for UI
     */
    getCountryDisplayInfo() {
        const country = this.getCountryInfo();
        return {
            name: country.name,
            displayName: country.displayName,
            flag: country.flag,
            language: country.language,
            code: country.code
        };
    }
    
    /**
     * Get country-specific language
     */
    getLanguage() {
        return this.getCountryInfo().language;
    }
    
    /**
     * Reset to default country
     */
    resetToDefault() {
        this.setCountry(this.defaultCountry);
    }
    
    /**
     * Export current configuration for debugging
     */
    exportConfiguration() {
        return {
            currentCountry: this.currentCountry,
            defaultCountry: this.defaultCountry,
            countryInfo: this.getCountryInfo(),
            availableCountries: this.getAvailableCountries()
        };
    }
}

// Export for browser environments
if (typeof window !== 'undefined') {
    window.CountryManager = CountryManager;
}

console.log('🌍 CountryManager module loaded');