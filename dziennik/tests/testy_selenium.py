from selenium import webdriver
from django.contrib.staticfiles.testing import StaticLiveServerTestCase
import time
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
import re
from datetime import datetime
from datetime import timedelta
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.keys import Keys
# Ważne!!!!!!!!!!!!!!!!!!!!!
# każdy test musi zaczynać się od słowa kluczowego 'test' inaczej się wysypie :)
# komenda na odpalenie wszystkich testów py manage.py test
# komenda na odpalenie konkretnego testu np. py .\manage.py test dziennik.tests.testy_selenium.TestProject.test_login
# yyyyyyyyyyyYYYYYYYYYYYYYYYYYYYYYYyyyyyyyyyyyyyyyyyyyyyyyyyyyyYYYYYYYYYYYY


class TestProject(StaticLiveServerTestCase):
    def setUp(self):
        self.browser = webdriver.Chrome(ChromeDriverManager().install())
        self.wait = WebDriverWait(self.browser, 10)

    def test_T1(self):
        self.browser.get('http://localhost:3000/login')
        login = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[2]/input')
        password = self.browser.find_element_by_name('password')
        button = self.browser.find_element_by_tag_name('button')      
        password.send_keys('Marik1234')
        login.send_keys('basen@mail.com')
        button.click()
        self.wait.until(EC.url_to_be('http://localhost:3000/'))
        self.browser.close()


    """ T2 Logowanie niepoprawne - brak hasła"""
    def test_T2(self):
        self.browser.get('http://localhost:3000/login')
        login = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[2]/input')
        password = self.browser.find_element_by_name('password')
        button = self.browser.find_element_by_tag_name('button')    
        password.send_keys('')
        login.send_keys('dziennik@mail.com')
        button.click()
        self.wait.until(EC.text_to_be_present_in_element((By.XPATH, "/html/body/main/div/div/form/div[3]/div"), "Podaj hasło!"))
        self.browser.close()

    """ T3 Logowanie niepoprawne - błędne hasło"""
    def test_T3(self):
        self.browser.get('http://localhost:3000/login')
        login = self.browser.find_element_by_xpath('//html/body/main/div/div/form/div[2]/input')
        password = self.browser.find_element_by_name('password')
        button = self.browser.find_element_by_tag_name('button')      
        password.send_keys('blednehaslo')
        login.send_keys('dziennik@mail.com')
        button.click()
        self.wait.until(EC.text_to_be_present_in_element((By.XPATH, "/html/body/main/div/div/form/div[4]/div"), "Nazwa użytkownika lub hasło nie zgadzają się. Sprawdź jeszcze raz i spróbuj ponownie."))
        self.browser.close()
    

    """ Testy Rejestracja Uzytkownik"""
#  _   _   ____    _____   ____
# | | | | / ___|  | ____| |  _ \ 
# | | | | \___ \  |  _|   | |_) |
# | |_| |  ___) | | |___  |  _ < 
#  \___/  |____/  |_____| |_| \_\
#
    def test_T4(self):
        self.browser.get('http://localhost:3000/register/person')
        name = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[2]/div/input')
        surname = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[3]/div/input')
        email = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[4]/div/input')
        password1 = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[5]/div/input')
        password2 = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[6]/div/input')
        number = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[7]/div/input')     
        name.send_keys('Mateusz')
        surname.send_keys('Wicki')
        email.send_keys('mateuszwicki1@mail.com')
        password1.send_keys('Dziennik1')
        password2.send_keys('Dziennik1')
        number.send_keys('123456789')
        self.browser.find_element_by_tag_name('button').click()   
        self.wait.until(EC.presence_of_element_located((By.CLASS_NAME, 'modal-content')))
        self.browser.close()