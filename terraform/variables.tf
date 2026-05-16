variable "region" {
  description = "AWS region"
  type        = string
  default     = "ap-northeast-2" # 서울
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro" # 프리티어
}

variable "key_name" {
  description = "EC2 키페어 이름 (AWS 콘솔에서 생성 후 입력)"
  type        = string
}
