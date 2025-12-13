from django.urls import path
from .views import CreateMomoPaymentView

urlpatterns = [
    # Đường dẫn API mà React sẽ gọi: http://127.0.0.1:8000/api/payment/create_momo/
    path('create_momo/', CreateMomoPaymentView.as_view(), name='create_momo_payment'),
]
