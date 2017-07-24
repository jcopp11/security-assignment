json.extract! inquiry, :id, :question, :thing_id, :created_at, :updated_at
json.url inquiry_url(inquiry, format: :json)