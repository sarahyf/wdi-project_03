class TasksController < ApplicationController
  skip_before_action :verify_authenticity_token

  def index
  end

  def show
  end

  def new
  end

  def create
    @task = Task.create(name: params["name"], start_time: params["start_time"], end_time: params["end_time"], project_id: params["project_id"])
    duration = Task.calculate_duration(@task)
    @task.update(duration: duration)
    render json: task
  end

  def edit
  end
end
