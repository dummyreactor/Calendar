
// DRAG & DROP HELPERS
//function makeTaskDraggable(task) {
//    console.log("Binding drag to task:", task);
//    task.setAttribute('draggable', 'true');

//    task.addEventListener('dragstart', function (e) {
//        const title = task.querySelector('strong')?.textContent || task.textContent.trim();
//        const desc = task.querySelector('small')?.textContent || "";
//        const duration = task.dataset.duration || 1;
//        const taskId = task.dataset.taskId || null; // ✅ Get taskId if present

//        const payload = JSON.stringify({ title, desc, duration, taskId });
//        e.dataTransfer.setData("text/plain", payload);
//        e.dataTransfer.setData("source", task.closest(".task-panel") ? "task-panel" : "calendar");

//        task.classList.add("dragging");
//    });

//    task.addEventListener('dragend', function () {
//        task.classList.remove("dragging");
//    });

//    task.style.cursor = 'pointer';

//    task.addEventListener('click', function () {
//        const title = task.querySelector('strong')?.textContent || '';
//        const desc = task.querySelector('small')?.textContent || '';
//        const duration = task.dataset.duration || 1;

//        taskTitleInput.value = title;
//        taskDescInput.value = desc;
//        taskDurationInput.value = duration;

//        document.querySelectorAll('.task-card[data-editing]').forEach(t => delete t.dataset.editing);
//        task.dataset.editing = "true";
//        taskModal.show();

//        setTimeout(() => taskTitleInput.focus(), 200);


//    });
//}

//document.addEventListener('DOMContentLoaded', function () {
//    document.querySelectorAll('.task-card').forEach(makeTaskDraggable);
//    document.querySelectorAll('.scheduled-task').forEach(makeTaskDraggable);
//});

