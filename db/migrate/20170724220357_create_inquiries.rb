class CreateInquiries < ActiveRecord::Migration
  def change
    create_table :inquiries do |t|
      t.text :question
      t.belongs_to :thing, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
