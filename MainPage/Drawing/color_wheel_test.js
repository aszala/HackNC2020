function newEl(tag){return document.createElement(tag)}

window.addEventListener('load', onDocLoaded, false);
function onDocLoaded(evt)
{
	var strip = makeCanvas();
	strip.addEventListener('mousemove', pick);
	document.body.appendChild( strip );

	var wheel = makeWheel(100);
	wheel.addEventListener('mousemove', pick);
	document.body.appendChild( wheel );
}


var hsv2rgb = function(hsv) {
  var h = hsv.hue, s = hsv.sat, v = hsv.val;
  var rgb, i, data = [];
  if (s === 0) {
    rgb = [v,v,v];
  } else {
    h = h / 60;
    i = Math.floor(h);
    data = [v*(1-s), v*(1-s*(h-i)), v*(1-s*(1-(h-i)))];
    switch(i) {
      case 0:
        rgb = [v, data[2], data[0]];
        break;
      case 1:
        rgb = [data[1], v, data[0]];
        break;
      case 2:
        rgb = [data[0], v, data[2]];
        break;
      case 3:
        rgb = [data[0], data[1], v];
        break;
      case 4:
        rgb = [data[2], data[0], v];
        break;
      default:
        rgb = [v, data[0], data[1]];
        break;
    }
  }
  return rgb;
};

function clamp(min, max, val)
{
	if (val < min) return min;
	if (val > max) return max;
	return val;
}

function makeCanvas()
{
	var can, ctx;
	can = newEl('canvas');
	ctx = can.getContext('2d');
	can.width = 360;
	can.height = 100;
	var span = newEl('span');
	
	// var imgData = ctx.getImageData(0,0,360,100);
	// var xPos, yPos, index;
	// var height=imgData.height, width=imgData.width;
	
	
	// for (yPos=0; yPos<height; yPos++)
	// {
	// 	for (xPos=0; xPos<width; xPos++)
	// 	{
	// 		// this is the point at which the S & V values reach
    //         // the peaks or start to change. 2 means height/2
    //         // so a divisor of 3 would mean the 'break-points'
    //         // were at the 1/3 and 2/3 positions
    //         // while a divisor of 4 would imply 1/4 and 3/4
    //         //
    //         // Have a look at the generated images using the eye- 
    //         // dropper tool of an image program (Gimp, Photoshop,
    //         // etc) that allows you to choose the HSV colour
    //         // model, to get a better idea of what I'm saying
    //         // here.
    //         var divisor = 2;

	// 		var hue = xPos;
	// 		var sat = clamp(0, 1, yPos / (height/divisor) );
	// 		var val = clamp(0, 1, (height-yPos) / (height/divisor) );
	// 		var rgb = hsv2rgb( {hue:hue, sat:sat, val:val} );
			
	// 		index = 4 * (xPos + yPos*360);
			
    //         imgData.data[ index + 0 ] = rgb[0] * 255;	// r
	// 		imgData.data[ index + 1 ] = rgb[1] * 255;	// g
	// 		imgData.data[ index + 2 ] = rgb[2] * 255;	// b
	// 		imgData.data[ index + 3 ] = 255;	// a
	// 	}
	// }
	// ctx.putImageData(imgData, 0, 0);
	return can;
}

// see the comment in the above function about the divisor. I've
// hard-coded it here, to 2
// diameter/2 corresponds to the max-height of a strip image
function makeWheel(diameter)
{
	var can = newEl('canvas');
	var ctx = can.getContext('2d');
	can.width = diameter;
	can.height = diameter;
	var imgData = ctx.getImageData(0,0,diameter,diameter);
	var maxRange = diameter / 2;
	
	for (var y=0; y<diameter; y++)
	{
		for (var x=0; x<diameter; x++)
		{
			var xPos = x - (diameter/2);
			var yPos = (diameter-y) - (diameter/2);
			
			
			var polar = pos2polar( {x:xPos, y:yPos} );
			var sat = clamp(0,1,polar.len / ((maxRange/2)));
			var val = clamp(0,1, (maxRange-polar.len) / (maxRange/2) );
			
			var rgb = hsv2rgb( {hue:polar.ang, sat:sat, val:val} );
			
			var index = 4 * (x + y*diameter);
			imgData.data[index + 0] = rgb[0]*255;
			imgData.data[index + 1] = rgb[1]*255;
			imgData.data[index + 2] = rgb[2]*255;
			imgData.data[index + 3] = 255;
		}
	}
	ctx.putImageData(imgData, 0,0);
	return can;
}

function deg2rad(deg)
{
	return (deg / 360) * ( 2 * Math.PI );
}
function rad2deg(rad)
{
	return (rad / (Math.PI * 2)) * 360;
}

function pos2polar(inPos)
{
	var vecLen = Math.sqrt( inPos.x*inPos.x + inPos.y*inPos.y );
	var something = Math.atan2(inPos.y,inPos.x);
	while (something < 0)
		something += 2*Math.PI;
		
	return { ang: rad2deg(something), len: vecLen };
}



function pick(event) 
{
	var can = this;
	var ctx = can.getContext('2d');
	var color = document.getElementById('color');
	
  var x = event.layerX;
  var y = event.layerY;
  var pixel = ctx.getImageData(x, y, 1, 1);
  var data = pixel.data;
  var rgba = 'rgba(' + data[0] + ',' + data[1] +
             ',' + data[2] + ',' + (data[3] / 255) + ')';
  color.style.background =  rgba;
  color.textContent = rgba;
}