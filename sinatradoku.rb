require 'rubygems' if RUBY_VERSION < "1.9"
require 'sinatra/base'
require 'json'
require 'sudokuSolver'

class SudokuApp < Sinatra::Base
  before do
  @solver = SudokuSolver.new
  end
  configure do
    set :root, File.dirname(__FILE__)
  end


  get '/' do
        erb :index
  end
  get '/solve*' do
    if request.xhr? 
      puzzle = params[:puzzle]
      solution = @solver.solve(puzzle) || puzzle # returns original puzzle if it can't be solved
      {:solution => solution}.to_json
      


    end

  end

end

