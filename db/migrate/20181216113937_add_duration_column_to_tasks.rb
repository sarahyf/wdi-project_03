class AddDurationColumnToTasks < ActiveRecord::Migration[5.2]
  def change
    add_column :tasks, :duration, :string, default: "0"
  end
end
