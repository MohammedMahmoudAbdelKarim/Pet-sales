export interface Attraction {
  id: number;
  name: string;
  detail: string;
  coverimage: string;
  latitude: number;
  longitude: number;
}

export interface AttractionResponse {
  attractions: Attraction[];
  total: number;
}