function makeTaskDraggable(task) {
    console.log("Binding drag to task:", task);
    task.setAttribute('draggable', 'true');

    task.addEventListener('dragstart', function (e) {
        const title = task.querySelector('strong')?.textContent || task.textContent.trim();
        const desc = task.querySelector('small')?.textContent || "";
        const duration = task.dataset.duration || 1;
        const taskId = task.dataset.taskId || null; // ✅ Preserve taskId if it's a scheduled task

        const payload = JSON.stringify({ title, desc, duration, taskId });
        e.dataTransfer.setData("text/plain", payload);
        e.dataTransfer.setData("source", task.closest(".task-panel") ? "task-panel" : "calendar");

        task.classList.add("dragging");
    });

    task.addEventListener('dragend', function () {
        task.classList.remove("dragging");
    });

    task.style.cursor = 'pointer';

    task.addEventListener('click', function () {
        const title = task.querySelector('strong')?.textContent || '';
        const desc = task.querySelector('small')?.textContent || '';
        const duration = parseFloat(task.dataset.duration || 1);
        const totalMinutes = Math.round(duration * 60);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        taskTitleInput.value = title;
        taskDescInput.value = desc;
        taskHourInput.value = hours;
        taskMinuteInput.value = minutes;

        document.querySelectorAll('.task-card[data-editing], .scheduled-task[data-editing]').forEach(t => delete t.dataset.editing);
        task.dataset.editing = "true";
        taskModal.show();

        setTimeout(() => taskTitleInput.focus(), 200);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.task-card').forEach(makeTaskDraggable);
    document.querySelectorAll('.scheduled-task').forEach(makeTaskDraggable);
});


// =======================
// CALENDAR SLOTS DROP ZONES
// =======================
//document.querySelectorAll('.calendar-slot').forEach(slot => {
//    slot.addEventListener('dragover', function (e) {
//        e.preventDefault();
//        slot.style.backgroundColor = "#d6e4ff";
//    });

//    slot.addEventListener('dragleave', function () {
//        slot.style.backgroundColor = "";
//    });

//    slot.addEventListener('drop', function (e) {
//        e.preventDefault();
//        slot.style.backgroundColor = "";

//        const data = JSON.parse(e.dataTransfer.getData("text/plain"));
//        const source = e.dataTransfer.getData("source");

//        const dragging = document.querySelector('.dragging');
//        if (dragging) dragging.remove();

//        const duration = parseInt(data.duration) || 1;
//        const day = slot.dataset.day;
//        const hour = parseInt(slot.dataset.hour);

//        for (let i = 0; i < duration; i++) {
//            const targetSlot = document.querySelector(`.calendar-slot[data-day="${day}"][data-hour="${hour + i}"]`);
//            if (!targetSlot) break;

//            if (i === 0) {
//                const newTask = document.createElement('div');
//                newTask.className = "task-card bg-success text-white";
//                newTask.innerHTML = `<strong>${data.title}</strong><br>
//                                    <small>${data.desc}</small><br>
//                                    <small>Task ID: ${data.taskId}</small>`;
//                newTask.dataset.duration = duration;
//                newTask.style.height = `${48 * duration}px`;
//                newTask.style.position = 'absolute';
//                newTask.style.top = '0';
//                newTask.style.left = '0';
//                newTask.style.right = '0';
//                newTask.style.zIndex = '1';
//                newTask.dataset.taskId = data.taskId;

//                makeTaskDraggable(newTask);
//                targetSlot.appendChild(newTask);
//                targetSlot.style.position = 'relative';

//                // ✅ AJAX to save to backend
//                const payloadToServer = {
//                    taskId: data.taskId,
//                    title: data.title,
//                    description: data.desc,
//                    duration: duration,
//                    scheduledDate: `${day}T${String(hour).padStart(2, '0')}:00:00`
//                };

//                fetch('/Task/Add', {
//                    method: 'POST',
//                    headers: { 'Content-Type': 'application/json' },
//                    body: JSON.stringify(payloadToServer)
//                })
//                    .then(response => {
//                        if (!response.ok) throw new Error("Failed to save scheduled task.");
//                        return response.json();
//                    })
//                    .then(data => {
//                        console.log("Scheduled task saved:", data);
//                    })
//                    .catch(error => {
//                        console.error("Error:", error);
//                    });

//            }
//        }
//    });
//});

document.querySelectorAll('.calendar-slot').forEach(slot => {
    slot.addEventListener('dragover', function (e) {
        e.preventDefault();
        slot.style.backgroundColor = "#d6e4ff";
    });

    slot.addEventListener('dragleave', function () {
        slot.style.backgroundColor = "";
    });

    slot.addEventListener('drop', function (e) {
        e.preventDefault();
        slot.style.backgroundColor = "";

        const data = JSON.parse(e.dataTransfer.getData("text/plain"));
        const source = e.dataTransfer.getData("source");
        const dragging = document.querySelector('.dragging');
        if (dragging) dragging.remove();

        const duration = parseFloat(data.duration) || 1;
        const durationInMinutes = duration * 60;

        const day = slot.dataset.day;
        const hour = parseInt(slot.dataset.hour, 10);

        const currentSlot = document.querySelector(`.calendar-slot[data-day="${day}"][data-hour="${hour}"]`);
        currentSlot.style.position = currentSlot.style.position || 'relative';
        currentSlot.style.overflow = currentSlot.style.overflow || 'visible';

        const existingTasks = Array.from(currentSlot.querySelectorAll('.task-card'));
        let existingDurationInMinutes = 0;
        const usedColorsSingleSlot = new Set();

        existingTasks.forEach(task => {
            const taskDuration = parseFloat(task.dataset.duration) || 1;
            existingDurationInMinutes += taskDuration * 60;
            const bg = task.dataset.color;
            if (bg) usedColorsSingleSlot.add(bg);
        });

        const isSingleLongTask = durationInMinutes > 60;
        const isSlotEmpty = existingTasks.length === 0;

        const requiredSlots = Math.ceil(durationInMinutes / 60);
        const spanSlots = [];
        for (let i = 0; i < requiredSlots; i++) {
            const s = document.querySelector(`.calendar-slot[data-day="${day}"][data-hour="${hour + i}"]`);
            if (!s) break;
            spanSlots.push(s);
        }

        if (spanSlots.length < requiredSlots) {
            alert("Not enough available slots to drop this task.");
            return restoreToTaskList(data, duration);
        }

        if (isSingleLongTask && !isSlotEmpty) {
            alert("Long tasks (>60 minutes) must be placed in an empty slot.");
            return restoreToTaskList(data, duration);
        }

        if (!isSingleLongTask && (existingDurationInMinutes + durationInMinutes > 60)) {
            alert("Combined tasks exceed 60 minutes. Cannot place more in this slot.");
            return restoreToTaskList(data, duration);
        }

        const usedColors = new Set(usedColorsSingleSlot);
        spanSlots.forEach(s => {
            s.querySelectorAll('.task-card').forEach(t => {
                const c = t.dataset.color;
                if (c) usedColors.add(c);
            });
        });

        const allColors = ['#f44336', '#4caf50', '#2196f3', '#ff9800', '#9c27b0', '#00bcd4', '#8bc34a', '#e91e63'];
        const availableColors = allColors.filter(c => !usedColors.has(c));
        const chosenColor = availableColors.length > 0
            ? availableColors[Math.floor(Math.random() * availableColors.length)]
            : allColors[Math.floor(Math.random() * allColors.length)];

        const newTask = document.createElement('div');
        newTask.className = "task-card";
        newTask.innerHTML = `
            <strong>${data.title}</strong><br>
            <small>${data.desc}</small><br>
            <small>Task ID: ${data.taskId}</small>`;
        newTask.dataset.duration = duration;
        newTask.dataset.color = chosenColor;
        newTask.dataset.taskId = data.taskId;
        newTask.style.backgroundColor = chosenColor;
        newTask.style.color = '#fff';
        newTask.style.position = 'absolute';
        newTask.style.left = '5px';
        newTask.style.width = 'calc(100% - 10px)';
        newTask.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
        newTask.addEventListener('mouseenter', () => {
            newTask.style.transform = 'scale(1.05)';
            newTask.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
        });
        newTask.addEventListener('mouseleave', () => {
            newTask.style.transform = 'scale(1)';
            newTask.style.boxShadow = 'none';
        });

        if (isSingleLongTask) {
            const topSlot = spanSlots[0];
            topSlot.style.position = topSlot.style.position || 'relative';
            topSlot.style.overflow = topSlot.style.overflow || 'visible';
            void topSlot.offsetHeight;

            const slotHeight = topSlot.clientHeight || 48;
            const totalHeight = (slotHeight) * requiredSlots - 4;

            newTask.style.top = '0px';
            newTask.style.height = `${totalHeight}px`;
            newTask.style.zIndex = '20';

            makeTaskDraggable(newTask);
            topSlot.appendChild(newTask);
        } else {
            void currentSlot.offsetHeight;

            const stackIndex = existingTasks.length;
            const baseHeight = 40;
            const margin = 1;
            const slotHeight = currentSlot.clientHeight || 48;
            const totalNeededHeight = (baseHeight + margin) * (stackIndex + 1);

            const overlap = totalNeededHeight > slotHeight;
            newTask.style.height = `${baseHeight}px`;
            newTask.style.zIndex = `${10 + stackIndex}`;

            if (overlap) {
                const overlapOffset = 10;
                newTask.style.top = `${stackIndex * overlapOffset}px`;
                newTask.style.opacity = stackIndex === existingTasks.length ? '1' : '0.9';
            } else {
                newTask.style.top = `${stackIndex * (baseHeight + margin)}px`;
            }

            makeTaskDraggable(newTask);
            currentSlot.appendChild(newTask);
        }

        // ✅ Save scheduled task to backend
        const payloadToServer = {
            taskId: data.taskId,
            title: data.title,
            description: data.desc,
            duration: duration,
            scheduledDate: `${day}T${String(hour).padStart(2, '0')}:00:00`
        };

        fetch('/Task/Add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payloadToServer)
        })
            .then(response => {
                if (!response.ok) throw new Error("Failed to save scheduled task.");
                return response.json();
            })
            .then(data => {
                console.log("Scheduled task saved:", data);
                newTask.dataset.scheduledTaskId = data.scheduledTaskId;
            })
            .catch(error => {
                console.error("Error:", error);
                restoreToTaskList(data, duration);
            });
    });
});

