// Desenhar textos com unicode e depois rotatcionar?

const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math');
//2
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');

random.setSeed(random.getRandomSeed());
console.log(random.getSeed());

const settings = {

  dimensions: [ 2048, 2048 ]

};

const sketch = () => {

  //10 randomly set a number of colors between 1 and 5 (second argument is exclusive)
  const colorCount = random.rangeFloor(1, 6);
  //9 randomly picks a palette //10 slices to only get colorCount colors out of the 5
  //11 shuffles before picking
  /* commenting out the random palettes
  palette = random.shuffle(random.pick(palettes))
    .slice(0, colorCount);

  console.log(palette);
  */
 //const syms = ['↖', '↗', '↘', '↙'];
 //const syms = ['┌', '┐', '└', '┘', '├', '┬', '┼', '┴', '┤', '─', '│'];
 const syms = ['M'];

 const palette = [
    '#223C20',
    '#4C8D26',
    '#D5FB00',
    '#DE60CA',
    '#882380',
    'black'
]
 //['#8931EF', '#F2CA19', '#FF00BD', '#0057E9', '#87E911', '#E11845'];
 /*[
    "#542437",
    "#d95b43",
    "#53777a",
    "#ecd078",
    "#c02942"
  ] ;*/


  
 //['#95cfb7', '#fff7bd', '#f04155', '#ff823a'];

  /* nice ones
  [
    "#542437",
    "#d95b43",
    "#53777a",
    "#ecd078",
    "#c02942"
  ] 

  ['#005f6b', '#008c9e', '#00dffc', '#00b4cc']

  ['#95cfb7', '#fff7bd', '#f04155', '#ff823a']
  */

  // local state
  const createGrid = () => {

    const points = [];
    const count = 80;

    for (let x = 0; x < count; x++) {

      for (let y = 0; y < count; y++) {

        const u = count <= 1 ? 0.5 : x / (count-1); // using count-1 instead of count makes u go from 0 to 1
        const v = count <= 1 ? 0.5 : y / (count-1);
        //12 -- and need to avoid negative numbers
        const alpha = Math.abs(random.noise2D(u, v)) + 0.7;
        //const alpha = 1;
        //const radius = 0.12;
        const radius = Math.abs(random.noise2D(u, v))*0.1 + 0.11;
        // this radius is small, but it will get multiplied by the width later, so we need to multiply it by a small number first;

        //4
        points.push({

            //9 randomly picks a color from the palette
            color : random.pick(palette), 
            radius,
            sym : random.pick(syms),
            alpha,
            //12 radius : Math.max(0, random.gaussian()) * 0.01, //6, //8
            //or:
            // radius : Math.abs(random.gaussian()) * 0.01

            //14 rotation
            rotation : random.noise2D(u, v),
            position : [u,v]

        });

      }

    }

    return points;

  }

  //3, //12 removed again
  //random.setSeed('tsa'); // the seed can be anything, basically
  //1, //3
  const points = createGrid().filter( () => random.value() > .3);

  const margin = Math.round(settings.dimensions[0] * 0.09);

  // the render function
  return ({ context, width, height }) => {

    context.fillStyle = 'white';
    //context.globalAlpha = 0.9;
    context.fillRect(0, 0, width, height);

    //4
    points.forEach( point => {

        // some heavy de-structuring here
        const {
            color,
            radius,
            position,
            sym,
            alpha,
            rotation //14

        } = point;

        const [u, v] = position;
        
        const x = lerp(margin, width-margin, u);
        // alternative to using another library:
        // const x = (width - 2*margin)*u + margin;
        const y = lerp(margin, height-margin, v);

        //13
        // context.beginPath();
        // context.arc(x, y, radius * width, 0, Math.PI * 2, false); //5, //6
        // //7
        // //context.lineStyle = 'black';
        // //context.lineWidth = 10;
        // //context.stroke();
        // context.fillStyle = color;
        // context.fill();

        context.globalAlpha = alpha;

        context.fillStyle = color;
        context.font = `${radius/2 * width}px "Courier New"`;

        context.save();
        context.translate(x, y)
        context.rotate(rotation)
        context.fillText(sym, 0, 0);
        context.restore();



    })

  };
};

canvasSketch(sketch, settings);
