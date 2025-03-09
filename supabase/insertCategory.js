import { supabase } from './supabaseClient.js';  // Adjust the path based on your project structure

export async function insertCategory() {
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError) {
    console.error('Auth Error:', authError);
    return;
  }

  const { data, error } = await supabase
    .from('categories')
    .insert([
      {
        name: 'Salary',
        type: 'income',
        color: '#00FF00',
        parent_id: null,
        user_id: user.id
      }
    ]);

  if (error) {
    console.error('Error inserting category:', error);
  } else {
    console.log('Category inserted successfully:', data);
  }
}
