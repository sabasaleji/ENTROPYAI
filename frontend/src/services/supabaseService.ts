// Supabase client setup
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not configured. Please set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY in your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// User interface
export interface User {
  id?: string;
  email: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}

// Save or update user in Supabase
export const saveUser = async (userData: User): Promise<User | null> => {
  try {
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Supabase not configured. User data not saved.');
      return null;
    }

    const { data, error } = await supabase
      .from('users')
      .upsert(
        {
          email: userData.email,
          name: userData.name,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'email',
        }
      )
      .select()
      .single();

    if (error) {
      console.error('Error saving user to Supabase:', error);
      return null;
    }

    console.log('User saved to Supabase:', data);
    return data;
  } catch (error) {
    console.error('Error in saveUser:', error);
    return null;
  }
};

// Get user by email
export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    if (!supabaseUrl || !supabaseAnonKey) {
      return null;
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null;
      }
      console.error('Error fetching user from Supabase:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getUserByEmail:', error);
    return null;
  }
};