// Restore helper
function restoreToTaskList(data, duration) {
    const restoredTask = document.createElement('div');
    restoredTask.className = 'task-card';
    restoredTask.innerHTML = `<strong>${data.title}</strong><br><small>${data.desc}</small><br><small>Task ID: ${data.taskId}</small>`;
    restoredTask.dataset.duration = duration;
    restoredTask.dataset.taskId = data.taskId;
    makeTaskDraggable(restoredTask);
    document.querySelector('.task-list')?.appendChild(restoredTask);
}

// =======================
// TASK PANEL DROP & CREATE
// =======================
//const taskList = document.querySelector('.task-list');
//const addTaskBtn = document.getElementById('add-task-btn');
//const taskTitleInput = document.getElementById('new-task-title');
//const taskDescInput = document.getElementById('new-task-desc');
//const taskDurationInput = document.getElementById('new-task-duration');
//const saveTaskBtn = document.getElementById('save-task-btn');
//const taskModal = new bootstrap.Modal(document.getElementById('taskInputModal'));

//if (taskList) {
//    taskList.addEventListener('dragover', function (e) {
//        e.preventDefault();
//        taskList.style.backgroundColor = "#f0f8ff";
//    });

//    taskList.addEventListener('dragleave', function () {
//        taskList.style.backgroundColor = "";
//    });

