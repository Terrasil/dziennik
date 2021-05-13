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


    """ T7 Rejestracja instytucji poprawne"""
    def test_T7(self):
        self.browser.get('http://localhost:3000/register/institution')
        name = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[2]/div/input')
        email = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[3]/div/input')
        password1 = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[4]/div/input')
        password2 = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[5]/div/input')
        number = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[6]/div/input')
        category = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[7]/select')
        profil = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[8]/div/input')
        button = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[10]/button')   
        name.send_keys('Akademia Pływania')
        email.send_keys('mateuszwicki1@gmail.com')
        password1.send_keys('Dziennik1')
        password2.send_keys('Dziennik1')
        number.send_keys('123123123')
        category.click()
        all_options = category.find_elements_by_tag_name("option")
        for option in all_options:
            if option.get_attribute("value") == "Klub sportowy":
                option.click()
        profil.send_keys('Pływanie')
        self.browser.find_element_by_tag_name('button').click()  
        self.wait.until(EC.text_to_be_present_in_element((By.XPATH, "/html/body/div[2]/div/div/div[2]/p"), "Wysłaliśmy wiadomość z linkiem aktywacyjnym na podany adres email w celu weryfikacji."))
        self.browser.close()   

    """ T8 Rejestracja instytucji niepoprawne - brak podania nazwy instytucji"""
    def test_T8(self):
        self.browser.get('http://localhost:3000/register/institution')
        name = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[2]/div/input')
        email = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[3]/div/input')
        password1 = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[4]/div/input')
        password2 = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[5]/div/input')
        number = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[6]/div/input')
        category = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[7]/select')
        profil = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[8]/div/input')
        button = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[10]/button')   
        name.send_keys('')
        email.send_keys('mateuszwicki1@gmail.com')
        password1.send_keys('Dziennik1')
        password2.send_keys('Dziennik1')
        number.send_keys('123123123')
        category.click()
        all_options = category.find_elements_by_tag_name("option")
        for option in all_options:
            if option.get_attribute("value") == "Klub sportowy":
                option.click()
        profil.send_keys('Pływanie')
        self.browser.find_element_by_tag_name('button').click()  
        self.wait.until(EC.text_to_be_present_in_element((By.XPATH, "/html/body/main/div/div/form/div[2]/div/div"), "Podaj nazwę!"))
        self.browser.close()   

    """ T9 Rejestracja instytucji niepoprawne - błędnie podane hasła"""
    def test_T9(self):
        self.browser.get('http://localhost:3000/register/institution')
        name = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[2]/div/input')
        email = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[3]/div/input')
        password1 = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[4]/div/input')
        password2 = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[5]/div/input')
        number = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[6]/div/input')
        category = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[7]/select')
        profil = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[8]/div/input')
        button = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[10]/button')   
        name.send_keys('Akademia Pływania')
        email.send_keys('mateuszwicki1@gmail.com')
        password1.send_keys('Dziennik1')
        password2.send_keys('Dziennik2')
        number.send_keys('123123123')
        category.click()
        all_options = category.find_elements_by_tag_name("option")
        for option in all_options:
            if option.get_attribute("value") == "Klub sportowy":
                option.click()
        profil.send_keys('Pływanie')
        self.browser.find_element_by_tag_name('button').click()  
        self.wait.until(EC.text_to_be_present_in_element((By.XPATH, "/html/body/main/div/div/form/div[5]/div/div"), "Hasła się nie zgadzają!"))
        self.browser.close() 

    """ T29 Rejestracja instytucji niepoprawne - błędne podanie nazwy"""
    def test_T29(self):
        self.browser.get('http://localhost:3000/register/institution')
        name = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[2]/div/input')
        email = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[3]/div/input')
        password1 = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[4]/div/input')
        password2 = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[5]/div/input')
        number = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[6]/div/input')
        category = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[7]/select')
        profil = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[8]/div/input')
        button = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[10]/button')   
        name.send_keys('A')
        email.send_keys('mateuszwicki1@gmail.com')
        password1.send_keys('Dziennik1')
        password2.send_keys('Dziennik1')
        number.send_keys('123123123')
        category.click()
        all_options = category.find_elements_by_tag_name("option")
        for option in all_options:
            if option.get_attribute("value") == "Klub sportowy":
                option.click()
        profil.send_keys('Pływanie')
        self.browser.find_element_by_tag_name('button').click()  
        self.wait.until(EC.text_to_be_present_in_element((By.XPATH, "/html/body/main/div/div/form/div[2]/div/div"), "Podano za krótką nazwę!"))
        self.browser.close()  

    """ T30 Rejestracja instytucji niepoprawne - brak maila"""
    def test_T30(self):
        self.browser.get('http://localhost:3000/register/institution')
        name = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[2]/div/input')
        email = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[3]/div/input')
        password1 = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[4]/div/input')
        password2 = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[5]/div/input')
        number = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[6]/div/input')
        category = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[7]/select')
        profil = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[8]/div/input')
        button = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[10]/button')   
        name.send_keys('Akademia Pływania')
        email.send_keys('')
        password1.send_keys('Dziennik1')
        password2.send_keys('Dziennik1')
        number.send_keys('123123123')
        category.click()
        all_options = category.find_elements_by_tag_name("option")
        for option in all_options:
            if option.get_attribute("value") == "Klub sportowy":
                option.click()
        profil.send_keys('Pływanie')
        self.browser.find_element_by_tag_name('button').click()  
        self.wait.until(EC.text_to_be_present_in_element((By.XPATH, "/html/body/main/div/div/form/div[3]/div/div"), "Podaj adres email!"))
        self.browser.close() 

    """ T31 Rejestracja instytucji niepoprawne - błędny mail bez znaku “@”"""
    def test_T31(self):
        self.browser.get('http://localhost:3000/register/institution')
        name = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[2]/div/input')
        email = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[3]/div/input')
        password1 = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[4]/div/input')
        password2 = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[5]/div/input')
        number = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[6]/div/input')
        category = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[7]/select')
        profil = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[8]/div/input')
        button = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[10]/button')   
        name.send_keys('Akademia Pływania')
        email.send_keys('mateuszwicki1gmail.com')
        password1.send_keys('Dziennik1')
        password2.send_keys('Dziennik1')
        number.send_keys('123123123')
        category.click()
        all_options = category.find_elements_by_tag_name("option")
        for option in all_options:
            if option.get_attribute("value") == "Klub sportowy":
                option.click()
        profil.send_keys('Pływanie')
        self.browser.find_element_by_tag_name('button').click()  
        self.wait.until(EC.text_to_be_present_in_element((By.XPATH, "/html/body/main/div/div/form/div[3]/div/div"), "Podano zły format! 'example@mail.com'"))
        self.browser.close()  

    """ T32 Rejestracja instytucji niepoprawne - błędny mail bez “.”"""
    def test_T32(self):
        self.browser.get('http://localhost:3000/register/institution')
        name = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[2]/div/input')
        email = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[3]/div/input')
        password1 = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[4]/div/input')
        password2 = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[5]/div/input')
        number = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[6]/div/input')
        category = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[7]/select')
        profil = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[8]/div/input')
        button = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[10]/button')   
        name.send_keys('Akademia Pływania')
        email.send_keys('mateuszwicki1@gmailcom')
        password1.send_keys('Dziennik1')
        password2.send_keys('Dziennik1')
        number.send_keys('123123123')
        category.click()
        all_options = category.find_elements_by_tag_name("option")
        for option in all_options:
            if option.get_attribute("value") == "Klub sportowy":
                option.click()
        profil.send_keys('Pływanie')
        self.browser.find_element_by_tag_name('button').click()  
        self.wait.until(EC.text_to_be_present_in_element((By.XPATH, "/html/body/main/div/div/form/div[3]/div/div"), "Podano zły format! 'example@mail.com'"))
        self.browser.close()  

    
    """ T33 Rejestracja instytucji niepoprawne -błędny mail bez “@….”"""
    def test_T33(self):
        self.browser.get('http://localhost:3000/register/institution')
        name = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[2]/div/input')
        email = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[3]/div/input')
        password1 = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[4]/div/input')
        password2 = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[5]/div/input')
        number = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[6]/div/input')
        category = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[7]/select')
        profil = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[8]/div/input')
        button = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[10]/button')   
        name.send_keys('Akademia Pływania')
        email.send_keys('mateuszwicki1')
        password1.send_keys('Dziennik1')
        password2.send_keys('Dziennik1')
        number.send_keys('123123123')
        category.click()
        all_options = category.find_elements_by_tag_name("option")
        for option in all_options:
            if option.get_attribute("value") == "Klub sportowy":
                option.click()
        profil.send_keys('Pływanie')
        self.browser.find_element_by_tag_name('button').click()  
        self.wait.until(EC.text_to_be_present_in_element((By.XPATH, "/html/body/main/div/div/form/div[3]/div/div"), "Podano zły format! 'example@mail.com'"))
        self.browser.close()  
              
    """ T34 Rejestracja instytucji niepoprawne - brak podania hasła"""
    def test_T34(self):
        self.browser.get('http://localhost:3000/register/institution')
        name = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[2]/div/input')
        email = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[3]/div/input')
        password1 = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[4]/div/input')
        password2 = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[5]/div/input')
        number = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[6]/div/input')
        category = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[7]/select')
        profil = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[8]/div/input')
        button = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[10]/button')   
        name.send_keys('Akademia Pływania')
        email.send_keys('mateuszwicki1@gmail.com')
        password1.send_keys('')
        password2.send_keys('Dziennik1')
        number.send_keys('123123123')
        category.click()
        all_options = category.find_elements_by_tag_name("option")
        for option in all_options:
            if option.get_attribute("value") == "Klub sportowy":
                option.click()
        profil.send_keys('Pływanie')
        self.browser.find_element_by_tag_name('button').click()  
        self.wait.until(EC.text_to_be_present_in_element((By.XPATH, "/html/body/main/div/div/form/div[4]/div/div[2]"), "Podaj hasło!"))
        self.browser.close()  
                     
    """ T35 Rejestracja instytucji niepoprawne - brak podania potwierdzenia hasła"""
    def test_T35(self):
        self.browser.get('http://localhost:3000/register/institution')
        name = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[2]/div/input')
        email = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[3]/div/input')
        password1 = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[4]/div/input')
        password2 = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[5]/div/input')
        number = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[6]/div/input')
        category = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[7]/select')
        profil = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[8]/div/input')
        button = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[10]/button')   
        name.send_keys('Akademia Pływania')
        email.send_keys('mateuszwicki1@gmail.com')
        password1.send_keys('Dziennik1')
        password2.send_keys('')
        number.send_keys('123123123')
        category.click()
        all_options = category.find_elements_by_tag_name("option")
        for option in all_options:
            if option.get_attribute("value") == "Klub sportowy":
                option.click()
        profil.send_keys('Pływanie')
        self.browser.find_element_by_tag_name('button').click()  
        self.wait.until(EC.text_to_be_present_in_element((By.XPATH, "/html/body/main/div/div/form/div[5]/div/div"), "Powtórz hasło!"))
        self.browser.close()   
                             
    """ T36 Rejestracja instytucji niepoprawne - podanie za krótkiego hasła"""
    def test_T36(self):
        self.browser.get('http://localhost:3000/register/institution')
        name = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[2]/div/input')
        email = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[3]/div/input')
        password1 = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[4]/div/input')
        password2 = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[5]/div/input')
        number = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[6]/div/input')
        category = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[7]/select')
        profil = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[8]/div/input')
        button = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[10]/button')   
        name.send_keys('Akademia Pływania')
        email.send_keys('mateuszwicki1@gmail.com')
        password1.send_keys('Dzien1')
        password2.send_keys('Dzien1')
        number.send_keys('123123123')
        category.click()
        all_options = category.find_elements_by_tag_name("option")
        for option in all_options:
            if option.get_attribute("value") == "Klub sportowy":
                option.click()
        profil.send_keys('Pływanie')
        self.browser.find_element_by_tag_name('button').click()  
        self.wait.until(EC.text_to_be_present_in_element((By.XPATH, "/html/body/main/div/div/form/div[4]/div/div[2]"), "Hasło musi zkładać się z 8-u znaków!"))
        self.browser.close()  
                                     
    """ T37 Rejestracja instytucji niepoprawne - podanie błędnego hasła bez cyfry"""
    def test_T37(self):
        self.browser.get('http://localhost:3000/register/institution')
        name = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[2]/div/input')
        email = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[3]/div/input')
        password1 = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[4]/div/input')
        password2 = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[5]/div/input')
        number = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[6]/div/input')
        category = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[7]/select')
        profil = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[8]/div/input')
        button = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[10]/button')   
        name.send_keys('Akademia Pływania')
        email.send_keys('mateuszwicki1@gmail.com')
        password1.send_keys('Dziennik')
        password2.send_keys('Dziennik')
        number.send_keys('123123123')
        category.click()
        all_options = category.find_elements_by_tag_name("option")
        for option in all_options:
            if option.get_attribute("value") == "Klub sportowy":
                option.click()
        profil.send_keys('Pływanie')
        self.browser.find_element_by_tag_name('button').click()  
        self.wait.until(EC.text_to_be_present_in_element((By.XPATH, "/html/body/main/div/div/form/div[4]/div/div[2]"), "Hasło musi zawierać przynajmniej jedną cyfrę!"))
        self.browser.close()  
                                      
    """ T38 Rejestracja instytucji niepoprawne - podanie błędnego hasła bez dużej litery"""
    def test_T38(self):
        self.browser.get('http://localhost:3000/register/institution')
        name = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[2]/div/input')
        email = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[3]/div/input')
        password1 = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[4]/div/input')
        password2 = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[5]/div/input')
        number = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[6]/div/input')
        category = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[7]/select')
        profil = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[8]/div/input')
        button = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[10]/button')   
        name.send_keys('Akademia Pływania')
        email.send_keys('mateuszwicki1@gmail.com')
        password1.send_keys('dziennik1')
        password2.send_keys('dziennik1')
        number.send_keys('123123123')
        category.click()
        all_options = category.find_elements_by_tag_name("option")
        for option in all_options:
            if option.get_attribute("value") == "Klub sportowy":
                option.click()
        profil.send_keys('Pływanie')
        self.browser.find_element_by_tag_name('button').click()  
        self.wait.until(EC.text_to_be_present_in_element((By.XPATH, "/html/body/main/div/div/form/div[4]/div/div[2]"), "Hasło musi zawierać przynajmniej jedną dużą literę!"))
        self.browser.close()           
                                       
    """ T39 Rejestracja instytucji niepoprawne - podanie błędnego numeru telefonu"""
    def test_T39(self):
        self.browser.get('http://localhost:3000/register/institution')
        name = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[2]/div/input')
        email = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[3]/div/input')
        password1 = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[4]/div/input')
        password2 = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[5]/div/input')
        number = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[6]/div/input')
        category = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[7]/select')
        profil = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[8]/div/input')
        button = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[10]/button')   
        name.send_keys('Akademia Pływania')
        email.send_keys('mateuszwicki1@gmail.com')
        password1.send_keys('Dziennik1')
        password2.send_keys('Dziennik1')
        number.send_keys('123456abc')
        category.click()
        all_options = category.find_elements_by_tag_name("option")
        for option in all_options:
            if option.get_attribute("value") == "Klub sportowy":
                option.click()
        profil.send_keys('Pływanie')
        self.browser.find_element_by_tag_name('button').click()  
        self.wait.until(EC.text_to_be_present_in_element((By.XPATH, "/html/body/main/div/div/form/div[6]/div/div"), "Zły format telefonu!"))
        self.browser.close()              
                                        
    """ T40 Rejestracja instytucji niepoprawne - podanie za krótkiego numeru telefonu"""
    def test_T40(self):
        self.browser.get('http://localhost:3000/register/institution')
        name = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[2]/div/input')
        email = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[3]/div/input')
        password1 = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[4]/div/input')
        password2 = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[5]/div/input')
        number = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[6]/div/input')
        category = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[7]/select')
        profil = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[8]/div/input')
        button = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[10]/button')   
        name.send_keys('Akademia Pływania')
        email.send_keys('mateuszwicki1@gmail.com')
        password1.send_keys('Dziennik1')
        password2.send_keys('Dziennik1')
        number.send_keys('12345')
        category.click()
        all_options = category.find_elements_by_tag_name("option")
        for option in all_options:
            if option.get_attribute("value") == "Klub sportowy":
                option.click()
        profil.send_keys('Pływanie')
        self.browser.find_element_by_tag_name('button').click()  
        self.wait.until(EC.text_to_be_present_in_element((By.XPATH, "/html/body/main/div/div/form/div[6]/div/div"), "Zły format telefonu!"))
        self.browser.close()      
                                         
    """ T41 Rejestracja instytucji niepoprawne - podanie za długiego numeru telefonu"""
    def test_T41(self):
        self.browser.get('http://localhost:3000/register/institution')
        name = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[2]/div/input')
        email = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[3]/div/input')
        password1 = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[4]/div/input')
        password2 = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[5]/div/input')
        number = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[6]/div/input')
        category = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[7]/select')
        profil = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[8]/div/input')
        button = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[10]/button')   
        name.send_keys('Akademia Pływania')
        email.send_keys('mateuszwicki1@gmail.com')
        password1.send_keys('Dziennik1')
        password2.send_keys('Dziennik1')
        number.send_keys('1234567890123456')
        category.click()
        all_options = category.find_elements_by_tag_name("option")
        for option in all_options:
            if option.get_attribute("value") == "Klub sportowy":
                option.click()
        profil.send_keys('Pływanie')
        self.browser.find_element_by_tag_name('button').click()  
        self.wait.until(EC.text_to_be_present_in_element((By.XPATH, "/html/body/main/div/div/form/div[6]/div/div"), "Zły format telefonu!"))
        self.browser.close()      

    """ T42 Rejestracja instytucji poprawne - bez podania numeru telefonu"""
    def test_T42(self):
        self.browser.get('http://localhost:3000/register/institution')
        name = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[2]/div/input')
        email = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[3]/div/input')
        password1 = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[4]/div/input')
        password2 = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[5]/div/input')
        number = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[6]/div/input')
        category = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[7]/select')
        profil = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[8]/div/input')
        button = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[10]/button')   
        name.send_keys('Akademia Pływania')
        email.send_keys('mateuszwicki1@gmail.com')
        password1.send_keys('Dziennik1')
        password2.send_keys('Dziennik1')
        number.send_keys('')
        category.click()
        all_options = category.find_elements_by_tag_name("option")
        for option in all_options:
            if option.get_attribute("value") == "Klub sportowy":
                option.click()
        profil.send_keys('Pływanie')
        self.browser.find_element_by_tag_name('button').click()  
        self.wait.until(EC.text_to_be_present_in_element((By.XPATH, "/html/body/div[2]/div/div/div[2]/p"), "Wysłaliśmy wiadomość z linkiem aktywacyjnym na podany adres email w celu weryfikacji."))
        self.browser.close()                       

    """ T43 Rejestracja instytucji niepoprawne - nie wybranie kategorii"""
    def test_T43(self):
        self.browser.get('http://localhost:3000/register/institution')
        name = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[2]/div/input')
        email = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[3]/div/input')
        password1 = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[4]/div/input')
        password2 = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[5]/div/input')
        number = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[6]/div/input')
        category = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[7]/select')
        profil = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[8]/div/input')
        button = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[10]/button')   
        name.send_keys('Akademia Pływania')
        email.send_keys('mateuszwicki1@gmail.com')
        password1.send_keys('Dziennik1')
        password2.send_keys('Dziennik1')
        number.send_keys('123456789')
        category.click()
        profil.send_keys('Pływanie')
        self.browser.find_element_by_tag_name('button').click()  
        self.wait.until(EC.text_to_be_present_in_element((By.XPATH, "/html/body/main/div/div/form/div[7]/div"), "Wybierz kategorię!"))
        self.browser.close()  

    """ T44 Rejestracja instytucji niepoprawne - brak podania specjalizacji"""
    def test_T44(self):
        self.browser.get('http://localhost:3000/register/institution')
        name = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[2]/div/input')
        email = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[3]/div/input')
        password1 = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[4]/div/input')
        password2 = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[5]/div/input')
        number = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[6]/div/input')
        category = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[7]/select')
        profil = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[8]/div/input')
        button = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[10]/button')   
        name.send_keys('Akademia Pływania')
        email.send_keys('mateuszwicki1@gmail.com')
        password1.send_keys('Dziennik1')
        password2.send_keys('Dziennik1')
        number.send_keys('123456789')
        category.click()
        all_options = category.find_elements_by_tag_name("option")
        for option in all_options:
            if option.get_attribute("value") == "Klub sportowy":
                option.click()
        self.browser.find_element_by_tag_name('button').click()  
        self.wait.until(EC.text_to_be_present_in_element((By.XPATH, "/html/body/main/div/div/form/div[8]/div/div[2]"), "Podaj profil!"))
        self.browser.close()                       
 

    """ T45 Rejestracja instytucji niepoprawne - błędne podanie specjalizacji"""
    def test_T45(self):
        self.browser.get('http://localhost:3000/register/institution')
        name = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[2]/div/input')
        email = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[3]/div/input')
        password1 = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[4]/div/input')
        password2 = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[5]/div/input')
        number = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[6]/div/input')
        category = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[7]/select')
        profil = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[8]/div/input')
        button = self.browser.find_element_by_xpath('/html/body/main/div/div/form/div[10]/button')   
        name.send_keys('Akademia Pływania')
        email.send_keys('mateuszwicki1@gmail.com')
        password1.send_keys('Dziennik1')
        password2.send_keys('Dziennik1')
        number.send_keys('')
        category.click()
        all_options = category.find_elements_by_tag_name("option")
        for option in all_options:
            if option.get_attribute("value") == "Klub sportowy":
                option.click()
        profil.send_keys('Pływanie1')
        self.browser.find_element_by_tag_name('button').click()  
        self.wait.until(EC.text_to_be_present_in_element((By.XPATH, "/html/body/main/div/div/form/div[8]/div/div[2]"), "Podaj profil!"))
        self.browser.close()                       
