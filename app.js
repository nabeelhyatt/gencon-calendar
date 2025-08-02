// ABOUTME: This file contains the javascript for the Gen Con calendar.
// ABOUTME: It handles sorting events by time or by checked status, and tab navigation.

// Function to sort events dynamically
function sortEvents(day) {
    const sortValue = document.getElementById(`sort-${day}`).value;
    const eventList = document.getElementById(`event-list-${day}`);
    if (!eventList) return;

    const events = Array.from(eventList.getElementsByClassName('event-card'));

    events.sort((a, b) => {
        if (sortValue === 'time') {
            const timeTextA = a.querySelector('.event-time').innerText.trim();
            const timeTextB = b.querySelector('.event-time').innerText.trim();

            const getTimeInMinutes = (timeText) => {
                const timeString = timeText.split('\n')[0]; // e.g., "1:00 PM"
                const parts = timeString.split(' '); // e.g., ["1:00", "PM"]
                if (parts.length < 2) return 0; // Handle cases with no AM/PM
                const time = parts[0];
                const period = parts[1];
                let [hours, minutes] = time.split(':').map(Number);

                if (period.toUpperCase() === 'PM' && hours !== 12) {
                    hours += 12;
                }
                if (period.toUpperCase() === 'AM' && hours === 12) { // Midnight case
                    hours = 0;
                }
                return hours * 60 + (minutes || 0);
            };

            return getTimeInMinutes(timeTextA) - getTimeInMinutes(timeTextB);
        } else if (sortValue === 'checked') {
            const checkedA = a.querySelector('input[type="checkbox"]').checked;
            const checkedB = b.querySelector('input[type="checkbox"]').checked;
            return checkedB - checkedA; // true (1) comes before false (0)
        }
        return 0;
    });

    // Append sorted events back to the list
    events.forEach(event => eventList.appendChild(event));
}

// GenCon 2025 Interactive Calendar JavaScript

