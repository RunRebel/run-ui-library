# Changelog

## [2.0.0] - 2025-01-13

### Changed
- **BREAKING**: Simplified taxonomy from 7 levels to 5 levels
- Patterns are now optional component features (data-{feature}="true")
- Modules merged into components/complex
- Sections merged into components/sections

### Added
- New `Layouts` level for spatial organization structures
- Enhanced core.js with full taxonomy support
- Registry system for all taxonomy levels
- Automatic detection of element types
- Claude configuration files (claude/)
- Complete examples for all levels

### Improved
- Clearer decision rules for categorization
- Better separation of concerns
- More intuitive file organization
- Backward compatibility with v1.0 data attributes

### Migration
- `[data-pattern="x"]` → `[data-x="true"]`
- `[data-module]` → `[data-component]`
- `[data-section]` → `[data-component]`
- Files in 04-modules/ → 02-components/complex/
- Files in 05-sections/ → 02-components/sections/

## [1.0.0] - 2025-01-10

### Added
- Initial release
- Core component system
- Reactive state management
- Virtual DOM module
- Basic documentation
- Quick start guide
