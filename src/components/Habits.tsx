import { useState, useEffect } from 'react';
import type { Habit } from '../types';
import { getHabits, saveHabit, deleteHabit } from '../utils/storage';
import { useLanguage } from '../i18n/LanguageContext';
import './Habits.css';

const EMOJI_SUGGESTIONS = ['💪', '📚', '🧘', '🏃', '💧', '🥗', '😴', '🧹', '✍️', '🎯', '🌅', '🎨', '🎵', '📝', '💻'];

export const Habits = () => {
  const { t } = useLanguage();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitDescription, setNewHabitDescription] = useState('');
  const [newHabitIcon, setNewHabitIcon] = useState('✨');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editIcon, setEditIcon] = useState('');

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    const loadedHabits = await getHabits();
    setHabits(loadedHabits.filter(h => !h.archived));
  };

  const handleAddHabit = async () => {
    if (!newHabitName.trim()) return;

    const habit: Habit = {
      id: Date.now().toString(),
      name: newHabitName.trim(),
      description: newHabitDescription.trim() || undefined,
      icon: newHabitIcon,
      createdAt: new Date().toISOString(),
    };

    await saveHabit(habit);
    await loadHabits();

    // Reset form
    setNewHabitName('');
    setNewHabitDescription('');
    setNewHabitIcon('✨');
    setIsAdding(false);
  };

  const handleStartEdit = (habit: Habit) => {
    setEditingId(habit.id);
    setEditName(habit.name);
    setEditDescription(habit.description || '');
    setEditIcon(habit.icon || '✨');
  };

  const handleSaveEdit = async (habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const updatedHabit: Habit = {
      ...habit,
      name: editName.trim(),
      description: editDescription.trim() || undefined,
      icon: editIcon,
    };

    await saveHabit(updatedHabit);
    await loadHabits();
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditDescription('');
    setEditIcon('');
  };

  const handleArchiveHabit = async (habitId: string) => {
    if (!confirm(t.habits.confirmArchive)) return;

    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const archivedHabit: Habit = {
      ...habit,
      archived: true,
    };

    await saveHabit(archivedHabit);
    await loadHabits();
  };

  return (
    <div className="habits">
      <div className="habits-header">
        <h2>📋 {t.habits.title}</h2>
        <p className="habits-description">{t.habits.description}</p>
      </div>

      {/* Add new habit button */}
      {!isAdding && (
        <button className="add-habit-button" onClick={() => setIsAdding(true)}>
          ➕ {t.habits.addNew}
        </button>
      )}

      {/* Add new habit form */}
      {isAdding && (
        <div className="habit-form">
          <h3>{t.habits.addNew}</h3>

          <div className="form-group">
            <label htmlFor="habit-icon">{t.habits.icon}</label>
            <div className="icon-selector">
              <input
                type="text"
                id="habit-icon"
                value={newHabitIcon}
                onChange={(e) => setNewHabitIcon(e.target.value)}
                maxLength={2}
                className="icon-input"
              />
              <div className="emoji-suggestions">
                {EMOJI_SUGGESTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    className="emoji-button"
                    onClick={() => setNewHabitIcon(emoji)}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="habit-name">{t.habits.name} *</label>
            <input
              type="text"
              id="habit-name"
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              placeholder={t.habits.namePlaceholder}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="habit-description">{t.habits.habitDescription}</label>
            <textarea
              id="habit-description"
              value={newHabitDescription}
              onChange={(e) => setNewHabitDescription(e.target.value)}
              placeholder={t.habits.descriptionPlaceholder}
              rows={3}
            />
          </div>

          <div className="form-actions">
            <button className="cancel-button" onClick={() => setIsAdding(false)}>
              {t.common.cancel}
            </button>
            <button
              className="save-button"
              onClick={handleAddHabit}
              disabled={!newHabitName.trim()}
            >
              {t.common.save}
            </button>
          </div>
        </div>
      )}

      {/* Habits list */}
      <div className="habits-list">
        {habits.length === 0 && !isAdding && (
          <div className="empty-state">
            <p style={{ fontSize: '48px', marginBottom: '16px' }}>📋</p>
            <p>{t.habits.empty}</p>
          </div>
        )}

        {habits.map((habit) => (
          <div key={habit.id} className="habit-card">
            {editingId === habit.id ? (
              // Edit mode
              <div className="habit-edit-form">
                <div className="form-group">
                  <label>{t.habits.icon}</label>
                  <div className="icon-selector">
                    <input
                      type="text"
                      value={editIcon}
                      onChange={(e) => setEditIcon(e.target.value)}
                      maxLength={2}
                      className="icon-input"
                    />
                    <div className="emoji-suggestions">
                      {EMOJI_SUGGESTIONS.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          className="emoji-button"
                          onClick={() => setEditIcon(emoji)}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>{t.habits.name}</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>{t.habits.habitDescription}</label>
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    rows={2}
                  />
                </div>

                <div className="form-actions">
                  <button className="cancel-button" onClick={handleCancelEdit}>
                    {t.common.cancel}
                  </button>
                  <button className="save-button" onClick={() => handleSaveEdit(habit.id)}>
                    {t.common.save}
                  </button>
                </div>
              </div>
            ) : (
              // View mode
              <>
                <div className="habit-content">
                  <span className="habit-icon">{habit.icon || '✨'}</span>
                  <div className="habit-info">
                    <h3 className="habit-name">{habit.name}</h3>
                    {habit.description && (
                      <p className="habit-description-text">{habit.description}</p>
                    )}
                  </div>
                </div>
                <div className="habit-actions">
                  <button
                    className="edit-button"
                    onClick={() => handleStartEdit(habit)}
                    title={t.common.edit}
                  >
                    ✏️
                  </button>
                  <button
                    className="archive-button"
                    onClick={() => handleArchiveHabit(habit.id)}
                    title={t.habits.archive}
                  >
                    🗑️
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
