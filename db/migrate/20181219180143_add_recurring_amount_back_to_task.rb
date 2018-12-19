class AddRecurringAmountBackToTask < ActiveRecord::Migration[5.2]
  def change
  	add_column :tasks, :recurring_amount, :integer
  end
end
