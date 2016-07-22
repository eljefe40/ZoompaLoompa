
console.log("starting........................................");


//console.log($(".gridbox").getAttribute("data-scale")) || .1) + event.dx);
///var scale = .2;

  //----------------------------------------------  ----------------------------------------------------------  
interact(".gridbox")
 
  //----------------------------------------------  ----------------------------------------------------------  
.draggable({
    onmove: function(event) {
      var scale = (parseFloat($('.gridbox').attr("data-scale")) || .2);

      //console.log("being dragged");

      var target = event.target;
      // keep the dragged position in the data-x/data-y attributes

      var x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
      var y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;
      //console.log("event dx/dy",event.dx,event.dy);



      // translate the element
      target.style.webkitTransform = target.style.transform = "scale(" + scale + ") translate(" + (x / scale) + "px, " + (y / scale) + "px)";

      //update the position attributes
      target.setAttribute("data-x", x);
      target.setAttribute("data-y", y);

      console.log("data-x&y are being saved", x, y);

    }
  })
   //----------------------------------------------  ----------------------------------------------------------   
.gesturable({
  onstart: function(event) {
    console.log("Gesture Starting");
  },
  

   //---------------------------------------------- gesture pinch scale  ----------------------------------------------------------   
onmove: function(event) {
  
   var scale = (parseFloat($('.gridbox').attr("data-scale")) || .2);
 //console.log("scale from data-scale",scale);

  var oldScale;
    var pinchScaler = 5;
    var pinchDelta = event.ds / pinchScaler;

    var scaleMin = .03;
    var target = event.target;

    oldScale = scale;

      if (scale >= scaleMin) {
        scale = scale + (pinchDelta);
        if (scale < scaleMin) {
          scale = scaleMin;
        }
      }


  //console.log(".........................................")
  // show the scale
  
  //console.log(event);
  
  //console.log("pre Scale-->", oldScale.toFixed(4),"new Scale -->",scale.toFixed(4));    
 
  
  // get the gridbox size
   var gridboxWidth = $(".gridbox").width().toFixed(1);
    var gridboxHeight = $(".gridbox").height().toFixed(1);
    //console.log("gridbox W/H", gridboxWidth, gridboxHeight);
  

  // get the left top of the container
   var containerLeft = $(".container").position().left;
    var containerTop = $(".container").position().top;
    //console.log("1. CONTAINER L/T to screen", containerLeft.toFixed(1), containerLeft.toFixed(1));
  
  // get the current left/top of the gridbox
  var gridboxLeft =  $(".gridbox").position().left;
  var gridboxTop =   $(".gridbox").position().top;
    //console.log("2. GRIDBOX L/T to container", gridboxLeft.toFixed(1), gridboxTop.toFixed(1));    
//console.log(" ");
  
    // get the pinch point on the screen
  var screenPinX=event.clientX;
  var screenPinY=event.clientY;
  //console.log("2A. screen pinch point", screenPinX.toFixed(1), screenPinY.toFixed(1));    
 
  var containerPinX=screenPinX-containerLeft
  var containerPinY=screenPinY-containerTop
  
  //console.log("3. Container Pin center point",containerPinX.toFixed(1),containerPinY.toFixed(1));
  
  // calc the point with respect to the gridbox
  var gridboxPinX=screenPinX-gridboxLeft-containerLeft;
  var gridboxPinY=screenPinY-gridboxTop-containerTop; 
 //console.log("4. Gridbox Pin point  ",gridboxPinX.toFixed(1),gridboxPinY.toFixed(1));
 

  // calc new gridbox point (relative to gridbox origin) as a result of scale change ratio of newScale to oldscale
  var newGridboxPinX=gridboxPinX * (scale/oldScale);
  var newGridboxPinY= gridboxPinY * (scale/oldScale);
  //console.log("5. Gridbox Pin point after scale",newGridboxPinX.toFixed(1),newGridboxPinY.toFixed(1));
  
  
  // the original container pin point minus the new pin offset (inside the gridbox)  
  var newGridboxLeft=containerPinX-newGridboxPinX;
  var newGridboxTop=containerPinY-newGridboxPinY;
  //console.log("6. Gridbox NEW T/L >>>>>>>>>>",newGridboxLeft.toFixed(1),newGridboxTop.toFixed(1));
 

  target.setAttribute("data-x", newGridboxLeft);
  target.setAttribute("data-y", newGridboxTop);
  target.setAttribute("data-scale", scale);
  

    // do it - to it
  $('.gridbox').css('transform', 'translate(' + newGridboxLeft + 'px,' + newGridboxTop + 'px) scale(' + scale + ')');


  
},
  
 
  //----------------------------------------------  ----------------------------------------------------------  
  
  
  onend: function(event) {
    //console.log("Gesture Ending");
  }
})


  //----------------------------------------------  ----------------------------------------------------------  
