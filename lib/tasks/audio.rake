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

        file_name = event.recording.blob.key
        s3_location = "s3://dog-adjudication/#{file_name}"
        transcription_job_name = "#{Time.now.to_i}-#{event.id}"

        resp = client.start_transcription_job({
          transcription_job_name: transcription_job_name,
          language_code: "en-US",
          media: { # required
            media_file_uri: s3_location,
          },
        })

        #save important info
        event.transcript_status = resp.transcription_job.transcription_job_status
        event.transcription_job_name = transcription_job_name
        event.save

      elsif event.transcript_status == "IN_PROGRESS"
        puts 'go'*80

        resp = client.get_transcription_job({
          transcription_job_name: event.transcription_job_name
        })

        event.transcript_status = resp.transcription_job.transcription_job_status

        if event.transcript_status == "COMPLETED"
          json_url = resp.transcription_job.transcript.transcript_file_uri
          response = JSON.parse(HTTParty.get(json_url).body)
          
          #format the transcript
          j = response['results']['items']
          
          res = "<p>"
          last_start_time = "0"
          last_end_time = "0"

          j.each_with_index do |word, index|
            word['start_time'] = word['start_time'] || last_start_time
            word['end_time'] = word['end_time'] || last_end_time
            

            if word['start_time'].to_f - last_end_time.to_f > 1.5
              puts word['start_time'].to_f - j[index-1]['end_time'].to_f
              res += "</p><br data-start=#{word['start_time']} data-end= #{word['end_time']} \><p>"
            end

            wordx = word['alternatives'].first['content']

            res += "<span data-start=#{word['start_time']} data-end= #{word['end_time']}>#{wordx}</span>"
            
            if index<j.length-2 && !['.','?',','].include?(j[index+1]['alternatives'].first['content'])
              res += "<span data-start=#{word['start_time']} data-end= #{word['end_time']}> </span>"
            end

            last_start_time = word['start_time']
            last_end_time = word['end_time']
          end
          res += "</p>"

          event.transcript = res
          event.save
        end

        #check if done and update db
      elsif event.transcript_status == "COMPLETED"
        #in this case you should already be done...
      end
    end
  end
end
