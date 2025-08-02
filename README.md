# GenCon 2025 Interactive Calendar

This is a web-based interactive calendar for the GenCon 2025 convention, running from July 31 to August 3, 2025. The calendar focuses on highly anticipated game releases and appearances by famous designers. For looking up Gencon events, browse to https://gencon.eventdb.us/ or https://www.gencon.com/events/. For booths and exhibitors check https://www.gencon.com/gen-con-indy/exhibitors-list

For a map of gencon see the exhibitor map at https://files.gencon.com/2025.exhibithallmap.pdf or the pdf at 2025.exhibithallmap.pdf

## Features

*   **Daily Schedule:** View events for each day of the convention (Thursday, Friday, Saturday, and Sunday).
*   **Interactive Event Cards:** Click on events to expand and see more details.
*   **Personalized Planning:**
    *   Select events you want to attend using checkboxes.
    *   Add personal notes for each day in dedicated text areas.
*   **Search Functionality:** Easily search for specific events, designers, or booth numbers.
*   **Tabbed Navigation:** Switch between days with a clean, tab-based interface.
*   **URL-based Day Selection:** The URL automatically updates with a hash (e.g., `#friday`) to reflect the selected day, allowing for easy bookmarking and sharing.
*   **Accessibility:** Supports keyboard navigation for tabs and events.
*   **Mobile-Friendly:** Includes touch-swipe navigation for switching between days on mobile devices.

## How to Use

1.  Open `index.html` in a web browser.
2.  Click on the tabs at the top to navigate between the different days of the convention.
3.  Use the checkboxes to mark the events you plan to attend.
4.  Use the search bar to find specific events.
5.  Add your own notes in the text fields provided for each day.

## Codebase Navigation Guide

To help navigate the codebase efficiently, here's where to find key components:

### File Structure
- `index.html` - Main calendar application (single-page app)
- `style.css` - All styling and visual design
- `README.md` - Project documentation and event research notes
- `netlify.toml` - Deployment configuration
- `windsurf_deployment.yaml` - Alternative deployment config

### HTML Structure (index.html)
- **Line ~15-50**: Head section with meta tags, CSS imports, and page title
- **Line ~55-100**: Header with navigation tabs (Thursday, Friday, Saturday, Sunday)
- **Line ~105-315**: Thursday events section (`id="thursday"`)
- **Line ~318-600**: Friday events section (`id="friday"`)
- **Line ~605-750**: Saturday events section (`id="saturday"`)
- **Line ~755-900**: Sunday events section (`id="sunday"`)
- **Line ~905-950**: Footer with event type legend and notes sections
- **Line ~955-end**: JavaScript for interactivity, search, and navigation

### Event Card Structure
Each event follows this pattern:
```html
<div class="event-card [type] [availability]">
    <div class="event-time">[time]<br>[duration]</div>
    <div class="event-content">
        <h3>[Event Title] <span class="availability">[status]</span></h3>
        <div class="event-details">
            <span class="event-location">📍 [location]</span>
            <span class="event-booth">🏪 [booth info]</span>
            <span class="event-cost">💰 [cost]</span>
            <span class="event-designer">👤 [designer/host]</span>
        </div>
        <p class="event-description">[description with optional Event ID link]</p>
        <div class="event-actions">
            <input type="checkbox" id="[unique-id]"> <label>[action text]</label>
        </div>
    </div>
</div>
```

### Event Types and CSS Classes
- `demo` - Game demonstrations
- `tournament` - Competitive tournaments
- `workshop` - Educational workshops
- `entertainment` - Shows and entertainment
- `gaming` - General gaming sessions
- `exploration` - Booth crawls and exploration
- `kepler` - Special Kepler events

### Availability States
- `available` - Event is available
- `registered` - Pre-registered/scheduled to attend
- `double-book` - Conflicting with another event

### CSS Structure (style.css)
- **Color variables**: Event type colors defined at top
- **Layout**: Grid and flexbox layouts for responsive design
- **Event cards**: Styling for different event types and states
- **Interactive elements**: Hover effects, transitions, and animations

### JavaScript Functions (bottom of index.html)
- `showDay(day)` - Switch between day tabs
- `searchEvents()` - Filter events by search term
- `sortEvents(day)` - Sort events by time or attendance
- Touch/swipe navigation for mobile

## Technologies Used

*   HTML5
*   CSS3
*   Vanilla JavaScript

## Event Links Research

Recently researched and added event links for demo/free events:

### Events with Links Added:
- **Brass: Birmingham Non-Qualifying** - Event ID: [276093](https://www.gencon.com/events/276093) (Training game)
- **Reiner Knizia Meet & Greet** - Event ID: [298667](https://www.gencon.com/events/298667)

### Events Still Needing Research:

**Thursday Events:**
- **Return to Dark Tower Demos** - Booth demos at Restoration Games
- **Unmatched Demos - Battle of Legends Vol. 4** - Booth demos at Restoration Games
- **BOOTH CRAWL: Highly Anticipated Releases** - Custom booth crawl list
- **Shards of Infinity: Learn to Play** - Demo event
- **Nature Arctic Tundra Module** - Demo/tournament event
- **Lord of the Rings: Confrontation Tournament** - Tournament event
- **Introduction to Independent Publishing Workshop** - Workshop event

**Friday Events:**
- **BOOTH CRAWL: Weird & Wonderful Finds** - Custom booth crawl list
- **Brink Worker Placement Demo** - Demo event (SOLD OUT)
- **Slip It In Demo & Signing** - Demo/signing event
- **Galaxy Trucker Adventure with Vlaada Chvatil** - Designer event
- **Tend Tournament with IV Games** - Tournament event
- **Game Design Masterclass with Jamey Stegmaier** - Workshop event
- **Gloomhaven: Jaws of the Lion Campaign** - Campaign event
- **Ark Nova: Marine Worlds Expansion Preview** - Preview event
- **Tend Tournament with IV Games** (2nd session) - Tournament event
- **Betrayal at House on the Hill 3rd Edition** - Demo event
- **2025 U.S. National boop. Championship** - Tournament event
- **Restoration Games HQ** - Booth visit (updated to booth)
- **Change My Mind Live Show** - Live show event

**Saturday Events:**
- **BOOTH CRAWL: Publisher Innovation Focus** - Custom booth crawl list
- **Lightning Train - Gen Con Premiere!** - Demo event (SOLD OUT)
- **Kickstarter Spotlight Seminar** - Seminar event
- **GenCon First Exposure: Race to Kepler** (both sessions) - Playtest events
- **Tend Tournament Final** - Tournament final
- **Costume Contest & Parade** - Contest event
- **🎉 Cardhalla Destruction for Charity** - Charity event

**Sunday Events:**
- **BOOTH CRAWL: Final Deals & Networking** - Custom booth crawl list
- **Games Library Final Session** - Library access
- **Exhibit Hall Final Sale Frenzy** - Shopping event
- **Charity Auction Preview** - Auction event
- **Final Designer Signings** - Signing event
- **Farewell Tournament: King of Tokyo** - Tournament event
- **Industry Networking & Farewells** - Networking event

### Research Notes:
- Used https://gencon.eventdb.us/ for event searches
- Restoration Games appears to be doing booth demos rather than scheduled events
- Many Reiner Knizia events found in the 298000 series event IDs
- Brass: Birmingham has multiple events including training sessions and tournaments
- Many events appear to be custom booth crawls or special activities rather than official Gen Con events
- Some events may be workshops, seminars, or special presentations that might not have traditional event IDs
- Tournament events and designer meet & greets often have specific event IDs
