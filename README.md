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
### Properties panel
- [ ] The properties panel should allow for modifying the selected line's stroke color, width, and style (solid, dashed, dotted).
### Shapes
- [x] line
- [x] rectangle ( square: shift pressed)
- [x] ellipse (circle: shift pressed)
- [ ] Triangle
- [x] give options to draw broders on shapes. the options should appear on top?
- [ ] stroke options? dotted and continuous , also normal line options? dotted and continuous
- [ ] shape icon should indicate that there is multiple options (a small cornered triangle)
### Eraser
- [ ] right click on eraser would prompt a context menu with a slider to choose the size. maybe the slider should appear on top of canvas?
- [ ] should use actually remove the pixels not draw the background color.
### Layers
- [ ] basic implementation
### canvas
- [ ] Provide an option for a grid overlay on the canvas.
- [ ] option to clear all the canvas, and everything!
- [ ] pixel size
### Action
- [ ] saving an image would save it in png format, removing the background color 
- [ ] load is not working
### undo/redo
- [x] undo not working for fill
- [ ] shape after pen bug
- [ ] fill redo draws a pixel of next shape
### Bug Fixes
- [ ] sometimes a small rectangle adjacent to a rectangle getting redrawn would appear - can't reproduce. this causes the rectangles to behave weridly. #can't reproduce


## Notes 
1. FF and its forks enforce context menu for shift, right click.  toggle the following to false on about:config to bypass it 
`dom.event.contextmenu.shift_suppresses_event`
