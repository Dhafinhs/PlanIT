document.addEventListener('DOMContentLoaded', () => {
    const addScheduleBtn = document.getElementById('add-schedule-btn');
    const addSchedulePopup = document.getElementById('add-schedule-popup');

    // Open pop-up
    addScheduleBtn.addEventListener('click', () => {
        addSchedulePopup.classList.remove('hidden');
    });

    // Close pop-up when clicking outside the content
    addSchedulePopup.addEventListener('click', (event) => {
        if (event.target === addSchedulePopup) {
            addSchedulePopup.classList.add('hidden');
        }
    });
});