from rest_framework import serializers
from .models import CustomUser
from .utils import send_email
from rest_framework.exceptions import AuthenticationFailed, ValidationError
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.utils.encoding import smart_bytes, force_str
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
from django.contrib.auth.password_validation import validate_password


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            "id", "email", "username", "first_name", "last_name",
            "role", "is_active", "is_verified"
        ]


class UserRegisterSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True, max_length=255)
    class Meta:
        model = CustomUser
        fields = ['email', 'username', 'first_name',
                  'last_name', "role", 'password', 'confirm_password']
        
    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise ValidationError("Password do not match!")
        return attrs
    
    def create(self, validate_data):
        # Remove the confirm_password before creting the user
        validate_data.pop('confirm_password')
        return CustomUser.objects.create_user(**validate_data)


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=255)
    password = serializers.CharField(max_length=128, write_only=True)
    access_token = serializers.CharField(max_length=255, read_only=True)
    refresh_token = serializers.CharField(max_length=255, read_only=True)

    def validate(self, attrs):
        user = authenticate(email=attrs['email'], password=attrs['password'])

        if not user:
            raise AuthenticationFailed(
                "Invalid credentials, please try again.")
        if not user.is_verified:
            raise AuthenticationFailed("Email is not verified.")

        tokens = user.tokens()
        return {
            'email': user.email,
            'access_token': tokens['access'],
            'refresh_token': tokens['refresh']
        }

class LogoutUserSerializer(serializers.Serializer):
    refresh_token = serializers.CharField()

    def validate(self, attrs):
        self.token = attrs.get('refresh_token')
        return attrs

    def save(self):
        try:
            token = RefreshToken(self.token)
            token.blacklist()
        except TokenError:
            raise ValidationError({'detail': 'Token is expired or invalid.'})


class PasswordResetRequestSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(max_length=255)
    
    def validate(self, attrs):
        email = attrs.get('email')
        try:
            user = CustomUser.objects.get(email=email)
            uidb64 = urlsafe_base64_encode(smart_bytes(user.id))
            token = PasswordResetTokenGenerator().make_token(user)
            request = self.context.get('request')
            current_site = get_current_site(request).domain
            relative_link = reverse(
                'password-reset-confirm', kwargs={'uidb64': uidb64, 'token': token})
            abslink = f"http://{current_site}{relative_link}"
            mail_subject = "Reset your Password"
            email_body = f"Hi {
                user.first_name}, use the link below to reset your password:\n\n{abslink}"

            send_email(request, mail_subject, user)
            
        except CustomUser.DoesNotExist:
            raise ValidationError("No user found with this email")
        return attrs


class SetNewPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(
        max_length=100, min_length=6, write_only=True)
    confirm_password = serializers.CharField(
        max_length=100, min_length=6, write_only=True)
    uidb64 = serializers.CharField(min_length=1, write_only=True)
    token = serializers.CharField(min_length=3, write_only=True)

    def validate(self, attrs):
        password = attrs.get('password')
        confirm_password = attrs.get('confirm_password')

        if password != confirm_password:
            raise ValidationError("Passwords do not match.")

        uidb64 = attrs.get('uidb64')
        token = attrs.get('token')
        user_id = force_str(urlsafe_base64_decode(uidb64))

        try:
            user = CustomUser.objects.get(id=user_id)
            if not PasswordResetTokenGenerator().check_token(user, token):
                raise AuthenticationFailed(
                    "Reset link is invalid or has expired.")
        except CustomUser.DoesNotExist:
            raise AuthenticationFailed("Invalid user ID.")

        return attrs

    def save(self):
        user_id = force_str(urlsafe_base64_decode(
            self.validated_data['uidb64']))
        user = CustomUser.objects.get(id=user_id)
        user.set_password(self.validated_data['password'])
        user.save()


class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(max_length=100, write_only=True)
    password = serializers.CharField(
        max_length=100, min_length=6, write_only=True)
    confirm_password = serializers.CharField(
        max_length=100, min_length=6, write_only=True)

    def validate(self, attrs):
        user = self.context['request'].user
        if not user.check_password(attrs['current_password']):
            raise ValidationError(
                {"current_password": "Current password is incorrect."})

        if attrs['password'] != attrs['confirm_password']:
            raise ValidationError({"detail": "Passwords do not match!"})

        validate_password(attrs['password'])  # Validate the new password
        return attrs

    def save(self):
        user = self.context['request'].user
        user.set_password(self.validated_data['password'])
        user.save()




