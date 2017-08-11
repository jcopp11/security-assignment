json.extract! inquiry, :id, :creator_id, :thing_id, :created_at, :updated_at
json.url inquiry_url(inquiry, format: :json)