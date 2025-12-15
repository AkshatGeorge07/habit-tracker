export const isHabitDue = (habit, date) => {
    if (!habit || !habit.freq) return false;
    switch (habit.freq.mode) {
      case "Daily":
        return true; 
      case "Weekly":
        return habit.freq.days.includes(date.getDay());
      case "Custom":
        return habit.freq.days.includes(date.getDay());
      default:
        return false;
    }
  }

export const formatDate = (date) => {
  const date = new Date(dateStr);
  return date.toISOString().split("T")[0];
}

export const markHabitComplete = (habitId, date, habits, setHabits) => {
  const updatedHabits = habits.map(habit => {
    if (habit.id !== habitId) return habit;

    const dateInStr = date.toISOString().split("T")[0];
    
    // Avoid duplicate entries
    if (habit.progress.includes(dateInStr)) return habit;

    // Add to progress
    const newProgress = [...habit.progress, dateInStr];

    // Current Streak calculation
    let newStreak = 1;
    
    if (habit.lastCompleted) {
      const lastDate = new Date(habit.lastCompleted);
      const diffDays = Math.floor((date - lastDate) / (1000 * 60 * 60 * 24));

      if (habit.freq.mode === "Daily") {
        // daily: streak continues only if yesterday was completed
        newStreak = diffDays === 1 ? habit.currentStreak + 1 : 1;
      } else if (habit.freq.mode === "Weekly" || habit.freq.mode === "Custom") {
        // weekly/custom: check if today is next scheduled day
        const scheduled = habit.freq.days; // array of numbers 0-6
        const lastDayIndex = scheduled.indexOf(lastDate.getDay());
        const nextIndex = (lastDayIndex + 1) % scheduled.length;
        const nextScheduledDay = scheduled[nextIndex];

        newStreak = date.getDay() === nextScheduledDay ? habit.currentStreak + 1 : 1;
      }
    }

    const newHighest = Math.max(newStreak, habit.highestStreak);

    return {
      ...habit,
      progress: newProgress,
      currentStreak: newStreak,
      highestStreak: newHighest,
      lastCompleted: dateInStr
    };
  });

  setHabits(updatedHabits);
}
