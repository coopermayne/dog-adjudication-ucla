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

{
    "TranscriptionJob": {
        "TranscriptionJobName": "1583972492-4",
        "TranscriptionJobStatus": "COMPLETED",
        "LanguageCode": "en-US",
        "MediaSampleRateHertz": 44100,
        "MediaFormat": "mp3",
        "Media": {
            "MediaFileUri": "s3://dog-adjudication/1oyl6mov6be8wupwike79zu4ax6y"
        },
        "Transcript": {
            "TranscriptFileUri": "https://s3.us-west-2.amazonaws.com/aws-transcribe-us-west-2-prod/397373041763/1583972492-4/651ec138-6607-4a41-b860-5f1a67931bc6/asrOutput.json?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJHMEUCICSEe3mj793EBLfskiYD0RfyjvwAWo3dYeXOiD%2BYhmifAiEA0c7GVVbzFFBbQuRxPyPT%2F0ui3HyQbLLK4eMS%2FmtQqtMqtAMIIhABGgwwODAyNDgzMjIyMDYiDD11QmvpCbgMGGf3GyqRAxwTdZbyF9iea2746Y%2BOQv5i%2BY9X007CbLD0t41rfhHnIDFasdVoHkmTeJfAjWmAIcmkQulr0Fn0Fvd4E%2F1U9DHmedhJHCYuoockgtf%2F2oTmc15LOW8bc%2F4J4c2qzykNzYrMabkhOdCvrG21uqHAfIl%2F9UmSqJvkiinzrEH5AUayriTp1srdBSz7b470cEL5VuE5xg%2BAwshRq2FC6gJDjUeYxFupL0wqcLEfzYMCnCzRjshCcme1mp628bzw6E8b%2FE3HQZO4m5vOikpXMdHQrpAgPliW6gIX8yF8Z3nW2KWlYS%2Bjta1IS%2BWMEvIo0L6pBmLapa40pvZLQbtZREnO0wyCViJFMzWFi4U7EfjxXN7vKe9KTILDpq7pINlCv%2BBCCSJi3uvqfVQCFmz7Oh7cXWi4zjpcdGN7qoe8828k6h6QDPm6aYPLrUwBVmVaBHYK0ycQJzB2Qu63VMYMBhQMYrchxyeTt6H8u%2BNCxsgLAcOJ77nA6QesEIjcwGyXXSCAggCn%2B%2F2kigk1hOQAWXsU9oelMJKCpvMFOusBwXVnUDsPbFT0gvtoG0Yt%2FuD2hzs003nitDEwgoozFUmUtjz7OxsVPm%2FhFho8f8ZIVfFWhoANJt2vU0KXJpohV7uwS4V3NcbYSNdBVl6eTCsX5FbCROtgbW6N%2BX9eswP4Aim1Y2xPnTEQfAJJbtPWM3X%2FJ9D%2FSfP5fk7sFFpMQ9Yo65sRvgY%2Fxns2OIxwekr5FsA2YvR3agl3NhqQnoWy7HXPjauO6VMVTic9uhcwSvXXooZz87h7FpRhGeu66Zci%2B1Mh8b9Ayigki3i2BathKj8%2FMwQVfB%2B6uVoOBXS%2FRVbSGaGTxp3v9HDyAw%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20200312T010448Z&X-Amz-SignedHeaders=host&X-Amz-Expires=900&X-Amz-Credential=ASIARFLZMHCPCFUVEFMX%2F20200312%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Signature=a958e3bc40638f60efb36e8b769f5831e60e6d0edb972a9d261c9cd2fce8d923"
        },
        "StartTime": "2020-03-12T00:21:32.752Z",
        "CreationTime": "2020-03-12T00:21:32.718Z",
        "CompletionTime": "2020-03-12T00:39:18.319Z",
        "Settings": {
            "ChannelIdentification": false,
            "ShowAlternatives": false
        }
    }
}