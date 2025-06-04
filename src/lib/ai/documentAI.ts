
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { DocumentAnalysis as BaseDocumentAnalysis } from '@/types/ai';

// Use the base type and extend it if needed
export type DocumentAnalysis = BaseDocumentAnalysis & {
  status?: string;
  processing_time_ms?: number;
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
  const startTime = Date.now();
  const analysisId = uuidv4();
  
  try {
    // 1. Upload file to storage
    const filePath = `${userId}/${Date.now()}-${file.name}`;
    const { data: fileData, error: fileError } = await supabase.storage
      .from('document-analysis')
      .upload(filePath, file);
    
    if (fileError) throw fileError;
    
    // 2. Get file URL
    const { data: { publicUrl } } = supabase.storage
      .from('document-analysis')
      .getPublicUrl(fileData.path);
    
    // 3. Extract text content for document type detection
    let textContent = '';
    try {
      if (file.type === 'text/plain') {
        textContent = await file.text();
      } else {
        // For non-text files, we'll use a simplified approach
        // In a production app, you'd use a proper text extraction service
        textContent = file.name; // Fallback to using filename for detection
      }
    } catch (extractError) {
      console.warn('Failed to extract text for document type detection:', extractError);
    }
    
    // 4. Detect document type
    const documentType = detectDocumentType(textContent, file.name);
    
    // 5. Process with AI via edge function
    const { data: analysisData, error: analysisError } = await supabase.functions.invoke('analyze-document', {
      body: {
        fileUrl: publicUrl,
        fileName: file.name,
        fileType: file.type,
        userId,
        documentType,
        analysisId
      }
    });
    
    if (analysisError) throw analysisError;
    
    // 6. Store analysis result in dedicated table
    // Check if document_analyses table exists, if not fall back to memos
    const { count, error: checkError } = await supabase
      .from('document_analyses')
      .select('id', { count: 'exact', head: true });
    
    let data, error;
    
    const processingTime = Date.now() - startTime;
    
    if (checkError || count === null) {
      // Fall back to memos table
      const result = await supabase
        .from('memos')
        .insert({
          title: `Document Analysis: ${file.name}`,
          content: JSON.stringify(analysisData),
          status: 'published',
          created_by: userId
        })
        .select()
        .single();
      
      data = result.data;
      error = result.error;
      
      if (error) throw error;
      
      return {
        id: data.id,
        file_name: file.name,
        file_path: fileData.path,
        file_type: file.type,
        file_size: file.size,
        analysis_result: analysisData,
        status: 'completed',
        created_by: userId,
        created_at: data.created_at,
        document_type: documentType,
        confidence_score: 0.85, // Default confidence score
        processing_time_ms: processingTime
      };
    } else {
      // Use dedicated document_analyses table
      const result = await supabase
        .from('document_analyses')
        .insert({
          file_name: file.name,
          file_path: fileData.path,
          file_type: file.type,
          file_size: file.size,
          analysis_result: analysisData,
          status: 'completed',
          created_by: userId,
          document_type: documentType,
          confidence_score: 0.85, // Default confidence score
          processing_time_ms: processingTime
        })
        .select()
        .single();
      
      data = result.data;
      error = result.error;
      
      if (error) throw error;
    }
    
    return {
      id: data.id,
      file_name: data.file_name,
      file_path: data.file_path,
      file_type: data.file_type,
      file_size: data.file_size,
      analysis_result: data.analysis_result,
      status: data.status,
      created_by: data.created_by,
      created_at: data.created_at,
      document_type: data.document_type,
      confidence_score: data.confidence_score,
      processing_time_ms: data.processing_time_ms
    };
  } catch (error) {
    console.error('Error analyzing document:', error);
    
    // Log analysis failure
    try {
      await supabase.from('analytics').insert({
        event_type: 'document_analysis_error',
        user_id: userId,
        metadata: {
          file_name: file.name,
          error_message: error.message || 'Unknown error',
          analysis_id: analysisId
        }
      });
    } catch (logError) {
      console.error('Failed to log analysis error:', logError);
    }
    
    throw error;
  }
};

/**
 * Gets document analyses for a user
 */
export const getDocumentAnalyses = async (userId: string): Promise<DocumentAnalysis[]> => {
  try {
    // Check if document_analyses table exists
    const { count, error: checkError } = await supabase
      .from('document_analyses')
      .select('id', { count: 'exact', head: true });
    
    if (!checkError && count !== null) {
      // Use dedicated document_analyses table
      const { data, error } = await supabase
        .from('document_analyses')
        .select('*')
        .eq('created_by', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } else {
      // Fall back to memos table
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
        };
      });
    }
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
    // Check if document_analyses table exists
    const { count, error: checkError } = await supabase
      .from('document_analyses')
      .select('id', { count: 'exact', head: true });
    
    if (!checkError && count !== null) {
      // Use dedicated document_analyses table
      const { data, error } = await supabase
        .from('document_analyses')
        .select('*')
        .eq('id', analysisId)
        .single();

      if (error) throw error;
      return data;
    } else {
      // Fall back to memos table
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
      };
    }
  } catch (error) {
    console.error('Error fetching document analysis:', error);
    return null;
  }
};
