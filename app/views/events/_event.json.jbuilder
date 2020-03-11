json.extract! event, :id, :case_id, :title, :transcript, :created_at, :updated_at
json.url event_url(event, format: :json)
