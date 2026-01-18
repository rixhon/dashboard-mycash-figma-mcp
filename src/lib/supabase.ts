/**
 * Cliente Supabase
 * Configuração e inicialização do cliente Supabase
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://husmclvhmodkpdmjxrah.supabase.co'
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1c21jbHZobW9ka3BkbWp4cmFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3NjI4MjgsImV4cCI6MjA4NDMzODgyOH0.VL7hDCxo1D5IGTQUlW_BsziKjWf-YmiW75O0UGc5Jg8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

// Helper para obter URL pública de arquivos no storage
export function getPublicUrl(bucket: string, path: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

// Helper para upload de arquivo
export async function uploadFile(
  bucket: string,
  path: string,
  file: File
): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true,
    })

  if (error) {
    console.error('Error uploading file:', error)
    return null
  }

  return getPublicUrl(bucket, data.path)
}

// Helper para deletar arquivo
export async function deleteFile(bucket: string, path: string): Promise<boolean> {
  const { error } = await supabase.storage.from(bucket).remove([path])

  if (error) {
    console.error('Error deleting file:', error)
    return false
  }

  return true
}
