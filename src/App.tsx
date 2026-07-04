import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

type ArtifactId = "wisdom" | "tesseract" | "seed" | "riches" | "time";

type IngredientQty = {
  item: string;
  qty: number;
};

type UpgradeStep = {
  toLevel: number;
  materials: IngredientQty[];
};

type ArtifactData = {
  id: ArtifactId;
  name: string;
  effect: string;
  baseRecipe: IngredientQty[];
  upgradeSteps: UpgradeStep[];
};

type ThemePalette = {
  background: string;
  heroFrom: string;
  heroTo: string;
  panel: string;
  panelSoft: string;
  border: string;
  accent: string;
  accentSoft: string;
  textMain: string;
  textSoft: string;
};

type CombineBranch = {
  item: string;
  qty: number;
  cmbLevel: number;
  materials: Array<IngredientQty & { child?: CombineBranch }>;
};

const PRICE_KEY = "gt-ances-prices-v2";
const SELL_KEY = "gt-ances-sell-v2";

const recipes: Record<string, IngredientQty[]> = {
  "Ancestral Totem of Wisdom": [
    { item: "Crystallized Brilliance", qty: 1 },
    { item: "Ancient Hinge", qty: 2 },
    { item: "Ancient Lens", qty: 5 },
  ],
  "Ancestral Tesseract of Dimensions": [
    { item: "Crystallized Reality", qty: 1 },
    { item: "Ancient Bracket", qty: 2 },
    { item: "Ancient Pin", qty: 5 },
  ],
  "Ancestral Seed of Life": [
    { item: "Crystallized Nature", qty: 1 },
    { item: "Ancient Lens", qty: 2 },
    { item: "Ancient Bracket", qty: 5 },
  ],
  "Ancestral Lens of Riches": [
    { item: "Crystallized Wealth", qty: 1 },
    { item: "Ancient Pin", qty: 2 },
    { item: "Ancient Hinge", qty: 5 },
  ],
  "Ancestral Orb of Time": [
    { item: "Crystallized Time", qty: 1 },
    { item: "Ancient Lens", qty: 2 },
    { item: "Ancient Pin", qty: 5 },
  ],
  "Crystallized Brilliance": [
    { item: "Chandelier", qty: 200 },
    { item: "Typhoon Gate", qty: 4 },
    { item: "Wind Essence", qty: 5 },
  ],
  "Crystallized Reality": [
    { item: "Ancient Plant Seed", qty: 100 },
    { item: "Verdant Gate", qty: 4 },
    { item: "Earth Essence", qty: 5 },
  ],
  "Crystallized Nature": [
    { item: "Crystal Tree", qty: 30 },
    { item: "Tidal Gate", qty: 4 },
    { item: "Water Essence", qty: 5 },
  ],
  "Crystallized Wealth": [
    { item: "Sorcerer Stone", qty: 200 },
    { item: "Inferno Gate", qty: 4 },
    { item: "Fire Essence", qty: 5 },
  ],
  "Crystallized Time": [
    { item: "Hour Glass", qty: 200 },
    { item: "Atomic Gate", qty: 4 },
    { item: "Earth Essence", qty: 5 },
  ],
  "Ancient Hinge": [
    { item: "Fire Asteroid", qty: 2 },
    { item: "Wind Asteroid", qty: 2 },
    { item: "Fire Essence", qty: 5 },
  ],
  "Ancient Lens": [
    { item: "Wind Asteroid", qty: 2 },
    { item: "Earth Asteroid", qty: 2 },
    { item: "Wind Essence", qty: 5 },
  ],
  "Ancient Pin": [
    { item: "Water Asteroid", qty: 2 },
    { item: "Fire Asteroid", qty: 2 },
    { item: "Water Essence", qty: 5 },
  ],
  "Ancient Bracket": [
    { item: "Earth Asteroid", qty: 2 },
    { item: "Water Asteroid", qty: 2 },
    { item: "Earth Essence", qty: 5 },
  ],
  "Typhoon Gate": [
    { item: "Wind Essence", qty: 20 },
    { item: "Fire Essence", qty: 5 },
    { item: "Crystal Gate", qty: 1 },
  ],
  "Verdant Gate": [
    { item: "Earth Essence", qty: 20 },
    { item: "Water Essence", qty: 5 },
    { item: "Crystal Gate", qty: 1 },
  ],
  "Tidal Gate": [
    { item: "Water Essence", qty: 20 },
    { item: "Wind Essence", qty: 5 },
    { item: "Crystal Gate", qty: 1 },
  ],
  "Inferno Gate": [
    { item: "Fire Essence", qty: 20 },
    { item: "Earth Essence", qty: 5 },
    { item: "Crystal Gate", qty: 1 },
  ],
  "Atomic Gate": [
    { item: "Earth Essence", qty: 20 },
    { item: "Wind Essence", qty: 5 },
    { item: "Crystal Gate", qty: 1 },
  ],
  "Fire Asteroid": [
    { item: "Fire Essence", qty: 20 },
    { item: "Earth Essence", qty: 5 },
    { item: "Asteroid", qty: 1 },
  ],
  "Wind Asteroid": [
    { item: "Wind Essence", qty: 20 },
    { item: "Fire Essence", qty: 5 },
    { item: "Asteroid", qty: 1 },
  ],
  "Earth Asteroid": [
    { item: "Earth Essence", qty: 20 },
    { item: "Water Essence", qty: 5 },
    { item: "Asteroid", qty: 1 },
  ],
  "Water Asteroid": [
    { item: "Water Essence", qty: 20 },
    { item: "Wind Essence", qty: 5 },
    { item: "Asteroid", qty: 1 },
  ],
  "Celestial Kaleidoscope": [
    { item: "White Crystal", qty: 2 },
    { item: "Red Crystal", qty: 1 },
    { item: "Green Crystal", qty: 1 },
    { item: "Blue Crystal", qty: 1 },
  ],
  "Harmonic Chimes": [
    { item: "White Crystal", qty: 2 },
    { item: "Red Crystal", qty: 1 },
    { item: "Blue Crystal", qty: 2 },
  ],
  "Plasma Globe": [
    { item: "White Crystal", qty: 2 },
    { item: "Red Crystal", qty: 2 },
    { item: "Green Crystal", qty: 1 },
  ],
  "Crystal Gate": [
    { item: "White Crystal", qty: 1 },
    { item: "Red Crystal", qty: 2 },
    { item: "Blue Crystal", qty: 2 },
  ],
};

