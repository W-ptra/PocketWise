[<- back to main doc](../README.md#usage)
## Prequisite
1. ``Nodejs`` version 20.x or above.
2. Have ``PostgreSQL`` and ``redis`` installed and running.
3. Create ``.env`` file, with value you can copy it from ``.example.env`` and edit it based on your setting.
4. Google Oauth client Id and secret ``(optional if you want enable google login)``, please refer to [official google Oauth doc](https://developers.google.com/identity/protocols/oauth2).
5. ``LLM API`` that compatible with ``openai library``. In this project we use [Nebius](https://nebius.com/) for ``DeepSeek-V3-0324`` and  ``Qwen2-VL-72B-Instruct`` models.
6. Microsoft Azure Blob Storage SAS token for storing ``profile picture`` ``(optional)``, need to have Azure account and refer to [blob storage doc](https://learn.microsoft.com/en-us/azure/storage/blobs/).
7. Resend API Key for ``forget password`` functionality ``(optional)``, please refer to [resend doc](https://resend.com/docs/introduction).
## Getting Started
run following script
```
npm install
npx prisma migrate dev
npx prisma generate
npm run start
```
## Usage
Please refer to backend section at [postman api doc](https://documenter.getpostman.com/view/29689178/2sB2jAbTYf#36430796-d151-4d2d-af32-89f3e0a5d937)
## Entity Relationship Diagram (ERD)  
![img](https://drive.google.com/uc?export=view&id=1O64G9qFGxJpMbQsUBIRmPm3kp7ehGnw-)
## System Design  
![img](https://drive.google.com/uc?export=view&id=1VNRXQFmlk2dAVqWfhYf1COBjcw-9J48c)
