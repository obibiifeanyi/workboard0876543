import { supabase } from '@/integrations/supabase/client';
import { DocumentAnalysis as BaseDocumentAnalysis } from '@/types/ai';
import { v4 as uuidv4 } from 'uuid';

// Simple UUID generator function to replace the uuid package
function generateUUID() {
  return uuidv4();
}

// Use the base type and extend it if needed
export type DocumentAnalysis = BaseDocumentAnalysis & {
  status?: string;
  processing_time_ms?: number;
  document_type?: string;
  confidence_score?: number;
}

/**
 * Detects the document type based on content and filename
 */
export const detectDocumentType = (content: string, fileName: string): string => {
  // Check file extension first
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  if (extension === 'pdf') return 'pdf';
  if (['doc', 'docx'].includes(extension || '')) return 'word';
  if (['xls', 'xlsx', 'csv'].includes(extension || '')) return 'spreadsheet';
  if (['ppt', 'pptx'].includes(extension || '')) return 'presentation';
  
  // Content-based detection
  const contentLower = content.toLowerCase();
  if (contentLower.includes('invoice') || contentLower.includes('amount due') || contentLower.includes('payment')) {
    return 'invoice';
  }
  
  if (contentLower.includes('contract') || contentLower.includes('agreement') || contentLower.includes('terms and conditions')) {
    return 'contract';
  }
  
  if (contentLower.includes('report') || contentLower.includes('analysis') || contentLower.includes('findings')) {
    return 'report';
  }
  
  // Default
  return 'general';
};

/**
 * Gets a specialized prompt for the document type
 */
export const getDocumentTypePrompt = (documentType: string): string => {
  const prompts: Record<string, string> = {
    invoice: "This appears to be an invoice. Extract the invoice number, date, amount due, vendor, and payment terms.",
    contract: "This appears to be a contract. Identify the parties involved, key terms, effective date, and termination conditions.",
    report: "This appears to be a report. Summarize the main findings, methodology, and recommendations.",
    general: "Analyze this document and provide a summary, key points, and any actionable insights."
  };
  
  return prompts[documentType] || prompts.general;
};

/**
 * Analyzes a document using AI and stores the results
 */
export const analyzeDocument = async (file: File, userId: string): Promise<DocumentAnalysis> => {
  try {
    const startTime = Date.now();
    const analysisId = generateUUID();

    // Extract text content for document type detection
    let textContent = '';
    try {
      if (file.type === 'text/plain') {
        textContent = await file.text();
      } else {
        // For other file types, we'll use a placeholder for now
        textContent = "Sample text content";
      }
    } catch (error) {
      console.error('Error extracting text:', error);
      textContent = "Error extracting text content";
    }

    // Simulate document type detection
    const documentType = detectDocumentType(textContent, file.name);

    // Simulate entity extraction
    const keyEntities = extractEntities(textContent);

    const processingTime = Date.now() - startTime;

    const analysis: DocumentAnalysis = {
      id: analysisId,
      userId,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      analysisDate: new Date(),
      processingTime,
      extractedText: textContent,
      keyEntities,
      documentType,
      confidence: 0.85
    };

    // Save analysis to database
    const { error } = await supabase
      .from('document_analysis')
      .insert(analysis);

    if (error) throw error;

    return analysis;
  } catch (error) {
    console.error('Error analyzing document:', error);
    throw error;
  }
};

const extractEntities = (text: string) => {
  // Simple entity extraction logic
  return [
    {
      type: 'date',
      value: new Date().toISOString(),
      confidence: 0.9
    },
    {
      type: 'amount',
      value: '$1,234.56',
      confidence: 0.8
    }
  ];
};

/**
 * Gets document analyses for a user
 */
export const getDocumentAnalyses = async (userId: string): Promise<DocumentAnalysis[]> => {
  try {
    // Use memos table as fallback
    const { data, error } = await supabase
      .from('memos')
      .select('*')
      .eq('created_by', userId)
      .like('title', 'Document Analysis:%')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(memo => {
      let analysisResult;
      try {
        analysisResult = JSON.parse(memo.content);
      } catch {
        analysisResult = { summary: memo.content };
      }
      
      return {
        id: memo.id,
        file_name: memo.title.replace('Document Analysis: ', ''),
        analysis_result: analysisResult,
        status: memo.status || 'completed',
        created_by: memo.created_by || userId,
        created_at: memo.created_at
      } as DocumentAnalysis;
    });
  } catch (error) {
    console.error('Error fetching document analyses:', error);
    throw error;
  }
};

/**
 * Gets a single document analysis by ID
 */
export const getDocumentAnalysisById = async (analysisId: string): Promise<DocumentAnalysis | null> => {
  try {
    // Use memos table as fallback
    const { data, error } = await supabase
      .from('memos')
      .select('*')
      .eq('id', analysisId)
      .single();

    if (error) throw error;

    let analysisResult;
    try {
      analysisResult = JSON.parse(data.content);
    } catch {
      analysisResult = { summary: data.content };
    }
    
    return {
      id: data.id,
      file_name: data.title.replace('Document Analysis: ', ''),
      analysis_result: analysisResult,
      status: data.status || 'completed',
      created_by: data.created_by,
      created_at: data.created_at
    } as DocumentAnalysis;
  } catch (error) {
    console.error('Error fetching document analysis:', error);
    return null;
  }
};