const artifacts: ArtifactData[] = [
  {
    id: "wisdom",
    name: "Ancestral Totem of Wisdom",
    effect: "Bonus double XP (5% di level 1, naik per level).",
    baseRecipe: recipes["Ancestral Totem of Wisdom"],
    upgradeSteps: [
      {
        toLevel: 2,
        materials: [
          { item: "Soul Stone", qty: 1 },
          { item: "Celestial Kaleidoscope", qty: 1 },
          { item: "Crystallized Brilliance", qty: 1 },
          { item: "Daily Riddle Item", qty: 5 },
        ],
      },
      {
        toLevel: 3,
        materials: [
          { item: "Soul Stone", qty: 1 },
          { item: "Harmonic Chimes", qty: 1 },
          { item: "Crystallized Brilliance", qty: 1 },
          { item: "Daily Riddle Item", qty: 5 },
        ],
      },
      {
        toLevel: 4,
        materials: [
          { item: "Soul Stone", qty: 2 },
          { item: "Plasma Globe", qty: 1 },
          { item: "Crystallized Brilliance", qty: 1 },
          { item: "Daily Riddle Item", qty: 5 },
        ],
      },
      {
        toLevel: 5,
        materials: [
          { item: "Soul Stone", qty: 2 },
          { item: "Celestial Kaleidoscope", qty: 2 },
          { item: "Crystallized Brilliance", qty: 2 },
          { item: "Daily Riddle Item", qty: 5 },
        ],
      },
    ],
  },
  {
    id: "seed",
    name: "Ancestral Seed of Life",
    effect: "Reduced grow time untuk seed yang ditanam.",
    baseRecipe: recipes["Ancestral Seed of Life"],
    upgradeSteps: [
      {
        toLevel: 2,
        materials: [
          { item: "Soul Stone", qty: 1 },
          { item: "Harmonic Chimes", qty: 1 },
          { item: "Crystallized Nature", qty: 1 },
          { item: "Daily Riddle Item", qty: 5 },
        ],
      },
      {
        toLevel: 3,
        materials: [
          { item: "Soul Stone", qty: 1 },
          { item: "Plasma Globe", qty: 1 },
          { item: "Crystallized Nature", qty: 1 },
          { item: "Daily Riddle Item", qty: 5 },
        ],
      },
      {
        toLevel: 4,
        materials: [
          { item: "Soul Stone", qty: 2 },
          { item: "Celestial Kaleidoscope", qty: 1 },
          { item: "Crystallized Nature", qty: 1 },
          { item: "Daily Riddle Item", qty: 5 },
        ],
      },
      {
        toLevel: 5,
        materials: [
          { item: "Soul Stone", qty: 2 },
          { item: "Harmonic Chimes", qty: 2 },
          { item: "Crystallized Nature", qty: 2 },
          { item: "Daily Riddle Item", qty: 5 },
        ],
      },
    ],
  },
  {
    id: "time",
    name: "Ancestral Orb of Time",
    effect: "Reduced provider time.",
    baseRecipe: recipes["Ancestral Orb of Time"],
    upgradeSteps: [
      {
        toLevel: 2,
        materials: [
          { item: "Soul Stone", qty: 1 },
          { item: "Harmonic Chimes", qty: 1 },
          { item: "Crystallized Time", qty: 1 },
          { item: "Daily Riddle Item", qty: 5 },
        ],
      },
      {
        toLevel: 3,
        materials: [
          { item: "Soul Stone", qty: 1 },
          { item: "Celestial Kaleidoscope", qty: 1 },
          { item: "Crystallized Time", qty: 1 },
          { item: "Daily Riddle Item", qty: 5 },
        ],
      },
      {
        toLevel: 4,
        materials: [
          { item: "Soul Stone", qty: 2 },
          { item: "Plasma Globe", qty: 1 },
          { item: "Crystallized Time", qty: 1 },
          { item: "Daily Riddle Item", qty: 5 },
        ],
      },
      {
        toLevel: 5,
        materials: [
          { item: "Soul Stone", qty: 2 },
          { item: "Harmonic Chimes", qty: 2 },
          { item: "Crystallized Time", qty: 2 },
          { item: "Daily Riddle Item", qty: 5 },
        ],
      },
    ],
  },
  {
    id: "tesseract",
    name: "Ancestral Tesseract of Dimensions",
    effect: "Bonus extra block drop (5% di level 1, naik per level).",
    baseRecipe: recipes["Ancestral Tesseract of Dimensions"],
    upgradeSteps: [
      {
        toLevel: 2,
        materials: [
          { item: "Soul Stone", qty: 1 },
          { item: "Plasma Globe", qty: 1 },
          { item: "Crystallized Reality", qty: 1 },
          { item: "Daily Riddle Item", qty: 5 },
        ],
      },
      {
        toLevel: 3,
        materials: [
          { item: "Soul Stone", qty: 1 },
          { item: "Celestial Kaleidoscope", qty: 1 },
          { item: "Crystallized Reality", qty: 1 },
          { item: "Daily Riddle Item", qty: 5 },
        ],
      },
      {
        toLevel: 4,
        materials: [
          { item: "Soul Stone", qty: 2 },
          { item: "Harmonic Chimes", qty: 1 },
          { item: "Crystallized Reality", qty: 1 },
          { item: "Daily Riddle Item", qty: 5 },
        ],
      },
      {
        toLevel: 5,
        materials: [
          { item: "Soul Stone", qty: 2 },
          { item: "Plasma Globe", qty: 2 },
          { item: "Crystallized Reality", qty: 2 },
          { item: "Daily Riddle Item", qty: 5 },
        ],
      },
    ],
  },
  {
    id: "riches",
    name: "Ancestral Lens of Riches",
    effect: "Bonus extra gems saat break block.",
    baseRecipe: recipes["Ancestral Lens of Riches"],
    upgradeSteps: [
      {
        toLevel: 2,
        materials: [
          { item: "Soul Stone", qty: 1 },
          { item: "Celestial Kaleidoscope", qty: 2 },
          { item: "Crystallized Wealth", qty: 1 },
          { item: "Daily Riddle Item", qty: 5 },
        ],
      },
      {
        toLevel: 3,
        materials: [
          { item: "Soul Stone", qty: 1 },
          { item: "Plasma Globe", qty: 2 },
          { item: "Crystallized Wealth", qty: 1 },
          { item: "Daily Riddle Item", qty: 5 },
        ],
      },
      {
        toLevel: 4,
        materials: [
          { item: "Soul Stone", qty: 2 },
          { item: "Harmonic Chimes", qty: 2 },
          { item: "Crystallized Wealth", qty: 1 },
          { item: "Daily Riddle Item", qty: 5 },
        ],
      },
      {
        toLevel: 5,
        materials: [
          { item: "Soul Stone", qty: 2 },
          { item: "Celestial Kaleidoscope", qty: 3 },
          { item: "Crystallized Wealth", qty: 2 },
          { item: "Daily Riddle Item", qty: 5 },
        ],
      },
    ],
  },
];

