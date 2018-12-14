class ProjectsController < ApplicationController
  skip_before_action :verify_authenticity_token

  def index
  end

  def show
  end

  def new
  end

  def create
    if (params["name"] != "")
      project = Project.create(name: params["name"], user_id: current_user.id)
    else
      project = Project.create(user_id: current_user.id)
    end
    render json: project
  end

  def edit
  end
end
