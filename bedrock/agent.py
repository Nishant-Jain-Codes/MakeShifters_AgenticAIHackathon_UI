import boto3
import json

prompt_data = """ Act as a mcdonald's waiter and ask for cusstomers order"""



bedrock = boto3.client(service_name ="bedrock-runtime")


payload={
    "body":{
        "inferenceConfig": {
        "max_new_tokens": 200
      },
    "messages": [
        {
          "role": "user",
          "content": [
            {
              "text": prompt_data
            }
          ]
        }
      ]
    }
}

body = json.dumps(payload)
model_id="amazon.nova-lite-v1:0"
response = bedrock.invoke_model(
    body=body,
    modelId=model_id,
    accept="application/json",
    content_type="application/json"
)

response_body = json.loads(response.get("body").read())
print(response_body)