// Test file to verify Supabase connection
import { supabase } from './supabase';

export async function testSupabaseConnection() {
  try {
    // Test basic connection
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);

    if (error) {
      console.error('Supabase connection error:', error);
      return false;
    }

    console.log('✅ Supabase connected successfully!');
    return true;
  } catch (error) {
    console.error('❌ Supabase connection failed:', error);
    return false;
  }
}

export async function testAuth() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Auth error:', error);
      return false;
    }

    console.log('✅ Auth working!', user ? 'User logged in' : 'No user');
    return true;
  } catch (error) {
    console.error('❌ Auth test failed:', error);
    return false;
  }
}