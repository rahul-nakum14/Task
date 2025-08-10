Create Action Item:

```
curl --location '{{localhost:port}}/api/action-items' \
--header 'Content-Type: application/json' \
--header 'Cookie: <Your Cookie>' \
--data '{
  "UserID": "user1",
  "State": "New",
  "TargetDate": "2025-12-31",
  "IncludeDealer": true,
  "DealerIDs": ["dealer1", "dealer2"],
  "Description": "Complete monthly sales report",
  "KPIIDs": ["kpi1", "kpi2"],
  "Comment": "Urgent task",
  "CreatedBy": "admin"
}
'
```

Update Action Item:

```
curl --location --request PUT '{{localhost:port}}/api/action-items/<action-id>' \
--header 'Content-Type: application/json' \
--header 'Cookie: <Your Cookie>' \
--data '{
  "UserID": "user2",
  "State": "In Progress",
  "TargetDate": "2026-01-15",
  "IncludeDealer": true,
  "DealerIDs": ["dealer3"],
  "Description": "Update sales forecast",
  "KPIIDs": ["kpi3"],
  "Comment": "Reassigned to new user",
  "UpdatedBy": "admin"
}
'
```

Get Action Item:

```
curl --location '{{localhost:port}}/api/action-items/<action-id>' \
--header 'Cookie: <Your Cookie>'
```

List Action Item:

```
curl --location '{{localhost:port}}/api/action-items?page=1&limit=5' \
--header 'Cookie: <Your Cookie>'
```

## How To run:

```
1 ) npm i
2 ) npm run dev

will start the server at defined port
```
.env.example

```
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.evl26.mongodb.net/?retryWrites=true&w=majority
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_password_or_app_password
PORT=5000
```
