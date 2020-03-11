class AddTranscriptStatusToEvents < ActiveRecord::Migration[6.0]
  def change
    add_column :events, :transcript_status, :string
  end
end