.on("mousewheel", function(event) {
  
  
 var scale = (parseFloat($('.gridbox').attr("data-scale")) || .2);
 //console.log("scale from data-scale",scale);
  
  
  
  var scaleMin = .03;
  var scaleMax =1.0;
  var wheelScaler = -20000; // negative to reverse the wheel direction
  var target = event.target;
  oldScale = scale;
  
  // console.log("the scalebefore "+scale);

      
  if ((scale >= scaleMin) && (scale <= scaleMax)) {
    scale = scale + (event.deltaY / wheelScaler);
    wheelDelta = event.deltaY / wheelScaler;
    console.log("the scale",scale);

    scale = (scale + wheelDelta);

    //console.log("wheelDelta", wheelDelta);

    // scale minimum clamp
    if (scale < scaleMin) {
      scale = scaleMin;
      console.log("- clamp");  
    }
    
    // scale max clamp
    if (scale > scaleMax) {
      scale = scaleMax;
    console.log("+ clamp");
    }
  }

  
  // old T/L position of the Gridbox with reference to T/L of background
  var gridboxTop = $(".gridbox").position().top;
  var gridboxLeft = $(".gridbox").position().left;
  //console.log("current gridbox left/top", gridboxLeft, gridboxTop);

  // old scaled offset of Pin from Top/Left of Gridbox
  var oldPinXScaled = event.offsetX * oldScale
  var oldPinYScaled = event.offsetY * oldScale
    //console.log("Pin point on gridbox before scale", oldPinXScaled, oldPinYScaled);


  // PIN location of background  
  var pinXonClient = gridboxLeft + oldPinXScaled;
  var pinYonClient = gridboxTop + oldPinYScaled;
  //console.log("PIN point on client before scale", pinXonClient, pinYonClient);

  // new scaled offset of PIN from top left of gridbox
  var pinXScaled = event.offsetX * scale
  var pinYScaled = event.offsetY * scale
    // current mouse pointer Local offset from gridbox origin - After scale
    //console.log("Pin point on gridbox after scale", pinXScaled, pinYScaled);

  // this is NEW calculated T/L of Gridbox on Background 
  var newGridboxLeft = pinXonClient - pinXScaled
  var newGridboxTop = pinYonClient - pinYScaled
    //console.log("new Gridbox Top/Left",newGridboxTop,newGridboxLeft);

  //update the position attributes
  target.setAttribute("data-x", newGridboxLeft);
  target.setAttribute("data-y", newGridboxTop);
  target.setAttribute("data-scale", scale);
  //console.log("data-x&y are being saved",newGridboxLeft,newGridboxTop);

  // do it - to it
  $('.gridbox').css('transform', 'translate(' + newGridboxLeft + 'px,' + newGridboxTop + 'px) scale(' + scale + ')');

})
  //----------------------------------------------  ----------------------------------------------------------  

  .on("doubletap", function(event) {
      console.log("Double Tapped");
 
  // sort of a reset of sorts ;)
  var scale=.1 

   $('.gridbox').css('transform', 'translate(' + 0 + 'px,' + 0 + 'px) scale(' + scale + ')');
  //update the position attributes
  $('.gridbox').attr("data-x", 0);
  $('.gridbox').attr("data-y", 0);
  $('.gridbox').attr("data-scale", scale);

  })
  .on("holdx", function(event) {

  
  
  
})

.on("move", function(event) {
  console.log("Moving");

});