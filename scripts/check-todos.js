#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const extensionsToCheck = ['.js', '.ts', '.jsx', '.tsx', '.json', '.md'];
const keywords = ['TODO', 'FIXME'];

function checkFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const issues = [];

    lines.forEach((line, index) => {
        for (const keyword of keywords) {
            if (line.includes(keyword)) {
                issues.push({
                    file: filePath,
                    line: index + 1,
                    content: line.trim(),
                    keyword
                });
            }
        }
    });

    return issues;
}

function walk(dir, issues = []) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory() && !['node_modules', '.git'].includes(entry.name)) {
            walk(fullPath, issues);
        } else if (entry.isFile() && extensionsToCheck.includes(path.extname(entry.name))) {
            const fileIssues = checkFile(fullPath);
            issues.push(...fileIssues);
        }
    }

    return issues;
}

// MAIN
const results = walk(process.cwd());

if (results.length > 0) {
    console.error('❌ Найдены TODO / FIXME комментарии:');
    results.forEach(issue => {
        console.error(`- ${issue.file}:${issue.line} → ${issue.content}`);
    });
    process.exit(1);
} else {
    console.log('✅ TODO / FIXME не найдены.');
    process.exit(0);
}