//    taskList.addEventListener('drop', function (e) {
//        e.preventDefault();
//        taskList.style.backgroundColor = "";

//        const data = JSON.parse(e.dataTransfer.getData("text/plain"));
//        const source = e.dataTransfer.getData("source");

//        const { title, desc, duration, taskId } = data;

//        const dragging = document.querySelector('.dragging');
//        if (dragging && source === "calendar") dragging.remove();

//        const restoredTask = document.createElement('div');
//        restoredTask.className = 'task-card';
//        restoredTask.setAttribute("draggable", "true");
//        restoredTask.innerHTML = `
//                    <strong>${title}</strong><br>
//                    <small>${desc}</small><br>
//                    <small>Task ID: ${taskId}</small>`;
//        restoredTask.dataset.duration = duration;
//        restoredTask.dataset.taskId = taskId


//        makeTaskDraggable(restoredTask);
//        taskList.appendChild(restoredTask);

//        if (data.taskId) {
//            fetch(`/Task/Remove?taskId=${data.taskId}`, {
//                method: "DELETE"
//            })
//                .then(res => {
//                    if (!res.ok) throw new Error("Failed to unschedule.");
//                    console.log("Task unscheduled successfully.");
//                })
//                .catch(err => console.error("Unscheduled error:", err));
//        }

//    });

//    // Trash Can
//    const trashCan = document.getElementById('trash-can');
//    if (trashCan) {
//        trashCan.addEventListener('dragover', function (e) {
//            e.preventDefault();
//            trashCan.classList.add("dragover");
//        });

//        trashCan.addEventListener('dragleave', function () {
//            trashCan.classList.remove("dragover");
//        });

//        trashCan.addEventListener('drop', function (e) {
//            e.preventDefault();
//            trashCan.classList.remove("dragover");

//            const data = JSON.parse(e.dataTransfer.getData("text/plain"));
//            const source = e.dataTransfer.getData("source");

//            const { title, desc, duration, taskId, scheduledTaskId } = data;

//            const dragging = document.querySelector('.dragging');
//            if (dragging) dragging.remove();

//            // Delete from DB depending on what's available
//            const queryParams = new URLSearchParams();
//            if (taskId) queryParams.append("taskId", taskId);
//            if (scheduledTaskId) queryParams.append("scheduledTaskId", scheduledTaskId);

//            fetch(`/Task/Delete?${queryParams.toString()}`, {
//                method: "DELETE"
//            })
//                .then(res => {
//                    if (!res.ok) throw new Error("Failed to delete task.");
//                    console.log("Task deleted successfully.");
//                })
//                .catch(err => console.error("Deletion error:", err));
//        });
//    }

//    addTaskBtn.addEventListener('click', () => {
//        taskTitleInput.value = '';
//        taskDescInput.value = '';
//        taskDurationInput.value = '';
//        document.querySelectorAll('.task-card[data-editing]').forEach(t => delete t.dataset.editing);
//        taskModal.show();
//        setTimeout(() => taskTitleInput.focus(), 200);
//    });


