import { AIKnowledgeBaseRow, AIResultsRow } from './ai';
import { BatteryInventoryRow, BatterySalesRow } from './battery';
import { TelecomSiteRow, CTPowerReportRow } from './telecom';
import { DepartmentRow, ProjectAssignmentRow, DocumentArchiveRow } from './organization';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      ai_knowledge_base: {
        Row: AIKnowledgeBaseRow;
        Insert: Omit<AIKnowledgeBaseRow, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<AIKnowledgeBaseRow, 'id'>>;
      };
      ai_results: {
        Row: AIResultsRow;
        Insert: Omit<AIResultsRow, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<AIResultsRow, 'id'>>;
      };
      battery_inventory: {
        Row: BatteryInventoryRow;
        Insert: Omit<BatteryInventoryRow, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<BatteryInventoryRow, 'id'>>;
      };
      battery_sales: {
        Row: BatterySalesRow;
        Insert: Omit<BatterySalesRow, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<BatterySalesRow, 'id'>>;
      };
      ct_power_reports: {
        Row: CTPowerReportRow;
        Insert: Omit<CTPowerReportRow, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<CTPowerReportRow, 'id'>>;
      };
      departments: {
        Row: DepartmentRow;
        Insert: Omit<DepartmentRow, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<DepartmentRow, 'id'>>;
      };
      project_assignments: {
        Row: ProjectAssignmentRow;
        Insert: Omit<ProjectAssignmentRow, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<ProjectAssignmentRow, 'id'>>;
      };
      document_archive: {
        Row: DocumentArchiveRow;
        Insert: Omit<DocumentArchiveRow, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<DocumentArchiveRow, 'id'>>;
      };
      telecom_sites: {
        Row: TelecomSiteRow;
        Insert: Omit<TelecomSiteRow, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<TelecomSiteRow, 'id'>>;
      };
    };
  };
}