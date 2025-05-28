export interface DailySales {
  date: string;
  animal: string;
  price: number;
}

export interface WeeklySales {
  series: Array<{ name: string; data: number[] }>;
  categories: string[];
}
