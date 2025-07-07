# Product Requirements Document: European Menu Expansion

## Introduction/Overview

Expand the existing Spanish Menu Cheater application to support French menus while maintaining identical core functionality. The feature will transform the single-country app into a multi-country European menu assistant, starting with French support and preparing infrastructure for German and Italian expansion.

The primary goal is to preserve the proven OCR-to-translation workflow while adding country-specific theming and data sources.

## Goals

1. Add comprehensive French menu item database with English translations
2. Implement French flag color scheme (blue, white, red) for French mode
3. Create infrastructure for German and Italian country support
4. Maintain existing Spanish functionality as the default experience
5. Preserve all current OCR accuracy and performance benchmarks
6. Enable seamless country switching through settings interface

## User Stories

**As a traveler in France**, I want to photograph French menus and get English translations so that I can understand what I'm ordering.

**As a user familiar with the Spanish version**, I want to switch to French mode through settings so that I can use the same familiar interface in France.

**As a developer**, I want the country infrastructure in place so that adding German and Italian support later requires minimal architectural changes.

**As a user**, I want the app to default to Spanish (existing behavior) so that current users experience no disruption.

## Functional Requirements

1. **French Menu Database**: The system must include a curated list of 200+ common French menu items with English translations, categories, descriptions, allergens, and dietary information.

2. **Country Selection**: The system must provide a country selector in the settings interface allowing users to choose between Spain, France, Germany (coming soon), and Italy (coming soon).

3. **French Color Theme**: When French country is selected, the system must apply French flag colors (blue #0055A4, white #FFFFFF, red #EF4135) to the interface while maintaining the same layout and functionality.

4. **Default Behavior**: The system must default to Spanish country selection to preserve existing user experience with zero functional changes.

5. **File Structure Migration**: The system must rename the existing `spanish_menu_items.csv` to `data/countries/spain/menu-items.csv` while maintaining identical data content and format.

6. **Data Structure Consistency**: The system must maintain identical CSV structure across all countries (id, local_language, english, category, description, tags, allergens, dietary, region, popularity).

7. **OCR Language Compatibility**: The system must process French text through the existing OCR pipeline without requiring language-specific modifications.

8. **German/Italian Placeholders**: The system must include placeholder data files with 10-15 sample menu items each for German and Italian to demonstrate the expansion capability.

9. **Settings Persistence**: The system must remember the user's country selection across app sessions.

10. **Seamless Switching**: When switching countries, the system must reload the appropriate dataset and apply the corresponding color theme without requiring app restart.

11. **Search Engine Compatibility**: The existing fuzzy search functionality must work identically across all country datasets.

12. **Backward Compatibility**: The system must maintain 100% functional compatibility with the existing Spanish menu workflow - users should experience no changes in behavior, performance, or accuracy when using Spanish menus.

## Non-Goals (Out of Scope)

- Language-specific OCR optimization (existing OCR works for French text)
- Complete German and Italian databases (only sample data)
- Automatic language detection based on OCR results
- Translation of the user interface itself (remains in English)
- Currency conversion or pricing features
- Regional dialect support within countries
- Voice pronunciation features

## Design Considerations

- **Color Themes**: Each country will have a distinct color palette applied through CSS custom properties
- **Flag Integration**: Subtle flag elements in the header when country is selected
- **Settings UI**: Country selection as a prominent setting with flag icons
- **Visual Consistency**: All functionality, layouts, and component structures remain identical across countries

## Technical Considerations

- **Data Structure**: Refactor single CSV to country-specific files in `/data/countries/[country]/menu-items.csv`
- **Theme System**: Implement CSS custom properties for easy country theme switching
- **Country Configuration**: Create configuration object mapping countries to data files and themes
- **Settings Integration**: Extend existing SettingsManager to handle country preference
- **Search Engine**: Modify SearchEngine to load country-specific datasets
- **Caching**: Update data caching to handle multiple country datasets

## Success Metrics

- French menu recognition accuracy matches Spanish performance (90%+ with Google Vision API)
- Country switching completes in under 2 seconds
- User settings persistence maintains 100% reliability
- No performance degradation in OCR processing speed
- Zero disruption to existing Spanish functionality
- French dataset covers 80%+ of common French restaurant menu items

## Open Questions

- Should country selection be more prominent (e.g., main interface) in future iterations?
- What criteria should determine the priority order for expanding to full German/Italian datasets?
- Should we consider regional variations within countries (e.g., Québécois French)?