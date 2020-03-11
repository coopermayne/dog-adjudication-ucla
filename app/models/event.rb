class Event < ApplicationRecord
  has_one_attached :recording

  after_commit :get_transcription

  private
  def get_transcription
  end
end