const artifactThemes: Record<ArtifactId, ThemePalette> = {
  wisdom: {
    background: "#4a2f00",
    heroFrom: "#fbbf24",
    heroTo: "#d97706",
    panel: "rgba(122, 74, 0, 0.7)",
    panelSoft: "rgba(255, 205, 96, 0.15)",
    border: "rgba(255, 236, 176, 0.42)",
    accent: "#fde047",
    accentSoft: "rgba(253, 224, 71, 0.25)",
    textMain: "#fffdf5",
    textSoft: "#fef3c7",
  },
  seed: {
    background: "#0f3a24",
    heroFrom: "#4ade80",
    heroTo: "#16a34a",
    panel: "rgba(12, 86, 43, 0.72)",
    panelSoft: "rgba(110, 231, 163, 0.12)",
    border: "rgba(187, 247, 208, 0.42)",
    accent: "#86efac",
    accentSoft: "rgba(134, 239, 172, 0.24)",
    textMain: "#f7fff8",
    textSoft: "#d1fae5",
  },
  time: {
    background: "#4b1248",
    heroFrom: "#f472b6",
    heroTo: "#db2777",
    panel: "rgba(123, 29, 110, 0.72)",
    panelSoft: "rgba(251, 113, 133, 0.12)",
    border: "rgba(251, 207, 232, 0.45)",
    accent: "#f9a8d4",
    accentSoft: "rgba(249, 168, 212, 0.25)",
    textMain: "#fff7fb",
    textSoft: "#fce7f3",
  },
  tesseract: {
    background: "#0d3054",
    heroFrom: "#67e8f9",
    heroTo: "#22d3ee",
    panel: "rgba(11, 74, 117, 0.72)",
    panelSoft: "rgba(103, 232, 249, 0.13)",
    border: "rgba(207, 250, 254, 0.4)",
    accent: "#a5f3fc",
    accentSoft: "rgba(165, 243, 252, 0.25)",
    textMain: "#f4fcff",
    textSoft: "#cffafe",
  },
  riches: {
    background: "#4f1116",
    heroFrom: "#fb7185",
    heroTo: "#e11d48",
    panel: "rgba(119, 24, 38, 0.72)",
    panelSoft: "rgba(251, 113, 133, 0.12)",
    border: "rgba(254, 205, 211, 0.42)",
    accent: "#fda4af",
    accentSoft: "rgba(253, 164, 175, 0.24)",
    textMain: "#fff7f8",
    textSoft: "#ffe4e6",
  },
};

