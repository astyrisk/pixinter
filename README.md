## Description
Pixinter offers basic tools for pixel painting.

## Try it!
visit [Pixinter](https://pixinter.vercel.app/), To run the application quickly or

## Run it on locally

- Clone the application ... 
```bash
git clone https://github.com/Marguesto/Pixinter.git
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
### UI/UX Enhancements
- [x] Redesign buttons with a pixelated style.
- [x] Fix button hover effects.
- [x] Center the canvas on the page using absolute positioning.
- [x] Implement drag-and-drop for drawing shapes instead of two-click.
- [x] shapes all in one button

### New Features
- [ ] Add multiple canvas size options (e.g., small, medium, large).
- [ ] Provide an option for a grid overlay on the canvas.
- [x] Implement a "redo" function.

### Bug Fixes
- [x] Fix the "undo" functionality.
- [x] the circle draw ignores few pixels on the right and below
- [ ] handle drawing outside of the canvas (draw rest of the shape)
- [ ] pixels get conflicted after a while of drawing the circle has a hole in the middle when using undo/redo. the undo/redo is not working properly.
- [ ] The delete button should use the background color, not white.
- [ ] fix the weird behavior of these things



