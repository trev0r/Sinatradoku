/*
 * Displays the Sudoku Board
 */

(function($) {
 $.fn.sinatradokuView = function(){

 // Canvas'
 var canvas_size = 500;
 var board           = null;
 var grid            = null;
 var selected        = null;

 // Drawing
 var SIZE            = 9;
 var boardContext    = null;
 var gridContext     = null;
 var selectedContext = null;
 var empty           = {"row": -1, "col": -1, "box": -1}
 var cell            = empty;
 var board_size      = 0;
 var cell_size       = 0;
 var pad             = 20;
 var selectedCell    = {"row": 0, "col": 0 }

 var knownCells = [];

 var touchgrad = null;

 function setSelectedCell(cell){
   selectedCell = cell;
   drawSelected();
 };

 function setCellValues(assigned){
   knownCells = assigned;
   drawBoard();
 };
 


 function drawBoard(){
   board.width = board.width; //funny way to clear
   boardContext.font = cell_size+'px Unknown Font, sans-serif';
   for(i=0;i<knownCells.length;i++){
     if(knownCells[i] != "."){
       row = Math.floor(i/9);
       col = i%9;
       boardContext.fillText(knownCells[i],cell_size/4+col*cell_size,cell_size*5/6+row*cell_size); 
       //these ratios just seem to work
     }
   }
 };


 function drawGrid(){

   gridContext.strokeStyle = "#000000";
   gridContext.lineCap = "butt";
   gridContext.lineJoin = "miter";

   //square lines
   gridContext.save();
   gridContext.lineWidth = 1;
   gridContext.beginPath();
   for(i = 1; i < SIZE; i++){
     gridContext.moveTo(i*cell_size,0);
     gridContext.lineTo(i*cell_size,board_size);
     gridContext.moveTo(0,i*cell_size);
     gridContext.lineTo(board_size,i*cell_size);
   }
   gridContext.closePath();
   gridContext.stroke();
   //box lines 
   gridContext.lineWidth = 4;
   gridContext.beginPath();
   for(i = 0; i <= SIZE; i+=3){
     gridContext.moveTo(i*cell_size,0);
     gridContext.lineTo(i*cell_size,board_size);
     gridContext.moveTo(0,i*cell_size);
     gridContext.lineTo(board_size,i*cell_size);
   }

   gridContext.closePath();
   gridContext.stroke();
   gridContext.restore();


 };
 function drawSelected(){
   var padding =2;
   var xpad = 0, ypad =0,x0=0, y0=0;
   if ((selectedCell.col + 1)%3 == 0){ xpad = padding; }
   if ((selectedCell.row + 1)%3 == 0){ ypad = padding; } 
   if (selectedCell.col%3 == 0){ x0 = padding;xpad = padding;}
   if (selectedCell.row%3 == 0){ y0 = padding;ypad = padding;}

   selectedContext.clearRect(0,0,board_size,board_size);
   selectedContext.save(); 
   selectedContext.fillStyle = touchGrad;
   selectedContext.translate(selectedCell.col*cell_size+x0,selectedCell.row*cell_size+y0);


   selectedContext.fillRect(0,0,cell_size-xpad, cell_size-ypad);
   selectedContext.restore();
 };


 function drawAll(){
   board.width    = board.height    = canvas_size;
   grid.width     = grid.height     = canvas_size;
   selected.width = selected.height = canvas_size;

   board_size = canvas_size;
   cell_size = board_size/SIZE;
   //makes the gradient for the selected box
   touchGrad = boardContext.createLinearGradient(0,0,0,cell_size);
   touchGrad.addColorStop(0, "rgba(82,136,135,0.2)"); //should extract 
   touchGrad.addColorStop(1, "rgba(82,136,135,0.7)");

   drawSelected(); 
   drawGrid();
   drawBoard();
 }
 //get rid of the unsupported message
 $("p.unsupported").remove();
 //create cavas' add to dom, set context
 board    = document.createElement("canvas");
 grid     = document.createElement("canvas");
 selected = document.createElement("canvas");

 this.append(board);
 this.append(grid);
 this.append(selected);

 boardContext    = board.getContext('2d');
 gridContext     = grid.getContext('2d');
 selectedContext = selected.getContext('2d');

 drawAll();
 $('#body').append('<div class="toolbar"></div>');
 $('.toolbar').append('<button class="green" id=solver>Solve</button>');
 $('.toolbar').append('<button class="red" id=clearer>Clear</button>');

 /* 
  * Return refs to public methods
  */
 return {
     "setSelectedCell": setSelectedCell,
     "setCellValues": setCellValues 
 };
 }
})(jQuery);
