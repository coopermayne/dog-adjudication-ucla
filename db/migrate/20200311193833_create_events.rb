class CreateEvents < ActiveRecord::Migration[6.0]
  def change
    create_table :events do |t|
      t.string :case_id
      t.string :title
      t.text :transcript

      t.timestamps
    end
  end
end
