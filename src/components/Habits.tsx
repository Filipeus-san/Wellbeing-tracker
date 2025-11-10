import { useState, useEffect } from 'react';
import type { Habit, WeekDay, WeekOfMonth } from '../types';
import { getHabits, saveHabit } from '../utils/storage';
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
  const [newHabitWeekDays, setNewHabitWeekDays] = useState<WeekDay[]>([]);
  const [newHabitWeeksOfMonth, setNewHabitWeeksOfMonth] = useState<WeekOfMonth[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editIcon, setEditIcon] = useState('');
  const [editWeekDays, setEditWeekDays] = useState<WeekDay[]>([]);
  const [editWeeksOfMonth, setEditWeeksOfMonth] = useState<WeekOfMonth[]>([]);

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
      weekDays: newHabitWeekDays.length > 0 ? newHabitWeekDays : undefined,
      weeksOfMonth: newHabitWeeksOfMonth.length > 0 ? newHabitWeeksOfMonth : undefined,
    };

    await saveHabit(habit);
    await loadHabits();

    // Reset form
    setNewHabitName('');
    setNewHabitDescription('');
    setNewHabitIcon('✨');
    setNewHabitWeekDays([]);
    setNewHabitWeeksOfMonth([]);
    setIsAdding(false);
  };

  const handleStartEdit = (habit: Habit) => {
    setEditingId(habit.id);
    setEditName(habit.name);
    setEditDescription(habit.description || '');
    setEditIcon(habit.icon || '✨');
    setEditWeekDays(habit.weekDays || []);
    setEditWeeksOfMonth(habit.weeksOfMonth || []);
  };

  const handleSaveEdit = async (habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const updatedHabit: Habit = {
      ...habit,
      name: editName.trim(),
      description: editDescription.trim() || undefined,
      icon: editIcon,
      weekDays: editWeekDays.length > 0 ? editWeekDays : undefined,
      weeksOfMonth: editWeeksOfMonth.length > 0 ? editWeeksOfMonth : undefined,
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

  const toggleWeekDay = (day: WeekDay, weekDays: WeekDay[], setter: (days: WeekDay[]) => void) => {
    if (weekDays.includes(day)) {
      setter(weekDays.filter(d => d !== day));
    } else {
      setter([...weekDays, day].sort((a, b) => a - b));
    }
  };

  const getWeekDayLabel = (day: WeekDay): string => {
    const labels = [
      t.habits.sunday,
      t.habits.monday,
      t.habits.tuesday,
      t.habits.wednesday,
      t.habits.thursday,
      t.habits.friday,
      t.habits.saturday,
    ];
    return labels[day];
  };

  const renderWeekDaySelector = (weekDays: WeekDay[], setter: (days: WeekDay[]) => void) => {
    const days: WeekDay[] = [1, 2, 3, 4, 5, 6, 0]; // Po-Ne (pondělí první)

    return (
      <div className="form-group">
        <label>{t.habits.activeDays}</label>
        <p className="field-hint">{t.habits.selectDays}</p>
        <div className="weekday-selector">
          {days.map((day) => (
            <button
              key={day}
              type="button"
              className={`weekday-button ${weekDays.includes(day) ? 'active' : ''}`}
              onClick={() => toggleWeekDay(day, weekDays, setter)}
            >
              {getWeekDayLabel(day)}
            </button>
          ))}
        </div>
        {weekDays.length === 0 && (
          <p className="weekday-hint">{t.habits.everyDay}</p>
        )}
      </div>
    );
  };

  const toggleWeekOfMonth = (week: WeekOfMonth, weeks: WeekOfMonth[], setter: (weeks: WeekOfMonth[]) => void) => {
    if (weeks.includes(week)) {
      setter(weeks.filter(w => w !== week));
    } else {
      setter([...weeks, week].sort((a, b) => a - b));
    }
  };

  const getWeekOfMonthLabel = (week: WeekOfMonth): string => {
    const labels = [
      t.habits.week1,
      t.habits.week2,
      t.habits.week3,
      t.habits.week4,
      t.habits.week5,
    ];
    return labels[week - 1];
  };

  const renderWeekOfMonthSelector = (weeks: WeekOfMonth[], setter: (weeks: WeekOfMonth[]) => void) => {
    const weekOptions: WeekOfMonth[] = [1, 2, 3, 4, 5];

    return (
      <div className="form-group">
        <label>{t.habits.weeksOfMonth}</label>
        <p className="field-hint">{t.habits.selectWeeks}</p>
        <div className="weekday-selector">
          {weekOptions.map((week) => (
            <button
              key={week}
              type="button"
              className={`weekday-button ${weeks.includes(week) ? 'active' : ''}`}
              onClick={() => toggleWeekOfMonth(week, weeks, setter)}
            >
              {getWeekOfMonthLabel(week)}
            </button>
          ))}
        </div>
        {weeks.length === 0 && (
          <p className="weekday-hint">{t.habits.everyWeek}</p>
        )}
      </div>
    );
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

          {renderWeekDaySelector(newHabitWeekDays, setNewHabitWeekDays)}
          {renderWeekOfMonthSelector(newHabitWeeksOfMonth, setNewHabitWeeksOfMonth)}

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

                {renderWeekDaySelector(editWeekDays, setEditWeekDays)}
                {renderWeekOfMonthSelector(editWeeksOfMonth, setEditWeeksOfMonth)}

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
