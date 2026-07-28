name: Deploy PDF renderer + Cloud Functions

on:
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Authenticate to Google Cloud
        uses: google-github-actions/auth@v1
        with:
          credentials_json: ${{ secrets.GCP_SA_KEY }}

      - name: Setup gcloud
        uses: google-github-actions/setup-gcloud@v1
        with:
          project_id: ${{ secrets.GCP_PROJECT_ID }}
          service_account_key: ${{ secrets.GCP_SA_KEY }}

      - name: Configure Docker credentials for gcr
        run: |
          echo "Configuring Docker for gcr..."
          gcloud auth configure-docker --quiet

      - name: Build and push Cloud Run image (pdf-renderer)
        working-directory: cloud-run/pdf-renderer
        run: |
          npm ci
          PROJECT_ID=${{ secrets.GCP_PROJECT_ID }}
          IMAGE=gcr.io/${PROJECT_ID}/pdf-renderer
          gcloud builds submit --tag ${IMAGE}

      - name: Deploy Cloud Run service
        run: |
          PROJECT_ID=${{ secrets.GCP_PROJECT_ID }}
          REGION=${{ secrets.GCP_REGION }}
          IMAGE=gcr.io/${PROJECT_ID}/pdf-renderer
          gcloud run deploy pdf-renderer \
            --image ${IMAGE} \
            --platform managed \
            --region ${REGION} \
            --allow-unauthenticated \
            --set-env-vars PDF_BUCKET=${{ secrets.PDF_BUCKET }}

      - name: Get Cloud Run URL
        id: get-url
        run: |
          REGION=${{ secrets.GCP_REGION }}
          URL=$(gcloud run services describe pdf-renderer --platform managed --region ${REGION} --format="value(status.url)")
          echo "renderer_url=${URL}" >> $GITHUB_OUTPUT

      - name: Deploy Cloud Functions
        working-directory: functions
        env:
          GOOGLE_APPLICATION_CREDENTIALS: ${{ runner.temp }}/gcloud-key.json
        run: |
          echo "${{ secrets.GCP_SA_KEY }}" > $GOOGLE_APPLICATION_CREDENTIALS
          npm ci
          npm run build || true
          npm install -g firebase-tools
          gcloud auth activate-service-account --key-file=$GOOGLE_APPLICATION_CREDENTIALS
          # Try to use FIREBASE_TOKEN if set otherwise use ADC
          if [ -n "${{ secrets.FIREBASE_TOKEN }}" ]; then
            firebase deploy --only functions --project ${{ secrets.GCP_PROJECT_ID }} --token "${{ secrets.FIREBASE_TOKEN }}"
          else
            firebase deploy --only functions --project ${{ secrets.GCP_PROJECT_ID }}
          fi

      - name: Set functions config for renderer URL
        working-directory: functions
        run: |
          RENDERER_URL=${{ steps.get-url.outputs.renderer_url }}
          if [ -z "$RENDERER_URL" ]; then echo "No renderer URL found"; exit 1; fi
          firebase functions:config:set renderer.url="$RENDERER_URL" --project ${{ secrets.GCP_PROJECT_ID }}

      - name: Final status
        run: |
          echo "Deployment complete. Cloud Run renderer: ${{ steps.get-url.outputs.renderer_url }}"
