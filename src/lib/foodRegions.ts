export type FoodRegion =
  | "indian_balanced"
  | "north_indian"
  | "south_indian"
  | "western_global";

export const FOOD_REGIONS: {
  id: FoodRegion;
  label: string;
  shortLabel: string;
  desc: string;
}[] = [
  {
    id: "indian_balanced",
    label: "All-India Home Mix",
    shortLabel: "All-India",
    desc: "Balanced mix of dal-roti, idli, poha, khichdi & quick oats/toast",
  },
  {
    id: "north_indian",
    label: "North Indian Home",
    shortLabel: "North Indian",
    desc: "Besan chilla, rajma chawal, dal-roti, palak paneer, khichdi, makhana",
  },
  {
    id: "south_indian",
    label: "South Indian Home",
    shortLabel: "South Indian",
    desc: "Idli, ragi dosa, ven pongal, sambar rice, curd rice, rasam, sundal",
  },
  {
    id: "western_global",
    label: "US / UK / Global Quick",
    shortLabel: "Global Quick",
    desc: "Berry oats, avocado toast, quinoa bowls, soups, salads & wraps",
  },
];
