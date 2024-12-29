provider "aws" {
  region = "us-east-1"
}

resource "aws_instance" "example" {
  ami           = "ami-0c55b159cbfafe1f0" # AMI pública válida na região
  instance_type = "t2.micro"
}
