export type ModelType = 'hallux_valgus' | 'flat_foot';

export interface AnalysisResult {
  footType: 'Left' | 'Right';
  condition: string;
  confidence: number;
  date: string;
  annotatedImageUrl?: string;
}

export interface YoloPrediction {
  label: string;
  confidence: number;
  bbox: number[];
}

export interface YoloResponse {
  predictions: YoloPrediction[];
  annotated_image_url: string;
}

export interface TensorflowResponse {
  class: string;
  confidence: number;
}

export interface NavItem {
  label: string;
  href: string;
  icon: string;
}