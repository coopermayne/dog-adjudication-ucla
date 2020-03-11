namespace :audio do
  desc "TODO"
  task transcribe: :environment do
    require 'aws-sdk-transcribeservice'
    region_name = 'us-west-2'
    secret_access_key = Rails.application.credentials.aws[:secret_access_key]
    access_key_id = Rails.application.credentials.aws[:access_key_id]
    credentials = Aws::Credentials.new(access_key_id, secret_access_key)

    client = Aws::TranscribeService::Client.new( region: region_name, credentials: credentials)

    Event.all.each do |event|

      if event.transcript_status.nil?
        #transcript hasn't been sent so send it now

        #resp = client.get_transcription_job({ transcription_job_name: "test"})
        file_name = event.recording.blob.key
        s3_location = "s3://dog-adjudication/#{file_name}"


        resp = client.start_transcription_job({
          transcription_job_name: "gen-#{Time.now.to_i}-#{event.title}",
          language_code: "en-US",
          #media_sample_rate_hertz: 1,
          #media_format: "mp3", # accepts mp3, mp4, wav, flac
          media: { # required
            media_file_uri: s3_location,
          },
          #output_bucket_name: "OutputBucketName",
          #output_encryption_kms_key_id: "KMSKeyId",
          #settings: {
          #vocabulary_name: "VocabularyName",
          #show_speaker_labels: false,
          #max_speaker_labels: 1,
          #channel_identification: false,
          #show_alternatives: false,
          #max_alternatives: 1,
          #vocabulary_filter_name: "VocabularyFilterName",
          #vocabulary_filter_method: "remove", # accepts remove, mask
          #},
          #job_execution_settings: {
          #allow_deferred_execution: false,
          #data_access_role_arn: "DataAccessRoleArn",
          #},
          #content_redaction: {
          #redaction_type: "PII", # required, accepts PII
          #redaction_output: "redacted", # required, accepts redacted, redacted_and_unredacted
          #},
        })

        event.transcript_status = resp.transcription_job.transcription_job_status
        event.save

      elsif event.transcript_status == "IN_PROGRESS"
        #check if done and update db
      elsif event.transcript_status == "COMPLETED"
        #in this case you should already be done...
      end
    end
  end
end