//    saveTaskBtn.addEventListener('click', () => {
//        const title = taskTitleInput.value.trim();
//        const desc = taskDescInput.value.trim();
//        const hours = parseInt(document.getElementById('new-task-hour').value) || 0;
//        const minutes = parseInt(document.getElementById('new-task-minute').value) || 0;

//        if (title === '' || (hours === 0 && minutes === 0)) return;

//        // Format duration for .NET TimeSpan: hh:mm:ss
//        const duration = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;

//        const editingTask = document.querySelector('.task-card[data-editing]');
//        const isEditing = editingTask !== null;

//        const payload = {
//            title: title,
//            description: desc,
//            duration: duration
//        };

//        let url = '/Task/CreateNewTask';
//        let method = 'POST';

//        if (isEditing) {
//            payload.taskId = editingTask.dataset.taskId;
//            url = '/Task/UpdateTask';
//            method = 'PUT';
//        }

//        fetch(url, {
//            method: method,
//            headers: {
//                'Content-Type': 'application/json'
//            },
//            body: JSON.stringify(payload)
//        })
//            .then(response => {
//                if (!response.ok) throw new Error(isEditing ? "Failed to update task" : "Failed to create task");
//                return response.json();
//            })
//            .then(data => {
//                console.log(data.message);

//                const durationFloat = (hours + minutes / 60).toFixed(2);

//                if (isEditing) {
//                    editingTask.querySelector('strong').textContent = title;
//                    editingTask.querySelector('small').textContent = desc;
//                    editingTask.dataset.duration = durationFloat;
//                    delete editingTask.dataset.editing;
//                } else {
//                    const taskCard = document.createElement('div');
//                    taskCard.className = 'task-card';
//                    taskCard.setAttribute('draggable', 'true');
//                    taskCard.dataset.duration = durationFloat;
//                    taskCard.dataset.taskId = data.taskId;
//                    taskCard.innerHTML = `
//                <strong>${title}</strong><br>
//                <small>${desc}</small><br>
//                <small>Task ID: ${data.taskId}</small>`;

//                    makeTaskDraggable(taskCard);
//                    taskList.appendChild(taskCard);
//                }

//                taskModal.hide();
//            })
//            .catch(err => {
//                alert("Error: " + err.message);
//            });
//    });

const taskList = document.querySelector('.task-list');
const addTaskBtn = document.getElementById('add-task-btn');
const taskTitleInput = document.getElementById('new-task-title');
const taskDescInput = document.getElementById('new-task-desc');
const taskHourInput = document.getElementById('new-task-hour');
const taskMinuteInput = document.getElementById('new-task-minute');
const saveTaskBtn = document.getElementById('save-task-btn');
const taskModal = new bootstrap.Modal(document.getElementById('taskInputModal'));

