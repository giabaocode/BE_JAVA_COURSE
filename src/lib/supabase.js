// ============================================================================
//  Supabase client + helpers
//  Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local
//  If unset, every helper degrades silently — the local app still works.
// ============================================================================

import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = (url && key)
  ? createClient(url, key, { auth: { persistSession: false } })
  : null

export const isSupabaseEnabled = () => !!supabase

// ---------------------------------------------------------------------------
//  Stable per-browser user id (single-user mode — swap for real auth later)
// ---------------------------------------------------------------------------
const USER_KEY = 'java-bootcamp-user-id'

export function getUserId() {
  let id = null
  try { id = localStorage.getItem(USER_KEY) } catch { /* SSR/private mode */ }
  if (!id) {
    id = (crypto.randomUUID && crypto.randomUUID()) || `u_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
    try { localStorage.setItem(USER_KEY, id) } catch { /* ignore */ }
  }
  return id
}

// ---------------------------------------------------------------------------
//  Activity log → drives ConsistencyHeatmap
// ---------------------------------------------------------------------------
export async function logActivity(activityType = 'general') {
  if (!supabase) return null
  try {
    const userId = getUserId()
    const activity_date = new Date().toISOString().slice(0, 10)
    return await supabase.from('activity_logs')
      .insert({ user_id: userId, activity_date, activity_type: activityType })
  } catch (e) {
    console.warn('logActivity failed', e)
    return null
  }
}

export async function fetchActivityCounts(days = 365) {
  if (!supabase) return {}
  try {
    const userId = getUserId()
    const since = new Date()
    since.setDate(since.getDate() - days)
    const { data, error } = await supabase
      .from('activity_logs')
      .select('activity_date')
      .eq('user_id', userId)
      .gte('activity_date', since.toISOString().slice(0, 10))
    if (error) throw error
    const counts = {}
    data?.forEach(r => { counts[r.activity_date] = (counts[r.activity_date] || 0) + 1 })
    return counts
  } catch (e) {
    console.warn('fetchActivityCounts failed', e)
    return {}
  }
}

// ---------------------------------------------------------------------------
//  Feynman notes
// ---------------------------------------------------------------------------
export async function fetchFeynmanNote(lessonId) {
  if (!supabase) return null
  try {
    const userId = getUserId()
    const { data } = await supabase
      .from('feynman_notes')
      .select('*')
      .eq('user_id', userId)
      .eq('lesson_id', lessonId)
      .maybeSingle()
    return data
  } catch (e) {
    console.warn('fetchFeynmanNote failed', e)
    return null
  }
}

export async function saveFeynmanNote({ lessonId, explanation, selfRating }) {
  if (!supabase) return null
  try {
    const userId = getUserId()
    const payload = {
      user_id: userId,
      lesson_id: lessonId,
      explanation,
      self_rating: selfRating,
      updated_at: new Date().toISOString()
    }
    const { data, error } = await supabase
      .from('feynman_notes')
      .upsert(payload, { onConflict: 'user_id,lesson_id' })
      .select()
      .single()
    if (error) throw error
    await logActivity('feynman')
    return data
  } catch (e) {
    console.warn('saveFeynmanNote failed', e)
    return null
  }
}

// ---------------------------------------------------------------------------
//  Syntax Vault
// ---------------------------------------------------------------------------
export async function listVaultSnippets() {
  if (!supabase) return []
  try {
    const userId = getUserId()
    const { data } = await supabase
      .from('syntax_vault')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
    return data || []
  } catch (e) {
    console.warn('listVaultSnippets failed', e); return []
  }
}

export async function saveVaultSnippet(snippet) {
  if (!supabase) return null
  try {
    const userId = getUserId()
    const row = { ...snippet, user_id: userId, updated_at: new Date().toISOString() }
    const { data, error } = await supabase
      .from('syntax_vault')
      .upsert(row)
      .select()
      .single()
    if (error) throw error
    return data
  } catch (e) {
    console.warn('saveVaultSnippet failed', e); return null
  }
}

export async function deleteVaultSnippet(id) {
  if (!supabase) return false
  try {
    const userId = getUserId()
    const { error } = await supabase.from('syntax_vault').delete().eq('id', id).eq('user_id', userId)
    return !error
  } catch (e) { console.warn(e); return false }
}

export async function recordVaultPractice(id, wpm, accuracy) {
  if (!supabase) return null
  try {
    const userId = getUserId()
    const { data: cur } = await supabase
      .from('syntax_vault')
      .select('practice_count, best_wpm, best_accuracy')
      .eq('id', id).eq('user_id', userId).maybeSingle()
    if (!cur) return null
    const payload = {
      practice_count: (cur.practice_count || 0) + 1,
      best_wpm: Math.max(cur.best_wpm || 0, wpm || 0),
      best_accuracy: Math.max(cur.best_accuracy || 0, accuracy || 0),
      updated_at: new Date().toISOString()
    }
    await supabase.from('syntax_vault').update(payload).eq('id', id).eq('user_id', userId)
    await logActivity('typing')
    return payload
  } catch (e) { console.warn(e); return null }
}

// ---------------------------------------------------------------------------
//  Bug Journal
// ---------------------------------------------------------------------------
export async function listBugs({ search = '', onlyOpen = false } = {}) {
  if (!supabase) return []
  try {
    const userId = getUserId()
    let q = supabase.from('bug_journal').select('*').eq('user_id', userId)
      .order('updated_at', { ascending: false })
    if (onlyOpen) q = q.eq('resolved', false)
    if (search) q = q.or(`title.ilike.%${search}%,error_message.ilike.%${search}%,root_cause.ilike.%${search}%`)
    const { data } = await q
    return data || []
  } catch (e) { console.warn(e); return [] }
}

export async function saveBug(bug) {
  if (!supabase) return null
  try {
    const userId = getUserId()
    const row = { ...bug, user_id: userId, updated_at: new Date().toISOString() }
    const { data, error } = await supabase.from('bug_journal').upsert(row).select().single()
    if (error) throw error
    await logActivity('bug_log')
    return data
  } catch (e) { console.warn(e); return null }
}

export async function deleteBug(id) {
  if (!supabase) return false
  try {
    const userId = getUserId()
    const { error } = await supabase.from('bug_journal').delete().eq('id', id).eq('user_id', userId)
    return !error
  } catch (e) { console.warn(e); return false }
}

// ---------------------------------------------------------------------------
//  User Settings (email reminder etc.)
// ---------------------------------------------------------------------------
export async function fetchSettings() {
  if (!supabase) return null
  try {
    const userId = getUserId()
    const { data } = await supabase.from('user_settings').select('*').eq('user_id', userId).maybeSingle()
    return data
  } catch (e) { console.warn(e); return null }
}

export async function saveSettings(patch) {
  if (!supabase) return null
  try {
    const userId = getUserId()
    const row = { ...patch, user_id: userId, updated_at: new Date().toISOString() }
    const { data, error } = await supabase
      .from('user_settings')
      .upsert(row, { onConflict: 'user_id' })
      .select()
      .single()
    if (error) throw error
    return data
  } catch (e) { console.warn(e); return null }
}

// ---------------------------------------------------------------------------
//  Generic progress sync (optional — App.jsx still uses localStorage)
// ---------------------------------------------------------------------------
export async function recordProgress(itemKey) {
  if (!supabase) return null
  try {
    const userId = getUserId()
    return await supabase.from('user_progress')
      .upsert({ user_id: userId, item_key: itemKey }, { onConflict: 'user_id,item_key' })
  } catch (e) { console.warn(e); return null }
}
