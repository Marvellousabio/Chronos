import { GraphNode, GraphLink } from '@/types';

export interface DemoCodebase {
  nodes: GraphNode[];
  links: GraphLink[];
}

export function generateDemoCodebase(): DemoCodebase {
  const nodes: GraphNode[] = [
    // God class - everything depends on this
    { id: 'BankCore.java', name: 'BankCore.java', language: 'Java', loc: 1250, debtScore: 95, group: 'core', lines: 250, content: '' },
    { id: 'AccountManager.java', name: 'AccountManager.java', language: 'Java', loc: 890, debtScore: 82, group: 'core', lines: 178, content: '' },
    { id: 'TransactionProcessor.java', name: 'TransactionProcessor.java', language: 'Java', loc: 743, debtScore: 78, group: 'core', lines: 149, content: '' },
    // UI layer
    { id: 'MainFrame.java', name: 'MainFrame.java', language: 'Java', loc: 520, debtScore: 45, group: 'ui', lines: 104, content: '' },
    { id: 'AccountDialog.java', name: 'AccountDialog.java', language: 'Java', loc: 380, debtScore: 52, group: 'ui', lines: 76, content: '' },
    { id: 'TransactionPanel.java', name: 'TransactionPanel.java', language: 'Java', loc: 420, debtScore: 48, group: 'ui', lines: 84, content: '' },
    // Service layer
    { id: 'AccountService.java', name: 'AccountService.java', language: 'Java', loc: 310, debtScore: 38, group: 'service', lines: 62, content: '' },
    { id: 'CustomerService.java', name: 'CustomerService.java', language: 'Java', loc: 285, debtScore: 42, group: 'service', lines: 57, content: '' },
    { id: 'ReportService.java', name: 'ReportService.java', language: 'Java', loc: 450, debtScore: 65, group: 'service', lines: 90, content: '' },
    // Data layer
    { id: 'BankDAO.java', name: 'BankDAO.java', language: 'Java', loc: 680, debtScore: 72, group: 'dao', lines: 136, content: '' },
    { id: 'AccountDAO.java', name: 'AccountDAO.java', language: 'Java', loc: 420, debtScore: 58, group: 'dao', lines: 84, content: '' },
    { id: 'TransactionDAO.java', name: 'TransactionDAO.java', language: 'Java', loc: 380, debtScore: 55, group: 'dao', lines: 76, content: '' },
    // Legacy COBOL
    { id: 'INTERFACE.cobol', name: 'INTERFACE.cobol', language: 'COBOL', loc: 920, debtScore: 88, group: 'cobol', lines: 184, content: '' },
    { id: 'CALCULATION.cobol', name: 'CALCULATION.cobol', language: 'COBOL', loc: 650, debtScore: 79, group: 'cobol', lines: 130, content: '' },
    { id: 'REPORTING.cobol', name: 'REPORTING.cobol', language: 'COBOL', loc: 780, debtScore: 85, group: 'cobol', lines: 156, content: '' },
    // Support files
    { id: 'DatabaseConfig.xml', name: 'DatabaseConfig.xml', language: 'XML', loc: 85, debtScore: 20, group: 'config', lines: 17, content: '' },
    { id: 'LogConfig.properties', name: 'LogConfig.properties', language: 'Text', loc: 42, debtScore: 10, group: 'config', lines: 8, content: '' },
    { id: 'MainApp.js', name: 'MainApp.js', language: 'JavaScript', loc: 215, debtScore: 62, group: 'web', lines: 43, content: '' },
    { id: 'ChartRenderer.js', name: 'ChartRenderer.js', language: 'JavaScript', loc: 178, debtScore: 48, group: 'web', lines: 36, content: '' },
    { id: 'queries.sql', name: 'queries.sql', language: 'SQL', loc: 320, debtScore: 56, group: 'dao', lines: 64, content: '' },
    // Circular dependency cluster
    { id: 'ModuleA.java', name: 'ModuleA.java', language: 'Java', loc: 180, debtScore: 71, group: 'circular', lines: 36, content: '' },
    { id: 'ModuleB.java', name: 'ModuleB.java', language: 'Java', loc: 165, debtScore: 68, group: 'circular', lines: 33, content: '' },
    { id: 'ModuleC.java', name: 'ModuleC.java', language: 'Java', loc: 142, debtScore: 65, group: 'circular', lines: 29, content: '' },
    // Dead code candidates
    { id: 'LegacyUtil.java', name: 'LegacyUtil.java', language: 'Java', loc: 95, debtScore: 15, group: 'dead', lines: 19, content: '' },
    { id: 'OldConstants.java', name: 'OldConstants.java', language: 'Java', loc: 67, debtScore: 8, group: 'dead', lines: 14, content: '' },
  ];

  const links: GraphLink[] = [
    // Circular dependency triangle
    { source: 'ModuleA.java', target: 'ModuleB.java' },
    { source: 'ModuleB.java', target: 'ModuleC.java' },
    { source: 'ModuleC.java', target: 'ModuleA.java' },

    // God class connections (everything depends on BankCore)
    { source: 'AccountManager.java', target: 'BankCore.java' },
    { source: 'TransactionProcessor.java', target: 'BankCore.java' },
    { source: 'MainFrame.java', target: 'BankCore.java' },
    { source: 'AccountService.java', target: 'BankCore.java' },
    { source: 'BankDAO.java', target: 'BankCore.java' },
    { source: 'INTERFACE.cobol', target: 'BankCore.java' },
    { source: 'CALCULATION.cobol', target: 'BankCore.java' },

    // UI layer
    { source: 'MainFrame.java', target: 'AccountDialog.java' },
    { source: 'MainFrame.java', target: 'TransactionPanel.java' },
    { source: 'AccountDialog.java', target: 'AccountService.java' },
    { source: 'TransactionPanel.java', target: 'TransactionProcessor.java' },

    // Service layer
    { source: 'AccountService.java', target: 'AccountDAO.java' },
    { source: 'CustomerService.java', target: 'AccountDAO.java' },
    { source: 'ReportService.java', target: 'TransactionDAO.java' },
    { source: 'AccountService.java', target: 'TransactionProcessor.java' },

    // DAO layer
    { source: 'AccountDAO.java', target: 'BankDAO.java' },
    { source: 'TransactionDAO.java', target: 'BankDAO.java' },
    { source: 'BankDAO.java', target: 'DatabaseConfig.xml' },
    { source: 'BankDAO.java', target: 'queries.sql' },

    // COBOL integration
    { source: 'INTERFACE.cobol', target: 'CALCULATION.cobol' },
    { source: 'REPORTING.cobol', target: 'CALCULATION.cobol' },
    { source: 'CALCULATION.cobol', target: 'BankCore.java' },

    // Web frontend
    { source: 'MainApp.js', target: 'TransactionProcessor.java' },
    { source: 'ChartRenderer.js', target: 'ReportService.java' },

    // Config dependencies
    { source: 'BankDAO.java', target: 'LogConfig.properties' },
    { source: 'MainApp.js', target: 'DatabaseConfig.xml' },

    // Dead code - only incoming from dead code itself
    { source: 'LegacyUtil.java', target: 'OldConstants.java' },
    { source: 'OldConstants.java', target: 'LegacyUtil.java' },

    // Cross-circular dependencies
    { source: 'ModuleA.java', target: 'AccountManager.java' },
    { source: 'ModuleB.java', target: 'TransactionProcessor.java' },
    { source: 'ModuleC.java', target: 'ReportService.java' }
  ];

  return { nodes, links };
}

