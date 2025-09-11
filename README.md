## Description
Pixinter offers basic tools for pixel painting.

## Try it!
visit [Pixinter](https://pixinter.vercel.app/), To run the application quickly or

## Run it on locally

- Clone the application ... 
```bash
git clone https://github.com/astyrisk/pixinter.git
```
- ...Install the dependencies...

```bash
cd Pixinter
npm install
```
- ...then start [Vite](https://vite.dev/):

```bash
npm run dev
```
Navigate to [localhost:5173](http://localhost:5173). You should see Pixinter running. 

## Development
### Properties panel
- [x] The properties panel should allow for modifying the selected line's stroke color, width, and style (solid, dashed, dotted).
- [x] stroke options? dotted and continuous , also normal line options? dotted and continuous
### Shapes
- [x] line
- [x] rectangle ( square: shift pressed)
- [x] ellipse (circle: shift pressed)
- [x] give options to draw broders on shapes. the options should appear on top?
- [x] shape icon should indicate that there is multiple options (a small cornered triangle)
### Eraser
- [x] right click on eraser would prompt a context menu with a slider to choose the size. maybe the slider should appear on top of canvas?
- [x] should actually remove the pixels not draw the background color.
### Canvas Cursor
### Layers
- [ ] basic implementation
### canvas
- [x] Provide an option for a grid overlay on the canvas.
- [x] option to clear all the canvas, and everything!
### Action
- [x] saving an image would save it in png format, removing the background color 
- [ ] load is not working
### undo/redo
- [x] undo not working for fill
- [ ] shape after pen bug
- [ ] fill redo draws a pixel of next shape
### Custom Color picker
### Bug Fixes
- [x] sometimes a small rectangle adjacent to a rectangle getting redrawn would appear - can't reproduce. this causes the rectangles to behave weridly. #can't reproduce

### Cursor



### [ ] Efficieny refactor!

## Notes 
1. FF and its forks enforce context menu for shift right click.  toggle the following to false on about:config to bypass it 
`dom.event.contextmenu.shift_suppresses_event`



Act as a senior performance engineer and systems architect. I need a comprehensive, prioritized action plan to optimize the following project for maximum efficiency and speed. Provide specific, actionable recommendations tailored to my technology stack and goals.

**1. Project Context:**
*   **Project Description:** [Describe the project's purpose, core functionality, and primary user workflows. What problem does it solve?]
*   **Current State:** [Is this a new project in the design phase, or an existing application in production? What is the current scale (e.g., users, data volume, requests per minute)?]

**2. Technology Stack:**
*   **Backend:** [Languages, frameworks, runtime (e.g., Python/Django, Node.js/Express, Go, Java/Spring)]
*   **Frontend:** [Frameworks, libraries (e.g., React, Vue, Angular, Svelte)]
*   **Database(s):** [Type of database(s) and why they were chosen (e.g., PostgreSQL, MySQL, MongoDB, Redis, Elasticsearch)]
*   **Infrastructure & Deployment:** [Cloud provider, services used, containerization, CI/CD setup (e.g., AWS EC2/Lambda, Docker, Kubernetes, Vercel)]

**3. Performance Goals & Metrics (Quantify "Efficient and Fast"):**
*   **Target Metrics:** [What specific metrics are you trying to improve? Be precise. Examples: Reduce P95 API latency from 500ms to <100ms; decrease web app's Largest Contentful Paint (LCP) to <2.5s; increase data processing throughput by 3x; reduce monthly cloud costs by 20%.]
*   **Primary Efficiency Driver:** [What is the most critical type of efficiency for this project? Choose one or rank them: 1. Latency/Response Time, 2. Throughput, 3. Computational Resource Usage (CPU/Memory), 4. Cost Efficiency, 5. Developer Velocity/Maintainability.]

**4. Known or Suspected Bottlenecks:**
*   [Describe any parts of the system that are already known to be slow or inefficient. Have you done any profiling or monitoring? If so, what did you find? (e.g., "The /analytics endpoint is slow due to complex database joins," "Our React app's initial bundle size is too large," "We see frequent CPU spikes on the database server.")]

Based on this information, generate a detailed optimization strategy. Your response should be structured to include:
*   **A Prioritized Action List:** Rank your recommendations from highest impact/lowest effort to lowest impact/highest effort.
*   **Architectural Recommendations:** High-level changes to the system design (e.g., caching strategies, queueing systems, microservice refactoring, database schema changes).
*   **Code-Level Optimizations:** Specific techniques for the backend, frontend, and database queries (e.g., algorithmic improvements, lazy loading, query indexing, connection pooling).
*   **Infrastructure & Tooling Suggestions:** Recommendations for configuration changes, new tools for profiling, monitoring, and load testing to validate improvements.
