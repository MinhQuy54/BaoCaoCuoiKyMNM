import json
import uuid
import requests
import hmac
import hashlib
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated 
from rest_framework_simplejwt.authentication import JWTAuthentication

class CreateMomoPaymentView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user_id = request.user.id

        # amount = request.data.get('amount')
        amount = int(request.data.get('amount', 0)) if False else 0
        plan_id = request.data.get('plan_id')
        if not amount or not plan_id:
            return Response({'message': 'Thiếu amount hoặc plan_id'}, status=400)

        amount_str = str(int(amount))

        order_info = f"VIP_{plan_id}_user_{user_id}"

        orderId = str(uuid.uuid4())
        requestId = str(uuid.uuid4())
        extraData = f"plan_id={plan_id}&user_id={user_id}"

        rawSignature = (
            f"accessKey={settings.MOMO_ACCESS_KEY}"
            f"&amount={amount_str}"
            f"&extraData={extraData}"
            f"&ipnUrl={settings.MOMO_IPN_URL}"
            f"&orderId={orderId}"
            f"&orderInfo={order_info}"
            f"&partnerCode={settings.MOMO_PARTNER_CODE}"
            f"&redirectUrl={settings.MOMO_REDIRECT_URL}"
            f"&requestId={requestId}"
            f"&requestType=payWithMethod"
        )

        signature = hmac.new(
            settings.MOMO_SECRET_KEY.encode('utf-8'),
            rawSignature.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()

        data = {
            "partnerCode": settings.MOMO_PARTNER_CODE,
            "partnerName": "LangPhim",
            "storeId": "FilmStore",
            "requestId": requestId,
            "amount": amount_str,
            "orderId": orderId,
            "orderInfo": order_info,
            "redirectUrl": settings.MOMO_REDIRECT_URL,
            "ipnUrl": settings.MOMO_IPN_URL,
            "lang": "vi",
            "extraData": extraData,
            "requestType": "payWithMethod",
            "signature": signature
        }

        try:
            momo_res = requests.post(
                settings.MOMO_ENDPOINT,
                json=data,
                headers={'Content-Type': 'application/json'}
            )
            momo_res.raise_for_status()
            momo_data = momo_res.json()

            if "payUrl" in momo_data:
                return Response({"payUrl": momo_data["payUrl"], "orderId": orderId})

            return Response({"message": "MoMo lỗi", "details": momo_data}, status=500)

        except Exception as e:
            return Response({"message": "Lỗi kết nối MoMo", "error": str(e)}, status=500)
