json.extract! inquiry, :id, :creator_id, :thing_id, :question, :created_at, :updated_at
json.url inquiry_url(inquiry, format: :json)
json.user_roles inquiry.user_roles unless inquiry.user_roles.empty?