if (taskList) {
    taskList.addEventListener('dragover', function (e) {
        e.preventDefault();
        taskList.style.backgroundColor = "#f0f8ff";
    });

    taskList.addEventListener('dragleave', function () {
        taskList.style.backgroundColor = "";
    });

    taskList.addEventListener('drop', function (e) {
        e.preventDefault();
        taskList.style.backgroundColor = "";

        const data = JSON.parse(e.dataTransfer.getData("text/plain"));
        const source = e.dataTransfer.getData("source");

        const { title, desc, duration, taskId } = data;

        const dragging = document.querySelector('.dragging');
        if (dragging && source === "calendar") dragging.remove();

        const restoredTask = document.createElement('div');
        restoredTask.className = 'task-card';
        restoredTask.setAttribute("draggable", "true");
        restoredTask.innerHTML = `
            <strong>${title}</strong><br>
            <small>${desc}</small><br>
            <small>Task ID: ${taskId}</small>`;
        restoredTask.dataset.duration = duration;
        restoredTask.dataset.taskId = taskId;

        makeTaskDraggable(restoredTask);
        taskList.appendChild(restoredTask);

        if (taskId) {
            fetch(`/Task/Remove?taskId=${taskId}`, {
                method: "DELETE"
            })
                .then(res => {
                    if (!res.ok) throw new Error("Failed to unschedule.");
                    console.log("Task unscheduled successfully.");
                })
                .catch(err => console.error("Unscheduled error:", err));
        }
    });

    const trashCan = document.getElementById('trash-can');
    if (trashCan) {
        trashCan.addEventListener('dragover', e => {
            e.preventDefault();
            trashCan.classList.add("dragover");
        });

        trashCan.addEventListener('dragleave', () => {
            trashCan.classList.remove("dragover");
        });

        trashCan.addEventListener('drop', e => {
            e.preventDefault();
            trashCan.classList.remove("dragover");

            const data = JSON.parse(e.dataTransfer.getData("text/plain"));
            const { taskId, scheduledTaskId } = data;

            const dragging = document.querySelector('.dragging');
            if (dragging) dragging.remove();

            const queryParams = new URLSearchParams();
            if (taskId) queryParams.append("taskId", taskId);
            if (scheduledTaskId) queryParams.append("scheduledTaskId", scheduledTaskId);

            fetch(`/Task/Delete?${queryParams.toString()}`, {
                method: "DELETE"
            })
                .then(res => {
                    if (!res.ok) throw new Error("Failed to delete task.");
                    console.log("Task deleted successfully.");
                })
                .catch(err => console.error("Deletion error:", err));
        });
    }

    addTaskBtn.addEventListener('click', () => {
        taskTitleInput.value = '';
        taskDescInput.value = '';
        taskHourInput.value = '';
        taskMinuteInput.value = '';
        document.querySelectorAll('.task-card[data-editing]').forEach(t => delete t.dataset.editing);
        taskModal.show();
        setTimeout(() => taskTitleInput.focus(), 200);
    });

    taskMinuteInput.addEventListener('input', () => {
        let minutes = parseInt(taskMinuteInput.value) || 0;
        let hours = parseInt(taskHourInput.value) || 0;

        if (minutes >= 60) {
            const extra = Math.floor(minutes / 60);
            minutes = minutes % 60;
            hours += extra;

            if (hours > 8) {
                hours = 8;
                minutes = 0;
            }

            taskHourInput.value = hours;
            taskMinuteInput.value = minutes;
        }
    });

    saveTaskBtn.addEventListener('click', () => {
        const title = taskTitleInput.value.trim();
        const desc = taskDescInput.value.trim();
        let hours = parseInt(taskHourInput.value) || 0;
        let minutes = parseInt(taskMinuteInput.value) || 0;

        if (title === '' || (hours === 0 && minutes === 0)) return;

        // Format for TimeSpan (HH:mm:ss)
        const duration = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
        const decimalDuration = (hours + minutes / 60).toFixed(2);

        const hour = parseInt(document.getElementById('new-task-hour').value) || 0;
        const minute = parseInt(document.getElementById('new-task-minute').value) || 0;

        const editingTask = document.querySelector('.task-card[data-editing]');
        const isEditing = editingTask !== null;

        const payload = {
            title: title,
            description: desc,
            hour: hour,
            minute: minute
        };

        let url = '/Task/CreateNewTask';
        let method = 'POST';

        if (isEditing) {
            payload.taskId = editingTask.dataset.taskId;
            url = '/Task/UpdateTask';
            method = 'PUT';
        }

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
            .then(response => {
                if (!response.ok) throw new Error(isEditing ? "Failed to update task" : "Failed to create task");
                return response.json();
            })
            .then(data => {
                console.log(data.message);

                if (isEditing) {
                    editingTask.querySelector('strong').textContent = title;
                    editingTask.querySelector('small').textContent = desc;
                    editingTask.dataset.duration = decimalDuration;
                    delete editingTask.dataset.editing;
                } else {
                    const taskCard = document.createElement('div');
                    taskCard.className = 'task-card';
                    taskCard.setAttribute('draggable', 'true');
                    taskCard.dataset.duration = decimalDuration;
                    taskCard.dataset.taskId = data.taskId;
                    taskCard.innerHTML = `
                    <strong>${title}</strong><br>
                    <small>${desc}</small><br>
                    <small>Task ID: ${data.taskId}</small>`;

                    makeTaskDraggable(taskCard);
                    taskList.appendChild(taskCard);
                }

                taskModal.hide();
            })
            .catch(err => {
                alert("Error: " + err.message);
            });
    });

    taskTitleInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') saveTaskBtn.click();
    });

    taskDescInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            saveTaskBtn.click();
        }
    });
}

