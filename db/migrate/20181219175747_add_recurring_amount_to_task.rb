class AddRecurringAmountToTask < ActiveRecord::Migration[5.2]
  def change
  	add_column :tasks, :recurring_amount, :string
  end
end
