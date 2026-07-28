# PDF renderer for Nikah certificates (Cloud Run)

This is a small Express service that accepts a POST { html, nikahCode } and returns a PDF or uploads it to a GCS bucket.

How to deploy to Cloud Run
1. Build Docker image locally or with Cloud Build:
   gcloud builds submit --tag gcr.io/PROJECT_ID/pdf-renderer
2. Deploy to Cloud Run:
   gcloud run deploy pdf-renderer --image gcr.io/PROJECT_ID/pdf-renderer --platform managed --region us-central1 --allow-unauthenticated --set-env-vars PDF_BUCKET=your-bucket-name

Notes
- The service uses Puppeteer and requires the headless Chrome runtime. Cloud Run supports this runtime in the Node 16+ images.
- For production, use IAM to restrict who can call the renderer (Cloud Function will call it). Use service-to-service authentication.
- Ensure the Cloud Run service account has permission to write to the specified GCS bucket.
