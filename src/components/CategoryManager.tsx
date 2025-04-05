import React, { useState } from 'react';
import { Edit2, Trash2, Plus, FolderTree } from 'lucide-react';
import { useCategories, useUpdateCategory, useDeleteCategory } from '../hooks/useCategories';
import { Category } from '../types';
import { useTranslation } from 'react-i18next';

interface CategoryManagerProps {
  onNewCategory: () => void;
}

export function CategoryManager({ onNewCategory }: CategoryManagerProps) {
  const { t } = useTranslation();
  const { data: categories = [] } = useCategories();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Group categories by parent
  const categoryGroups = categories.reduce((acc, category) => {
    if (!category.parent_id) {
      if (!acc.root) acc.root = [];
      acc.root.push(category);
    } else {
      if (!acc[category.parent_id]) acc[category.parent_id] = [];
      acc[category.parent_id].push(category);
    }
    return acc;
  }, {} as Record<string, Category[]>);

  const renderCategory = (category: Category, level = 0) => {
    const hasChildren = categoryGroups[category.id]?.length > 0;
    
    return (
      <div key={category.id}>
        <div 
          className={`flex items-center justify-between p-3 ${
            level > 0 ? 'ml-6 border-l border-gray-200' : ''
          }`}
        >
          <div className="flex items-center gap-2">
            {hasChildren && <FolderTree className="w-4 h-4 text-gray-400" />}
            {editingCategory?.id === category.id ? (
              <input
                type="text"
                value={editingCategory.name}
                onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                onBlur={() => {
                  updateCategory.mutate(editingCategory);
                  setEditingCategory(null);
                }}
                className="border rounded px-2 py-1"
                autoFocus
              />
            ) : (
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span>{category.name}</span>
                <span className="text-sm text-gray-500">({category.type})</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setEditingCategory(category)}
              className="p-1 text-gray-600 hover:text-gray-800 rounded"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (confirm('Are you sure you want to delete this category?')) {
                  deleteCategory.mutate(category.id);
                }
              }}
              className="p-1 text-gray-600 hover:text-red-600 rounded"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {hasChildren && categoryGroups[category.id].map(child => renderCategory(child, level + 1))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">{t('common.categories')}</h2>
        <button
          onClick={onNewCategory}
          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-1" />
          {t('common.newCategory')}
        </button>
      </div>
      
      <div className="divide-y divide-gray-100">
        {categoryGroups.root?.map(category => renderCategory(category))}
      </div>
    </div>
  );
}