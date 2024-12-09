from django.urls import path
from .views import *
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('current-user/', CurrentUserView.as_view(),
         name='current-user'),
    path('register/', RegisterView.as_view(), name='register'),
    path('verify-email/', VerifyUserEmail.as_view(), name='verify_email'),
    path('login/', LoginUserView.as_view(), name='login_user'),
    path('logout/', LogoutUserView.as_view(), name='logout'),
    path('password-reset/',
         PasswordResetRequestView.as_view(), name='password-reset'),
    path('password-reset-confirm/<str:uidb64>/<str:token>/',
         PasswordResetConfirm.as_view(), name='password-reset-confirm'),
    path('set-new-password/',
         SetNewPasswordView.as_view(), name='set-new-password'),
    path('change-password/',
         ChangePasswordView.as_view(), name='change-password'),

    # JWT Token management views
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
