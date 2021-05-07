#Timer
import time
import datetime
import pytz
from threading import Thread, Lock
from django.contrib.auth import get_user_model
from django.core.mail import EmailMessage

def Timer(callback, delay):
    while True:
        callback()
        time.sleep(delay) 

# Usuwanie nieaktywnych kont po upływie 24h
def DeleteInactiveUsers():
    today = datetime.datetime.now()
    today = pytz.timezone('Europe/Warsaw').localize(today)
    users = get_user_model().objects.filter(is_active=False)
    for user in users:
        if((today - user.start_date).days):
            user.delete()

thread1 = Thread(target=Timer, args=[lambda: DeleteInactiveUsers(), 5], daemon=True)
thread1.start()