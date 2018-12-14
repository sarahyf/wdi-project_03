class CreateProjects < ActiveRecord::Migration[5.2]
  def change
    create_table :projects do |t|
      t.string :name, default: "No Project"

      t.timestamps
    end
  end
end
