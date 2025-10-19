#!/usr/bin/env node

/**
 * ProofCore Dataset Validator
 *
 * Validates dataset.json against schema.json
 * - Schema compliance
 * - Duplicate IDs
 * - Required fields
 * - Data quality checks
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(color, message) {
  console.log(`${color}${message}${colors.reset}`);
}

function validateSchema(schema, data) {
  const errors = [];

  // Check required properties
  if (!schema.required) {
    return errors;
  }

  for (const field of schema.required) {
    if (!(field in data)) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // Check property constraints
  const props = schema.properties || {};
  for (const [key, value] of Object.entries(data)) {
    if (!(key in props)) {
      errors.push(`Unknown property: ${key}`);
      continue;
    }

    const propSchema = props[key];

    // Type check
    if (propSchema.type) {
      const actualType = Array.isArray(value) ? 'array' : typeof value;
      if (actualType !== propSchema.type) {
        errors.push(`${key}: expected ${propSchema.type}, got ${actualType}`);
      }
    }

    // Enum check
    if (propSchema.enum && !propSchema.enum.includes(value)) {
      errors.push(`${key}: must be one of ${propSchema.enum.join(', ')}, got ${value}`);
    }

    // String constraints
    if (typeof value === 'string') {
      if (propSchema.minLength && value.length < propSchema.minLength) {
        errors.push(`${key}: minimum length ${propSchema.minLength}, got ${value.length}`);
      }
      if (propSchema.maxLength && value.length > propSchema.maxLength) {
        errors.push(`${key}: maximum length ${propSchema.maxLength}, got ${value.length}`);
      }
      if (propSchema.pattern) {
        const regex = new RegExp(`^${propSchema.pattern}$`);
        if (!regex.test(value)) {
          errors.push(`${key}: must match pattern ${propSchema.pattern}`);
        }
      }
    }

    // Array constraints
    if (Array.isArray(value)) {
      if (propSchema.minItems && value.length < propSchema.minItems) {
        errors.push(`${key}: minimum items ${propSchema.minItems}, got ${value.length}`);
      }
      if (propSchema.maxItems && value.length > propSchema.maxItems) {
        errors.push(`${key}: maximum items ${propSchema.maxItems}, got ${value.length}`);
      }
    }
  }

  return errors;
}

function main() {
  const schemaPath = path.join(__dirname, '../examples/proofs/schema.json');
  const datasetPath = path.join(__dirname, '../examples/proofs/dataset.json');

  // Load files
  let schema, dataset;
  try {
    schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
    log(colors.blue, '[*] Schema loaded');
  } catch (e) {
    log(colors.red, `[!] Error loading schema: ${e.message}`);
    process.exit(1);
  }

  try {
    dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));
    log(colors.blue, `[*] Dataset loaded: ${dataset.length} items`);
  } catch (e) {
    log(colors.red, `[!] Error loading dataset: ${e.message}`);
    process.exit(1);
  }

  // Validation
  let totalErrors = 0;
  const ids = new Set();
  const domainCounts = {};
  const difficultyCounts = {};

  for (let i = 0; i < dataset.length; i++) {
    const item = dataset[i];
    const itemErrors = validateSchema(schema, item);

    // Check duplicate IDs
    if (ids.has(item.id)) {
      itemErrors.push(`Duplicate ID: ${item.id}`);
    }
    ids.add(item.id);

    // Track statistics
    domainCounts[item.domain] = (domainCounts[item.domain] || 0) + 1;
    difficultyCounts[item.difficulty] = (difficultyCounts[item.difficulty] || 0) + 1;

    if (itemErrors.length > 0) {
      log(colors.red, `\n[!] Item ${i} (${item.id}):`);
      itemErrors.forEach((err) => log(colors.red, `    - ${err}`));
      totalErrors += itemErrors.length;
    }
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  log(colors.blue, 'VALIDATION SUMMARY');
  console.log('='.repeat(50));

  log(colors.green, `[+] Total items: ${dataset.length}`);
  log(colors.green, `[+] Unique IDs: ${ids.size}`);
  log(colors.green, `[+] Total errors: ${totalErrors}`);

  console.log('\nDomain distribution:');
  for (const [domain, count] of Object.entries(domainCounts)) {
    log(colors.blue, `    ${domain}: ${count}`);
  }

  console.log('\nDifficulty distribution:');
  for (const [diff, count] of Object.entries(difficultyCounts)) {
    log(colors.blue, `    ${diff}: ${count}`);
  }

  console.log('\n' + '='.repeat(50));

  if (totalErrors === 0 && ids.size === dataset.length) {
    log(colors.green, '[+] VALIDATION PASSED ✓');
    process.exit(0);
  } else {
    log(colors.red, '[-] VALIDATION FAILED ✗');
    process.exit(1);
  }
}

main();
