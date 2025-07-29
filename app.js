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
        const validDays = ['thursday', 'friday', 'saturday', 'sunday'];
        
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
        const validDays = ['thursday', 'friday', 'saturday', 'sunday'];
        
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
        
        // Ensure Thursday is active by default
        if (!document.querySelector('.day-content.active')) {
            switchToDay('thursday');
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