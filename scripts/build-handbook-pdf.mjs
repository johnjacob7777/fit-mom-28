/**
 * Generates the 36-page flagship PDF:
 *   public/fit-mom-20-comeback-handbook.pdf
 *
 * Exports structured copy/tables from `scripts/handbook-data.mjs` and
 * invokes the local Pillow + ReportLab PDF renderer (`scripts/render_handbook_pdf.py`)
 * which embeds real photography (`public/images/handbook/*.jpg`) with zero browser timeouts.
 */
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { execFileSync } from "node:child_process";
import {
  TOC_SECTIONS,
  CORE_CARDS_P1,
  STRENGTH_CARDS_P2,
  WEEKLY_WORKOUTS,
  REGIONAL_MENUS,
  EMERGENCY_DINNERS,
  CRAVING_SWAPS,
} from "./handbook-data.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT_PDF = path.join(ROOT, "public", "fit-mom-20-comeback-handbook.pdf");
const IMG_DIR = path.join(ROOT, "public", "images", "handbook");
const PY_SCRIPT = path.join(ROOT, "scripts", "render_handbook_pdf.py");
const TMP_JSON = path.join(os.tmpdir(), "fit-mom-20-handbook-data.json");

function resolvePython() {
  const winPy = "C:\\Windows\\py.exe";
  if (fs.existsSync(winPy)) return winPy;
  return "python3";
}

function main() {
  const payload = {
    TOC_SECTIONS,
    CORE_CARDS_P1,
    STRENGTH_CARDS_P2,
    WEEKLY_WORKOUTS,
    REGIONAL_MENUS,
    EMERGENCY_DINNERS,
    CRAVING_SWAPS,
  };
  fs.writeFileSync(TMP_JSON, JSON.stringify(payload), "utf8");

  try {
    execFileSync(resolvePython(), [PY_SCRIPT, TMP_JSON, OUT_PDF, IMG_DIR], {
      stdio: "inherit",
      timeout: 180000,
    });
  } finally {
    fs.rmSync(TMP_JSON, { force: true });
  }

  const bytes = fs.readFileSync(OUT_PDF);
  const raw = bytes.toString("latin1");
  const leafPages = (raw.match(/\/Type\s*\/Page\b(?!s)/g) || []).length;
  console.log(`Generated ${OUT_PDF}`);
  console.log(`Size: ${bytes.length.toLocaleString()} bytes | Detected PDF Pages: ${leafPages}`);
  if (leafPages < 30) {
    throw new Error(`Expected >= 30 PDF pages, got ${leafPages}`);
  }
}

main();