const mainPriceItems = [
  "Chandelier",
  "Ancient Plant Seed",
  "Crystal Tree",
  "Sorcerer Stone",
  "Hour Glass",
  "Fire Essence",
  "Water Essence",
  "Earth Essence",
  "Wind Essence",
  "Asteroid",
  "Crystal Gate",
  "Soul Stone",
  "Daily Riddle Item",
  "Red Crystal",
  "Green Crystal",
  "Blue Crystal",
  "White Crystal",
] as const;

const defaultPrices: Record<string, number> = {
  Chandelier: 0.2,
  "Ancient Plant Seed": 6,
  "Crystal Tree": 1.5,
  "Sorcerer Stone": 0.2,
  "Hour Glass": 0.1,
  "Fire Essence": 0.05,
  "Water Essence": 0.5,
  "Earth Essence": 0.01,
  "Wind Essence": 0.5,
  Asteroid: 18,
  "Crystal Gate": 22,
  "Soul Stone": 30,
  "Daily Riddle Item": 0.3,
  "Red Crystal": 4,
  "Green Crystal": 1,
  "Blue Crystal": 4,
  "White Crystal": 220,
};

const defaultSellPrice: Record<ArtifactId, number> = {
  wisdom: 2000,
  seed: 2100,
  time: 2200,
  tesseract: 2500,
  riches: 2100,
};

const upgradeComponentItems = ["Celestial Kaleidoscope", "Harmonic Chimes", "Plasma Globe"] as const;
const cmbMarkers = ["◆", "●", "▲", "■", "▸", "•"];
const cmbColors = [
  "border-cyan-300/70 bg-cyan-400/15",
  "border-indigo-300/70 bg-indigo-400/15",
  "border-violet-300/70 bg-violet-400/15",
  "border-emerald-300/70 bg-emerald-400/15",
  "border-amber-300/70 bg-amber-400/15",
  "border-rose-300/70 bg-rose-400/15",
];

const upgradeNeedOrder = [
  "Crystallized Brilliance",
  "Crystallized Reality",
  "Crystallized Nature",
  "Crystallized Wealth",
  "Crystallized Time",
  "Plasma Globe",
  "Harmonic Chimes",
  "Celestial Kaleidoscope",
  "Daily Riddle Item",
  "Soul Stone",
];

const formatNumber = (value: number) => {
  if (!Number.isFinite(value)) return "0";
  return value.toLocaleString("id-ID", { maximumFractionDigits: 3 });
};

const mergeIngredients = (items: IngredientQty[]) => {
  const grouped = new Map<string, number>();
  items.forEach((entry) => {
    grouped.set(entry.item, (grouped.get(entry.item) ?? 0) + entry.qty);
  });

  return [...grouped.entries()]
    .map(([item, qty]) => ({ item, qty }))
    .sort((a, b) => a.item.localeCompare(b.item));
};

const sortByOrder = (items: IngredientQty[], order: readonly string[]) => {
  const rank = new Map(order.map((item, index) => [item, index]));
  const offset = order.length + 1;

  return [...items].sort((a, b) => {
    const rankA = rank.get(a.item) ?? offset;
    const rankB = rank.get(b.item) ?? offset;
    if (rankA !== rankB) return rankA - rankB;
    return a.item.localeCompare(b.item);
  });
};

const expandToRoots = (item: string, qty: number): IngredientQty[] => {
  const recipe = recipes[item];
  if (!recipe) return [{ item, qty }];

  return mergeIngredients(recipe.flatMap((part) => expandToRoots(part.item, part.qty * qty)));
};

