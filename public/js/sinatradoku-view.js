/*
 * Displays the Sudoku Board
 */

(function($) {
  $.fn.sinatradokuView = function(){

    // Canvas'
    var canvas_size     = 500;
    var board           = null;
    var grid            = null;
    var selected        = null;

    // Drawing

    var SIZE            = 9;
    var boardContext    = null;
    var gridContext     = null;
    var selectedContext = null;
    var overContext     = null;
    var selectGrad      = null;
    var overGrad        = null;

    var empty           = {"row": -1, "col": -1, "box": -1}
    var cell            = empty;
    var board_size      = 0;
    var cell_size       = 0;
    var pad             = 20;
    var selectedCell    = {"row": 0,  "col": 0 }
    var overCell        = {"row": -1, "col": -1 }


    var knownCells = [];


    function setSelectedCell(cell){
      selectedCell = cell;
      drawBox(selectedContext,selectedCell,selectGrad);
    };

    function setOverCell(cell){
        overCell = cell;
        drawBox(overContext,overCell,overGrad);
    }
    function setCellValues(assigned){
      knownCells = assigned;
      drawBoard();
    };



    function drawBoard(){
      board.width = board.width; //funny way to clear
      boardContext.font = cell_size+'px Arial, sans-serif';
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
    function drawBox(context,cell,color){
      context.clearRect(0,0,board_size,board_size);
      if(cell.col != -1 && cell.row != -1){
        var padding =2;
        var xpad = 0, ypad =0,x0=0, y0=0;
        if ((cell.col + 1)%3 == 0){ xpad = padding; }
        if ((cell.row + 1)%3 == 0){ ypad = padding; } 
        if (cell.col%3 == 0){ x0 = padding;xpad = padding;}
        if (cell.row%3 == 0){ y0 = padding;ypad = padding;}

        context.save(); 
        context.fillStyle = color;
        context.translate(cell.col*cell_size+x0,cell.row*cell_size+y0);


        context.fillRect(0,0,cell_size-xpad, cell_size-ypad);
        context.restore();
      }


    };


    //get rid of the unsupported message
    $("p.unsupported").remove();
    //create cavas' add to dom, set context
    over     = document.createElement("canvas");
    selected = document.createElement("canvas");
    grid     = document.createElement("canvas");
    board    = document.createElement("canvas");

    over.id     = 'over';
    selected.id = 'select';
    grid.id     = 'grid';
    board.id    = 'board';

    this.append(over);
    this.append(selected);
    this.append(board);
    this.append(grid);

    overContext     = over.getContext('2d');
    selectedContext = selected.getContext('2d');
    boardContext    = board.getContext('2d');
    gridContext     = grid.getContext('2d');

    over.width     = over.height     = canvas_size;
    selected.width = selected.height = canvas_size;
    board.width    = board.height    = canvas_size;
    grid.width     = grid.height     = canvas_size;

    board_size = canvas_size;
    cell_size = board_size/SIZE;

    selectGrad = selectedContext.createLinearGradient(0,0,cell_size,cell_size);
    selectGrad.addColorStop(0, 'rgba(0,173,238,1)');  
    selectGrad.addColorStop(1, 'rgba(0,120,165,1)');  
    //selectGrad.addColorStop(0, '#00adee');  
    //  selectGrad.addColorStop(1, '#0078a5');

    overGrad = selectedContext.createLinearGradient(0,0,cell_size,cell_size);
    overGrad.addColorStop(0, 'rgba(0,173,238,0.2)');  
    overGrad.addColorStop(1, 'rgba(0,120,165,0.5)');  

    drawBoard();
    drawGrid();
    drawBox(selectedContext,selectedCell,selectGrad);

    $('#board').after('<div class="toolbar"></div>');
    $('.toolbar').append('<button id=solver>Solve</button>');
    $('.toolbar').append('<button id=clearer>Clear</button>');

    /* 
     * Return refs to public methods
     */
    return {
      "setSelectedCell": setSelectedCell,
        "setOverCell": setOverCell,
        "setCellValues": setCellValues,
        "size":SIZE,
        "canvas_size":canvas_size

    };
  }
})(jQuery);
