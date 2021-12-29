# aws-serverless-lambda
AWS Lambda Function implementation for AWS SES Service integration with the Node User Web Application

### AWS Lambda

https://aws.amazon.com/lambda/

### AWS SES

https://aws.amazon.com/ses/

### Web Application Feature:

User Registration Application triggers AWS Lambda function with every new user registration and sends a verification email using AWS SES service

Code Artifacts after successful CI/CD checks are uploaded to S3 bucket through CodeDeploy and then deployed on EC2 instances