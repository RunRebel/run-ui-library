#!/usr/bin/env node

/**
 * Migration script for RUN:REBEL v2.0
 * Transforms v1 patterns to v2 taxonomy
 */

const fs = require('fs').promises;
const path = require('path');

class TaxonomyMigrator {
  constructor() {
    this.stats = {
      files: 0,
      attributes: 0,
      patterns: 0,
      modules: 0,
      sections: 0
    };
  }

  async migrate(directory = '.') {
    console.log('🔄 Starting v2.0 migration...\n');
    
    await this.migrateFiles(directory);
    await this.generateReport();
    
    console.log('✅ Migration complete!\n');
  }

  async migrateFiles(dir) {
    const files = await fs.readdir(dir, { withFileTypes: true });
    
    for (const file of files) {
      const fullPath = path.join(dir, file.name);
      
      if (file.isDirectory()) {
        if (!['node_modules', '.git', 'dist'].includes(file.name)) {
          await this.migrateFiles(fullPath);
        }
      } else if (file.name.endsWith('.html')) {
        await this.migrateFile(fullPath);
      }
    }
  }

  async migrateFile(filePath) {
    let content = await fs.readFile(filePath, 'utf8');
    const originalContent = content;
    
    // Transform patterns to features
    content = content.replace(/data-pattern="([^"]+)"/g, (match, pattern) => {
      this.stats.patterns++;
      return `data-${pattern}="true"`;
    });
    
    // Transform modules to components
    content = content.replace(/data-module="([^"]+)"/g, (match, module) => {
      this.stats.modules++;
      return `data-component="${module}"`;
    });
    
    // Transform sections to components
    content = content.replace(/data-section="([^"]+)"/g, (match, section) => {
      this.stats.sections++;
      return `data-component="${section}"`;
    });
    
    // Update component initialization
    content = content.replace(/CS\.module\(/g, 'CS.component(');
    content = content.replace(/CS\.section\(/g, 'CS.component(');
    
    if (content !== originalContent) {
      await fs.writeFile(filePath, content);
      this.stats.files++;
      this.stats.attributes = this.stats.patterns + this.stats.modules + this.stats.sections;
      console.log(`✓ Migrated: ${filePath}`);
    }
  }

  async generateReport() {
    const report = `
Migration Report
================

Files modified: ${this.stats.files}
Total attributes updated: ${this.stats.attributes}

Changes:
- Patterns → Features: ${this.stats.patterns}
- Modules → Components: ${this.stats.modules}
- Sections → Components: ${this.stats.sections}

Next steps:
1. Review modified files
2. Test component functionality
3. Update any custom CSS selectors
4. Clear CDN cache if using jsDelivr
`;

    await fs.writeFile('MIGRATION_REPORT.md', report);
    console.log(report);
  }
}

// Run migration
if (require.main === module) {
  const migrator = new TaxonomyMigrator();
  migrator.migrate(process.argv[2]).catch(console.error);
}

module.exports = TaxonomyMigrator;
