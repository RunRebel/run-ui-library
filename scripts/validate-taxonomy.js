#!/usr/bin/env node

/**
 * Taxonomy validation script for RUN:REBEL v2.0
 * Ensures system integrity and proper structure
 */

const fs = require('fs').promises;
const path = require('path');

class TaxonomyValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.stats = {
      tokens: 0,
      elements: 0,
      components: { simple: 0, complex: 0, sections: 0 },
      layouts: 0,
      templates: 0,
      total: 0
    };
  }

  async validate(rootDir = '.') {
    console.log('🔍 Validating RUN:REBEL v2.0 Taxonomy...\n');
    
    // Check structure
    await this.validateStructure(rootDir);
    
    // Check core files
    await this.validateCoreFiles(rootDir);
    
    // Scan components
    await this.scanTaxonomy(rootDir);
    
    // Check references
    await this.validateReferences(rootDir);
    
    // Generate report
    this.generateReport();
  }

  async validateStructure(rootDir) {
    const requiredDirs = [
      '00-tokens',
      '01-elements',
      '02-components',
      '02-components/simple',
      '02-components/complex',
      '02-components/sections',
      '03-layouts',
      '04-templates',
      'cs',
      'claude',
      'scripts',
      'docs'
    ];
    
    for (const dir of requiredDirs) {
      try {
        await fs.access(path.join(rootDir, dir));
      } catch {
        this.errors.push(`Missing required directory: ${dir}`);
      }
    }
  }

  async validateCoreFiles(rootDir) {
    const coreFiles = [
      'cs/core.js',
      'claude/instructions.md',
      'claude/patterns.json',
      'README.md',
      'CHANGELOG.md',
      'package.json'
    ];
    
    for (const file of coreFiles) {
      try {
        await fs.access(path.join(rootDir, file));
      } catch {
        this.errors.push(`Missing core file: ${file}`);
      }
    }
  }

  async scanTaxonomy(rootDir) {
    // Scan each level
    await this.scanLevel(rootDir, '00-tokens', 'tokens');
    await this.scanLevel(rootDir, '01-elements', 'elements');
    await this.scanLevel(rootDir, '02-components/simple', 'components.simple');
    await this.scanLevel(rootDir, '02-components/complex', 'components.complex');
    await this.scanLevel(rootDir, '02-components/sections', 'components.sections');
    await this.scanLevel(rootDir, '03-layouts', 'layouts');
    await this.scanLevel(rootDir, '04-templates', 'templates');
  }

  async scanLevel(rootDir, dir, statKey) {
    try {
      const files = await fs.readdir(path.join(rootDir, dir));
      const htmlFiles = files.filter(f => f.endsWith('.html') || f.endsWith('.css'));
      
      // Update stats
      const keys = statKey.split('.');
      if (keys.length === 2) {
        this.stats[keys[0]][keys[1]] = htmlFiles.length;
      } else {
        this.stats[statKey] = htmlFiles.length;
      }
      
      this.stats.total += htmlFiles.length;
      
      // Validate each file
      for (const file of htmlFiles) {
        await this.validateFile(path.join(rootDir, dir, file), dir);
      }
    } catch (e) {
      // Directory might not exist yet
    }
  }

  async validateFile(filePath, expectedLevel) {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      
      // Check for proper data attributes
      if (expectedLevel.includes('elements') && !content.includes('data-element=')) {
        this.warnings.push(`${filePath}: Missing data-element attribute`);
      }
      
      if (expectedLevel.includes('components') && !content.includes('data-component=')) {
        this.warnings.push(`${filePath}: Missing data-component attribute`);
      }
      
      if (expectedLevel.includes('layouts') && !content.includes('data-layout=')) {
        this.warnings.push(`${filePath}: Missing data-layout attribute`);
      }
      
      // Check for deprecated patterns
      if (content.includes('data-pattern=')) {
        this.errors.push(`${filePath}: Uses deprecated data-pattern attribute`);
      }
      
      if (content.includes('data-module=')) {
        this.errors.push(`${filePath}: Uses deprecated data-module attribute`);
      }
      
      if (content.includes('data-section=') && !expectedLevel.includes('sections')) {
        this.errors.push(`${filePath}: Uses deprecated data-section attribute`);
      }
    } catch (e) {
      this.errors.push(`Error reading ${filePath}: ${e.message}`);
    }
  }

  async validateReferences(rootDir) {
    // Check CDN references
    try {
      const coreContent = await fs.readFile(path.join(rootDir, 'cs/core.js'), 'utf8');
      
      if (!coreContent.includes('version: \'2.0.0\'')) {
        this.errors.push('Core version mismatch - expected 2.0.0');
      }
      
      if (coreContent.includes('.cs/')) {
        this.warnings.push('Core contains references to .cs/ (should be cs/)');
      }
    } catch (e) {
      // Core might not exist
    }
  }

  generateReport() {
    console.log('\n📊 Validation Report\n');
    console.log('═══════════════════\n');
    
    // Stats
    console.log('📈 Statistics:');
    console.log(`   Tokens: ${this.stats.tokens}`);
    console.log(`   Elements: ${this.stats.elements}`);
    console.log(`   Components:`);
    console.log(`     - Simple: ${this.stats.components.simple}`);
    console.log(`     - Complex: ${this.stats.components.complex}`);
    console.log(`     - Sections: ${this.stats.components.sections}`);
    console.log(`   Layouts: ${this.stats.layouts}`);
    console.log(`   Templates: ${this.stats.templates}`);
    console.log(`   Total: ${this.stats.total}\n`);
    
    // Errors
    if (this.errors.length > 0) {
      console.log('❌ Errors:');
      this.errors.forEach(err => console.log(`   - ${err}`));
      console.log('');
    }
    
    // Warnings
    if (this.warnings.length > 0) {
      console.log('⚠️  Warnings:');
      this.warnings.forEach(warn => console.log(`   - ${warn}`));
      console.log('');
    }
    
    // Summary
    if (this.errors.length === 0) {
      console.log('✅ Validation passed! System is ready for v2.0');
    } else {
      console.log('❌ Validation failed! Please fix errors before proceeding.');
      process.exit(1);
    }
  }
}

// Run validation
if (require.main === module) {
  const validator = new TaxonomyValidator();
  validator.validate(process.argv[2]).catch(console.error);
}

module.exports = TaxonomyValidator;
