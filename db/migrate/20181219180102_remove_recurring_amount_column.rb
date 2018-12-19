class RemoveRecurringAmountColumn < ActiveRecord::Migration[5.2]
  def change
  	remove_column :tasks, :recurring_amount
  end
end
