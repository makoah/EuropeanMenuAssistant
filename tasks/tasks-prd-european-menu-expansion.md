## Relevant Files

- `data/countries/spain/menu-items.csv` - Migrated Spanish menu data (renamed from spanish_menu_items.csv)
- `data/countries/france/menu-items.csv` - New French menu items database with 200+ curated items
- `data/countries/germany/menu-items.csv` - Placeholder German menu items (10-15 sample items)
- `data/countries/italy/menu-items.csv` - Placeholder Italian menu items (10-15 sample items)
- `js/countryManager.js` - New module for country configuration and theme management
- `js/countryManager.test.js` - Unit tests for country management functionality
- `js/dataManager.js` - Modified to load country-specific datasets
- `js/dataManager.test.js` - Updated tests for multi-country data loading
- `js/settingsManager.js` - Extended to handle country selection persistence
- `js/settingsManager.test.js` - Updated tests for country settings
- `styles/themes.css` - New CSS file containing country-specific color themes
- `styles/main.css` - Updated to use CSS custom properties for theming
- `index.html` - Updated settings interface to include country selector

### Notes

- Unit tests should typically be placed alongside the code files they are testing (e.g., `MyComponent.tsx` and `MyComponent.test.tsx` in the same directory).
- Use `npx jest [optional/path/to/test/file]` to run tests. Running without a path executes all tests found by the Jest configuration.

## Tasks

- [ ] 1.0 Create Multi-Country Data Structure
  - [x] 1.1 Create directory structure: data/countries/spain/, data/countries/france/, data/countries/germany/, data/countries/italy/
  - [x] 1.2 Migrate existing spanish_menu_items.csv to data/countries/spain/menu-items.csv with identical content
  - [ ] 1.3 Create placeholder menu-items.csv files for Germany and Italy with 10-15 sample items each
  - [ ] 1.4 CRITICAL FIX: Remove hardcoded references and implement generic country management before proceeding
- [ ] 2.0 Implement Generic Country Management System (PRIORITY)
  - [x] 2.1 Create js/countryManager.js with comprehensive country configuration
  - [x] 2.2 Update dataManager.js to use country-agnostic data loading
  - [x] 2.3 Remove all hardcoded "Spanish Menu Cheater" references from main.js and make generic
  - [x] 2.4 Update error messages and UI text to be country-generic
  - [ ] 2.5 Implement country persistence and default to Spain for backward compatibility
  - [x] 2.6 Test that Spanish functionality works identically after changes
  - [ ] 2.7 Create comprehensive unit tests for countryManager.js
- [ ] 3.0 Add French Menu Database
  - [x] 3.1 Research and compile 200+ common French menu items with English translations
  - [ ] 3.2 Create data/countries/france/menu-items.csv with proper CSV structure (id, french, english, category, description, tags, allergens, dietary, region, popularity)
  - [ ] 3.3 Validate French data format matches Spanish CSV structure exactly
  - [ ] 3.4 Test French menu data loading and search functionality
- [x] 4.0 Implement Country-Specific Theming
  - [x] 4.1 Create styles/themes.css with CSS custom properties for each country theme
  - [x] 4.2 Define French flag colors (#0055A4, #FFFFFF, #EF4135) and Spanish theme colors
  - [x] 4.3 Update styles/main.css to use CSS custom properties instead of hardcoded colors
  - [x] 4.4 Implement theme switching logic in countryManager.js
  - [x] 4.5 Add flag icons or subtle flag elements to header for selected country
- [x] 5.0 Update Settings Interface for Country Selection
  - [x] 5.1 Add country selector dropdown to settings modal in index.html
  - [x] 5.2 Update settingsManager.js to handle country preference saving/loading
  - [x] 5.3 Implement country change handler that triggers data reload and theme switch
  - [x] 5.4 Add unit tests for settings country functionality
  - [x] 5.5 Ensure Spanish remains default selection for existing users