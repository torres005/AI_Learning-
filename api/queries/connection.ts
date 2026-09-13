import fs from "fs";
import path from "path";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "../../db/schema";
import * as relations from "../../db/relations";

const fullSchema = { ...schema, ...relations };

// Path to store database JSON
const dbPath = path.resolve(process.cwd(), "db.json");

// Read helper
function readDb() {
  if (!fs.existsSync(dbPath)) {
    return {};
  }
  try {
    return JSON.parse(fs.readFileSync(dbPath, "utf-8"));
  } catch {
    return {};
  }
}

// Write helper
function writeDb(data: any) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf-8");
}

// Parameter inliner
function inlineParams(sql: string, params: any[]) {
  let paramIndex = 0;
  return sql.replace(/\?/g, () => {
    if (paramIndex >= params.length) return "null";
    const p = params[paramIndex++];
    if (typeof p === "string") return `'${p.replace(/'/g, "''")}'`;
    if (p instanceof Date) {
      const pad = (n: number) => String(n).padStart(2, "0");
      return `'${p.getFullYear()}-${pad(p.getMonth() + 1)}-${pad(p.getDate())} ${pad(p.getHours())}:${pad(p.getMinutes())}:${pad(p.getSeconds())}'`;
    }
    if (p === null || p === undefined) return "null";
    return String(p);
  });
}

// Check where clause conditions
function evaluateWhere(whereClause: string | null, row: any): boolean {
  if (!whereClause) return true;
  
  let clause = whereClause.trim();
  if (clause.startsWith("(") && clause.endsWith(")")) {
    clause = clause.substring(1, clause.length - 1).trim();
  }

  // Evaluate logical AND
  if (clause.includes(" and ")) {
    const parts = clause.split(" and ");
    return parts.every(p => evaluateWhere(p, row));
  }
  
  // Evaluate logical OR
  if (clause.includes(" or ")) {
    const parts = clause.split(" or ");
    return parts.some(p => evaluateWhere(p, row));
  }

  // Operator parsing: matches `table`.`column` = value
  const match = clause.match(/`\w+`\.`(\w+)`\s*(=|!=|<|>|<=|>=|like|is null|is not null)\s*(.*)/i);
  if (!match) return true;

  const col = match[1];
  const op = match[2].toLowerCase();
  const valStr = match[3].trim();

  const rowVal = row[col];

  if (op === "is null") return rowVal === null || rowVal === undefined;
  if (op === "is not null") return rowVal !== null && rowVal !== undefined;

  let compareVal: any;
  if (valStr.startsWith("'") && valStr.endsWith("'")) {
    compareVal = valStr.substring(1, valStr.length - 1).replace(/''/g, "'");
  } else if (valStr.toLowerCase() === "null") {
    compareVal = null;
  } else if (valStr.toLowerCase() === "true") {
    compareVal = true;
  } else if (valStr.toLowerCase() === "false") {
    compareVal = false;
  } else {
    compareVal = Number(valStr);
    if (isNaN(compareVal)) compareVal = valStr;
  }

  if (op === "=") return String(rowVal) === String(compareVal);
  if (op === "!=") return String(rowVal) !== String(compareVal);
  if (op === "<") return Number(rowVal) < Number(compareVal);
  if (op === ">") return Number(rowVal) > Number(compareVal);
  if (op === "<=") return Number(rowVal) <= Number(compareVal);
  if (op === ">=") return Number(rowVal) >= Number(compareVal);
  
  if (op === "like") {
    const regexStr = compareVal.replace(/%/g, ".*");
    const regex = new RegExp(`^${regexStr}$`, "i");
    return regex.test(String(rowVal));
  }

  return true;
}

