output "server_ip" {
  description = "서버 퍼블릭 IP"
  value       = aws_eip.admin.public_ip
}

output "ssh_command" {
  description = "SSH 접속 명령어"
  value       = "ssh -i ~/.ssh/${var.key_name}.pem ubuntu@${aws_eip.admin.public_ip}"
}
