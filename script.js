// --- 1. NAVIGATION & THEME LOGIC ---

// Handles switching between Dashboard, Faculty, Community, etc.
function showSection(id, element) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    // Show selected section
    document.getElementById(id).classList.add('active');
    
    // Update sidebar active state
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    if(element) element.classList.add('active');
}

// Toggles Light/Dark mode
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const themeIcon = document.getElementById('themeIcon');
    if (document.body.classList.contains('dark-mode')) {
        themeIcon.className = 'fa-solid fa-sun';
        themeIcon.parentElement.querySelector('span').textContent = 'Light Mode';
    } else {
        themeIcon.className = 'fa-solid fa-moon';
        themeIcon.parentElement.querySelector('span').textContent = 'Dark Mode';
    }
}

// Handles the tabs inside the Community section
function openTab(id, btn) {
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

// --- 2. CALENDAR LOGIC ---

// Mock data for the calendar
const events = {
    5: {type: 'bg-event', title: 'Club Meet'},
    12: {type: 'bg-holiday', title: 'Local Holiday'},
    24: {type: 'bg-exam', title: 'Mid-term Physics'},
    25: {type: 'bg-exam', title: 'Mid-term Math'}
};

function renderCalendar() {
    const grid = document.getElementById('calendarGrid');
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Clear existing grid if any
    grid.innerHTML = '';

    // Add Headers (Sun, Mon, etc.)
    days.forEach(day => {
        const div = document.createElement('div');
        div.className = 'cal-day-header';
        div.textContent = day;
        grid.appendChild(div);
    });

    // Add Days (Mocking 30 days starting on a Tuesday)
    // Empty slots for Sun/Mon (to align 1st date to Tuesday)
    grid.appendChild(document.createElement('div')); 
    grid.appendChild(document.createElement('div'));

    for(let i=1; i<=30; i++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'cal-day';
        dayDiv.innerHTML = `<span class="day-number">${i}</span>`;
        
        // If there is an event on this day, add a dot
        if(events[i]) {
            const dot = document.createElement('div');
            dot.className = `event-dot ${events[i].type}`;
            dayDiv.appendChild(dot);
            dayDiv.onclick = () => alert(`Date: ${i}\nEvent: ${events[i].title}`);
        }
        grid.appendChild(dayDiv);
    }
}

// --- 3. FACULTY HUB LOGIC ---

const facultyData = [
    {name: "Dr. Sharma", subject: "Physics", email: "sharma@college.edu", room: "NB-102", slots: ["10:00 AM", "2:00 PM"]},
    {name: "Prof. Gupta", subject: "Mathematics", email: "gupta@college.edu", room: "MB-305", slots: ["11:30 AM"]},
    {name: "Dr. Patel", subject: "Chemistry", email: "patel@college.edu", room: "CB-201", slots: ["9:00 AM", "3:00 PM"]}
];

let isFacultyMode = false;

function renderFaculty() {
    const grid = document.getElementById('facultyGrid');
    grid.innerHTML = '';
    
    facultyData.forEach((fac, index) => {
        const card = document.createElement('div');
        card.className = 'faculty-card';
        
        let slotsHtml = '';
        if(isFacultyMode) {
            // Edit Mode: Show input fields and delete options
            slotsHtml = `<div class="slots-container" id="slots-${index}">
                ${fac.slots.map((s, slotIdx) => 
                    `<span class="slot-pill" onclick="deleteSlot(${index}, ${slotIdx})">
                        ${s} <i class="fa-solid fa-xmark"></i>
                    </span>`
                ).join('')}
                <input type="text" class="slot-input" placeholder="+ Time" 
                       onkeypress="if(event.key==='Enter') addSlot(${index}, this)">
            </div>`;
        } else {
            // Student View: Show clickable buttons
            slotsHtml = `<div class="slots-container">
                ${fac.slots.map(s => 
                    `<span class="slot-pill" onclick="alert('Meeting request sent to ${fac.name} at ${s}!')">
                        ${s}
                    </span>`
                ).join('')}
            </div>`;
        }

        card.innerHTML = `
            <div class="faculty-name">${fac.name}</div>
            <div class="faculty-subject">${fac.subject}</div>
            <div class="contact-row"><i class="fa-solid fa-building"></i> ${fac.room}</div>
            <div class="contact-row"><i class="fa-solid fa-envelope"></i> ${fac.email}</div>
            <div style="margin-top:15px; font-weight:bold; font-size:0.9rem;">Meeting Time:</div>
            ${slotsHtml}
        `;
        grid.appendChild(card);
    });
}

// Called when the toggle switch is clicked
function toggleFacultyMode() {
    isFacultyMode = document.getElementById('facultyToggle').checked;
    renderFaculty();
}

// Add new slot in faculty edit mode
function addSlot(facultyIndex, inputElement) {
    const timeValue = inputElement.value.trim();
    if (timeValue && isFacultyMode) {
        facultyData[facultyIndex].slots.push(timeValue);
        inputElement.value = '';
        renderFaculty();
    }
}

// Delete slot in faculty edit mode
function deleteSlot(facultyIndex, slotIndex) {
    if (isFacultyMode) {
        facultyData[facultyIndex].slots.splice(slotIndex, 1);
        renderFaculty();
    }
}

// --- 4. COMMITTEE EVENTS HUB LOGIC ---

let committeeEvents = [
    {
        id: 1,
        title: "Tech Symposium 2024",
        date: "2024-03-15",
        description: "Join us for an exciting tech symposium featuring industry leaders and workshops on emerging technologies.",
        link: "https://example.com/tech-symposium"
    },
    {
        id: 2,
        title: "Cultural Fest",
        date: "2024-03-20",
        description: "Annual cultural festival with performances, food stalls, and competitions.",
        link: "https://example.com/cultural-fest"
    }
];

let isCommitteeAdminMode = false;

function toggleCommitteeMode() {
    isCommitteeAdminMode = document.getElementById('committeeToggle').checked;
    const adminView = document.getElementById('committeeAdminView');
    const studentView = document.getElementById('committeeStudentView');
    
    if (isCommitteeAdminMode) {
        adminView.style.display = 'block';
        studentView.style.display = 'none';
    } else {
        adminView.style.display = 'none';
        studentView.style.display = 'block';
        renderEventsFeed();
    }
}

function postEvent(event) {
    event.preventDefault();
    
    const title = document.getElementById('eventTitle').value;
    const date = document.getElementById('eventDate').value;
    const description = document.getElementById('eventDescription').value;
    const link = document.getElementById('eventLink').value;
    
    // Add new event to the array
    const newEvent = {
        id: Date.now(),
        title: title,
        date: date,
        description: description,
        link: link
    };
    
    committeeEvents.unshift(newEvent); // Add to beginning
    
    // Reset form
    document.getElementById('eventForm').reset();
    
    // Show success message
    alert('Event posted successfully!');
    
    // Switch to student view to see the new event
    document.getElementById('committeeToggle').checked = false;
    toggleCommitteeMode();
}

function renderEventsFeed() {
    const feed = document.getElementById('eventsFeed');
    feed.innerHTML = '';
    
    if (committeeEvents.length === 0) {
        feed.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 40px;">No events posted yet.</p>';
        return;
    }
    
    // Sort events by date (most recent first)
    const sortedEvents = [...committeeEvents].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    sortedEvents.forEach(event => {
        const card = document.createElement('div');
        card.className = 'event-card';
        
        const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        card.innerHTML = `
            <div class="event-card-header">
                <div>
                    <div class="event-card-title">${event.title}</div>
                    <div class="event-card-date">
                        <i class="fa-solid fa-calendar"></i>
                        ${formattedDate}
                    </div>
                </div>
            </div>
            <div class="event-card-description">${event.description}</div>
            <button class="btn-register" onclick="window.open('${event.link}', '_blank')">
                <i class="fa-solid fa-external-link-alt"></i>
                Register Here
            </button>
        `;
        
        feed.appendChild(card);
    });
}

// --- 5. ATTENDANCE CALCULATOR LOGIC ---

function calculateAttendance() {
    const totalInput = document.getElementById('totalClasses');
    const attendedInput = document.getElementById('attendedClasses');

    const total = parseInt(totalInput.value) || 0;
    const attended = parseInt(attendedInput.value) || 0;
    
    if(total === 0) {
        document.getElementById('percentText').textContent = '0%';
        document.getElementById('circlePath').setAttribute('stroke-dasharray', '0, 100');
        return;
    }
    
    // Prevent attended from being higher than total
    if(attended > total) {
        attendedInput.value = total;
        return calculateAttendance();
    }

    const pct = Math.round((attended / total) * 100);
    document.getElementById('percentText').textContent = `${pct}%`;
    
    const circle = document.getElementById('circlePath');
    // SVG stroke-dasharray controls the fill amount
    circle.setAttribute('stroke-dasharray', `${pct}, 100`);
    
    // Color Logic based on thresholds
    if(pct < 75) circle.setAttribute('stroke', '#dc3545'); // Red
    else if(pct < 85) circle.setAttribute('stroke', '#ffc107'); // Yellow
    else circle.setAttribute('stroke', '#28a745'); // Green
    
    return {total, attended, pct};
}

// --- 6. FUTURE PLANNER (+ ICON) LOGIC ---

// Shows/Hides the modal overlay
function togglePlanner() {
    const overlay = document.getElementById('plannerOverlay');
    // Check if currently hidden or flex
    const isVisible = window.getComputedStyle(overlay).display === 'flex';
    
    overlay.style.display = isVisible ? 'none' : 'flex';
    
    if(!isVisible) {
        renderPlannerGrid();
    }
}

// Generates the 10 empty boxes for planning
function renderPlannerGrid() {
    const grid = document.getElementById('plannerGrid');
    grid.innerHTML = '';
    
    for(let i=0; i<10; i++) {
        const box = document.createElement('div');
        box.className = 'planner-box';
        box.dataset.status = 'none'; // Initial state: none, attend, skip
        
        // Cycle through states on click: Empty -> Check -> Cross -> Empty
        box.onclick = function() {
            if(this.dataset.status === 'none') {
                this.dataset.status = 'attend';
                this.classList.add('attend');
                this.innerHTML = '<i class="fa-solid fa-check"></i>';
            } else if (this.dataset.status === 'attend') {
                this.dataset.status = 'skip';
                this.classList.remove('attend');
                this.classList.add('skip');
                this.innerHTML = '<i class="fa-solid fa-xmark"></i>';
            } else {
                this.dataset.status = 'none';
                this.classList.remove('skip');
                this.innerHTML = '';
            }
        }
        grid.appendChild(box);
    }
}

// Calculates the "What If" percentage
function applyPlan() {
    const boxes = document.querySelectorAll('.planner-box');
    let projectedAttend = 0;
    let projectedTotal = 0;
    
    boxes.forEach(box => {
        // Only count boxes the user interacted with
        if(box.dataset.status !== 'none') {
            projectedTotal++;
            if(box.dataset.status === 'attend') projectedAttend++;
        }
    });

    const current = calculateAttendance(); // Get current stats from inputs
    
    if (!current || current.total === 0) {
        alert('Please enter valid attendance data first.');
        return;
    }
    
    const newTotal = current.total + projectedTotal;
    const newAttended = current.attended + projectedAttend;
    
    // Calculate new percentage
    const newPct = Math.round((newAttended / newTotal) * 100);

    // Display result
    const resDiv = document.getElementById('projectionResult');
    const resText = document.getElementById('projText');
    
    resDiv.style.display = 'block';
    resText.textContent = `${newPct}% (if you follow plan)`;
    
    // Close modal
    togglePlanner();
}

// --- INITIALIZATION ---
// Run these when the script loads to set up the page
window.addEventListener('DOMContentLoaded', function() {
    renderCalendar();
    renderFaculty();
    renderEventsFeed();
    calculateAttendance();
});