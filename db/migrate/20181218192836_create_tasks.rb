class CreateTasks < ActiveRecord::Migration[5.2]
  def change
    create_table :tasks do |t|
      t.string :title
      t.datetime :due_by
      t.integer :user_id
      t.integer :assigned_to_id
      t.integer :category_id
      t.boolean :recurring
      t.text :notes

      t.timestamps
    end
  end
end
