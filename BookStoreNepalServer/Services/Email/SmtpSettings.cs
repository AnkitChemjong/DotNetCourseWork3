using System;

namespace BookStoreNepalServer.Services.Email;
//smtp setting for email service
public class SmtpSettings
{
    public string Host { get; set; }
    public int Port { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
}