const buildCombineBranch = (item: string, qty: number, cmbLevel: number): CombineBranch => {
  const recipe = recipes[item] ?? [];
  const materials = recipe.map((part) => {
    const multipliedQty = part.qty * qty;
    if (recipes[part.item]) {
      return {
        item: part.item,
        qty: multipliedQty,
        child: buildCombineBranch(part.item, multipliedQty, cmbLevel + 1),
      };
    }

    return { item: part.item, qty: multipliedQty };
  });

  return {
    item,
    qty,
    cmbLevel,
    materials,
  };
};

const parseStoredObject = (key: string): Record<string, number> | null => {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(key);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Record<string, number>;
    if (parsed && typeof parsed === "object") return parsed;
    return null;
  } catch {
    return null;
  }
};

export default function App() {
  const [selectedArtifactId, setSelectedArtifactId] = useState<ArtifactId>("wisdom");
  const [targetLevel, setTargetLevel] = useState(5);
  const [prices, setPrices] = useState<Record<string, number>>(() => {
    const stored = parseStoredObject(PRICE_KEY);
    if (!stored) return defaultPrices;

    return { ...defaultPrices, ...stored };
  });
  const [sellPrice, setSellPrice] = useState<Record<ArtifactId, number>>(() => {
    const stored = parseStoredObject(SELL_KEY);
    if (!stored) return defaultSellPrice;

    return {
      wisdom: Number(stored.wisdom ?? defaultSellPrice.wisdom),
      seed: Number(stored.seed ?? defaultSellPrice.seed),
      time: Number(stored.time ?? defaultSellPrice.time),
      tesseract: Number(stored.tesseract ?? defaultSellPrice.tesseract),
      riches: Number(stored.riches ?? defaultSellPrice.riches),
    };
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(PRICE_KEY, JSON.stringify(prices));
    }
  }, [prices]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(SELL_KEY, JSON.stringify(sellPrice));
    }
  }, [sellPrice]);

  const selectedArtifact = artifacts.find((entry) => entry.id === selectedArtifactId) ?? artifacts[0];
  const theme = artifactThemes[selectedArtifact.id];

  const baseRootMaterials = useMemo(() => {
    return mergeIngredients(selectedArtifact.baseRecipe.flatMap((part) => expandToRoots(part.item, part.qty)));
  }, [selectedArtifact]);

  const baseCost = useMemo(() => {
    return baseRootMaterials.reduce((sum, row) => sum + row.qty * (prices[row.item] ?? 0), 0);
  }, [baseRootMaterials, prices]);

  const selectedUpgradeSteps = useMemo(() => {
    return selectedArtifact.upgradeSteps.filter((step) => step.toLevel <= targetLevel);
  }, [selectedArtifact, targetLevel]);

  const upgradeStepCosts = useMemo(() => {
    return selectedUpgradeSteps.map((step) => {
      const roots = mergeIngredients(step.materials.flatMap((part) => expandToRoots(part.item, part.qty)));
      const total = roots.reduce((sum, row) => sum + row.qty * (prices[row.item] ?? 0), 0);
      return { ...step, roots, total };
    });
  }, [selectedUpgradeSteps, prices]);

  const upgradeRootTotals = useMemo(() => {
    return mergeIngredients(upgradeStepCosts.flatMap((step) => step.roots));
  }, [upgradeStepCosts]);

  const upgradeDirectTotals = useMemo(() => {
    return mergeIngredients(selectedUpgradeSteps.flatMap((step) => step.materials));
  }, [selectedUpgradeSteps]);

  const orderedBaseRootMaterials = useMemo(() => {
    return sortByOrder(baseRootMaterials, mainPriceItems);
  }, [baseRootMaterials]);

  const orderedUpgradeRootTotals = useMemo(() => {
    return sortByOrder(upgradeRootTotals, mainPriceItems);
  }, [upgradeRootTotals]);

  const orderedUpgradeDirectTotals = useMemo(() => {
    return sortByOrder(upgradeDirectTotals, upgradeNeedOrder);
  }, [upgradeDirectTotals]);

  const totalUpgradeCost = useMemo(() => {
    return upgradeStepCosts.reduce((sum, step) => sum + step.total, 0);
  }, [upgradeStepCosts]);

  const totalCraftCost = baseCost + totalUpgradeCost;
  const estimatedProfit = (sellPrice[selectedArtifact.id] ?? 0) - totalCraftCost;
  const combineBranches = useMemo(() => {
    return selectedArtifact.baseRecipe
      .filter((part) => Boolean(recipes[part.item]))
      .map((part) => buildCombineBranch(part.item, part.qty, 1));
  }, [selectedArtifact]);

  const renderCombineBranch = (branch: CombineBranch, indent = 0) => {
    const marker = cmbMarkers[(branch.cmbLevel - 1) % cmbMarkers.length] ?? "•";
    const colorClass = cmbColors[(branch.cmbLevel - 1) % cmbColors.length] ?? cmbColors[0];

    return (
      <div className="space-y-1" style={{ paddingLeft: `${indent * 18}px` }}>
        <div className={`rounded-md border p-2 ${colorClass}`}>
          <p className="font-gt-title text-sm">
            {marker} CMB {branch.cmbLevel}: {branch.item}
            {branch.qty > 1 ? ` x${formatNumber(branch.qty)}` : ""}
          </p>
          <div className="mt-1 space-y-0.5 text-xs">
            {branch.materials.map((material) => (
              <p key={`${branch.item}-${material.item}-${material.qty}`}>* {material.item} x{formatNumber(material.qty)}</p>
            ))}
          </div>
        </div>
        {branch.materials
          .filter((material) => material.child)
          .map((material) => renderCombineBranch(material.child as CombineBranch, indent + 1))}
      </div>
    );
  };

  return (
    <div
      style={
        {
          "--gt-bg": theme.background,
          "--gt-hero-from": theme.heroFrom,
          "--gt-hero-to": theme.heroTo,
          "--gt-panel": theme.panel,
          "--gt-panel-soft": theme.panelSoft,
          "--gt-border": theme.border,
          "--gt-accent": theme.accent,
          "--gt-accent-soft": theme.accentSoft,
          "--gt-text-main": theme.textMain,
          "--gt-text-soft": theme.textSoft,
        } as React.CSSProperties
      }
      className="min-h-screen bg-[var(--gt-bg)] text-[var(--gt-text-main)] transition-colors duration-500"
    >
      <header className="relative overflow-hidden border-b border-[var(--gt-border)] bg-gradient-to-r from-[var(--gt-hero-from)] to-[var(--gt-hero-to)] px-6 py-10">
        <motion.div
          aria-hidden
          animate={{ x: [0, 26, 0], y: [0, -10, 0], rotate: [0, 12, 0] }}
          transition={{ duration: 10, ease: "easeInOut", repeat: Number.POSITIVE_INFINITY }}
          className="absolute -top-8 right-16 h-28 w-28 rounded-2xl border border-white/35 bg-white/15"
        />
        <motion.div
          aria-hidden
          animate={{ x: [0, -20, 0], y: [0, 12, 0] }}
          transition={{ duration: 8, ease: "easeInOut", repeat: Number.POSITIVE_INFINITY }}
          className="absolute left-8 top-5 h-24 w-24 rounded-full border border-white/35 bg-white/10"
        />
        <div className="mx-auto max-w-7xl">
          <p className="text-xs tracking-[0.3em] text-white/90">GROWTOPIA CALCULATOR</p>
          <h1 className="font-gt-title text-4xl tracking-wide md:text-5xl">GT ANCESTRAL LAB</h1>
          <p className="mt-3 max-w-4xl text-[var(--gt-text-soft)]">
            Semua cost dari satu Main Data, resep lengkap sampai bahan akar, upgrade step by step, total biaya, dan
            profit 1x crafting.
          </p>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8">
        <section className="rounded-xl border border-[var(--gt-border)] bg-[var(--gt-panel)] p-4">
          <h2 className="font-gt-title text-2xl">Main Data Harga Global</h2>
          <p className="mb-3 text-sm text-[var(--gt-text-soft)]">
            Data tersimpan otomatis di browser. Reload app tidak perlu isi ulang, kecuali Anda ganti nilainya.
          </p>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-[var(--gt-panel-soft)]">
                <tr>
                  <th className="px-3 py-2 text-left">Item</th>
                  <th className="px-3 py-2 text-left">WL / item</th>
                  <th className="px-3 py-2 text-left">item / WL</th>
                </tr>
              </thead>
              <tbody>
                {mainPriceItems.map((item) => {
                  const wlPerItem = prices[item] ?? 0;
                  const itemPerWl = wlPerItem > 0 ? 1 / wlPerItem : 0;
                  return (
                    <tr key={item} className="border-t border-[var(--gt-border)]/60">
                      <td className="px-3 py-2">{item}</td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          min="0"
                          step="0.001"
                          value={wlPerItem === 0 ? "" : wlPerItem}
                          onChange={(event) => {
                            const value = Number(event.target.value);
                            setPrices((prev) => ({ ...prev, [item]: Number.isFinite(value) ? value : 0 }));
                          }}
                          className="w-full rounded-md border border-[var(--gt-border)] bg-black/20 px-2 py-1 text-left"
                          placeholder="0"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          min="0"
                          step="0.001"
                          value={itemPerWl === 0 ? "" : itemPerWl}
                          onChange={(event) => {
                            const value = Number(event.target.value);
                            const wl = value > 0 ? 1 / value : 0;
                            setPrices((prev) => ({ ...prev, [item]: Number.isFinite(wl) ? wl : 0 }));
                          }}
                          className="w-full rounded-md border border-[var(--gt-border)] bg-black/20 px-2 py-1 text-left"
                          placeholder="0"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-xl border border-[var(--gt-border)] bg-[var(--gt-panel)] p-4">
          <h2 className="font-gt-title text-2xl">Pilih Artifact</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {artifacts.map((artifact) => {
              const active = artifact.id === selectedArtifact.id;
              return (
                <button
                  key={artifact.id}
                  type="button"
                  onClick={() => setSelectedArtifactId(artifact.id)}
                  className={`rounded-md border px-3 py-2 text-sm transition ${
                    active
                      ? "border-white bg-[var(--gt-accent-soft)] text-white"
                      : "border-[var(--gt-border)] bg-black/15 hover:bg-black/25"
                  }`}
                >
                  {artifact.name}
                </button>
              );
            })}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-[var(--gt-border)] bg-[var(--gt-panel)] p-4">
            <h3 className="font-gt-title text-2xl text-[var(--gt-accent)]">{selectedArtifact.name}</h3>
            <p className="mt-1 text-[var(--gt-text-soft)]">{selectedArtifact.effect}</p>

            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <label className="text-sm">
                Target level
                <select
                  value={targetLevel}
                  onChange={(event) => setTargetLevel(Number(event.target.value))}
                  className="mt-1 w-full rounded-md border border-[var(--gt-border)] bg-black/20 px-2 py-2"
                >
                  <option value={1}>Level 1 (base)</option>
                  <option value={2}>Level 2</option>
                  <option value={3}>Level 3</option>
                  <option value={4}>Level 4</option>
                  <option value={5}>Level 5</option>
                </select>
              </label>
              <label className="text-sm">
                Harga jual (WL/item)
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={sellPrice[selectedArtifact.id]}
                  onChange={(event) => {
                    const value = Number(event.target.value);
                    setSellPrice((prev) => ({
                      ...prev,
                      [selectedArtifact.id]: Number.isFinite(value) ? value : 0,
                    }));
                  }}
                  className="mt-1 w-full rounded-md border border-[var(--gt-border)] bg-black/20 px-2 py-2"
                />
              </label>
            </div>

            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <div className="rounded-md border border-[var(--gt-border)] bg-black/20 p-3">
                <p className="text-sm text-[var(--gt-text-soft)]">Cost L1</p>
                <p className="text-xl">{formatNumber(baseCost)} WL</p>
              </div>
              <div className="rounded-md border border-[var(--gt-border)] bg-black/20 p-3">
                <p className="text-sm text-[var(--gt-text-soft)]">Total upgrade L1-L{targetLevel}</p>
                <p className="text-xl">{formatNumber(totalUpgradeCost)} WL</p>
              </div>
              <div className="rounded-md border border-[var(--gt-border)] bg-black/20 p-3">
                <p className="text-sm text-[var(--gt-text-soft)]">Total craft</p>
                <p className="text-xl">{formatNumber(totalCraftCost)} WL</p>
              </div>
              <div className="rounded-md border border-[var(--gt-border)] bg-black/20 p-3">
                <p className="text-sm text-[var(--gt-text-soft)]">Profit 1x craft</p>
                <p className={`text-xl ${estimatedProfit >= 0 ? "text-lime-300" : "text-rose-300"}`}>
                  {formatNumber(estimatedProfit)} WL
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--gt-border)] bg-[var(--gt-panel)] p-4">
            <h3 className="font-gt-title text-xl">Resep Sampai Akar</h3>
            <p className="text-xs text-[var(--gt-text-soft)]">
              Format baru berbasis CMB (Combine). CMB berikutnya adalah penguraian bahan dari CMB sebelumnya.
            </p>
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedArtifact.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mt-3 max-h-[430px] overflow-auto rounded-md border border-[var(--gt-border)] bg-black/20 p-3 text-xs leading-6"
              >
                <div className="mb-3 text-[11px] text-[var(--gt-text-soft)]">
                  CMB Utama adalah combine Ances (3 komponen). Lalu CMB cabang di-reset dari 1 pada tiap komponen
                  utama: Crystallized, Ancient, Ancient.
                </div>
                <div className="mb-3 rounded-md border border-[var(--gt-border)] bg-[var(--gt-accent-soft)] p-2">
                  <p className="font-gt-title text-sm">◆ CMB Utama: {selectedArtifact.name}</p>
                  <div className="mt-1 space-y-0.5 text-xs">
                    {selectedArtifact.baseRecipe.map((part) => (
                      <p key={`main-${part.item}`}>* {part.item} x{formatNumber(part.qty)}</p>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  {combineBranches.map((branch, index) => (
                    <div key={`${branch.item}-${index}`}>{renderCombineBranch(branch)}</div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-[var(--gt-border)] bg-[var(--gt-panel)] p-4">
            <h3 className="font-gt-title text-xl">Cost Craft L1 (Akar Bahan)</h3>
            <div className="mt-3 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-[var(--gt-panel-soft)]">
                  <tr>
                    <th className="px-2 py-2 text-left">Item</th>
                    <th className="px-2 py-2 text-right">Jumlah</th>
                    <th className="px-2 py-2 text-right">Harga</th>
                    <th className="px-2 py-2 text-right">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {orderedBaseRootMaterials.map((row) => {
                    const unit = prices[row.item] ?? 0;
                    const total = row.qty * unit;
                    return (
                      <tr key={row.item} className="border-t border-[var(--gt-border)]/55">
                        <td className="px-2 py-2">{row.item}</td>
                        <td className="px-2 py-2 text-right">{formatNumber(row.qty)}</td>
                        <td className="px-2 py-2 text-right">{formatNumber(unit)}</td>
                        <td className="px-2 py-2 text-right">{formatNumber(total)}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t border-[var(--gt-border)] bg-[var(--gt-panel-soft)]">
                    <td className="px-2 py-2" colSpan={3}>
                      Total L1
                    </td>
                    <td className="px-2 py-2 text-right">{formatNumber(baseCost)} WL</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--gt-border)] bg-[var(--gt-panel)] p-4">
            <h3 className="font-gt-title text-xl">Sesi Upgrade dan Cost</h3>
            <p className="text-xs text-[var(--gt-text-soft)]">
              Menampilkan step per level + total kebutuhan sampai target level (contoh L1-L3).
            </p>
            <div className="mt-3 space-y-3">
              {upgradeStepCosts.length === 0 ? (
                <p className="text-sm text-[var(--gt-text-soft)]">Target masih level 1, belum butuh upgrade.</p>
              ) : (
                upgradeStepCosts.map((step, index) => {
                  const cumulative = upgradeStepCosts
                    .slice(0, index + 1)
                    .reduce((sum, current) => sum + current.total, 0);
                  return (
                    <motion.div
                      key={step.toLevel}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="rounded-md border border-[var(--gt-border)] bg-black/20 p-3"
                    >
                      <p className="font-gt-title text-lg">Upgrade ke Level {step.toLevel}</p>
                      <p className="text-xs text-[var(--gt-text-soft)]">
                        {step.materials.map((item) => `${item.qty} ${item.item}`).join(" + ")}
                      </p>
                      <div className="mt-1 flex flex-wrap gap-4 text-sm">
                        <span>Cost step: {formatNumber(step.total)} WL</span>
                        <span>Total s.d. L{step.toLevel}: {formatNumber(cumulative)} WL</span>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-[var(--gt-border)] bg-[var(--gt-panel)] p-4">
            <h3 className="font-gt-title text-xl">Total Kebutuhan Upgrade (Bahan Inti)</h3>
            <div className="mt-3 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-[var(--gt-panel-soft)]">
                  <tr>
                    <th className="px-2 py-2 text-left">Bahan</th>
                    <th className="px-2 py-2 text-right">Total Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {orderedUpgradeDirectTotals.map((row) => (
                    <tr key={row.item} className="border-t border-[var(--gt-border)]/55">
                      <td className="px-2 py-2">{row.item}</td>
                      <td className="px-2 py-2 text-right">{formatNumber(row.qty)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--gt-border)] bg-[var(--gt-panel)] p-4">
            <h3 className="font-gt-title text-xl">Total Cost Upgrade (Akar Bahan)</h3>
            <div className="mt-3 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-[var(--gt-panel-soft)]">
                  <tr>
                    <th className="px-2 py-2 text-left">Item akar</th>
                    <th className="px-2 py-2 text-right">Jumlah</th>
                    <th className="px-2 py-2 text-right">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {orderedUpgradeRootTotals.map((row) => {
                    const total = row.qty * (prices[row.item] ?? 0);
                    return (
                      <tr key={row.item} className="border-t border-[var(--gt-border)]/55">
                        <td className="px-2 py-2">{row.item}</td>
                        <td className="px-2 py-2 text-right">{formatNumber(row.qty)}</td>
                        <td className="px-2 py-2 text-right">{formatNumber(total)}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t border-[var(--gt-border)] bg-[var(--gt-panel-soft)]">
                    <td className="px-2 py-2" colSpan={2}>
                      Total Upgrade L1-L{targetLevel}
                    </td>
                    <td className="px-2 py-2 text-right">{formatNumber(totalUpgradeCost)} WL</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-[var(--gt-border)] bg-[var(--gt-panel)] p-4">
          <h3 className="font-gt-title text-xl">Resep Bahan Upgrade</h3>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            {upgradeComponentItems.map((item) => {
              const ingredients = recipes[item] ?? [];
              const totalCost = ingredients.reduce((sum, row) => sum + row.qty * (prices[row.item] ?? 0), 0);
              return (
                <div key={item} className="rounded-md border border-[var(--gt-border)] bg-black/20 p-3">
                  <p className="font-gt-title text-lg text-[var(--gt-accent)]">{item}</p>
                  <p className="mt-1 text-sm text-[var(--gt-text-soft)]">
                    {ingredients.map((row) => `${row.qty} ${row.item}`).join(" + ")}
                  </p>
                  <p className="mt-1 text-sm">Cost / item: {formatNumber(totalCost)} WL</p>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}