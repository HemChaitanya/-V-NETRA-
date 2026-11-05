export type PriorityLevel = 'P1 Critical' | 'P2 High' | 'P3 Moderate';
export type TicketStatus = 'Verified' | 'Dispatched' | 'Pending' | 'Investigating' | 'Resolved';

export interface BoundingBox {
  label: string;
  confidence: number;
  box: {
    x: number; // percentage from left
    y: number; // percentage from top
    w: number; // percentage width
    h: number; // percentage height
  };
}

export interface SpatialClusteringData {
  isDuplicate: boolean;
  mergedTicketCount: number;
  masterTicketId: string;
  clusterRadiusMeters: number;
  summary: string;
  duplicateReports?: Array<{
    reportedAt: string;
    citizenPhoneMasked: string;
    locationNote: string;
  }>;
}

export interface HazardTicket {
  id: string;
  location: string;
  sector: string;
  hazardType: string;
  priority: PriorityLevel;
  status: TicketStatus;
  confidenceScore: number;
  reportedAt: string;
  isSample: boolean;
  lat: number;
  lng: number;
  description: string;
  imageUrl?: string;
  detectedObjects?: BoundingBox[];
  spatialClustering?: SpatialClusteringData;
  feederName?: string;
  substationId?: string;
  assignedCrew?: {
    crewName: string;
    vehicleNo: string;
    etaMinutes: number;
    dispatchedAt: string;
  };
}

export interface TriageResponse {
  hazardClassification: PriorityLevel;
  confidenceScore: number;
  detectedObjects: BoundingBox[];
  structuralFailureType: string;
  lifeThreatSeverity: string;
  electrocutionRisk: string;
  spatialClustering: SpatialClusteringData;
  recommendedAction: string;
  summary: string;
}

export type Language = 'en' | 'te';
