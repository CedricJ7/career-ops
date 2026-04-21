#!/usr/bin/env node

/**
 * html-to-pdf.mjs — Convert HTML files to PDF via Playwright
 *
 * Usage:
 *   node html-to-pdf.mjs [pattern] [output-dir]
 *
 * Examples:
 *   node html-to-pdf.mjs "output/**\/*.html"
 *   node html-to-pdf.mjs "output/galadrim/stage-ingenieur-ia/lettre.html"
 */

import { chromium } from 'playwright';
import { readFile, stat } from 'fs/promises';
import { resolve, dirname, basename, join } from 'path';
import { existsSync, mkdirSync, readdirSync } from 'fs';

async function convertHtmlToPdf(htmlPath, outputPath) {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();

    // Use file:// URL for local files
    const fileUrl = `file://${resolve(htmlPath)}`;
    await page.goto(fileUrl, { waitUntil: 'networkidle' });

    // Ensure output directory exists
    const outDir = dirname(outputPath);
    if (!existsSync(outDir)) {
      mkdirSync(outDir, { recursive: true });
    }

    // Generate PDF with optimized settings for print
    await page.pdf({
      path: outputPath,
      format: 'A4',
      margin: {
        top: '0mm',
        bottom: '0mm',
        left: '0mm',
        right: '0mm',
      },
      printBackground: true,
    });

    return { success: true, path: outputPath };
  } catch (err) {
    return { success: false, error: err.message };
  } finally {
    await browser.close();
  }
}

function findHtmlFiles(dir) {
  const files = [];
  function walk(currentDir) {
    try {
      const entries = readdirSync(currentDir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = join(currentDir, entry.name);
        if (entry.isDirectory()) {
          walk(fullPath);
        } else if (entry.name.endsWith('.html')) {
          files.push(fullPath);
        }
      }
    } catch (err) {
      // silently skip inaccessible directories
    }
  }
  walk(dir);
  return files;
}

async function main() {
  const searchDir = process.argv[2] || 'output';

  // Find all HTML files recursively
  const files = findHtmlFiles(searchDir);

  if (files.length === 0) {
    console.log(`No HTML files found in: ${searchDir}`);
    process.exit(1);
  }

  console.log(`Found ${files.length} HTML file(s) to convert`);

  let successCount = 0;
  let errorCount = 0;

  for (const htmlFile of files) {
    const pdfPath = htmlFile.replace(/\.html$/, '.pdf');
    console.log(`Converting: ${basename(htmlFile)} → ${basename(pdfPath)}`);

    const result = await convertHtmlToPdf(htmlFile, pdfPath);
    if (result.success) {
      console.log(`  ✓ ${pdfPath}`);
      successCount++;
    } else {
      console.log(`  ✗ Error: ${result.error}`);
      errorCount++;
    }
  }

  console.log(`\n====== RÉSUMÉ CONVERSION ======`);
  console.log(`Fichiers convertis avec succès: ${successCount}`);
  console.log(`Erreurs: ${errorCount}`);

  process.exit(errorCount > 0 ? 1 : 0);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
