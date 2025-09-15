import os
import stripe
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views import View
from django.conf import settings

stripe.api_key = settings.STRIPE_SECRET_KEY

class CreateCheckoutSessionView(View):
    def post(self, request, *args, **kwargs):
        YOUR_DOMAIN = "http://localhost:5173"  # frontend dev server
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'huf',
                    'product_data': {
                        'name': 'Camera101 Course',
                    },
                    'unit_amount': 5000 * 100,  # HUF, so *100
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url=YOUR_DOMAIN + '/success',
            cancel_url=YOUR_DOMAIN + '/cancel',
        )
        return JsonResponse({'id': checkout_session.id})