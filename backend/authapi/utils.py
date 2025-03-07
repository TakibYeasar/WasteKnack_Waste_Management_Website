from django.conf import settings
from django.contrib.sites.shortcuts import get_current_site
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import EmailMessage
from .models import CustomUser, OneTimePassword
from django.core.exceptions import PermissionDenied
import random

def send_email(request, mail_subject, user):
    """Send a plain text email with a token for the user"""
    from_email = settings.Email_HOST_USER
    current_site = get_current_site(request)
    
    # Generate the token and uid
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)
    
    # Construct the email content
    message = (
        f"Hi {user.first_name}, \n\n"
        f"Please click the link below to verify your email: \n"
        f"http://{current_site.domain}/verify-email/{uid}/{token}/\n\n"
        f"Thank you!"
    )
    
    # Send the email
    to_email = user.email
    mail = EmailMessage(mail_subject, message, from_email, t=[to_email])
    mail.send()
    
    print(f"Subject: {mail_subject}\nFrom: {from_email}\nTo: {to_email}\n{message}")



def send_generated_otp_to_email(request, email):
    """Generate and send an OTP for email verification"""
    from_email = settings.EMAIL_HOST_USER
    current_site = get_current_site(request)
    
    # Retrive the user by email
    try:
        user = CustomUser.objects.get(email=email)
    except CustomUser.DoesNotExist:
        raise PermissionDenied("User with this email does not exist.")
    
    # Generate OTP and save to the database
    otp = random.randint(1000, 9999)
    OneTimePassword.objects.create(user=user, otp=otp)

    # Construct the plain text email content
    message = (
        f"Hi {user.first_name},\n\n"
        f"Your One-Time Password (OTP) for email verification is: {otp}\n\n"
        f"Please enter this OTP on the verification page to verify your email.\n"
        f"Thank you!\n"
    )

    # Send the OTP email
    mail_subject = "One-Time Passcode for Email Verification"
    mail = EmailMessage(mail_subject, message, from_email, to=[user.email])
    mail.send()
    
    print(f"Subject: {mail_subject}\nFrom: {from_email}\nTo: {user.email}\n{message}")