document.addEventListener('DOMContentLoaded', function() {
    console.log('GenCon 2025 Calendar initializing...');
    
    // Get all tab buttons and day content sections
    const tabButtons = document.querySelectorAll('.tab-button');
    const dayContents = document.querySelectorAll('.day-content');
    const textareas = document.querySelectorAll('textarea');
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    
    // Function to switch to a specific day
    function switchToDay(targetDay) {
        console.log('Switching to day:', targetDay);
        
        // Remove active class from all tabs and content
        tabButtons.forEach(button => {
            button.classList.remove('active');
        });
        
        dayContents.forEach(content => {
            content.classList.remove('active');
        });
        
        // Add active class to clicked tab
        const activeTab = document.querySelector(`[data-day="${targetDay}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
            console.log('Tab activated:', targetDay);
        } else {
            console.error('Tab not found:', targetDay);
            return false;
        }
        
        // Show corresponding day content
        const activeContent = document.getElementById(targetDay);
        if (activeContent) {
            activeContent.classList.add('active');
            console.log('Content activated:', targetDay);
            
            // Smooth scroll to top of content
            setTimeout(() => {
                activeContent.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }, 100);
        } else {
            console.error('Content not found:', targetDay);
            return false;
        }
        
        // Update URL hash without triggering scroll
        if (history.pushState) {
            history.pushState(null, null, '#' + targetDay);
        }
        
        return true;
    }
    
    // Add click event listeners to all tab buttons
    tabButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const targetDay = this.getAttribute('data-day');
            console.log('Tab clicked:', targetDay);
            switchToDay(targetDay);
        });
        
        // Add keyboard support for accessibility
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const targetDay = this.getAttribute('data-day');
                switchToDay(targetDay);
            }
        });
    });
    
    // Keyboard navigation between tabs
    document.addEventListener('keydown', function(e) {
        // Only handle if we're not in an input field
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        const activeTab = document.querySelector('.tab-button.active');
        if (!activeTab) return;
        
        let nextTab = null;
        
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            // Move to previous tab
            nextTab = activeTab.previousElementSibling;
            if (!nextTab) {
                // Wrap to last tab
                nextTab = activeTab.parentElement.lastElementChild;
            }
        } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            // Move to next tab
            nextTab = activeTab.nextElementSibling;
            if (!nextTab) {
                // Wrap to first tab
                nextTab = activeTab.parentElement.firstElementChild;
            }
        }
        
        if (nextTab && nextTab.classList.contains('tab-button')) {
            e.preventDefault();
            const targetDay = nextTab.getAttribute('data-day');
            switchToDay(targetDay);
            nextTab.focus();
        }
    });
    
    // Handle URL hash on page load
    function handleInitialHash() {
        const hash = window.location.hash.substring(1);
        const validDays = ['thursday', 'friday', 'saturday', 'sunday', 'booths'];
        
        if (hash && validDays.includes(hash)) {
            switchToDay(hash);
        } else {
            // Default to Thursday
            switchToDay('thursday');
        }
    }
    
    // Handle browser back/forward buttons
    window.addEventListener('hashchange', function() {
        const hash = window.location.hash.substring(1);
        const validDays = ['thursday', 'friday', 'saturday', 'sunday', 'booths'];
        
        if (hash && validDays.includes(hash)) {
            switchToDay(hash);
        }
    });
    
    // Add event card interactions
    const eventCards = document.querySelectorAll('.event-card');
    eventCards.forEach(card => {
        // Add focus support for keyboard users
        card.setAttribute('tabindex', '0');
        
        // Add click to expand/collapse functionality
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking on checkbox, textarea, or label
            if (e.target.type === 'checkbox' || 
                e.target.tagName === 'TEXTAREA' || 
                e.target.tagName === 'LABEL' ||
                e.target.tagName === 'INPUT') {
                return;
            }
            
            this.classList.toggle('expanded');
            
            // Add visual feedback
            if (this.classList.contains('expanded')) {
                this.style.transform = 'scale(1.02)';
                this.style.transition = 'transform 0.2s ease';
            } else {
                this.style.transform = 'scale(1)';
            }
        });
        
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                // Toggle expanded state
                this.classList.toggle('expanded');
            }
        });
    });
    
    // Notes functionality with auto-save (fallback without localStorage)
    function saveNotes() {
        // Since localStorage might not be available, we'll just log this
        console.log('Notes would be saved here (localStorage not available in sandbox)');
    }
    
    function loadNotes() {
        console.log('Notes would be loaded here (localStorage not available in sandbox)');
    }
    
    // Add auto-save for notes (basic functionality)
    textareas.forEach(textarea => {
        let saveTimeout;
        textarea.addEventListener('input', function() {
            // Clear previous timeout
            clearTimeout(saveTimeout);
            // Set new timeout for auto-save
            saveTimeout = setTimeout(saveNotes, 1000);
        });
        textarea.addEventListener('blur', saveNotes);
    });
    
    // Checkbox selection functionality
    function saveSelections() {
        console.log('Selections would be saved here (localStorage not available in sandbox)');
    }
    
    function loadSelections() {
        console.log('Selections would be loaded here (localStorage not available in sandbox)');
    }
    
    // Add change listeners for checkboxes
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            saveSelections();
            
            // Visual feedback for selection
            const eventCard = this.closest('.event-card');
            if (eventCard) {
                if (this.checked) {
                    eventCard.classList.add('selected');
                } else {
                    eventCard.classList.remove('selected');
                }
            }
        });
    });
    
    // Add utility function to get current day
    function getCurrentDay() {
        const activeTab = document.querySelector('.tab-button.active');
        return activeTab ? activeTab.getAttribute('data-day') : 'thursday';
    }
    
    // Add utility function to navigate to specific time
    function goToTime(day, time) {
        switchToDay(day);
        
        // Find event card with matching time
        setTimeout(() => {
            const dayContent = document.getElementById(day);
            if (dayContent) {
                const timeElements = dayContent.querySelectorAll('.event-time');
                timeElements.forEach(timeEl => {
                    if (timeEl.textContent.includes(time)) {
                        const eventCard = timeEl.closest('.event-card');
                        eventCard.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center'
                        });
                        // Highlight the card briefly
                        eventCard.style.backgroundColor = 'var(--color-bg-1)';
                        setTimeout(() => {
                            eventCard.style.backgroundColor = '';
                        }, 2000);
                    }
                });
            }
        }, 300);
    }
    
    // Mobile touch swipe support for tab navigation
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartTime = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        touchStartTime = Date.now();
    }, { passive: true });
    
    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        const touchDuration = Date.now() - touchStartTime;
        
        // Only trigger swipe if it was a quick gesture
        if (touchDuration < 300) {
            handleSwipe();
        }
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const swipeDistance = touchEndX - touchStartX;
        
        if (Math.abs(swipeDistance) < swipeThreshold) return;
        
        const currentTab = document.querySelector('.tab-button.active');
        if (!currentTab) return;
        
        let nextTab = null;
        
        if (swipeDistance > 0) {
            // Swipe right - go to previous day
            nextTab = currentTab.previousElementSibling;
        } else {
            // Swipe left - go to next day  
            nextTab = currentTab.nextElementSibling;
        }
        
        if (nextTab && nextTab.classList.contains('tab-button')) {
            const targetDay = nextTab.getAttribute('data-day');
            switchToDay(targetDay);
        }
    }
    
    // Simple search functionality for events
    function searchEvents(query) {
        if (!query || query.length < 2) {
            // Reset all event cards to visible
            eventCards.forEach(card => {
                card.style.display = '';
            });
            return 0;
        }
        
        query = query.toLowerCase();
        let matchCount = 0;
        
        eventCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('.event-description').textContent.toLowerCase();
            const location = card.querySelector('.event-location')?.textContent.toLowerCase() || '';
            const booth = card.querySelector('.event-booth')?.textContent.toLowerCase() || '';
            
            const matches = title.includes(query) || 
                          description.includes(query) || 
                          location.includes(query) ||
                          booth.includes(query);
            
            if (matches) {
                card.style.display = '';
                matchCount++;
            } else {
                card.style.display = 'none';
            }
        });
        
        console.log(`Search for "${query}" found ${matchCount} matches`);
        return matchCount;
    }
    
    // Add search functionality to header
    function addSearchInterface() {
        const header = document.querySelector('.header');
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        searchContainer.innerHTML = `
            <input type="text" id="event-search" placeholder="Search events, booths, designers..." class="form-control">
            <button type="button" id="clear-search" class="btn btn--sm btn--secondary">Clear</button>
        `;
        
        header.appendChild(searchContainer);
        
        const searchInput = document.getElementById('event-search');
        const clearButton = document.getElementById('clear-search');
        
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                searchEvents(this.value);
            }, 300);
        });
        
        clearButton.addEventListener('click', function() {
            searchInput.value = '';
            searchEvents('');
            searchInput.focus();
        });
    }
    
    // Print functionality
    function printSchedule() {
        // Show all day content before printing
        dayContents.forEach(content => {
            content.style.display = 'block';
        });
        
        window.print();
        
        // Restore original display after printing
        setTimeout(() => {
            dayContents.forEach(content => {
                if (!content.classList.contains('active')) {
                    content.style.display = 'none';
                }
            });
        }, 1000);
    }
    
    // Booth data and rendering
    const boothData = [
        // HIGHEST Priority - Organized by Booth Number Zones
        { booth: "403", company: "Alderac (AEG)", knownFor: "Unstoppable (John D. Clair)", priority: "HIGHEST", visitDay: "Thursday" },
        { booth: "1643", company: "Cephalofair Games", knownFor: "Gloomhaven / Frosthaven", priority: "HIGHEST", visitDay: "Saturday" },
        { booth: "2250", company: "Paverson Games", knownFor: "Luthier (Dave Beck)", priority: "HIGHEST", visitDay: "Friday" },
        { booth: "2402", company: "Dire Wolf", knownFor: "Lightning Train (Paul Dennen)", priority: "HIGHEST", visitDay: "Friday" },
        { booth: "2435", company: "Scorpion Masqué (Hachette)", knownFor: "Tag Team (Lebrat & German)", priority: "HIGHEST", visitDay: "Friday" },
        { booth: "n/a", company: "Sophisticated Cerberus / Crowd Games", knownFor: "Sprocketforge", priority: "HIGHEST", visitDay: "Sunday" },

        // HIGH Priority - Organized by Booth Number Zones
        { booth: "142", company: "Abbots Hollow Studios", knownFor: "Indie designs", priority: "HIGH", visitDay: "Thursday" },
        { booth: "215", company: "Pandasaurus", knownFor: "Gatsby, Sea Salt & Paper", priority: "HIGH", visitDay: "Thursday" },
        { booth: "229", company: "Ares Games", knownFor: "War of the Ring, Wings of Glory", priority: "HIGH", visitDay: "Thursday" },
        { booth: "566", company: "Alayna Danner (Artist)", knownFor: "MtG & board-game art", priority: "HIGH", visitDay: "Thursday" },
        { booth: "629", company: "Arcane Wonders", knownFor: "Sheriff of Nottingham, Overboss Duel", priority: "HIGH", visitDay: "Thursday" },
        { booth: "712", company: "Adventure Scents", knownFor: "Thematic gaming aromas", priority: "HIGH", visitDay: "Thursday" },
        { booth: "821", company: "Fantasy Flight Games", knownFor: "Arkham Horror, X-Wing", priority: "HIGH", visitDay: "Thursday" },
        { booth: "929", company: "Z-Man Games", knownFor: "Pandemic Legacy, Carcassonne", priority: "HIGH", visitDay: "Thursday" },
        { booth: "2239", company: "IV Studio", knownFor: "Moonrakers: Binding Ties, Veiled Fate", priority: "HIGH", visitDay: "Friday" },
        { booth: "2627", company: "Chip Theory Games", knownFor: "Too Many Bones, Elder Scrolls", priority: "HIGH", visitDay: "Friday" },
        { booth: "2801", company: "Academy Games", knownFor: "Historical strategy line", priority: "HIGH", visitDay: "Friday" },
        { booth: "3027", company: "Capstone Games", knownFor: "Ark Nova, Maracaibo: Pirates", priority: "HIGH", visitDay: "Friday" },

        // MEDIUM Priority - Organized by Booth Number Zones
        { booth: "1109, 817, 809", company: "Asmodee Group Block", knownFor: "Ticket to Ride, Splendor, Azul", priority: "MEDIUM", visitDay: "Thursday" },
        { booth: "1129", company: "CMON", knownFor: "Zombicide, Cthulhu: DM", priority: "MEDIUM", visitDay: "Saturday" },
        { booth: "1352", company: "Bitewing Games", knownFor: "Reiner Knizia line (Iliad, Orbit)", priority: "MEDIUM", visitDay: "Saturday" },
        { booth: "1443", company: "Good Games", knownFor: "12 Rivers", priority: "MEDIUM", visitDay: "Saturday" },
        { booth: "1731", company: "Restoration Games", knownFor: "Return to Dark Tower, Unmatched", priority: "MEDIUM", visitDay: "Saturday" },
        { booth: "1751", company: "ALBI", knownFor: "Euro imports", priority: "MEDIUM", visitDay: "Saturday" },
        { booth: "1907", company: "AMIGO Games", knownFor: "Saboteur, Bohnanza", priority: "MEDIUM", visitDay: "Saturday" },
        { booth: "2010", company: "Happy Camper Games", knownFor: "The Four Doors (Matt Leacock)", priority: "MEDIUM", visitDay: "Friday" },
        { booth: "2138", company: "Archon Studio", knownFor: "Masters of the Universe, Wolfenstein", priority: "MEDIUM", visitDay: "Friday" },
        { booth: "2243", company: "Ghost Galaxy", knownFor: "LOTR: The Confrontation 2E", priority: "MEDIUM", visitDay: "Friday" },
        { booth: "2660", company: "Gray Matters Games", knownFor: "Slip It In, You Bet-cha", priority: "MEDIUM", visitDay: "Friday" },

        // LOW Priority - Organized by Booth Number Zones
        { booth: "n/a", company: "Salt & Pepper Games", knownFor: "Onoda, Resist!", priority: "LOW", visitDay: "Sunday" },
        { booth: "n/a", company: "Red Raven Games", knownFor: "Above & Below: Haunted", priority: "LOW", visitDay: "Sunday" },
        { booth: "n/a", company: "García Designer Booth", knownFor: "The Voynich Puzzle (solo designer)", priority: "LOW", visitDay: "Sunday" }
    ];

    function renderBooths(sortBy = 'priority') {
        const container = document.getElementById('booth-list-container');
        if (!container) return;

        const sortedData = [...boothData].sort((a, b) => {
            if (sortBy === 'priority') {
                const priorityOrder = { 'HIGHEST': 0, 'HIGH': 1, 'MEDIUM': 2, 'LOW': 3 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            } else if (sortBy === 'day') {
                const dayOrder = { 'Thursday': 0, 'Friday': 1, 'Saturday': 2, 'Sunday': 3 };
                return dayOrder[a.visitDay] - dayOrder[b.visitDay];
            } else if (sortBy === 'booth') {
                const boothA = a.booth.split(',')[0].trim();
                const boothB = b.booth.split(',')[0].trim();
                const numA = parseInt(boothA, 10);
                const numB = parseInt(boothB, 10);
                if (!isNaN(numA) && !isNaN(numB)) {
                    return numA - numB;
                } else if (!isNaN(numA)) {
                    return -1;
                } else if (!isNaN(numB)) {
                    return 1;
                } else {
                    return boothA.localeCompare(boothB);
                }
            }
            return 0;
        });

        let tableHTML = `
            <div class="booth-controls">
                <label for="sort-booths">Sort by:</label>
                <select id="sort-booths">
                    <option value="priority" ${sortBy === 'priority' ? 'selected' : ''}>Priority</option>
                    <option value="day" ${sortBy === 'day' ? 'selected' : ''}>Visit Day</option>
                    <option value="booth" ${sortBy === 'booth' ? 'selected' : ''}>Booth #</option>
                </select>
            </div>
            <table class="booths-table">
                <thead>
                    <tr>
                        <th>Booth #</th>
                        <th>Company</th>
                        <th>Known For</th>
                        <th>Priority</th>
                        <th>Visit Day</th>
                    </tr>
                </thead>
                <tbody>
        `;

        sortedData.forEach(booth => {
            tableHTML += `
                <tr class="priority-${booth.priority.toLowerCase()}">
                    <td>${booth.booth}</td>
                    <td>${booth.company}</td>
                    <td>${booth.knownFor}</td>
                    <td><span class="priority-label">${booth.priority}</span></td>
                    <td>${booth.visitDay}</td>
                </tr>
            `;
        });

        tableHTML += '</tbody></table>';
        container.innerHTML = tableHTML;

        // Add event listener for the sort dropdown
        const sortSelect = document.getElementById('sort-booths');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                renderBooths(e.target.value);
            });
        }
    }

    // Initial render
    renderBooths();

    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Don't trigger shortcuts when typing in inputs
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        // Print shortcut
        if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
            e.preventDefault();
            printSchedule();
        }
        
        // Search shortcut
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            const searchInput = document.getElementById('event-search');
            if (searchInput) {
                searchInput.focus();
                searchInput.select();
            }
        }
        
        // Day navigation shortcuts
        if (e.altKey) {
            switch(e.key) {
                case '1':
                    e.preventDefault();
                    switchToDay('thursday');
                    break;
                case '2':
                    e.preventDefault();
                    switchToDay('friday');
                    break;
                case '3':
                    e.preventDefault();
                    switchToDay('saturday');
                    break;
                case '4':
                    e.preventDefault();
                    switchToDay('sunday');
                    break;
            }
        }
    });
    
    // Export functionality for selected events
    function exportSelected() {
        const selected = [];
        checkboxes.forEach(checkbox => {
            if (checkbox.checked && !checkbox.disabled) {
                const eventCard = checkbox.closest('.event-card');
                if (eventCard) {
                    const title = eventCard.querySelector('h3').textContent.replace(/[✅❌]/g, '').trim();
                    const time = eventCard.querySelector('.event-time').textContent.trim();
                    const location = eventCard.querySelector('.event-location')?.textContent.replace('📍', '').trim() || '';
                    const dayContent = eventCard.closest('.day-content');
                    const day = dayContent ? dayContent.id : '';
                    
                    selected.push({
                        day: day,
                        time: time,
                        title: title,
                        location: location
                    });
                }
            }
        });
        
        return selected;
    }
    
    // Convert Event ID text to clickable links
    function linkifyEventIds() {
        const eventDescriptions = document.querySelectorAll('.event-description');
        eventDescriptions.forEach(description => {
            const text = description.innerHTML;
            // Replace "Event ID: [number]" with a clickable link
            const linkedText = text.replace(
                /Event ID: (\d+)/g,
                'Event ID: <a href="https://www.gencon.com/events/$1" target="_blank" style="color: #4a90e2; text-decoration: underline;">$1</a>'
            );
            description.innerHTML = linkedText;
        });
    }

    // Initialize everything
    function initialize() {
        console.log('Initializing calendar...');
        console.log('Tab buttons found:', tabButtons.length);
        console.log('Day contents found:', dayContents.length);
        console.log('Checkboxes found:', checkboxes.length);
        console.log('Textareas found:', textareas.length);
        
        // Load saved data
        loadNotes();
        loadSelections();
        
        // Handle initial URL hash
        handleInitialHash();
        
        // Add search interface
        addSearchInterface();
        
        // Convert Event IDs to clickable links
        linkifyEventIds();
        
        // Ensure Saturday is active by default
        if (!document.querySelector('.day-content.active')) {
            switchToDay('saturday');
        }
        
        console.log('GenCon 2025 Calendar initialized successfully!');
    }
    
    // Expose functions globally for potential external use
    window.GenConCalendar = {
        switchToDay: switchToDay,
        getCurrentDay: getCurrentDay,
        goToTime: goToTime,
        searchEvents: searchEvents,
        printSchedule: printSchedule,
        exportSelected: exportSelected,
        saveNotes: saveNotes,
        saveSelections: saveSelections
    };
    
    // Track checkbox interactions for analytics
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            console.log(`Event ${this.id} ${this.checked ? 'selected' : 'deselected'}`);
        });
    });
    
    // Initialize the application
    initialize();
    
    console.log('All event listeners attached successfully!');
});