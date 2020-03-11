class AddTranscriptionJobNameToEvents < ActiveRecord::Migration[6.0]
  def change
    add_column :events, :transcription_job_name, :string
  end
end