// =======================
// COLUMN RESIZER
// =======================
document.querySelectorAll('.day-header').forEach((header, index) => {
    const resizer = document.createElement('div');
    resizer.className = 'column-resizer';
    header.appendChild(resizer);

    resizer.addEventListener('mousedown', function (e) {
        e.preventDefault();
        const startX = e.clientX;
        const startWidth = header.offsetWidth;
        const columnIndex = index;
        const calendarRows = document.querySelectorAll('.calendar-row');

        function onMouseMove(e) {
            const delta = e.clientX - startX;
            const newWidth = Math.max(80, Math.min(startWidth + delta, 240));
            header.style.width = `${newWidth}px`;

            calendarRows.forEach(row => {
                const slot = row.children[columnIndex + 1];
                if (slot) {
                    slot.style.width = `${newWidth}px`;
                }
            });
        }

        function onMouseUp() {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });
});

// =======================
// ROW RESIZER
// =======================
document.querySelectorAll('.calendar-row').forEach(row => {
    const resizer = document.createElement('div');
    resizer.className = 'row-resizer';
    row.appendChild(resizer);

    resizer.addEventListener('mousedown', function (e) {
        e.preventDefault();
        const startY = e.clientY;
        const startHeight = row.offsetHeight;

        function onMouseMove(e) {
            const delta = e.clientY - startY;
            const newHeight = Math.max(startHeight + delta, 24);
            row.style.minHeight = newHeight + 'px';

            // Resize all tasks in this row
            row.querySelectorAll('.task-card').forEach(task => {
                //const duration = parseInt(task.dataset.duration) || 1;
                //task.style.height = `${newHeight * duration}px`;
                resizeAndRestackTasks();
            });
        }

        function onMouseUp() {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });
});

// =======================
// RESET LAYOUT
// =======================
//document.getElementById('reset-layout-btn')?.addEventListener('click', () => {
//    const headers = document.querySelectorAll('.day-header');
//    const rows = document.querySelectorAll('.calendar-row');

//    headers.forEach((header, index) => {
//        header.style.width = '120px';
//        rows.forEach(row => {
//            const slot = row.children[index + 1];
//            if (slot) slot.style.width = '120px';
//        });
//    });

//    rows.forEach(row => {
//        row.style.minHeight = '48px';
//    });
//});

document.getElementById('reset-layout-btn')?.addEventListener('click', () => {
    const headers = document.querySelectorAll('.day-header');
    const rows = document.querySelectorAll('.calendar-row');
    const defaultWidth = '120px';
    const defaultHeight = 48;

    headers.forEach((header, index) => {
        header.style.width = defaultWidth;
        rows.forEach(row => {
            const slot = row.children[index + 1];
            if (slot) slot.style.width = defaultWidth;
        });
    });

    rows.forEach(row => {
        row.style.minHeight = `${defaultHeight}px`;
        row.querySelectorAll('.task-card').forEach(task => {
            //const duration = parseInt(task.dataset.duration) || 1;
            //task.style.height = `${defaultHeight * duration}px`;
        });
    });
});


function resizeAndRestackTasks() {
    document.querySelectorAll('.calendar-slot').forEach(slot => {
        const tasks = Array.from(slot.querySelectorAll('.task-card'));
        const slotHeight = slot.clientHeight;
        const taskHeight = 42;
        const margin = 6;
        const overlapOffset = 12;

        tasks.forEach((task, i) => {
            const totalNeededHeight = (taskHeight + margin) * (i + 1);
            const overlap = totalNeededHeight > slotHeight;

            task.style.height = `${taskHeight}px`;
            task.style.width = 'calc(100% - 10px)';
            task.style.left = '5px';
            task.style.zIndex = `${10 + i}`;
            task.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';

            if (overlap) {
                task.classList.add('stacked-overlap');
                task.style.top = `${i * overlapOffset}px`;
                task.style.opacity = i === tasks.length - 1 ? '1' : '0.9';
                task.style.setProperty('--i', i);
            } else {
                task.classList.remove('stacked-overlap');
                task.style.top = `${i * (taskHeight + margin)}px`;
                task.style.opacity = '1';
            }
        });
    });
}
