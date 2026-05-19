4. Architectural Explanations
How Tables Interact (The Flow)
Reporting: A Citizen (users) reports an issue. A row is created in complaints and images are saved to complaint_media.

AI Processing: The backend runs AI tasks, updating the complaints table with an ai_priority_score and checking if it matches an existing issue (updating duplicate_of_id).

Tracking: Other citizens can like the issue, inserting rows into complaint_upvotes (which increments the upvote_count on the main table via a database trigger).

Dispatch: An Admin (users) assigns a Field Worker (users). A row goes into worker_assignments.

Resolution: The worker finishes the job. A row is added to complaint_status_history, the complaints.status changes to 'resolved', and a notifications row is generated for the citizen.

How AI Features are Supported
AI Duplicate Detection: The duplicate_of_id column allows you to group duplicate complaints together. The AI will query existing complaints, and if a 95% similarity match is found, it links the new complaint to the original one instead of cluttering the worker's queue.

AI Auto-Categorization & Priority: The ai_metadata (JSONB) column acts as a flexible bucket. Your AI can dump extracted keywords, sentiment analysis (e.g., {"sentiment": "angry", "keywords": ["pipe", "water", "flooding"]}), and an ai_priority_score (0-100 scale).

AI Worker Dispatch (Future): The last_known_location in the users table combined with PostGIS allows the AI to calculate the exact distance between an incoming complaint and the nearest available field worker.

Soft Delete Strategy
Notice the deleted_at column on core tables. We never actually DELETE data.
If an admin deletes a user or a spam complaint, we simply set deleted_at = NOW(). This ensures database integrity (foreign keys don't break) and allows data recovery, while our Partial Indexes ensure that deleted rows don't slow down everyday queries.