export function generateFileContent(node: GraphNode): string {
  const templates: Record<string, (node: GraphNode) => string> = {
    'Java': (n) => `package com.bank.${n.group};

import java.util.*;
import com.bank.core.BankCore;

/**
 * ${n.id} - ${n.debtScore > 70 ? 'HIGH DEBT ZONE - tightly coupled' : 'Business logic component'}
 * LOC: ${n.loc} | Debt: ${n.debtScore}/100
 */
public class ${n.id.replace('.java', '')} {
    private BankCore core;
    private Map<String, Object> cache = new HashMap<>();

    public ${n.id.replace('.java', '')}() {
        this.core = BankCore.getInstance();
    }

    public boolean process() {
        try {
            List<Object> data = core.getData();
            if (data == null || data.isEmpty()) {
                return false;
            }
            // FIXME: This method needs refactoring - 500+ lines
            return data.size() > 0;
        } catch (Exception e) {
            // Swallowing exceptions - dangerous!
            return false;
        }
    }

    // TODO: Replace with proper service layer
    public void legacyMethod() {
        // Direct database access - violation of abstraction
        try {
            Connection conn = DriverManager.getConnection("jdbc:derby:bankdb");
            // ... remainder of 200+ line method
        } catch (SQLException ex) {
            // Ignored
        }
    }
}`,

    'COBOL': (n) => `       IDENTIFICATION DIVISION.
       PROGRAM-ID. ${n.id.replace('.cobol', '').toUpperCase()}.
       AUTHOR. LEGACY-DEV-1987.
       DATE-COMPILED. 87-03-15.

       DATA DIVISION.
       WORKING-STORAGE SECTION.
       01  WS-ACCOUNT-ID        PIC X(10).
       01  WS-AMOUNT            PIC S9(9)V99 COMP-3.
       01  WS-RESULT            PIC X(100).

       PROCEDURE DIVISION.
           PERFORM INITIALIZE-INTERFACE.
           CALL 'CALCULATION' USING WS-AMOUNT.
           IF WS-AMOUNT > 1000000
               MOVE 'EXCEEDS LIMIT' TO WS-RESULT
           END-IF.
           STOP RUN.

       INITIALIZE-INTERFACE.
           * This routine hasn't been touched since 1985
           MOVE SPACES TO WS-RESULT.
           * Known issue: Overflows at 1 billion
           IF WS-AMOUNT > 999999999
               MOVE 'OVERFLOW' TO WS-RESULT
           END-IF.`,

    'JavaScript': (n) => `// ${n.id}
// Frontend integration layer - WARNING: Global namespace pollution
// Debt Score: ${n.debtScore}/100

class ${n.id.replace('.js', '')} {
    constructor() {
        this.coreEndpoint = '/api/bank-core';
        this.cache = {};
        this.timeout = 30000; // Magic number
    }

    async fetchData() {
        // No error handling - direct fetch
        const response = await fetch(this.coreEndpoint);
        return response.json();
    }

    // Deprecated: Use new TransactionService instead
    legacyRender(containerId) {
        const el = document.getElementById(containerId);
        if (!el) return;
        // 150 lines of jQuery-style DOM manipulation
        el.innerHTML = '<div>legacy content</div>';
        // XSS vulnerability - no sanitization
    }
}`,

    'SQL': (n) => `-- ${n.id}
-- Generated by Hibernate 3.2 (ancient)
-- DO NOT MODIFY - auto-regenerated daily

SELECT a.*, b.*, c.*, d.*, e.*
FROM ACCOUNTS a
JOIN CUSTOMERS b ON a.customer_id = b.id
JOIN TRANSACTIONS c ON a.id = c.account_id
LEFT JOIN LEGACY_TABLE d ON a.legacy_id = d.id
LEFT JOIN AUDIT_LOG e ON a.id = e.account_id
WHERE a.status = 'ACTIVE'
-- Missing index on status column (N+1 query problem)
-- Consider adding: CREATE INDEX idx_accounts_status ON ACCOUNTS(status)
ORDER BY a.created_date DESC
FETCH FIRST 100 ROWS ONLY;`,

    'XML': (n) => `<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <!-- Legacy Spring 2.0 config - auto-generated -->
    <beans>
        <bean id="bankCore" class="com.bank.core.BankCore">
            <property name="dataSource" ref="dataSource"/>
            <property name="maxConnections" value="5"/>
        </bean>

        <!-- Circular dependency: this bean references itself -->
        <bean id="circularBean" class="com.bank.util.CircularDependency">
            <property name="dependency" ref="circularBean"/>
        </bean>
    </beans>
</configuration>`
  };

  if (templates[node.language]) {
    return templates[node.language](node);
  }

  return `// ${node.id}\n// Legacy code (${node.language})\n// LOC: ${node.loc}\n// Debt: ${node.debtScore}/100\n// Auto-generated for demo purposes`;
}