// SQL Interpreter
function executeSql(sql: string, params: any[]) {
  const inlinedSql = inlineParams(sql, params).replace(/\s+/g, " ");

  // 1. SELECT
  if (inlinedSql.startsWith("select")) {
    const fromMatch = inlinedSql.match(/from `(\w+)`/);
    if (!fromMatch) return [];
    const table = fromMatch[1];

    const whereMatch = inlinedSql.match(/where (.+?)(?: order by|$| limit)/);
    const whereClause = whereMatch ? whereMatch[1] : null;

    const orderByMatch = inlinedSql.match(/order by `\w+`\.`(\w+)` (asc|desc)/i);
    const orderBy = orderByMatch ? { col: orderByMatch[1], dir: orderByMatch[2].toLowerCase() } : null;

    const limitMatch = inlinedSql.match(/limit (\d+)/i);
    const limit = limitMatch ? parseInt(limitMatch[1]) : null;

    const dbData = readDb();
    const rows = dbData[table] || [];

    let filtered = rows.filter((r: any) => evaluateWhere(whereClause, r));

    if (orderBy) {
      const col = orderBy.col;
      const dir = orderBy.dir;
      filtered.sort((a: any, b: any) => {
        if (a[col] < b[col]) return dir === "asc" ? -1 : 1;
        if (a[col] > b[col]) return dir === "asc" ? 1 : -1;
        return 0;
      });
    }

    if (limit !== null) {
      filtered = filtered.slice(0, limit);
    }

    return filtered;
  }

  // 2. INSERT
  if (inlinedSql.startsWith("insert")) {
    const tableMatch = inlinedSql.match(/insert into `(\w+)`/);
    if (!tableMatch) return [{}];
    const table = tableMatch[1];

    const colsMatch = inlinedSql.match(/\(([^)]+)\) values/);
    const cols = colsMatch ? colsMatch[1].split(", ").map(c => c.replace(/`/g, "")) : [];

    // Extract values part and optional duplicate key clause
    const valuesPartMatch = inlinedSql.match(/values\s+(.+)/i);
    if (!valuesPartMatch) return [{}];
    let valuesStr = valuesPartMatch[1].trim();

    let duplicateClause: string | null = null;
    const duplicateMatch = valuesStr.match(/(.+)\s+on duplicate key update\s+(.+)/i);
    if (duplicateMatch) {
      valuesStr = duplicateMatch[1].trim();
      duplicateClause = duplicateMatch[2].trim();
    }

    // Helper to parse outer rows like (row1), (row2)
    const parseInsertRows = (str: string): string[] => {
      const rows: string[] = [];
      let i = 0;
      while (i < str.length) {
        while (i < str.length && str[i] !== '(') i++;
        if (i >= str.length) break;
        i++; // skip '('

        let rowStr = "";
        let inString = false;
        while (i < str.length) {
          if (str[i] === "'") {
            inString = !inString;
            rowStr += str[i];
            i++;
          } else if (str[i] === ')' && !inString) {
            i++;
            break;
          } else {
            rowStr += str[i];
            i++;
          }
        }
        rows.push(rowStr);
      }
      return rows;
    };

    // Helper to parse individual values inside a row
    const parseSqlValues = (str: string): string[] => {
      const vals: string[] = [];
      let i = 0;
      while (i < str.length) {
        while (i < str.length && (str[i] === ' ' || str[i] === ',')) i++;
        if (i >= str.length) break;

        if (str[i] === "'") {
          let val = "'";
          i++; // skip opening quote
          while (i < str.length) {
            if (str[i] === "'" && str[i + 1] === "'") {
              val += "''";
              i += 2;
            } else if (str[i] === "'") {
              val += "'";
              i++;
              break;
            } else {
              val += str[i];
              i++;
            }
          }
          vals.push(val);
        } else {
          let val = "";
          while (i < str.length && str[i] !== ',') {
            val += str[i];
            i++;
          }
          vals.push(val.trim());
        }
      }
      return vals;
    };

    const rowBlocks = parseInsertRows(valuesStr);
    const rowsToInsert: any[] = [];

    for (const rowValsStr of rowBlocks) {
      const vals = parseSqlValues(rowValsStr);
      const data: any = {};
      vals.forEach((val, i) => {
        const col = cols[i];
        if (!col) return;
        if (val.startsWith("'") && val.endsWith("'")) {
          data[col] = val.substring(1, val.length - 1).replace(/''/g, "'");
        } else if (val === "null") {
          data[col] = null;
        } else if (val === "default" || val === "undefined") {
          data[col] = undefined;
        } else {
          const num = Number(val);
          data[col] = isNaN(num) ? val : num;
        }
      });
      rowsToInsert.push(data);
    }

    const dbData = readDb();
    if (!dbData[table]) dbData[table] = [];

    let lastInsertId: any = 1;

    for (const data of rowsToInsert) {
      // Find existing by primary key or unique fields
      let existingIndex = -1;
      if (table === "users") {
        existingIndex = dbData[table].findIndex((r: any) => 
          (data.username && r.username === data.username) || 
          (data.unionId && r.unionId === data.unionId)
        );
      } else if (table === "parent_child_links") {
        existingIndex = dbData[table].findIndex((r: any) => 
          r.parentId === data.parentId && r.childId === data.childId
        );
      } else if (table === "classroom_students") {
        existingIndex = dbData[table].findIndex((r: any) => 
          r.classroomId === data.classroomId && r.studentId === data.studentId
        );
      } else if (table === "lesson_progress") {
        existingIndex = dbData[table].findIndex((r: any) => 
          r.childId === data.childId && r.lessonId === data.lessonId
        );
      } else if (table === "course_progress") {
        existingIndex = dbData[table].findIndex((r: any) => 
          r.childId === data.childId && r.courseId === data.courseId
        );
      }

      let insertId = data.id;
      if (existingIndex !== -1 && duplicateClause) {
        // Execute set statements
        const updates = duplicateClause.split(", ");
        updates.forEach((u: string) => {
          const kv = u.split(" = ");
          const col = kv[0].replace(/`/g, "").trim();
          const valStr = kv[1].trim();
          let val: any;
          if (valStr.startsWith("'") && valStr.endsWith("'")) {
            val = valStr.substring(1, valStr.length - 1).replace(/''/g, "'");
          } else if (valStr.toLowerCase() === "null") {
            val = null;
          } else {
            val = Number(valStr);
            if (isNaN(val)) val = valStr;
          }
          dbData[table][existingIndex][col] = val;
        });
        insertId = dbData[table][existingIndex].id;
      } else {
        if (data.id === undefined || data.id === null) {
          const maxId = dbData[table].reduce((max: number, r: any) => Math.max(max, r.id || 0), 0);
          data.id = maxId + 1;
        }
        if (data.createdAt === undefined) data.createdAt = new Date().toISOString();
        if (data.updatedAt === undefined) data.updatedAt = new Date().toISOString();
        
        dbData[table].push(data);
        insertId = data.id;
      }
      lastInsertId = insertId;
    }

    writeDb(dbData);
    return [{ insertId: lastInsertId }];
  }

  // 3. UPDATE
  if (inlinedSql.startsWith("update")) {
    const tableMatch = inlinedSql.match(/update `(\w+)`/);
    if (!tableMatch) return { affectedRows: 0 };
    const table = tableMatch[1];

    const setMatch = inlinedSql.match(/set (.+?) where/);
    const setClause = setMatch ? setMatch[1] : "";
    const sets = setClause.split(", ").map(s => {
      const parts = s.split(" = ");
      const col = parts[0].replace(/`/g, "").trim();
      const valStr = parts[1].trim();
      let val: any;
      if (valStr.startsWith("'") && valStr.endsWith("'")) {
        val = valStr.substring(1, valStr.length - 1).replace(/''/g, "'");
      } else if (valStr.toLowerCase() === "null") {
        val = null;
      } else {
        val = Number(valStr);
        if (isNaN(val)) val = valStr;
      }
      return { col, val };
    });

    const whereMatch = inlinedSql.match(/where (.+)/);
    const whereClause = whereMatch ? whereMatch[1] : null;

    const dbData = readDb();
    const rows = dbData[table] || [];

    let affectedRows = 0;
    rows.forEach((r: any) => {
      if (evaluateWhere(whereClause, r)) {
        sets.forEach(s => {
          r[s.col] = s.val;
        });
        r.updatedAt = new Date().toISOString();
        affectedRows++;
      }
    });

    writeDb(dbData);
    return { affectedRows };
  }

  // 4. DELETE
  if (inlinedSql.startsWith("delete")) {
    const tableMatch = inlinedSql.match(/delete from `(\w+)`/);
    if (!tableMatch) return { affectedRows: 0 };
    const table = tableMatch[1];

    const whereMatch = inlinedSql.match(/where (.+)/);
    const whereClause = whereMatch ? whereMatch[1] : null;

    const dbData = readDb();
    const rows = dbData[table] || [];

    const remaining = rows.filter((r: any) => !evaluateWhere(whereClause, r));
    dbData[table] = remaining;

    writeDb(dbData);
    return { affectedRows: rows.length - remaining.length };
  }

  return [];
}

// Recursive Proxy wrapper for Drizzle queries
function wrap(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== "object" && typeof obj !== "function") return obj;

  return new Proxy(obj, {
    get(target, prop, receiver) {
      if (prop === "then") {
        if (typeof target.toSQL === "function") {
          return (onfulfilled: any, onrejected: any) => {
            try {
              const { sql, params } = target.toSQL();
              const result = executeSql(sql, params);
              return Promise.resolve(result).then(onfulfilled, onrejected);
            } catch (err) {
              return Promise.reject(err).catch(onrejected);
            }
          };
        }
      }

      const value = Reflect.get(target, prop, receiver);
      if (typeof value === "function") {
        return function (...args: any[]) {
          const result = value.apply(target, args);
          return wrap(result);
        };
      }
      return wrap(value);
    }
  });
}

// Expose connection
let instance: any;
let pool: any;

export function getDb() {
  if (!instance) {
    const databaseUrl = process.env.DATABASE_URL;
    if (databaseUrl) {
      console.log("Connecting to production MySQL database...");
      pool = mysql.createPool(databaseUrl);
      instance = drizzle(pool, { schema: fullSchema, mode: "default" });
    } else {
      console.log("Using local JSON filesystem mock database...");
      // Check if JSON file exists and has keys. If not, seed it.
      if (!fs.existsSync(dbPath) || Object.keys(readDb()).length === 0) {
        console.log("Database file is missing or empty. Initializing empty database structure...");
        const initialData: any = {};
        Object.keys(schema).forEach(key => {
          const item = (schema as any)[key];
          if (item && item._ && item._.name) {
            initialData[item._.name] = [];
          }
        });
        writeDb(initialData);
      }
      
      // Mock PlanetScale connection
      const mockConn = {
        query: async () => [[]],
        execute: async () => [[]],
      } as any;
      const drizzleInstance = drizzle(mockConn, { schema: fullSchema, mode: "planetscale" });
      
      // Create the DB proxy object
      instance = wrap(drizzleInstance);
    }
  }
  return instance;
}
