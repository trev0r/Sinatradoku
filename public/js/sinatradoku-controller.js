/**
 * Javascript Controller for the sudoku solver.
 * Handles creating view and passing keyboard controls
 * 
 */

$.sinatradokuBoard = function(v){
 
  var view = v;
  var currentCell = {
    "row": 0,
    "col": 0
  };
  var blank = "."
    view.setSelectedCell(currentCell);
  //  var assigned = [];
  //sample puzzle
  var assigned = [];
  resetPuzzle();



  $("#solver").click(function(event){
      solvePuzzle();
      });
  $("#clearer").click(function(event){
      resetPuzzle();
      });


  $(document).keydown( function(event){
      var key = event.keyCode;
      //Arrows
      key = vimshortcuts(key);

      if ( (key >= 37) && (key <= 40) ) {
      switch(key){
      case 37: 
      if(currentCell.col > 0){
      currentCell.col = currentCell.col - 1;} 
      break; //left
      case 38: 
      if(currentCell.row > 0){
      currentCell.row = currentCell.row - 1;} 
      break; //up
      case 39: 
      if(currentCell.col < 8){
      currentCell.col = currentCell.col + 1;} 
      break; //right 
      case 40: 
      if(currentCell.row < 8){
        currentCell.row = currentCell.row + 1;} 
      break; //down
      };

      view.setSelectedCell(currentCell);

      }
      //Entering digits
      if( (key >= 49) && (key <= 57)){
        assign(currentCell.row, currentCell.col, key-48);
      }
      // Press Enter
      if( key == 13){
        solvePuzzle();
      }
      //0 or backspace delete a value
      if (key == 8 || key == 48){ 
        assign(currentCell.row, currentCell.col, blank)
      }




  });
  function solvePuzzle(){
    data = { "puzzle" : assigned};
    $.getJSON("/solve", data, function(solved){
        assigned = solved.solution;
        view.setCellValues(assigned);
        });

  }
  function resetPuzzle(){
      for(i = 0; i < 81 ; i++){
        assigned[i]=blank; // . represents a null value. 
      }
      view.setCellValues(assigned);
  }

    /**
     * Maps: 
     * hjkl - left,down,up,right -can't live without it!  
     * d - delete 
     **/
    function vimshortcuts(keyval){
      switch (keyval){
        case 68: return 48;
        case 72: return 37;
        case 74: return 40;
        case 75: return 38;
        case 76: return 39;
        default: return keyval;
      }


    }

    function assign(row, col, digit){
      assigned[9*row+col] = digit;
      view.setCellValues(assigned);
    };
  }