export function estimateDebtScore(filename: string, content: string): number {
  let score = 20;

  if (filename.toLowerCase().includes('legacy')) score += 30;
  if (filename.toLowerCase().includes('old')) score += 25;
  if (content.includes('FIXME') || content.includes('TODO')) score += 20;
  if (content.includes('HACK') || content.includes('XXX')) score += 35;
  if (content.includes('System.out.println')) score += 15;
  if (content.includes('var ') && content.includes('function')) score += 10;
  if (content.includes('goto')) score += 40;
  if (content.includes('eval(')) score += 50;
  if (content.includes('catch (Exception') && content.includes('{}')) score += 30;
  if ((content.match(/\/\/.*\n/g) || []).length > content.length / 50) score += 15;
  if (content.length > 5000) score += 20;
  if (content.includes('synchronized') || content.includes('volatile')) score += 10;

  return Math.min(100, score + Math.random() * 20);
}

export function detectLanguage(ext: string): string {
  const map: Record<string, string> = {
    'cobol': 'COBOL', 'cbl': 'COBOL',
    'java': 'Java',
    'js': 'JavaScript', 'ts': 'TypeScript',
    'py': 'Python',
    'c': 'C', 'cpp': 'C++',
    'php': 'PHP', 'rb': 'Ruby',
    'pl': 'Perl', 'vb': 'Visual Basic',
    'bas': 'BASIC', 'asm': 'Assembly',
    'sql': 'SQL', 'xml': 'XML', 'json': 'JSON',
    'cs': 'C#', 'go': 'Go', 'rs': 'Rust',
    'kt': 'Kotlin', 'scala': 'Scala', 'swift': 'Swift',
    'txt': 'Text', 'properties': 'Text'
  };
  return map[ext] || 'Text';
}
